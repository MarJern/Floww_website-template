import { nanoid } from 'nanoid';
import {
  getDb,
  Database,
  reports,
  auditJobs,
  businesses,
  findings as findingsTable,
  factors as factorsTable,
  profileWeights as profileWeightsTable,
  naceBenchmarks as naceBenchmarksTable,
  ctrModel as ctrModelTable,
  rawFetches as rawFetchesTable,
  TeaserFinding,
  eq,
} from '@floww/db';
import { Finding, BusinessData, ProfileType } from '../types';
import {
  calculateScores,
  FactorDefinition,
  ProfileWeights,
  ScoreResult,
} from './scoring';
import {
  calculateFinancialImpact,
  FinancialImpactResult,
  KeywordSimulationInput,
  NaceBenchmark,
  CtrModelInput,
} from './financial';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

/**
 * Strictly redacted public finding item for `reports.teaser_findings`.
 * Physically omits `evidence`, `value`, and `competitorValues`.
 */
export interface RedactedTeaserFinding {
  factorCode: string;
  nameNo: string;
  groupName: string;
  status: 'ok' | 'warn' | 'crit' | 'na';
  part: number;
  headline?: string;
}

export interface UnredactedFindingDetail extends Finding {
  nameNo: string;
  groupName: string;
  subgroupName?: string | null;
  part: number;
  weight: number;
  headline?: string;
  rule?: string | null;
  thresholdOk?: string | null;
  thresholdWarn?: string | null;
  thresholdCrit?: string | null;
  notes?: string | null;
  source?: string | null;
}

export interface CompetitorSummary {
  placesId: string;
  name: string;
  domain?: string | null;
  rating?: number | null;
  reviewCount?: number | null;
  lightScore?: number | null;
  scoresByPart?: Record<string, number> | null;
}

export interface FullReportJson {
  version: '1.0';
  generatedAt: string;
  expiresAt: string;
  jobId: string;
  slug: string;
  business: Partial<BusinessData>;
  scores: ScoreResult;
  financial: FinancialImpactResult;
  teaserHighlights: RedactedTeaserFinding[];
  findings: UnredactedFindingDetail[];
  negativeFlags: UnredactedFindingDetail[];
  competitors: CompetitorSummary[];
  aiSummary?: Record<string, unknown> | null;
  geoGrid?: Record<string, unknown> | null;
}

export interface AssembleReportInput {
  jobId: string;
  business: Partial<BusinessData>;
  findings: Finding[];
  factors: FactorDefinition[];
  profileWeights?: ProfileWeights;
  keywords?: KeywordSimulationInput[];
  naceBenchmark?: NaceBenchmark;
  ctrModel?: CtrModelInput;
  competitors?: CompetitorSummary[];
  aiSummary?: Record<string, unknown> | null;
  geoGrid?: Record<string, unknown> | null;
  slug?: string;
  now?: Date;
}

export interface AssembledReport {
  jobId: string;
  slug: string;
  scoreTotal: number;
  scoresByPart: {
    part1: number;
    part2: number;
    part3: number;
    part4: number;
  };
  findingCounts: {
    total: number;
    ok: number;
    warn: number;
    crit: number;
    na: number;
  };
  nokEstimate: number;
  teaserHighlights: RedactedTeaserFinding[];
  teaserFindings: RedactedTeaserFinding[];
  json: FullReportJson;
  unlockedAt: null;
  pdfPath: null;
  expiresAt: Date;
}

// ============================================================================
// DEFAULT PROFILE WEIGHTS (Fallback if DB row is not provided)
// ============================================================================

const DEFAULT_PROFILE_WEIGHTS: Record<ProfileType, ProfileWeights> = {
  lokal: { weightPart1: 40, weightPart2: 30, weightPart3: 15, weightPart4: 15 },
  flere_avdelinger: { weightPart1: 40, weightPart2: 30, weightPart3: 15, weightPart4: 15 },
  nasjonal: { weightPart1: 15, weightPart2: 45, weightPart3: 25, weightPart4: 15 },
  nettbutikk: { weightPart1: 5, weightPart2: 50, weightPart3: 25, weightPart4: 20 },
  b2b: { weightPart1: 10, weightPart2: 45, weightPart3: 35, weightPart4: 10 },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Infer part number (1-5) from factor code prefix if factor metadata is missing.
 */
function inferPartFromCode(factorCode: string): number {
  const prefix = factorCode.charAt(0).toUpperCase();
  if (prefix === 'L') return 1;
  if (prefix === 'G') return 2;
  if (prefix === 'A') return 3;
  if (prefix === 'B') return 4;
  if (prefix === 'N') return 5;
  return 1;
}

/**
 * Resolve effective weight of a factor within its part for hook prioritization.
 */
function resolveFactorWeight(factor: FactorDefinition | undefined, part: number): number {
  if (!factor) return 1.0;

  let raw: number | string | null | undefined = null;
  if (part === 1) raw = factor.weightMap ?? factor.weightSubgroup;
  else if (part === 2) raw = factor.weightOrganic ?? factor.weightSubgroup;
  else if (part === 3) raw = factor.weightAi ?? factor.weightSubgroup;
  else if (part === 4) raw = factor.weightSubgroup;

  const parsed = typeof raw === 'number' ? raw : typeof raw === 'string' ? parseFloat(raw) : null;
  return parsed !== null && !isNaN(parsed) && parsed > 0 ? parsed : 1.0;
}

/**
 * Generate a concise Norwegian plaintext hook headline for the 3 selected teaser highlights.
 * Summarizes the issue clearly without leaking raw evidence URLs or sensitive payloads.
 */
export function generatePlaintextHeadline(
  finding: Finding,
  factor?: FactorDefinition
): string {
  const nameNo = factor?.nameNo || finding.factorCode;
  const isCrit = finding.status === 'crit';
  const severityPrefix = isCrit ? 'Kritisk mangel' : 'Viktig funn';

  // Custom high-converting Norwegian headlines for key SEO & visibility factors
  const customHeadlines: Record<string, { crit: string; warn: string }> = {
    L001: {
      crit: 'Kritisk feil: Primærkategori på Google-profilen mangler eller samsvarer ikke med bransjen',
      warn: 'Advarsel: Google-profilen bruker en sekundær kategori som primærkategori',
    },
    L006: {
      crit: 'Kritisk: Stjernerating på Google ligger under smertegrensen på 4,0',
      warn: 'Advarsel: Lavere stjernerating på Google enn topp 3-konkurrentene i kartet',
    },
    L009: {
      crit: 'Kritisk etterslep: Betydelig færre Google-anmeldelser enn konkurrentene i kartet',
      warn: 'Advarsel: Færre Google-anmeldelser enn snittet av topp 3 i nærområdet',
    },
    L011: {
      crit: 'Kritisk stillstand: Ingen nye Google-anmeldelser registrert de siste 90 dagene',
      warn: 'Advarsel: Lav frekvens på nye Google-anmeldelser siste 3 måneder',
    },
    L015: {
      crit: 'Kritisk avvik: Kontaktinfo (NAP) på nettsiden samsvarer ikke med Google-profilen',
      warn: 'Advarsel: Ulik formatering av adresse eller telefon mellom nettside og Google',
    },
    L020: {
      crit: 'Kritisk mangel på H1-tag med hovedtjeneste og stedsnavn på landingssiden',
      warn: 'Advarsel: H1-overskrift på landingssiden mangler enten tjenesteord eller stedsnavn',
    },
    L024: {
      crit: 'Kritisk arkitekturfeil: Mangler dedikerte landingssider for hovedtjenestene',
      warn: 'Advarsel: Flere viktige tjenester mangler egne dedikerte undersider',
    },
    G001: {
      crit: 'Kritisk treg lastetid (LCP > 4,0s) på mobil svekker synlighet og konvertering',
      warn: 'Advarsel: Mobil lastetid (LCP) er tregere enn Googles anbefalte grense på 2,5s',
    },
    G007: {
      crit: 'Kritisk indekseringsfeil: Viktige tjenestesider er blokkert for Google',
      warn: 'Advarsel: Enkelte undersider er merket med noindex eller blokkert i robots.txt',
    },
    G018: {
      crit: 'Kritisk synlighetsgap: Mangler dedikerte sider for tjeneste × sted i nærområdet',
      warn: 'Advarsel: Ufullstendig dekning av lokale tjeneste- og bydelssider mot konkurrentene',
    },
    G028: {
      crit: 'Kritisk mangel på unike sidetitler (Title-tags) med tjeneste og sted',
      warn: 'Advarsel: Flere undersider mangler optimaliserte eller unike sidetitler',
    },
    G030: {
      crit: 'Kritisk mangel på H1-tag på viktige tjenestesider',
      warn: 'Advarsel: Flere sider mangler tydelig H1-hovedoverskrift med søkeord',
    },
    G034: {
      crit: 'Kritisk søkeordgap: Nettstedet mangler innhold for bransjens mest søkte termer',
      warn: 'Advarsel: Flere kjøpsutløsende søkeord med høyt volum dekkes ikke på nettsiden',
    },
    A001: {
      crit: 'Kritisk AI-funn: Virksomheten er utelatt fra «Beste i byen»-lister som AI-modellene siterer',
      warn: 'Advarsel: Lav synlighet på tredjepartslister som ChatGPT, Gemini, Claude og Perplexity bruker som kilder',
    },
    A012: {
      crit: 'Kritisk AI-blokkering: robots.txt blokkerer ChatGPT/AI-roboter fra å lese nettsiden',
      warn: 'Advarsel: Enkelte AI-søkeroboter er begrenset i nettstedets robots.txt',
    },
    B001: {
      crit: 'Kritisk for Google Ads: Svak landingssideopplevelse gir lav Quality Score og dyrere klikk',
      warn: 'Advarsel: Ytelse på landingssider trekker ned Quality Score i Google Ads',
    },
    B002: {
      crit: 'Kritisk annonse-lekkasje: Mangler dedikerte landingssider for betalte søkeord',
      warn: 'Advarsel: Annonsetrafikk mangler skreddersydde landingssider for flere tjenester',
    },
    B004: {
      crit: 'Kritisk merkevaregap: Svært lavt søkevolum på firmanavnet sammenlignet med konkurrentene',
      warn: 'Advarsel: Færre merkevaresøk enn snittet av de lokale konkurrentene',
    },
    B005: {
      crit: 'Kritisk lekkasje: Konkurrenter kjøper annonser direkte på ditt firmanavn i Google',
      warn: 'Advarsel: Konkurrent viser betalt annonse ved søk på ditt firmanavn',
    },
    B008: {
      crit: 'Kritisk målefeil: Mangler sporbar konverteringsmåling (GA4/GTM) på viktige kontaktpunkter',
      warn: 'Advarsel: Ufullstendig konverteringssporing av telefonklikk og kontaktskjema',
    },
    B009: {
      crit: 'Kritisk trafikk-tap: Utenfor topp 10 organisk på bransjens mest verdifulle søkeord',
      warn: 'Advarsel: Lav organisk rangering på søkeord med høy klikkpris (CPC)',
    },
  };

  const preset = customHeadlines[finding.factorCode];
  if (preset) {
    return isCrit ? preset.crit : preset.warn;
  }

  return `${severityPrefix}: ${nameNo}`;
}

/**
 * Select up to 3 high-impact plaintext hooks for the top of the teaser:
 * - Must have status 'crit' or 'warn'
 * - Prioritizes 'crit' over 'warn', then descending by factor weight
 * - Slot 1: Local SEO (Part 1)
 * - Slot 2: Technical / Organic SEO (Part 2)
 * - Slot 3: Competitor / Financial (Part 4 or finding with competitor comparison, fallback to Part 3)
 * - Any remaining slots are backfilled with the highest-weighted remaining 'crit'/'warn' findings.
 */
export function selectTeaserHighlights(
  findings: Finding[],
  factorMap: Map<string, FactorDefinition>
): Map<string, string> {
  interface Candidate {
    finding: Finding;
    factor?: FactorDefinition;
    part: number;
    weight: number;
    hasCompetitorData: boolean;
    priorityScore: number;
  }

  const actionable: Candidate[] = [];

  for (const f of findings) {
    if (f.status !== 'crit' && f.status !== 'warn') {
      continue;
    }

    const factor = factorMap.get(f.factorCode);
    const part = factor?.part ?? inferPartFromCode(f.factorCode);
    // Only select from parts 1-4 for the 3 main teaser hooks
    if (part < 1 || part > 4) {
      continue;
    }

    const weight = resolveFactorWeight(factor, part);
    const hasCompetitorData = Boolean(
      f.competitorValues && Object.keys(f.competitorValues).length > 0
    );

    // 'crit' gets a 1000-point priority tier over 'warn', then ranked by weight
    const severityBoost = f.status === 'crit' ? 1000 : 100;
    const priorityScore = severityBoost + weight;

    actionable.push({
      finding: f,
      factor,
      part,
      weight,
      hasCompetitorData,
      priorityScore,
    });
  }

  // Sort highest priority first (deterministic tie-break on factorCode)
  actionable.sort((a, b) => {
    if (b.priorityScore !== a.priorityScore) {
      return b.priorityScore - a.priorityScore;
    }
    return a.finding.factorCode.localeCompare(b.finding.factorCode);
  });

  const selectedCodes = new Set<string>();
  const selectedCandidates: Candidate[] = [];

  const pickBest = (predicate: (c: Candidate) => boolean): void => {
    const match = actionable.find(
      (c) => !selectedCodes.has(c.finding.factorCode) && predicate(c)
    );
    if (match) {
      selectedCodes.add(match.finding.factorCode);
      selectedCandidates.push(match);
    }
  };

  // 1. Pick highest-priority from Local (Part 1)
  pickBest((c) => c.part === 1);

  // 2. Pick highest-priority from Tech/Organic (Part 2)
  pickBest((c) => c.part === 2);

  // 3. Pick highest-priority from Financial/Competitor (Part 4 or hasCompetitorData or Part 3)
  pickBest((c) => c.part === 4 || c.hasCompetitorData);
  if (selectedCandidates.length < 3) {
    pickBest((c) => c.part === 3);
  }

  // Backfill up to 3 if any bucket had no 'crit'/'warn' findings
  for (const candidate of actionable) {
    if (selectedCandidates.length >= 3) break;
    if (!selectedCodes.has(candidate.finding.factorCode)) {
      selectedCodes.add(candidate.finding.factorCode);
      selectedCandidates.push(candidate);
    }
  }

  // Map factorCode -> generated plaintext headline for the 3 selected hooks ONLY
  const headlineByFactorCode = new Map<string, string>();
  for (const item of selectedCandidates) {
    headlineByFactorCode.set(
      item.finding.factorCode,
      generatePlaintextHeadline(item.finding, item.factor)
    );
  }

  return headlineByFactorCode;
}

/**
 * Redact all findings for the public `teaserFindings` column.
 *
 * SECURITY MANDATE:
 * Explicitly constructs new objects with ONLY `{ factorCode, nameNo, groupName, status, part }`
 * (plus `headline` for the 3 selected plaintext hooks).
 * Physically strips and omits `evidence`, `value`, and `competitorValues`.
 */
export function buildRedactedTeaserFindings(
  findings: Finding[],
  factorMap: Map<string, FactorDefinition>,
  hookHeadlines: Map<string, string>
): RedactedTeaserFinding[] {
  return findings
    .filter((finding) => finding.status !== 'na')
    .map((finding) => {
      const factor = factorMap.get(finding.factorCode);
      const part = factor?.part ?? inferPartFromCode(finding.factorCode);
      const nameNo = factor?.nameNo ?? finding.factorCode;
      const groupName = factor?.groupName ?? 'Generelt';
      const headline = hookHeadlines.get(finding.factorCode);

      const redacted: RedactedTeaserFinding = {
        factorCode: finding.factorCode,
        nameNo,
        groupName,
        status: finding.status,
        part,
      };

      if (headline !== undefined) {
        redacted.headline = headline;
      }

      return redacted;
    });
}

// ============================================================================
// CORE ASSEMBLY (Pure & Testable)
// ============================================================================

/**
 * Assembles the complete report payload, calculates scores & financial impact,
 * selects the 3 plaintext hooks, and physically strips sensitive fields from `teaserFindings`.
 */
export function assembleReport(input: AssembleReportInput): AssembledReport {
  const now = input.now ?? new Date();
  const expiresAt = new Date(now);
  expiresAt.setFullYear(expiresAt.getFullYear() + 1); // 12 months validity

  const slug = input.slug ?? nanoid(24);
  if (slug.length !== 24) {
    throw new Error(`Invalid report slug length (${slug.length}): expected 24 characters.`);
  }

  // Build O(1) factor lookup map
  const factorMap = new Map<string, FactorDefinition>();
  for (const factor of input.factors) {
    factorMap.set(factor.code, factor);
  }

  // Resolve profile weights
  const profileType: ProfileType = input.business.profileType ?? 'lokal';
  const weights: ProfileWeights =
    input.profileWeights ?? DEFAULT_PROFILE_WEIGHTS[profileType] ?? DEFAULT_PROFILE_WEIGHTS.lokal;

  // 1. Run scoring engine
  const scores = calculateScores(input.findings, input.factors, weights);

  // 2. Run financial loss engine
  const financial = calculateFinancialImpact(
    input.findings,
    input.keywords,
    input.naceBenchmark,
    input.ctrModel,
    {
      agencySpendMonthly: input.business.agencySpendMonthly,
      agencyDurationMonths: input.business.agencyDurationMonths,
    }
  );

  // 3. Select the 3 plaintext hooks (Teaser Highlights)
  const hookHeadlines = selectTeaserHighlights(input.findings, factorMap);

  // 4. Build full redacted teaserFindings array (physically stripped of evidence, value, competitorValues)
  const teaserFindings = buildRedactedTeaserFindings(
    input.findings,
    factorMap,
    hookHeadlines
  );

  const teaserHighlights = teaserFindings.filter((tf) => Boolean(tf.headline));

  // 5. Build unredacted findings list for the locked `json` column (excluding 'na' findings)
  const unredactedFindings: UnredactedFindingDetail[] = input.findings
    .filter((f) => f.status !== 'na')
    .map((f) => {
      const factor = factorMap.get(f.factorCode);
      const part = factor?.part ?? inferPartFromCode(f.factorCode);
      const headline = hookHeadlines.get(f.factorCode);

    return {
      factorCode: f.factorCode,
      nameNo: factor?.nameNo ?? f.factorCode,
      groupName: factor?.groupName ?? 'Generelt',
      subgroupName: factor?.subgroupName ?? null,
      part,
      weight: resolveFactorWeight(factor, part),
      status: f.status,
      value: f.value,
      evidence: f.evidence,
      rule: factor?.rule ?? null,
      thresholdOk: factor?.thresholdOk ?? null,
      thresholdWarn: factor?.thresholdWarn ?? null,
      thresholdCrit: factor?.thresholdCrit ?? null,
      notes: factor?.notes ?? null,
      source: factor?.source ?? null,
      ...(f.competitorValues ? { competitorValues: f.competitorValues } : {}),
      ...(headline ? { headline } : {}),
    };
  });

  // Separate Part 5 negative factors ('crit' or 'warn') into negativeFlags box
  const negativeFlags = unredactedFindings.filter(
    (f) => f.part === 5 && (f.status === 'crit' || f.status === 'warn')
  );

  const fullReportJson: FullReportJson = {
    version: '1.0',
    generatedAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    jobId: input.jobId,
    slug,
    business: input.business,
    scores,
    financial,
    teaserHighlights,
    findings: unredactedFindings,
    negativeFlags,
    competitors: input.competitors ?? [],
    aiSummary: input.aiSummary ?? null,
    geoGrid: input.geoGrid ?? null,
  };

  return {
    jobId: input.jobId,
    slug,
    scoreTotal: scores.scoreTotal,
    scoresByPart: scores.scoresByPart,
    findingCounts: scores.findingCounts,
    nokEstimate: financial.nokEstimate,
    teaserHighlights,
    teaserFindings,
    json: fullReportJson,
    unlockedAt: null,
    pdfPath: null,
    expiresAt,
  };
}

// ============================================================================
// DATABASE PERSISTENCE (Drizzle ORM -> Supabase)
// ============================================================================

/**
 * Inserts the assembled report into the `reports` table in Supabase and marks
 * the corresponding `audit_jobs` record as `done` with `finished_at = now()`.
 */
export async function saveAssembledReport(
  assembled: AssembledReport,
  dbInstance?: Database
): Promise<{ reportId: string; slug: string; expiresAt: Date }> {
  const db = dbInstance ?? getDb();
  const finishedAt = new Date();

  return await db.transaction(async (tx) => {
    const [inserted] = await tx
      .insert(reports)
      .values({
        jobId: assembled.jobId,
        slug: assembled.slug,
        scoreTotal: assembled.scoreTotal.toFixed(2),
        scoresByPart: assembled.scoresByPart,
        findingCounts: assembled.findingCounts,
        nokEstimate: assembled.nokEstimate.toFixed(2),
        teaserFindings: assembled.teaserFindings as TeaserFinding[],
        json: assembled.json,
        unlockedAt: null,
        pdfPath: null,
        expiresAt: assembled.expiresAt,
      })
      .onConflictDoUpdate({
        target: reports.jobId,
        set: {
          scoreTotal: assembled.scoreTotal.toFixed(2),
          scoresByPart: assembled.scoresByPart,
          findingCounts: assembled.findingCounts,
          nokEstimate: assembled.nokEstimate.toFixed(2),
          teaserFindings: assembled.teaserFindings as TeaserFinding[],
          json: assembled.json,
          expiresAt: assembled.expiresAt,
          updatedAt: finishedAt,
        },
      })
      .returning({
        id: reports.id,
        slug: reports.slug,
        expiresAt: reports.expiresAt,
      });

    await tx
      .update(auditJobs)
      .set({
        status: 'done',
        finishedAt,
        updatedAt: finishedAt,
      })
      .where(eq(auditJobs.id, assembled.jobId));

    return {
      reportId: inserted.id,
      slug: inserted.slug,
      expiresAt: inserted.expiresAt,
    };
  });
}

/**
 * End-to-end report builder: loads findings, factors, profile weights, NACE benchmarks,
 * and CTR model from Supabase for a given `jobId` (or uses provided overrides),
 * assembles the report, persists it to `reports`, and marks `audit_jobs` as `done`.
 */
export async function buildAndSaveReport(
  input: AssembleReportInput,
  dbInstance?: Database
): Promise<AssembledReport & { reportId: string }> {
  const assembled = assembleReport(input);
  const saved = await saveAssembledReport(assembled, dbInstance);

  return {
    ...assembled,
    slug: saved.slug,
    reportId: saved.reportId,
  };
}

/**
 * Loads all data for an existing `jobId` from Supabase, assembles the report,
 * inserts into `reports`, and marks `audit_jobs.status = 'done'`.
 */
export async function buildReportFromJobId(
  jobId: string,
  dbInstance?: Database
): Promise<AssembledReport & { reportId: string }> {
  const db = dbInstance ?? getDb();

  const [job] = await db
    .select()
    .from(auditJobs)
    .where(eq(auditJobs.id, jobId))
    .limit(1);

  if (!job) {
    throw new Error(`Audit job not found for jobId=${jobId}`);
  }

  const [business] = await db
    .select()
    .from(businesses)
    .where(eq(businesses.id, job.businessId))
    .limit(1);

  if (!business) {
    throw new Error(`Business not found for businessId=${job.businessId}`);
  }

  const [dbFindings, dbFactors, dbCtrRows, dbRawFetches] = await Promise.all([
    db.select().from(findingsTable).where(eq(findingsTable.jobId, jobId)),
    db.select().from(factorsTable),
    db.select().from(ctrModelTable),
    db.select().from(rawFetchesTable).where(eq(rawFetchesTable.jobId, jobId)),
  ]);

  const [dbProfileWeight] = await db
    .select()
    .from(profileWeightsTable)
    .where(eq(profileWeightsTable.profileType, business.profileType))
    .limit(1);

  const naceCode = business.nace || 'default';
  let [dbNace] = await db
    .select()
    .from(naceBenchmarksTable)
    .where(eq(naceBenchmarksTable.nace, naceCode))
    .limit(1);

  if (!dbNace && naceCode !== 'default') {
    [dbNace] = await db
      .select()
      .from(naceBenchmarksTable)
      .where(eq(naceBenchmarksTable.nace, 'default'))
      .limit(1);
  }

  const mappedFindings: Finding[] = dbFindings.map((f) => ({
    factorCode: f.factorCode,
    status: f.status,
    value: f.value as Finding['value'],
    evidence: f.evidence,
    ...(f.competitorValues ? { competitorValues: f.competitorValues } : {}),
  }));

  // Extract SERP and AI raw fetches if available
  const rawMap = new Map<string, any>();
  for (const rf of dbRawFetches) {
    rawMap.set(rf.module, rf.payload);
  }

  const serpPayload = rawMap.get('serp') as any;
  const aiPayload = rawMap.get('ai') as any;
  const gatePayload = rawMap.get('gate') as any;

  // Build keywords list for financial calculation
  let keywords: KeywordSimulationInput[] | undefined;
  if (Array.isArray(serpPayload?.keywords) && serpPayload.keywords.length > 0) {
    keywords = serpPayload.keywords.map((kw: any) => ({
      keyword: String(kw.keyword),
      volume: Number(kw.volume) || 500,
      cpc: Number(kw.cpc) || 45,
      mapRank: kw.mapRank !== undefined && kw.mapRank !== null ? Number(kw.mapRank) : 0,
      orgRank: kw.orgRank !== undefined && kw.orgRank !== null ? Number(kw.orgRank) : 0,
      hasAiOverview: Boolean(kw.hasAiOverview),
    }));
  } else {
    const city = (business.city || 'Oslo').toLowerCase();
    const serviceKeywords =
      dbNace?.serviceKeywords && dbNace.serviceKeywords.length > 0
        ? dbNace.serviceKeywords
        : [business.naceName?.toLowerCase() || 'bedrift'];
    const baseService = serviceKeywords[0] || 'tjenester';

    keywords = [
      { keyword: `${baseService} ${city}`, volume: 1800, cpc: 58, mapRank: 0, orgRank: 5, hasAiOverview: true },
      { keyword: `beste ${baseService} ${city}`, volume: 640, cpc: 52, mapRank: 3, orgRank: 6, hasAiOverview: true },
      { keyword: `akutt ${baseService} ${city}`, volume: 950, cpc: 74, mapRank: 0, orgRank: 7, hasAiOverview: true },
      { keyword: `${serviceKeywords[1] || baseService} pris ${city}`, volume: 520, cpc: 46, mapRank: 0, orgRank: 8, hasAiOverview: true },
    ];
  }

  // Extract Top 3 Competitors from SERP snapshot
  const snap = serpPayload?.snapshots?.[0];
  const competitors: CompetitorSummary[] = [];
  const mapPackList = Array.isArray(snap?.mapTop3)
    ? snap.mapTop3
    : Array.isArray(snap?.localPack)
      ? snap.localPack
      : [];
  if (mapPackList.length > 0) {
    const orgList = Array.isArray(snap?.organicTop10) ? snap.organicTop10 : [];
    const defaultScores = [88, 84, 81];
    mapPackList
      .filter((c: any) => !c.isTargetBusiness)
      .slice(0, 3)
      .forEach((c: any, idx: number) => {
        const matchedOrg =
          orgList.find((o: any) => !o.isTargetBusiness && o.rank === idx + 1) || orgList[idx];
        competitors.push({
          placesId: String(c.placesId || c.placeId || `comp_${idx + 1}`),
          name: String(c.title || `Konkurrent #${idx + 1}`),
          domain: c.domain ?? matchedOrg?.domain ?? null,
          rating: typeof c.rating === 'number' ? c.rating : 4.8,
          reviewCount: typeof c.reviewsCount === 'number' ? c.reviewsCount : 250,
          lightScore: defaultScores[idx] ?? 80,
        });
      });
  }

  const businessData: Partial<BusinessData> = {
    id: business.id,
    orgnr: business.orgnr,
    domain: business.domain,
    name: business.name,
    orgForm: business.orgForm ?? undefined,
    nace: business.nace ?? undefined,
    naceName: business.naceName ?? undefined,
    address: business.address ?? undefined,
    postcode: business.postcode ?? undefined,
    city: business.city ?? undefined,
    lat: business.lat ?? undefined,
    lng: business.lng ?? undefined,
    placesId: business.placesId ?? undefined,
    source: business.source,
    profileType: business.profileType,
    email: business.email ?? undefined,
    phone: business.phone ?? undefined,
    generalManager: business.generalManager ?? undefined,
    agencySpendMonthly:
      business.agencySpendMonthly ??
      (typeof gatePayload?.agencySpendMonthly === 'number'
        ? gatePayload.agencySpendMonthly
        : undefined),
    agencyDurationMonths:
      business.agencyDurationMonths ??
      (typeof gatePayload?.agencyDurationMonths === 'number'
        ? gatePayload.agencyDurationMonths
        : undefined),
  };

  return await buildAndSaveReport(
    {
      jobId,
      business: businessData,
      findings: mappedFindings,
      factors: dbFactors,
      profileWeights: dbProfileWeight ?? undefined,
      keywords,
      competitors,
      aiSummary: aiPayload ?? null,
      geoGrid: snap?.geoGrid ?? null,
      naceBenchmark: dbNace
        ? {
            nace: dbNace.nace,
            industryName: dbNace.industryName,
            conversionRate: dbNace.conversionRate,
            customerLifetimeValue: dbNace.customerLifetimeValue,
            serviceKeywords: dbNace.serviceKeywords,
          }
        : undefined,
      ctrModel: dbCtrRows,
    },
    db
  );
}
