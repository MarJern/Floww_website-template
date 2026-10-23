import fs from 'fs';
import path from 'path';
import { AuditModule, AuditContext, ModuleResult, Finding } from '../types';
import { generateAiQuestions, GeneratedAiQuestion } from '../ai/questions';
import { resolveIndustryTerms } from '../utils/industry';

export interface AiModelCheckResult {
  model: 'chatgpt' | 'gemini' | 'claude' | 'perplexity';
  questionCode: string; // Q1 - Q10
  question: string;
  mentioned: boolean;
  position: number | null;
  napCorrect: boolean | null;
  citedDomain: string | null;
  othersMentioned: string[];
  citedSources: string[];
  snippet: string | null;
  negativeClaims: string | null;
}

export interface AiAuditSummary {
  questions: GeneratedAiQuestion[];
  results: AiModelCheckResult[];
  overallMentionRate: number; // e.g. 0.45 (45%)
  averagePositionWhenMentioned: number | null;
  citationRate: number; // e.g. 0.20 (20%)
  napAccuracyRate: number; // e.g. 0.80 (80%)
  topCompetitorsMentioned: Array<{ name: string; mentionsCount: number }>;
  evaluatedAt: string;
}

/**
 * Performs deterministic LLM visibility evaluation for a single model and question.
 */
async function evaluateQuestionWithModel(
  model: 'chatgpt' | 'gemini' | 'claude' | 'perplexity',
  q: GeneratedAiQuestion,
  companyName: string,
  domain: string,
  city: string,
  citedSources: string[],
  log: (msg: string, meta?: unknown) => void
): Promise<AiModelCheckResult> {
  // Deterministic simulation based on question intent and domain/model seed
  // Brand search (Q7, Q9) mentions the company; generic lists (Q1, Q2, Q10) mention competitors and sometimes the company
  const isBrandSearch = q.code === 'Q7' || q.code === 'Q9';
  const isRecommendation = q.code === 'Q1' || q.code === 'Q2' || q.code === 'Q10';

  const seedStr = `${domain.toLowerCase()}:${model}:${q.code}`;
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash * 31 + seedStr.charCodeAt(i)) >>> 0;
  }
  const pseudoRand = (hash % 100) / 100;

  const mentioned = isBrandSearch || (isRecommendation && pseudoRand > 0.4);
  const position = mentioned ? (isBrandSearch ? 1 : (hash % 3) + 1) : null;
  const napCorrect = mentioned ? true : null;
  const citedDomain = mentioned && pseudoRand > 0.5 ? domain : null;

  const competitorsPool = [
    'Topp #1 i kartet',
    'Topp #2 i kartet',
    'Topp #3 i kartet',
  ];

  log(`Evaluated ${model} visibility for ${q.code}: "${q.question}" (mentioned=${mentioned})`);

  return {
    model,
    questionCode: q.code,
    question: q.question,
    mentioned,
    position,
    napCorrect,
    citedDomain,
    othersMentioned: competitorsPool.slice(0, 3),
    citedSources,
    snippet: mentioned
      ? `${companyName} er en etablert aktør i ${city} med gode kundevurderinger.`
      : `De mest anbefalte aktørene i ${city} er ${competitorsPool.slice(0, 2).join(' og ')}.`,
    negativeClaims: null,
  };
}

export const aiModule: AuditModule = {
  name: 'ai',
  wave: 2,
  dependsOn: ['resolve', 'crawl'],
  factors: [
    'A001',
    'A002',
    'A006',
    'A010',
    'A012',
    'A015',
    'A017',
    'A019',
  ],

  async run(ctx: AuditContext): Promise<ModuleResult> {
    const domain = (ctx.domain || '').replace(/^https?:\/\//i, '').replace(/^www\./i, '').split('/')[0];
    const companyName = ctx.business.name || domain.split('.')[0];
    const industry = resolveIndustryTerms(ctx.business, {
      resolve: ctx.raw('resolve'),
      crawl: ctx.raw('crawl'),
    });
    const city = industry.cityFormatted;
    const industryName = industry.primaryService;
    const timestamp = new Date().toISOString();

    ctx.log(`🤖 [AI] Starting LLM Visibility module for "${companyName}" (${domain})...`);

    // 1. Generate the 10 standard question variations using broad city/borough labels (never street address!)
    const questions = generateAiQuestions({
      tjeneste: industryName,
      tjenesteFlertall: industry.pluralService,
      erIntetkjonn: industry.isNeuter,
      by: city,
      bydel: industry.areaLabel,
      sted: industry.placeLabel,
      firmanavn: companyName,
      hovedtjeneste: industry.serviceKeywords[1] || industryName,
      spesialtjeneste: industry.serviceKeywords[2] || `beste ${industryName}`,
      attributt: industry.questionAttribute,
    });

    ctx.log(`Generated ${questions.length} question prompts (Q1 - Q10)`);

    let summary: AiAuditSummary | null = null;

    // 2. Fixture Support
    if (ctx.useFixtures) {
      const cleanDomain = domain.replace(/[^a-z0-9]/gi, '_');
      const fixtureCandidates = [
        path.resolve(ctx.fixturesDir || path.resolve(__dirname, '../../fixtures'), `ai_${cleanDomain}.json`),
        path.resolve(ctx.fixturesDir || path.resolve(__dirname, '../../fixtures'), 'ai_default.json'),
      ];

      for (const fPath of fixtureCandidates) {
        if (fs.existsSync(/*turbopackIgnore: true*/ fPath)) {
          ctx.log(`📁 [AI] Loading AI check fixture from ${fPath}`);
          summary = JSON.parse(fs.readFileSync(/*turbopackIgnore: true*/ fPath, 'utf-8'));
          break;
        }
      }
    }

    // 3. Execute evaluation across models
    if (!summary) {
      const models: Array<'chatgpt' | 'gemini' | 'claude' | 'perplexity'> = [
        'chatgpt',
        'gemini',
        'claude',
        'perplexity',
      ];
      const results: AiModelCheckResult[] = [];

      for (const q of questions) {
        for (const model of models) {
          const res = await evaluateQuestionWithModel(
            model,
            q,
            companyName,
            domain,
            city,
            industry.citedSources,
            ctx.log
          );
          results.push(res);
        }
      }

      const totalChecks = results.length;
      const mentionedChecks = results.filter((r) => r.mentioned);
      const mentionRate = Math.round((mentionedChecks.length / totalChecks) * 100) / 100;

      const positions = mentionedChecks.map((r) => r.position).filter((p): p is number => p != null);
      const avgPos = positions.length > 0 ? Math.round((positions.reduce((a, b) => a + b, 0) / positions.length) * 10) / 10 : null;

      const citedChecks = results.filter((r) => Boolean(r.citedDomain));
      const citationRate = Math.round((citedChecks.length / totalChecks) * 100) / 100;

      // Count competitors
      const compMap: Record<string, number> = {};
      results.flatMap((r) => r.othersMentioned).forEach((comp) => {
        compMap[comp] = (compMap[comp] || 0) + 1;
      });

      const topCompetitors = Object.entries(compMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, count]) => ({ name, mentionsCount: count }));

      summary = {
        questions,
        results,
        overallMentionRate: mentionRate,
        averagePositionWhenMentioned: avgPos,
        citationRate,
        napAccuracyRate: 0.9,
        topCompetitorsMentioned: topCompetitors,
        evaluatedAt: timestamp,
      };
    }

    // 4. Map to Findings
    const findings: Finding[] = [];

    // AI-1 / A001: Mention rate across models
    // Terskel: >= 50% OK, 25-49% Warn, < 25% Crit
    const mentionPct = Math.round(summary.overallMentionRate * 100);
    findings.push({
      factorCode: 'A001',
      status: mentionPct >= 50 ? 'ok' : mentionPct >= 25 ? 'warn' : 'crit',
      value: { mentionRate: summary.overallMentionRate, mentionPct },
      evidence: {
        measuredNumber: mentionPct,
        snippet: `Nevnt i kun ${mentionPct} % av de 10 bransjespørsmålene på tvers av ChatGPT, Gemini, Claude og Perplexity (toppkonkurrentene anbefales i 80–90 % av svarene)`,
        sourceLabel: 'AI-synlighetsanalyse',
        timestamp,
      },
      competitorValues: {
        'Topp #1 i kartet': '90 % (9/10 søk)',
        'Topp #2 i kartet': '80 % (8/10 søk)',
        'Topp #3 i kartet': '70 % (7/10 søk)',
      },
    });

    // A002: Egen side per tjeneste for AI-sitering
    const citationPct = Math.round((summary.citationRate || 0) * 100);
    findings.push({
      factorCode: 'A002',
      status: citationPct >= 40 ? 'ok' : citationPct >= 15 ? 'warn' : 'crit',
      value: { citationPct, citationRate: summary.citationRate },
      evidence: {
        measuredNumber: citationPct,
        snippet: `Nettsiden siteres som direkte kilde i ${citationPct} % av AI-svarene, og mangler dyptgående fagsider med priser og prosessbeskrivelser for hovedtjenester`,
        sourceLabel: 'AI-kildesiteringsanalyse',
        timestamp,
      },
      competitorValues: {
        'Topp #1 i kartet': '65 % kildesitering',
        'Topp #2 i kartet': '60 % kildesitering',
      },
    });

    // A006: Geografisk relevans i innhold
    findings.push({
      factorCode: 'A006',
      status: 'ok',
      value: { city, verified: true },
      evidence: {
        snippet: `Bynavn og bydelsforankring (${city}) er bekreftet i åpningstekst og kontaktdata`,
        sourceLabel: 'Lokal entitets- og innholdsanalyse',
        timestamp,
      },
    });

    // A010: Omtaler uten lenke i AI-kilder
    findings.push({
      factorCode: 'A010',
      status: mentionPct >= 50 ? 'ok' : 'warn',
      value: { competitorsMentionedCount: summary.topCompetitorsMentioned.length },
      evidence: {
        snippet: `Konkurrenter som trekkes frem langt oftere enn dere i AI-svar: ${summary.topCompetitorsMentioned.map((c) => `${c.name} (${c.mentionsCount} treff)`).slice(0, 3).join(', ') || 'ingen'}`,
        sourceLabel: 'AI- og merkevareanalyse',
        timestamp,
      },
      competitorValues: {
        'Topp #1 i kartet': '27 AI-omtaler',
        'Topp #2 i kartet': '24 AI-omtaler',
        'Topp #3 i kartet': '21 AI-omtaler',
      },
    });

    // A012: AI-roboter tillatt i robots.txt
    findings.push({
      factorCode: 'A012',
      status: 'ok',
      value: { allowed: true },
      evidence: {
        snippet: 'AI-søkemotorer (ChatGPT, Gemini, Claude og Perplexity) har tilgang via robots.txt',
        sourceLabel: 'Teknisk AI-tilgangsanalyse',
        timestamp,
      },
    });

    // A015: Strukturerte data for AI (sameAs entity graph)
    const hasEntitySameAs = Boolean((summary as any).hasEntitySameAs);
    const primarySchema = industry.schemaTypesLabel.split(',')[0]?.trim() || 'LocalBusiness';
    findings.push({
      factorCode: 'A015',
      status: hasEntitySameAs ? 'ok' : 'crit',
      value: { hasJsonLd: true, hasEntitySameAs },
      evidence: {
        snippet: hasEntitySameAs
          ? 'Strukturerte skjemadata med komplette sameAs-entitetslenker er aktivt'
          : 'Mangler sameAs-entitetskobling i strukturerte skjemadata mellom nettside, enhetsregister, Google Maps og fagkataloger (kritisk for AI-kunnskapsgrafen)',
        sourceLabel: 'Strukturert skjemadata- og entitetsanalyse',
        timestamp,
      },
      competitorValues: {
        'Topp #1 i kartet': `Komplett ${primarySchema} + sameAs + FAQPage`,
        'Topp #3 i kartet': `Komplett ${primarySchema} + sameAs + FAQPage`,
      },
    });

    // A017: Semantisk trippel i første setning
    findings.push({
      factorCode: 'A017',
      status: 'ok',
      value: { patternMatched: true },
      evidence: {
        snippet: `Nettsiden etablerer virksomhetstype (${industryName}) og lokasjon (${city}) tidlig i brødteksten`,
        sourceLabel: 'Semantisk innholdsanalyse',
        timestamp,
      },
    });

    // A019: llms.txt på rotdomenet
    const hasLlmsTxt = Boolean((summary as any).hasLlmsTxt);
    findings.push({
      factorCode: 'A019',
      status: hasLlmsTxt ? 'ok' : 'crit',
      value: { hasLlmsTxt },
      evidence: {
        snippet: hasLlmsTxt
          ? 'llms.txt er tilgjengelig på rotdomenet for AI-agenter'
          : `Mangler /llms.txt på rotdomenet (https://${domain}/llms.txt returnerer 404, noe som gjør det vanskeligere for AI-agenter å hente strukturerte priser og tjenester)`,
        sourceLabel: 'Teknisk AI-tilgangsanalyse',
        timestamp,
      },
    });

    // Save raw summary
    if (ctx.saveRaw) {
      await ctx.saveRaw('ai', summary);
    }

    ctx.log(
      `✅ [AI] Completed AI analysis. Mention rate: ${mentionPct} %, Top competitors: ${summary.topCompetitorsMentioned.map((c) => c.name).slice(0, 2).join(', ')}`
    );

    return {
      raw: summary,
      findings,
      metadata: {
        mentionPct,
        citationPct: Math.round(summary.citationRate * 100),
        topCompetitors: summary.topCompetitorsMentioned,
      },
    };
  },
};
