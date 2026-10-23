import crypto from 'crypto';
import dns from 'dns';
import { Database, rawFetches, eq, sql, and } from '@floww/db';

const MAX_SCANS_PER_IP_24H = 3;
const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

const DISPOSABLE_OR_FAKE_EMAIL_DOMAINS = new Set([
  'mailinator.com',
  '10minutemail.com',
  'guerrillamail.com',
  'tempmail.com',
  'temp-mail.org',
  'yopmail.com',
  'trashmail.com',
  'sharklasers.com',
  'getnada.com',
  'maildrop.cc',
  'dispostable.com',
  'fakeinbox.com',
  'throwawaymail.com',
  'test.no',
  'test.com',
  'example.com',
  'example.no',
  'example.org',
  'asdf.no',
  'asdf.com',
  'qwerty.no',
  'qwerty.com',
  'invalid.no',
  'invalid.com',
]);

/**
 * Computes a GDPR-compliant salted SHA-256 hash of a client IP address.
 * Raw IP addresses are never stored in the database.
 */
export function computeIpHash(ip: string): string {
  const cleanIp = (ip || 'unknown').trim().toLowerCase();
  const salt =
    process.env.ADMIN_PASSWORD ||
    process.env.ADMIN_SECRET ||
    'floww-ip-salt-2026';
  return crypto
    .createHash('sha256')
    .update(`floww-ratelimit:${cleanIp}:${salt}`)
    .digest('hex');
}

/**
 * Extracts the client IP from Next.js request headers.
 */
export function getClientIpFromHeaders(headers: Headers): string {
  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip')?.trim() ||
    'unknown'
  );
}

/**
 * Serverless-safe 24-hour IP rate limit check backed by Supabase PostgreSQL (`raw_fetches`).
 * Max 3 audits per IP per 24 hours.
 */
export async function checkPostgresIpRateLimit(
  db: Database,
  ipHash: string
): Promise<{ allowed: boolean; count: number; limit: number }> {
  try {
    const since = new Date(Date.now() - TWENTY_FOUR_HOURS_MS);
    const recentRateRows = await db
      .select({
        payload: rawFetches.payload,
      })
      .from(rawFetches)
      .where(
        and(
          eq(rawFetches.module, 'rate_limit'),
          sql`${rawFetches.fetchedAt} >= ${since.toISOString()}`
        )
      );

    const matchingCount = recentRateRows.filter((row) => {
      const p = (row.payload ?? {}) as { ipHash?: string };
      return p.ipHash === ipHash;
    }).length;

    return {
      allowed: matchingCount < MAX_SCANS_PER_IP_24H,
      count: matchingCount,
      limit: MAX_SCANS_PER_IP_24H,
    };
  } catch (err) {
    console.warn('⚠️ [RateLimit] Postgres check failed, failing open:', err);
    return { allowed: true, count: 0, limit: MAX_SCANS_PER_IP_24H };
  }
}

/**
 * Records a consumed audit token for an IP hash in PostgreSQL (`raw_fetches`).
 * Called only after pre-flight & NACE checks pass and an audit is triggered.
 */
export async function recordPostgresIpRateLimit(
  db: Database,
  jobId: string,
  ipHash: string
): Promise<void> {
  try {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 7 * TWENTY_FOUR_HOURS_MS);
    await db
      .insert(rawFetches)
      .values({
        jobId,
        module: 'rate_limit',
        payload: {
          ipHash,
          recordedAt: now.toISOString(),
        },
        fetchedAt: now,
        expiresAt,
      })
      .onConflictDoUpdate({
        target: [rawFetches.jobId, rawFetches.module],
        set: {
          payload: {
            ipHash,
            recordedAt: now.toISOString(),
          },
          fetchedAt: now,
          expiresAt,
        },
      });
  } catch (err) {
    console.warn('⚠️ [RateLimit] Could not record IP rate limit in DB:', err);
  }
}

/**
 * Validates an email address with syntax checks, disposable-domain blocking,
 * and a fast DNS MX (or fallback A) record lookup to prevent fake email gate bypasses.
 */
export async function validateBusinessEmailWithMx(rawEmail: string): Promise<{
  valid: boolean;
  cleanEmail: string;
  error?: string;
}> {
  const cleanEmail = (rawEmail || '').trim().toLowerCase();

  const emailRegex = /^[^\s@]+@([^\s@]+\.[a-z]{2,63})$/i;
  const match = cleanEmail.match(emailRegex);
  if (!match) {
    return {
      valid: false,
      cleanEmail,
      error: 'Vennligst oppgi en gyldig e-postadresse (f.eks. navn@bedrift.no).',
    };
  }

  const emailDomain = match[1].toLowerCase();
  const localPart = cleanEmail.split('@')[0] || '';

  if (
    DISPOSABLE_OR_FAKE_EMAIL_DOMAINS.has(emailDomain) ||
    localPart === 'asdf' ||
    localPart === 'test1234'
  ) {
    return {
      valid: false,
      cleanEmail,
      error:
        'Vennligst bruk din reelle jobb-e-postadresse så vi kan sende rapportlenken.',
    };
  }

  // Verify MX records (or fallback A record per RFC 5321) with a 2.5s timeout
  try {
    const hasMailServer = await Promise.race([
      (async () => {
        try {
          const mxRecords = await dns.promises.resolveMx(emailDomain);
          if (Array.isArray(mxRecords) && mxRecords.length > 0) {
            return true;
          }
        } catch {
          // Fallback to A record check
        }
        try {
          const aRecords = await dns.promises.resolve4(emailDomain);
          return Array.isArray(aRecords) && aRecords.length > 0;
        } catch {
          return false;
        }
      })(),
      new Promise<boolean>((resolve) => setTimeout(() => resolve(true), 2500)),
    ]);

    if (!hasMailServer) {
      return {
        valid: false,
        cleanEmail,
        error:
          'Vi finner ingen e-postserver på dette domenet. Sjekk at e-postadressen er stavet riktig.',
      };
    }
  } catch {
    // On unexpected DNS resolver error, fail open
  }

  return {
    valid: true,
    cleanEmail,
  };
}
