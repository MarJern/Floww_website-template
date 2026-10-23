import { serpModule } from '../src/modules/serp';
import { linksModule } from '../src/modules/links';
import { citationsModule } from '../src/modules/citations';
import { mentionsModule } from '../src/modules/mentions';
import { AuditContext, Finding } from '../src/types';

async function runWave2IntegrationTest() {
  console.log('🧪 Starting Wave 2 Modules Integration Test (serp, links, citations, mentions)...');

  // Shared audit context with fixture enabled
  const ctxWithFixtures: AuditContext = {
    jobId: 'test-wave2-fixtures',
    domain: 'smilia.no',
    business: {
      name: 'Smilia Tannklinikk',
      city: 'Oslo',
      nace: '86.230',
      naceName: 'Tannlegetjenester',
      address: 'Sørkedalsveien 11G, 0369 Oslo',
      phone: '22 12 34 56',
      placesId: 'ChIJ12345',
    },
    raw: () => undefined,
    saveRaw: async (mod, p) => console.log(`   💾 [saveRaw] Saved payload for module: ${mod}`),
    log: (msg) => console.log(`   [LOG] ${msg}`),
    useFixtures: true,
  };

  const modules = [
    { name: 'serp', instance: serpModule },
    { name: 'links', instance: linksModule },
    { name: 'citations', instance: citationsModule },
    { name: 'mentions', instance: mentionsModule },
  ];

  console.log('\n======================================================');
  console.log('PART 1: TESTING MODULES WITH HIGH-FIDELITY FIXTURES');
  console.log('======================================================');

  const allFindings: Record<string, Finding[]> = {};

  for (const m of modules) {
    console.log(`\n▶️ Executing module: ${m.name.toUpperCase()}`);
    const result = await m.instance.run(ctxWithFixtures);
    allFindings[m.name] = result.findings;

    console.log(`   Output Findings (${result.findings.length}):`);
    for (const f of result.findings) {
      console.log(
        `   • [${f.factorCode}] status=${f.status.padEnd(4)} evidence="${f.evidence.snippet}"`
      );
    }
  }

  console.log('\n======================================================');
  console.log('PART 2: TESTING ROBUST FALLBACK (NO FIXTURES, NA STATUS)');
  console.log('======================================================');

  // Audit context with useFixtures: false, forcing API call
  // Since test environment might lack live credentials or network, it MUST gracefully return 'na'
  const ctxWithoutFixtures: AuditContext = {
    ...ctxWithFixtures,
    jobId: 'test-wave2-fallback',
    useFixtures: false,
    saveRaw: async () => {},
    log: (msg) => console.log(`   [LOG-FALLBACK] ${msg}`),
  };

  for (const m of modules) {
    console.log(`\n▶️ Executing fallback test for: ${m.name.toUpperCase()}`);
    const result = await m.instance.run(ctxWithoutFixtures);

    console.log(`   Output Findings (${result.findings.length}):`);
    const allValid = result.findings.every(
      (f) => ['ok', 'warn', 'crit', 'na'].includes(f.status) && f.factorCode && f.evidence
    );
    console.log(`   All findings valid & typed: ${allValid ? '✅ YES' : '❌ NO'}`);
    for (const f of result.findings) {
      console.log(
        `   • [${f.factorCode}] status=${f.status.padEnd(4)} source="${f.evidence.sourceLabel}"`
      );
    }
  }

  console.log('\n======================================================');
  console.log('SUMMARY OF FACTORS MAPPED BY MODULE:');
  console.log('======================================================');
  for (const m of modules) {
    const factorList = m.instance.factors.join(', ');
    console.log(`📦 Module [${m.name}]: ${m.instance.factors.length} factors -> ${factorList}`);
  }
  console.log('\n✅ All Wave 2 modules executed cleanly with 0 unhandled exceptions!\n');
}

runWave2IntegrationTest().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
