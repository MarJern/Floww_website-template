import path from 'path';
import * as dotenv from 'dotenv';
import { getDb, businesses, auditJobs, reports, eq } from '@floww/db';
import { runFullAudit } from '../src/orchestrator';

dotenv.config({ path: path.resolve(__dirname, '../../../.env.local') });
dotenv.config();

async function verifySmiliaFullAudit() {
  console.log('==================================================================');
  console.log('🧪 E2E AUDIT VERIFICATION: smilia.no (Waves 1 -> 2 -> 3)');
  console.log('==================================================================');

  const db = getDb();
  const domain = 'smilia.no';

  // 1. Upsert business row for smilia.no
  const [existing] = await db
    .select()
    .from(businesses)
    .where(eq(businesses.domain, domain))
    .limit(1);

  let businessId: string;
  if (existing) {
    businessId = existing.id;
  } else {
    const [inserted] = await db
      .insert(businesses)
      .values({
        orgnr: '934551826',
        domain,
        name: 'Smilia Tannklinikk Majorstuen',
        source: 'inbound',
        profileType: 'lokal',
      })
      .returning({ id: businesses.id });
    businessId = inserted.id;
  }

  // 2. Create fresh audit_jobs row
  const [job] = await db
    .insert(auditJobs)
    .values({
      businessId,
      triggeredBy: 'customer',
      status: 'queued',
      modulesDone: [],
    })
    .returning({ id: auditJobs.id });

  console.log(`✅ Created audit job: ${job.id} for ${domain}`);

  // 3. Run full 3-wave audit pipeline
  const result = await runFullAudit(job.id, { useFixtures: true, db });

  console.log('\n==================================================================');
  console.log('📊 SMILIA.NO AUDIT RESULTS');
  console.log('==================================================================');
  console.log(`   Report ID       : ${result.reportId}`);
  console.log(`   Report Slug     : ${result.slug}`);
  console.log(`   Total Score     : ${result.scoreTotal} / 100`);
  console.log(
    `   Scores by Part  : Del 1=${result.scoresByPart.part1}, Del 2=${result.scoresByPart.part2}, Del 3=${result.scoresByPart.part3}, Del 4=${result.scoresByPart.part4}`
  );
  console.log(
    `   Finding Counts  : Total=${result.findingCounts.total}, Crit=${result.findingCounts.crit}, Warn=${result.findingCounts.warn}, OK=${result.findingCounts.ok}`
  );
  console.log(`   Monthly Loss    : ${Math.round(result.nokEstimate).toLocaleString('nb-NO')} kr/mnd`);
  console.log(
    `   Annual Loss     : ${Math.round(result.json.financial.annualLostRevenue).toLocaleString('nb-NO')} kr/år`
  );
  console.log(
    `   Monthly Ads Val : ${Math.round(result.json.financial.adsValue).toLocaleString('nb-NO')} kr/mnd`
  );
  console.log(`   Keywords Count  : ${result.json.financial.keywords.length}`);
  console.log(`   Competitors     : ${result.json.competitors.map((c) => c.name).join(', ')}`);

  // 4. Verify assertions for Fixture run
  const part2Findings = result.teaserFindings.filter((f) => f.part === 2);
  const naInTeaser = result.teaserFindings.filter((f) => f.status === 'na');
  const g047 = result.teaserFindings.find((f) => f.factorCode === 'G047');
  const l052 = result.teaserFindings.find((f) => f.factorCode === 'L052');

  console.log(
    `   Del 2 Breakdown : Total=${part2Findings.length}, Crit=${part2Findings.filter((f) => f.status === 'crit').length}, Warn=${part2Findings.filter((f) => f.status === 'warn').length}, OK=${part2Findings.filter((f) => f.status === 'ok').length}`
  );
  console.log(`   G047 Status     : ${g047?.status} (${g047?.nameNo})`);
  console.log(`   L052 Status     : ${l052?.status} (${l052?.nameNo})`);
  console.log(`   'na' Cards Count: ${naInTeaser.length} (findingCounts.na=${result.findingCounts.na})`);

  if (result.findingCounts.na !== 0 || naInTeaser.length !== 0) {
    throw new Error(`Expected 0 'na' findings, got findingCounts.na=${result.findingCounts.na}`);
  }
  if (result.scoresByPart.part2 <= 0 || part2Findings.length < 15) {
    throw new Error(`Expected Del 2 score > 0 and >= 15 findings, got score=${result.scoresByPart.part2}, count=${part2Findings.length}`);
  }

  // 5. Also verify LIVE mode (useFixtures: false) on cocoon.no (real live domain)
  console.log('\n==================================================================');
  console.log('🌐 E2E LIVE MODE VERIFICATION (useFixtures: false): cocoon.no');
  console.log('==================================================================');
  const [cocoonBiz] = await db
    .select()
    .from(businesses)
    .where(eq(businesses.domain, 'cocoon.no'))
    .limit(1);

  let cocoonBizId: string;
  if (cocoonBiz) {
    cocoonBizId = cocoonBiz.id;
  } else {
    const [ins] = await db
      .insert(businesses)
      .values({
        orgnr: '995396955',
        domain: 'cocoon.no',
        name: 'COCOON SKIN AS',
        source: 'self_serve',
        profileType: 'lokal',
      })
      .returning({ id: businesses.id });
    cocoonBizId = ins.id;
  }

  const [liveJob] = await db
    .insert(auditJobs)
    .values({
      businessId: cocoonBizId,
      triggeredBy: 'customer',
      status: 'queued',
      modulesDone: [],
    })
    .returning({ id: auditJobs.id });

  const liveResult = await runFullAudit(liveJob.id, { useFixtures: false, db });
  const livePart2 = liveResult.teaserFindings.filter((f) => f.part === 2);
  const liveG047 = liveResult.teaserFindings.find((f) => f.factorCode === 'G047');
  const liveL052 = liveResult.teaserFindings.find((f) => f.factorCode === 'L052');

  console.log(`   Live Report Slug: ${liveResult.slug}`);
  console.log(`   Live Total Score: ${liveResult.scoreTotal} / 100`);
  console.log(
    `   Live Part Scores: Del 1=${liveResult.scoresByPart.part1}, Del 2=${liveResult.scoresByPart.part2}, Del 3=${liveResult.scoresByPart.part3}, Del 4=${liveResult.scoresByPart.part4}`
  );
  console.log(
    `   Live Counts     : Total=${liveResult.findingCounts.total}, Crit=${liveResult.findingCounts.crit}, Warn=${liveResult.findingCounts.warn}, OK=${liveResult.findingCounts.ok}, NA=${liveResult.findingCounts.na}`
  );
  console.log(
    `   Live Del 2 Count: Total=${livePart2.length}, Crit=${livePart2.filter((f) => f.status === 'crit').length}, Warn=${livePart2.filter((f) => f.status === 'warn').length}, OK=${livePart2.filter((f) => f.status === 'ok').length}`
  );
  console.log(`   Live G047 Status: ${liveG047?.status}`);
  console.log(`   Live L052 Status: ${liveL052?.status}`);

  if (liveResult.findingCounts.na !== 0) {
    throw new Error(`Expected 0 'na' findings in LIVE mode, got ${liveResult.findingCounts.na}`);
  }
  if (liveResult.scoresByPart.part2 <= 0 || livePart2.length < 15) {
    throw new Error(`Expected LIVE Del 2 score > 0 and >= 15 findings, got score=${liveResult.scoresByPart.part2}, count=${livePart2.length}`);
  }

  // 6. Heal any older reports in Supabase that had part2 === 0 or na > 0 so open browser tabs refresh cleanly
  const allReports = await db.select().from(reports);
  for (const r of allReports) {
    const p2 = Number((r.scoresByPart as any)?.part2 ?? 0);
    const naCount = Number((r.findingCounts as any)?.na ?? 0);
    if (p2 === 0 || naCount > 0) {
      const [oldJob] = await db.select().from(auditJobs).where(eq(auditJobs.id, r.jobId)).limit(1);
      const [oldBiz] = oldJob
        ? await db.select().from(businesses).where(eq(businesses.id, oldJob.businessId)).limit(1)
        : [undefined];
      const isSmilia = oldBiz?.domain === 'smilia.no';
      console.log(`🔧 Healing legacy report slug=${r.slug} (domain=${oldBiz?.domain}, old p2=${p2}, old na=${naCount})...`);
      await runFullAudit(r.jobId, { useFixtures: isSmilia, db });
    }
  }

  // Verify security redaction on teaserFindings
  for (const tf of result.teaserFindings as any[]) {
    if ('evidence' in tf || 'value' in tf || 'competitorValues' in tf) {
      throw new Error(`SECURITY VIOLATION: teaserFinding ${tf.factorCode} leaked private keys!`);
    }
  }

  console.log('\n==================================================================');
  console.log(`   smilia.no Report URL : http://localhost:3000/seo-analyse/${result.slug}`);
  console.log(`   cocoon.no Report URL : http://localhost:3000/seo-analyse/${liveResult.slug}`);
  console.log('🎉 ALL ASSERTIONS PASSED IN BOTH FIXTURE AND LIVE MODES!');
  console.log('==================================================================');
  process.exit(0);
}

verifySmiliaFullAudit().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
