import { NextRequest, NextResponse } from 'next/server';
import {
  getDb,
  businesses,
  auditJobs,
  reports,
  rawFetches,
  createBoss,
  enqueueAuditJob,
  eq,
  desc,
} from '@floww/db';
import {
  normalizeDomain,
  runFullAudit,
  runPreFlightAndBrregResolve,
  DEAD_DOMAIN_USER_MESSAGE,
} from '@floww/audit';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import {
  computeIpHash,
  getClientIpFromHeaders,
  checkPostgresIpRateLimit,
} from '@/lib/scanner-security';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

interface StartAuditRequestBody {
  domain?: string;
  useFixtures?: boolean;
  inline?: boolean;
  force?: boolean;
  skipGate?: boolean;
}

const FOURTEEN_DAYS_MS = 14 * 24 * 60 * 60 * 1000; // 14 days domain cache

const VALID_PUBLIC_DOMAIN_REGEX =
  /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$/;

function isValidPublicDomain(rawInput: string, normalized: string): boolean {
  if (!normalized || normalized.length > 253) return false;

  // Reject if raw input contains port numbers, credentials, or IPv6 brackets after protocol strip
  const strippedProtocol = rawInput.trim().replace(/^https?:\/\//i, '');
  const hostCandidate = strippedProtocol.split('/')[0] || '';
  if (
    hostCandidate.includes(':') ||
    hostCandidate.includes('@') ||
    hostCandidate.includes('[')
  ) {
    return false;
  }

  const lower = normalized.toLowerCase();
  if (
    lower === 'localhost' ||
    lower.endsWith('.localhost') ||
    lower.endsWith('.local') ||
    lower.endsWith('.internal') ||
    lower.endsWith('.lan') ||
    lower.endsWith('.arpa')
  ) {
    return false;
  }

  // Reject IPv4 literals or numeric-only TLDs
  if (/^\d+(\.\d+)+$/.test(lower)) {
    return false;
  }

  if (!VALID_PUBLIC_DOMAIN_REGEX.test(lower)) {
    return false;
  }

  const labels = lower.split('.');
  const tld = labels[labels.length - 1] || '';
  if (!/^[a-z]{2,63}$/.test(tld)) {
    return false;
  }

  return true;
}

export async function POST(request: NextRequest) {
  try {
    const isAdmin = isAdminAuthenticated(request);
    const clientIp = getClientIpFromHeaders(request.headers);
    const ipHash = computeIpHash(clientIp);
    const db = getDb();

    // 1. Serverless-safe 24-hour IP rate limit check (max 3 audits / 24h for non-admins)
    if (!isAdmin) {
      const rateCheck = await checkPostgresIpRateLimit(db, ipHash);
      if (!rateCheck.allowed) {
        return NextResponse.json(
          {
            error:
              'Du har nådd grensen på 3 gratis analyser per døgn. Ta gjerne kontakt med oss på kontakt@flowwmedia.no dersom du ønsker flere analyser.',
            errorCode: 'RATE_LIMITED',
          },
          { status: 429 }
        );
      }
    }

    const body = (await request.json().catch(() => ({}))) as StartAuditRequestBody;
    const rawDomain = (body.domain || '').trim();

    if (!rawDomain) {
      return NextResponse.json(
        { error: 'Vennligst oppgi et gyldig domenenavn (f.eks. bedrift.no).' },
        { status: 400 }
      );
    }

    const domain = normalizeDomain(rawDomain);
    if (!isValidPublicDomain(rawDomain, domain)) {
      return NextResponse.json(
        {
          error: DEAD_DOMAIN_USER_MESSAGE,
          errorCode: 'DEAD_DOMAIN',
        },
        { status: 400 }
      );
    }

    const useFixtures =
      process.env.AUDIT_USE_FIXTURES === 'true' ||
      (isAdmin && body.useFixtures === true);

    const allowForce = isAdmin && body.force !== false;
    const allowInlineOverride = isAdmin && body.inline === true;

    // 2. Existing business lookup (to pass any known orgnr/name hints to Brreg)
    let [business] = await db
      .select()
      .from(businesses)
      .where(eq(businesses.domain, domain))
      .limit(1);

    // 3. ZERO-COST PRE-FLIGHT + BRREG LOOKUP + POLITE NACE BLACKLIST CHECK
    const preResolve = await runPreFlightAndBrregResolve(domain, {
      useFixtures,
      skipBlacklist: isAdmin,
      hintOrgnr:
        business?.orgnr && /^\d{9}$/.test(business.orgnr)
          ? business.orgnr
          : undefined,
      hintName:
        business?.name && business.name !== domain ? business.name : undefined,
    });

    if (!preResolve.ok) {
      return NextResponse.json(
        {
          error: preResolve.message || DEAD_DOMAIN_USER_MESSAGE,
          errorCode: preResolve.errorCode || 'DEAD_DOMAIN',
        },
        { status: preResolve.httpStatus || 400 }
      );
    }

    // 4. Upsert business record with verified Brreg metadata from Wave 1
    if (!business) {
      let safeOrgnr =
        preResolve.orgnr ||
        `PENDING-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

      if (preResolve.orgnr) {
        const [collision] = await db
          .select({ id: businesses.id })
          .from(businesses)
          .where(eq(businesses.orgnr, preResolve.orgnr))
          .limit(1);
        if (collision) {
          safeOrgnr = `PENDING-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        }
      }

      const [insertedBusiness] = await db
        .insert(businesses)
        .values({
          orgnr: safeOrgnr,
          domain,
          name: preResolve.companyName || domain,
          orgForm: preResolve.orgForm ?? null,
          nace: preResolve.nace ?? null,
          naceName: preResolve.naceName ?? null,
          address: preResolve.address ?? null,
          postcode: preResolve.postcode ?? null,
          city: preResolve.city ?? null,
          source: isAdmin ? 'bulk' : 'self_serve',
          profileType: 'lokal',
        })
        .returning();
      business = insertedBusiness;
    } else {
      const updateFields: Record<string, unknown> = {
        updatedAt: new Date(),
      };
      if (isAdmin) {
        updateFields.source = 'bulk';
      }
      if (preResolve.companyName && preResolve.companyName !== domain) {
        updateFields.name = preResolve.companyName;
      }
      if (preResolve.orgForm) updateFields.orgForm = preResolve.orgForm;
      if (preResolve.nace) updateFields.nace = preResolve.nace;
      if (preResolve.naceName) updateFields.naceName = preResolve.naceName;
      if (preResolve.address) updateFields.address = preResolve.address;
      if (preResolve.postcode) updateFields.postcode = preResolve.postcode;
      if (preResolve.city) updateFields.city = preResolve.city;

      if (preResolve.orgnr && preResolve.orgnr !== business.orgnr) {
        const [collision] = await db
          .select({ id: businesses.id })
          .from(businesses)
          .where(eq(businesses.orgnr, preResolve.orgnr))
          .limit(1);
        if (!collision || collision.id === business.id) {
          updateFields.orgnr = preResolve.orgnr;
        }
      }

      const [updatedBusiness] = await db
        .update(businesses)
        .set(updateFields)
        .where(eq(businesses.id, business.id))
        .returning();
      if (updatedBusiness) {
        business = updatedBusiness;
      }
    }

    // 5. Check for existing `done` report < 14 days old (Domain Cache)
    let cachedReport: {
      id: string;
      slug: string;
      scoreTotal: number;
      jobId: string;
    } | null = null;

    if (!allowForce) {
      const recentJobs = await db
        .select()
        .from(auditJobs)
        .where(eq(auditJobs.businessId, business.id))
        .orderBy(desc(auditJobs.createdAt))
        .limit(10);

      const nowMs = Date.now();
      const recentDoneJob = recentJobs.find(
        (j) =>
          j.status === 'done' &&
          j.createdAt &&
          nowMs - new Date(j.createdAt).getTime() < FOURTEEN_DAYS_MS
      );

      if (recentDoneJob) {
        const [existingReport] = await db
          .select({
            id: reports.id,
            slug: reports.slug,
            scoreTotal: reports.scoreTotal,
          })
          .from(reports)
          .where(eq(reports.jobId, recentDoneJob.id))
          .limit(1);

        if (existingReport?.slug) {
          cachedReport = {
            id: existingReport.id,
            slug: existingReport.slug,
            scoreTotal: Number(existingReport.scoreTotal) || 0,
            jobId: recentDoneJob.id,
          };
        }
      }
    }

    // 6. Admin Direct Path (from Command Center): skip email gate
    if (isAdmin && (body.skipGate === true || body.force === true || body.useFixtures !== undefined)) {
      if (cachedReport && !allowForce) {
        return NextResponse.json(
          {
            jobId: cachedReport.jobId,
            businessId: business.id,
            domain,
            useFixtures,
            status: 'done',
            reportSlug: cachedReport.slug,
            slug: cachedReport.slug,
            reuseExisting: true,
          },
          { status: 200 }
        );
      }

      const [adminJob] = await db
        .insert(auditJobs)
        .values({
          businessId: business.id,
          kind: 'full',
          status: 'queued',
          priority: 10,
          modulesDone: ['resolve', 'email_confirmed'],
        })
        .returning();

      const now = new Date();
      const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      await db.insert(rawFetches).values({
        jobId: adminJob.id,
        module: 'resolve',
        payload: {
          domain,
          brregEnhet: preResolve.brregEnhet,
          subUnitCount: preResolve.subUnitCount,
          subUnitNaces: preResolve.subUnitNaces,
          resolvedAt: now.toISOString(),
        },
        fetchedAt: now,
        expiresAt,
      });

      const preferExternalWorker =
        process.env.USE_WORKER_QUEUE === 'true' && !useFixtures && !allowInlineOverride;

      let enqueuedToBoss = false;
      if (preferExternalWorker) {
        try {
          const boss = await createBoss();
          await boss.start();
          await enqueueAuditJob(boss, {
            jobId: adminJob.id,
            businessId: business.id,
            kind: 'full',
            priority: 10,
            useFixtures,
          });
          await boss.stop();
          enqueuedToBoss = true;
        } catch (queueErr) {
          console.warn(
            '⚠️ [Start API] pg-boss enqueue failed, falling back to inline execution:',
            queueErr
          );
        }
      }

      if (!enqueuedToBoss) {
        void runFullAudit(adminJob.id, { useFixtures, db }).catch((err) => {
          console.error(`❌ [Start API] Admin audit job ${adminJob.id} failed:`, err);
        });
      }

      return NextResponse.json(
        {
          jobId: adminJob.id,
          businessId: business.id,
          domain,
          businessName: business.name,
          city: business.city,
          naceName: business.naceName,
          useFixtures,
          status: 'running',
          gateState: 'confirmed',
        },
        { status: 201 }
      );
    }

    // 7. Public 2-Step Lead Gate Path (pauses at ~10% after free Wave 1 pre-resolve)
    const [job] = await db
      .insert(auditJobs)
      .values({
        businessId: business.id,
        kind: 'full',
        status: 'queued',
        priority: 10,
        modulesDone: ['resolve'],
      })
      .returning();

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    // Save pre-resolved Brreg entity so Wave 2/3 can reuse it without re-fetching Brreg
    await db.insert(rawFetches).values({
      jobId: job.id,
      module: 'resolve',
      payload: {
        domain,
        brregEnhet: preResolve.brregEnhet,
        subUnitCount: preResolve.subUnitCount,
        subUnitNaces: preResolve.subUnitNaces,
        resolvedAt: now.toISOString(),
      },
      fetchedAt: now,
      expiresAt,
    });

    // Save gate state (including any < 14 days cached report slug for Cache-Behind-the-Gate)
    await db.insert(rawFetches).values({
      jobId: job.id,
      module: 'gate',
      payload: {
        stage: 'awaiting_email',
        ipHash,
        useFixtures,
        cachedReportId: cachedReport?.id ?? null,
        cachedReportSlug: cachedReport?.slug ?? null,
        cachedScoreTotal: cachedReport?.scoreTotal ?? null,
        createdAt: now.toISOString(),
      },
      fetchedAt: now,
      expiresAt,
    });

    return NextResponse.json(
      {
        jobId: job.id,
        businessId: business.id,
        domain,
        businessName: business.name,
        orgnr: /^\d{9}$/.test(business.orgnr) ? business.orgnr : null,
        city: business.city,
        naceName: business.naceName,
        useFixtures,
        status: 'queued',
        gateState: 'awaiting_email',
        modulesDone: ['resolve'],
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('❌ [POST /api/seo-analyse/start] Error:', error);
    return NextResponse.json(
      {
        error: 'Kunne ikke starte synlighetsanalysen. Vennligst prøv igjen.',
      },
      { status: 500 }
    );
  }
}
