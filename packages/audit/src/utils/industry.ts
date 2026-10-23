import { BusinessData } from '../types';

export interface ResolvedIndustryTerms {
  /** Primary short search keyword in Norwegian (e.g. "markedsføringsbyrå", "advokat", "rørlegger", "tannlege") */
  primaryService: string;
  /** Plural/category label in Norwegian (e.g. "markedsføringsbyråer", "advokater") */
  categoryLabel: string;
  /** 4 relevant search terms for keyword/anchor simulations */
  serviceKeywords: string[];
  /** Relevant Schema.org types for this industry */
  schemaTypesLabel: string;
  /** Relevant Norwegian directory/citation sources for this industry */
  citedSources: string[];
}

interface IndustryPreset {
  prefixes: string[];
  keywordsInName?: string[];
  primaryService: string;
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
    categoryLabel: 'tannklinikker',
    serviceKeywords: ['tannlege', 'tannbehandling', 'tannlegevakt', 'tannklinikk'],
    schemaTypesLabel: 'Dentist, MedicalClinic, FAQPage',
    citedSources: ['legelisten.no', 'gulesider.no', '1881.no'],
  },
  {
    prefixes: ['86.21', '86.22'],
    keywordsInName: ['legesenter', 'legeklinikk', 'medeia', 'volvat', 'aleris'],
    primaryService: 'legeklinikk',
    categoryLabel: 'legeklinikker',
    serviceKeywords: ['legeklinikk', 'privat lege', 'legesenter', 'spesialistklinikk'],
    schemaTypesLabel: 'MedicalClinic, Physician, FAQPage',
    citedSources: ['legelisten.no', 'gulesider.no', '1881.no'],
  },
  {
    prefixes: ['86.90'],
    keywordsInName: ['fysioterapi', 'kiropraktor', 'naprapat', 'osteopat', 'psykolog', 'klinikk'],
    primaryService: 'helseklinikk',
    categoryLabel: 'helseklinikker',
    serviceKeywords: ['klinikk', 'fysioterapeut', 'kiropraktor', 'behandling'],
    schemaTypesLabel: 'MedicalBusiness, LocalBusiness, FAQPage',
    citedSources: ['legelisten.no', 'gulesider.no', '1881.no'],
  },
  {
    prefixes: ['96.02', '96.04'],
    keywordsInName: ['hudklinikk', 'hudpleie', 'skjønnhet', 'estetisk', 'frisør'],
    primaryService: 'hudklinikk',
    categoryLabel: 'hud- og skjønnhetsklinikker',
    serviceKeywords: ['hudklinikk', 'hudpleie', 'kosmetisk behandling', 'laserbehandling'],
    schemaTypesLabel: 'HealthAndBeautyBusiness, LocalBusiness, FAQPage',
    citedSources: ['gulesider.no', '1881.no', 'proff.no'],
  },
  {
    prefixes: ['69.10'],
    keywordsInName: ['advokat', 'rettshjelp', 'juridisk'],
    primaryService: 'advokat',
    categoryLabel: 'advokatfirmaer',
    serviceKeywords: ['advokat', 'advokatfirma', 'juridisk bistand', 'forretningsadvokat'],
    schemaTypesLabel: 'LegalService, ProfessionalService, FAQPage',
    citedSources: ['advokatenhjelperdeg.no', 'gulesider.no', 'proff.no'],
  },
  {
    prefixes: ['69.20'],
    keywordsInName: ['regnskap', 'revisjon', 'autorisert regnskapsfører'],
    primaryService: 'regnskapsfører',
    categoryLabel: 'regnskapsbyråer',
    serviceKeywords: ['regnskapsfører', 'regnskapsbyrå', 'bokføring', 'årsoppgjør'],
    schemaTypesLabel: 'AccountingService, ProfessionalService, FAQPage',
    citedSources: ['regnskapnorge.no', 'proff.no', 'gulesider.no'],
  },
  {
    prefixes: ['43.22'],
    keywordsInName: ['rørlegger', 'vvs'],
    primaryService: 'rørlegger',
    categoryLabel: 'rørleggerbedrifter',
    serviceKeywords: ['rørlegger', 'rørleggervakt', 'vvs', 'baderomsrenovering'],
    schemaTypesLabel: 'Plumber, HomeAndConstructionBusiness, FAQPage',
    citedSources: ['mittanbud.no', 'gulesider.no', '1881.no'],
  },
  {
    prefixes: ['43.21'],
    keywordsInName: ['elektriker', 'elektro', 'elinstallasjon'],
    primaryService: 'elektriker',
    categoryLabel: 'elektrikerbedrifter',
    serviceKeywords: ['elektriker', 'elektrikervakt', 'elbillader', 'elkontroll'],
    schemaTypesLabel: 'Electrician, HomeAndConstructionBusiness, FAQPage',
    citedSources: ['mittanbud.no', 'gulesider.no', '1881.no'],
  },
  {
    prefixes: ['41.20', '43.3', '43.9'],
    keywordsInName: ['entreprenør', 'byggmester', 'tømrer', ' snekker'],
    primaryService: 'entreprenør',
    categoryLabel: 'entreprenører og håndverkere',
    serviceKeywords: ['entreprenør', 'byggmester', 'totalrenovering', 'tømrer'],
    schemaTypesLabel: 'GeneralContractor, HomeAndConstructionBusiness, FAQPage',
    citedSources: ['mittanbud.no', 'proff.no', 'gulesider.no'],
  },
  {
    prefixes: ['68.31'],
    keywordsInName: ['eiendomsmegler', 'megler'],
    primaryService: 'eiendomsmegler',
    categoryLabel: 'eiendomsmeglere',
    serviceKeywords: ['eiendomsmegler', 'boligsalg', 'verdivurdering bolig', 'megler'],
    schemaTypesLabel: 'RealEstateAgent, LocalBusiness, FAQPage',
    citedSources: ['eiendomsmegler.no', 'finn.no', 'gulesider.no'],
  },
  {
    prefixes: ['73.11', '73.12', '73.30', '70.21'],
    keywordsInName: ['reklamebyrå', 'mediebyrå', 'markedsføring', 'seo', 'digitalbyrå', 'floww'],
    primaryService: 'digitalbyrå',
    categoryLabel: 'markedsførings- og digitalbyråer',
    serviceKeywords: ['seo byrå', 'digitalbyrå', 'lokal seo', 'nettsider for bedrifter'],
    schemaTypesLabel: 'ProfessionalService, LocalBusiness, FAQPage',
    citedSources: ['proff.no', 'gulesider.no', '1881.no'],
  },
  {
    prefixes: ['62.01', '62.02', '62.09', '62.10', '62.20', '62.90', '63.1', '74.1'],
    keywordsInName: ['webbyrå', 'programvare', 'it-konsulent', 'designbyrå'],
    primaryService: 'webbyrå',
    categoryLabel: 'teknologi- og webbyråer',
    serviceKeywords: ['utvikling av nettsider', 'webbyrå', 'skreddersydde nettsider', 'digitalbyrå'],
    schemaTypesLabel: 'ProfessionalService, SoftwareApplication, FAQPage',
    citedSources: ['proff.no', 'gulesider.no', '1881.no'],
  },
];

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
 * Resolves natural Norwegian search keywords, schema types, and citation sources
 * dynamically from the business's Brønnøysund NACE code and name.
 * Never falls back to "tannlege" unless the business actually is a dental clinic.
 */
export function resolveIndustryTerms(business: {
  name?: string | null;
  domain?: string | null;
  nace?: string | null;
  naceName?: string | null;
  city?: string | null;
}): ResolvedIndustryTerms {
  const nace = (business.nace || '').trim();
  const naceName = (business.naceName || '').trim();
  const nameAndDomain = `${business.name || ''} ${business.domain || ''} ${naceName}`.toLowerCase();

  // 1. Match by NACE prefix first
  if (nace) {
    const byNace = INDUSTRY_PRESETS.find((p) =>
      p.prefixes.some((prefix) => nace.startsWith(prefix))
    );
    if (byNace) {
      return {
        primaryService: byNace.primaryService,
        categoryLabel: byNace.categoryLabel,
        serviceKeywords: byNace.serviceKeywords,
        schemaTypesLabel: byNace.schemaTypesLabel,
        citedSources: byNace.citedSources || ['proff.no', 'gulesider.no', '1881.no'],
      };
    }
  }

  // 2. Match by company name / domain / NACE description keywords
  const byKeyword = INDUSTRY_PRESETS.find((p) =>
    (p.keywordsInName || []).some((kw) => nameAndDomain.includes(kw))
  );
  if (byKeyword) {
    return {
      primaryService: byKeyword.primaryService,
      categoryLabel: byKeyword.categoryLabel,
      serviceKeywords: byKeyword.serviceKeywords,
      schemaTypesLabel: byKeyword.schemaTypesLabel,
      citedSources: byKeyword.citedSources || ['proff.no', 'gulesider.no', '1881.no'],
    };
  }

  // 3. Derive from Brreg NACE description if available
  const cleanedNace = cleanBrregNaceDescription(naceName);
  if (cleanedNace) {
    return {
      primaryService: cleanedNace,
      categoryLabel: `${cleanedNace}-bedrifter`,
      serviceKeywords: [
        cleanedNace,
        `beste ${cleanedNace}`,
        `${cleanedNace} pris`,
        `${cleanedNace} anbefaling`,
      ],
      schemaTypesLabel: 'ProfessionalService, LocalBusiness, FAQPage',
      citedSources: ['proff.no', 'gulesider.no', '1881.no'],
    };
  }

  // 4. Generic business fallback (never "tannlege")
  const cleanCompanyToken =
    (business.name || business.domain || 'bedrift')
      .replace(/\b(as|asa|enk|ans|da|nuf)\b/gi, '')
      .trim() || 'bedrift';

  return {
    primaryService: cleanCompanyToken.toLowerCase(),
    categoryLabel: 'lokale virksomheter',
    serviceKeywords: [
      cleanCompanyToken.toLowerCase(),
      `tjenester ${business.city || 'Oslo'}`.toLowerCase(),
      `bedrift ${business.city || 'Oslo'}`.toLowerCase(),
      `rådgivning ${business.city || 'Oslo'}`.toLowerCase(),
    ],
    schemaTypesLabel: 'ProfessionalService, LocalBusiness, FAQPage',
    citedSources: ['proff.no', 'gulesider.no', '1881.no'],
  };
}
