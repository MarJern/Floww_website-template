'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { formatNok } from './types';

type LeadStatus = 'new' | 'called' | 'meeting' | 'won' | 'lost';

interface AdminLeadItem {
  id: string;
  reportId: string;
  reportSlug: string | null;
  businessId: string;
  businessName: string;
  domain: string;
  orgnr: string;
  city: string | null;
  nace: string | null;
  naceName: string | null;
  scoreTotal: number;
  nokEstimate: number;
  contactName: string | null;
  email: string | null;
  phone: string | null;
  status: LeadStatus;
  owner: string;
  notes: string;
  calledAt: string | null;
  slaBreached: boolean;
  slaRemainingMinutes: number | null;
  createdAt: string;
  updatedAt: string;
}

interface AdminReportItem {
  id: string;
  slug: string;
  jobId: string;
  businessId: string | null;
  businessName: string;
  domain: string;
  orgnr: string;
  nace: string | null;
  naceName: string | null;
  city: string | null;
  profileType: string;
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
  isUnlocked: boolean;
  unlockedAt: string | null;
  pdfPath: string | null;
  createdAt: string;
  expiresAt: string;
}

interface OutreachItem {
  id: string;
  businessId: string;
  businessName: string;
  domain: string;
  orgnr: string;
  city: string | null;
  reportSlug: string | null;
  scoreTotal: number | null;
  nokEstimate: number | null;
  step: number;
  channel: string;
  sentAt: string | null;
}

interface AdminCampaignItem {
  id: string;
  name: string;
  nace: string | null;
  postcodes: string[];
  status: string;
  createdBy: string;
  counts: {
    total: number;
    sent: number;
    opened: number;
    clicked: number;
    converted: number;
  };
  createdAt: string;
  outreachItems: OutreachItem[];
}

interface AdminFailedJobItem {
  jobId: string;
  businessId: string | null;
  businessName: string;
  domain: string;
  orgnr: string;
  city: string | null;
  nace: string | null;
  naceName: string | null;
  email: string | null;
  phone: string | null;
  error: string;
  isInsufficientData: boolean;
  modulesDone: string[];
  modulesFailed: string[];
  createdAt: string;
  finishedAt: string | null;
}

interface AdminOverviewResponse {
  kpis: {
    totalReports: number;
    unlockedReports: number;
    paidOrdersCount: number;
    revenueExVatNok: number;
    revenueIncVatNok: number;
    activeLeadsCount: number;
    newLeadsCount: number;
    slaBreachedCount: number;
    failedJobsCount?: number;
    totalMonthlyLostNokIdentified: number;
  };
  leads: AdminLeadItem[];
  failedJobs?: AdminFailedJobItem[];
  reports: AdminReportItem[];
  campaigns: AdminCampaignItem[];
}

const LEAD_STATUS_OPTIONS: Array<{ value: LeadStatus; label: string; badgeClass: string }> = [
  {
    value: 'new',
    label: 'Ny (Ubehandlet)',
    badgeClass: 'bg-brand-sand text-brand-dark border-brand-dark/15',
  },
  {
    value: 'called',
    label: 'Ringt / Kontaktet',
    badgeClass: 'bg-brand-rust/15 text-brand-dark border-brand-rust/40',
  },
  {
    value: 'meeting',
    label: 'Møte booket',
    badgeClass: 'bg-brand-pine/15 text-brand-pine border-brand-pine/30',
  },
  {
    value: 'won',
    label: 'Vunnet (Kunde)',
    badgeClass: 'bg-brand-pine text-brand-light border-brand-pine',
  },
  {
    value: 'lost',
    label: 'Tapt / Ikke aktuelt',
    badgeClass: 'bg-brand-light text-brand-blue border-brand-dark/15',
  },
];

const NACE_PRESETS = [
  { code: '', label: 'Automatisk fra Brreg / Ingen fast bransjekode (bruk domene-listen)' },
  { code: '86.230', label: '86.230 — Tannlegetjenester' },
  { code: '96.020', label: '96.020 — Hudpleie, skjønnhet & klinikker' },
  { code: '69.100', label: '69.100 — Juridisk tjenesteyting (Advokater)' },
  { code: '43.220', label: '43.220 — VVS- og rørleggerarbeid' },
  { code: '43.210', label: '43.210 — Elektrisk installasjonsarbeid' },
  { code: '68.310', label: '68.310 — Eiendomsmegling' },
];

export function AdminCommandCenterClient() {
  const [activeTab, setActiveTab] = useState<'leads' | 'reports' | 'campaigns'>('leads');
  const [data, setData] = useState<AdminOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [reportSearch, setReportSearch] = useState('');
  const [leadStatusFilter, setLeadStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [unlockingSlug, setUnlockingSlug] = useState<string | null>(null);
  const [updatingLeadId, setUpdatingLeadId] = useState<string | null>(null);
  const [dismissingJobId, setDismissingJobId] = useState<string | null>(null);
  const [leadNotesDraft, setLeadNotesDraft] = useState<Record<string, string>>({});

  const [campaignName, setCampaignName] = useState('Utvalgte bedrifter — Analyse');
  const [campaignNace, setCampaignNace] = useState('');
  const [campaignPostcodes, setCampaignPostcodes] = useState('');
  const [campaignDomains, setCampaignDomains] = useState('flowwmedia.no');
  const [isRunningCampaign, setIsRunningCampaign] = useState(false);
  const [campaignMessage, setCampaignMessage] = useState<string | null>(null);

  const loadOverview = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch('/api/admin/seo-analyse/overview', {
        cache: 'no-store',
        signal: AbortSignal.timeout(15000),
      });
      if (res.status === 401) {
        setIsUnauthorized(true);
        setLoading(false);
        return;
      }
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Kunne ikke laste admin-data.');
      }
      setIsUnauthorized(false);
      const typed = json as AdminOverviewResponse;
      setData(typed);

      const drafts: Record<string, string> = {};
      for (const l of typed.leads) {
        drafts[l.id] = l.notes || '';
      }
      setLeadNotesDraft((prev) => ({ ...drafts, ...prev }));
    } catch (err: any) {
      setError(err?.message || 'Kunne ikke hente admin-oversikt.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminPassword.trim() || isLoggingIn) return;
    setIsLoggingIn(true);
    setAuthError(null);
    try {
      const res = await fetch('/api/admin/seo-analyse/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPassword }),
        signal: AbortSignal.timeout(10000),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Ugyldig administratorpassord.');
      }
      setAdminPassword('');
      setIsUnauthorized(false);
      setLoading(true);
      await loadOverview();
    } catch (err: any) {
      setAuthError(err?.message || 'Innlogging feilet.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleAdminLogout = async () => {
    try {
      await fetch('/api/admin/seo-analyse/auth', {
        method: 'DELETE',
        signal: AbortSignal.timeout(8000),
      });
    } catch {
      // Ignore network hiccup on logout
    }
    setData(null);
    setIsUnauthorized(true);
  };

  const handleCopyTeaserLink = async (slug: string) => {
    const url = `${window.location.origin}/seo-analyse/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug(null), 2200);
    } catch {
      window.prompt('Kopier Teaser-lenke:', url);
    }
  };

  const handleVipUnlock = async (slug: string, businessName: string) => {
    if (unlockingSlug) return;
    setUnlockingSlug(slug);
    try {
      const res = await fetch(
        `/api/admin/seo-analyse/reports/${encodeURIComponent(slug)}/unlock`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            createLead: true,
            owner: 'Simen',
            notes: `VIP-opplåst gratis fra Admin for ${businessName}`,
          }),
          signal: AbortSignal.timeout(15000),
        }
      );
      if (res.status === 401) {
        setIsUnauthorized(true);
        return;
      }
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'VIP-opplåsing feilet.');
      }
      await loadOverview();
    } catch (err: any) {
      alert(err?.message || 'Kunne ikke låse opp rapporten.');
    } finally {
      setUnlockingSlug(null);
    }
  };

  const handleUpdateLead = async (
    leadId: string,
    patch: { status?: LeadStatus; owner?: string; notes?: string }
  ) => {
    setUpdatingLeadId(leadId);
    try {
      const res = await fetch(
        `/api/admin/seo-analyse/leads/${encodeURIComponent(leadId)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(patch),
          signal: AbortSignal.timeout(12000),
        }
      );
      if (res.status === 401) {
        setIsUnauthorized(true);
        return;
      }
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Kunne ikke oppdatere lead.');
      }
      await loadOverview();
    } catch (err: any) {
      alert(err?.message || 'Feil ved oppdatering av lead.');
    } finally {
      setUpdatingLeadId(null);
    }
  };

  const handleDismissFailedJob = async (opts: { jobId?: string; clearAllFailed?: boolean }) => {
    const key = opts.clearAllFailed ? 'ALL' : opts.jobId || '';
    if (!key || dismissingJobId) return;
    setDismissingJobId(key);
    try {
      const res = await fetch('/api/admin/seo-analyse/overview', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(opts),
        signal: AbortSignal.timeout(12000),
      });
      if (res.status === 401) {
        setIsUnauthorized(true);
        return;
      }
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Kunne ikke markere som håndtert.');
      }
      await loadOverview();
    } catch (err: any) {
      alert(err?.message || 'Kunne ikke markere avvik som håndtert.');
    } finally {
      setDismissingJobId(null);
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRunningCampaign) return;
    setIsRunningCampaign(true);
    setCampaignMessage(null);

    try {
      const res = await fetch('/api/admin/seo-analyse/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: campaignName,
          nace: campaignNace,
          postcodes: campaignPostcodes,
          domains: campaignDomains,
          createdBy: 'Simen',
        }),
        signal: AbortSignal.timeout(120000),
      });
      if (res.status === 401) {
        setIsUnauthorized(true);
        return;
      }
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Kunne ikke kjøre bulk-kampanje.');
      }
      setCampaignMessage(
        `Kampanjen «${json.campaign?.name}» er fullført! ${
          json.generatedReports?.length || 0
        } rapporter er klare med personlige teaser-lenker.`
      );
      await loadOverview();
    } catch (err: any) {
      setCampaignMessage(`Feil: ${err?.message || 'Ukjent feil ved kampanjekjøring.'}`);
    } finally {
      setIsRunningCampaign(false);
    }
  };

  const filteredLeads = useMemo(() => {
    if (!data) return [];
    return data.leads.filter((l) => {
      if (leadStatusFilter !== 'all' && l.status !== leadStatusFilter) return false;
      return true;
    });
  }, [data, leadStatusFilter]);

  const filteredReports = useMemo(() => {
    if (!data) return [];
    const q = reportSearch.trim().toLowerCase();
    if (!q) return data.reports;
    return data.reports.filter(
      (r) =>
        r.businessName.toLowerCase().includes(q) ||
        r.domain.toLowerCase().includes(q) ||
        r.orgnr.toLowerCase().includes(q) ||
        (r.city && r.city.toLowerCase().includes(q)) ||
        (r.nace && r.nace.toLowerCase().includes(q))
    );
  }, [data, reportSearch]);

  if (isUnauthorized) {
    return (
      <div className="min-h-screen bg-brand-light text-brand-dark flex flex-col">
        <header className="bg-brand-dark text-brand-light border-b border-brand-light/10 py-10 px-6">
          <div className="max-w-7xl mx-auto">
            <span className="text-micro uppercase tracking-widest text-brand-accent block mb-2">
              FLOWW COMMAND CENTER · SYNLIGHETSRAPPORTEN CRM &amp; ADMIN
            </span>
            <h1 className="font-heading text-fluid-h2 font-bold text-brand-light">
              Administratorinnlogging
            </h1>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center px-6 py-16">
          <div className="w-full max-w-md bg-brand-sand rounded-sm border border-brand-dark/15 border-t-[4px] border-t-brand-accent p-8 shadow-sm">
            <h2 className="font-heading text-xl font-bold text-brand-dark m-0">
              Logg inn i Floww Command Center
            </h2>
            <p className="font-body text-xs text-brand-blue mt-1.5 mb-6">
              Oppgi administratorpassord for tilgang til salgspipeline, VIP-opplåsing og
              outreach-kampanjer.
            </p>

            <form onSubmit={handleAdminLogin} className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="admin-password"
                  className="block text-micro uppercase tracking-wider font-bold text-brand-dark mb-1.5"
                >
                  Administratorpassord
                </label>
                <input
                  id="admin-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Skriv inn passord..."
                  className="w-full px-4 py-3 rounded-sm border border-brand-dark/25 bg-brand-light font-body text-sm text-brand-dark"
                />
              </div>

              {authError && (
                <div
                  role="alert"
                  className="bg-red-50 border border-red-200 text-red-800 rounded-sm p-3 font-body text-xs font-medium"
                >
                  {authError}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 px-5 rounded-sm bg-brand-pine hover:bg-brand-pine/90 disabled:opacity-50 text-brand-light font-heading font-bold uppercase tracking-wider text-xs transition cursor-pointer"
              >
                {isLoggingIn ? 'Verifiserer...' : 'Logg inn i Command Center →'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-light text-brand-dark pb-24">
      {/* Admin Command Center Header Banner */}
      <header className="bg-brand-dark text-brand-light border-b border-brand-light/10 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-micro uppercase tracking-widest text-brand-accent block mb-2">
              FLOWW COMMAND CENTER · SYNLIGHETSRAPPORTEN CRM & ADMIN
            </span>
            <h1 className="font-heading text-fluid-h2 font-bold text-brand-light">
              Salgspipeline, VIP-opplåsing &amp; Bulk Outreach
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={loadOverview}
              className="px-4 py-2.5 rounded-sm border border-brand-light/20 bg-brand-light/5 hover:bg-brand-light/10 text-xs font-heading font-bold uppercase tracking-wider text-brand-light transition cursor-pointer"
            >
              ↻ Oppdater tall
            </button>
            <Link
              href="/seo-analyse"
              className="px-5 py-2.5 rounded-sm bg-brand-pine hover:bg-brand-pine/90 text-brand-light text-xs font-heading font-bold uppercase tracking-wider transition"
            >
              + Kjør ny enkeltanalyse
            </Link>
            <button
              type="button"
              onClick={handleAdminLogout}
              className="px-4 py-2.5 rounded-sm border border-brand-light/20 bg-brand-light/5 hover:bg-red-700/80 text-xs font-heading font-bold uppercase tracking-wider text-brand-light transition cursor-pointer"
            >
              Logg ut
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 pt-10 flex flex-col gap-10">
        {/* KPI Overview Strip */}
        {data && (
          <section
            aria-label="Nøkkeltall for Synlighetsrapporten"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <div className="bg-brand-sand rounded-sm border border-brand-dark/10 p-6">
              <span className="text-micro uppercase tracking-wider text-brand-blue block">
                Genererte Rapporter
              </span>
              <div className="flex items-baseline justify-between mt-3">
                <span className="font-heading text-3xl font-extrabold text-brand-dark">
                  {data.kpis.totalReports}
                </span>
                <span className="text-micro uppercase tracking-wider text-brand-pine bg-brand-pine/10 border border-brand-pine/20 px-2.5 py-0.5 rounded-sm">
                  {data.kpis.unlockedReports} ulåste / VIP
                </span>
              </div>
              <p className="font-body text-xs text-brand-blue mt-2">
                {data.kpis.totalReports - data.kpis.unlockedReports} låste teaser-rapporter klare
                for salg
              </p>
            </div>

            <div className="bg-brand-sand rounded-sm border border-brand-dark/10 p-6">
              <span className="text-micro uppercase tracking-wider text-brand-blue block">
                Rapportomsetning (1 490 kr eks. mva.)
              </span>
              <div className="flex items-baseline justify-between mt-3">
                <span className="font-heading text-3xl font-extrabold text-brand-pine">
                  {formatNok(data.kpis.revenueExVatNok)} kr
                </span>
                <span className="text-micro uppercase tracking-wider text-brand-blue">
                  eks. mva.
                </span>
              </div>
              <p className="font-body text-xs text-brand-blue mt-2">
                Inkl. 25 % mva.: <strong>{formatNok(data.kpis.revenueIncVatNok)} kr</strong> (
                {data.kpis.paidOrdersCount} betalte ordre)
              </p>
            </div>

            <div className="bg-brand-sand rounded-sm border border-brand-dark/10 p-6">
              <span className="text-micro uppercase tracking-wider text-brand-blue block">
                Salgs-leads &amp; 2-Timers SLA
              </span>
              <div className="flex items-baseline justify-between mt-3">
                <span className="font-heading text-3xl font-extrabold text-brand-dark">
                  {data.kpis.activeLeadsCount}
                </span>
                {data.kpis.slaBreachedCount > 0 ? (
                  <span className="text-micro uppercase tracking-wider text-red-800 bg-red-100 border border-red-300 px-2.5 py-0.5 rounded-sm animate-pulse">
                    🚨 {data.kpis.slaBreachedCount} SLA-brudd (&gt;2t)
                  </span>
                ) : (
                  <span className="text-micro uppercase tracking-wider text-brand-pine bg-brand-pine/10 border border-brand-pine/20 px-2.5 py-0.5 rounded-sm">
                    ✓ 100 % innenfor 2t SLA
                  </span>
                )}
              </div>
              <p className="font-body text-xs text-brand-blue mt-2">
                {data.kpis.newLeadsCount} ubehandlede leads venter på oppringing
              </p>
            </div>

            <div className="bg-brand-dark text-brand-light rounded-sm border border-brand-dark p-6">
              <span className="text-micro uppercase tracking-wider text-brand-rust block">
                Identifisert Kundetap (Salgspitch)
              </span>
              <div className="mt-3">
                <span className="font-heading text-3xl font-extrabold text-brand-light">
                  {formatNok(data.kpis.totalMonthlyLostNokIdentified)} kr/mnd
                </span>
              </div>
              <p className="font-body text-xs text-brand-light/70 mt-2">
                Samlet beregnet omsetningslekkasje hos analyserte prospekter
              </p>
            </div>
          </section>
        )}

        {/* RED ALERT PANEL: Failed Audits / Quality Threshold (INSUFFICIENT_DATA) */}
        {data && data.failedJobs && data.failedJobs.length > 0 && (
          <section
            aria-label="Tekniske avvik og avbrutte analyser (Kvalitetsvakt)"
            className="rounded-sm border-2 border-red-400 bg-red-50/90 p-6 shadow-xs flex flex-col gap-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center px-2.5 py-1 rounded-sm bg-red-700 text-white text-micro uppercase tracking-wider font-bold">
                  🚨 Kvalitetsvakt ({data.failedJobs.length} avbrutte skanninger)
                </span>
                <h2 className="font-heading text-base font-bold text-red-950 m-0">
                  Manuell oppfølging kreves — Rapport stoppet pga. manglende API-data
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-body text-xs text-red-900">
                  Disse prospektene har lagt igjen e-post i Steg 2, men rapporten ble ikke vist pga. &gt;20 % feilede faktorer (INSUFFICIENT_DATA).
                </span>
                <button
                  type="button"
                  disabled={Boolean(dismissingJobId)}
                  onClick={() => handleDismissFailedJob({ clearAllFailed: true })}
                  className="px-3 py-1.5 rounded-sm border border-red-300 bg-white hover:bg-red-100 disabled:opacity-50 text-red-900 font-heading text-[11px] font-bold uppercase tracking-wider transition cursor-pointer"
                >
                  {dismissingJobId === 'ALL'
                    ? 'Fjerner...'
                    : `✓ Tøm alle (${data.failedJobs.length})`}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.failedJobs.map((job) => {
                const jobKey = job.jobId || (job as any).id;
                return (
                  <div
                    key={jobKey}
                    className="bg-white rounded-sm border border-red-300 border-l-[4px] border-l-red-600 p-4 flex flex-col justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="font-heading text-sm font-bold text-brand-dark block">
                            {job.businessName}
                          </span>
                          <span className="font-mono text-xs text-brand-blue">
                            {job.domain} · Org.nr {job.orgnr}
                            {job.city ? ` · ${job.city}` : ''}
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded-sm bg-red-100 border border-red-300 text-red-900 font-mono text-[11px] font-bold">
                          {job.error}
                        </span>
                      </div>

                      <div className="mt-3 p-2.5 rounded-sm bg-red-50 border border-red-200 flex flex-col gap-1">
                        <span className="text-micro uppercase tracking-wider text-red-900 font-bold">
                          Fanget e-post fra Steg 2 (Lead Gate):
                        </span>
                        {job.email ? (
                          <a
                            href={`mailto:${job.email}?subject=${encodeURIComponent(
                              `Synlighetsrapporten for ${job.businessName}`,
                            )}&body=${encodeURIComponent(
                              `Hei!\n\nVi så at dere nettopp kjørte en synlighetsanalyse for ${job.domain}, der en av våre eksterne datakilder hadde litt treg responstid.\n\nVi har kjørt analysen ferdig for dere nå – gi et vink om dere ønsker gjennomgang!`,
                            )}`}
                            className="font-mono text-xs font-bold text-red-800 underline hover:text-red-950 break-all"
                          >
                            ✉️ {job.email}
                          </a>
                        ) : (
                          <span className="font-body text-xs text-red-800/80 italic">
                            Ingen e-post registrert før avbrudd
                          </span>
                        )}
                        {Array.isArray(job.modulesFailed) && job.modulesFailed.length > 0 && (
                          <span className="font-mono text-[11px] text-red-800 mt-0.5">
                            Feilede moduler: {job.modulesFailed.join(', ')}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-red-100">
                      <span className="font-body text-[11px] text-brand-blue">
                        {new Date(job.createdAt).toLocaleString('nb-NO')}
                      </span>
                      <div className="flex flex-wrap items-center gap-2">
                        {job.email && (
                          <a
                            href={`mailto:${job.email}?subject=${encodeURIComponent(
                              `Synlighetsrapporten for ${job.businessName}`,
                            )}`}
                            className="px-3 py-1.5 rounded-sm bg-red-700 hover:bg-red-800 text-white font-heading text-[11px] font-bold uppercase tracking-wider transition"
                          >
                            Send e-post nå
                          </a>
                        )}
                        <Link
                          href="/seo-analyse"
                          className="px-3 py-1.5 rounded-sm border border-brand-dark/20 bg-brand-sand hover:bg-brand-sand/80 text-brand-dark font-heading text-[11px] font-bold uppercase tracking-wider transition"
                        >
                          Kjør på nytt →
                        </Link>
                        <button
                          type="button"
                          disabled={Boolean(dismissingJobId)}
                          onClick={() => handleDismissFailedJob({ jobId: jobKey })}
                          className="px-3 py-1.5 rounded-sm border border-brand-pine/30 bg-brand-pine/10 hover:bg-brand-pine/20 disabled:opacity-50 text-brand-pine font-heading text-[11px] font-bold uppercase tracking-wider transition cursor-pointer"
                        >
                          {dismissingJobId === jobKey
                            ? 'Lagrer...'
                            : '✓ Marker som håndtert'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-3 border-b border-brand-dark/10 pb-4">
          <button
            type="button"
            onClick={() => setActiveTab('leads')}
            className={`px-5 py-3 rounded-sm font-heading text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
              activeTab === 'leads'
                ? 'bg-brand-dark text-brand-light shadow-xs'
                : 'bg-brand-sand text-brand-dark border border-brand-dark/10 hover:bg-brand-sand/70'
            }`}
          >
            📞 1. CRM &amp; Salgs-leads ({data?.leads.length ?? 0})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reports')}
            className={`px-5 py-3 rounded-sm font-heading text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
              activeTab === 'reports'
                ? 'bg-brand-dark text-brand-light shadow-xs'
                : 'bg-brand-sand text-brand-dark border border-brand-dark/10 hover:bg-brand-sand/70'
            }`}
          >
            🔓 2. Alle Rapporter &amp; VIP-opplåsing ({data?.reports.length ?? 0})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('campaigns')}
            className={`px-5 py-3 rounded-sm font-heading text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
              activeTab === 'campaigns'
                ? 'bg-brand-dark text-brand-light shadow-xs'
                : 'bg-brand-sand text-brand-dark border border-brand-dark/10 hover:bg-brand-sand/70'
            }`}
          >
            🚀 3. Bulk &amp; Outreach-kampanjer ({data?.campaigns.length ?? 0})
          </button>
        </div>

        {loading && (
          <div className="bg-brand-sand rounded-sm border border-brand-dark/10 p-12 text-center">
            <div className="w-8 h-8 rounded-full border-3 border-brand-pine border-t-transparent animate-spin mx-auto mb-3" />
            <p className="font-heading text-sm font-bold text-brand-dark">
              Laster Floww Command Center...
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-sm p-4 font-body text-sm font-medium">
            {error}
          </div>
        )}

        {/* TAB 1: CRM & SALGS-LEADS */}
        {!loading && data && activeTab === 'leads' && (
          <section aria-label="CRM og Salgs-leads" className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-brand-sand p-5 rounded-sm border border-brand-dark/10">
              <div>
                <h2 className="font-heading text-lg font-bold text-brand-dark">
                  Varme Salgs-leads (Kjøpte &amp; VIP-opplåste rapporter)
                </h2>
                <p className="font-body text-xs text-brand-blue mt-0.5">
                  SLA-krav: Alle nye leads skal ringes av Simen/Marja innen 2 timer mens kunden
                  fortsatt leser rapporten.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setLeadStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-sm font-heading text-xs font-bold uppercase tracking-wider cursor-pointer ${
                    leadStatusFilter === 'all'
                      ? 'bg-brand-dark text-brand-light'
                      : 'bg-brand-light text-brand-blue border border-brand-dark/10 hover:text-brand-dark'
                  }`}
                >
                  Alle ({data.leads.length})
                </button>
                {LEAD_STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setLeadStatusFilter(opt.value)}
                    className={`px-3 py-1.5 rounded-sm font-heading text-xs font-bold uppercase tracking-wider cursor-pointer ${
                      leadStatusFilter === opt.value
                        ? 'bg-brand-dark text-brand-light'
                        : 'bg-brand-light text-brand-blue border border-brand-dark/10 hover:text-brand-dark'
                    }`}
                  >
                    {opt.label.split(' ')[0]} (
                    {data.leads.filter((l) => l.status === opt.value).length})
                  </button>
                ))}
              </div>
            </div>

            {filteredLeads.length === 0 ? (
              <div className="bg-brand-sand rounded-sm border border-brand-dark/10 p-10 text-center flex flex-col gap-2">
                <p className="font-heading text-base font-bold text-brand-dark">
                  Ingen leads i denne visningen ennå
                </p>
                <p className="font-body text-xs text-brand-blue">
                  Når en bedrift kjøper rapporten (1 490 kr eks. mva.) eller du bruker «Lås opp
                  gratis (VIP)» under fanen Alle Rapporter, dukker kunden opp her med 2-timers SLA.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filteredLeads.map((lead) => {
                  const statusMeta =
                    LEAD_STATUS_OPTIONS.find((s) => s.value === lead.status) ||
                    LEAD_STATUS_OPTIONS[0];

                  return (
                    <article
                      key={lead.id}
                      className={`bg-brand-light rounded-sm border p-6 shadow-2xs transition ${
                        lead.slaBreached
                          ? 'border-red-300 bg-red-50/30'
                          : 'border-brand-dark/10'
                      }`}
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* Left: Business & Contact Info */}
                        <div className="lg:col-span-5 flex flex-col gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            {lead.status === 'new' ? (
                              lead.slaBreached ||
                              (lead.slaRemainingMinutes !== null &&
                                lead.slaRemainingMinutes <= 0) ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-red-700 text-white text-micro uppercase tracking-wider">
                                  🚨 SLA BRUTT (&gt; 2t uten oppringing)
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-brand-pine/10 text-brand-pine border border-brand-pine/25 text-micro uppercase tracking-wider">
                                  ⏱ SLA-klokke: {lead.slaRemainingMinutes ?? 120} min igjen
                                </span>
                              )
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm bg-brand-pine/10 text-brand-pine border border-brand-pine/25 text-micro uppercase tracking-wider">
                                ✓ Kontaktet{' '}
                                {lead.calledAt
                                  ? new Date(lead.calledAt).toLocaleTimeString('nb-NO', {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })
                                  : ''}
                              </span>
                            )}

                            <span
                              className={`px-2.5 py-1 rounded-sm text-micro uppercase tracking-wider border ${statusMeta.badgeClass}`}
                            >
                              {statusMeta.label}
                            </span>
                          </div>

                          <h3 className="font-heading text-lg font-bold text-brand-dark">
                            {lead.businessName}{' '}
                            {lead.domain && (
                              <span className="text-sm font-mono font-normal text-brand-blue">
                                ({lead.domain})
                              </span>
                            )}
                          </h3>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-body text-xs text-brand-blue">
                            {lead.orgnr && <span>Org.nr: {lead.orgnr}</span>}
                            {lead.city && <span>📍 {lead.city}</span>}
                            {lead.contactName && (
                              <span>
                                👤 Kontakt: <strong className="text-brand-dark">{lead.contactName}</strong>
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-2.5 pt-1">
                            {lead.email && (
                              <a
                                href={`mailto:${lead.email}`}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-brand-sand hover:bg-brand-sand/70 text-xs font-heading font-bold text-brand-dark"
                              >
                                ✉️ {lead.email}
                              </a>
                            )}
                            {lead.phone && (
                              <a
                                href={`tel:${lead.phone}`}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-brand-pine/10 hover:bg-brand-pine/20 border border-brand-pine/25 text-xs font-heading font-bold text-brand-pine"
                              >
                                📞 {lead.phone}
                              </a>
                            )}
                            {lead.reportSlug && (
                              <Link
                                href={`/seo-analyse/${lead.reportSlug}`}
                                target="_blank"
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-sm bg-brand-dark hover:bg-brand-dark/90 text-brand-light text-xs font-heading font-bold uppercase tracking-wider"
                              >
                                Åpne kundens rapport ↗
                              </Link>
                            )}
                          </div>
                        </div>

                        {/* Middle: Score & Monthly Revenue Loss */}
                        <div className="lg:col-span-3 flex sm:grid sm:grid-cols-2 lg:flex lg:flex-col gap-3 bg-brand-sand p-4 rounded-sm border border-brand-dark/10">
                          <div>
                            <span className="text-micro uppercase tracking-wider text-brand-blue block">
                              Synlighetsscore
                            </span>
                            <span className="font-heading text-xl font-extrabold text-brand-dark">
                              {Math.round(lead.scoreTotal)} / 100
                            </span>
                          </div>
                          <div>
                            <span className="text-micro uppercase tracking-wider text-brand-blue block">
                              Est. Månedlig Tap
                            </span>
                            <span className="font-heading text-lg font-extrabold text-brand-rust">
                              {formatNok(lead.nokEstimate)} kr/mnd
                            </span>
                          </div>
                        </div>

                        {/* Right: Interactive CRM Controls */}
                        <div className="lg:col-span-4 flex flex-col gap-3">
                          <div className="grid grid-cols-2 gap-2.5">
                            <div>
                              <label
                                htmlFor={`lead-status-${lead.id}`}
                                className="block text-micro uppercase tracking-wider text-brand-blue mb-1"
                              >
                                Pipeline-status
                              </label>
                              <select
                                id={`lead-status-${lead.id}`}
                                value={lead.status}
                                disabled={updatingLeadId === lead.id}
                                onChange={(e) =>
                                  handleUpdateLead(lead.id, {
                                    status: e.target.value as LeadStatus,
                                  })
                                }
                                className="w-full px-3 py-2 rounded-sm border border-brand-dark/20 bg-brand-light font-heading text-xs font-bold text-brand-dark"
                              >
                                {LEAD_STATUS_OPTIONS.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label
                                htmlFor={`lead-owner-${lead.id}`}
                                className="block text-micro uppercase tracking-wider text-brand-blue mb-1"
                              >
                                Ansvarlig selger
                              </label>
                              <select
                                id={`lead-owner-${lead.id}`}
                                value={lead.owner || 'Simen'}
                                disabled={updatingLeadId === lead.id}
                                onChange={(e) =>
                                  handleUpdateLead(lead.id, { owner: e.target.value })
                                }
                                className="w-full px-3 py-2 rounded-sm border border-brand-dark/20 bg-brand-light font-heading text-xs font-bold text-brand-dark"
                              >
                                <option value="Simen">Simen</option>
                                <option value="Marja">Marja</option>
                                <option value="Floww Salg">Floww Salg</option>
                              </select>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <input
                              id={`lead-notes-${lead.id}`}
                              aria-label={`Salgsnotat for ${lead.businessName}`}
                              type="text"
                              value={leadNotesDraft[lead.id] ?? lead.notes ?? ''}
                              onChange={(e) =>
                                setLeadNotesDraft((prev) => ({
                                  ...prev,
                                  [lead.id]: e.target.value,
                                }))
                              }
                              placeholder="Legg til salgsnotat..."
                              className="flex-1 px-3 py-2 rounded-sm border border-brand-dark/20 font-body text-xs bg-brand-light text-brand-dark"
                            />
                            <button
                              type="button"
                              disabled={updatingLeadId === lead.id}
                              onClick={() =>
                                handleUpdateLead(lead.id, {
                                  notes: leadNotesDraft[lead.id] ?? '',
                                })
                              }
                              className="px-3.5 py-2 rounded-sm bg-brand-dark hover:bg-brand-dark/90 text-brand-light font-heading text-xs font-bold uppercase tracking-wider shrink-0 cursor-pointer"
                            >
                              Lagre
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* TAB 2: ALLE RAPPORTER & VIP-OPPLÅSING */}
        {!loading && data && activeTab === 'reports' && (
          <section aria-label="Alle genererte rapporter" className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-brand-sand p-5 rounded-sm border border-brand-dark/10">
              <div>
                <h2 className="font-heading text-lg font-bold text-brand-dark">
                  Alle Genererte Synlighetsrapporter ({filteredReports.length})
                </h2>
                <p className="font-body text-xs text-brand-blue mt-0.5">
                  Kopier teaser-lenker til outreach, last ned PDF, eller bruk «🔓 Lås opp gratis
                  (VIP)» når du sitter i salgsmøte med kunden.
                </p>
              </div>

              <input
                id="admin-report-search"
                aria-label="Søk i genererte rapporter"
                type="search"
                value={reportSearch}
                onChange={(e) => setReportSearch(e.target.value)}
                placeholder="Søk på bedrift, domene, org.nr., by..."
                className="w-full sm:w-80 px-4 py-2.5 rounded-sm border border-brand-dark/20 font-body text-xs sm:text-sm bg-brand-light text-brand-dark"
              />
            </div>

            <div className="bg-brand-light rounded-sm border border-brand-dark/10 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-brand-dark text-brand-light text-micro uppercase tracking-wider">
                      <th className="py-3.5 px-4 font-semibold">Bedrift &amp; Domene</th>
                      <th className="py-3.5 px-4 font-semibold">Org.nr &amp; Bransje</th>
                      <th className="py-3.5 px-4 font-semibold text-center">Score</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Månedlig Tap</th>
                      <th className="py-3.5 px-4 font-semibold text-center">Status</th>
                      <th className="py-3.5 px-4 font-semibold text-right">
                        Salgsverktøy &amp; VIP-opplåsing
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-dark/10">
                    {filteredReports.map((rep) => (
                      <tr key={rep.id} className="hover:bg-brand-sand/40 transition-colors">
                        <td className="py-4 px-4">
                          <Link
                            href={`/seo-analyse/${rep.slug}`}
                            target="_blank"
                            className="font-heading font-bold text-brand-dark hover:text-brand-pine hover:underline block"
                          >
                            {rep.businessName} ↗
                          </Link>
                          <span className="font-mono text-xs text-brand-blue">
                            {rep.domain} {rep.city ? `· ${rep.city}` : ''}
                          </span>
                        </td>

                        <td className="py-4 px-4 font-body text-xs text-brand-blue">
                          <span className="font-mono font-semibold text-brand-dark block">
                            {rep.orgnr}
                          </span>
                          <span>
                            {rep.nace ? `NACE ${rep.nace}` : 'Standard'} ·{' '}
                            {rep.findingCounts?.crit ?? 0} krit / {rep.findingCounts?.warn ?? 0}{' '}
                            adv
                          </span>
                        </td>

                        <td className="py-4 px-4 text-center">
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-sm text-micro uppercase tracking-wider border ${
                              rep.scoreTotal >= 75
                                ? 'bg-brand-pine/10 text-brand-pine border-brand-pine/25'
                                : rep.scoreTotal >= 50
                                  ? 'bg-brand-rust/15 text-brand-dark border-brand-rust/40'
                                  : 'bg-red-50 text-red-800 border-red-200'
                            }`}
                          >
                            {Math.round(rep.scoreTotal)} / 100
                          </span>
                        </td>

                        <td className="py-4 px-4 text-right font-heading font-extrabold text-brand-rust">
                          {formatNok(rep.nokEstimate)} kr/mnd
                        </td>

                        <td className="py-4 px-4 text-center">
                          {rep.isUnlocked ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm bg-brand-pine/10 text-brand-pine border border-brand-pine/25 text-micro uppercase tracking-wider">
                              🔓 Ulåst / Betalt
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm bg-brand-rust/15 text-brand-dark border-brand-rust/40 text-micro uppercase tracking-wider">
                              🔒 Låst Teaser
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-4">
                          <div className="flex flex-wrap items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleCopyTeaserLink(rep.slug)}
                              className="px-3 py-1.5 rounded-sm border border-brand-dark/15 bg-brand-sand hover:bg-brand-sand/70 font-heading text-xs font-bold text-brand-dark cursor-pointer"
                            >
                              {copiedSlug === rep.slug
                                ? '✓ Kopiert!'
                                : '📋 Kopier Teaser-lenke'}
                            </button>

                            {!rep.isUnlocked ? (
                              <button
                                type="button"
                                disabled={unlockingSlug === rep.slug}
                                onClick={() => handleVipUnlock(rep.slug, rep.businessName)}
                                className="px-3 py-1.5 rounded-sm bg-brand-pine hover:bg-brand-pine/90 disabled:bg-brand-blue text-brand-light font-heading text-xs font-bold uppercase tracking-wider cursor-pointer"
                              >
                                {unlockingSlug === rep.slug
                                  ? 'Låser opp...'
                                  : '🔓 Lås opp gratis (VIP)'}
                              </button>
                            ) : (
                              <a
                                href={`/api/seo-analyse/report/${encodeURIComponent(
                                  rep.slug
                                )}/pdf`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-sm bg-brand-dark hover:bg-brand-dark/90 text-brand-light font-heading text-xs font-bold uppercase tracking-wider"
                              >
                                📄 Last ned PDF
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* TAB 3: BULK & OUTREACH-KAMPANJER */}
        {!loading && data && activeTab === 'campaigns' && (
          <section
            aria-label="Bulk og Outreach-kampanjer"
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Left Column: Launch New Campaign Form */}
            <div className="lg:col-span-5 bg-brand-sand rounded-sm border border-brand-dark/10 p-6 sm:p-8 flex flex-col gap-5 self-start">
              <div>
                <span className="text-micro uppercase tracking-wider text-brand-pine bg-brand-pine/10 px-2.5 py-1 rounded-sm">
                  Proaktiv B2B Outreach
                </span>
                <h2 className="font-heading text-xl font-bold text-brand-dark mt-2">
                  Start ny Bulk-analyse &amp; Outreach-kampanje
                </h2>
                <p className="font-body text-xs text-brand-blue mt-1">
                  Generer ferdige, skreddersydde teaser-rapporter med økonomisk tapsestimat for en
                  liste med domener eller et NACE-bransjesøk i Brønnøysundregistrene.
                </p>
              </div>

              <form onSubmit={handleCreateCampaign} className="flex flex-col gap-4">
                <div>
                  <label
                    htmlFor="campaign-name"
                    className="block text-micro uppercase tracking-wider text-brand-dark mb-1"
                  >
                    Kampanjenavn
                  </label>
                  <input
                    id="campaign-name"
                    type="text"
                    required
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-sm border border-brand-dark/20 bg-brand-light font-body text-sm text-brand-dark"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="campaign-nace"
                      className="block text-micro uppercase tracking-wider text-brand-dark mb-1"
                    >
                      NACE-bransjekode (valgfritt)
                    </label>
                    <select
                      id="campaign-nace"
                      value={campaignNace}
                      onChange={(e) => setCampaignNace(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-sm border border-brand-dark/20 font-heading text-xs font-bold bg-brand-light text-brand-dark"
                    >
                      {NACE_PRESETS.map((n) => (
                        <option key={n.code || 'auto'} value={n.code}>
                          {n.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="campaign-postcodes"
                      className="block text-micro uppercase tracking-wider text-brand-dark mb-1"
                    >
                      Postnumre (valgfritt)
                    </label>
                    <input
                      id="campaign-postcodes"
                      type="text"
                      value={campaignPostcodes}
                      onChange={(e) => setCampaignPostcodes(e.target.value)}
                      placeholder="0150, 0255, 0350"
                      className="w-full px-3.5 py-2.5 rounded-sm border border-brand-dark/20 bg-brand-light font-body text-xs text-brand-dark"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="campaign-domains"
                    className="block text-micro uppercase tracking-wider text-brand-dark mb-1"
                  >
                    Domener å analysere (ett per linje — la stå tomt for Brreg-oppslag)
                  </label>
                  <textarea
                    id="campaign-domains"
                    rows={4}
                    value={campaignDomains}
                    onChange={(e) => setCampaignDomains(e.target.value)}
                    placeholder={'smilia.no\ncocoon.no'}
                    className="w-full px-3.5 py-2.5 rounded-sm border border-brand-dark/20 bg-brand-light font-mono text-xs text-brand-dark"
                  />
                </div>

                {campaignMessage && (
                  <div className="p-3.5 rounded-sm bg-brand-pine/10 border border-brand-pine/30 font-body text-xs font-semibold text-brand-dark">
                    {campaignMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isRunningCampaign}
                  className="w-full py-3.5 px-5 rounded-sm bg-brand-pine hover:bg-brand-pine/90 disabled:bg-brand-blue text-brand-light font-heading font-bold uppercase tracking-wider text-xs sm:text-sm transition cursor-pointer"
                >
                  {isRunningCampaign
                    ? 'Kjører tekniske analyser og genererer teaser-lenker...'
                    : '🚀 Start Bulk-kampanje & Generer Teaser-lenker'}
                </button>
              </form>
            </div>

            {/* Right Column: Existing Campaigns & Outreach Links */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <h2 className="font-heading text-lg font-bold text-brand-dark">
                Kjørende og fullførte kampanjer ({data.campaigns.length})
              </h2>

              {data.campaigns.length === 0 ? (
                <div className="bg-brand-sand rounded-sm border border-brand-dark/10 p-8 text-center font-body text-sm text-brand-blue">
                  Ingen bulk-kampanjer kjørt ennå. Bruk skjemaet til venstre for å generere ditt
                  første sett med teaser-lenker!
                </div>
              ) : (
                data.campaigns.map((camp) => (
                  <article
                    key={camp.id}
                    className="bg-brand-light rounded-sm border border-brand-dark/10 p-6 shadow-2xs flex flex-col gap-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-brand-dark/10 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-sm bg-brand-pine/10 text-brand-pine border border-brand-pine/25 text-micro uppercase tracking-wider">
                            {camp.status}
                          </span>
                          {camp.nace && (
                            <span className="text-micro uppercase tracking-wider text-brand-blue">
                              NACE {camp.nace}
                            </span>
                          )}
                        </div>
                        <h3 className="font-heading text-base font-bold text-brand-dark mt-1">
                          {camp.name}
                        </h3>
                      </div>

                      <div className="text-right font-body text-xs text-brand-blue">
                        <span className="font-heading font-bold text-brand-dark block">
                          {camp.outreachItems.length} prospekter klargjort
                        </span>
                        <span>{new Date(camp.createdAt).toLocaleDateString('nb-NO')}</span>
                      </div>
                    </div>

                    {camp.outreachItems.length > 0 && (
                      <div className="overflow-x-auto rounded-sm border border-brand-dark/10">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-brand-sand text-brand-dark uppercase text-micro">
                              <th className="py-2.5 px-3 font-bold">Prospekt</th>
                              <th className="py-2.5 px-3 font-bold text-center">Score</th>
                              <th className="py-2.5 px-3 font-bold text-right">Est. Tap / mnd</th>
                              <th className="py-2.5 px-3 font-bold text-right">Outreach-lenke</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-brand-dark/10">
                            {camp.outreachItems.map((item) => (
                              <tr key={item.id}>
                                <td className="py-2.5 px-3">
                                  <span className="font-heading font-bold text-brand-dark block">
                                    {item.businessName}
                                  </span>
                                  <span className="font-mono text-brand-blue">{item.domain}</span>
                                </td>
                                <td className="py-2.5 px-3 text-center font-heading font-bold text-brand-dark">
                                  {item.scoreTotal !== null
                                    ? `${Math.round(item.scoreTotal)}/100`
                                    : '—'}
                                </td>
                                <td className="py-2.5 px-3 text-right font-heading font-bold text-brand-rust">
                                  {item.nokEstimate !== null
                                    ? `${formatNok(item.nokEstimate)} kr/mnd`
                                    : '—'}
                                </td>
                                <td className="py-2.5 px-3 text-right">
                                  {item.reportSlug ? (
                                    <div className="inline-flex items-center gap-1.5">
                                      <button
                                        type="button"
                                        onClick={() => handleCopyTeaserLink(item.reportSlug!)}
                                        className="px-2.5 py-1 rounded-sm bg-brand-dark text-brand-light font-heading font-bold text-xs cursor-pointer"
                                      >
                                        {copiedSlug === item.reportSlug
                                          ? '✓ Kopiert'
                                          : 'Kopier lenke'}
                                      </button>
                                      <Link
                                        href={`/seo-analyse/${item.reportSlug}`}
                                        target="_blank"
                                        className="px-2 py-1 rounded-sm border border-brand-dark/15 text-brand-dark hover:bg-brand-sand font-heading font-bold text-xs"
                                      >
                                        Åpne ↗
                                      </Link>
                                    </div>
                                  ) : (
                                    <span className="text-brand-blue">Ingen rapport</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </article>
                ))
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
