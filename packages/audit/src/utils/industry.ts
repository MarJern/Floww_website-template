import { BusinessData } from '../types';

export interface ResolvedIndustryTerms {
  /** Primary short search keyword in Norwegian (e.g. "digitalbyrå", "advokat", "rørlegger", "tannlege") */
  primaryService: string;
  /** Plural form of primaryService (e.g. "digitalbyråer", "advokater", "tannleger") */
  pluralService: string;
  /** Whether primaryService is grammatical neuter in Norwegian ("et digitalbyrå" vs "en tannlege") */
  isNeuter: boolean;
  /** Plural/category label in Norwegian (e.g. "markedsførings- og digitalbyråer", "advokatfirmaer") */
  categoryLabel: string;
  /** 4 relevant search terms for keyword/anchor simulations */
  serviceKeywords: string[];
  /** Relevant Schema.org types for this industry */
  schemaTypesLabel: string;
  /** Relevant Norwegian directory/citation sources for this industry */
  citedSources: string[];
  /** Natural attribute phrase for Q8 (e.g. "med dokumenterte resultater" or "som tar imot nye pasienter") */
  questionAttribute: string;
  /** Formatted Title-Case city name (e.g. "Oslo" instead of "OSLO") */
  cityFormatted: string;
  /** Broad search area / borough (e.g. "Oslo og omegn" for B2B, or "Majorstuen" / "Frogner" for local clinics) */
  areaLabel: string;
  /** Local hub / center reference for proximity queries (e.g. "Oslo sentrum" or "Majorstuenkrysset") */
  placeLabel: string;
}

export interface WebsiteServiceSignals {
  pageTitle?: string | null;
  metaDescription?: string | null;
  headings?: string[];
  serviceSlugs?: string[];
}

export interface IndustrySignalContext {
  resolve?: unknown;
  crawl?: unknown;
  homepageSignals?: WebsiteServiceSignals | null;
}

interface IndustryPreset {
  prefixes: string[];
  /** Specific terms in website title/H1/slugs/name that disambiguate broad NACE codes (checked first) */
  nicheTriggers?: string[];
  keywordsInName?: string[];
  primaryService: string;
  pluralService: string;
  isNeuter?: boolean;
  isWholeCityB2B?: boolean;
  questionAttribute?: string;
  categoryLabel: string;
  serviceKeywords: string[];
  /** Real high-intent sub-services; if mentioned on the business's own website, promoted into serviceKeywords */
  candidateSubServices?: Array<{ match: string[]; keyword: string }>;
  schemaTypesLabel: string;
  citedSources?: string[];
}

const INDUSTRY_PRESETS: IndustryPreset[] = [
  // --- HEALTHCARE & CLINICS ---
  {
    prefixes: ['86.23'],
    keywordsInName: ['tannlege', 'tannklinikk', 'dental', 'tannhelse'],
    primaryService: 'tannlege',
    pluralService: 'tannleger',
    questionAttribute: 'som tar imot nye pasienter',
    categoryLabel: 'tannklinikker',
    serviceKeywords: ['tannlege', 'tannbehandling', 'tannlegevakt', 'tannbleking'],
    candidateSubServices: [
      { match: ['implantat', 'tannimplantat'], keyword: 'tannimplantat' },
      { match: ['invisalign', 'usynlig tannregulering', 'tannregulering'], keyword: 'usynlig tannregulering' },
      { match: ['tannbleking'], keyword: 'tannbleking' },
      { match: ['akutt', 'tannlegevakt'], keyword: 'akutt tannlege' },
      { match: ['rotfylling'], keyword: 'rotfylling' },
      { match: ['visdomstann', 'visdomstenner'], keyword: 'trekking av visdomstann' },
      { match: ['tannlegeskrekk', 'odontofobi', 'narkose'], keyword: 'tannlege ved tannlegeskrekk' },
    ],
    schemaTypesLabel: 'Dentist, MedicalClinic, FAQPage',
    citedSources: ['legelisten.no', 'gulesider.no', '1881.no'],
  },
  {
    prefixes: ['86.90'],
    nicheTriggers: ['kiropraktor', 'kiropraktikk'],
    keywordsInName: ['kiropraktor', 'kiropraktikk'],
    primaryService: 'kiropraktor',
    pluralService: 'kiropraktorer',
    questionAttribute: 'med kort ventetid',
    categoryLabel: 'kiropraktorklinikker',
    serviceKeywords: ['kiropraktor', 'behandling av ryggsmerter', 'nakkesmerter', 'isjias behandling'],
    candidateSubServices: [
      { match: ['rygg', 'ryggsmerter', 'korsrygg'], keyword: 'behandling av ryggsmerter' },
      { match: ['nakke', 'nakkesmerter'], keyword: 'behandling av nakkesmerter' },
      { match: ['isjias', 'prolaps'], keyword: 'isjias behandling' },
      { match: ['svimmelhet', 'krystallsyke'], keyword: 'behandling av svimmelhet' },
      { match: ['trykkbølge', 'trykkbolge'], keyword: 'trykkbølgebehandling' },
    ],
    schemaTypesLabel: 'Chiropractor, MedicalBusiness, FAQPage',
    citedSources: ['legelisten.no', 'gulesider.no', '1881.no'],
  },
  {
    prefixes: ['86.90'],
    nicheTriggers: ['fysioterapi', 'fysioterapeut', 'manuellterapi'],
    keywordsInName: ['fysioterapi', 'fysioterapeut', 'fysikalsk'],
    primaryService: 'fysioterapeut',
    pluralService: 'fysioterapeuter',
    questionAttribute: 'med kort ventetid',
    categoryLabel: 'fysioterapiklinikker',
    serviceKeywords: ['fysioterapeut', 'fysioterapi', 'opptrening og rehabilitering', 'trykkbølgebehandling'],
    candidateSubServices: [
      { match: ['trykkbølge', 'trykkbolge'], keyword: 'trykkbølgebehandling' },
      { match: ['idrettsskade', 'idrettsfysioterapi'], keyword: 'behandling av idrettsskader' },
      { match: ['rehabilitering', 'opptrening'], keyword: 'rehabilitering og opptrening' },
    ],
    schemaTypesLabel: 'PhysicalTherapy, MedicalBusiness, FAQPage',
    citedSources: ['legelisten.no', 'gulesider.no', '1881.no'],
  },
  {
    prefixes: ['86.90'],
    nicheTriggers: ['psykolog', 'psykoterapi', 'samtaleterapi', 'parterapi'],
    keywordsInName: ['psykolog', 'psykologtjenester', 'terapi'],
    primaryService: 'psykolog',
    pluralService: 'psykologer',
    questionAttribute: 'uten lang ventetid',
    categoryLabel: 'psykologklinikker',
    serviceKeywords: ['privat psykolog', 'psykologtime', 'parterapi', 'samtaleterapi'],
    candidateSubServices: [
      { match: ['parterapi', 'parsamtale'], keyword: 'parterapi' },
      { match: ['angst', 'depresjon'], keyword: 'behandling av angst og uro' },
      { match: ['utbrenthet', 'stress'], keyword: 'hjelp ved stress og utbrenthet' },
      { match: ['adhd', 'utredning'], keyword: 'ADHD-utredning' },
    ],
    schemaTypesLabel: 'MedicalBusiness, LocalBusiness, FAQPage',
    citedSources: ['legelisten.no', 'gulesider.no', '1881.no'],
  },
  {
    prefixes: ['86.90'],
    nicheTriggers: ['naprapat', 'osteopat'],
    keywordsInName: ['naprapat', 'osteopat'],
    primaryService: 'naprapat',
    pluralService: 'naprapater',
    questionAttribute: 'med kort ventetid',
    categoryLabel: 'muskel- og leddklinikker',
    serviceKeywords: ['naprapat', 'muskel- og leddbehandling', 'behandling av ryggsmerter', 'idrettsskader'],
    schemaTypesLabel: 'MedicalBusiness, LocalBusiness, FAQPage',
    citedSources: ['legelisten.no', 'gulesider.no', '1881.no'],
  },
  {
    prefixes: ['86.21', '86.22'],
    keywordsInName: ['legesenter', 'legeklinikk', 'medeia', 'volvat', 'aleris', 'legevakt'],
    primaryService: 'privat lege',
    pluralService: 'legeklinikker',
    questionAttribute: 'med kort ventetid',
    categoryLabel: 'legeklinikker',
    serviceKeywords: ['privat lege', 'legetime på dagen', 'helsekontroll', 'spesialistklinikk'],
    candidateSubServices: [
      { match: ['gynekolog', 'gynekologi'], keyword: 'privat gynekolog' },
      { match: ['hudlege', 'dermatolog'], keyword: 'privat hudlege' },
      { match: ['ultralyd'], keyword: 'privat ultralyd' },
      { match: ['helsekontroll', 'helsesjekk', 'bedriftshelsetjeneste'], keyword: 'utvidet helsekontroll' },
      { match: ['øre-nese-hals', 'ønh'], keyword: 'øre-nese-hals-spesialist' },
    ],
    schemaTypesLabel: 'MedicalClinic, Physician, FAQPage',
    citedSources: ['legelisten.no', 'gulesider.no', '1881.no'],
  },
  {
    prefixes: ['86.90'],
    keywordsInName: ['klinikk', 'helse'],
    primaryService: 'tverrfaglig klinikk',
    pluralService: 'helseklinikker',
    questionAttribute: 'med kort ventetid',
    categoryLabel: 'helseklinikker',
    serviceKeywords: ['tverrfaglig klinikk', 'fysioterapi', 'kiropraktor', 'muskel- og leddbehandling'],
    schemaTypesLabel: 'MedicalBusiness, LocalBusiness, FAQPage',
    citedSources: ['legelisten.no', 'gulesider.no', '1881.no'],
  },
  // --- BEAUTY, SKIN & HAIR ---
  {
    prefixes: ['96.02', '96.04'],
    nicheTriggers: ['hudklinikk', 'hudpleie', 'laser', 'injeksjon', 'estetisk', 'kosmetisk', 'filler'],
    keywordsInName: ['hudklinikk', 'hudpleie', 'skjønnhet', 'estetisk', 'laser'],
    primaryService: 'hudklinikk',
    pluralService: 'hudklinikker',
    questionAttribute: 'med autoriserte behandlere',
    categoryLabel: 'hud- og estetiske klinikker',
    serviceKeywords: ['hudklinikk', 'hudpleie', 'laserbehandling', 'kosmetisk behandling'],
    candidateSubServices: [
      { match: ['laser', 'hårfjerning'], keyword: 'laserbehandling' },
      { match: ['kjemisk peel', 'peeling', 'microneedling', 'dermapen'], keyword: 'medisinsk hudpleie' },
      { match: ['injeksjon', 'rynke', 'restylane'], keyword: 'kosmetisk sykepleier' },
    ],
    schemaTypesLabel: 'HealthAndBeautyBusiness, MedicalBusiness, FAQPage',
    citedSources: ['gulesider.no', '1881.no', 'proff.no'],
  },
  {
    prefixes: ['96.02'],
    nicheTriggers: ['frisør', 'frisørsalong', 'hårklipp', 'barber'],
    keywordsInName: ['frisør', 'hair', 'barber'],
    primaryService: 'frisør',
    pluralService: 'frisører',
    questionAttribute: 'med dyktige stylister',
    categoryLabel: 'frisørsalonger',
    serviceKeywords: ['frisør', 'frisørsalong', 'klipp og farge', 'balayage'],
    schemaTypesLabel: 'HairSalon, HealthAndBeautyBusiness, FAQPage',
    citedSources: ['gulesider.no', '1881.no', 'proff.no'],
  },
  // --- LEGAL, ACCOUNTING & REAL ESTATE ---
  {
    prefixes: ['69.10'],
    keywordsInName: ['advokat', 'rettshjelp', 'juridisk'],
    primaryService: 'advokat',
    pluralService: 'advokater',
    isWholeCityB2B: true,
    questionAttribute: 'med høy spesialisering',
    categoryLabel: 'advokatfirmaer',
    serviceKeywords: ['advokat', 'advokatfirma', 'juridisk bistand', 'forretningsadvokat'],
    candidateSubServices: [
      { match: ['arbeidsrett', 'oppsigelse'], keyword: 'advokat innen arbeidsrett' },
      { match: ['eiendom', 'boligrett', 'avhendingsloven'], keyword: 'eiendomsadvokat' },
      { match: ['familie', 'arv', 'skifte', 'barnerett'], keyword: 'familierettsadvokat' },
      { match: ['forretningsjus', 'selskapsrett', 'kontrakt'], keyword: 'forretningsadvokat' },
    ],
    schemaTypesLabel: 'LegalService, ProfessionalService, FAQPage',
    citedSources: ['advokatenhjelperdeg.no', 'gulesider.no', 'proff.no'],
  },
  {
    prefixes: ['69.20'],
    keywordsInName: ['regnskap', 'revisjon', 'autorisert regnskapsfører'],
    primaryService: 'regnskapsbyrå',
    pluralService: 'regnskapsbyråer',
    isNeuter: true,
    isWholeCityB2B: true,
    questionAttribute: 'for små og mellomstore bedrifter',
    categoryLabel: 'regnskapsbyråer',
    serviceKeywords: ['regnskapsfører', 'regnskapsbyrå', 'bokføring', 'årsoppgjør'],
    candidateSubServices: [
      { match: ['tripletex', 'poweroffice', 'fiken'], keyword: 'regnskapsfører på Tripletex og PowerOffice' },
      { match: ['årsoppgjør', 'skattemelding'], keyword: 'årsoppgjør for AS' },
      { match: ['lønn', 'lønnskjøring'], keyword: 'lønn og regnskap' },
    ],
    schemaTypesLabel: 'AccountingService, ProfessionalService, FAQPage',
    citedSources: ['regnskapnorge.no', 'proff.no', 'gulesider.no'],
  },
  {
    prefixes: ['68.31'],
    keywordsInName: ['eiendomsmegler', 'megler'],
    primaryService: 'eiendomsmegler',
    pluralService: 'eiendomsmeglere',
    questionAttribute: 'med sterk lokalkunnskap',
    categoryLabel: 'eiendomsmeglere',
    serviceKeywords: ['eiendomsmegler', 'salg av bolig', 'verdivurdering bolig', 'meglerprovisjon'],
    schemaTypesLabel: 'RealEstateAgent, LocalBusiness, FAQPage',
    citedSources: ['eiendomsmegler.no', 'finn.no', 'gulesider.no'],
  },
  // --- TRADES & CONSTRUCTION ---
  {
    prefixes: ['43.22'],
    keywordsInName: ['rørlegger', 'vvs'],
    primaryService: 'rørlegger',
    pluralService: 'rørleggere',
    questionAttribute: 'med rask utrykning',
    categoryLabel: 'rørleggerbedrifter',
    serviceKeywords: ['rørlegger', 'rørleggervakt', 'baderomsrenovering', 'varmepumpe'],
    candidateSubServices: [
      { match: ['bad', 'baderom', 'totalrenovering'], keyword: 'oppussing av bad' },
      { match: ['rørleggervakt', 'akutt', 'lekkasje'], keyword: 'akutt rørleggervakt' },
      { match: ['varmepumpe', 'vannbåren varme', 'bereder'], keyword: 'montering av varmtvannsbereder' },
    ],
    schemaTypesLabel: 'Plumber, HomeAndConstructionBusiness, FAQPage',
    citedSources: ['mittanbud.no', 'gulesider.no', '1881.no'],
  },
  {
    prefixes: ['43.21'],
    keywordsInName: ['elektriker', 'elektro', 'elinstallasjon'],
    primaryService: 'elektriker',
    pluralService: 'elektrikere',
    questionAttribute: 'med rask levering',
    categoryLabel: 'elektrikerbedrifter',
    serviceKeywords: ['elektriker', 'elbillader', 'elsjekk', 'sikringsskap'],
    candidateSubServices: [
      { match: ['elbil', 'elbillader', 'ladeboks', 'easee', 'zaptec'], keyword: 'montering av elbillader' },
      { match: ['sikringsskap', 'elkontroll', 'elsjekk'], keyword: 'oppgradering av sikringsskap' },
      { match: ['smarthus', 'belysning', 'spotter'], keyword: 'installasjon av belysning og smarthus' },
    ],
    schemaTypesLabel: 'Electrician, HomeAndConstructionBusiness, FAQPage',
    citedSources: ['mittanbud.no', 'gulesider.no', '1881.no'],
  },
  {
    prefixes: ['41.20', '43.3', '43.9'],
    keywordsInName: ['entreprenør', 'byggmester', 'tømrer', 'snekker'],
    primaryService: 'byggmester',
    pluralService: 'entreprenører og byggmestere',
    isWholeCityB2B: true,
    questionAttribute: 'med solide referanser',
    categoryLabel: 'entreprenører og håndverkere',
    serviceKeywords: ['byggmester', 'totalrenovering', 'tilbygg', 'tømrer'],
    candidateSubServices: [
      { match: ['totalrenovering', 'oppussing'], keyword: 'totalrenovering av bolig' },
      { match: ['tilbygg', 'påbygg'], keyword: 'oppføring av tilbygg' },
      { match: ['tak', 'takbytte'], keyword: 'utskifting av tak' },
    ],
    schemaTypesLabel: 'GeneralContractor, HomeAndConstructionBusiness, FAQPage',
    citedSources: ['mittanbud.no', 'proff.no', 'gulesider.no'],
  },
  // --- MARKETING, SEO, WEB & IT AGENCIES (Disambiguated by website services!) ---
  {
    prefixes: ['73.11', '73.12', '73.30', '70.21', '62.', '63.1', '74.1'],
    nicheTriggers: [
      'lokal seo',
      'lokal-seo',
      'søkemotoroptimalisering',
      'seo-byrå',
      'seo byrå',
      'google-kartet',
      'google bedriftsprofil',
      'ai-seo',
      'synlighet i google',
    ],
    keywordsInName: ['seo', 'synlighet', 'floww'],
    primaryService: 'SEO-byrå',
    pluralService: 'SEO-byråer',
    isNeuter: true,
    isWholeCityB2B: true,
    questionAttribute: 'med dokumenterte resultater',
    categoryLabel: 'SEO- og synlighetsbyråer',
    serviceKeywords: ['seo byrå', 'lokal seo', 'nettsider for bedrifter', 'synlighet på google'],
    candidateSubServices: [
      { match: ['lokal seo', 'lokal-seo', 'google-kartet', 'google maps'], keyword: 'lokal SEO' },
      { match: ['nettside', 'nettsider', 'skreddersydde nettsider'], keyword: 'skreddersydde nettsider for bedrifter' },
      { match: ['ai-seo', 'ai-synlighet', 'chatgpt'], keyword: 'AI-synlighet og teknisk SEO' },
    ],
    schemaTypesLabel: 'ProfessionalService, LocalBusiness, FAQPage',
    citedSources: ['proff.no', 'gulesider.no', '1881.no'],
  },
  {
    prefixes: ['73.11', '73.12', '62.01', '62.02', '62.09', '62.10', '62.20', '62.90', '63.1', '74.1'],
    nicheTriggers: [
      'webutvikling',
      'webdesign',
      'utvikling av nettsider',
      'skreddersydde nettsider',
      'nettbutikk',
      'nettsideutvikling',
    ],
    keywordsInName: ['webbyrå', 'webdesign', 'webutvikling'],
    primaryService: 'webbyrå',
    pluralService: 'webbyråer',
    isNeuter: true,
    isWholeCityB2B: true,
    questionAttribute: 'med dokumenterte resultater',
    categoryLabel: 'web- og teknologibyråer',
    serviceKeywords: ['utvikling av nettsider', 'ny nettside til bedrift', 'skreddersydde nettsider', 'webbyrå'],
    schemaTypesLabel: 'ProfessionalService, SoftwareApplication, FAQPage',
    citedSources: ['proff.no', 'gulesider.no', '1881.no'],
  },
  {
    prefixes: ['73.11', '73.12', '73.30', '70.21'],
    nicheTriggers: [
      'google ads',
      'betalt annonsering',
      'performance marketing',
      'sosiale medier',
      'digital markedsføring',
    ],
    keywordsInName: ['markedsføring', 'mediebyrå', 'performance'],
    primaryService: 'markedsføringsbyrå',
    pluralService: 'markedsføringsbyråer',
    isNeuter: true,
    isWholeCityB2B: true,
    questionAttribute: 'med dokumenterte resultater',
    categoryLabel: 'markedsføringsbyråer',
    serviceKeywords: ['markedsføringsbyrå', 'digital markedsføring', 'annonsering på google', 'hjelp med markedsføring'],
    schemaTypesLabel: 'ProfessionalService, LocalBusiness, FAQPage',
    citedSources: ['proff.no', 'gulesider.no', '1881.no'],
  },
  {
    prefixes: ['73.11', '73.12', '73.30', '70.21'],
    keywordsInName: ['reklamebyrå', 'kommunikasjon'],
    primaryService: 'reklamebyrå',
    pluralService: 'reklamebyråer',
    isNeuter: true,
    isWholeCityB2B: true,
    questionAttribute: 'med dokumenterte resultater',
    categoryLabel: 'reklame- og kommunikasjonsbyråer',
    serviceKeywords: ['reklamebyrå', 'merkevarebygging', 'digital markedsføring', 'kommunikasjonsbyrå'],
    schemaTypesLabel: 'ProfessionalService, LocalBusiness, FAQPage',
    citedSources: ['proff.no', 'gulesider.no', '1881.no'],
  },
  {
    prefixes: ['62.01', '62.02', '62.09', '62.10', '62.20', '62.90', '63.1', '74.1'],
    keywordsInName: ['programvare', 'it-konsulent', 'systemutvikling', 'it-drift'],
    primaryService: 'IT-konsulentselskap',
    pluralService: 'IT-konsulentselskaper',
    isNeuter: true,
    isWholeCityB2B: true,
    questionAttribute: 'med sterk teknisk kompetanse',
    categoryLabel: 'IT- og teknologiselskaper',
    serviceKeywords: ['it-konsulenter', 'systemutvikling', 'utvikling av nettsider', 'it-rådgivning'],
    schemaTypesLabel: 'ProfessionalService, SoftwareApplication, FAQPage',
    citedSources: ['proff.no', 'gulesider.no', '1881.no'],
  },
];

/**
 * Extracts lightweight service signals (title, meta description, H1/H2 headings, and internal URL slugs)
 * from raw homepage HTML during Wave 1 pre-flight without any extra HTTP roundtrips.
 */
export function extractWebsiteSignalsFromHtml(html: string): WebsiteServiceSignals {
  const stripTags = (s: string) =>
    s
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  const titleMatch = html.match(/<title[^>]*>([\s\S]{1,160}?)<\/title>/i);
  const pageTitle = titleMatch?.[1] ? stripTags(titleMatch[1]) : undefined;

  const metaDescMatch =
    html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']{1,300})["']/i) ||
    html.match(/<meta[^>]+content=["']([^"']{1,300})["'][^>]+name=["']description["']/i);
  const metaDescription = metaDescMatch?.[1]?.trim();

  const headings: string[] = [];
  const headingRegex = /<h[12][^>]*>([\s\S]{1,180}?)<\/h[12]>/gi;
  let hMatch: RegExpExecArray | null;
  while ((hMatch = headingRegex.exec(html)) !== null && headings.length < 10) {
    const clean = stripTags(hMatch[1]);
    if (clean.length >= 3) headings.push(clean);
  }

  const serviceSlugs: string[] = [];
  const hrefRegex = /href=["']\/([a-z0-9æøå\-_/]{2,60})["']/gi;
  let linkMatch: RegExpExecArray | null;
  const ignoredSlugs = new Set(['om-oss', 'kontakt', 'personvern', 'vilkar', 'blogg', 'artikler', 'login', 'admin']);
  while ((linkMatch = hrefRegex.exec(html)) !== null && serviceSlugs.length < 15) {
    const rawSlug = linkMatch[1].replace(/\/+$/, '').toLowerCase();
    if (
      rawSlug &&
      !rawSlug.startsWith('_next') &&
      !rawSlug.startsWith('images') &&
      !rawSlug.startsWith('api') &&
      !rawSlug.includes('.') &&
      !ignoredSlugs.has(rawSlug) &&
      !serviceSlugs.includes(rawSlug)
    ) {
      serviceSlugs.push(rawSlug);
    }
  }

  return {
    pageTitle,
    metaDescription,
    headings,
    serviceSlugs,
  };
}

/**
 * Formats an uppercase Brreg city name (e.g. "OSLO", "MO I RANA") to natural Norwegian Title Case.
 */
export function formatNorwegianCity(rawCity?: string | null): string {
  const trimmed = (rawCity || '').trim();
  if (!trimmed) return 'Oslo';

  // Strip postal zone suffixes like "KRISTIANSAND S" or "BERGEN"
  const withoutZone = trimmed.replace(/\s+[SNØV]$/i, '');
  const lowerWords = new Set(['i', 'og', 'på', 'ved']);

  return withoutZone
    .toLowerCase()
    .split(/\s+/)
    .map((word, idx) => {
      if (idx > 0 && lowerWords.has(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

/**
 * Maps a Norwegian postcode + city to a natural search area (bydel/region) and local hub (sted),
 * avoiding street addresses (like "Veslekroken") that no user searches for in Google or AI engines.
 */
export function resolveLocationLabels(
  cityFormatted: string,
  postcode?: string | null,
  isWholeCityB2B?: boolean
): { areaLabel: string; placeLabel: string } {
  // B2B / agencies / consulting firms compete across the whole city & region, not a single residential street
  if (isWholeCityB2B) {
    return {
      areaLabel: `${cityFormatted} og omegn`,
      placeLabel: `${cityFormatted} sentrum`,
    };
  }

  const code = parseInt((postcode || '').replace(/\D/g, ''), 10);
  if (!Number.isNaN(code)) {
    // Oslo (0001 - 1299)
    if (code >= 100 && code <= 199) {
      return { areaLabel: 'Oslo sentrum', placeLabel: 'Jernbanetorget og Nationaltheatret' };
    }
    if (code >= 200 && code <= 269) {
      return { areaLabel: 'Frogner', placeLabel: 'Solli plass og Frogner' };
    }
    if (code >= 270 && code <= 279) {
      return { areaLabel: 'Skøyen', placeLabel: 'Skøyen stasjon' };
    }
    if (code >= 280 && code <= 289) {
      return { areaLabel: 'Ullern', placeLabel: 'Ullern og CC Vest' };
    }
    if (code >= 300 && code <= 369) {
      return { areaLabel: 'Majorstuen', placeLabel: 'Majorstuenkrysset' };
    }
    if (code >= 370 && code <= 399) {
      return { areaLabel: 'Oslo vest', placeLabel: 'Slemdal og Vinderen' };
    }
    if (code >= 400 && code <= 449) {
      return { areaLabel: 'Torshov og Sagene', placeLabel: 'Torshov og Sagene' };
    }
    if (code >= 450 && code <= 499) {
      return { areaLabel: 'Nydalen', placeLabel: 'Nydalen og Storo' };
    }
    if (code >= 500 && code <= 569) {
      return { areaLabel: 'Grünerløkka', placeLabel: 'Grünerløkka' };
    }
    if (code >= 570 && code <= 599) {
      return { areaLabel: 'Carl Berner og Tøyen', placeLabel: 'Carl Berner' };
    }
    if (code >= 600 && code <= 669) {
      return { areaLabel: 'Gamle Oslo og Helsfyr', placeLabel: 'Helsfyr og Ensjø' };
    }
    if (code >= 670 && code <= 699) {
      return { areaLabel: 'Østensjø', placeLabel: 'Bryn og Oppsal' };
    }
    if (code >= 700 && code <= 799) {
      return { areaLabel: 'Oslo vest', placeLabel: 'Røa og Ullern' };
    }
    if (code >= 800 && code <= 899) {
      return { areaLabel: 'Ullevål og Nordre Aker', placeLabel: 'Ullevål Stadion' };
    }
    if (code >= 900 && code <= 999) {
      return { areaLabel: 'Grorud og Stovner', placeLabel: 'Groruddalen' };
    }
    if (code >= 1000 && code <= 1099) {
      return { areaLabel: 'Alna', placeLabel: 'Tveita og Furuset' };
    }
    if (code >= 1100 && code <= 1199) {
      return { areaLabel: 'Nordstrand', placeLabel: 'Sæter og Lambertseter' };
    }
    if (code >= 1200 && code <= 1299) {
      return { areaLabel: 'Søndre Nordstrand', placeLabel: 'Mortensrud og Holmlia' };
    }

    // Bærum & Asker (1300 - 1399)
    if (code >= 1300 && code <= 1339) {
      return { areaLabel: 'Sandvika og Bærum', placeLabel: 'Sandvika sentrum' };
    }
    if (code >= 1340 && code <= 1369) {
      return { areaLabel: 'Bærum øst', placeLabel: 'Bekkestua og Fornebu' };
    }
    if (code >= 1370 && code <= 1399) {
      return { areaLabel: 'Asker', placeLabel: 'Asker sentrum' };
    }

    // Stavanger (4000 - 4099)
    if (code >= 4000 && code <= 4019) {
      return { areaLabel: 'Stavanger sentrum', placeLabel: 'Stavanger sentrum' };
    }
    if (code >= 4020 && code <= 4099) {
      return { areaLabel: 'Stavanger og Nord-Jæren', placeLabel: 'Stavanger sentrum' };
    }

    // Bergen (5000 - 5299)
    if (code >= 5000 && code <= 5039) {
      return { areaLabel: 'Bergen sentrum', placeLabel: 'Torgallmenningen og Bergen sentrum' };
    }
    if (code >= 5040 && code <= 5099) {
      return { areaLabel: 'Årstad og Bergenhus', placeLabel: 'Danmarksplass' };
    }
    if (code >= 5100 && code <= 5199) {
      return { areaLabel: 'Åsane og Laksevåg', placeLabel: 'Åsane senter' };
    }
    if (code >= 5200 && code <= 5299) {
      return { areaLabel: 'Fana og Ytrebygda', placeLabel: 'Nesttun og Lagunen' };
    }

    // Trondheim (7000 - 7099)
    if (code >= 7000 && code <= 7019) {
      return { areaLabel: 'Trondheim sentrum', placeLabel: 'Midtbyen og Torvet' };
    }
    if (code >= 7020 && code <= 7099) {
      return { areaLabel: 'Trondheim', placeLabel: 'Solsiden og Lade' };
    }
  }

  return {
    areaLabel: `${cityFormatted} og omegn`,
    placeLabel: `${cityFormatted} sentrum`,
  };
}

function isNeuterNorwegianNoun(word: string): boolean {
  const lower = word.toLowerCase().trim();
  return (
    lower.endsWith('byrå') ||
    lower.endsWith('senter') ||
    lower.endsWith('firma') ||
    lower.endsWith('verksted') ||
    lower.endsWith('kontor') ||
    lower.endsWith('selskap') ||
    lower.endsWith('institutt')
  );
}

/**
 * Converts a formal Norwegian Brreg NACE description into a natural search keyword
 * when no preset matches directly.
 */
function cleanBrregNaceDescription(naceName?: string | null): string | null {
  if (!naceName) return null;
  const cleaned = naceName
    .toLowerCase()
    .replace(/\b(virksomhet|tjenester|tjenesteyting|arbeid|tilknyttet|annen|annet|innen|mv\.?)\b/gi, '')
    .replace(/[(),]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleaned || cleaned.length < 3) return null;
  const words = cleaned.split(' ').slice(0, 2).join(' ');
  return words;
}

function buildWebsiteCorpus(signals?: IndustrySignalContext | null): string {
  if (!signals) return '';
  const parts: string[] = [];

  const resolveRaw = signals.resolve as any;
  const hp: WebsiteServiceSignals | undefined =
    signals.homepageSignals || resolveRaw?.homepageSignals;

  if (hp) {
    if (hp.pageTitle) parts.push(hp.pageTitle);
    if (hp.metaDescription) parts.push(hp.metaDescription);
    if (Array.isArray(hp.headings)) parts.push(...hp.headings);
    if (Array.isArray(hp.serviceSlugs)) parts.push(...hp.serviceSlugs.map((s) => s.replace(/[-_/]/g, ' ')));
  }

  if (resolveRaw?.placeCandidate) {
    const pc = resolveRaw.placeCandidate;
    if (pc.displayName?.text) parts.push(pc.displayName.text);
    if (pc.primaryType) parts.push(pc.primaryType);
    if (Array.isArray(pc.types)) parts.push(...pc.types);
  }

  const crawlRaw = signals.crawl as any;
  if (Array.isArray(crawlRaw?.pages)) {
    for (const p of crawlRaw.pages.slice(0, 15)) {
      if (p?.title) parts.push(p.title);
      if (p?.metaDescription) parts.push(p.metaDescription);
      if (Array.isArray(p?.h1Texts)) parts.push(...p.h1Texts);
      if (typeof p?.url === 'string') {
        try {
          const u = new URL(p.url);
          if (u.pathname && u.pathname !== '/') {
            parts.push(u.pathname.replace(/[-_/]/g, ' '));
          }
        } catch {
          // Ignore invalid URL
        }
      }
    }
  }

  return parts.join(' ').toLowerCase();
}

/**
 * Resolves natural Norwegian search keywords, schema types, citation sources,
 * and geographic search labels dynamically from the business's Brønnøysund NACE code,
 * website signals (title, H1/H2, internal service URLs), postcode, city, and name.
 * Never falls back to "tannlege" unless the business actually is a dental clinic.
 */
export function resolveIndustryTerms(
  business: {
    name?: string | null;
    domain?: string | null;
    nace?: string | null;
    naceName?: string | null;
    city?: string | null;
    postcode?: string | null;
    profileType?: string | null;
  },
  signals?: IndustrySignalContext | null
): ResolvedIndustryTerms {
  const nace = (business.nace || '').trim();
  const naceName = (business.naceName || '').trim();
  const nameAndDomain = `${business.name || ''} ${business.domain || ''} ${naceName}`.toLowerCase();
  const websiteCorpus = buildWebsiteCorpus(signals);
  const fullSignalText = `${nameAndDomain} ${websiteCorpus}`.trim();
  const cityFormatted = formatNorwegianCity(business.city);
  const isB2bProfile =
    business.profileType === 'b2b' ||
    business.profileType === 'nasjonal' ||
    business.profileType === 'nettbutikk';

  const buildFromPreset = (preset: IndustryPreset): ResolvedIndustryTerms => {
    const loc = resolveLocationLabels(
      cityFormatted,
      business.postcode,
      Boolean(preset.isWholeCityB2B || isB2bProfile)
    );

    // Enrich sub-services with actual treatments/services detected on the company's own website
    let serviceKeywords = [...preset.serviceKeywords];
    if (preset.candidateSubServices && fullSignalText.length > 0) {
      const matchedSubKeywords = preset.candidateSubServices
        .filter((sub) => sub.match.some((m) => fullSignalText.includes(m.toLowerCase())))
        .map((sub) => sub.keyword);

      if (matchedSubKeywords.length > 0) {
        const merged = [
          preset.serviceKeywords[0],
          ...matchedSubKeywords,
          ...preset.serviceKeywords.slice(1),
        ];
        serviceKeywords = [...new Set(merged)].slice(0, 4);
      }
    }

    return {
      primaryService: preset.primaryService,
      pluralService: preset.pluralService,
      isNeuter: Boolean(preset.isNeuter || isNeuterNorwegianNoun(preset.primaryService)),
      categoryLabel: preset.categoryLabel,
      serviceKeywords,
      schemaTypesLabel: preset.schemaTypesLabel,
      citedSources: preset.citedSources || ['proff.no', 'gulesider.no', '1881.no'],
      questionAttribute: preset.questionAttribute || 'med gode referanser',
      cityFormatted,
      areaLabel: loc.areaLabel,
      placeLabel: loc.placeLabel,
    };
  };

  // 1. Match by NACE prefix first, disambiguating broad NACE codes via website/name nicheTriggers
  if (nace) {
    const naceCandidates = INDUSTRY_PRESETS.filter((p) =>
      p.prefixes.some((prefix) => nace.startsWith(prefix))
    );
    if (naceCandidates.length > 0) {
      const nicheMatch = naceCandidates.find(
        (p) =>
          (p.nicheTriggers && p.nicheTriggers.some((t) => fullSignalText.includes(t))) ||
          (p.keywordsInName && p.keywordsInName.some((kw) => nameAndDomain.includes(kw)))
      );
      const fallbackNaceMatch =
        naceCandidates.find((p) => !p.nicheTriggers) || naceCandidates[0];
      return buildFromPreset(nicheMatch || fallbackNaceMatch);
    }
  }

  // 2. Match by website nicheTriggers or company name / domain keywords (handles holding companies or missing NACE)
  const byWebsiteOrKeyword =
    INDUSTRY_PRESETS.find((p) =>
      (p.nicheTriggers || []).some((t) => fullSignalText.includes(t))
    ) ||
    INDUSTRY_PRESETS.find((p) =>
      (p.keywordsInName || []).some((kw) => fullSignalText.includes(kw))
    );
  if (byWebsiteOrKeyword) {
    return buildFromPreset(byWebsiteOrKeyword);
  }

  // 3. Derive from Brreg NACE description if available
  const cleanedNace = cleanBrregNaceDescription(naceName);
  if (cleanedNace) {
    const loc = resolveLocationLabels(cityFormatted, business.postcode, isB2bProfile);
    return {
      primaryService: cleanedNace,
      pluralService: `${cleanedNace}-bedrifter`,
      isNeuter: isNeuterNorwegianNoun(cleanedNace),
      categoryLabel: `${cleanedNace}-bedrifter`,
      serviceKeywords: [
        cleanedNace,
        `beste ${cleanedNace}`,
        `${cleanedNace} pris`,
        `${cleanedNace} anbefaling`,
      ],
      schemaTypesLabel: 'ProfessionalService, LocalBusiness, FAQPage',
      citedSources: ['proff.no', 'gulesider.no', '1881.no'],
      questionAttribute: 'med dokumenterte resultater',
      cityFormatted,
      areaLabel: loc.areaLabel,
      placeLabel: loc.placeLabel,
    };
  }

  // 4. Generic business fallback (never "tannlege")
  const cleanCompanyToken =
    (business.name || business.domain || 'bedrift')
      .replace(/\b(as|asa|enk|ans|da|nuf)\b/gi, '')
      .trim() || 'bedrift';
  const loc = resolveLocationLabels(cityFormatted, business.postcode, isB2bProfile);

  return {
    primaryService: cleanCompanyToken.toLowerCase(),
    pluralService: 'lokale bedrifter',
    isNeuter: isNeuterNorwegianNoun(cleanCompanyToken),
    categoryLabel: 'lokale virksomheter',
    serviceKeywords: [
      cleanCompanyToken.toLowerCase(),
      `tjenester ${cityFormatted}`.toLowerCase(),
      `bedrift ${cityFormatted}`.toLowerCase(),
      `rådgivning ${cityFormatted}`.toLowerCase(),
    ],
    schemaTypesLabel: 'ProfessionalService, LocalBusiness, FAQPage',
    citedSources: ['proff.no', 'gulesider.no', '1881.no'],
    questionAttribute: 'med gode anmeldelser',
    cityFormatted,
    areaLabel: loc.areaLabel,
    placeLabel: loc.placeLabel,
  };
}
