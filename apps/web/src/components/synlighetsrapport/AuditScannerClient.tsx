'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

interface StatusResponse {
  jobId: string;
  status: 'queued' | 'running' | 'done' | 'failed';
  gateState?: 'awaiting_email' | 'confirmed';
  modulesDone: string[];
  error: string | null;
  errorCode?: string | null;
  businessName: string | null;
  orgnr?: string | null;
  domain: string | null;
  city: string | null;
  naceName: string | null;
  reportSlug: string | null;
}

interface AuditModuleStep {
  key: string;
  label: string;
  description: string;
  wave: number;
}

const AUDIT_STEPS: AuditModuleStep[] = [
  {
    key: 'resolve',
    label: 'Brønnøysundregistrene & Google-identitet',
    description: 'Verifiserer org.nr., NACE-bransjekode, underenheter og Google Places-ID',
    wave: 1,
  },
  {
    key: 'gbp',
    label: 'Google Business Profile (Kartprofil)',
    description: 'Sjekker kategorier, åpningstider, stjernerating, anmeldelser og utfyllingsgrad',
    wave: 2,
  },
  {
    key: 'crawl',
    label: 'Teknisk Nettside-crawl & On-page SEO',
    description: 'Analyserer sidetitler, H1-struktur, tjenestesider, Schema.org og internlenking',
    wave: 2,
  },
  {
    key: 'speed',
    label: 'Hastighet & Core Web Vitals (Mobil)',
    description: 'Måler LCP, INP, CLS og TTFB på mobil via PageSpeed og sanntidsprofilering',
    wave: 2,
  },
  {
    key: 'serp',
    label: 'Google-kart (3×3 Geo-Grid) & Organisk SERP',
    description: 'Kartlegger plasseringer mot de 3 største lokale konkurrentene',
    wave: 2,
  },
  {
    key: 'links',
    label: 'Autoritet & Innlenkeprofil',
    description: 'Evaluerer henvisende domener, domenestyrke og ankertekst-fordeling',
    wave: 2,
  },
  {
    key: 'citations',
    label: 'Norske Kataloger & NAP-konsistens',
    description: 'Kryssjekker 1881, Gule Sider, Proff, Apple Maps og Bing Places',
    wave: 2,
  },
  {
    key: 'mentions',
    label: 'Redaksjonelle Omtaler & «Beste i byen»-lister',
    description: 'Undersøker ulenkede omtaler og synlighet i rangerte bransjekåringer',
    wave: 2,
  },
  {
    key: 'ai',
    label: 'AI-synlighet (ChatGPT, Gemini, Claude & Perplexity)',
    description: 'Tester 10 bransjespørsmål i AI-søkemotorer mot lokale konkurrenter',
    wave: 2,
  },
  {
    key: 'score',
    label: 'Økonomisk tapsmodell & vekting (245 faktorer)',
    description: 'Beregner tapt månedlig omsetning, Google Ads-verdi og totalscore',
    wave: 3,
  },
];

export interface AuditScannerClientProps {
  variant?: 'light' | 'sand' | 'dark';
}

export default function AuditScannerClient({
  variant = 'light',
}: AuditScannerClientProps) {
  const router = useRouter();
  const [domain, setDomain] = useState('');
  const [jobId, setJobId] = useState<string | null>(null);
  const [statusData, setStatusData] = useState<StatusResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Step 2 Lead Gate state
  const [gateEmail, setGateEmail] = useState('');
  const [agencySpendMonthly, setAgencySpendMonthly] = useState('');
  const [agencyDurationMonths, setAgencyDurationMonths] = useState('');
  const [isConfirmingEmail, setIsConfirmingEmail] = useState(false);
  const [gateErrorMessage, setGateErrorMessage] = useState<string | null>(null);

  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAudit = async (targetDomain: string) => {
    setErrorMessage(null);
    setGateErrorMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/seo-analyse/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: targetDomain,
        }),
        signal: AbortSignal.timeout(30000),
      });

      const data = await response.json();
      if (!response.ok || !data.jobId) {
        throw new Error(data.error || 'Kunne ikke starte analysen.');
      }

      if (data.status === 'done' && (data.reportSlug || data.slug)) {
        router.push(`/seo-analyse/${data.reportSlug || data.slug}`);
        return;
      }

      setJobId(data.jobId);
      setStatusData({
        jobId: data.jobId,
        status: data.status || 'queued',
        gateState: data.gateState || 'awaiting_email',
        modulesDone: Array.isArray(data.modulesDone) ? data.modulesDone : ['resolve'],
        error: null,
        errorCode: null,
        businessName: data.businessName || targetDomain,
        orgnr: data.orgnr || null,
        domain: data.domain || targetDomain,
        city: data.city || null,
        naceName: data.naceName || null,
        reportSlug: data.reportSlug || null,
      });
      setIsSubmitting(false);
    } catch (err: any) {
      const isTimeout =
        err?.name === 'TimeoutError' ||
        err?.name === 'AbortError' ||
        /timed out/i.test(err?.message || '');
      setErrorMessage(
        isTimeout
          ? 'Oppslaget tok for lang tid (tidsavbrudd). Vennligst prøv igjen.'
          : err?.message || 'Noe gikk galt ved oppstart av analysen.'
      );
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) {
      setErrorMessage('Skriv inn domenet til virksomheten din (f.eks. dittdomene.no).');
      return;
    }
    await startAudit(domain.trim());
  };

  const handleConfirmEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobId) return;

    const clean = gateEmail.trim();
    if (!clean || !clean.includes('@')) {
      setGateErrorMessage('Vennligst skriv inn en gyldig e-postadresse.');
      return;
    }

    setGateErrorMessage(null);
    setIsConfirmingEmail(true);

    try {
      const res = await fetch('/api/seo-analyse/confirm-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId,
          email: clean,
          agencySpendMonthly: agencySpendMonthly.trim() || null,
          agencyDurationMonths: agencyDurationMonths.trim() || null,
        }),
        signal: AbortSignal.timeout(30000),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.error || 'Kunne ikke bekrefte e-postadressen. Vennligst prøv igjen.'
        );
      }

      if (data.status === 'done' && data.reportSlug) {
        router.push(`/seo-analyse/${data.reportSlug}`);
        return;
      }

      setStatusData((prev) =>
        prev
          ? {
            ...prev,
            status: 'running',
            gateState: 'confirmed',
            modulesDone: Array.isArray(data.modulesDone)
              ? data.modulesDone
              : ['resolve', 'email_confirmed'],
          }
          : prev
      );
      setIsConfirmingEmail(false);
    } catch (err: any) {
      const isTimeout =
        err?.name === 'TimeoutError' ||
        err?.name === 'AbortError' ||
        /timed out/i.test(err?.message || '');
      setGateErrorMessage(
        isTimeout
          ? 'Bekreftelsen tok for lang tid (tidsavbrudd). Vennligst prøv igjen.'
          : err?.message || 'Noe gikk galt. Sjekk at e-postadressen er stavet riktig.'
      );
      setIsConfirmingEmail(false);
    }
  };

  const isAwaitingEmailGate = statusData?.gateState === 'awaiting_email';

  useEffect(() => {
    // Only poll when jobId exists AND user has passed the Step 2 Lead Gate
    if (!jobId || isAwaitingEmailGate) {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
      return;
    }

    const pollStatus = async () => {
      try {
        const res = await fetch(`/api/seo-analyse/status/${jobId}`, {
          cache: 'no-store',
          signal: AbortSignal.timeout(8000),
        });
        if (!res.ok) return;

        const data = (await res.json()) as StatusResponse;
        setStatusData(data);

        if (data.status === 'done' && data.reportSlug) {
          if (pollTimerRef.current) clearInterval(pollTimerRef.current);
          router.push(`/seo-analyse/${data.reportSlug}`);
        } else if (data.status === 'failed') {
          if (pollTimerRef.current) clearInterval(pollTimerRef.current);
          setErrorMessage(data.error || 'Analysen feilet under kjøring.');
          setIsSubmitting(false);
        }
      } catch {
        // Keep polling on transient network hiccup
      }
    };

    void pollStatus();
    pollTimerRef.current = setInterval(pollStatus, 1200);

    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, [jobId, isAwaitingEmailGate, router]);

  const doneSet = new Set(statusData?.modulesDone ?? []);
  const completedCount = AUDIT_STEPS.filter((s) => doneSet.has(s.key)).length;
  const progressPercent = jobId
    ? Math.max(10, Math.round((completedCount / AUDIT_STEPS.length) * 100))
    : 0;

  const isDarkCard = variant === 'dark';

  const cardSurfaceClass =
    variant === 'dark'
      ? 'bg-brand-dark text-brand-light border-brand-dark'
      : variant === 'sand'
        ? 'bg-brand-sand text-brand-dark border-brand-dark/15'
        : 'bg-brand-light text-brand-dark border-brand-dark/15';

  if (!jobId) {
    return (
      <div
        className={`${cardSurfaceClass} border rounded-sm p-[clamp(1.5rem,3vw,2.5rem)] shadow-sm`}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
          <div>
            <label
              htmlFor="domain-input"
              className={`block font-heading text-fluid-h4 mb-3 ${isDarkCard ? 'text-brand-light' : 'text-brand-dark'
                }`}
            >
              Skriv inn domenet til virksomheten din
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                id="domain-input"
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="dittdomene.no"
                autoComplete="url"
                required
                className="flex-1 rounded-[3px] border border-brand-dark/25 bg-brand-light px-4 py-3.5 text-fluid-p text-brand-dark placeholder:text-brand-blue/60"
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="whitespace-nowrap cursor-pointer"
                variant="primary"
              >
                {isSubmitting ? 'Verifiserer domene...' : 'Kjør gratis analyse →'}
              </Button>
            </div>
            <p
              className={`font-body text-micro mt-3 text-center sm:text-left ${isDarkCard ? 'text-brand-light/60' : 'text-brand-dark/60'
                }`}
            >
              Gratis analyse for norske virksomheter. Begrenset til maks 3 søk per døgn.
            </p>
          </div>

          <div
            className={`flex flex-wrap items-center justify-between gap-4 pt-4 border-t text-micro ${isDarkCard
              ? 'border-brand-light/15 text-brand-light/75'
              : 'border-brand-dark/10 text-brand-blue'
              }`}
          >
            <span>
              Analyserer 245 synlighetsfaktorer på tvers av Google Maps, SEO og AI-søkemotorer
            </span>
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="rounded-sm border-l-[4px] border-brand-rust bg-brand-sand px-4 py-3 font-body text-fluid-p text-brand-dark font-medium"
            >
              {errorMessage}
            </div>
          )}
        </form>
      </div>
    );
  }

  return (
    <div
      aria-live="polite"
      className={`${cardSurfaceClass} border rounded-sm p-[clamp(1.5rem,3vw,2.5rem)] shadow-sm`}
    >
      <div
        className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b ${isDarkCard ? 'border-brand-light/15' : 'border-brand-dark/10'
          }`}
      >
        <div className="flex flex-col gap-1.5 min-w-0">
          <span className="self-start inline-flex items-center gap-2 rounded-sm bg-brand-sand px-3 py-1 text-micro uppercase font-bold text-brand-pine">
            <span className="h-2 w-2 rounded-full bg-brand-pine animate-pulse" />
            {isAwaitingEmailGate
              ? 'Steg 1 av 2 fullført · Bedrift verifisert'
              : 'Analyse pågår i sanntid'}
          </span>
          <h2
            className={`font-heading text-fluid-h3 m-0 break-words ${isDarkCard ? 'text-brand-light' : 'text-brand-dark'
              }`}
          >
            {isAwaitingEmailGate
              ? `Vi fant bedriften din: ${statusData?.businessName || statusData?.domain || domain}!`
              : `Analyserer ${statusData?.businessName || statusData?.domain || domain}`}
          </h2>
          {(statusData?.naceName || statusData?.city || statusData?.orgnr) && (
            <p
              className={`font-body text-fluid-p m-0 ${isDarkCard ? 'text-brand-light/75' : 'text-brand-blue'
                }`}
            >
              {statusData?.orgnr ? `Org.nr. ${statusData.orgnr}` : ''}
              {statusData?.orgnr && (statusData?.naceName || statusData?.city) ? ' · ' : ''}
              {statusData?.naceName ? `${statusData.naceName}` : ''}
              {statusData?.city ? ` · ${statusData.city}` : ''}
            </p>
          )}
        </div>
        <div className="text-left sm:text-right">
          <span
            className={`font-heading text-fluid-h2 font-bold ${isDarkCard ? 'text-brand-accent' : 'text-brand-pine'
              }`}
          >
            {progressPercent} %
          </span>
          <p
            className={`text-micro uppercase m-0 ${isDarkCard ? 'text-brand-light/75' : 'text-brand-blue'
              }`}
          >
            {completedCount} av {AUDIT_STEPS.length} moduler fullført
          </p>
        </div>
      </div>

      <div
        className={`mt-5 h-3 w-full overflow-hidden rounded-sm ${isDarkCard ? 'bg-brand-light/15' : 'bg-brand-sand'
          }`}
      >
        <div
          className={`h-full transition-all duration-500 ease-out ${isDarkCard ? 'bg-brand-accent' : 'bg-brand-pine'
            }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* STEP 2 LEAD GATE CARD (Paused at 10% after free Wave 1 Resolve) */}
      {isAwaitingEmailGate && (
        <div className="mt-6 rounded-sm border-2 border-brand-pine bg-brand-sand p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col gap-4 max-w-2xl">
            <div className="flex flex-col gap-1.5">
              <span className="text-micro uppercase tracking-wider font-heading font-bold text-brand-pine">
                Steg 2 av 2 · Bekreft mottaker av rapportlenken
              </span>
              <h3 className="font-heading text-fluid-h3 text-brand-dark m-0">
                Hvor skal vi sende lenken til den ferdige rapporten?
              </h3>
              <p className="font-body text-fluid-p text-brand-blue m-0 max-w-none">
                Vi starter nå dybdeanalysen av Google-kartet (3×3 Geo-Grid), teknisk SEO, hastighet og AI-synlighet for{' '}
                <strong className="text-brand-dark">
                  {statusData?.businessName || domain}
                </strong>
                . Oppgi e-postadressen din, så åpnes rapporten her på skjermen straks den er ferdig (ca. 45 sekunder), samtidig som vi sender deg en kopi av lenken på e-post.
              </p>
            </div>

            <form onSubmit={handleConfirmEmail} className="flex flex-col gap-4 mt-1" noValidate>
              <div>
                <label
                  htmlFor="gate-email-input"
                  className="block font-heading text-micro font-bold uppercase tracking-wider text-brand-dark mb-1.5"
                >
                  Din jobb-e-postadresse <span className="text-brand-pine">*</span>
                </label>
                <input
                  id="gate-email-input"
                  type="email"
                  value={gateEmail}
                  onChange={(e) => setGateEmail(e.target.value)}
                  placeholder="navn@bedrift.no"
                  autoComplete="email"
                  autoFocus
                  required
                  disabled={isConfirmingEmail}
                  className="w-full rounded-[3px] border border-brand-dark/25 bg-brand-light px-4 py-3.5 text-fluid-p text-brand-dark placeholder:text-brand-blue/60"
                />
              </div>

              {/* Optional Current Agency ROI Section (No Yes/No checkbox) */}
              <div className="rounded-sm border border-brand-dark/15 bg-brand-light/85 p-4 sm:p-5 flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-micro uppercase tracking-wider font-heading font-bold text-brand-pine">
                    Valgfritt · Byrå-sjekken
                  </span>
                  <p className="font-heading font-bold text-fluid-p text-brand-dark m-0">
                    Bruker dere et SEO- eller markedsføringsbyrå i dag?
                  </p>
                  <p className="font-body text-sm text-brand-blue m-0">
                    Fyll inn hva dere betaler, så regner motoren ut nøyaktig hva dere faktisk får igjen for investeringen målt mot det økonomiske synlighetstapet.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label
                      htmlFor="gate-agency-spend-input"
                      className="block font-heading text-micro font-bold uppercase tracking-wider text-brand-dark mb-1.5"
                    >
                      Månedlig beløp (NOK)
                    </label>
                    <div className="flex items-center rounded-[3px] border border-brand-dark/25 bg-white px-3.5 focus-within:border-brand-pine">
                      <input
                        id="gate-agency-spend-input"
                        type="text"
                        inputMode="numeric"
                        value={agencySpendMonthly}
                        onChange={(e) => setAgencySpendMonthly(e.target.value)}
                        placeholder="F.eks. 15 000"
                        disabled={isConfirmingEmail}
                        className="flex-1 bg-transparent border-0 py-2.5 text-fluid-p text-brand-dark placeholder:text-brand-blue/50 focus:outline-none w-full"
                      />
                      <span className="text-micro uppercase tracking-normal font-semibold text-brand-blue ml-2 shrink-0">
                        kr / mnd
                      </span>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="gate-agency-months-input"
                      className="block font-heading text-micro font-bold uppercase tracking-wider text-brand-dark mb-1.5"
                    >
                      Hvor lenge har dere brukt dem?
                    </label>
                    <div className="flex items-center rounded-[3px] border border-brand-dark/25 bg-white px-3.5 focus-within:border-brand-pine">
                      <input
                        id="gate-agency-months-input"
                        type="text"
                        inputMode="numeric"
                        value={agencyDurationMonths}
                        onChange={(e) => setAgencyDurationMonths(e.target.value)}
                        placeholder="F.eks. 12"
                        disabled={isConfirmingEmail}
                        className="flex-1 bg-transparent border-0 py-2.5 text-fluid-p text-brand-dark placeholder:text-brand-blue/50 focus:outline-none w-full"
                      />
                      <span className="text-micro uppercase tracking-normal font-semibold text-brand-blue ml-2 shrink-0">
                        mnd
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <Button
                  type="submit"
                  disabled={isConfirmingEmail}
                  className="w-full sm:w-auto whitespace-nowrap cursor-pointer"
                >
                  {isConfirmingEmail
                    ? 'Starter dybdeanalyse...'
                    : 'Send lenke og fullfør analysen →'}
                </Button>
              </div>

              {gateErrorMessage && (
                <div
                  role="alert"
                  className="rounded-sm border-l-[4px] border-brand-rust bg-brand-light px-4 py-2.5 text-sm text-brand-dark font-medium"
                >
                  {gateErrorMessage}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-micro text-brand-blue">
                <span>
                  100 % uforpliktende forhåndsanalyse. Ved å fortsette godtar du vår{' '}
                  <Link
                    href="/personvern"
                    className="underline hover:text-brand-dark font-medium"
                  >
                    personvernerklæring
                  </Link>
                  .
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setJobId(null);
                    setStatusData(null);
                    setGateEmail('');
                    setAgencySpendMonthly('');
                    setAgencyDurationMonths('');
                    setGateErrorMessage(null);
                  }}
                  className="text-brand-pine underline hover:text-brand-dark font-medium cursor-pointer"
                >
                  Bytt domene
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {errorMessage && (
        <div
          role="alert"
          className="mt-6 rounded-sm border-l-[4px] border-brand-rust bg-brand-sand p-5 font-body text-fluid-p text-brand-dark"
        >
          <p className="font-heading font-bold text-fluid-h4 m-0">
            {statusData?.errorCode === 'INSUFFICIENT_DATA'
              ? 'Teknisk avbrudd under datainnhenting'
              : 'Analysen kunne ikke fullføres'}
          </p>
          <p className="mt-2 mb-4 max-w-none">{errorMessage}</p>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              onClick={() => {
                setJobId(null);
                setStatusData(null);
                setErrorMessage(null);
              }}
            >
              Prøv på nytt
            </Button>
            <Link
              href="/kontakt"
              className="text-sm font-heading font-bold uppercase tracking-wider text-brand-pine underline underline-offset-4 hover:text-brand-dark"
            >
              Kontakt oss direkte →
            </Link>
          </div>
        </div>
      )}

      <ol className="mt-8 mb-0 mx-0 grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
        {AUDIT_STEPS.map((step) => {
          const isDone = doneSet.has(step.key);
          const isRunning =
            !isDone &&
            !isAwaitingEmailGate &&
            statusData?.status === 'running' &&
            ((step.wave === 1 && !doneSet.has('resolve')) ||
              (step.wave === 2 && doneSet.has('resolve')) ||
              (step.wave === 3 && completedCount >= 9));

          return (
            <li
              key={step.key}
              className={`rounded-sm border p-4 transition ${isDone
                ? 'border-brand-pine/40 bg-brand-sand'
                : isRunning
                  ? 'border-brand-accent bg-brand-sand/50'
                  : 'border-brand-dark/10 bg-brand-light opacity-75'
                }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-micro uppercase text-brand-blue font-bold block">
                    Bølge {step.wave} · {step.key.toUpperCase()}
                  </span>
                  <h3 className="font-heading text-fluid-h4 text-brand-dark m-0">
                    {step.label}
                  </h3>
                  <p className="font-body text-fluid-p text-brand-blue m-0">
                    {step.description}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-sm px-2.5 py-1 text-micro font-bold uppercase ${isDone
                    ? 'bg-brand-pine text-brand-light'
                    : isRunning
                      ? 'bg-brand-rust text-brand-dark'
                      : 'bg-brand-dark/10 text-brand-blue'
                    }`}
                >
                  {isDone ? 'Ferdig ✓' : isRunning ? 'Kjører...' : 'I kø'}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
