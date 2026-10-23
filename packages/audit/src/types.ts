// ============================================================================
// AUDIT MODULE CONTRACT & TYPES
// Synlighetsrapporten - Floww Media
// ============================================================================

export type FindingStatus = 'ok' | 'warn' | 'crit' | 'na';

export type ProfileType =
  | 'lokal'
  | 'flere_avdelinger'
  | 'nasjonal'
  | 'nettbutikk'
  | 'b2b';

export interface FindingEvidence {
  url?: string;
  measuredNumber?: number;
  screenshotPath?: string;
  snippet?: string;
  sourceLabel?: string;
  timestamp?: string;
  notes?: string;
}

export interface Finding {
  factorCode: string;
  status: FindingStatus;
  value: Record<string, unknown> | number | string | boolean | null;
  /**
   * CRITICAL PRIVACY RULE:
   * findings.evidence lagrer aldri anmeldelsestekst!
   * Kun tall, datoer, URLs, målepunkter og beregninger.
   */
  evidence: FindingEvidence;
  competitorValues?: Record<string, unknown>;
}

export interface BusinessData {
  id?: string;
  orgnr: string;
  domain: string;
  name: string;
  orgForm?: string; // AS, ENK, NUF etc.
  nace?: string; // f.eks. "86.230"
  naceName?: string;
  address?: string;
  postcode?: string;
  city?: string;
  lat?: number;
  lng?: number;
  placesId?: string;
  source: 'self_serve' | 'bulk';
  profileType: ProfileType;
  email?: string;
  phone?: string;
  generalManager?: string;
  agencySpendMonthly?: number | null;
  agencyDurationMonths?: number | null;
}

export interface AuditContext {
  jobId: string;
  domain: string;
  business: Partial<BusinessData>;
  keywords?: Array<{
    keyword: string;
    volume?: number;
    cpc?: string;
    geo?: string;
  }>;
  /**
   * Henter lagrede rådata fra en tidligere modul i samme pipeline (f.eks. raw('resolve'))
   */
  raw: <T = unknown>(moduleName: string) => T | undefined;
  /**
   * Lagrer rådata for en modul i databasen / minnet
   */
  saveRaw: (moduleName: string, payload: unknown) => Promise<void>;
  /**
   * Strukturert logging med kontekst
   */
  log: (message: string, meta?: unknown) => void;
  /**
   * Kjøring mot lagrede fixtures for å unngå API-kvotebruk under testing
   */
  useFixtures?: boolean;
  fixturesDir?: string;
}

export interface ModuleResult {
  raw?: unknown;
  findings: Finding[];
  businessUpdates?: Partial<BusinessData>;
  metadata?: Record<string, unknown>;
}

export interface AuditModule {
  name: string;
  wave: 1 | 2 | 3;
  dependsOn: string[];
  factors: string[];
  run: (ctx: AuditContext) => Promise<ModuleResult>;
}
