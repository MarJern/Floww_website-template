import { NextRequest, NextResponse } from 'next/server';
import {
  getDb,
  reports,
  auditJobs,
  businesses,
  leads,
  orders,
  campaigns,
  outreach,
  rawFetches,
  desc,
  eq,
  and,
} from '@floww/db';
import { requireAdminAuth } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

export async function GET(request: NextRequest) {
  const authError = requireAdminAuth(request);
  if (authError) return authError;

  try {
    const db = getDb();
    const now = Date.now();

    const [
      allReports,
      allJobs,
      allBusinesses,
      allLeads,
      allOrders,
      allCampaigns,
      allOutreach,
      gateRaws,
    ] = await Promise.all([
      db
        .select({
          id: reports.id,
          jobId: reports.jobId,
          slug: reports.slug,
          scoreTotal: reports.scoreTotal,
          scoresByPart: reports.scoresByPart,
          findingCounts: reports.findingCounts,
          nokEstimate: reports.nokEstimate,
          teaserFindings: reports.teaserFindings,
          unlockedAt: reports.unlockedAt,
          pdfPath: reports.pdfPath,
          expiresAt: reports.expiresAt,
          createdAt: reports.createdAt,
          updatedAt: reports.updatedAt,
        })
        .from(reports)
        .orderBy(desc(reports.createdAt)),
      db.select().from(auditJobs).orderBy(desc(auditJobs.createdAt)),
      db.select().from(businesses),
      db.select().from(leads).orderBy(desc(leads.createdAt)),
      db.select().from(orders).orderBy(desc(orders.createdAt)),
      db.select().from(campaigns).orderBy(desc(campaigns.createdAt)),
      db.select().from(outreach).orderBy(desc(outreach.createdAt)),
      db
        .select({
          jobId: rawFetches.jobId,
          module: rawFetches.module,
          payload: rawFetches.payload,
        })
        .from(rawFetches)
        .where(eq(rawFetches.module, 'gate')),
    ]);

    const businessMap = new Map(allBusinesses.map((b) => [b.id, b]));
    const jobMap = new Map(allJobs.map((j) => [j.id, j]));
    const reportMap = new Map(allReports.map((r) => [r.id, r]));
    const gateEmailByJobId = new Map<string, string>();
    for (const g of gateRaws) {
      const p = (g.payload ?? {}) as { email?: string };
      if (p.email) {
        gateEmailByJobId.set(g.jobId, p.email);
      }
    }

    // Map latest report per businessId for outreach lookup
    const latestReportByBusinessId = new Map<string, (typeof allReports)[number]>();
    for (const r of allReports) {
      const job = jobMap.get(r.jobId);
      if (job && !latestReportByBusinessId.has(job.businessId)) {
        latestReportByBusinessId.set(job.businessId, r);
      }
    }

    // Check & persist 2-hour SLA breaches for leads still in 'new' status
    const newlyBreachedLeadIds: string[] = [];
    const enrichedLeads = allLeads.map((lead) => {
      const createdMs = new Date(lead.createdAt).getTime();
      const elapsedMs = Math.max(0, now - createdMs);
      const isOverTwoHours = elapsedMs > TWO_HOURS_MS;
      const isBreached = lead.status === 'new' && (lead.slaBreached || isOverTwoHours);

      if (lead.status === 'new' && isOverTwoHours && !lead.slaBreached) {
        newlyBreachedLeadIds.push(lead.id);
      }

      const slaRemainingMinutes =
        lead.status === 'new'
          ? Math.round((TWO_HOURS_MS - elapsedMs) / 60000)
          : null;

      const report = reportMap.get(lead.reportId);
      const business = businessMap.get(lead.businessId);

      return {
        id: lead.id,
        reportId: lead.reportId,
        reportSlug: report?.slug ?? null,
        businessId: lead.businessId,
        businessName: business?.name ?? 'Ukjent virksomhet',
        domain: business?.domain ?? '',
        orgnr: business?.orgnr ?? '',
        city: business?.city ?? null,
        nace: business?.nace ?? null,
        naceName: business?.naceName ?? null,
        scoreTotal: report ? Number(report.scoreTotal) : 0,
        nokEstimate: report ? Number(report.nokEstimate) : 0,
        contactName: lead.contactName ?? business?.generalManager ?? null,
        email: lead.email ?? business?.email ?? null,
        phone: lead.phone ?? business?.phone ?? null,
        status: lead.status,
        owner: lead.owner ?? 'Simen',
        notes: lead.notes ?? '',
        calledAt: lead.calledAt,
        slaBreached: isBreached,
        slaRemainingMinutes,
        createdAt: lead.createdAt,
        updatedAt: lead.updatedAt,
      };
    });

    if (newlyBreachedLeadIds.length > 0) {
      await Promise.all(
        newlyBreachedLeadIds.map((id) =>
          db
            .update(leads)
            .set({ slaBreached: true, updatedAt: new Date() })
            .where(eq(leads.id, id))
        )
      ).catch((err) => {
        console.warn('⚠️ [Admin Overview] SLA update warning:', err);
      });
    }

    const enrichedReports = allReports.map((r) => {
      const job = jobMap.get(r.jobId);
      const business = job ? businessMap.get(job.businessId) : undefined;
      return {
        id: r.id,
        slug: r.slug,
        jobId: r.jobId,
        businessId: job?.businessId ?? null,
        businessName: business?.name ?? 'Ukjent virksomhet',
        domain: business?.domain ?? '',
        orgnr: business?.orgnr ?? '',
        nace: business?.nace ?? null,
        naceName: business?.naceName ?? null,
        city: business?.city ?? null,
        profileType: business?.profileType ?? 'lokal',
        scoreTotal: Number(r.scoreTotal),
        scoresByPart: r.scoresByPart,
        findingCounts: r.findingCounts,
        nokEstimate: Number(r.nokEstimate),
        isUnlocked: r.unlockedAt !== null,
        unlockedAt: r.unlockedAt,
        pdfPath: r.pdfPath,
        createdAt: r.createdAt,
        expiresAt: r.expiresAt,
      };
    });

    // Enrich failed jobs (especially INSUFFICIENT_DATA) so admin can follow up manually using captured email
    const failedJobs = allJobs
      .filter((j) => j.status === 'failed' && !(j.error ?? '').startsWith('[DISMISSED]'))
      .slice(0, 50)
      .map((j) => {
        const bus = businessMap.get(j.businessId);
        const capturedEmail = gateEmailByJobId.get(j.id) ?? bus?.email ?? null;
        const errStr = j.error ?? 'INSUFFICIENT_DATA';
        return {
          id: j.id,
          jobId: j.id,
          businessId: j.businessId,
          businessName: bus?.name ?? 'Ukjent virksomhet',
          domain: bus?.domain ?? '',
          orgnr: bus?.orgnr ?? '',
          city: bus?.city ?? null,
          nace: bus?.nace ?? null,
          naceName: bus?.naceName ?? null,
          email: capturedEmail,
          phone: bus?.phone ?? null,
          error: errStr,
          isInsufficientData: errStr.includes('INSUFFICIENT_DATA'),
          modulesDone: Array.isArray(j.modulesDone) ? j.modulesDone : [],
          modulesFailed: Array.isArray((j as any).modulesFailed) ? (j as any).modulesFailed : [],
          createdAt: j.createdAt,
          finishedAt: j.finishedAt,
        };
      });

    const enrichedCampaigns = allCampaigns.map((c) => {
      const items = allOutreach
        .filter((o) => o.campaignId === c.id)
        .map((o) => {
          const bus = businessMap.get(o.businessId);
          const rep = latestReportByBusinessId.get(o.businessId);
          return {
            id: o.id,
            businessId: o.businessId,
            businessName: bus?.name ?? 'Virksomhet',
            domain: bus?.domain ?? '',
            orgnr: bus?.orgnr ?? '',
            city: bus?.city ?? null,
            reportSlug: rep?.slug ?? null,
            scoreTotal: rep ? Number(rep.scoreTotal) : null,
            nokEstimate: rep ? Number(rep.nokEstimate) : null,
            step: o.step,
            channel: o.channel,
            sentAt: o.sentAt,
            openedAt: o.openedAt,
            clickedAt: o.clickedAt,
          };
        });

      return {
        id: c.id,
        name: c.name,
        nace: c.nace,
        postcodes: c.postcodes,
        status: c.status,
        createdBy: c.createdBy ?? 'Simen',
        counts: c.counts,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        outreachItems: items,
      };
    });

    const paidOrders = allOrders.filter((o) => o.status === 'paid');
    const unlockedReportsCount = enrichedReports.filter((r) => r.isUnlocked).length;
    const revenueExVatNok = paidOrders.length * 1490;
    const revenueIncVatNok = paidOrders.reduce((acc, o) => {
      const ore = Number(o.amount) || 186250;
      return acc + Math.round(ore / 100);
    }, 0);

    const totalMonthlyLostNokIdentified = enrichedReports.reduce(
      (acc, r) => acc + (r.nokEstimate || 0),
      0
    );

    return NextResponse.json({
      kpis: {
        totalReports: enrichedReports.length,
        unlockedReports: unlockedReportsCount,
        paidOrdersCount: paidOrders.length,
        revenueExVatNok,
        revenueIncVatNok,
        activeLeadsCount: enrichedLeads.filter(
          (l) => l.status !== 'won' && l.status !== 'lost'
        ).length,
        newLeadsCount: enrichedLeads.filter((l) => l.status === 'new').length,
        slaBreachedCount: enrichedLeads.filter((l) => l.slaBreached).length,
        failedJobsCount: failedJobs.length,
        totalMonthlyLostNokIdentified,
      },
      leads: enrichedLeads,
      reports: enrichedReports,
      failedJobs,
      campaigns: enrichedCampaigns,
    });
  } catch (error: any) {
    console.error('❌ [GET /api/admin/seo-analyse/overview] Error:', error);
    return NextResponse.json(
      { error: 'Kunne ikke hente admin-oversikt.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const authError = requireAdminAuth(request);
  if (authError) return authError;

  try {
    const body = (await request.json().catch(() => ({}))) as {
      jobId?: string;
      clearAllFailed?: boolean;
    };

    const db = getDb();

    if (body.clearAllFailed) {
      const failedRows = await db
        .select({ id: auditJobs.id, error: auditJobs.error })
        .from(auditJobs)
        .where(eq(auditJobs.status, 'failed'));

      await Promise.all(
        failedRows
          .filter((r) => !(r.error ?? '').startsWith('[DISMISSED]'))
          .map((r) =>
            db
              .update(auditJobs)
              .set({
                error: `[DISMISSED] ${r.error ?? 'INSUFFICIENT_DATA'}`,
              })
              .where(eq(auditJobs.id, r.id))
          )
      );

      return NextResponse.json({ success: true, clearedAll: true });
    }

    if (!body.jobId) {
      return NextResponse.json({ error: 'Mangler jobId.' }, { status: 400 });
    }

    const [existing] = await db
      .select({ id: auditJobs.id, error: auditJobs.error })
      .from(auditJobs)
      .where(and(eq(auditJobs.id, body.jobId), eq(auditJobs.status, 'failed')))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: 'Fant ikke avbrutt jobb.' }, { status: 404 });
    }

    await db
      .update(auditJobs)
      .set({
        error: `[DISMISSED] ${existing.error ?? 'INSUFFICIENT_DATA'}`,
      })
      .where(eq(auditJobs.id, existing.id));

    return NextResponse.json({ success: true, jobId: existing.id });
  } catch (error: any) {
    console.error('❌ [DELETE /api/admin/seo-analyse/overview] Error:', error);
    return NextResponse.json(
      { error: 'Kunne ikke markere avvik som håndtert.' },
      { status: 500 }
    );
  }
}
