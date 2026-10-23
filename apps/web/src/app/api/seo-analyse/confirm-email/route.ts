import { NextRequest, NextResponse } from 'next/server';
import {
  getDb,
  businesses,
  auditJobs,
  rawFetches,
  leads,
  createBoss,
  enqueueAuditJob,
  eq,
  and,
} from '@floww/db';
import { runFullAudit, sendReportReadyTeaserEmail } from '@floww/audit';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import {
  computeIpHash,
  getClientIpFromHeaders,
  checkPostgresIpRateLimit,
  recordPostgresIpRateLimit,
  validateBusinessEmailWithMx,
} from '@/lib/scanner-security';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

interface ConfirmEmailRequestBody {
  jobId?: string;
  email?: string;
  agencySpendMonthly?: number | string | null;
  agencyDurationMonths?: number | string | null;
}

function parseOptionalPositiveInt(
  raw: unknown,
  maxVal: number
): number | null {
  if (raw === null || raw === undefined || raw === '') return null;
  const cleaned = String(raw).replace(/[^\d]/g, '');
  if (!cleaned) return null;
  const parsed = parseInt(cleaned, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return Math.min(parsed, maxVal);
}

export async function POST(request: NextRequest) {
  try {
    const isAdmin = isAdminAuthenticated(request);
    const clientIp = getClientIpFromHeaders(request.headers);
    const ipHash = computeIpHash(clientIp);
    const db = getDb();

    const body = (await request.json().catch(() => ({}))) as ConfirmEmailRequestBody;
    const jobId = (body.jobId || '').trim();
    const rawEmail = (body.email || '').trim();
    const agencySpendMonthly = parseOptionalPositiveInt(
      body.agencySpendMonthly,
      10_000_000
    );
    const agencyDurationMonths = parseOptionalPositiveInt(
      body.agencyDurationMonths,
      360
    );

    if (!jobId) {
      return NextResponse.json(
        { error: 'Mangler jobb-ID for analysen.' },
        { status: 400 }
      );
    }

    // 1. Validate email syntax, block disposable domains, and verify DNS MX record
    const emailValidation = await validateBusinessEmailWithMx(rawEmail);
    if (!emailValidation.valid) {
      return NextResponse.json(
        {
          error:
            emailValidation.error ||
            'Vennligst oppgi en gyldig jobb-e-postadresse.',
        },
        { status: 400 }
      );
    }

    const cleanEmail = emailValidation.cleanEmail;

    // 2. Load job and business
    const [job] = await db
      .select()
      .from(auditJobs)
      .where(eq(auditJobs.id, jobId))
      .limit(1);

    if (!job) {
      return NextResponse.json(
        { error: 'Fant ikke analysejobben. Vennligst start søket på nytt.' },
        { status: 404 }
      );
    }

    const [business] = await db
      .select()
      .from(businesses)
      .where(eq(businesses.id, job.businessId))
      .limit(1);

    if (!business) {
      return NextResponse.json(
        { error: 'Fant ikke bedriften tilknyttet analysen.' },
        { status: 404 }
      );
    }

    // 3. Load gate metadata from raw_fetches
    const [gateRow] = await db
      .select()
      .from(rawFetches)
      .where(
        and(eq(rawFetches.jobId, job.id), eq(rawFetches.module, 'gate'))
      )
      .limit(1);

    const gatePayload = (gateRow?.payload ?? {}) as {
      stage?: string;
      ipHash?: string;
      useFixtures?: boolean;
      cachedReportId?: string | null;
      cachedReportSlug?: string | null;
      cachedScoreTotal?: number | null;
      email?: string;
    };

    // 4. Update business email (+ optional agency ROI inputs) and persist confirmed gate email
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    await db
      .update(businesses)
      .set({
        email: cleanEmail,
        agencySpendMonthly,
        agencyDurationMonths,
        updatedAt: now,
      })
      .where(eq(businesses.id, business.id));

    const updatedGatePayload = {
      ...gatePayload,
      stage: 'confirmed',
      email: cleanEmail,
      ipHash,
      agencySpendMonthly,
      agencyDurationMonths,
      confirmedAt: now.toISOString(),
    };

    await db
      .insert(rawFetches)
      .values({
        jobId: job.id,
        module: 'gate',
        payload: updatedGatePayload,
        fetchedAt: now,
        expiresAt,
      })
      .onConflictDoUpdate({
        target: [rawFetches.jobId, rawFetches.module],
        set: {
          payload: updatedGatePayload,
          fetchedAt: now,
          expiresAt,
        },
      });

    // 5. CACHE-BEHIND-THE-GATE: If a < 14 days done report already exists,
    // capture the lead + send the Resend teaser email + serve cached report at 0 API cost!
    if (gatePayload.cachedReportSlug && gatePayload.cachedReportId) {
      const agencyNoteSuffix =
        agencySpendMonthly && agencySpendMonthly > 0
          ? agencyDurationMonths && agencyDurationMonths > 0
            ? ` · Byrå i dag: ${agencySpendMonthly.toLocaleString('nb-NO')} kr/mnd i ${agencyDurationMonths} mnd (${(
                agencySpendMonthly * agencyDurationMonths
              ).toLocaleString('nb-NO')} kr betalt totalt)`
            : ` · Byrå i dag: ${agencySpendMonthly.toLocaleString('nb-NO')} kr/mnd`
          : '';

      try {
        await db.insert(leads).values({
          reportId: gatePayload.cachedReportId,
          businessId: business.id,
          contactName: business.generalManager || business.name,
          email: cleanEmail,
          phone: business.phone || null,
          status: 'new',
          owner: 'Simen',
          notes: `Fanget via 2-stegs e-postport (gjenbrukte rapport < 14 dager)${agencyNoteSuffix}`,
          slaBreached: false,
        });
      } catch (leadErr) {
        console.warn('⚠️ [ConfirmEmail] Could not insert cached-report lead:', leadErr);
      }

      await db
        .update(auditJobs)
        .set({
          status: 'done',
          modulesDone: [
            'resolve',
            'email_confirmed',
            'gbp',
            'crawl',
            'speed',
            'serp',
            'links',
            'citations',
            'mentions',
            'ai',
            'score',
          ],
          finishedAt: now,
          updatedAt: now,
        })
        .where(eq(auditJobs.id, job.id));

      void sendReportReadyTeaserEmail({
        toEmail: cleanEmail,
        businessName: business.name || business.domain,
        domain: business.domain,
        reportSlug: gatePayload.cachedReportSlug,
        scoreTotal:
          typeof gatePayload.cachedScoreTotal === 'number'
            ? gatePayload.cachedScoreTotal
            : undefined,
      });

      return NextResponse.json({
        jobId: job.id,
        status: 'done',
        gateState: 'confirmed',
        reportSlug: gatePayload.cachedReportSlug,
        cached: true,
      });
    }

    // 6. FRESH AUDIT: Verify & record 3/24h Postgres IP rate limit
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
      await recordPostgresIpRateLimit(db, job.id, ipHash);
    }

    const useFixtures =
      process.env.AUDIT_USE_FIXTURES === 'true' ||
      Boolean(gatePayload.useFixtures);

    await db
      .update(auditJobs)
      .set({
        status: 'running',
        startedAt: now,
        modulesDone: ['resolve', 'email_confirmed'],
        updatedAt: now,
      })
      .where(eq(auditJobs.id, job.id));

    const preferExternalWorker =
      process.env.USE_WORKER_QUEUE === 'true' && !useFixtures;

    let enqueuedToBoss = false;
    if (preferExternalWorker) {
      try {
        const boss = await createBoss();
        await boss.start();
        await enqueueAuditJob(boss, {
          jobId: job.id,
          businessId: business.id,
          kind: 'full',
          priority: 10,
          useFixtures,
        });
        await boss.stop();
        enqueuedToBoss = true;
      } catch (queueErr) {
        console.warn(
          '⚠️ [ConfirmEmail] pg-boss enqueue failed, falling back to inline execution:',
          queueErr
        );
      }
    }

    if (!enqueuedToBoss) {
      void runFullAudit(job.id, { useFixtures, db }).catch((err) => {
        console.error(
          `❌ [ConfirmEmail] Background audit job ${job.id} failed:`,
          err
        );
      });
    }

    return NextResponse.json({
      jobId: job.id,
      status: 'running',
      gateState: 'confirmed',
      modulesDone: ['resolve', 'email_confirmed'],
    });
  } catch (error: any) {
    console.error('❌ [POST /api/seo-analyse/confirm-email] Error:', error);
    return NextResponse.json(
      {
        error: 'Kunne ikke bekrefte e-postadressen og starte analysen.',
      },
      { status: 500 }
    );
  }
}
