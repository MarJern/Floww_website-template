'use client';

import React from 'react';
import {
  type TeaserFindingItem,
  type UnredactedFindingItem,
  getStatusBadge,
  getVisibleProblemIndicator,
  getUnlockedConsultantDetails,
} from './types';

interface ReportFindingCardProps {
  item: TeaserFindingItem | UnredactedFindingItem;
  isUnlocked: boolean;
  businessName: string;
  domain: string;
  city: string | null;
  naceName: string | null;
  onOpenUnlockModal: () => void;
}

export default function ReportFindingCard({
  item,
  isUnlocked,
  businessName,
  domain,
  city,
  naceName,
  onOpenUnlockModal,
}: ReportFindingCardProps) {
  const badge = getStatusBadge(item.status);
  const visibleProblem = getVisibleProblemIndicator(item);
  const fullItem = item as UnredactedFindingItem;
  const unlockedDetails = isUnlocked
    ? getUnlockedConsultantDetails(fullItem, businessName, city || 'Oslo')
    : null;

  return (
    <article
      className={`print:break-inside-avoid bg-white print:bg-white rounded-sm border transition overflow-hidden ${
        item.status === 'crit'
          ? 'border-red-200 border-l-[4px] border-l-red-600 shadow-2xs'
          : item.status === 'warn'
            ? 'border-amber-200 border-l-[4px] border-l-amber-500 shadow-2xs'
            : 'border-emerald-200 border-l-[4px] border-l-emerald-600'
      }`}
    >
      {/* TOP OF CARD: ALWAYS VISIBLE (Heading + Status Badge + 1-sentence Problem Indicator) */}
      <div className="p-5 sm:p-6 bg-white print:bg-white border-b border-brand-dark/10">
        <div className="flex flex-wrap items-start justify-between gap-3 sm:gap-4">
          <div className="min-w-0 flex-1 flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="font-mono text-micro print:tracking-normal uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-sm bg-brand-dark text-brand-light print:bg-brand-dark print:text-brand-light">
                {item.factorCode}
              </span>
              <span className="text-micro print:tracking-normal uppercase tracking-widest font-bold text-brand-blue">
                {item.groupName}
              </span>
            </div>
            <h3 className="font-heading text-fluid-h4 text-brand-dark leading-snug m-0">
              {item.nameNo}
            </h3>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-sm text-micro print:tracking-normal uppercase tracking-wider font-bold border shrink-0 self-start ${badge.bg} ${badge.text} ${badge.border}`}
          >
            <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
            {badge.label}
          </span>
        </div>

        {/* Visible Problem Statement (Unblurred) */}
        <div
          className={`mt-4 mb-4 p-4 rounded-sm border font-body text-fluid-p leading-relaxed ${
            item.status === 'crit'
              ? 'bg-red-50/70 print:bg-red-50/70 border-red-200 text-red-950'
              : item.status === 'warn'
                ? 'bg-amber-50/70 print:bg-amber-50/70 border-amber-200 text-amber-950'
                : 'bg-emerald-50/70 print:bg-emerald-50/70 border-emerald-200 text-emerald-950'
          }`}
        >
          <strong className="font-bold">Status & Konsekvens: </strong>
          {visibleProblem}
        </div>
      </div>

      {/* BOTTOM OF CARD: UTREDNING, KONKURRENTGAP & LØSNINGSOPPSKRIFT */}
      {isUnlocked && unlockedDetails ? (
        /* UNLOCKED STATE: Real consultant elaboration, evidence, competitor values, and step-by-step fix */
        <div className="p-5 sm:p-6 bg-white print:bg-white flex flex-col gap-4 font-body text-fluid-p">
          <div className="grid grid-cols-1 lg:grid-cols-2 print:grid-cols-2 gap-4">
            <div className="bg-brand-sand/50 print:bg-brand-sand/50 rounded-sm p-4 border border-brand-dark/15 flex flex-col gap-2 min-w-0">
              <span className="text-micro print:tracking-normal uppercase tracking-widest font-bold text-brand-pine block break-words">
                1. Teknisk Utredning & Målt Bevis ({domain})
              </span>
              <p className="font-body text-fluid-p text-brand-dark/90 leading-relaxed m-0 break-words">
                {unlockedDetails.utredningText}
              </p>
              {unlockedDetails.thresholdInfo && (
                <p className="text-micro print:tracking-normal font-bold text-brand-blue pt-2 border-t border-brand-dark/10 m-0 break-words">
                  {unlockedDetails.thresholdInfo}
                </p>
              )}
            </div>

            <div className="bg-brand-sand/50 print:bg-brand-sand/50 rounded-sm p-4 border border-brand-dark/15 flex flex-col gap-2 min-w-0">
              <span className="text-micro print:tracking-normal uppercase tracking-widest font-bold text-brand-pine block break-words">
                2. Konkurrentsammenligning (Topp 3 i {city || 'Oslo'})
              </span>
              {fullItem.competitorValues &&
              Object.keys(fullItem.competitorValues).length > 0 ? (
                <div className="flex flex-col gap-2 pt-1">
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(fullItem.competitorValues).map(([compName, compVal]) => (
                      <span
                        key={compName}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-white print:bg-white border border-brand-dark/15 text-micro print:tracking-normal text-brand-dark"
                      >
                        <span className="font-medium text-brand-blue">{compName}:</span>
                        <strong className="font-bold text-brand-dark">{String(compVal)}</strong>
                      </span>
                    ))}
                  </div>
                  <p className="font-body text-fluid-p text-brand-dark/90 m-0 break-words">
                    Konkurrentene i Topp 3 har optimalisert denne faktoren og høster derfor
                    høyere synlighetsvekt hos Google.
                  </p>
                </div>
              ) : (
                <p className="font-body text-fluid-p text-brand-dark/90 leading-relaxed m-0 break-words">
                  Topp 3-aktørene i {city || 'Oslo'} har i snitt 90–100 % oppfyllelse på denne
                  faktoren i vår bransjebenchmark.
                </p>
              )}
            </div>
          </div>

          <div className="bg-brand-dark text-brand-light print:bg-brand-dark print:text-brand-light rounded-sm p-4 sm:p-5 flex flex-col gap-2 min-w-0">
            <span className="text-micro print:tracking-normal uppercase tracking-widest font-bold text-brand-accent print:text-brand-accent block">
              3. Slik optimaliserer og fikser dere dette (Steg-for-steg oppskrift)
            </span>
            <p className="font-body text-fluid-p text-brand-light/90 print:text-brand-light/90 whitespace-pre-line leading-relaxed m-0 break-words">
              {unlockedDetails.actionSteps}
            </p>
          </div>
        </div>
      ) : (
        /* LOCKED STATE: Compact collapsed blurred preview with identical 3-box structure + Clearly visible CTA */
        <div className="p-4 sm:p-5 bg-white print:bg-white flex flex-col gap-3">
          {/* Collapsed blurred content container with strict max-height */}
          <div className="max-h-40 sm:max-h-52 overflow-hidden relative rounded-sm">
            <div
              aria-hidden="true"
              className="select-none blur-sm pointer-events-none flex flex-col gap-3 font-body text-fluid-p"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <div className="bg-brand-sand/50 print:bg-brand-sand/50 rounded-sm p-3.5 border border-brand-dark/15 flex flex-col gap-1.5">
                  <span className="text-micro uppercase tracking-widest font-bold text-brand-pine block">
                    1. Teknisk Utredning & Målt Bevis ({domain})
                  </span>
                  <p className="font-body text-fluid-p text-brand-dark/90 m-0">
                    Detaljert teknisk utredning og eksakt måleverdi fra vår gjennomgang av
                    virksomheten vises her opp mot bransjekravet etter opplåsing.
                  </p>
                </div>

                <div className="bg-brand-sand/50 print:bg-brand-sand/50 rounded-sm p-3.5 border border-brand-dark/15 flex flex-col gap-1.5">
                  <span className="text-micro uppercase tracking-widest font-bold text-brand-pine block">
                    2. Konkurrentsammenligning (Topp 3 i {city || 'Oslo'})
                  </span>
                  <p className="font-body text-fluid-p text-brand-dark/90 m-0">
                    Direkte sammenligning mot de 3 mest synlige konkurrentene i lokalmarkedet og
                    deres målte resultat på denne faktoren.
                  </p>
                </div>
              </div>

              <div className="bg-brand-dark text-brand-light print:bg-brand-dark print:text-brand-light rounded-sm p-3.5 flex flex-col gap-1.5">
                <span className="text-micro uppercase tracking-widest font-bold text-brand-accent print:text-brand-accent block">
                  3. Slik optimaliserer og fikser dere dette (Steg-for-steg oppskrift)
                </span>
                <p className="font-body text-fluid-p text-brand-light/90 m-0">
                  1. Konkret steg-for-steg instruks for hvordan dere retter avviket. 2. Praktisk
                  gjennomføringsplan for å nå full uttelling (100 %).
                </p>
              </div>
            </div>

            {/* Subtle bottom gradient fade inside the collapsed blurred container */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white via-white/80 to-transparent"
            />
          </div>

          {/* Unclipped, clearly visible Lock CTA Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="w-8 h-8 rounded-sm bg-brand-dark text-brand-accent flex items-center justify-center shrink-0 text-micro"
              >
                🔒
              </span>
              <p className="font-heading text-fluid-p font-bold text-brand-dark m-0">
                Utredning, konkurrenttall og løsningsoppskrift for {item.factorCode} er låst
              </p>
            </div>

            <button
              type="button"
              onClick={onOpenUnlockModal}
              className="w-full sm:w-auto inline-flex flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5 px-4 py-2.5 rounded-[3px] bg-brand-rust hover:bg-brand-accent text-brand-dark text-micro font-heading uppercase tracking-wider font-bold shrink-0 shadow-xs transition cursor-pointer text-center"
            >
              <span className="sm:whitespace-nowrap">Lås opp utredning og løsning</span>
              <span className="whitespace-nowrap">(1 490 kr eks. mva.) →</span>
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
