import {
  getDb,
  Database,
  reports,
  orders,
  leads,
  auditJobs,
  businesses,
  eq,
} from '@floww/db';

export interface ProcessPaymentParams {
  reportId: string;
  stripeSessionId: string;
  customerEmail: string;
  customerName?: string;
  customerPhone?: string;
  amountOre?: number;
}

export interface ProcessPaymentResult {
  reportId: string;
  slug: string;
  businessId: string;
  leadId: string;
  orderId: string;
  unlockedAt: Date;
}

/**
 * Idempotent post-payment processor executed inside an atomic Drizzle transaction:
 * 1. Upserts/updates the `orders` record for `stripeSessionId` to `status = 'paid'` and `paidAt = now()`.
 * 2. Sets `reports.unlocked_at = now()` (preserving original timestamp if already unlocked).
 * 3. Fetches `jobId` and `businessId` for the report and creates a warm lead in `leads`
 *    (idempotent on `reportId` so duplicate webhook deliveries never create duplicate leads).
 */
export async function processSuccessfulPayment(
  params: ProcessPaymentParams,
  dbInstance?: Database
): Promise<ProcessPaymentResult> {
  const db = dbInstance ?? getDb();
  const now = new Date();
  const amountOre = params.amountOre ?? 186250; // Default: 1 862,50 kr inkl. 25 % mva. (1 490,00 kr eks. mva.)
  const cleanEmail = (params.customerEmail || 'ukjent@kunde.no').trim().toLowerCase();

  return await db.transaction(async (tx) => {
    // 1. Verify report exists
    const [reportRow] = await tx
      .select()
      .from(reports)
      .where(eq(reports.id, params.reportId))
      .limit(1);

    if (!reportRow) {
      throw new Error(`Report not found for reportId=${params.reportId}`);
    }

    // 2. Fetch job & business context
    const [jobRow] = await tx
      .select()
      .from(auditJobs)
      .where(eq(auditJobs.id, reportRow.jobId))
      .limit(1);

    if (!jobRow) {
      throw new Error(`Audit job not found for jobId=${reportRow.jobId}`);
    }

    const [businessRow] = await tx
      .select()
      .from(businesses)
      .where(eq(businesses.id, jobRow.businessId))
      .limit(1);

    // 3. Upsert order for stripeSessionId -> status = 'paid', paidAt = now()
    const [orderRow] = await tx
      .insert(orders)
      .values({
        stripeSessionId: params.stripeSessionId,
        reportId: reportRow.id,
        amount: amountOre,
        currency: 'nok',
        status: 'paid',
        email: cleanEmail,
        paidAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: orders.stripeSessionId,
        set: {
          status: 'paid',
          email: cleanEmail,
          paidAt: now,
          updatedAt: now,
        },
      })
      .returning({ id: orders.id });

    // 4. Unlock report (preserve original unlockedAt if already unlocked)
    const unlockedAt = reportRow.unlockedAt ?? now;
    await tx
      .update(reports)
      .set({
        unlockedAt,
        updatedAt: now,
      })
      .where(eq(reports.id, reportRow.id));

    // 5. Idempotently create or update lead in `leads` table for this report
    const [existingLead] = await tx
      .select()
      .from(leads)
      .where(eq(leads.reportId, reportRow.id))
      .limit(1);

    const resolvedName =
      params.customerName ||
      businessRow?.generalManager ||
      businessRow?.name ||
      null;
    const resolvedPhone = params.customerPhone || businessRow?.phone || null;
    const resolvedEmail = cleanEmail || businessRow?.email || null;

    let leadId: string;
    if (existingLead) {
      leadId = existingLead.id;
      await tx
        .update(leads)
        .set({
          contactName: existingLead.contactName ?? resolvedName,
          email: existingLead.email ?? resolvedEmail,
          phone: existingLead.phone ?? resolvedPhone,
          updatedAt: now,
        })
        .where(eq(leads.id, existingLead.id));
    } else {
      const [insertedLead] = await tx
        .insert(leads)
        .values({
          reportId: reportRow.id,
          businessId: jobRow.businessId,
          contactName: resolvedName,
          email: resolvedEmail,
          phone: resolvedPhone,
          status: 'new',
          owner: 'Simen',
          slaBreached: false,
        })
        .returning({ id: leads.id });
      leadId = insertedLead.id;
    }

    return {
      reportId: reportRow.id,
      slug: reportRow.slug,
      businessId: jobRow.businessId,
      leadId,
      orderId: orderRow.id,
      unlockedAt,
    };
  });
}
