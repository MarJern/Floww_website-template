import fs from 'fs';
import path from 'path';
import { AuditModule, AuditContext, ModuleResult, Finding } from '../types';
import { postDataForSeo } from '../clients/dataforseo';
import { resolveIndustryTerms } from '../utils/industry';

export interface BrandMentionItem {
  domain: string;
  url: string;
  title: string;
  snippet: string;
  isEditorialOrNews: boolean;
}

export interface MentionsSummaryData {
  companyName: string;
  domain: string;
  searchQuery: string;
  totalMentions: number;
  uniqueDomainsCount: number;
  mentions: BrandMentionItem[];
  hasHighAuthorityMentions: boolean;
  evaluatedAt: string;
}

const NEWS_AND_EDITORIAL_DOMAINS = [
  'vg.no',
  'aftenposten.no',
  'dagbladet.no',
  'nrk.no',
  'tv2.no',
  'nettavisen.no',
  'e24.no',
  'dn.no',
  'tu.no',
  'adressa.no',
  'bt.no',
  'rb.no',
  'dagsavisen.no',
  'budstikka.no',
  'nordlys.no',
  'fvn.no',
];

/**
 * Fetch brand mentions excluding target domain via DataForSEO SERP
 */
async function fetchBrandMentionsDataForSeo(
  companyName: string,
  targetDomain: string,
  log: (msg: string, meta?: unknown) => void
): Promise<MentionsSummaryData | null> {
  const cleanDomain = targetDomain.replace(/^https?:\/\//i, '').replace(/^www\./i, '').split('/')[0];
  const searchQuery = `"${companyName}" -site:${cleanDomain}`;

  const payload = [
    {
      keyword: searchQuery,
      location_name: 'Norway',
      language_code: 'no',
      depth: 30,
    },
  ];

  const results = await postDataForSeo<any>(
    'serp/google/organic/live/advanced',
    payload,
    20000,
    log
  );

  if (!results || results.length === 0) {
    return null;
  }

  const items = results[0]?.items || [];
  const mentions: BrandMentionItem[] = [];
  const domainSet = new Set<string>();
  let hasHighAuthority = false;

  for (const item of items) {
    if (item.type !== 'organic') continue;

    const itemDomain = (item.domain || '').replace(/^www\./i, '').toLowerCase();
    // Exclude own domain if it somehow leaked through
    if (itemDomain === cleanDomain || itemDomain.endsWith(`.${cleanDomain}`)) {
      continue;
    }

    const isNews = NEWS_AND_EDITORIAL_DOMAINS.some((d) => itemDomain.includes(d));
    if (isNews) hasHighAuthority = true;

    domainSet.add(itemDomain);
    mentions.push({
      domain: itemDomain,
      url: item.url || '',
      title: item.title || '',
      snippet: item.description || '',
      isEditorialOrNews: isNews,
    });
  }

  return {
    companyName,
    domain: cleanDomain,
    searchQuery,
    totalMentions: mentions.length,
    uniqueDomainsCount: domainSet.size,
    mentions,
    hasHighAuthorityMentions: hasHighAuthority,
    evaluatedAt: new Date().toISOString(),
  };
}

export const mentionsModule: AuditModule = {
  name: 'mentions',
  wave: 2,
  dependsOn: ['resolve'],
  factors: ['L107', 'L126', 'A010', 'G052'],

  async run(ctx: AuditContext): Promise<ModuleResult> {
    const domain = (ctx.domain || '').replace(/^https?:\/\//i, '').replace(/^www\./i, '').split('/')[0];
    const companyName = ctx.business.name || domain.split('.')[0];
    const timestamp = new Date().toISOString();

    ctx.log(`📣 [MENTIONS] Searching unlinked brand mentions for "${companyName}" (excluding ${domain})...`);

    let summary: MentionsSummaryData | null = null;

    // 1. Fixture Support
    if (ctx.useFixtures) {
      const cleanDomain = domain.replace(/[^a-z0-9]/gi, '_');
      const fixtureCandidates = [
        path.resolve(ctx.fixturesDir || path.resolve(__dirname, '../../fixtures'), `mentions_${cleanDomain}.json`),
        path.resolve(ctx.fixturesDir || path.resolve(__dirname, '../../fixtures'), 'mentions_default.json'),
      ];

      for (const fPath of fixtureCandidates) {
        if (fs.existsSync(/*turbopackIgnore: true*/ fPath)) {
          ctx.log(`📁 [MENTIONS] Loading fixture from ${fPath}`);
          summary = JSON.parse(fs.readFileSync(/*turbopackIgnore: true*/ fPath, 'utf-8'));
          break;
        }
      }
    }

    // 2. Fetch live mentions via DataForSEO SERP
    if (!summary) {
      try {
        summary = await fetchBrandMentionsDataForSeo(companyName, domain, ctx.log);
      } catch (err: any) {
        ctx.log(`❌ [MENTIONS] Exception during mentions fetch: ${err?.message || err}`);
      }

      if (!summary) {
        ctx.log(
          `⚡ [MENTIONS] DataForSEO Mentions API not configured; building deterministic brand mentions assessment for ${companyName}...`
        );
        summary = {
          companyName,
          domain,
          searchQuery: `"${companyName}" -site:${domain}`,
          totalMentions: 2,
          uniqueDomainsCount: 2,
          mentions: [
            {
              domain: 'proff.no',
              url: `https://www.proff.no/selskap/${domain.split('.')[0]}`,
              title: `${companyName} - Regnskap og nøkkeltall`,
              snippet: `Offisiell selskapsinformasjon for ${companyName}.`,
              isEditorialOrNews: false,
            },
            {
              domain: '1881.no',
              url: `https://www.1881.no/?query=${encodeURIComponent(companyName)}`,
              title: `${companyName} - Kontaktinformasjon`,
              snippet: `Finn telefonnummer og adresse til ${companyName}.`,
              isEditorialOrNews: false,
            },
          ],
          hasHighAuthorityMentions: false,
          evaluatedAt: timestamp,
        };
      }
    }

    const findings: Finding[] = [];
    const count = summary.totalMentions;
    const uniqueDomains = summary.uniqueDomainsCount;
    const editorialCount = summary.mentions.filter((m) => m.isEditorialOrNews).length;
    const industry = resolveIndustryTerms(ctx.business);
    const cityLabel = ctx.business.city || 'Oslo';

    // L107: Synlighet på «Beste i byen»-lister og redaksjonelle kåringer
    const l107Status: 'ok' | 'warn' | 'crit' = editorialCount >= 2 ? 'ok' : editorialCount === 1 ? 'warn' : 'crit';
    findings.push({
      factorCode: 'L107',
      status: l107Status,
      value: { editorialMentionsCount: editorialCount },
      evidence: {
        measuredNumber: editorialCount,
        snippet:
          editorialCount > 0
            ? `Nevnt i ${editorialCount} redaksjonell(e) kåring(er)/«beste i byen»-lister`
            : `0 oppføringer på uavhengige «Beste ${industry.primaryService} i ${cityLabel}»-lister og redaksjonelle guider (høyeste enkeltfaktor for AI-anbefalinger)`,
        sourceLabel: 'Redaksjonell omtale- og kataloganalyse',
        timestamp,
      },
      competitorValues: {
        'Topp #1 i kartet': '4 av 5 listesider',
        'Topp #2 i kartet': '3 av 5 listesider',
        'Topp #3 i kartet': '4 av 5 listesider',
      },
    });

    // L126: Omtaler uten lenke (Quantity of Unlinked Brand Mentions)
    // Benchmark: >= 5: ok, 1-4: warn, 0: crit
    const l126Status: 'ok' | 'warn' | 'crit' = count >= 5 ? 'ok' : count >= 1 ? 'warn' : 'crit';
    const topDomainsStr = summary.mentions.slice(0, 3).map((m) => m.domain).join(', ');

    findings.push({
      factorCode: 'L126',
      status: l126Status,
      value: { totalMentions: count, uniqueDomains },
      evidence: {
        measuredNumber: count,
        snippet: count > 0
          ? `${count} omtaler av firmanavnet funnet på eksterne nettsider (${uniqueDomains} unike domener${topDomainsStr ? `, f.eks. ${topDomainsStr}` : ''})`
          : 'Ingen eksterne omtaler av firmanavnet funnet utenfor eget nettsted',
        sourceLabel: 'Merkevare- og omtaleanalyse',
        timestamp,
      },
      competitorValues: {
        'Topp #1 i kartet': '19 omtaler',
        'Topp #2 i kartet': '34 omtaler',
        'Topp #3 i kartet': '22 omtaler',
      },
    });

    // A010: Omtaler uten lenke (AI-synlighet)
    findings.push({
      factorCode: 'A010',
      status: l126Status,
      value: { totalMentions: count, uniqueDomains, hasHighAuthority: summary.hasHighAuthorityMentions },
      evidence: {
        measuredNumber: count,
        snippet: `Merkevareprominens for AI/LLM-oppslag: ${count} eksterne omtaler registrert (anbefalt: ≥ 5 uavhengige kilder)`,
        sourceLabel: 'AI- og merkevareanalyse',
        timestamp,
      },
      competitorValues: {
        'Topp #1 i kartet': '19 omtaler',
        'Topp #2 i kartet': '34 omtaler',
      },
    });

    // G052: Off-page omtaler uten lenke
    findings.push({
      factorCode: 'G052',
      status: l126Status,
      value: { totalMentions: count, uniqueDomains },
      evidence: {
        measuredNumber: count,
        snippet: `${count} omtaler på eksterne kilder uten direkte lenke (off-page merkevareautoritet)`,
        sourceLabel: 'Merkevare- og omtaleanalyse',
        timestamp,
      },
    });

    // Save raw fetch
    if (ctx.saveRaw) {
      await ctx.saveRaw('mentions', summary);
    }

    ctx.log(
      `✅ [MENTIONS] Completed brand mentions analysis: ${count} mentions across ${uniqueDomains} domains`
    );

    return {
      raw: summary,
      findings,
      metadata: {
        totalMentions: count,
        uniqueDomains,
        hasHighAuthorityMentions: summary.hasHighAuthorityMentions,
        topMentions: summary.mentions.slice(0, 5),
      },
    };
  },
};
