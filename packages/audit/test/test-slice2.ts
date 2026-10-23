import { resolveModule } from '../src/modules/resolve';
import { gbpModule } from '../src/modules/gbp';
import { crawlModule } from '../src/modules/crawl';
import { AuditContext } from '../src/types';

async function runSlice2IntegrationTest() {
  console.log('🧪 =========================================================');
  console.log('🧪 SKIVE 2: DATA-GATHERING PIPELINE INTEGRATION TEST');
  console.log('🧪 Testing Resolve ➔ GBP ➔ Crawl on smilia.no (Fixtures)');
  console.log('🧪 =========================================================\n');

  const rawStore: Record<string, unknown> = {};

  const ctx: AuditContext = {
    jobId: 'test-job-skive2',
    domain: 'smilia.no',
    business: {},
    raw: <T>(mod: string) => rawStore[mod] as T,
    saveRaw: async (mod: string, payload: unknown) => {
      rawStore[mod] = payload;
      console.log(`💾 [Storage] Raw payload cached for: "${mod}"`);
    },
    log: (msg: string, meta?: unknown) => {
      console.log(`[LOG] ${msg}`, meta ? JSON.stringify(meta) : '');
    },
    useFixtures: true,
  };

  // 1. RUN WAVE 1: RESOLVE
  console.log('\n--- 1. EXECUTING WAVE 1: RESOLVE MODULE ---');
  const resolveRes = await resolveModule.run(ctx);
  Object.assign(ctx.business, resolveRes.businessUpdates);

  console.log('✅ Resolve completed:');
  console.log(`   - Entity: ${ctx.business.name} (Org: ${ctx.business.orgnr})`);
  console.log(`   - NACE: ${ctx.business.nace} (${ctx.business.naceName})`);
  console.log(`   - Profile Type: ${ctx.business.profileType}`);
  console.log(`   - Places ID: ${ctx.business.placesId}`);
  console.log(`   - Findings: ${resolveRes.findings.length} emitted`);

  // 2. RUN WAVE 2: GBP
  console.log('\n--- 2. EXECUTING WAVE 2: GBP MODULE ---');
  const gbpRes = await gbpModule.run(ctx);
  Object.assign(ctx.business, gbpRes.businessUpdates);

  console.log('✅ GBP completed:');
  console.log(`   - Factors measured: ${gbpRes.findings.length}`);
  for (const f of gbpRes.findings) {
    console.log(`     [${f.factorCode}] status=${f.status.toUpperCase()} evidence="${f.evidence.snippet}"`);
  }

  // 3. RUN WAVE 2: CRAWL
  console.log('\n--- 3. EXECUTING WAVE 2: CRAWL MODULE ---');
  const crawlRes = await crawlModule.run(ctx);

  console.log('✅ Crawl completed:');
  console.log(`   - Factors measured: ${crawlRes.findings.length}`);
  console.log(`   - Pages analyzed: ${crawlRes.metadata?.crawledPages}`);
  for (const f of crawlRes.findings) {
    console.log(`     [${f.factorCode}] status=${f.status.toUpperCase()} evidence="${f.evidence.snippet}"`);
  }

  // Summary Metrics
  const allFindings = [
    ...resolveRes.findings,
    ...gbpRes.findings,
    ...crawlRes.findings,
  ];

  console.log('\n🎉 =========================================================');
  console.log(`🎉 SKIVE 2 SUMMARY: ${allFindings.length} TOTAL FINDINGS PRODUCED`);
  console.log('🎉 Status breakdown:');
  const counts = allFindings.reduce(
    (acc, f) => {
      acc[f.status] = (acc[f.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  console.log(counts);
  console.log('🎉 =========================================================\n');
}

runSlice2IntegrationTest().catch(console.error);
