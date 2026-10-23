import { speedModule } from '../src/modules/speed';
import { aiModule } from '../src/modules/ai';
import { AuditContext } from '../src/types';

async function testSpeedAndAi() {
  console.log('🧪 Testing speed.ts and ai.ts modules...');

  const ctx: AuditContext = {
    jobId: 'test-speed-ai-job',
    domain: 'smilia.no',
    business: {
      name: 'Smilia Tannklinikk',
      city: 'Oslo',
      nace: '86.230',
      naceName: 'Tannlegetjenester',
      address: 'Sørkedalsveien 11G',
    },
    raw: () => undefined,
    saveRaw: async (mod, p) => console.log(`💾 Saved raw for: ${mod}`),
    log: (msg) => console.log(`[LOG] ${msg}`),
    useFixtures: false,
  };

  // 1. TEST AI MODULE
  console.log('\n--- 1. TESTING AI MODULE ---');
  const aiRes = await aiModule.run(ctx);
  console.log('AI Factors Count:', aiRes.findings.length);
  for (const f of aiRes.findings) {
    console.log(`[${f.factorCode}] status=${f.status.toUpperCase()} evidence="${f.evidence.snippet}"`);
  }

  // 2. TEST SPEED MODULE (With safe fallback/fixture)
  console.log('\n--- 2. TESTING SPEED MODULE ---');
  ctx.useFixtures = true; // Use fixture or safe fallback
  const speedRes = await speedModule.run(ctx);
  console.log('Speed Factors Count:', speedRes.findings.length);
  for (const f of speedRes.findings) {
    console.log(`[${f.factorCode}] status=${f.status.toUpperCase()} evidence="${f.evidence.snippet}"`);
  }
}

testSpeedAndAi().catch(console.error);
