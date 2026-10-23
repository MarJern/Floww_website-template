import path from 'path';
import * as dotenv from 'dotenv';
import { assembleReport } from '../src/engine/report';
import { resolveModule } from '../src/modules/resolve';
import { gbpModule } from '../src/modules/gbp';
import { crawlModule } from '../src/modules/crawl';
import { speedModule } from '../src/modules/speed';
import { serpModule } from '../src/modules/serp';
import { linksModule } from '../src/modules/links';
import { citationsModule } from '../src/modules/citations';
import { mentionsModule } from '../src/modules/mentions';
import { aiModule } from '../src/modules/ai';
import { AuditContext, Finding } from '../src/types';
import { FactorDefinition } from '../src/engine/scoring';

dotenv.config({ path: path.resolve(__dirname, '../../../.env.local') });
dotenv.config();

async function verifyEndToEndPipeline() {
  console.log('🧪 Starting End-to-End Orchestrator Pipeline Verification (Waves 1 -> 2 -> 3)...\n');

  const rawMap = new Map<string, unknown>();
  const completedModules: string[] = [];

  const ctx: AuditContext = {
    jobId: 'e2e-orchestrator-test-001',
    domain: 'smilia.no',
    business: {
      domain: 'smilia.no',
      name: 'Smilia Tannklinikk',
      source: 'self_serve',
      profileType: 'lokal',
    },
    raw: <T = unknown>(mod: string) => rawMap.get(mod) as T | undefined,
    saveRaw: async (mod, payload) => {
      rawMap.set(mod, payload);
    },
    log: (msg) => console.log(`   ${msg}`),
    useFixtures: true,
    fixturesDir: path.resolve(__dirname, '../fixtures'),
  };

  // Wave 1: Resolve
  console.log('🌊 [Wave 1] Executing resolveModule...');
  const resolveRes = await resolveModule.run(ctx);
  if (resolveRes.businessUpdates) {
    Object.assign(ctx.business, resolveRes.businessUpdates);
  }
  completedModules.push('resolve');

  const findingsMap = new Map<string, Finding>();
  for (const f of resolveRes.findings) {
    findingsMap.set(f.factorCode, f);
  }

  // Wave 2: 8 Concurrent Modules
  console.log('\n🌊 [Wave 2] Executing 8 modules concurrently via Promise.allSettled...');
  const wave2 = [
    gbpModule,
    crawlModule,
    speedModule,
    serpModule,
    linksModule,
    citationsModule,
    mentionsModule,
    aiModule,
  ];

  const settled = await Promise.allSettled(
    wave2.map(async (mod) => {
      const res = await mod.run(ctx);
      completedModules.push(mod.name);
      return { name: mod.name, findings: res.findings };
    })
  );

  for (const s of settled) {
    if (s.status === 'fulfilled') {
      for (const f of s.value.findings) {
        findingsMap.set(f.factorCode, f);
      }
    }
  }

  const allFindings = Array.from(findingsMap.values());
  const syntheticFactors: FactorDefinition[] = allFindings.map((f) => {
    const p = f.factorCode.startsWith('L')
      ? 1
      : f.factorCode.startsWith('G')
        ? 2
        : f.factorCode.startsWith('A')
          ? 3
          : f.factorCode.startsWith('B')
            ? 4
            : 5;
    return {
      code: f.factorCode,
      part: p,
      groupName:
        p === 1
          ? 'Google-profil & Lokalt'
          : p === 2
            ? 'Teknisk & Innhold'
            : p === 3
              ? 'AI-synlighet'
              : p === 4
                ? 'Google Ads & Økonomi'
                : 'Røde flagg',
      nameNo: `Faktor ${f.factorCode}`,
      weightMap: 2.0,
      weightOrganic: 2.5,
      weightAi: 3.0,
      weightSubgroup: 5.0,
    };
  });

  // Wave 3: Report Assembly & Redaction
  console.log('\n🧮 [Wave 3] Assembling report & redacting teaserFindings...');
  const assembled = assembleReport({
    jobId: ctx.jobId,
    business: ctx.business,
    findings: allFindings,
    factors: syntheticFactors,
  });
  completedModules.push('score');

  console.log('\n====================================================================');
  console.log('ORCHESTRATOR PIPELINE SUMMARY');
  console.log('====================================================================');
  console.log(`Modules Completed (${completedModules.length}/10): ${completedModules.join(' -> ')}`);
  console.log(`Resolved Business:    ${ctx.business.name} (Orgnr: ${ctx.business.orgnr}, NACE: ${ctx.business.nace})`);
  console.log(`Report Slug:          ${assembled.slug} (${assembled.slug.length} chars)`);
  console.log(`Total Score:          ${assembled.scoreTotal} / 100`);
  console.log(`Scores By Part:       ${JSON.stringify(assembled.scoresByPart)}`);
  console.log(`Finding Counts:       ${JSON.stringify(assembled.findingCounts)}`);
  console.log(`Monthly Lost Revenue: ${assembled.nokEstimate.toLocaleString('nb-NO')} kr/mnd`);
  console.log(`3 Plaintext Hooks:    ${assembled.teaserHighlights.map((h) => `${h.factorCode} (${h.status})`).join(', ')}`);

  const anyLeak = assembled.teaserFindings.some(
    (tf) => 'evidence' in tf || 'value' in tf || 'competitorValues' in tf
  );
  console.log(`Redaction Security:   ${anyLeak ? '❌ LEAK' : '✅ ZERO LEAKS across all ' + assembled.teaserFindings.length + ' findings'}`);
}

verifyEndToEndPipeline().catch((err) => {
  console.error(err);
  process.exit(1);
});
