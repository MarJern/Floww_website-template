import { assembleReport } from '../src/engine/report';
import { FactorDefinition } from '../src/engine/scoring';
import { KeywordSimulationInput, NaceBenchmark } from '../src/engine/financial';
import { Finding } from '../src/types';

async function verifyReportBuilder() {
  console.log('🧪 Starting Skive 4 Report Builder Verification (Blurred Paywall & Security Redaction)...\n');

  const mockFactors: FactorDefinition[] = [
    { code: 'L001', part: 1, groupName: 'Google-profil', nameNo: 'Primærkategori på Google-profilen', weightMap: 2.28 },
    { code: 'L006', part: 1, groupName: 'Anmeldelser', nameNo: 'Gjennomsnittlig stjernerating', weightMap: 2.52 },
    { code: 'L009', part: 1, groupName: 'Anmeldelser', nameNo: 'Antall Google-anmeldelser', weightMap: 2.37 },
    { code: 'G001', part: 2, groupName: 'Teknisk', nameNo: 'LCP (Largest Contentful Paint), mobil', weightOrganic: 3.00 },
    { code: 'G018', part: 2, groupName: 'Arkitektur', nameNo: 'Tjeneste × sted-dekning', weightOrganic: 3.33 },
    { code: 'G030', part: 2, groupName: 'Innhold/on-page', nameNo: 'H1: én per side, med tjenesteord', weightOrganic: 2.26 },
    { code: 'A001', part: 3, groupName: 'Listesider', nameNo: 'På «beste i Oslo»-lister', weightAi: 10.0 },
    { code: 'A012', part: 3, groupName: 'Teknisk AI', nameNo: 'AI-roboter tillatt i robots.txt', weightAi: 8.0 },
    { code: 'B001', part: 4, groupName: 'Kvalitetsscore', nameNo: 'Landingssideopplevelse (Quality Score)', weightSubgroup: 9.0 },
    { code: 'B002', part: 4, groupName: 'Annonserelevans', nameNo: 'Annonserelevans: egen side per tjeneste', weightSubgroup: 10.0 },
  ];

  const mockFindings: Finding[] = [
    {
      factorCode: 'L001',
      status: 'ok',
      value: { primaryType: 'dentist', expected: 'dentist' },
      evidence: { sourceLabel: 'Places API', snippet: 'Primærkategori: Tannlege (dentist)' },
    },
    {
      factorCode: 'L006',
      status: 'warn',
      value: { rating: 4.3, competitorAvg: 4.8 },
      evidence: { measuredNumber: 4.3, snippet: '4,3 stjerner mot 4,8 i snitt hos topp 3' },
      competitorValues: { top1: 4.9, top2: 4.8, top3: 4.7 },
    },
    {
      factorCode: 'L009',
      status: 'crit',
      value: { reviewCount: 14, competitorAvg: 112 },
      evidence: { measuredNumber: 14, snippet: 'Kun 14 anmeldelser mot snitt på 112 i kartet' },
      competitorValues: { top1: 184, top2: 92, top3: 60 },
    },
    {
      factorCode: 'G001',
      status: 'warn',
      value: { lcpSeconds: 3.4 },
      evidence: { url: 'https://smilia.no', measuredNumber: 3.4, snippet: 'Mobil LCP målt til 3,4s' },
    },
    {
      factorCode: 'G018',
      status: 'crit',
      value: { coveragePercent: 25, missingPages: ['tannbleking skøyen', 'akutt tannlege oslo vest'] },
      evidence: { url: 'https://smilia.no/tjenester', measuredNumber: 25, snippet: 'Kun 3 av 12 tjeneste×sted-kombinasjoner har dedikert side' },
    },
    {
      factorCode: 'G030',
      status: 'crit',
      value: { pagesWithValidH1Percent: 42 },
      evidence: { url: 'https://smilia.no/om-oss', measuredNumber: 42, snippet: '58 % av sidene mangler unik H1 med tjenesteord' },
    },
    {
      factorCode: 'A001',
      status: 'crit',
      value: { listMentions: 0 },
      evidence: { snippet: 'Nevnt på 0 av 10 rangerte «beste tannlege Oslo»-artikler' },
    },
    {
      factorCode: 'A012',
      status: 'ok',
      value: { blockedBots: [] },
      evidence: { url: 'https://smilia.no/robots.txt', snippet: 'GPTBot, PerplexityBot og Google-Extended er tillatt' },
    },
    {
      factorCode: 'B001',
      status: 'warn',
      value: { mobileLcp: 3.4 },
      evidence: { measuredNumber: 3.4, snippet: 'LCP over 2,5s svekker Quality Score' },
    },
    {
      factorCode: 'B002',
      status: 'crit',
      value: { dedicatedAdLandingPagesPercent: 30 },
      evidence: { measuredNumber: 30, snippet: '70 % av søkeordene lander på generell forside fremfor tjenesteside' },
    },
  ];

  const referenceKeywords: KeywordSimulationInput[] = [
    { keyword: 'tannlege skøyen', volume: 480, cpc: 38, mapRank: 0, orgRank: 6, hasAiOverview: false },
    { keyword: 'tannlege oslo vest', volume: 720, cpc: 41, mapRank: 2, orgRank: 0, hasAiOverview: true },
    { keyword: 'akutt tannlege oslo', volume: 1300, cpc: 55, mapRank: 0, orgRank: 0, hasAiOverview: true },
    { keyword: 'tannbleking oslo', volume: 880, cpc: 29, mapRank: 0, orgRank: 9, hasAiOverview: false },
    { keyword: 'tannlegeskrekk oslo', volume: 260, cpc: 24, mapRank: 0, orgRank: 0, hasAiOverview: false },
  ];

  const naceTannlege: NaceBenchmark = {
    nace: '86.230',
    industryName: 'Tannlegetjenester',
    conversionRate: 0.04,
    customerLifetimeValue: 6000,
    serviceKeywords: ['tannlege', 'tannbehandling'],
  };

  const report = assembleReport({
    jobId: 'b7e6d100-4a9c-4e1a-9c52-8871a0000001',
    business: {
      orgnr: '921844102',
      domain: 'smilia.no',
      name: 'Smilia Tannklinikk AS',
      nace: '86.230',
      city: 'Oslo',
      profileType: 'lokal',
      source: 'self_serve',
    },
    findings: mockFindings,
    factors: mockFactors,
    keywords: referenceKeywords,
    naceBenchmark: naceTannlege,
  });

  console.log('====================================================================');
  console.log('1. REPORT METADATA & TOP-LEVEL AGGREGATES');
  console.log('====================================================================');
  console.log(`Slug (24 chars):   ${report.slug} (length: ${report.slug.length})`);
  console.log(`Total Score:       ${report.scoreTotal} / 100`);
  console.log(`Scores By Part:    ${JSON.stringify(report.scoresByPart)}`);
  console.log(`Finding Counts:    ${JSON.stringify(report.findingCounts)}`);
  console.log(`NOK Estimate:      ${report.nokEstimate.toLocaleString('nb-NO')} kr/mnd`);
  console.log(`Unlocked At:       ${report.unlockedAt}`);
  console.log(`PDF Path:          ${report.pdfPath}`);
  console.log(`Expires At:        ${report.expiresAt.toISOString()}\n`);

  console.log('====================================================================');
  console.log('2. THE 3 PLAINTEXT HOOKS (Teaser Highlights)');
  console.log('====================================================================');
  console.log(JSON.stringify(report.teaserHighlights, null, 2));

  console.log('\n====================================================================');
  console.log('3. REDACTED TEASER FINDINGS PAYLOAD (Public Teaser View)');
  console.log('====================================================================');
  console.log(JSON.stringify(report.teaserFindings, null, 2));

  // Security verification assertions
  const leakedEvidence = report.teaserFindings.some((f) => 'evidence' in f || 'value' in f || 'competitorValues' in f);
  const headlinesCount = report.teaserFindings.filter((f) => 'headline' in f).length;

  console.log('\n====================================================================');
  console.log('4. SECURITY & REDACTION AUDIT');
  console.log('====================================================================');
  console.log(`Total findings in teaserFindings: ${report.teaserFindings.length}`);
  console.log(`Plaintext hooks with headline:    ${headlinesCount} (Expected: 3)`);
  console.log(`Leaked 'evidence' / 'value' / 'competitorValues' in teaserFindings: ${leakedEvidence ? '❌ LEAK DETECTED' : '✅ ZERO LEAKS (Physically Stripped)'}`);
  console.log(`Unredacted findings preserved in locked json.findings: ${report.json.findings.every((f) => f.evidence !== undefined && f.value !== undefined) ? '✅ YES' : '❌ NO'}`);

  if (leakedEvidence || headlinesCount !== 3 || report.slug.length !== 24) {
    process.exit(1);
  }
}

verifyReportBuilder().catch((err) => {
  console.error(err);
  process.exit(1);
});
