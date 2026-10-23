import path from 'path';
import * as dotenv from 'dotenv';
import {
  getDb,
  businesses,
  auditJobs,
  reports,
  orders,
  leads,
  eq,
} from '@floww/db';
import {
  buildAndSaveReport,
  processSuccessfulPayment,
  generateReportPdf,
  FactorDefinition,
} from '../src/index';
import { Finding } from '../src/types';

dotenv.config({ path: path.resolve(__dirname, '../../../.env.local') });
dotenv.config();

async function verifyPaymentUnlockAndPdf() {
  console.log(
    '🧪 Starting Skive 5 (Part 2) Verification: Locked -> Payment -> Unlocked + Lead + PDF...\n'
  );

  const db = getDb();
  const testDomain = 'smilia-betalingstest.no';
  const testOrgnr = '988776655';

  // 1. Upsert test business & create audit job
  const [existingBiz] = await db
    .select()
    .from(businesses)
    .where(eq(businesses.domain, testDomain))
    .limit(1);

  const business =
    existingBiz ??
    (
      await db
        .insert(businesses)
        .values({
          orgnr: testOrgnr,
          domain: testDomain,
          name: 'Smilia Tannklinikk Betalingstest AS',
          orgForm: 'AS',
          nace: '86.230',
          naceName: 'Tannlegetjenester',
          city: 'Oslo',
          source: 'self_serve',
          profileType: 'lokal',
        })
        .returning()
    )[0];

  const [job] = await db
    .insert(auditJobs)
    .values({
      businessId: business.id,
      kind: 'full',
      status: 'running',
      modulesDone: ['resolve', 'gbp', 'crawl', 'speed', 'serp'],
    })
    .returning();

  const factors: FactorDefinition[] = [
    { code: 'L009', part: 1, groupName: 'Anmeldelser', nameNo: 'Antall Google-anmeldelser', weightMap: 2.37 },
    { code: 'G018', part: 2, groupName: 'Arkitektur', nameNo: 'Tjeneste × sted-dekning', weightOrganic: 3.33 },
    { code: 'B002', part: 4, groupName: 'Annonserelevans', nameNo: 'Egen side per tjeneste', weightSubgroup: 10.0 },
  ];

  const findings: Finding[] = [
    {
      factorCode: 'L009',
      status: 'crit',
      value: { reviewCount: 14 },
      evidence: { measuredNumber: 14, snippet: 'Kun 14 anmeldelser mot 112 hos topp 3 i kartet' },
    },
    {
      factorCode: 'G018',
      status: 'crit',
      value: { coveragePercent: 25 },
      evidence: { measuredNumber: 25, snippet: 'Kun 25 % dekning av tjeneste × sted-sider' },
    },
    {
      factorCode: 'B002',
      status: 'warn',
      value: { landingCoverage: 60 },
      evidence: { measuredNumber: 60, snippet: '40 % av annonseordene mangler dedikert landingsside' },
    },
  ];

  // 2. Build and save initial LOCKED report
  const built = await buildAndSaveReport(
    {
      jobId: job.id,
      business: {
        id: business.id,
        orgnr: business.orgnr,
        domain: business.domain,
        name: business.name,
        nace: business.nace ?? '86.230',
        city: business.city ?? 'Oslo',
        profileType: 'lokal',
        source: 'self_serve',
      },
      findings,
      factors,
    },
    db
  );

  console.log('====================================================================');
  console.log('STEP 1: INITIAL LOCKED REPORT STATE');
  console.log('====================================================================');
  console.log(`Report ID:         ${built.reportId}`);
  console.log(`Slug:              ${built.slug}`);
  console.log(`Unlocked At:       ${built.unlockedAt} (Expected: null)`);
  console.log(`PDF Path:          ${built.pdfPath} (Expected: null)`);

  // Verify PDF generation is blocked while locked
  let blockedWhenLocked = false;
  try {
    await generateReportPdf(built.slug, { db, preferPlaywright: false });
  } catch {
    blockedWhenLocked = true;
  }
  console.log(`PDF Gate (Locked): ${blockedWhenLocked ? '✅ 403/Blocked as expected' : '❌ Failed to block'}\n`);

  // 3. Process payment (First execution)
  console.log('====================================================================');
  console.log('STEP 2: PROCESS SUCCESSFUL PAYMENT & IDEMPOTENCY');
  console.log('====================================================================');
  const stripeSessionId = `cs_test_${built.slug}`;
  const payment1 = await processSuccessfulPayment(
    {
      reportId: built.reportId,
      stripeSessionId,
      customerEmail: 'kari@smilia.no',
      customerName: 'Dr. Kari Nordmann',
      customerPhone: '912 34 567',
      amountOre: 149000,
    },
    db
  );

  // Simulate duplicate webhook delivery (Second execution with same stripeSessionId)
  const payment2 = await processSuccessfulPayment(
    {
      reportId: built.reportId,
      stripeSessionId,
      customerEmail: 'kari@smilia.no',
      customerName: 'Dr. Kari Nordmann',
      customerPhone: '912 34 567',
      amountOre: 149000,
    },
    db
  );

  const dbOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.reportId, built.reportId));
  const dbLeads = await db
    .select()
    .from(leads)
    .where(eq(leads.reportId, built.reportId));
  const [unlockedReportRow] = await db
    .select()
    .from(reports)
    .where(eq(reports.id, built.reportId))
    .limit(1);

  console.log(`Order ID:          ${payment1.orderId} (status=${dbOrders[0]?.status}, amount=${dbOrders[0]?.amount} øre)`);
  console.log(`Lead ID:           ${payment1.leadId} (owner=${dbLeads[0]?.owner}, status=${dbLeads[0]?.status}, contact=${dbLeads[0]?.contactName})`);
  console.log(`Report UnlockedAt: ${unlockedReportRow?.unlockedAt?.toISOString()}`);
  console.log(
    `Webhook Idempotency (2 deliveries): Orders=${dbOrders.length}, Leads=${dbLeads.length}, Same LeadId=${payment1.leadId === payment2.leadId ? '✅ YES' : '❌ NO'}\n`
  );

  // 4. Generate PDF for unlocked report
  console.log('====================================================================');
  console.log('STEP 3: PDF GENERATION & DATABASE PERSISTENCE');
  console.log('====================================================================');
  const pdfResult = await generateReportPdf(built.slug, {
    db,
    baseUrl: 'http://localhost:3000',
  });

  const [reportWithPdf] = await db
    .select()
    .from(reports)
    .where(eq(reports.id, built.reportId))
    .limit(1);

  const isPdfHeaderValid = pdfResult.pdfBuffer.subarray(0, 5).toString('ascii') === '%PDF-';

  console.log(`PDF Engine Used:   ${pdfResult.engine}`);
  console.log(`PDF File Path:     ${reportWithPdf?.pdfPath}`);
  console.log(`PDF Byte Size:     ${pdfResult.pdfBuffer.byteLength} bytes`);
  console.log(`PDF Header Valid:  ${isPdfHeaderValid ? '✅ %PDF-1.4 Verified' : '❌ Invalid'}\n`);

  if (
    !blockedWhenLocked ||
    dbOrders.length !== 1 ||
    dbLeads.length !== 1 ||
    !unlockedReportRow?.unlockedAt ||
    !isPdfHeaderValid
  ) {
    process.exit(1);
  }

  console.log('✅ All Skive 5 (Part 2) payment, unlock, lead & PDF checks passed!\n');
  process.exit(0);
}

verifyPaymentUnlockAndPdf().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
