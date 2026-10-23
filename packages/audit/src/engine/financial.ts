import { Finding } from '../types';

export interface NaceBenchmark {
  nace: string;
  industryName: string;
  conversionRate: string | number; // f.eks. "0.0400" (4.0%)
  customerLifetimeValue: string | number; // f.eks. "6000.00" (6 000 kr)
  serviceKeywords?: string[] | null;
  cpcDefault?: number;
  monthlyVolumeDefault?: number;
}

export interface CtrModelRow {
  key: string;
  channel: string;
  position?: number | null;
  ctr: string | number;
}

export type CtrModelInput = CtrModelRow[] | Record<string, number>;

export interface Keyword {
  keyword: string;
  volume: number;
  cpc: number;
  mapRank?: number; // 1, 2, 3 eller 0 (utenfor topp 3)
  orgRank?: number; // 1 - 10 eller 0 (utenfor topp 10)
  hasAiOverview?: boolean;
}

export type KeywordSimulationInput = Keyword;

export interface KeywordFinancialResult {
  keyword: string;
  volume: number;
  cpc: number;
  mapRank: number;
  orgRank: number;
  hasAiOverview: boolean;
  ctrCurrentPercent: number;
  ctrGoalPercent: number;
  currentClicks: number;
  goalClicks: number;
  lostClicksMonthly: number;
  adsValueMonthly: number;
  conversionRatePercent: number;
  customerLifetimeValue: number;
  lostRevenueMonthly: number;
}

export interface AgencyRoiSummary {
  monthlySpend: number;
  durationMonths: number | null;
  totalInvested: number | null;
  annualSpend: number;
  combinedMonthlyBleed: number;
}

export interface FinancialImpactResult {
  nokEstimate: number; // Tapt omsetning per måned (kr/mnd) basert på NACE konverteringsrate og kundeverdi
  adsValue: number; // Ads-verdi av tapte klikk per måned (kr/mnd)
  monthlyLostRevenue: number;
  annualLostRevenue: number;
  monthlyAdsValue: number;
  annualAdsValue: number;
  monthlyLostClicks: number;
  annualLostClicks: number;
  benchmarks: {
    nace: string;
    industryName: string;
    conversionRate: number;
    customerLifetimeValue: number;
    totalSearchVolume: number;
    averageCpc: number;
  };
  keywords: KeywordFinancialResult[];
  summaryText: string;
  agencyRoi?: AgencyRoiSummary | null;
}

export function buildAgencyRoiSummary(
  monthlySpendRaw?: number | null,
  durationMonthsRaw?: number | null,
  monthlyLostRevenue: number = 0
): AgencyRoiSummary | null {
  const monthlySpend =
    typeof monthlySpendRaw === 'number' && Number.isFinite(monthlySpendRaw)
      ? Math.round(monthlySpendRaw)
      : 0;

  if (monthlySpend <= 0) {
    return null;
  }

  const durationMonths =
    typeof durationMonthsRaw === 'number' &&
    Number.isFinite(durationMonthsRaw) &&
    durationMonthsRaw > 0
      ? Math.round(durationMonthsRaw)
      : null;

  const totalInvested =
    durationMonths !== null ? monthlySpend * durationMonths : null;
  const annualSpend = monthlySpend * 12;
  const combinedMonthlyBleed = monthlySpend + Math.max(0, Math.round(monthlyLostRevenue));

  return {
    monthlySpend,
    durationMonths,
    totalInvested,
    annualSpend,
    combinedMonthlyBleed,
  };
}

/**
 * Standard baseline CTR model values from Whitespark / industry research
 */
const DEFAULT_CTR_VALUES: Record<string, number> = {
  ctr_kart_1: 0.18,
  ctr_kart_2: 0.13,
  ctr_kart_3: 0.09,
  ctr_org_1: 0.25,
  ctr_org_2: 0.13,
  ctr_org_3: 0.09,
  ctr_org_4_10: 0.04,
  ctr_org_11_plus: 0.00,
  ai_overview_tap: 0.15,
};

/**
 * Normalize CTR model inputs into a key-value record
 */
function normalizeCtrModel(input?: CtrModelInput): Record<string, number> {
  const result: Record<string, number> = { ...DEFAULT_CTR_VALUES };
  if (!input) return result;

  if (Array.isArray(input)) {
    for (const row of input) {
      const val = typeof row.ctr === 'number' ? row.ctr : parseFloat(String(row.ctr));
      if (!isNaN(val)) {
        result[row.key] = val;
      }
    }
  } else if (typeof input === 'object') {
    for (const [k, v] of Object.entries(input)) {
      const val = typeof v === 'number' ? v : parseFloat(String(v));
      if (!isNaN(val)) {
        result[k] = val;
      }
    }
  }

  return result;
}

/**
 * Extract map rank and organic rank from audit findings
 */
export function extractRanksFromFindings(findings: Finding[]): {
  mapRank: number;
  orgRank: number;
  hasAiOverview: boolean;
  primaryKeyword?: string;
} {
  let mapRank = 0;
  let orgRank = 0;
  let hasAiOverview = false;
  let primaryKeyword: string | undefined;

  for (const f of findings) {
    if (f.factorCode === 'L002') {
      const val = f.value as any;
      if (val && typeof val.mapRank === 'number' && val.mapRank >= 1 && val.mapRank <= 3) {
        mapRank = val.mapRank;
      } else if (typeof f.evidence?.measuredNumber === 'number' && f.evidence.measuredNumber >= 1 && f.evidence.measuredNumber <= 3) {
        mapRank = f.evidence.measuredNumber;
      }
    }

    if (f.factorCode === 'B009') {
      const val = f.value as any;
      if (val && typeof val.organicRank === 'number' && val.organicRank >= 1 && val.organicRank <= 10) {
        orgRank = val.organicRank;
      } else if (typeof f.evidence?.measuredNumber === 'number' && f.evidence.measuredNumber >= 1 && f.evidence.measuredNumber <= 10) {
        orgRank = f.evidence.measuredNumber;
      }
    }

    const val = f.value as any;
    if (val?.aiOverview === true || f.evidence?.snippet?.toLowerCase().includes('ai overview')) {
      hasAiOverview = true;
    }
  }

  return { mapRank, orgRank, hasAiOverview, primaryKeyword };
}

/**
 * Calculate Financial Impact from findings, keywords, NACE benchmarks, and CTR model.
 *
 * Supports both signatures:
 * 1. calculateFinancialImpact(findings, keywords, naceData, ctrModel)
 * 2. calculateFinancialImpact(findings, naceData, ctrModel)
 */
export function calculateFinancialImpact(
  findings: Finding[],
  keywordsOrNace: Keyword[] | NaceBenchmark | undefined,
  naceOrCtr?: NaceBenchmark | CtrModelInput,
  ctrModelInput?: CtrModelInput,
  agencyInput?: {
    agencySpendMonthly?: number | null;
    agencyDurationMonths?: number | null;
  }
): FinancialImpactResult {
  // Resolve polymorphic arguments
  let keywords: Keyword[] | undefined;
  let naceData: NaceBenchmark;
  let ctrInput: CtrModelInput | undefined;

  if (Array.isArray(keywordsOrNace)) {
    keywords = keywordsOrNace;
    naceData = naceOrCtr as NaceBenchmark;
    ctrInput = ctrModelInput;
  } else if (keywordsOrNace && 'nace' in (keywordsOrNace as any)) {
    keywords = undefined;
    naceData = keywordsOrNace as NaceBenchmark;
    ctrInput = naceOrCtr as CtrModelInput;
  } else {
    keywords = undefined;
    naceData = {
      nace: 'default',
      industryName: 'Generell virksomhet',
      conversionRate: 0.04,
      customerLifetimeValue: 5000,
    };
    ctrInput = naceOrCtr as CtrModelInput;
  }

  const ctrModel = normalizeCtrModel(ctrInput);

  // Conversion rate (e.g. 0.04 = 4.0%)
  const convRateNum = typeof naceData.conversionRate === 'number'
    ? naceData.conversionRate
    : parseFloat(String(naceData.conversionRate || '0.04'));
  const conversionRate = convRateNum > 0 ? convRateNum : 0.04;

  // Customer Lifetime Value (e.g. 6000 NOK)
  const clvNum = typeof naceData.customerLifetimeValue === 'number'
    ? naceData.customerLifetimeValue
    : parseFloat(String(naceData.customerLifetimeValue || '5000'));
  const customerLifetimeValue = clvNum > 0 ? clvNum : 5000;

  // Extract ranks from findings
  const extracted = extractRanksFromFindings(findings);

  // Determine keyword simulations list
  let simKeywords: Keyword[] = [];

  if (keywords && keywords.length > 0) {
    simKeywords = keywords.map((k) => ({
      ...k,
      mapRank: k.mapRank !== undefined ? k.mapRank : extracted.mapRank,
      orgRank: k.orgRank !== undefined ? k.orgRank : extracted.orgRank,
      hasAiOverview: k.hasAiOverview !== undefined ? k.hasAiOverview : extracted.hasAiOverview,
    }));
  } else {
    // Default simulation for primary service keywords based on NACE data
    const primaryService = naceData.serviceKeywords?.[0] || naceData.industryName.toLowerCase();
    const defaultVol = naceData.monthlyVolumeDefault || 800;
    const defaultCpc = naceData.cpcDefault || 38;

    simKeywords = [
      {
        keyword: `${primaryService} sentrum`,
        volume: defaultVol,
        cpc: defaultCpc,
        mapRank: extracted.mapRank,
        orgRank: extracted.orgRank,
        hasAiOverview: extracted.hasAiOverview,
      },
    ];
  }

  const keywordResults: KeywordFinancialResult[] = [];
  let totalLostClicksMonthly = 0;
  let totalAdsValueMonthly = 0;
  let totalLostRevenueMonthly = 0;
  let totalSearchVolume = 0;
  let totalCpcWeighted = 0;

  const goalMapCtr = ctrModel.ctr_kart_1 ?? 0.18;
  const goalOrgCtr = ctrModel.ctr_org_1 ?? 0.25;
  const goalCombinedCtr = goalMapCtr + goalOrgCtr; // 43%
  const aiOverviewDrop = ctrModel.ai_overview_tap ?? 0.15;

  for (const kw of simKeywords) {
    const mRank = kw.mapRank ?? 0;
    const oRank = kw.orgRank ?? 0;

    // Current CTR Map
    let ctrMapCurrent = 0;
    if (mRank === 1) ctrMapCurrent = ctrModel.ctr_kart_1 ?? 0.18;
    else if (mRank === 2) ctrMapCurrent = ctrModel.ctr_kart_2 ?? 0.13;
    else if (mRank === 3) ctrMapCurrent = ctrModel.ctr_kart_3 ?? 0.09;

    // Current CTR Organic
    let ctrOrgCurrent = 0;
    if (oRank === 1) ctrOrgCurrent = ctrModel.ctr_org_1 ?? 0.25;
    else if (oRank === 2) ctrOrgCurrent = ctrModel.ctr_org_2 ?? 0.13;
    else if (oRank === 3) ctrOrgCurrent = ctrModel.ctr_org_3 ?? 0.09;
    else if (oRank >= 4 && oRank <= 10) ctrOrgCurrent = ctrModel.ctr_org_4_10 ?? 0.04;

    const currentCombinedCtr = ctrMapCurrent + ctrOrgCurrent;
    const currentClicks = Math.round(kw.volume * currentCombinedCtr);
    const goalClicks = Math.round(kw.volume * goalCombinedCtr);

    // Lost clicks formula: volume * (CTR_goal - CTR_current) * (1 - AI_Drop)
    const rawLost = kw.volume * Math.max(0, goalCombinedCtr - currentCombinedCtr);
    const aiMultiplier = kw.hasAiOverview ? 1.0 - aiOverviewDrop : 1.0;
    const lostClicksMonthly = Math.round(rawLost * aiMultiplier);

    // Ads-verdi: lost clicks * CPC
    const adsValueMonthly = Math.round(lostClicksMonthly * kw.cpc);

    // Lost revenue: lost clicks * conversionRate * CLV
    const lostRevenueMonthly = Math.round(lostClicksMonthly * conversionRate * customerLifetimeValue);

    totalLostClicksMonthly += lostClicksMonthly;
    totalAdsValueMonthly += adsValueMonthly;
    totalLostRevenueMonthly += lostRevenueMonthly;
    totalSearchVolume += kw.volume;
    totalCpcWeighted += kw.cpc * kw.volume;

    keywordResults.push({
      keyword: kw.keyword,
      volume: kw.volume,
      cpc: kw.cpc,
      mapRank: mRank,
      orgRank: oRank,
      hasAiOverview: Boolean(kw.hasAiOverview),
      ctrCurrentPercent: Number((currentCombinedCtr * 100).toFixed(1)),
      ctrGoalPercent: Number((goalCombinedCtr * 100).toFixed(1)),
      currentClicks,
      goalClicks,
      lostClicksMonthly,
      adsValueMonthly,
      conversionRatePercent: Number((conversionRate * 100).toFixed(1)),
      customerLifetimeValue,
      lostRevenueMonthly,
    });
  }

  const averageCpc = totalSearchVolume > 0
    ? Number((totalCpcWeighted / totalSearchVolume).toFixed(1))
    : 38;

  const annualLostRevenue = totalLostRevenueMonthly * 12;
  const annualAdsValue = totalAdsValueMonthly * 12;
  const annualLostClicks = totalLostClicksMonthly * 12;

  // nokEstimate represents Lost Revenue per month (as requested for the CRO paywall)
  const nokEstimate = totalLostRevenueMonthly;
  const adsValue = totalAdsValueMonthly;

  const summaryText = `Tapt omsetningspotensial er estimert til ${nokEstimate.toLocaleString('nb-NO')} kr per måned ved ${(conversionRate * 100).toFixed(1)}% konverteringsrate og ${customerLifetimeValue.toLocaleString('nb-NO')} kr i kundeverdi (tilsvarer ${adsValue.toLocaleString('nb-NO')} kr/mnd i betalt søketrafikk).`;

  const agencyRoi = buildAgencyRoiSummary(
    agencyInput?.agencySpendMonthly,
    agencyInput?.agencyDurationMonths,
    totalLostRevenueMonthly
  );

  return {
    nokEstimate,
    adsValue,
    monthlyLostRevenue: totalLostRevenueMonthly,
    annualLostRevenue,
    monthlyAdsValue: totalAdsValueMonthly,
    annualAdsValue,
    monthlyLostClicks: totalLostClicksMonthly,
    annualLostClicks,
    benchmarks: {
      nace: naceData.nace,
      industryName: naceData.industryName,
      conversionRate,
      customerLifetimeValue,
      totalSearchVolume,
      averageCpc,
    },
    keywords: keywordResults,
    summaryText,
    ...(agencyRoi ? { agencyRoi } : {}),
  };
}
