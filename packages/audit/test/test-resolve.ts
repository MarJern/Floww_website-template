import { resolveModule } from '../src/modules/resolve';
import { AuditContext } from '../src/types';

async function test() {
  console.log('Testing resolveModule on flowwmedia.no...');

  const ctx: AuditContext = {
    jobId: 'test-job-123',
    domain: 'flowwmedia.no',
    business: {},
    raw: () => undefined,
    saveRaw: async (mod, payload) => {
      console.log(`[saveRaw] Saved raw payload for module: ${mod}`);
    },
    log: (msg, meta) => {
      console.log(`[LOG] ${msg}`, meta || '');
    },
    useFixtures: false,
  };

  const result = await resolveModule.run(ctx);
  console.log('\n--- MODULE RESULT ---');
  console.log('Business Updates:', result.businessUpdates);
  console.log('Findings Count:', result.findings.length);
  console.log('Findings:', JSON.stringify(result.findings, null, 2));
}

test().catch(console.error);
