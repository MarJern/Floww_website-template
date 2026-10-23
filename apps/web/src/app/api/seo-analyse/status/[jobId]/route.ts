import { NextRequest, NextResponse } from 'next/server';
import {
  getDb,
  auditJobs,
  businesses,
  reports,
  rawFetches,
  eq,
  and,
} from '@floww/db';
import {
  INSUFFICIENT_DATA_USER_MESSAGE,
  NACE_BLACKLIST_USER_MESSAGE,
} from '@floww/audit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const STALLED_JOB_TIMEOUT_MS = 90 * 1000; // 90 seconds

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params;

    if (!jobId) {
      return NextResponse.json({ error: 'Mangler jobId.' }, { status: 400 });
    }

    const db = getDb();

    let [job] = await db
      .select()
      .from(auditJobs)
      .where(eq(auditJobs.id, jobId))
      .limit(1);

    if (!job) {
      return NextResponse.json(
        { error: 'Fant ikke analysejobben.' },
        { status: 404 }
      );
    }

    const [business] = await db
      .select({
        name: businesses.name,
        domain: businesses.domain,
        orgnr: businesses.orgnr,
        city: businesses.city,
        naceName: businesses.naceName,
        email: businesses.email,
      })
      .from(businesses)
      .where(eq(businesses.id, job.businessId))
      .limit(1);

    // Lazy Stalled-Job Reaper: If running > 90s, transition to failed ('INSUFFICIENT_DATA')
    if (
      job.status === 'running' &&
      job.startedAt &&
      Date.now() - new Date(job.startedAt).getTime() > STALLED_JOB_TIMEOUT_MS
    ) {
      const now = new Date();
      const [updatedJob] = await db
        .update(auditJobs)
        .set({
          status: 'failed',
          error: 'INSUFFICIENT_DATA',
          finishedAt: now,
          updatedAt: now,
        })
        .where(eq(auditJobs.id, job.id))
        .returning();

      if (updatedJob) {
        job = updatedJob;
      }

      try {
        await db
          .insert(rawFetches)
          .values({
            jobId: job.id,
            module: 'quality_gate',
            payload: {
              reason: 'JOB_STALLED_TIMEOUT',
              capturedEmail: business?.email ?? null,
              businessName: business?.name ?? null,
              domain: business?.domain ?? null,
              failedAt: now.toISOString(),
            },
            fetchedAt: now,
            expiresAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
          })
          .onConflictDoNothing();
      } catch {
        // Ignore rawFetches log error
      }
    }

    const modulesDone = Array.isArray(job.modulesDone) ? job.modulesDone : [];
    const gateState =
      job.status === 'queued' &&
      modulesDone.includes('resolve') &&
      !modulesDone.includes('email_confirmed')
        ? 'awaiting_email'
        : 'confirmed';

    let reportSlug: string | null = null;
    if (job.status === 'done') {
      const [report] = await db
        .select({ slug: reports.slug })
        .from(reports)
        .where(eq(reports.jobId, job.id))
        .limit(1);
      reportSlug = report?.slug ?? null;

      // Fallback for Cache-Behind-the-Gate jobs that reused an existing <14d report
      if (!reportSlug) {
        const [gateRow] = await db
          .select({ payload: rawFetches.payload })
          .from(rawFetches)
          .where(
            and(eq(rawFetches.jobId, job.id), eq(rawFetches.module, 'gate'))
          )
          .limit(1);
        const gatePayload = (gateRow?.payload ?? {}) as {
          cachedReportSlug?: string | null;
        };
        reportSlug = gatePayload.cachedReportSlug ?? null;
      }
    }

    let userError: string | null = null;
    let errorCode: string | null = null;
    if (job.status === 'failed') {
      const rawErr = String(job.error || '');
      if (rawErr.startsWith('NACE_BLACKLISTED')) {
        errorCode = 'NACE_BLACKLISTED';
        userError = NACE_BLACKLIST_USER_MESSAGE;
      } else if (
        rawErr.startsWith('INSUFFICIENT_DATA') ||
        rawErr.includes('TIMED_OUT')
      ) {
        errorCode = 'INSUFFICIENT_DATA';
        userError = INSUFFICIENT_DATA_USER_MESSAGE;
      } else {
        errorCode = 'FAILED';
        userError = INSUFFICIENT_DATA_USER_MESSAGE;
      }
    }

    return NextResponse.json({
      jobId: job.id,
      status: job.status,
      gateState,
      modulesDone,
      error: userError,
      errorCode,
      startedAt: job.startedAt,
      finishedAt: job.finishedAt,
      businessName: business?.name ?? null,
      orgnr:
        business?.orgnr && /^\d{9}$/.test(business.orgnr)
          ? business.orgnr
          : null,
      domain: business?.domain ?? null,
      city: business?.city ?? null,
      naceName: business?.naceName ?? null,
      reportSlug,
    });
  } catch (error: any) {
    console.error('❌ [GET /api/seo-analyse/status/[jobId]] Error:', error);
    return NextResponse.json(
      { error: 'Kunne ikke hente status for analysen.' },
      { status: 500 }
    );
  }
}
