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

interface IndustryPreset {
  prefixes: string[];
  keywordsInName?: string[];
  primaryService: string;
  pluralService: string;
  isNeuter?: boolean;
  isWholeCityB2B?: boolean;
  questionAttribute?: string;
  categoryLabel: string;
  serviceKeywords: string[];
  schemaTypesLabel: string;
  citedSources?: string[];
}

const INDUSTRY_PRESETS: IndustryPreset[] = [
  {
    prefixes: ['86.23'],
    keywordsInName: ['tannlege', 'tannklinikk', 'dental'],
    primaryService: 'tannlege',
    pluralService: 'tannleger',
    questionAttribute: 'som tar imot nye pasienter',
    categoryLabel: 'tannklinikker',
    serviceKeywords: ['tannlege', 'tannbehandling', 'tannlegevakt', 'tannklinikk'],
    schemaTypesLabel: 'Dentist, MedicalClinic, FAQPage',
    citedSources: ['legelisten.no', 'gulesider.no', '1881.no'],
  },
  {
    prefixes: ['86.21', '86.22'],
    keywordsInName: ['legesenter', 'legeklinikk', 'medeia', 'volvat', 'aleris'],
    primaryService: 'legeklinikk',
    pluralService: 'legeklinikker',
    questionAttribute: 'med kort ventetid',
    categoryLabel: 'legeklinikker',
    serviceKeywords: ['legeklinikk', 'privat lege', 'legesenter', 'spesialistklinikk'],
    schemaTypesLabel: 'MedicalClinic, Physician, FAQPage',
    citedSources: ['legelisten.no', 'gulesider.no', '1881.no'],
  },
  {
    prefixes: ['86.90'],
    keywordsInName: ['fysioterapi', 'kiropraktor', 'naprapat', 'osteopat', 'psykolog', 'klinikk'],
    primaryService: 'helseklinikk',
    pluralService: 'helseklinikker',
    questionAttribute: 'med kort ventetid',
    categoryLabel: 'helseklinikker',
    serviceKeywords: ['klinikk', 'fysioterapeut', 'kiropraktor', 'behandling'],
    schemaTypesLabel: 'MedicalBusiness, LocalBusiness, FAQPage',
    citedSources: ['legelisten.no', 'gulesider.no', '1881.no'],
  },
  {
    prefixes: ['96.02', '96.04'],
    keywordsInName: ['hudklinikk', 'hudpleie', 'skjønnhet', 'estetisk', 'frisør'],
    primaryService: 'hudklinikk',
    pluralService: 'hudklinikker',
    questionAttribute: 'med erfarne behandlere',
    categoryLabel: 'hud- og skjønnhetsklinikker',
    serviceKeywords: ['hudklinikk', 'hudpleie', 'kosmetisk behandling', 'laserbehandling'],
    schemaTypesLabel: 'HealthAndBeautyBusiness, LocalBusiness, FAQPage',
    citedSources: ['gulesider.no', '1881.no', 'proff.no'],
  },
  {
    prefixes: ['69.10'],
    keywordsInName: ['advokat', 'rettshjelp', 'juridisk'],
    primaryService: 'advokat',
    pluralService: 'advokater',
    isWholeCityB2B: true,
    questionAttribute: 'med høy spesialisering',
    categoryLabel: 'advokatfirmaer',
    serviceKeywords: ['advokat', 'advokatfirma', 'juridisk bistand', 'forretningsadvokat'],
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
    schemaTypesLabel: 'AccountingService, ProfessionalService, FAQPage',
    citedSources: ['regnskapnorge.no', 'proff.no', 'gulesider.no'],
  },
  {
    prefixes: ['43.22'],
    keywordsInName: ['rørlegger', 'vvs'],
    primaryService: 'rørlegger',
    pluralService: 'rørleggere',
    questionAttribute: 'med rask utrykning',
    categoryLabel: 'rørleggerbedrifter',
    serviceKeywords: ['rørlegger', 'rørleggervakt', 'vvs', 'baderomsrenovering'],
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
    serviceKeywords: ['elektriker', 'elektrikervakt', 'elbillader', 'elkontroll'],
    schemaTypesLabel: 'Electrician, HomeAndConstructionBusiness, FAQPage',
    citedSources: ['mittanbud.no', 'gulesider.no', '1881.no'],
  },
  {
    prefixes: ['41.20', '43.3', '43.9'],
    keywordsInName: ['entreprenør', 'byggmester', 'tømrer', ' snekker'],
    primaryService: 'entreprenør',
    pluralService: 'entreprenører',
    isWholeCityB2B: true,
    questionAttribute: 'med solide referanser',
    categoryLabel: 'entreprenører og håndverkere',
    serviceKeywords: ['entreprenør', 'byggmester', 'totalrenovering', 'tømrer'],
    schemaTypesLabel: 'GeneralContractor, HomeAndConstructionBusiness, FAQPage',
    citedSources: ['mittanbud.no', 'proff.no', 'gulesider.no'],
  },
  {
    prefixes: ['68.31'],
    keywordsInName: ['eiendomsmegler', 'megler'],
    primaryService: 'eiendomsmegler',
    pluralService: 'eiendomsmeglere',
    questionAttribute: 'med sterk lokalkunnskap',
    categoryLabel: 'eiendomsmeglere',
    serviceKeywords: ['eiendomsmegler', 'boligsalg', 'verdivurdering bolig', 'megler'],
    schemaTypesLabel: 'RealEstateAgent, LocalBusiness, FAQPage',
    citedSources: ['eiendomsmegler.no', 'finn.no', 'gulesider.no'],
  },
  {
    prefixes: ['73.11', '73.12', '73.30', '70.21'],
    keywordsInName: ['reklamebyrå', 'mediebyrå', 'markedsføring', 'seo', 'digitalbyrå', 'floww'],
    primaryService: 'digitalbyrå',
    pluralService: 'digitalbyråer',
    isNeuter: true,
    isWholeCityB2B: true,
    questionAttribute: 'med dokumenterte resultater',
    categoryLabel: 'markedsførings- og digitalbyråer',
    serviceKeywords: ['seo byrå', 'lokal seo', 'skreddersydde nettsider', 'digitalbyrå'],
    schemaTypesLabel: 'ProfessionalService, LocalBusiness, FAQPage',
    citedSources: ['proff.no', 'gulesider.no', '1881.no'],
  },
  {
    prefixes: ['62.01', '62.02', '62.09', '62.10', '62.20', '62.90', '63.1', '74.1'],
    keywordsInName: ['webbyrå', 'programvare', 'it-konsulent', 'designbyrå'],
    primaryService: 'webbyrå',
    pluralService: 'webbyråer',
    isNeuter: true,
    isWholeCityB2B: true,
    questionAttribute: 'med dokumenterte resultater',
    categoryLabel: 'teknologi- og webbyråer',
    serviceKeywords: ['utvikling av nettsider', 'skreddersydde nettsider', 'webbyrå', 'digitalbyrå'],
    schemaTypesLabel: 'ProfessionalService, SoftwareApplication, FAQPage',
    citedSources: ['proff.no', 'gulesider.no', '1881.no'],
  },
];

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

/**
 * Resolves natural Norwegian search keywords, schema types, citation sources,
 * and geographic search labels dynamically from the business's Brønnøysund NACE code,
 * postcode, city, and name.
 * Never falls back to "tannlege" unless the business actually is a dental clinic.
 */
export function resolveIndustryTerms(business: {
  name?: string | null;
  domain?: string | null;
  nace?: string | null;
  naceName?: string | null;
  city?: string | null;
  postcode?: string | null;
  profileType?: string | null;
}): ResolvedIndustryTerms {
  const nace = (business.nace || '').trim();
  const naceName = (business.naceName || '').trim();
  const nameAndDomain = `${business.name || ''} ${business.domain || ''} ${naceName}`.toLowerCase();
  const cityFormatted = formatNorwegianCity(business.city);
  const isB2bProfile =
    business.profileType === 'b2b' ||
    business.profileType === 'nasjonal' ||
    business.profileType === 'nettbutikk';

  // 1. Match by NACE prefix first
  if (nace) {
    const byNace = INDUSTRY_PRESETS.find((p) =>
      p.prefixes.some((prefix) => nace.startsWith(prefix))
    );
    if (byNace) {
      const loc = resolveLocationLabels(
        cityFormatted,
        business.postcode,
        Boolean(byNace.isWholeCityB2B || isB2bProfile)
      );
      return {
        primaryService: byNace.primaryService,
        pluralService: byNace.pluralService,
        isNeuter: Boolean(byNace.isNeuter || isNeuterNorwegianNoun(byNace.primaryService)),
        categoryLabel: byNace.categoryLabel,
        serviceKeywords: byNace.serviceKeywords,
        schemaTypesLabel: byNace.schemaTypesLabel,
        citedSources: byNace.citedSources || ['proff.no', 'gulesider.no', '1881.no'],
        questionAttribute: byNace.questionAttribute || 'med gode referanser',
        cityFormatted,
        areaLabel: loc.areaLabel,
        placeLabel: loc.placeLabel,
      };
    }
  }

  // 2. Match by company name / domain / NACE description keywords
  const byKeyword = INDUSTRY_PRESETS.find((p) =>
    (p.keywordsInName || []).some((kw) => nameAndDomain.includes(kw))
  );
  if (byKeyword) {
    const loc = resolveLocationLabels(
      cityFormatted,
      business.postcode,
      Boolean(byKeyword.isWholeCityB2B || isB2bProfile)
    );
    return {
      primaryService: byKeyword.primaryService,
      pluralService: byKeyword.pluralService,
      isNeuter: Boolean(byKeyword.isNeuter || isNeuterNorwegianNoun(byKeyword.primaryService)),
      categoryLabel: byKeyword.categoryLabel,
      serviceKeywords: byKeyword.serviceKeywords,
      schemaTypesLabel: byKeyword.schemaTypesLabel,
      citedSources: byKeyword.citedSources || ['proff.no', 'gulesider.no', '1881.no'],
      questionAttribute: byKeyword.questionAttribute || 'med gode referanser',
      cityFormatted,
      areaLabel: loc.areaLabel,
      placeLabel: loc.placeLabel,
    };
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
