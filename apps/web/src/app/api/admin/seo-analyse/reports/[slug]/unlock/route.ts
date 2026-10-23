import { NextRequest, NextResponse } from 'next/server';
import { getDb, reports, auditJobs, businesses, leads, eq } from '@floww/db';
import { generateReportPdf } from '@floww/audit';
import { requireAdminAuth, getTrustedAppOrigin } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface VipUnlockBody {
  lock?: boolean;
  createLead?: boolean;
  owner?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  notes?: string;
}

/**
 * Sales Rep VIP Override ("1-Klikks Gratis Opplåsing" / Re-lock):
 * Allows Simen/Marja to manually unlock any locked report for free during a live sales call,
 * optionally creating or updating a CRM lead card in `leads`, or re-lock a report back to Teaser mode.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const authError = requireAdminAuth(request);
  if (authError) return authError;

  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ error: 'Mangler rapport-slug.' }, { status: 400 });
    }

    const body = (await request.json().catch(() => ({}))) as VipUnlockBody;
    const db = getDb();
    const now = new Date();

    const [reportRow] = await db
      .select()
      .from(reports)
      .where(eq(reports.slug, slug))
      .limit(1);

    if (!reportRow) {
      return NextResponse.json({ error: 'Fant ikke rapporten.' }, { status: 404 });
    }

    if (body.lock === true) {
      await db
        .update(reports)
        .set({
          unlockedAt: null,
          updatedAt: now,
        })
        .where(eq(reports.id, reportRow.id));

      return NextResponse.json({
        success: true,
        reportId: reportRow.id,
        slug: reportRow.slug,
        unlockedAt: null,
        locked: true,
      });
    }

    const [jobRow] = await db
      .select()
      .from(auditJobs)
      .where(eq(auditJobs.id, reportRow.jobId))
      .limit(1);

    const [businessRow] = jobRow
      ? await db
          .select()
          .from(businesses)
          .where(eq(businesses.id, jobRow.businessId))
          .limit(1)
      : [undefined];

    const unlockedAt = reportRow.unlockedAt ?? now;

    await db
      .update(reports)
      .set({
        unlockedAt,
        updatedAt: now,
      })
      .where(eq(reports.id, reportRow.id));

    let leadId: string | null = null;
    if (body.createLead !== false && jobRow) {
      const [existingLead] = await db
        .select()
        .from(leads)
        .where(eq(leads.reportId, reportRow.id))
        .limit(1);

      if (existingLead) {
        leadId = existingLead.id;
      } else {
        const [insertedLead] = await db
          .insert(leads)
          .values({
            reportId: reportRow.id,
            businessId: jobRow.businessId,
            contactName:
              body.contactName ||
              businessRow?.generalManager ||
              businessRow?.name ||
              null,
            email:
              body.contactEmail ||
              businessRow?.email ||
              (businessRow?.domain ? `post@${businessRow.domain}` : null),
            phone: body.contactPhone || businessRow?.phone || null,
            status: 'called',
            owner: body.owner || 'Simen',
            notes:
              body.notes ||
              'VIP-opplåst gratis fra Admin Command Center under salgssamtale.',
            calledAt: now,
            slaBreached: false,
          })
          .returning({ id: leads.id });
        leadId = insertedLead.id;
      }
    }

    const origin = getTrustedAppOrigin();

    void generateReportPdf(slug, { baseUrl: origin, db }).catch((err) => {
      console.warn('⚠️ [VIP Unlock] Background PDF generation warning:', err);
    });

    return NextResponse.json({
      success: true,
      reportId: reportRow.id,
      slug: reportRow.slug,
      unlockedAt,
      leadId,
    });
  } catch (error: any) {
    console.error('❌ [POST /api/admin/seo-analyse/reports/[slug]/unlock] Error:', error);
    return NextResponse.json(
      { error: 'Kunne ikke VIP-låse opp rapporten.' },
      { status: 500 }
    );
  }
}
