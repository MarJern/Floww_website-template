'use client';

import React from 'react';
import Link from 'next/link';
import {
  type ReportApiResponse,
  formatNok,
  getScoreColor,
} from './types';

interface ReportExecutiveHeroProps {
  data: ReportApiResponse;
  measuredTotalCount: number;
  onOpenUnlockModal: () => void;
  isPdfMode?: boolean;
}

export default function ReportExecutiveHero({
  data,
  measuredTotalCount,
  onOpenUnlockModal,
  isPdfMode = false,
}: ReportExecutiveHeroProps) {
  const scoreColors = getScoreColor(data.scoreTotal);
  const annualLoss = data.financialSummary?.annualLostRevenue ?? data.nokEstimate * 12;
  const monthlyClicksLost =
    data.financialSummary?.monthlyLostClicks ?? Math.round(data.nokEstimate / 260);
  const keywords = data.financialSummary?.keywords ?? [];
  const clv = data.financialSummary?.benchmarks?.customerLifetimeValue || 6000;
  const monthlyLostCustomers = Math.max(1, Math.round(data.nokEstimate / clv));
  const agencyRoi = data.financialSummary?.agencyRoi ?? null;

  return (
    <>
      {/* 0. DEDICATED BRANDED PDF REPORT MASTHEAD (White Paper Mode with Dark Logo Badge) */}
      <div
        className={`${
          isPdfMode ? 'block' : 'hidden print:block'
        } w-full bg-white text-brand-dark pt-2`}
      >
        {isPdfMode && (
          <div className="print:hidden w-full bg-brand-sand border-b border-brand-dark/15 mb-4 py-3">
            <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8 flex flex-wrap items-center justify-between gap-3">
              <Link
                href={`/seo-analyse/${encodeURIComponent(data.slug)}`}
                className="text-micro font-heading uppercase tracking-wider font-bold text-brand-blue hover:text-brand-dark transition-colors"
              >
                ← Tilbake til interaktiv rapport
              </Link>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-[3px] bg-brand-pine hover:bg-brand-dark text-brand-light text-micro font-heading uppercase tracking-wider font-bold transition cursor-pointer"
              >
                🖨️ Lagre som PDF / Skriv ut
              </button>
            </div>
          </div>
        )}
        <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8 flex items-center justify-between gap-6 border-b-2 border-brand-dark pb-4 mb-6">
          <div className="bg-brand-dark px-3.5 py-2 rounded-sm inline-flex items-center shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo.svg"
              alt="Floww Media"
              width={140}
              height={32}
              loading="eager"
              decoding="sync"
              className="h-7 w-auto object-contain block"
            />
          </div>

          <div className="flex flex-col items-end text-right shrink-0">
            <span className="font-heading font-bold text-xs tracking-normal text-brand-dark block">
              SYNLIGHETSRAPPORTEN 2026
            </span>
            <span className="font-body text-[11px] tracking-normal text-brand-blue block mt-0.5">
              Floww AS · Org.nr. 922 758 476 MVA · kontakt@flowwmedia.no
            </span>
          </div>
        </div>
      </div>

      {/* 1. EDGE-TO-EDGE BREADCRUMB & PRIMARY ACTION STRIP (Hidden in PDF) */}
      <div
        data-web-chrome="true"
        className={`${
          isPdfMode ? 'hidden' : data.isUnlocked ? 'print:hidden' : ''
        } w-full bg-brand-sand border-b border-brand-dark/10`}
      >
        <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <nav
            aria-label="Brødsmulesti"
            className="text-micro uppercase tracking-wider font-bold text-brand-blue"
          >
            <ol className="flex flex-wrap items-center gap-2 list-none m-0 p-0">
              <li>
                <Link href="/" className="hover:text-brand-dark transition-colors">
                  Hjem
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href="/seo-analyse"
                  className="hover:text-brand-dark transition-colors"
                >
                  SEO-analyse
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-brand-dark">
                {data.business.name}
              </li>
            </ol>
          </nav>

          <div className="flex items-center gap-3">
            {data.isUnlocked ? (
              <a
                href={`/api/seo-analyse/report/${encodeURIComponent(data.slug)}/pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[3px] bg-brand-pine hover:bg-brand-dark text-brand-light text-micro font-heading uppercase tracking-wider font-bold transition cursor-pointer"
              >
                <span>📄 Last ned PDF-rapport</span>
              </a>
            ) : (
              <button
                type="button"
                onClick={onOpenUnlockModal}
                className="inline-flex flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5 px-5 py-2.5 rounded-[3px] bg-brand-rust hover:bg-brand-accent text-brand-dark text-micro font-heading uppercase tracking-wider font-bold transition cursor-pointer shadow-xs text-center"
              >
                <span className="whitespace-nowrap">🔓 Lås opp hele utredningen</span>
                <span className="whitespace-nowrap">(1 490 kr eks. mva.) →</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. EDGE-TO-EDGE EXECUTIVE HERO SECTION */}
      <section
        aria-labelledby="report-main-heading"
        className="w-full bg-brand-light print:bg-white text-brand-dark py-[clamp(2.5rem,5.5vw,4.5rem)] print:py-4 border-b border-brand-dark/10"
      >
        <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 print:mb-6">
            <div className="flex flex-wrap items-center gap-2 text-micro print:text-[11px] print:tracking-normal uppercase tracking-wider font-bold text-brand-dark">
              <span className="px-3 py-1 rounded-sm bg-brand-sand text-brand-dark">
                Org.nr: {data.business.orgnr}
              </span>
              {data.business.nace && (
                <span className="px-3 py-1 rounded-sm bg-brand-sand text-brand-blue">
                  NACE {data.business.nace} · {data.business.naceName}
                </span>
              )}
              {data.business.city && (
                <span className="px-3 py-1 rounded-sm bg-brand-sand text-brand-blue">
                  📍 {data.business.address ? `${data.business.address}, ` : ''}
                  {data.business.city}
                </span>
              )}
              <span className="px-3 py-1 rounded-sm bg-brand-dark text-brand-accent uppercase text-micro print:text-[11px] print:tracking-normal">
                Analysemodell: Lokal virksomhet
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-micro print:text-xs print:tracking-normal uppercase tracking-wider text-brand-blue font-medium">
              <span>Utarbeidet: {new Date(data.createdAt).toLocaleDateString('nb-NO')}</span>
              <span aria-hidden="true" className="px-1">
                |
              </span>
              <span>{measuredTotalCount} målepunkter revidert</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8 flex flex-col gap-4 min-w-0">
              <p className="text-micro print:tracking-wider uppercase tracking-widest text-brand-pine font-bold leading-relaxed m-0">
                Ledersammendrag & Økonomisk Konsekvensanalyse
              </p>
              <h1
                id="report-main-heading"
                className="font-heading text-fluid-h1 text-brand-dark leading-[1.1] m-0 break-words"
              >
                {data.business.name}
              </h1>
              <p className="font-body text-fluid-p-lg text-brand-dark/90 leading-relaxed max-w-4xl m-0 pt-1 break-words">
                Vår tekniske revisjon av{' '}
                <strong className="text-brand-dark font-bold break-all">{data.business.domain}</strong> på
                tvers av Google Maps (Kartpakken), teknisk SEO, AI-søk (ChatGPT, Gemini, Claude og Perplexity) og Google Ads
                avdekket{' '}
                <strong className="text-red-700 underline decoration-red-400 decoration-2 font-bold">
                  {data.findingCounts.crit} kritiske feil
                </strong>{' '}
                og{' '}
                <strong className="text-amber-700 font-bold">
                  {data.findingCounts.warn} advarsler
                </strong>
                . Disse synlighetshullene gjør at virksomheten taper estimert{' '}
                <strong className="text-brand-pine font-bold">
                  {formatNok(monthlyClicksLost)} kjøpsklare besøkende hver måned
                </strong>{' '}
                direkte til de 3 største lokale konkurrentene.
              </p>

              {/* Error Count Pills */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-sm bg-red-50 border border-red-200 text-red-700 text-micro print:tracking-normal uppercase tracking-wider font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                  {data.findingCounts.crit} Kritiske feil (0 % uttelling)
                </div>
                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-sm bg-amber-50 border border-amber-200 text-amber-700 text-micro print:tracking-normal uppercase tracking-wider font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  {data.findingCounts.warn} Advarsler (50 % uttelling)
                </div>
                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-sm bg-emerald-50 border border-emerald-200 text-emerald-700 text-micro print:tracking-normal uppercase tracking-wider font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  {data.findingCounts.ok} Godkjent (100 % uttelling)
                </div>
              </div>
            </div>

            {/* Overall Score Gauge Card */}
            <div className="lg:col-span-4">
              <div
                className={`rounded-sm p-6 border-t-[4px] border-t-brand-accent border ${scoreColors.border} ${scoreColors.bg} flex flex-col items-center text-center`}
              >
                <span className="text-micro print:tracking-normal uppercase tracking-widest font-bold text-brand-blue mb-2">
                  Samlet Synlighetsscore
                </span>
                <div className="flex items-baseline gap-1.5 my-1">
                  <span
                    className={`font-heading text-fluid-h1 font-extrabold tracking-tight ${scoreColors.text}`}
                  >
                    {Math.round(data.scoreTotal)}
                  </span>
                  <span className="font-heading text-fluid-h4 font-bold text-brand-blue">
                    / 100
                  </span>
                </div>
                <span
                  className={`text-micro print:tracking-normal uppercase tracking-wider font-bold ${scoreColors.text} mb-4`}
                >
                  {scoreColors.label}
                </span>

                <div className="w-full h-3 bg-white print:bg-white rounded-sm overflow-hidden border border-brand-dark/15">
                  <div
                    className={`h-full ${scoreColors.bar}`}
                    style={{
                      width: `${Math.min(100, Math.max(5, Math.round(data.scoreTotal)))}%`,
                    }}
                  />
                </div>
                <p className="text-micro print:tracking-normal text-brand-blue pt-3 m-0">
                  Anbefalt nivå for Topp 3-synlighet i {data.business.city || 'området'}:{' '}
                  <strong className="text-emerald-700">≥ 80 / 100</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. EDGE-TO-EDGE FINANCIAL BLEED BANNER (Outer section white in print, inner dark card & KPI sub-cards retained) */}
      <section
        aria-label="Økonomisk Synlighetslekkasje"
        className="w-full bg-brand-dark text-brand-light print:bg-white py-[clamp(2.5rem,5vw,4.5rem)] print:py-6 print:break-inside-avoid print:border-b print:border-brand-dark/10"
      >
        <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-brand-dark text-brand-light print:bg-brand-dark print:text-brand-light rounded-sm print:p-6">
            <div className="lg:col-span-7 flex flex-col gap-3">
              <div className="inline-flex self-start items-center gap-2 px-3 py-1 rounded-sm bg-brand-dark/90 print:bg-brand-dark border border-brand-light/15 text-brand-accent print:text-brand-accent text-micro print:tracking-normal uppercase tracking-widest font-bold">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                Beregnet Økonomisk Synlighetslekkasje
              </div>
              <p className="font-body text-fluid-p-lg text-brand-light/90 print:text-brand-light/90 m-0">
                Estimert tapt omsetning hver måned på grunn av tapte plasseringer i Google Maps og
                organisk søk:
              </p>
              <div className="font-heading font-extrabold text-fluid-h1 text-brand-light print:text-brand-light leading-none py-1">
                {formatNok(data.nokEstimate)}{' '}
                <span className="text-brand-rust print:text-brand-rust font-bold text-fluid-h3">
                  kr / mnd
                </span>
              </div>
              <p className="font-body text-fluid-p text-brand-light/80 print:text-brand-light/80 leading-relaxed pt-1 m-0">
                Basert på bransjens konverteringsrate (
                {data.financialSummary?.benchmarks?.conversionRate
                  ? `${(data.financialSummary.benchmarks.conversionRate * 100).toFixed(1)} %`
                  : '4,0 %'}
                ), livstidsverdi per kunde ({formatNok(clv)} kr) og faktisk søkevolum i{' '}
                {data.business.city || 'deres område'}.
              </p>
            </div>

            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-4">
              <div className="rounded-sm bg-brand-blue text-brand-light print:bg-brand-blue print:text-brand-light border-l-[4px] border-l-brand-rust p-4 flex flex-col gap-1">
                <span className="text-micro print:tracking-normal uppercase tracking-wider text-brand-light/70 print:text-brand-light/80 block">
                  Årlig tapt potensial
                </span>
                <span className="font-heading text-fluid-h3 font-bold text-brand-rust print:text-brand-rust block">
                  {formatNok(annualLoss)} kr/år
                </span>
                <span className="text-micro print:tracking-normal text-brand-light/70 print:text-brand-light/80 block">
                  Ved uendret synlighet neste 12 mnd
                </span>
              </div>

              <div className="rounded-sm bg-brand-blue text-brand-light print:bg-brand-blue print:text-brand-light border-l-[4px] border-l-brand-accent p-4 flex flex-col gap-1">
                <span className="text-micro print:tracking-normal uppercase tracking-wider text-brand-light/70 print:text-brand-light/80 block">
                  Klikkverdi (Google Ads)
                </span>
                <span className="font-heading text-fluid-h3 font-bold text-brand-accent print:text-brand-accent block">
                  {formatNok(data.adsValue)} kr/mnd
                </span>
                <span className="text-micro print:tracking-normal text-brand-light/70 print:text-brand-light/80 block">
                  Hva den tapte trafikken koster å kjøpe i Google Ads
                </span>
              </div>

              <div className="rounded-sm bg-brand-blue text-brand-light print:bg-brand-blue print:text-brand-light border-l-[4px] border-l-brand-accent p-4 flex flex-col gap-1">
                <span className="text-micro print:tracking-normal uppercase tracking-wider text-brand-light/70 print:text-brand-light/80 block">
                  Tapte kundeklikk
                </span>
                <span className="font-heading text-fluid-h3 font-bold text-brand-light print:text-brand-light block">
                  {formatNok(monthlyClicksLost)} klikk/mnd
                </span>
                <span className="text-micro print:tracking-normal text-brand-light/70 print:text-brand-light/80 block">
                  Går til Topp 3 i kartet og organisk
                </span>
              </div>

              <div className="rounded-sm bg-brand-blue text-brand-light print:bg-brand-blue print:text-brand-light border-l-[4px] border-l-brand-rust p-4 flex flex-col gap-1">
                <span className="text-micro print:tracking-normal uppercase tracking-wider text-brand-light/70 print:text-brand-light/80 block">
                  Tapte nye kunder
                </span>
                <span className="font-heading text-fluid-h3 font-bold text-brand-rust print:text-brand-rust block">
                  ~{formatNok(monthlyLostCustomers)} kunder/mnd
                </span>
                <span className="text-micro print:tracking-normal text-brand-light/70 print:text-brand-light/80 block">
                  Basert på snittverdi {formatNok(clv)} kr per kunde
                </span>
              </div>
            </div>
          </div>

          {/* DYNAMIC CURRENT AGENCY ROI REVEAL (Only shown when user entered agency spend) */}
          {agencyRoi && agencyRoi.monthlySpend > 0 && (
            <div className="mt-8 rounded-sm border-l-[4px] border-l-brand-rust bg-brand-blue text-brand-light print:bg-brand-blue print:text-brand-light p-6 sm:p-8 flex flex-col gap-5 print:break-inside-avoid">
              <div className="flex flex-col gap-2">
                <span className="text-micro print:tracking-normal uppercase tracking-widest font-bold text-brand-rust block">
                  Byrå-regnskapet · Avkastning på nåværende byråavtale
                </span>
                <h3 className="font-heading text-fluid-h3 font-bold text-brand-light print:text-brand-light leading-snug m-0">
                  {agencyRoi.totalInvested !== null && agencyRoi.durationMonths ? (
                    <>
                      Dere har betalt{' '}
                      <span className="text-brand-rust underline decoration-brand-rust/50 underline-offset-4">
                        {formatNok(agencyRoi.totalInvested)} kr
                      </span>{' '}
                      til nåværende byrå over {agencyRoi.durationMonths} måneder, men har fortsatt{' '}
                      <span className="text-brand-rust">
                        {data.findingCounts.crit} kritiske feil
                      </span>{' '}
                      og taper {formatNok(data.nokEstimate)} kr/mnd til konkurrentene.
                    </>
                  ) : (
                    <>
                      Dere betaler{' '}
                      <span className="text-brand-rust underline decoration-brand-rust/50 underline-offset-4">
                        {formatNok(agencyRoi.monthlySpend)} kr/mnd
                      </span>{' '}
                      ({formatNok(agencyRoi.annualSpend)} kr/år) til nåværende byrå, men har
                      fortsatt{' '}
                      <span className="text-brand-rust">
                        {data.findingCounts.crit} kritiske feil
                      </span>{' '}
                      og taper {formatNok(data.nokEstimate)} kr/mnd til konkurrentene.
                    </>
                  )}
                </h3>
                <p className="font-body text-fluid-p text-brand-light/90 print:text-brand-light/90 leading-relaxed m-0 max-w-4xl">
                  Til tross for en løpende investering på{' '}
                  <strong>{formatNok(agencyRoi.monthlySpend)} kr/mnd</strong> i ekstern
                  markedsføringsbistand, står <strong>{data.business.domain}</strong> igjen med en
                  samlet synlighetsscore på <strong>{Math.round(data.scoreTotal)} av 100 poeng</strong>{' '}
                  ({data.findingCounts.crit} kritiske avvik og {data.findingCounts.warn} advarsler).
                  Når den tekniske grunnmuren ikke er rettet, betaler dere i praksis dobbelt: først{' '}
                  <strong>{formatNok(agencyRoi.monthlySpend)} kr/mnd</strong> i byråhonorar, og
                  deretter <strong>{formatNok(data.nokEstimate)} kr/mnd</strong> i tapt omsetning
                  som går direkte til de tre største konkurrentene deres.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 print:grid-cols-3 gap-4 pt-5 border-t border-brand-light/15">
                <div className="rounded-sm bg-brand-dark/60 p-4 flex flex-col gap-1">
                  <span className="text-micro print:tracking-normal uppercase tracking-wider text-brand-light/70 block">
                    {agencyRoi.totalInvested !== null
                      ? 'Betalt til nåværende byrå'
                      : 'Årlig byråkostnad'}
                  </span>
                  <span className="font-heading text-fluid-h3 font-bold text-brand-rust block">
                    {formatNok(agencyRoi.totalInvested ?? agencyRoi.annualSpend)} kr
                  </span>
                  <span className="text-micro print:tracking-normal text-brand-light/75 block">
                    {agencyRoi.durationMonths
                      ? `Fordelt på ${agencyRoi.durationMonths} mnd à ${formatNok(agencyRoi.monthlySpend)} kr`
                      : `${formatNok(agencyRoi.monthlySpend)} kr/mnd i løpende honorar`}
                  </span>
                </div>

                <div className="rounded-sm bg-brand-dark/60 p-4 flex flex-col gap-1">
                  <span className="text-micro print:tracking-normal uppercase tracking-wider text-brand-light/70 block">
                    Teknisk tilstand i dag
                  </span>
                  <span className="font-heading text-fluid-h3 font-bold text-brand-light block">
                    {data.findingCounts.crit} kritiske feil
                  </span>
                  <span className="text-micro print:tracking-normal text-brand-light/75 block">
                    {data.findingCounts.warn} advarsler · Samlet score {Math.round(data.scoreTotal)}
                    /100
                  </span>
                </div>

                <div className="rounded-sm bg-brand-dark/60 p-4 flex flex-col gap-1">
                  <span className="text-micro print:tracking-normal uppercase tracking-wider text-brand-light/70 block">
                    Reell månedlig belastning
                  </span>
                  <span className="font-heading text-fluid-h3 font-bold text-brand-rust block">
                    {formatNok(agencyRoi.combinedMonthlyBleed)} kr/mnd
                  </span>
                  <span className="text-micro print:tracking-normal text-brand-light/75 block">
                    Byråhonorar + estimert tapt omsetning
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4. EDGE-TO-EDGE KEYWORD LOSS TABLE & TOP 3 COMPETITORS */}
      <section
        aria-labelledby="keyword-loss-heading"
        className="w-full bg-brand-light print:bg-white text-brand-dark py-[clamp(2.5rem,5.5vw,4.5rem)] print:py-6 border-b border-brand-dark/10"
      >
        <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8 flex flex-col gap-12 print:gap-8">
          <div className="flex flex-col gap-3 max-w-3xl">
            <p className="text-micro print:tracking-normal uppercase tracking-widest font-bold text-brand-pine leading-relaxed m-0">
              Økonomisk Tapsanalyse per Søkeord
            </p>
            <h2
              id="keyword-loss-heading"
              className="font-heading text-fluid-h2 text-brand-dark leading-[1.15] m-0"
            >
              Hvor pengene lekker: Søkeordene der konkurrentene tar kundene deres
            </h2>
            <p className="font-body text-fluid-p-lg text-brand-dark/90 leading-relaxed m-0 pt-1">
              Tabellen viser faktisk månedlig søkevolum, klikkpris i Google Ads (CPC), nåværende
              posisjon mot målposisjon (#1 i kart + #1 organisk) og beregnet månedlig omsetningstap
              per søkeord.
            </p>
          </div>

          {keywords.length > 0 && (
            <div className="w-full overflow-x-auto print:overflow-visible">
              <table className="w-full table-auto text-left border-collapse print:text-[10px] print:leading-snug">
                <thead>
                  <tr className="border-b border-brand-dark/20">
                    <th className="py-3 pr-3 print:py-2 print:pr-2.5 text-micro print:text-[9px] print:tracking-normal uppercase tracking-wider text-brand-blue font-bold align-bottom leading-tight">
                      Søkeord
                    </th>
                    <th className="py-3 px-3 print:py-2 print:px-2.5 text-micro print:text-[9px] print:tracking-normal uppercase tracking-wider text-brand-blue font-bold text-right align-bottom leading-tight whitespace-nowrap">
                      Volum / mnd
                    </th>
                    <th className="py-3 px-3 print:py-2 print:px-2.5 text-micro print:text-[9px] print:tracking-normal uppercase tracking-wider text-brand-blue font-bold text-center align-bottom leading-tight whitespace-nowrap">
                      Kartposisjon
                    </th>
                    <th className="py-3 px-3 print:py-2 print:px-2.5 text-micro print:text-[9px] print:tracking-normal uppercase tracking-wider text-brand-blue font-bold text-center align-bottom leading-tight whitespace-nowrap">
                      Organisk pos.
                    </th>
                    <th className="py-3 px-3 print:py-2 print:px-2.5 text-micro print:text-[9px] print:tracking-normal uppercase tracking-wider text-brand-blue font-bold text-right align-bottom leading-tight whitespace-nowrap">
                      Tapte klikk
                    </th>
                    <th className="py-3 px-3 print:py-2 print:px-2.5 text-micro print:text-[9px] print:tracking-normal uppercase tracking-wider text-brand-blue font-bold text-right align-bottom leading-tight whitespace-nowrap">
                      Ads CPC
                    </th>
                    <th className="py-3 px-3 print:py-2 print:px-2.5 text-micro print:text-[9px] print:tracking-normal uppercase tracking-wider text-brand-blue font-bold text-right align-bottom leading-tight whitespace-nowrap">
                      Klikkverdi (Ads)
                    </th>
                    <th className="py-3 pl-3 print:py-2 print:pl-2.5 text-micro print:text-[9px] print:tracking-normal uppercase tracking-wider text-brand-blue font-bold text-right align-bottom leading-tight whitespace-nowrap">
                      Tapt omsetning
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-dark/10 font-body text-fluid-p print:text-[10px] text-brand-dark/80">
                  {keywords.map((kw) => (
                    <tr
                      key={kw.keyword}
                      className="hover:bg-brand-sand/40 transition-colors print:break-inside-avoid"
                    >
                      <td className="py-3.5 pr-3 print:py-2 print:pr-2.5 text-brand-dark">
                        <span className="font-semibold">«{kw.keyword}»</span>
                      </td>
                      <td className="py-3.5 px-3 print:py-2 print:px-2.5 text-right whitespace-nowrap">
                        {formatNok(kw.volume)}
                      </td>
                      <td className="py-3.5 px-3 print:py-2 print:px-2.5 text-center whitespace-nowrap">
                        {kw.mapRank >= 1 && kw.mapRank <= 3 ? (
                          <span className="inline-flex px-2 py-0.5 print:px-1.5 print:py-0.5 rounded-sm bg-emerald-50 text-emerald-700 border border-emerald-200 text-micro print:text-[9px] print:tracking-normal uppercase tracking-wider font-bold">
                            #{kw.mapRank} i kartet
                          </span>
                        ) : (
                          <span className="inline-flex px-2 py-0.5 print:px-1.5 print:py-0.5 rounded-sm bg-red-50 text-red-700 border border-red-200 text-micro print:text-[9px] print:tracking-normal uppercase tracking-wider font-bold">
                            Utenfor Topp 3
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 print:py-2 print:px-2.5 text-center whitespace-nowrap">
                        {kw.orgRank >= 1 && kw.orgRank <= 3 ? (
                          <span className="inline-flex px-2 py-0.5 print:px-1.5 print:py-0.5 rounded-sm bg-emerald-50 text-emerald-700 border border-emerald-200 text-micro print:text-[9px] print:tracking-normal uppercase tracking-wider font-bold">
                            #{kw.orgRank}
                          </span>
                        ) : kw.orgRank > 3 ? (
                          <span className="inline-flex px-2 py-0.5 print:px-1.5 print:py-0.5 rounded-sm bg-amber-50 text-amber-700 border border-amber-200 text-micro print:text-[9px] print:tracking-normal uppercase tracking-wider font-bold">
                            Plass #{kw.orgRank}
                          </span>
                        ) : (
                          <span className="inline-flex px-2 py-0.5 print:px-1.5 print:py-0.5 rounded-sm bg-red-50 text-red-700 border border-red-200 text-micro print:text-[9px] print:tracking-normal uppercase tracking-wider font-bold">
                            Utenfor Topp 10
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 print:py-2 print:px-2.5 text-right text-red-700 whitespace-nowrap">
                        -{formatNok(kw.lostClicksMonthly)}
                      </td>
                      <td className="py-3.5 px-3 print:py-2 print:px-2.5 text-right text-brand-dark/70 whitespace-nowrap">
                        {formatNok(kw.cpc)} kr
                      </td>
                      <td className="py-3.5 px-3 print:py-2 print:px-2.5 text-right text-brand-pine whitespace-nowrap">
                        {formatNok(kw.adsValueMonthly)} kr
                      </td>
                      <td className="py-3.5 pl-3 print:py-2 print:pl-2.5 text-right font-semibold text-red-700 whitespace-nowrap">
                        {formatNok(kw.lostRevenueMonthly)} kr/mnd
                      </td>
                    </tr>
                  ))}

                  {/* Summary Row inside tbody (no tfoot so Chromium never repeats it across pages) */}
                  <tr className="border-t-2 border-brand-dark font-body text-fluid-p print:text-[10px] text-brand-dark print:break-inside-avoid">
                    <td className="py-4 pr-3 print:py-2.5 print:pr-2.5 font-heading font-bold">
                      Sum månedlig tap
                    </td>
                    <td className="py-4 px-3 print:py-2.5 print:px-2.5 text-right whitespace-nowrap font-semibold">
                      {formatNok(keywords.reduce((acc, k) => acc + k.volume, 0))}
                    </td>
                    <td className="py-4 px-3 print:py-2.5 print:px-2.5 text-center text-micro print:text-[9px] print:tracking-normal uppercase tracking-wider text-brand-blue whitespace-nowrap">
                      Mål: #1
                    </td>
                    <td className="py-4 px-3 print:py-2.5 print:px-2.5 text-center text-micro print:text-[9px] print:tracking-normal uppercase tracking-wider text-brand-blue whitespace-nowrap">
                      Mål: #1
                    </td>
                    <td className="py-4 px-3 print:py-2.5 print:px-2.5 text-right font-semibold text-red-700 whitespace-nowrap">
                      -{formatNok(monthlyClicksLost)}
                    </td>
                    <td className="py-4 px-3 print:py-2.5 print:px-2.5 text-right text-brand-blue whitespace-nowrap">
                      —
                    </td>
                    <td className="py-4 px-3 print:py-2.5 print:px-2.5 text-right font-semibold text-brand-pine whitespace-nowrap">
                      {formatNok(data.adsValue)} kr/mnd
                    </td>
                    <td className="py-4 pl-3 print:py-2.5 print:pl-2.5 text-right font-heading text-fluid-h4 print:text-[11px] font-bold text-red-700 whitespace-nowrap">
                      {formatNok(data.nokEstimate)} kr/mnd
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Top 3 Competitors Comparison Bar */}
          {data.competitors && data.competitors.length > 0 && (
            <div className="bg-brand-sand rounded-sm p-6 sm:p-8 border-l-[4px] border-l-brand-pine flex flex-col gap-5 print:break-inside-avoid">
              <div className="flex flex-col gap-2">
                <h3 className="font-heading text-fluid-h3 text-brand-dark leading-tight m-0">
                  De 3 største lokale konkurrentene som tar denne trafikken i dag
                </h3>
                <p className="font-body text-fluid-p text-brand-dark/90 m-0">
                  Disse virksomhetene eier Topp 3 i Google Kartpakken (Local Pack) på deres viktigste søkeord:
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 print:grid-cols-3 gap-4 sm:gap-5">
                {data.competitors.map((comp, idx) => (
                  <div
                    key={comp.placesId || idx}
                    className="bg-brand-light rounded-sm p-5 border border-brand-dark/10 flex flex-col justify-between gap-4 min-w-0"
                  >
                    <div className="flex flex-col gap-2 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="px-2 py-0.5 rounded-sm bg-brand-dark text-brand-accent text-micro print:tracking-normal uppercase tracking-wider font-bold">
                          Kartpakke #{idx + 1}
                        </span>
                        {comp.lightScore && (
                          <span className="text-micro print:tracking-normal uppercase tracking-wider font-bold text-brand-pine">
                            Score: {comp.lightScore}/100
                          </span>
                        )}
                      </div>
                      <p className="font-heading text-fluid-h4 font-bold text-brand-dark m-0 break-words">
                        {comp.name}
                      </p>
                      {comp.domain && (
                        <p className="text-micro print:tracking-normal text-brand-blue font-mono m-0 break-all">
                          {comp.domain}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-brand-dark/10 text-micro print:tracking-normal text-brand-blue">
                      <span>⭐ {comp.rating ?? 4.8} stjerner</span>
                      <span className="font-bold text-brand-dark">
                        {comp.reviewCount ?? 250} anmeldelser
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!data.isUnlocked && !isPdfMode && (
            <div
              data-web-chrome="true"
              className="bg-brand-dark text-brand-light rounded-sm p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex flex-col gap-1.5">
                <p className="font-heading text-fluid-h4 text-brand-light m-0">
                  Vil dere se nøyaktig hvordan dere tar tilbake {formatNok(data.nokEstimate)} kr/mnd fra konkurrentene?
                </p>
                <p className="font-body text-fluid-p text-brand-light/85 m-0">
                  Lås opp alle {measuredTotalCount} tekniske målepunkter, bevis og steg-for-steg oppskrift for {data.business.name}.
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenUnlockModal}
                className="w-full sm:w-auto inline-flex flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5 px-6 py-3 rounded-[3px] bg-brand-rust hover:bg-brand-accent text-brand-dark font-heading font-bold text-micro uppercase tracking-wider shrink-0 transition cursor-pointer text-center"
              >
                <span className="whitespace-nowrap">Lås opp hele rapporten</span>
                <span className="whitespace-nowrap">(1 490 kr eks. mva.) →</span>
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
