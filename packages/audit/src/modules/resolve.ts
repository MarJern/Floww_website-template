import fs from 'fs';
import path from 'path';
import dns from 'dns';
import {
  AuditModule,
  AuditContext,
  ModuleResult,
  Finding,
  BusinessData,
  ProfileType,
} from '../types';
import { formatNorwegianCity } from '../utils/industry';

/**
 * Normalizes an input URL or domain string to a clean domain.
 * e.g. "https://www.flowwmedia.no/tjenester" -> "flowwmedia.no"
 */
export function normalizeDomain(input: string): string {
  let cleaned = input.trim().toLowerCase();
  cleaned = cleaned.replace(/^https?:\/\//i, '');
  cleaned = cleaned.replace(/^www\./i, '');
  cleaned = cleaned.split('/')[0];
  cleaned = cleaned.split('?')[0];
  cleaned = cleaned.split('#')[0];
  return cleaned;
}

export interface PreflightCheckResult {
  alive: boolean;
  reason?: 'DNS_NOT_FOUND' | 'INVALID_HOST' | 'HTTP_UNREACHABLE' | 'DOMAIN_PARKED';
  message?: string;
  httpStatus?: number;
  finalUrl?: string;
  extractedOrgnr?: string;
  pageTitle?: string;
}

export interface NaceBlacklistCheckResult {
  blocked: boolean;
  nace?: string;
  naceName?: string;
  message?: string;
}

const BLACKLISTED_AGENCY_NACE_PREFIXES = [
  '73.11', // Reklamebyråer (SN2007 & SN2025)
  '73.12', // Medieformidling (SN2007 & SN2025)
  '73.20', // Markeds- og opinionsundersøkelser (SN2007 & SN2025)
  '73.30', // PR og kommunikasjon (SN2025)
  '70.21', // PR og kommunikasjonstjenester (SN2007)
  '62.01', // Programmeringstjenester (SN2007)
  '62.02', // Konsulentvirksomhet tilknyttet IT (SN2007)
  '62.09', // Annen IT-tjenesteyting (SN2007)
  '62.10', // Dataprogrammeringstjenester (SN2025)
  '62.20', // Konsulentvirksomhet tilknyttet IT og drift (SN2025)
  '62.90', // Annen IT-tjenesteyting (SN2025)
  '63.10', // Databehandling, datalagring og tilknyttede tjenester (SN2025)
  '63.11', // Databehandling og datalagring (SN2007)
  '63.12', // Drift av webportaler (SN2007)
  '63.91', // Drift av nettportaler (SN2025)
  '74.102', // Grafisk og visuell kommunikasjon / webdesign (SN2007)
  '74.12', // Grafisk design og visuell kommunikasjon (SN2025)
];

const CLINIC_HEALTH_NACE_PREFIXES = [
  '86.', // Helsetjenester (lege, tannlege, psykolog, fysioterapi, spesialister)
  '87.', // Pleie- og omsorgstjenester
  '88.', // Sosialtjenester
  '96.02', // Frisør og skjønnhetspleie
  '96.04', // Virksomhet knyttet til fysisk velvære
  '47.73', // Apotekvarer
  '47.74', // Medisinske og ortopediske artikler / optikk
  '75.00', // Veterinærtjenester
];

export const DEAD_DOMAIN_USER_MESSAGE =
  'Vi får ikke kontakt med nettsiden. Vennligst sjekk at domenet er stavet riktig.';

export const NACE_BLACKLIST_USER_MESSAGE =
  'Hei bransjekollega! Vår plattform er optimalisert for norske virksomheter utenfor byråbransjen. Ta gjerne kontakt med oss på kontakt@flowwmedia.no for en prat om partnerskap.';

function isPrivateOrLoopbackIp(ip: string): boolean {
  const clean = ip.trim().toLowerCase();
  if (
    clean === '::1' ||
    clean === '0.0.0.0' ||
    clean.startsWith('fe80:') ||
    clean.startsWith('fc00:') ||
    clean.startsWith('fd00:')
  ) {
    return true;
  }
  const ipv4Match = clean.replace(/^::ffff:/, '').match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!ipv4Match) return false;
  const [, a, b] = ipv4Match.map(Number);
  if (a === 10 || a === 127 || a === 0) return true;
  if (a === 169 && b === 254) return true;
  if (a === 192 && b === 168) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 100 && b >= 64 && b <= 127) return true;
  return false;
}

/**
 * Extracts a 9-digit Norwegian org.nr from HTML text (typically in footer).
 */
function extractNorwegianOrgnrFromHtml(html: string): string | undefined {
  const contextualRegex =
    /(?:org\.?\s*nr\.?|organisasjonsnummer|foretaksregisteret|mva)[^0-9]{0,30}([89]\d{2}[\s.]?\d{3}[\s.]?\d{3})\b/gi;
  let match: RegExpExecArray | null;
  while ((match = contextualRegex.exec(html)) !== null) {
    const digits = match[1].replace(/\D/g, '');
    if (/^[89]\d{8}$/.test(digits)) {
      return digits;
    }
  }
  return undefined;
}

/**
 * Zero-Cost Pre-Flight Check:
 * 1. Fast DNS resolution (catches NXDOMAIN / typos in ~20ms at 0 cost, 100% immune to Cloudflare WAF).
 * 2. SSRF private IP check on resolved records.
 * 3. Fast 3-second HTTP GET ping across https / www / http (where ANY HTTP status 100-599 including
 *    403 Cloudflare challenge proves a web server is alive), plus free org.nr extraction from HTML.
 */
export async function preflightCheckDomain(rawDomain: string): Promise<PreflightCheckResult> {
  const domain = normalizeDomain(rawDomain);
  if (!domain || !domain.includes('.')) {
    return {
      alive: false,
      reason: 'DNS_NOT_FOUND',
      message: DEAD_DOMAIN_USER_MESSAGE,
    };
  }

  // Step 1A: DNS resolution (try root domain, then www.domain)
  let resolvedAddresses: dns.LookupAddress[] = [];
  const candidatesToLookup = [domain, `www.${domain}`];

  for (const host of candidatesToLookup) {
    try {
      const addresses = await Promise.race([
        dns.promises.lookup(host, { all: true }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('DNS_TIMEOUT')), 2500)
        ),
      ]);
      if (Array.isArray(addresses) && addresses.length > 0) {
        resolvedAddresses = addresses;
        break;
      }
    } catch {
      // Try next candidate
    }
  }

  if (resolvedAddresses.length === 0) {
    return {
      alive: false,
      reason: 'DNS_NOT_FOUND',
      message: DEAD_DOMAIN_USER_MESSAGE,
    };
  }

  for (const addr of resolvedAddresses) {
    if (isPrivateOrLoopbackIp(addr.address)) {
      return {
        alive: false,
        reason: 'INVALID_HOST',
        message: DEAD_DOMAIN_USER_MESSAGE,
      };
    }
  }

  // Step 1B: 3-second HTTP GET ping (Cloudflare-tolerant)
  const urlsToTry = [
    `https://${domain}`,
    `https://www.${domain}`,
    `http://${domain}`,
  ];

  for (const url of urlsToTry) {
    try {
      const res = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        signal: AbortSignal.timeout(3000),
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'nb-NO,nb;q=0.9,no;q=0.8,en;q=0.7',
        },
      });

      // Any HTTP status code (even 401/403 Cloudflare challenge/405/503) proves the web server is alive
      let extractedOrgnr: string | undefined;
      let pageTitle: string | undefined;

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('text/html')) {
        try {
          const text = (await res.text()).slice(0, 150_000);
          const lower = text.toLowerCase();

          // Detect parked domain pages that have no real website
          const isParked =
            (lower.includes('domenet er parkert') && text.length < 15000) ||
            lower.includes('sedoparking.com') ||
            (lower.includes('this domain is parked') && text.length < 15000);

          if (isParked) {
            return {
              alive: false,
              reason: 'DOMAIN_PARKED',
              message: DEAD_DOMAIN_USER_MESSAGE,
            };
          }

          extractedOrgnr = extractNorwegianOrgnrFromHtml(text);
          const titleMatch = text.match(/<title[^>]*>([^<]{1,120})<\/title>/i);
          if (titleMatch?.[1]) {
            pageTitle = titleMatch[1].trim();
          }
        } catch {
          // Ignore body read errors if headers already succeeded
        }
      }

      return {
        alive: true,
        httpStatus: res.status,
        finalUrl: res.url || url,
        extractedOrgnr,
        pageTitle,
      };
    } catch {
      // Try next URL variant
    }
  }

  return {
    alive: false,
    reason: 'HTTP_UNREACHABLE',
    message: DEAD_DOMAIN_USER_MESSAGE,
  };
}

/**
 * Checks if a NACE code belongs to a competing marketing/PR/IT agency,
 * with an exception if any Brreg sub-unit (underenhet) is a healthcare/clinic entity.
 */
export function checkNaceBlacklist(
  nace?: string | null,
  naceName?: string | null,
  subUnitNaces: string[] = []
): NaceBlacklistCheckResult {
  if (!nace) {
    return { blocked: false };
  }

  const normalizedNace = nace.trim();
  const isBlacklisted = BLACKLISTED_AGENCY_NACE_PREFIXES.some((prefix) =>
    normalizedNace.startsWith(prefix)
  );

  if (!isBlacklisted) {
    return { blocked: false, nace: normalizedNace, naceName: naceName ?? undefined };
  }

  // Exception: If any sub-unit in Brreg has a clinic/healthcare NACE code, allow it
  const hasClinicSubUnit = subUnitNaces.some((subNace) =>
    CLINIC_HEALTH_NACE_PREFIXES.some((clinicPrefix) => subNace.trim().startsWith(clinicPrefix))
  );

  if (hasClinicSubUnit) {
    return { blocked: false, nace: normalizedNace, naceName: naceName ?? undefined };
  }

  return {
    blocked: true,
    nace: normalizedNace,
    naceName: naceName ?? undefined,
    message: NACE_BLACKLIST_USER_MESSAGE,
  };
}

export interface BrregEnhet {
  organisasjonsnummer: string;
  navn: string;
  organisasjonsform?: {
    kode: string;
    beskrivelse: string;
  };
  naeringskode1?: {
    kode: string;
    beskrivelse: string;
  };
  forretningsadresse?: {
    adresse?: string[];
    postnummer?: string;
    poststed?: string;
    kommune?: string;
  };
  beliggenhetsadresse?: {
    adresse?: string[];
    postnummer?: string;
    poststed?: string;
    kommune?: string;
  };
  hjemmeside?: string;
  antallAnsatte?: number;
  slettedato?: string;
}

export interface GooglePlaceCandidate {
  id: string;
  displayName?: { text: string; languageCode?: string };
  formattedAddress?: string;
  location?: { latitude: number; longitude: number };
  primaryType?: string;
  types?: string[];
  websiteUri?: string;
  businessStatus?: 'OPERATIONAL' | 'CLOSED_TEMPORARILY' | 'CLOSED_PERMANENTLY';
  rating?: number;
  userRatingCount?: number;
}

interface PlacesNewResponse {
  places?: GooglePlaceCandidate[];
}

/**
 * Generates search name variations from domain.
 * e.g. "flowwmedia.no" -> ["flowwmedia", "floww media", "floww"]
 */
function getDomainNameVariations(domain: string): string[] {
  const base = domain.replace(/\.(no|com|org|as|net|io|ai)$/i, '').replace(/[-_]/g, ' ');
  const variations: string[] = [base];

  // If compound word like "flowwmedia", attempt splitting common suffix words
  const commonSuffixes = ['media', 'byra', 'tannlege', 'klinikk', 'advokat', 'bygg', 'service', 'gruppen', 'group'];
  for (const suffix of commonSuffixes) {
    if (base.endsWith(suffix) && base.length > suffix.length) {
      const prefix = base.slice(0, -suffix.length).trim();
      variations.push(`${prefix} ${suffix}`);
      variations.push(prefix);
      break;
    }
  }

  return [...new Set(variations.filter((v) => v.length >= 3))];
}

/**
 * Fetch legal company details from Brønnøysundregistrene (Brreg)
 */
export async function fetchBrregEntity(
  domain: string,
  hintOrgnr: string | undefined,
  hintName: string | undefined,
  log: (msg: string, meta?: unknown) => void
): Promise<{ enhet: BrregEnhet | null; subUnitCount: number; subUnitNaces: string[] }> {
  // 1. If exact orgnr is provided, lookup directly
  if (hintOrgnr && /^\d{9}$/.test(hintOrgnr)) {
    try {
      log(`Brreg direct orgnr lookup: ${hintOrgnr}`);
      const res = await fetch(`https://data.brreg.no/enhetsregisteret/api/enheter/${hintOrgnr}`, {
        signal: AbortSignal.timeout(8000),
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        const enhet = (await res.json()) as BrregEnhet;
        const subInfo = await fetchSubUnitsInfo(enhet.organisasjonsnummer, log);
        return { enhet, subUnitCount: subInfo.count, subUnitNaces: subInfo.subUnitNaces };
      }
    } catch (e) {
      log('Brreg direct orgnr lookup failed:', e);
    }
  }

  // 2. Lookup by registered website (exact & www)
  try {
    const urls = [
      `https://data.brreg.no/enhetsregisteret/api/enheter?hjemmeside=${encodeURIComponent(domain)}`,
      `https://data.brreg.no/enhetsregisteret/api/enheter?hjemmeside=${encodeURIComponent('www.' + domain)}`,
    ];

    for (const url of urls) {
      log(`Brreg lookup: ${url}`);
      const res = await fetch(url, {
        signal: AbortSignal.timeout(8000),
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        const data = (await res.json()) as any;
        const candidates: BrregEnhet[] = (data?._embedded?.enheter || []).filter(
          (e: BrregEnhet) => !e.slettedato
        );
        if (candidates.length > 0) {
          const enhet = candidates[0];
          log(`Brreg found via website: ${enhet.navn} (${enhet.organisasjonsnummer})`);
          const subInfo = await fetchSubUnitsInfo(enhet.organisasjonsnummer, log);
          return { enhet, subUnitCount: subInfo.count, subUnitNaces: subInfo.subUnitNaces };
        }
      }
    }
  } catch (err) {
    log('Brreg website lookup error:', err);
  }

  // 3. Fallback name tokens from domain or hintName
  const searchTerms = [
    ...(hintName ? [hintName] : []),
    ...getDomainNameVariations(domain),
  ];

  for (const term of searchTerms) {
    try {
      log(`Brreg fallback search by term: "${term}"`);
      const nameUrl = `https://data.brreg.no/enhetsregisteret/api/enheter?navn=${encodeURIComponent(term)}&size=40`;
      const res = await fetch(nameUrl, {
        signal: AbortSignal.timeout(8000),
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        const data = (await res.json()) as any;
        const rawCandidates: BrregEnhet[] = (data?._embedded?.enheter || []).filter(
          (e: BrregEnhet) => !e.slettedato
        );

        const cleanTerm = term.trim().toLowerCase();
        const escapedTerm = cleanTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const wordBoundaryRegex = new RegExp(`(^|[\\s.-])${escapedTerm}($|[\\s.-])`, 'i');

        // Filter out false mid-word substring matches (e.g. "try" inside "CHEMISTRY")
        const candidates = rawCandidates
          .filter((e) => {
            if (cleanTerm.length <= 5) {
              return wordBoundaryRegex.test(e.navn || '');
            }
            return true;
          })
          .sort((a, b) => {
            const rank = (e: BrregEnhet): number => {
              const n = (e.navn || '').trim().toLowerCase();
              const site = (e.hjemmeside || '').toLowerCase();
              if (site.includes(domain)) return 100;
              if (n === cleanTerm || n === `${cleanTerm} as`) return 90;
              if (n.startsWith(`${cleanTerm} `)) return 80;
              if (wordBoundaryRegex.test(n)) return 60;
              return 10;
            };
            return rank(b) - rank(a);
          });

        if (candidates.length > 0) {
          const enhet = candidates[0];
          log(`Brreg found via name term: ${enhet.navn} (${enhet.organisasjonsnummer})`);
          const subInfo = await fetchSubUnitsInfo(enhet.organisasjonsnummer, log);
          return { enhet, subUnitCount: subInfo.count, subUnitNaces: subInfo.subUnitNaces };
        }
      }
    } catch (e) {
      log(`Brreg name search failed for "${term}":`, e);
    }
  }

  log(`No Brreg entity found for domain: ${domain}`);
  return { enhet: null, subUnitCount: 0, subUnitNaces: [] };
}

async function fetchSubUnitsInfo(
  orgnr: string,
  log: (msg: string, meta?: unknown) => void
): Promise<{ count: number; subUnitNaces: string[] }> {
  try {
    const subUrl = `https://data.brreg.no/enhetsregisteret/api/underenheter?overordnetEnhet=${orgnr}`;
    const subRes = await fetch(subUrl, {
      signal: AbortSignal.timeout(8000),
      headers: { Accept: 'application/json' },
    });
    if (subRes.ok) {
      const subData = (await subRes.json()) as any;
      const count = subData?.page?.totalElements ?? 1;
      const underenheter: any[] = subData?._embedded?.underenheter || [];
      const subUnitNaces = underenheter
        .map((u) => u?.naeringskode1?.kode)
        .filter((k): k is string => Boolean(k));
      log(`Brreg sub-unit count for orgnr ${orgnr}: ${count}`);
      return { count, subUnitNaces };
    }
  } catch (err) {
    log('Could not fetch sub-units from Brreg:', err);
  }
  return { count: 1, subUnitNaces: [] };
}

/**
 * Fetch Google Places profile via Places API (New Text Search)
 */
async function fetchGooglePlace(
  query: string,
  domain: string,
  log: (msg: string, meta?: unknown) => void
): Promise<GooglePlaceCandidate | null> {
  const apiKey = process.env.GOOGLE_PLACES_KEY;
  if (!apiKey) {
    log('⚠️ GOOGLE_PLACES_KEY not provided. Skipping Google Places live lookup.');
    return null;
  }

  const endpoint = 'https://places.googleapis.com/v1/places:searchText';
  const fieldMask = [
    'places.id',
    'places.displayName',
    'places.formattedAddress',
    'places.location',
    'places.primaryType',
    'places.types',
    'places.websiteUri',
    'places.businessStatus',
    'places.rating',
    'places.userRatingCount',
  ].join(',');

  try {
    log(`Google Places Text Search for: "${query}"`);
    const res = await fetch(endpoint, {
      method: 'POST',
      signal: AbortSignal.timeout(10000),
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': fieldMask,
      },
      body: JSON.stringify({
        textQuery: query,
        languageCode: 'no',
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      log(`Google Places API error (${res.status}): ${errText}`);
      return null;
    }

    const data = (await res.json()) as PlacesNewResponse;
    const candidates = data.places || [];

    if (candidates.length === 0) {
      log(`No Google Places results for query: "${query}"`);
      return null;
    }

    // Attempt to find candidate with matching domain
    const exactDomainMatch = candidates.find((c) => {
      if (!c.websiteUri) return false;
      return normalizeDomain(c.websiteUri) === domain;
    });

    const chosen = exactDomainMatch || candidates[0];
    log(`Google Places selected candidate: ${chosen.displayName?.text} (id: ${chosen.id})`);
    return chosen;
  } catch (err) {
    log('Google Places fetch failed with exception:', err);
    return null;
  }
}

/**
 * Determines profile_type from the four spec signals:
 * 1. Has Google profile with address (Places)
 * 2. Number of sub-units in Brreg (underenheter > 1)
 * 3. E-commerce vs B2B website behavior
 * 4. NACE classification
 */
export function determineProfileType(
  hasGoogleProfile: boolean,
  subUnitCount: number,
  nace?: string
): ProfileType {
  // 1. Multiple branches in Brreg
  if (subUnitCount > 1) {
    return 'flere_avdelinger';
  }

  // 2. E-commerce / retail NACE codes (47.91)
  if (nace && nace.startsWith('47.91')) {
    return 'nettbutikk';
  }

  // 3. Typical B2B / consulting NACE codes without local physical customer presence
  // 62 (IT), 70 (Management Consulting), 46 (Wholesale)
  if (nace && (nace.startsWith('62.') || nace.startsWith('70.') || nace.startsWith('46.'))) {
    if (!hasGoogleProfile) {
      return 'b2b';
    }
  }

  // 4. Default for physical businesses with Google Profile
  if (hasGoogleProfile) {
    return 'lokal';
  }

  // Fallback if no Google Profile and not e-commerce
  return 'b2b';
}

export interface PreFlightResolveOptions {
  useFixtures?: boolean;
  fixturesDir?: string;
  skipBlacklist?: boolean;
  hintOrgnr?: string;
  hintName?: string;
}

export interface PreFlightResolveResult {
  ok: boolean;
  errorCode?: 'DEAD_DOMAIN' | 'NACE_BLACKLISTED';
  httpStatus?: number;
  message?: string;
  domain: string;
  companyName: string;
  orgnr?: string;
  orgForm?: string;
  nace?: string;
  naceName?: string;
  address?: string;
  postcode?: string;
  city?: string;
  subUnitCount: number;
  subUnitNaces: string[];
  brregEnhet: BrregEnhet | null;
}

/**
 * Phase 1 Zero-Cost Pre-Flight + Brreg Entity Resolution + NACE Blacklist Check.
 * Runs synchronously in ~1.5s before the 2-Step Lead Gate without calling paid Google Places API.
 */
export async function runPreFlightAndBrregResolve(
  rawDomain: string,
  options?: PreFlightResolveOptions
): Promise<PreFlightResolveResult> {
  const domain = normalizeDomain(rawDomain);
  const log = (msg: string) => console.log(`   [PreResolve] ${msg}`);

  let brregEnhet: BrregEnhet | null = null;
  let subUnitCount = 1;
  let subUnitNaces: string[] = [];
  let extractedOrgnr: string | undefined = options?.hintOrgnr;
  let pageTitle: string | undefined;

  // Check if fixture exists when useFixtures is enabled
  let loadedFromFixture = false;
  if (options?.useFixtures) {
    const fixturePath = path.resolve(
      options.fixturesDir || path.resolve(__dirname, '../../fixtures'),
      `resolve_${domain.replace(/[^a-z0-9]/gi, '_')}.json`
    );
    if (fs.existsSync(fixturePath)) {
      const fixtureRaw = JSON.parse(fs.readFileSync(fixturePath, 'utf-8'));
      brregEnhet = fixtureRaw.brregEnhet ?? null;
      subUnitCount = fixtureRaw.subUnitCount ?? 1;
      loadedFromFixture = true;
    }
  }

  // 1. Run Zero-Cost Pre-Flight (DNS + 3s HTTP GET + free orgnr scrape)
  if (!loadedFromFixture) {
    const preflight = await preflightCheckDomain(domain);
    if (!preflight.alive) {
      return {
        ok: false,
        errorCode: 'DEAD_DOMAIN',
        httpStatus: 400,
        message: preflight.message || DEAD_DOMAIN_USER_MESSAGE,
        domain,
        companyName: domain,
        subUnitCount: 0,
        subUnitNaces: [],
        brregEnhet: null,
      };
    }
    if (!extractedOrgnr && preflight.extractedOrgnr) {
      extractedOrgnr = preflight.extractedOrgnr;
    }
    pageTitle = preflight.pageTitle;
  }

  // 2. Query Brreg (100% free API)
  if (!brregEnhet) {
    const brregResult = await fetchBrregEntity(
      domain,
      extractedOrgnr,
      options?.hintName,
      log
    );
    brregEnhet = brregResult.enhet;
    subUnitCount = brregResult.subUnitCount;
    subUnitNaces = brregResult.subUnitNaces;
  }

  const nace = brregEnhet?.naeringskode1?.kode;
  const naceName = brregEnhet?.naeringskode1?.beskrivelse;

  // 3. Polite NACE Blacklist check (unless admin bypass)
  if (!options?.skipBlacklist && nace) {
    const blacklistCheck = checkNaceBlacklist(nace, naceName, subUnitNaces);
    if (blacklistCheck.blocked) {
      return {
        ok: false,
        errorCode: 'NACE_BLACKLISTED',
        httpStatus: 403,
        message: blacklistCheck.message || NACE_BLACKLIST_USER_MESSAGE,
        domain,
        companyName: brregEnhet?.navn || domain,
        orgnr: brregEnhet?.organisasjonsnummer,
        nace,
        naceName,
        subUnitCount,
        subUnitNaces,
        brregEnhet,
      };
    }
  }

  const cleanPageTitle = pageTitle
    ? pageTitle.split(/[|\-–—]/)[0]?.trim()
    : undefined;

  const companyName =
    brregEnhet?.navn ||
    options?.hintName ||
    (cleanPageTitle && cleanPageTitle.length >= 2 && cleanPageTitle.length <= 65
      ? cleanPageTitle
      : domain);

  const address =
    brregEnhet?.forretningsadresse?.adresse?.[0] ||
    brregEnhet?.beliggenhetsadresse?.adresse?.[0];
  const postcode =
    brregEnhet?.forretningsadresse?.postnummer ||
    brregEnhet?.beliggenhetsadresse?.postnummer;
  const rawCity =
    brregEnhet?.forretningsadresse?.poststed ||
    brregEnhet?.beliggenhetsadresse?.poststed;
  const city = rawCity ? formatNorwegianCity(rawCity) : undefined;
  const orgForm = brregEnhet?.organisasjonsform?.kode;

  return {
    ok: true,
    domain,
    companyName,
    orgnr: brregEnhet?.organisasjonsnummer || extractedOrgnr,
    orgForm,
    nace,
    naceName,
    address,
    postcode,
    city,
    subUnitCount,
    subUnitNaces,
    brregEnhet,
  };
}

export const resolveModule: AuditModule = {
  name: 'resolve',
  wave: 1,
  dependsOn: [],
  factors: ['L004', 'L007', 'N001', 'N005', 'N012'],

  async run(ctx: AuditContext): Promise<ModuleResult> {
    const domain = normalizeDomain(ctx.domain);
    ctx.log(`🔍 [Resolve] Starting entity resolution for domain: ${domain}`);

    let brregEnhet: BrregEnhet | null = null;
    let subUnitCount = 1;
    let subUnitNaces: string[] = [];
    let placeCandidate: GooglePlaceCandidate | null = null;

    // Support fixtures for offline testing
    if (ctx.useFixtures) {
      const fixturePath = path.resolve(
        ctx.fixturesDir || path.resolve(__dirname, '../../fixtures'),
        `resolve_${domain.replace(/[^a-z0-9]/gi, '_')}.json`
      );
      if (fs.existsSync(fixturePath)) {
        ctx.log(`📁 [Resolve] Loading fixture data from ${fixturePath}`);
        const fixtureRaw = JSON.parse(fs.readFileSync(fixturePath, 'utf-8'));
        brregEnhet = fixtureRaw.brregEnhet;
        subUnitCount = fixtureRaw.subUnitCount ?? 1;
        placeCandidate = fixtureRaw.placeCandidate;
      }
    }

    // 0. Reuse pre-resolved Brreg entity from rawStore if Phase 1 already fetched it
    const existingResolveRaw = ctx.raw<{
      brregEnhet?: BrregEnhet | null;
      subUnitCount?: number;
      subUnitNaces?: string[];
      placeCandidate?: GooglePlaceCandidate | null;
    }>('resolve');

    if (!brregEnhet && existingResolveRaw?.brregEnhet) {
      brregEnhet = existingResolveRaw.brregEnhet;
      subUnitCount = existingResolveRaw.subUnitCount ?? 1;
      subUnitNaces = existingResolveRaw.subUnitNaces ?? [];
    }

    // 1. Query Brreg if not loaded from fixture or Phase 1
    if (!brregEnhet) {
      let hintOrgnr = ctx.business.orgnr;
      let brregResult = await fetchBrregEntity(
        domain,
        hintOrgnr,
        ctx.business.name,
        ctx.log
      );

      // If not found yet (e.g. synthetic orgnr from bulk campaign), scrape real orgnr from website HTML footer
      if (!brregResult.enhet) {
        try {
          const preflight = await preflightCheckDomain(domain);
          if (preflight.extractedOrgnr && preflight.extractedOrgnr !== hintOrgnr) {
            hintOrgnr = preflight.extractedOrgnr;
            brregResult = await fetchBrregEntity(
              domain,
              hintOrgnr,
              preflight.pageTitle || ctx.business.name,
              ctx.log
            );
          }
        } catch {
          // Non-fatal fallback
        }
      }

      brregEnhet = brregResult.enhet;
      subUnitCount = brregResult.subUnitCount;
      subUnitNaces = brregResult.subUnitNaces;
    }

    // Check NACE Blacklist BEFORE firing paid Google Places API (for self_serve scans)
    if (ctx.business.source !== 'bulk' && brregEnhet?.naeringskode1?.kode) {
      const primaryNaceCheck = checkNaceBlacklist(
        brregEnhet.naeringskode1.kode,
        brregEnhet.naeringskode1.beskrivelse,
        subUnitNaces
      );
      if (primaryNaceCheck.blocked) {
        throw new Error(`NACE_BLACKLISTED: ${primaryNaceCheck.message}`);
      }
    }

    // 2. Query Google Places API (New) if not loaded from fixture
    if (!placeCandidate) {
      const queryName = brregEnhet?.navn || ctx.business.name || domain.split('.')[0];
      const cityHint =
        brregEnhet?.forretningsadresse?.poststed ||
        brregEnhet?.beliggenhetsadresse?.poststed ||
        ctx.business.city ||
        '';
      const searchQuery = `${queryName} ${cityHint}`.trim();
      placeCandidate = await fetchGooglePlace(searchQuery, domain, ctx.log);

      // If Google Places found a business name but Brreg didn't find anything earlier,
      // retry Brreg lookup using the Google Place's exact displayName!
      if (!brregEnhet && placeCandidate?.displayName?.text) {
        ctx.log(`Brreg secondary lookup using Google Places name: "${placeCandidate.displayName.text}"`);
        const secondary = await fetchBrregEntity(
          domain,
          undefined,
          placeCandidate.displayName.text,
          ctx.log
        );
        if (secondary.enhet) {
          brregEnhet = secondary.enhet;
          subUnitCount = secondary.subUnitCount;
          subUnitNaces = secondary.subUnitNaces;

          if (ctx.business.source !== 'bulk' && brregEnhet.naeringskode1?.kode) {
            const secondaryNaceCheck = checkNaceBlacklist(
              brregEnhet.naeringskode1.kode,
              brregEnhet.naeringskode1.beskrivelse,
              subUnitNaces
            );
            if (secondaryNaceCheck.blocked) {
              throw new Error(`NACE_BLACKLISTED: ${secondaryNaceCheck.message}`);
            }
          }
        }
      }
    }

    const companyName = brregEnhet?.navn || placeCandidate?.displayName?.text || ctx.business.name || domain;
    const address =
      brregEnhet?.forretningsadresse?.adresse?.[0] ||
      brregEnhet?.beliggenhetsadresse?.adresse?.[0] ||
      placeCandidate?.formattedAddress ||
      ctx.business.address;
    const postcode =
      brregEnhet?.forretningsadresse?.postnummer ||
      brregEnhet?.beliggenhetsadresse?.postnummer ||
      ctx.business.postcode;
    const rawCity =
      brregEnhet?.forretningsadresse?.poststed ||
      brregEnhet?.beliggenhetsadresse?.poststed ||
      ctx.business.city;
    const city = rawCity ? formatNorwegianCity(rawCity) : undefined;
    const nace = brregEnhet?.naeringskode1?.kode || ctx.business.nace;
    const naceName = brregEnhet?.naeringskode1?.beskrivelse || ctx.business.naceName;
    const orgForm = brregEnhet?.organisasjonsform?.kode || ctx.business.orgForm;

    const hasGoogleProfile = Boolean(placeCandidate?.id);
    const profileType = determineProfileType(hasGoogleProfile, subUnitCount, nace);

    // 3. Build businessUpdates
    const businessUpdates: Partial<BusinessData> = {
      domain,
      name: companyName,
      orgnr: brregEnhet?.organisasjonsnummer || ctx.business.orgnr || '999999999',
      orgForm,
      nace,
      naceName,
      address,
      postcode,
      city,
      lat: placeCandidate?.location?.latitude ?? ctx.business.lat,
      lng: placeCandidate?.location?.longitude ?? ctx.business.lng,
      placesId: placeCandidate?.id ?? ctx.business.placesId,
      profileType,
      source: ctx.business.source || 'self_serve',
    };

    // 4. Generate initial findings for wave 1
    const findings: Finding[] = [];
    const timestamp = new Date().toISOString();

    if (placeCandidate) {
      // N001: Business Marked as Permanently Closed
      const isPermanentlyClosed = placeCandidate.businessStatus === 'CLOSED_PERMANENTLY';
      findings.push({
        factorCode: 'N001',
        status: isPermanentlyClosed ? 'crit' : 'ok',
        value: { businessStatus: placeCandidate.businessStatus },
        evidence: {
          measuredNumber: isPermanentlyClosed ? 1 : 0,
          sourceLabel: 'Google Bedriftsprofil-analyse',
          snippet: `Status for Google Bedriftsprofil: ${placeCandidate.businessStatus === 'OPERATIONAL' ? 'Aktiv og operativ' : placeCandidate.businessStatus || 'Aktiv'}`,
          timestamp,
        },
      });

      // N005: Business Marked as Temporarily Closed
      const isTemporarilyClosed = placeCandidate.businessStatus === 'CLOSED_TEMPORARILY';
      findings.push({
        factorCode: 'N005',
        status: isTemporarilyClosed ? 'warn' : 'ok',
        value: { businessStatus: placeCandidate.businessStatus },
        evidence: {
          measuredNumber: isTemporarilyClosed ? 1 : 0,
          sourceLabel: 'Google Bedriftsprofil-analyse',
          snippet: `Status for Google Bedriftsprofil: ${placeCandidate.businessStatus === 'OPERATIONAL' ? 'Aktiv og operativ' : placeCandidate.businessStatus || 'Aktiv'}`,
          timestamp,
        },
      });

      // L004: Physical Address in City of Search
      const placeAddress = placeCandidate.formattedAddress || '';
      const cityMatches = Boolean(
        city && placeAddress.toLowerCase().includes(city.toLowerCase())
      );
      findings.push({
        factorCode: 'L004',
        status: cityMatches ? 'ok' : 'warn',
        value: {
          brregCity: city,
          placesAddress: placeAddress,
          cityMatches,
        },
        evidence: {
          snippet: `Registrert forretningskommune (${city || 'Ukjent'}) sammenholdt med oppført besøksadresse i kartet (${placeAddress})`,
          sourceLabel: 'Foretaks- og lokasjonsverifisering',
          timestamp,
        },
      });

      // L007 & N012: Address is showing on GBP (Not SAB)
      const hasFormattedAddress = Boolean(placeCandidate.formattedAddress);
      findings.push({
        factorCode: 'L007',
        status: hasFormattedAddress ? 'ok' : 'crit',
        value: { hasFormattedAddress, address: placeCandidate.formattedAddress },
        evidence: {
          snippet: hasFormattedAddress
            ? `Synlig besøksadresse i Google Maps: ${placeCandidate.formattedAddress}`
            : 'Fysisk besøksadresse er skjult på Google-profilen',
          sourceLabel: 'Google Bedriftsprofil-analyse',
          timestamp,
        },
      });

      findings.push({
        factorCode: 'N012',
        status: hasFormattedAddress ? 'ok' : 'crit',
        value: { addressHidden: !hasFormattedAddress },
        evidence: {
          snippet: hasFormattedAddress ? 'Besøksadresse er synlig i kartet' : 'Besøksadresse er skjult i kartet',
          sourceLabel: 'Google Bedriftsprofil-analyse',
          timestamp,
        },
      });
    }

    const rawPayload = {
      domain,
      brregEnhet,
      subUnitCount,
      subUnitNaces,
      placeCandidate,
      resolvedAt: timestamp,
    };

    // Persist raw fetch if handler is provided
    if (ctx.saveRaw) {
      await ctx.saveRaw('resolve', rawPayload);
    }

    ctx.log(
      `✅ [Resolve] Finished resolution: ${companyName}, Org: ${businessUpdates.orgnr}, Type: ${profileType}, PlacesId: ${businessUpdates.placesId || 'none'}`
    );

    return {
      raw: rawPayload,
      findings,
      businessUpdates,
      metadata: {
        hasBrreg: Boolean(brregEnhet),
        hasPlaces: Boolean(placeCandidate),
        subUnitCount,
      },
    };
  },
};
