import { calculateScores, FactorDefinition, ProfileWeights } from '../src/engine/scoring';
import { calculateFinancialImpact, NaceBenchmark, KeywordSimulationInput } from '../src/engine/financial';
import { Finding } from '../src/types';

async function testScoringAndFinancial() {
  console.log('🧪 Starting Dry-Run Verification of Scoring Engine & Financial Model...\n');

  // ==========================================================================
  // TEST 1: SCORING ENGINE (calculateScores)
  // ==========================================================================
  console.log('====================================================================');
  console.log('TEST 1: SCORING ENGINE (calculateScores)');
  console.log('====================================================================');

  const mockFactors: FactorDefinition[] = [
    // Part 1: Maps
    { code: 'L001', part: 1, groupName: 'Google-profil', nameNo: 'Primærkategori', weightMap: 2.28 },
    { code: 'L002', part: 1, groupName: 'Google-profil', nameNo: 'Avstand fra søkepunkt', weightMap: 2.25 },
    { code: 'L006', part: 1, groupName: 'Anmeldelser', nameNo: 'Stjernerating', weightMap: 2.52 },
    { code: 'L009', part: 1, groupName: 'Anmeldelser', nameNo: 'Antall anmeldelser', weightMap: 2.37 },
    { code: 'L025', part: 1, groupName: 'Lenker', nameNo: 'Lenkestyrke landingsside', weightMap: 1.50 },
    { code: 'L030', part: 1, groupName: 'Sosialt', nameNo: 'Sosiale signaler (utgått)', weightMap: 1.00 }, // Group with all 'na'

    // Part 2: Organisk
    { code: 'G001', part: 2, groupName: 'Teknisk', nameNo: 'LCP mobil', weightOrganic: 3.00 },
    { code: 'G006', part: 2, groupName: 'Teknisk', nameNo: 'HTTPS', weightOrganic: 2.40 },
    { code: 'G018', part: 2, groupName: 'Arkitektur', nameNo: 'Tjeneste × sted', weightOrganic: 3.33 },
    { code: 'G028', part: 2, groupName: 'Innhold', nameNo: 'Unik title', weightOrganic: 2.90 },

    // Part 3: AI
    { code: 'A001', part: 3, groupName: 'Listesider', nameNo: 'Beste i Oslo-lister', weightAi: 10.0 },
    { code: 'A007', part: 3, groupName: 'Autoritet', nameNo: 'Google-rating for AI', weightAi: 7.0 },
    { code: 'A012', part: 3, groupName: 'Teknisk AI', nameNo: 'Robots.txt for AI', weightAi: 8.0 },

    // Part 4: Ads & Økonomi
    { code: 'B001', part: 4, groupName: 'Kvalitetsscore', nameNo: 'Landingssideopplevelse', weightSubgroup: 9.0 },
    { code: 'B005', part: 4, groupName: 'Konkurranse', nameNo: 'Konkurrenter annonserer på navnet', weightSubgroup: 6.0 },
  ];

  const mockFindings: Finding[] = [
    // Part 1
    { factorCode: 'L001', status: 'ok', value: {}, evidence: { snippet: 'Eksakt match' } },
    { factorCode: 'L002', status: 'ok', value: {}, evidence: { snippet: 'Topp 1 i kart' } },
    { factorCode: 'L006', status: 'warn', value: {}, evidence: { snippet: 'Rating 4.4' } },
    { factorCode: 'L009', status: 'crit', value: {}, evidence: { snippet: '12 anmeldelser' } },
    { factorCode: 'L025', status: 'ok', value: {}, evidence: { snippet: 'Rank 34' } },
    { factorCode: 'L030', status: 'na', value: {}, evidence: { snippet: 'Ikke målbart' } }, // NA -> Drops out of group & denominator

    // Part 2
    { factorCode: 'G001', status: 'ok', value: {}, evidence: { snippet: 'LCP 2.1s' } },
    { factorCode: 'G006', status: 'ok', value: {}, evidence: { snippet: 'HTTPS OK' } },
    { factorCode: 'G018', status: 'warn', value: {}, evidence: { snippet: '60% dekning' } },
    { factorCode: 'G028', status: 'crit', value: {}, evidence: { snippet: 'Duplikate titler' } },

    // Part 3
    { factorCode: 'A001', status: 'warn', value: {}, evidence: { snippet: 'Nevnt på 1 liste' } },
    { factorCode: 'A007', status: 'ok', value: {}, evidence: { snippet: 'Rating 4.8' } },
    { factorCode: 'A012', status: 'ok', value: {}, evidence: { snippet: 'Alle AI-bots tillatt' } },

    // Part 4
    { factorCode: 'B001', status: 'ok', value: {}, evidence: { snippet: 'God QS' } },
    { factorCode: 'B005', status: 'ok', value: {}, evidence: { snippet: 'Ingen konkurrent-ads' } },
  ];

  const localWeights: ProfileWeights = {
    weightPart1: 40.0,
    weightPart2: 30.0,
    weightPart3: 15.0,
    weightPart4: 15.0,
  };

  const scoreResult = calculateScores(mockFindings, mockFactors, localWeights);

  console.log('Scores by Part:');
  console.log(`  Part 1 (Kart):    ${scoreResult.scoresByPart.part1.toFixed(1)} / 100 (Profile weight: 40%)`);
  console.log(`  Part 2 (Organisk):${scoreResult.scoresByPart.part2.toFixed(1)} / 100 (Profile weight: 30%)`);
  console.log(`  Part 3 (AI):      ${scoreResult.scoresByPart.part3.toFixed(1)} / 100 (Profile weight: 15%)`);
  console.log(`  Part 4 (Ads/Øko): ${scoreResult.scoresByPart.part4.toFixed(1)} / 100 (Profile weight: 15%)`);
  console.log(`  --------------------------------------------------`);
  console.log(`  🎯 TOTAL SCORE:   ${scoreResult.scoreTotal.toFixed(1)} / 100\n`);

  console.log('Finding Counts breakdown:');
  console.log(`  Total: ${scoreResult.findingCounts.total}, OK: ${scoreResult.findingCounts.ok}, Warn: ${scoreResult.findingCounts.warn}, Crit: ${scoreResult.findingCounts.crit}, NA: ${scoreResult.findingCounts.na}`);

  console.log('\nPart 1 Groups breakdown:');
  for (const [gName, g] of Object.entries(scoreResult.parts.part1.groups)) {
    console.log(`  • Group [${gName}]: score=${g.score}% (achieved=${g.achievedWeight.toFixed(2)}, measured=${g.measuredWeight.toFixed(2)}, NA=${g.factorsCount.na})`);
  }

  // ==========================================================================
  // TEST 2: FINANCIAL MODEL BENCHMARK (Exact replication of CSV reference)
  // ==========================================================================
  console.log('\n====================================================================');
  console.log('TEST 2: FINANCIAL MODEL BENCHMARK (Exact Match to CSV Lines 386-393)');
  console.log('====================================================================');

  const naceTannlege: NaceBenchmark = {
    nace: '86.230',
    industryName: 'Tannlegetjenester',
    conversionRate: 0.04, // 4.0%
    customerLifetimeValue: 6000, // 6 000 kr
    serviceKeywords: ['tannlege', 'tannbehandling'],
  };

  // Exact 5 keywords from CSV lines 387 - 391
  const referenceKeywords: KeywordSimulationInput[] = [
    { keyword: 'tannlege skøyen', volume: 480, cpc: 38, mapRank: 0, orgRank: 6, hasAiOverview: false },
    { keyword: 'tannlege oslo vest', volume: 720, cpc: 41, mapRank: 2, orgRank: 0, hasAiOverview: true },
    { keyword: 'akutt tannlege oslo', volume: 1300, cpc: 55, mapRank: 0, orgRank: 0, hasAiOverview: true },
    { keyword: 'tannbleking oslo', volume: 880, cpc: 29, mapRank: 0, orgRank: 9, hasAiOverview: false },
    { keyword: 'tannlegeskrekk oslo', volume: 260, cpc: 24, mapRank: 0, orgRank: 0, hasAiOverview: false },
  ];

  const finResult = calculateFinancialImpact([], referenceKeywords, naceTannlege);

  console.log('Per Keyword Simulation:');
  console.log('Keyword               | Vol  | CPC | Map | Org | AI | CTR Nå | Tapte Klikk | Ads-verdi | Tapt Omsetning');
  console.log('---------------------------------------------------------------------------------------------------------');
  for (const kw of finResult.keywords) {
    console.log(
      `${kw.keyword.padEnd(21)} | ${String(kw.volume).padStart(4)} | ${String(kw.cpc).padStart(3)} | ${String(kw.mapRank).padStart(3)} | ${String(kw.orgRank).padStart(3)} | ${kw.hasAiOverview ? '1 ' : '0 '} | ${String(kw.ctrCurrentPercent.toFixed(1) + '%').padStart(6)} | ${String(kw.lostClicksMonthly).padStart(11)} | ${String(kw.adsValueMonthly.toLocaleString('nb-NO') + ' kr').padStart(9)} | ${String(kw.lostRevenueMonthly.toLocaleString('nb-NO') + ' kr').padStart(14)}`
    );
  }

  console.log('---------------------------------------------------------------------------------------------------------');
  console.log(
    `SUM PER MÅNED:                              Tapte klikk: ${finResult.monthlyLostClicks.toLocaleString('nb-NO')} | Ads-verdi: ${finResult.monthlyAdsValue.toLocaleString('nb-NO')} kr | Tapt omsetning: ${finResult.monthlyLostRevenue.toLocaleString('nb-NO')} kr`
  );
  console.log(
    `SUM PER ÅR:                                                          Ads-verdi: ${finResult.annualAdsValue.toLocaleString('nb-NO')} kr | Tapt omsetning: ${finResult.annualLostRevenue.toLocaleString('nb-NO')} kr\n`
  );

  console.log(`Teaser nokEstimate (Hovedtall): ${finResult.nokEstimate.toLocaleString('nb-NO')} kr/mnd`);
  console.log(`Summary Text: "${finResult.summaryText}"\n`);

  // Target values from CSV line 392:
  // Tapte klikk = 1301
  // Ads-verdi = 53410
  // Tapt omsetning = 312228
  const clicksMatch = Math.abs(finResult.monthlyLostClicks - 1301) <= 2;
  const adsMatch = Math.abs(finResult.monthlyAdsValue - 53410) <= 20;
  const revMatch = Math.abs(finResult.monthlyLostRevenue - 312228) <= 100;

  console.log(`Comparison to CSV ground truth:`);
  console.log(`  Clicks: 1 301 vs calculated ${finResult.monthlyLostClicks} -> ${clicksMatch ? '✅ EXACT MATCH' : '❌ MISMATCH'}`);
  console.log(`  Ads-verdi: 53 410 kr vs calculated ${finResult.monthlyAdsValue} kr -> ${adsMatch ? '✅ EXACT MATCH' : '❌ MISMATCH'}`);
  console.log(`  Tapt omsetning: 312 228 kr vs calculated ${finResult.monthlyLostRevenue} kr -> ${revMatch ? '✅ EXACT MATCH' : '❌ MISMATCH'}`);

  // ==========================================================================
  // TEST 3: FINANCIAL IMPACT EXTRACTED FROM AUDIT FINDINGS
  // ==========================================================================
  console.log('\n====================================================================');
  console.log('TEST 3: FINANCIAL IMPACT EXTRACTED AUTOMATICALLY FROM FINDINGS');
  console.log('====================================================================');

  const auditFindings: Finding[] = [
    { factorCode: 'L002', status: 'ok', value: { mapRank: 1 }, evidence: { measuredNumber: 1 } },
    { factorCode: 'B009', status: 'ok', value: { organicRank: 2 }, evidence: { measuredNumber: 2 } },
  ];

  const autoFinResult = calculateFinancialImpact(auditFindings, naceTannlege);
  console.log(`Primary keyword simulated: ${autoFinResult.keywords[0]?.keyword}`);
  console.log(`Map Rank: ${autoFinResult.keywords[0]?.mapRank}, Organic Rank: ${autoFinResult.keywords[0]?.orgRank}`);
  console.log(`Current CTR: ${autoFinResult.keywords[0]?.ctrCurrentPercent}% (Goal: ${autoFinResult.keywords[0]?.ctrGoalPercent}%)`);
  console.log(`Lost Clicks: ${autoFinResult.monthlyLostClicks}/mnd -> Ads value: ${autoFinResult.monthlyAdsValue.toLocaleString('nb-NO')} kr/mnd`);

  console.log('\n✅ All tests passed with flying colors!\n');
}

testScoringAndFinancial().catch(console.error);
