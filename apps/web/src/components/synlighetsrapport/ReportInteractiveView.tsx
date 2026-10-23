'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  type ReportApiResponse,
  type TeaserFindingItem,
  type UnredactedFindingItem,
  PART_SECTIONS,
  getScoreColor,
} from './types';
import ReportExecutiveHero from './ReportExecutiveHero';
import { ReportGeoGrid, ReportAiMatrix } from './ReportGeoGridAndAiMatrix';
import ReportFindingCard from './ReportFindingCard';
import ReportActionPlanTable from './ReportActionPlanTable';
import ReportCheckoutModalAndStickyBar from './ReportCheckoutModalAndStickyBar';

interface ReportInteractiveViewProps {
  slug: string;
  sessionIdParam?: string;
  justUnlockedParam?: boolean;
  isPdfMode?: boolean;
}

export default function ReportInteractiveView({
  slug,
  sessionIdParam = '',
  justUnlockedParam = false,
  isPdfMode = false,
}: ReportInteractiveViewProps) {
  const [data, setData] = useState<ReportApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'crit' | 'warn' | 'ok'>('all');
  const [activePartJump, setActivePartJump] = useState<number | null>(null);
  const [showUnlockModal, setShowUnlockModal] = useState(false);

  const effectivePdfMode = Boolean(isPdfMode && data?.isUnlocked);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (effectivePdfMode) {
        document.body.classList.add('pdf-export-mode');
      } else {
        document.body.classList.remove('pdf-export-mode');
      }
      return () => {
        document.body.classList.remove('pdf-export-mode');
      };
    }
  }, [effectivePdfMode]);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      effectivePdfMode &&
      !loading &&
      data
    ) {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autoprint') === '1') {
        const timer = window.setTimeout(() => {
          window.print();
        }, 450);
        return () => window.clearTimeout(timer);
      }
    }
  }, [effectivePdfMode, loading, data]);

  const scrollToSection = (sectionId: string, part: number | null = null) => {
    setActivePartJump(part);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    if (!slug) return;
    let isMounted = true;

    async function loadReport() {
      setLoading(true);
      setError(null);
      try {
        const query = sessionIdParam
          ? `?session_id=${encodeURIComponent(sessionIdParam)}`
          : '';
        const res = await fetch(
          `/api/seo-analyse/report/${encodeURIComponent(slug)}${query}`,
          {
            cache: 'no-store',
            signal: AbortSignal.timeout(15000),
          }
        );
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.error || 'Kunne ikke hente rapporten.');
        }
        if (isMounted) {
          setData(json as ReportApiResponse);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err?.message || 'Kunne ikke laste rapporten.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadReport();
    return () => {
      isMounted = false;
    };
  }, [slug, justUnlockedParam, sessionIdParam]);

  const displayFindings: Array<TeaserFindingItem | UnredactedFindingItem> = useMemo(() => {
    if (!data) return [];
    const list =
      data.isUnlocked && data.report?.findings
        ? data.report.findings
        : data.teaserFindings || [];
    return list.filter((f) => f.status !== 'na');
  }, [data]);

  const filteredFindings = useMemo(() => {
    return displayFindings.filter((f) => {
      if (statusFilter !== 'all' && f.status !== statusFilter) return false;
      return true;
    });
  }, [displayFindings, statusFilter]);

  const findingsByPart = useMemo(() => {
    const map = new Map<number, Array<TeaserFindingItem | UnredactedFindingItem>>();
    for (const part of [1, 2, 3, 4]) {
      map.set(part, []);
    }
    for (const f of filteredFindings) {
      if (f.part >= 1 && f.part <= 4) {
        const list = map.get(f.part) || [];
        list.push(f);
        map.set(f.part, list);
      }
    }
    const order: Record<string, number> = { crit: 0, warn: 1, ok: 2, na: 3 };
    for (const [k, list] of map.entries()) {
      list.sort((a, b) => (order[a.status] ?? 9) - (order[b.status] ?? 9));
      map.set(k, list);
    }
    return map;
  }, [filteredFindings]);

  const priorityActionFindings = useMemo(() => {
    return displayFindings
      .filter((f) => f.status === 'crit' || f.status === 'warn')
      .sort((a, b) => {
        if (a.status !== b.status) return a.status === 'crit' ? -1 : 1;
        return a.part - b.part;
      });
  }, [displayFindings]);

  if (loading) {
    return (
      <section className="w-full bg-brand-light py-[clamp(4rem,8vw,6rem)]">
        <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8">
          <div className="max-w-md mx-auto bg-brand-sand rounded-sm border border-brand-dark/15 p-8 text-center">
            <div className="w-10 h-10 rounded-full border-3 border-brand-pine border-t-transparent animate-spin mx-auto mb-4" />
            <h1 className="font-heading text-fluid-h3 text-brand-dark m-0">
              Laster Synlighetsrapporten...
            </h1>
            <p className="font-body text-fluid-p text-brand-dark/90 mt-2 mb-0">
              Henter måledata, økonomisk tapsmodell og konkurrentanalyse
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="w-full bg-brand-light py-[clamp(4rem,8vw,6rem)]">
        <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8">
          <div className="max-w-lg mx-auto bg-brand-sand rounded-sm border-t-[4px] border-t-brand-rust border border-brand-dark/15 p-8 text-center">
            <div className="w-12 h-12 rounded-sm bg-brand-dark text-brand-rust flex items-center justify-center mx-auto mb-4 font-heading font-bold text-fluid-h3">
              !
            </div>
            <h1 className="font-heading text-fluid-h3 text-brand-dark mb-2">
              Fant ikke rapporten
            </h1>
            <p className="font-body text-fluid-p text-brand-dark/90 mb-6 mx-auto">
              {error || 'Rapporten finnes ikke eller har utløpt.'}
            </p>
            <Link
              href="/seo-analyse"
              className="inline-flex items-center justify-center px-6 py-3 rounded-[3px] bg-brand-rust hover:bg-brand-accent text-brand-dark text-micro font-heading uppercase tracking-wider font-bold transition"
            >
              Kjør ny analyse →
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const totalActionableErrors = data.findingCounts.crit + data.findingCounts.warn;
  const measuredTotalCount =
    displayFindings.length ||
    data.findingCounts.crit + data.findingCounts.warn + data.findingCounts.ok;
  const aiQuestions = data.aiOverview?.questions ?? [];

  return (
    <div className="w-full bg-brand-light print:!bg-white text-brand-dark pb-36 print:pb-0">
      {/* 1. EXECUTIVE SUMMARY, FINANCIAL LOSS & KEYWORD TABLE */}
      <ReportExecutiveHero
        data={data}
        measuredTotalCount={measuredTotalCount}
        onOpenUnlockModal={() => setShowUnlockModal(true)}
        isPdfMode={effectivePdfMode}
      />

      {/* 2. EDGE-TO-EDGE TWO-ROW CHAPTER JUMP & STATUS FILTER BAR (Hidden in PDF) */}
      <section
        data-web-chrome="true"
        aria-label="Naviger mellom kapitler og filtrer målepunkter i rapporten"
        className={`${
          effectivePdfMode ? 'hidden' : data.isUnlocked ? 'print:hidden' : ''
        } w-full bg-brand-sand border-b border-brand-dark/10 py-5`}
      >
        <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8 flex flex-col gap-3">
          {/* Row 1: Chapter Smooth-Scroll Navigation Buttons (Never hides/unmounts sections) */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              aria-pressed={activePartJump === null}
              onClick={() => scrollToSection('del-1', null)}
              className={`px-4 py-2 rounded-[3px] text-micro font-heading font-bold uppercase tracking-wider border transition cursor-pointer ${
                activePartJump === null
                  ? 'bg-brand-dark text-white border-brand-dark hover:bg-brand-pine'
                  : 'bg-brand-light text-brand-dark border-brand-dark/15 hover:bg-brand-dark hover:text-white'
              }`}
            >
              Alle kapitler ({displayFindings.length})
            </button>
            {PART_SECTIONS.map((sec) => {
              const isSelected = activePartJump === sec.part;
              return (
                <button
                  key={sec.part}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => scrollToSection(`del-${sec.part}`, sec.part)}
                  className={`px-4 py-2 rounded-[3px] text-micro font-heading font-bold uppercase tracking-wider border transition cursor-pointer ${
                    isSelected
                      ? 'bg-brand-dark text-white border-brand-dark hover:bg-brand-pine'
                      : 'bg-brand-light text-brand-dark border-brand-dark/15 hover:bg-brand-dark hover:text-white'
                  }`}
                >
                  Del {sec.part}: {sec.title.split('(')[0].trim()}
                </button>
              );
            })}
          </div>

          {/* Row 2: Traffic-Light Severity Status Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              aria-pressed={statusFilter === 'all'}
              onClick={() => setStatusFilter('all')}
              className={`px-3.5 py-1.5 rounded-[3px] text-micro font-heading font-bold uppercase tracking-wider border transition cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-brand-dark text-white border-brand-dark'
                  : 'bg-brand-light text-brand-dark border-brand-dark/15 hover:bg-brand-dark/10'
              }`}
            >
              Alle ({displayFindings.length})
            </button>
            <button
              type="button"
              aria-pressed={statusFilter === 'crit'}
              onClick={() => setStatusFilter('crit')}
              className={`px-3.5 py-1.5 rounded-[3px] text-micro font-heading font-bold uppercase tracking-wider border transition cursor-pointer ${
                statusFilter === 'crit'
                  ? 'bg-red-700 text-white border-red-700'
                  : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
              }`}
            >
              Kritiske feil ({data.findingCounts.crit})
            </button>
            <button
              type="button"
              aria-pressed={statusFilter === 'warn'}
              onClick={() => setStatusFilter('warn')}
              className={`px-3.5 py-1.5 rounded-[3px] text-micro font-heading font-bold uppercase tracking-wider border transition cursor-pointer ${
                statusFilter === 'warn'
                  ? 'bg-amber-600 text-white border-amber-600'
                  : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
              }`}
            >
              Advarsler ({data.findingCounts.warn})
            </button>
            <button
              type="button"
              aria-pressed={statusFilter === 'ok'}
              onClick={() => setStatusFilter('ok')}
              className={`px-3.5 py-1.5 rounded-[3px] text-micro font-heading font-bold uppercase tracking-wider border transition cursor-pointer ${
                statusFilter === 'ok'
                  ? 'bg-emerald-700 text-white border-emerald-700'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              Godkjent ({data.findingCounts.ok})
            </button>
          </div>
        </div>
      </section>

      {/* 3. DEL 1 - DEL 4: EDGE-TO-EDGE ALTERNATING CONSULTANT SECTIONS (ALL MOUNTED) */}
      {PART_SECTIONS.map((sec) => {
        const partFindings = findingsByPart.get(sec.part) || [];
        const partScore =
          sec.part === 1
            ? data.scoresByPart.part1
            : sec.part === 2
              ? data.scoresByPart.part2
              : sec.part === 3
                ? data.scoresByPart.part3
                : data.scoresByPart.part4;
        const partColors = getScoreColor(partScore);
        const critInPart = partFindings.filter((f) => f.status === 'crit').length;
        const warnInPart = partFindings.filter((f) => f.status === 'warn').length;
        const okInPart = partFindings.filter((f) => f.status === 'ok').length;
        const isSandSection = sec.part % 2 === 1;

        return (
          <section
            key={sec.part}
            id={`del-${sec.part}`}
            aria-labelledby={`heading-del-${sec.part}`}
            className={`scroll-mt-24 w-full py-[clamp(2.5rem,6vw,5rem)] print:py-6 print:bg-white border-b border-brand-dark/10 ${
              isSandSection ? 'bg-brand-sand' : 'bg-brand-light'
            }`}
          >
            <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8 flex flex-col gap-8">
              {/* Open Section Header (No Box-in-a-Box) */}
              <div className="pb-6 border-b border-brand-dark/15">
                <div className="flex flex-col lg:flex-row print:flex-row lg:items-start print:items-start justify-between gap-6 print:break-inside-avoid">
                  <div className="flex flex-col gap-3 max-w-3xl print:max-w-[72%]">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mb-1">
                      <span className="px-3 py-1 rounded-sm bg-brand-dark text-brand-accent text-micro print:tracking-normal font-bold uppercase tracking-widest">
                        {sec.code}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-micro print:tracking-normal uppercase tracking-wider font-bold text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-sm">
                        <span className="w-2 h-2 rounded-full bg-red-600" />
                        {critInPart} kritiske feil
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-micro print:tracking-normal uppercase tracking-wider font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-sm">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        {warnInPart} advarsler
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-micro print:tracking-normal uppercase tracking-wider font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-sm">
                        <span className="w-2 h-2 rounded-full bg-emerald-600" />
                        {okInPart} godkjent
                      </span>
                    </div>
                    <p className="text-micro print:tracking-normal uppercase tracking-wider font-bold text-brand-pine leading-relaxed m-0">
                      {sec.subtitle}
                    </p>
                    <h2
                      id={`heading-del-${sec.part}`}
                      className="font-heading text-fluid-h2 text-brand-dark leading-[1.15] m-0"
                    >
                      {sec.title}
                    </h2>
                    <p className="font-body text-fluid-p-lg text-brand-dark/90 leading-relaxed m-0 pt-1">
                      {sec.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 print:break-inside-avoid">
                    <div
                      className={`px-5 py-4 rounded-sm border ${partColors.bg} ${partColors.border} text-center min-w-[130px]`}
                    >
                      <span className="text-micro print:tracking-normal uppercase tracking-widest font-bold text-brand-blue block">
                        Kapittelscore
                      </span>
                      <span className={`font-heading text-fluid-h2 font-bold ${partColors.text}`}>
                        {Math.round(partScore)}
                        <span className="font-heading text-fluid-h4 text-brand-blue font-bold">
                          /100
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* DEL 1 EXTRA: 3x3 Geo-Grid Map Visualization */}
                {sec.part === 1 && data.geoGrid && Array.isArray(data.geoGrid.points) && (
                  <ReportGeoGrid
                    businessName={data.business.name}
                    city={data.business.city}
                    geoGrid={data.geoGrid}
                  />
                )}

                {/* DEL 3 EXTRA: The 10 AI Questions Overview Table */}
                {sec.part === 3 && aiQuestions.length > 0 && (
                  <ReportAiMatrix
                    businessName={data.business.name}
                    isUnlocked={data.isUnlocked}
                    aiQuestions={aiQuestions}
                    onOpenUnlockModal={() => setShowUnlockModal(true)}
                  />
                )}
              </div>

              {/* Finding Cards for this Part */}
              <div className="flex flex-col gap-4">
                {partFindings.map((item) => (
                  <ReportFindingCard
                    key={item.factorCode}
                    item={item}
                    isUnlocked={data.isUnlocked}
                    businessName={data.business.name}
                    domain={data.business.domain}
                    city={data.business.city}
                    naceName={data.business.naceName}
                    onOpenUnlockModal={() => setShowUnlockModal(true)}
                  />
                ))}
              </div>

              {/* Section Inline Conversion Card when Locked */}
              {!data.isUnlocked && !effectivePdfMode && (
                <div
                  data-web-chrome="true"
                  className="bg-brand-dark text-brand-light rounded-sm p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex flex-col gap-1.5">
                    <p className="font-heading text-fluid-h4 text-brand-light m-0">
                      Vil dere se hele den tekniske utredningen og oppskriften for {sec.code}?
                    </p>
                    <p className="font-body text-fluid-p text-brand-light/85 m-0">
                      Lås opp samtlige {measuredTotalCount} sjekkpunkter, konkurrenttall og
                      nedlastbar PDF-handlingsplan på sekundet.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowUnlockModal(true)}
                    className="w-full sm:w-auto inline-flex flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5 px-6 py-3 rounded-[3px] bg-brand-rust hover:bg-brand-accent text-brand-dark font-heading font-bold text-micro uppercase tracking-wider shrink-0 transition cursor-pointer text-center"
                  >
                    <span className="whitespace-nowrap">Lås opp hele rapporten</span>
                    <span className="whitespace-nowrap">(1 490 kr eks. mva.) →</span>
                  </button>
                </div>
              )}
            </div>
          </section>
        );
      })}

      {/* 4. DEL 5: EDGE-TO-EDGE PRIORITERT HANDLINGSPLAN */}
      <ReportActionPlanTable
        priorityActionFindings={priorityActionFindings}
        totalActionableErrors={totalActionableErrors}
        critCount={data.findingCounts.crit}
        warnCount={data.findingCounts.warn}
        nokEstimate={data.nokEstimate}
        isUnlocked={data.isUnlocked}
        businessName={data.business.name}
        city={data.business.city}
        onOpenUnlockModal={() => setShowUnlockModal(true)}
      />

      {/* 5. STICKY BOTTOM BAR & B2B CHECKOUT MODAL (Hidden in Print / PDF) */}
      {!effectivePdfMode && (
        <ReportCheckoutModalAndStickyBar
          slug={data.slug}
          isUnlocked={data.isUnlocked}
          businessName={data.business.name}
          domain={data.business.domain}
          critCount={data.findingCounts.crit}
          warnCount={data.findingCounts.warn}
          totalCount={measuredTotalCount}
          nokEstimate={data.nokEstimate}
          showUnlockModal={showUnlockModal}
          onOpenUnlockModal={() => setShowUnlockModal(true)}
          onCloseUnlockModal={() => setShowUnlockModal(false)}
        />
      )}
    </div>
  );
}
