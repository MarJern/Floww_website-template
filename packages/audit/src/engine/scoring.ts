import { Finding } from '../types';

export interface FactorDefinition {
  code: string;
  part: number; // 1: Lokalt/Kart, 2: Generelt/Organisk, 3: AI, 4: Ads/Økonomi, 5: Negativ
  groupName: string;
  subgroupName?: string | null;
  nameNo: string;
  weightMap?: number | null;
  weightOrganic?: number | null;
  weightAi?: number | null;
  weightSubgroup?: number | null;
  measurable?: string | null;
  active?: boolean | null;
  rule?: string | null;
  thresholdOk?: string | null;
  thresholdWarn?: string | null;
  thresholdCrit?: string | null;
  notes?: string | null;
  source?: string | null;
}

export interface ProfileWeights {
  weightPart1: number | string; // Lokalt søk (f.eks. 40.0)
  weightPart2: number | string; // Generell SEO (f.eks. 30.0)
  weightPart3: number | string; // AI-synlighet (f.eks. 15.0)
  weightPart4: number | string; // Ads & økonomi (f.eks. 15.0)
}

export interface GroupScoreDetail {
  groupName: string;
  score: number; // 0 - 100
  achievedWeight: number;
  measuredWeight: number;
  totalPossibleWeight: number;
  factorsCount: {
    total: number;
    ok: number;
    warn: number;
    crit: number;
    na: number;
  };
}

export interface PartScoreDetail {
  part: number;
  name: string;
  score: number; // 0 - 100
  weightInProfile: number;
  achievedWeight: number;
  measuredWeight: number;
  totalPossibleWeight: number;
  factorsCount: {
    total: number;
    measured: number;
    ok: number;
    warn: number;
    crit: number;
    na: number;
  };
  groups: Record<string, GroupScoreDetail>;
}

export interface ScoreResult {
  scoreTotal: number; // 0 - 100
  scoresByPart: {
    part1: number;
    part2: number;
    part3: number;
    part4: number;
  };
  parts: {
    part1: PartScoreDetail;
    part2: PartScoreDetail;
    part3: PartScoreDetail;
    part4: PartScoreDetail;
  };
  findingCounts: {
    total: number;
    ok: number;
    warn: number;
    crit: number;
    na: number;
  };
}

const PART_NAMES: Record<number, string> = {
  1: 'Lokalt søk (Google Maps)',
  2: 'Generell SEO (Organisk)',
  3: 'AI-synlighet',
  4: 'Ads & økonomi',
};

/**
 * Extract weight for a factor based on which part is being evaluated
 */
function getFactorWeightForPart(factor: FactorDefinition, part: number): number {
  let w: number | null | undefined = null;
  if (part === 1) {
    w = factor.weightMap ?? factor.weightSubgroup;
  } else if (part === 2) {
    w = factor.weightOrganic ?? factor.weightSubgroup;
  } else if (part === 3) {
    w = factor.weightAi ?? factor.weightSubgroup;
  } else if (part === 4) {
    w = factor.weightSubgroup;
  }

  const num = typeof w === 'number' ? w : typeof w === 'string' ? parseFloat(w) : null;
  return num !== null && !isNaN(num) && num > 0 ? num : 1.0;
}

/**
 * Calculate scores for audit findings against factors and profile weights.
 *
 * Scoring logic from spec:
 * - 'ok'   -> 100% of weight (multiplier 1.0)
 * - 'warn' -> 50% of weight (multiplier 0.5)
 * - 'crit' -> 0% of weight (multiplier 0.0)
 * - 'na'   -> Dropped from numerator and denominator
 * - Groups without measurable factors drop out of the denominator.
 */
export function calculateScores(
  findings: Finding[],
  factors: FactorDefinition[],
  weights: ProfileWeights
): ScoreResult {
  // Map factors by code for quick O(1) lookup
  const factorMap = new Map<string, FactorDefinition>();
  for (const f of factors) {
    factorMap.set(f.code, f);
  }

  // Parse profile weights
  const pw = {
    part1: Math.max(0, typeof weights.weightPart1 === 'number' ? weights.weightPart1 : parseFloat(weights.weightPart1 || '0')),
    part2: Math.max(0, typeof weights.weightPart2 === 'number' ? weights.weightPart2 : parseFloat(weights.weightPart2 || '0')),
    part3: Math.max(0, typeof weights.weightPart3 === 'number' ? weights.weightPart3 : parseFloat(weights.weightPart3 || '0')),
    part4: Math.max(0, typeof weights.weightPart4 === 'number' ? weights.weightPart4 : parseFloat(weights.weightPart4 || '0')),
  };

  const totalCounts = { total: 0, ok: 0, warn: 0, crit: 0, na: 0 };

  // Initialize data structures for Parts 1 - 4
  const partDetails: Record<number, PartScoreDetail> = {
    1: createEmptyPartDetail(1, PART_NAMES[1], pw.part1),
    2: createEmptyPartDetail(2, PART_NAMES[2], pw.part2),
    3: createEmptyPartDetail(3, PART_NAMES[3], pw.part3),
    4: createEmptyPartDetail(4, PART_NAMES[4], pw.part4),
  };

  // Group findings by part and factor code
  for (const finding of findings) {
    totalCounts.total++;
    if (finding.status === 'ok') totalCounts.ok++;
    else if (finding.status === 'warn') totalCounts.warn++;
    else if (finding.status === 'crit') totalCounts.crit++;
    else if (finding.status === 'na') totalCounts.na++;

    const factor = factorMap.get(finding.factorCode);
    if (!factor) {
      continue;
    }

    const partNum = factor.part;
    if (partNum < 1 || partNum > 4) {
      continue;
    }

    const part = partDetails[partNum];
    const groupName = factor.groupName || 'Generelt';

    if (!part.groups[groupName]) {
      part.groups[groupName] = {
        groupName,
        score: 0,
        achievedWeight: 0,
        measuredWeight: 0,
        totalPossibleWeight: 0,
        factorsCount: { total: 0, ok: 0, warn: 0, crit: 0, na: 0 },
      };
    }

    const group = part.groups[groupName];
    const weight = getFactorWeightForPart(factor, partNum);

    group.factorsCount.total++;
    group.totalPossibleWeight += weight;
    part.factorsCount.total++;
    part.totalPossibleWeight += weight;

    if (finding.status === 'na') {
      group.factorsCount.na++;
      part.factorsCount.na++;
      // 'na' factors drop out of measured weight and achieved weight
      continue;
    }

    let multiplier = 0.0;
    if (finding.status === 'ok') {
      multiplier = 1.0;
      group.factorsCount.ok++;
      part.factorsCount.ok++;
    } else if (finding.status === 'warn') {
      multiplier = 0.5;
      group.factorsCount.warn++;
      part.factorsCount.warn++;
    } else if (finding.status === 'crit') {
      multiplier = 0.0;
      group.factorsCount.crit++;
      part.factorsCount.crit++;
    }

    const achieved = weight * multiplier;
    group.achievedWeight += achieved;
    group.measuredWeight += weight;

    part.achievedWeight += achieved;
    part.measuredWeight += weight;
    part.factorsCount.measured++;
  }

  // Calculate scores per group and per part
  for (let p = 1; p <= 4; p++) {
    const part = partDetails[p];

    for (const gName of Object.keys(part.groups)) {
      const group = part.groups[gName];
      if (group.measuredWeight > 0) {
        group.score = Number(((group.achievedWeight / group.measuredWeight) * 100).toFixed(2));
      } else {
        // Group without measurable factors drops out (score 0, measuredWeight 0)
        group.score = 0;
      }
    }

    if (part.measuredWeight > 0) {
      part.score = Number(((part.achievedWeight / part.measuredWeight) * 100).toFixed(2));
    } else {
      part.score = 0;
    }
  }

  // Calculate total score using profile weights
  // Parts without measurable factors drop out of the total denominator
  let weightedScoreSum = 0;
  let activeProfileWeightDenominator = 0;

  const weightsArray = [pw.part1, pw.part2, pw.part3, pw.part4];

  for (let p = 1; p <= 4; p++) {
    const part = partDetails[p];
    const profileW = weightsArray[p - 1];

    if (part.measuredWeight > 0 && profileW > 0) {
      weightedScoreSum += part.score * profileW;
      activeProfileWeightDenominator += profileW;
    }
  }

  const scoreTotal =
    activeProfileWeightDenominator > 0
      ? Number((weightedScoreSum / activeProfileWeightDenominator).toFixed(2))
      : 0;

  return {
    scoreTotal,
    scoresByPart: {
      part1: partDetails[1].score,
      part2: partDetails[2].score,
      part3: partDetails[3].score,
      part4: partDetails[4].score,
    },
    parts: {
      part1: partDetails[1],
      part2: partDetails[2],
      part3: partDetails[3],
      part4: partDetails[4],
    },
    findingCounts: totalCounts,
  };
}

function createEmptyPartDetail(part: number, name: string, weightInProfile: number): PartScoreDetail {
  return {
    part,
    name,
    score: 0,
    weightInProfile,
    achievedWeight: 0,
    measuredWeight: 0,
    totalPossibleWeight: 0,
    factorsCount: {
      total: 0,
      measured: 0,
      ok: 0,
      warn: 0,
      crit: 0,
      na: 0,
    },
    groups: {},
  };
}
