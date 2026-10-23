export interface TeaserFindingItem {
  factorCode: string;
  nameNo: string;
  groupName: string;
  status: 'ok' | 'warn' | 'crit' | 'na';
  part: number;
  headline?: string;
}

export interface ConsultantDetails {
  utredningText: string;
  konsekvensText?: string;
  thresholdInfo: string | null;
  actionSteps: string;
  expectedImpact?: string;
}

export interface UnredactedFindingItem extends TeaserFindingItem {
  subgroupName?: string | null;
  weight?: number;
  value?: unknown;
  rule?: string | null;
  thresholdOk?: string | null;
  thresholdWarn?: string | null;
  thresholdCrit?: string | null;
  notes?: string | null;
  source?: string | null;
  evidence?: {
    url?: string;
    rawValue?: unknown;
    measuredNumber?: number;
    snippet?: string;
    sourceLabel: string;
    timestamp: string;
  };
  competitorValues?: Record<string, string | number | boolean | null>;
  consultantDetails?: ConsultantDetails;
}

export type FullFindingItem = UnredactedFindingItem;

export interface KeywordLossRow {
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
  lostRevenueMonthly: number;
}

export interface GeoGridPoint {
  id: string;
  label: string;
  lat: number;
  lng: number;
  offsetKmX: number;
  offsetKmY: number;
  mapRank: number | null;
}

export interface AiQuestionOverviewItem {
  id: string;
  category: string;
  prompt: string;
  mentioned: boolean;
  position: number | null;
  models: {
    chatgpt: boolean;
    gemini: boolean;
    claude: boolean;
    perplexity: boolean;
  };
  responseSnippet?: string | null;
  othersMentioned?: string[];
  citedDomain?: string | null;
}

export interface AgencyRoiSummary {
  monthlySpend: number;
  durationMonths: number | null;
  totalInvested: number | null;
  annualSpend: number;
  combinedMonthlyBleed: number;
}

export interface ReportApiResponse {
  isUnlocked: boolean;
  slug: string;
  unlockedAt?: string | null;
  pdfPath?: string | null;
  createdAt: string;
  expiresAt: string;
  business: {
    name: string;
    orgnr: string;
    domain: string;
    orgForm: string | null;
    nace: string | null;
    naceName: string | null;
    address: string | null;
    postcode: string | null;
    city: string | null;
    profileType: string;
  };
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
  adsValue: number;
  financialSummary?: {
    nokEstimate: number;
    adsValue: number;
    monthlyLostRevenue: number;
    annualLostRevenue: number;
    monthlyAdsValue: number;
    annualAdsValue: number;
    monthlyLostClicks: number;
    annualLostClicks: number;
    benchmarks?: {
      nace: string;
      industryName: string;
      conversionRate: number;
      customerLifetimeValue: number;
      totalSearchVolume: number;
      averageCpc: number;
    } | null;
    keywords?: KeywordLossRow[];
    summaryText?: string;
    agencyRoi?: AgencyRoiSummary | null;
  } | null;
  teaserHighlights: TeaserFindingItem[];
  teaserFindings: TeaserFindingItem[];
  competitors: Array<{
    placesId: string;
    name: string;
    domain?: string | null;
    rating?: number | null;
    reviewCount?: number | null;
    lightScore?: number | null;
  }>;
  geoGrid?: {
    centerLat: number;
    centerLng: number;
    radiusKm: number;
    points: GeoGridPoint[];
    averageMapRank: number;
  } | null;
  aiOverview?: {
    overallMentionRate: number;
    citationRate: number;
    topCompetitorsMentioned: Array<{ name: string; mentionsCount: number }>;
    questions: AiQuestionOverviewItem[];
  } | null;
  report?: {
    findings?: UnredactedFindingItem[];
    negativeFlags?: UnredactedFindingItem[];
  };
}

export const PART_SECTIONS: Array<{
  part: number;
  code: string;
  title: string;
  subtitle: string;
  description: string;
}> = [
  {
    part: 1,
    code: 'DEL 1',
    title: 'Lokalt søk & Google Maps (Kartpakken)',
    subtitle:
      'Floww Local Search Index 2026: Google Bedriftsprofil, anmeldelser, 3×3 geo-grid og NAP-konsistens',
    description:
      'Kartpakken øverst i Google tar opptil 48 % av alle lokale klikk med høy kjøpsintensjon. Her vurderes faktorene som avgjør om virksomheten deres vises i Topp 3 når kunder i nærområdet søker etter tjenestene deres.',
  },
  {
    part: 2,
    code: 'DEL 2',
    title: 'Teknisk SEO, Innhold & Nettside-arkitektur',
    subtitle:
      'Core Web Vitals (mobil), indeksering, strukturerte skjemadata, tjenestesider, internlenking og autoritet',
    description:
      'Den tekniske og innholdsmessige grunnmuren på nettsiden avgjør både organisk rangering under kartet, konverteringsrate på mobil og hvorvidt søkemotorer forstår tjenestetilbudet deres.',
  },
  {
    part: 3,
    code: 'DEL 3',
    title: 'AI-synlighet (ChatGPT, Gemini, Claude & Perplexity)',
    subtitle:
      'Direkte måling av 10 bransjespørsmål i AI-søkemotorer, siteringsgrad, entitetsgraf (sameAs) og llms.txt',
    description:
      'Stadig flere kunder spør ChatGPT, Google Gemini, Claude og Perplexity direkte om hvilken leverandør de bør velge. Her ser dere om AI-modellene anbefaler virksomheten deres eller sender kundene rett til konkurrentene.',
  },
  {
    part: 4,
    code: 'DEL 4',
    title: 'Google Ads-økonomi & Konverteringslekkasje',
    subtitle:
      'Landingssideopplevelse (Quality Score), annonserelevans, søkeorddekning og unødvendig klikkpris-påslag',
    description:
      'Svak organisk grunnmur og trege landingssider gjør at Google straffer dere med lavere Quality Score, slik at virksomheten må betale 25–40 % mer per klikk i Google Ads enn konkurrentene for samme plassering.',
  },
];

export function formatNok(amount: number): string {
  return new Intl.NumberFormat('nb-NO', {
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

export function getScoreColor(score: number): {
  text: string;
  bg: string;
  border: string;
  bar: string;
  label: string;
} {
  if (score >= 75) {
    return {
      text: 'text-emerald-700',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      bar: 'bg-emerald-600',
      label: 'Sterk synlighet',
    };
  }
  if (score >= 50) {
    return {
      text: 'text-amber-700',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      bar: 'bg-amber-500',
      label: 'Moderat synlighet: Betydelig lekkasje',
    };
  }
  return {
    text: 'text-red-700',
    bg: 'bg-red-50',
    border: 'border-red-200',
    bar: 'bg-red-600',
    label: 'Kritisk synlighetstap',
  };
}

export function getStatusBadge(status: 'ok' | 'warn' | 'crit' | 'na') {
  switch (status) {
    case 'crit':
      return {
        label: 'Kritisk feil',
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200',
        dot: 'bg-red-600',
      };
    case 'warn':
      return {
        label: 'Advarsel',
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        dot: 'bg-amber-500',
      };
    case 'ok':
      return {
        label: 'Godkjent',
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        dot: 'bg-emerald-600',
      };
    default:
      return {
        label: 'Ikke målt',
        bg: 'bg-brand-light',
        text: 'text-brand-blue',
        border: 'border-brand-dark/15',
        dot: 'bg-brand-blue',
      };
  }
}

/**
 * Generates a visible 1-sentence problem/impact statement based ONLY on public
 * metadata (`factorCode`, `nameNo`, `groupName`, `status`, `headline`).
 * Safe to show in locked mode because it uses zero private evidence.
 */
export function getVisibleProblemIndicator(item: TeaserFindingItem): string {
  if (item.headline) {
    return item.headline;
  }

  const code = item.factorCode;
  if (item.status === 'crit') {
    const critMap: Record<string, string> = {
      L002: 'Kritisk kartposisjon: Dere faller utenfor Google Maps Topp 3 i store deler av nærområdet og mister ~48 % av lokale søkeklikk.',
      L008: 'Kritisk profilavvik: Manglende tilleggskategorier på Google-profilen gjør at dere filtreres bort på spesifikke tjenestesøk.',
      L014: 'Kritisk anmeldelsestakt: For lav tilstrømning av nye anmeldelser gjør at konkurrentene drar ifra i Google-kartet hver måned.',
      L048: 'Kritisk tillitssvikt: Ubesvarte Google-anmeldelser svekker både konverteringsraten og Googles aktivitetsvurdering av profilen.',
      L052: 'Kritisk autoritetsunderskudd: For få henvisende domener til landingssiden holder dere nede både i kartpakken og organisk søk.',
      L063: 'Kritisk NAP-konflikt: Avvik i telefonnummer eller adresse mellom norske kataloger skaper usikkerhet i Googles lokasjonsdata.',
      L107: 'Kritisk synlighetshull: Dere mangler oppføring på uavhengige «Beste i byen»-lister som styrer både kundevalg og AI-anbefalinger.',
      G001: 'Kritisk mobilhastighet (LCP): Treg hovedinnlasting på mobil fører til at utålmodige kunder forlater siden før de tar kontakt.',
      G011: 'Kritisk teknisk feil: Brutte interne lenker (HTTP 404) sløser bort crawl-budsjett og gir dårlig brukeropplevelse.',
      G013: 'Kritisk mangel på Schema.org: Ufullstendige strukturerte data hindrer søkemotorer og AI i å lese tjenester, priser og anmeldelser.',
      G031: 'Kritisk innholdshull: Dere mangler egne dedikerte landingssider for flere av bransjens mest lønnsomme kjernetjenester.',
      G037: 'Kritisk mangel på FAQ-struktur: Tjenestesidene mangler strukturerte spørsmål og svar som fanger opp kjøpsklare søk.',
      G044: 'Kritisk lenkeunderskudd: Betydelig færre autoritative domener lenker til dere sammenlignet med topp 3 i bransjen.',
      A001: 'Kritisk lav AI-synlighet: ChatGPT, Gemini, Claude og Perplexity anbefaler konkurrentene deres i flertallet av bransjesøkene.',
      A015: 'Kritisk mangel i AI-kunnskapsgraf: Manglende sameAs-entitetskoblinger gjør at AI-modellene ikke knytter profilene deres sammen.',
      A019: 'Kritisk AI-tilgjengelighet: Mangler /llms.txt på rotdomenet for strukturert innhenting av priser og tjenester i AI-agenter.',
      B001: 'Kritisk Quality Score-tap: Lav mobilhastighet straffer dere med 25–35 % høyere klikkpris (CPC) i Google Ads.',
      B002: 'Kritisk annonselekkasje: Manglende dedikerte landingssider per søkeord gir lav annonserelevans og dyrere konverteringer.',
      B009: 'Kritisk organisk posisjonstap: Dere ligger utenfor topp 3 på de mest verdifulle søkeordene med høyest klikkpris i Google Ads.',
    };
    return (
      critMap[code] ||
      `Kritisk avvik i ${item.groupName.toLowerCase()}: Trekker ned synlighetsscoren direkte og fører til tapt lokal trafikk til topp 3.`
    );
  }

  if (item.status === 'warn') {
    const warnMap: Record<string, string> = {
      L009: 'Forbedringspotensial: Antall Google-anmeldelser ligger betydelig bak de 3 mest synlige konkurrentene i området.',
      L011: 'Forbedringspotensial: Det har gått for lang tid siden siste publiserte kundeanmeldelse på Google-profilen.',
      L022: 'Forbedringspotensial: Google-profilen mangler viktige felter som tjenestemeny med priser og utvidet bildegalleri.',
      L024: 'Forbedringspotensial: Flere viktige undertjenester er samlet på felles sider i stedet for egne rangerbare landingssider.',
      L025: 'Forbedringspotensial: Lenkeautoriteten inn til landingssiden er svakere enn hos de ledende aktørene i kartpakken.',
      L028: 'Forbedringspotensial: Mangler verifisert oppføring eller har avvik på Apple Maps / Bing Places (viktig for Siri og ChatGPT).',
      L031: 'Forbedringspotensial: Domenestyrken (Domain Rank) ligger under snittet for topp 3 i deres bransje.',
      L049: 'Forbedringspotensial: Virksomheten mangler synlighet i én eller flere av de 6 viktigste norske bransjekatalogene.',
      L060: 'Forbedringspotensial: For få oppdaterte bilder på Google-profilen sammenlignet med lokale markedsledere.',
      L126: 'Forbedringspotensial: Lavt antall ulenkede merkevareomtaler på eksterne norske nettsider og fagportaler.',
      G002: 'Forbedringspotensial: Interaksjonsresponsen på mobil (INP) er tregere enn Googles anbefalte terskel på 200 ms.',
      G004: 'Forbedringspotensial: Google PageSpeed-scoren på mobil ligger under anbefalt nivå (80/100) for rask brukeropplevelse.',
      G010: 'Forbedringspotensial: Enkelte undersider mangler selv-refererende canonical-tag for å forhindre duplisert innhold.',
      G016: 'Forbedringspotensial: Serverens responstid (TTFB) er høyere enn optimalt og forsinker første visning av siden.',
      G028: 'Forbedringspotensial: Flere sidetitler (<title>) mangler tydelig geografisk forankring (by/bydel + tjeneste).',
      G029: 'Forbedringspotensial: Enkelte undersider har for korte eller manglende meta-beskrivelser som svekker klikkraten i søk.',
      G045: 'Forbedringspotensial: Off-page domenestyrke er lavere enn hos konkurrentene som dominerer side 1.',
      G048: 'Forbedringspotensial: Ankertekstprofilen har for lav andel relevante bransje- og tjenesteord.',
      G052: 'Forbedringspotensial: Få redaksjonelle omtaler utenfor egne kanaler svekker off-page merkevareautoritet.',
      G054: 'Forbedringspotensial: Sosiale bedriftsprofiler mangler fullt samsvar eller jevnlig oppdatering.',
      A002: 'Forbedringspotensial: Lav siteringsgrad i AI-svar fordi fagsidene mangler konkrete pris- og tjenestefakta.',
      A003: 'Forbedringspotensial: Mangler oppføring i enkelte autoritative kataloger som AI-modellene bruker til faktasjekk.',
      A010: 'Forbedringspotensial: Konkurrentene nevnes langt oftere i eksterne kilder som inngår i AI-modellenes treningsdata.',
      A014: 'Forbedringspotensial: Manglende verifisering i Bing Places/Apple Maps reduserer treff i ChatGPT Search og Siri.',
      B005: 'Konkurrentvarsel: Konkurrenter kjøper betalte Google Ads-annonser når kunder søker direkte på deres firmanavn.',
      B007: 'Forbedringspotensial: Antall anmeldelser er under grensen for automatiske stjerneutvidelser (Seller Ratings) i Google Ads.',
      B011: 'Markedsobservasjon: Konkurrenter kjøper betalt synlighet øverst på hovedsøkeordene uten at dere er til stede.',
    };
    return (
      warnMap[code] ||
      `Delvis optimalisert i ${item.groupName.toLowerCase()}: Krever justering for å nå full uttelling (100 %) i algoritmen.`
    );
  }

  if (item.status === 'ok') {
    return `Godkjent: ${item.nameNo} oppfyller beste praksis og bidrar positivt til synligheten i ${item.groupName.toLowerCase()}.`;
  }

  return 'Kontekstfaktor: Vises som bakgrunnsinformasjon i rapporten.';
}

/**
 * Returns server-provided consultant elaboration ("Utredning") and step-by-step fix instructions
 * ONLY when `isUnlocked === true`. Step-by-step recipes live strictly on the server.
 */
export function getUnlockedConsultantDetails(
  item: UnredactedFindingItem,
  _businessName: string,
  _city: string
): ConsultantDetails {
  if (item.consultantDetails) {
    return item.consultantDetails;
  }

  const snippet = (item.evidence?.snippet || 'Måleverdi registrert under vår tekniske gjennomgang.')
    .replace(/\s*\(Kilde:[^)]+\)/gi, '')
    .trim()
    .replace(/\.$/, '');
  const ruleText =
    item.rule ||
    'Vurderes etter dokumenterte bransjekrav for lokal synlighet, teknisk helse og konvertering.';
  const thresholdInfo = item.thresholdOk
    ? `Krav for Godkjent: ${item.thresholdOk}${
        item.thresholdWarn ? ` · Advarsel: ${item.thresholdWarn}` : ''
      }${item.thresholdCrit ? ` · Kritisk: ${item.thresholdCrit}` : ''}`
    : null;

  return {
    utredningText: `${snippet}. Vår tekniske kontroll målte denne faktoren opp mot bransjekravet: «${ruleText}»`,
    konsekvensText: getVisibleProblemIndicator(item),
    thresholdInfo,
    actionSteps: `1. Kontroller målt verdi opp mot bransjekravet: ${ruleText}\n2. Korriger avviket slik at faktoren oppfyller anbefalt nivå (${item.thresholdOk || 'Beste praksis'}).\n3. Kjør ny verifisering etter implementering.`,
    expectedImpact: 'Løfter synlighetsscoren i denne kategorien.',
  };
}
