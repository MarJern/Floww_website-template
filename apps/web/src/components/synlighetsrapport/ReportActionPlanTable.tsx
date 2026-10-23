'use client';

import React from 'react';
import {
  type TeaserFindingItem,
  type UnredactedFindingItem,
  formatNok,
  getStatusBadge,
  getVisibleProblemIndicator,
  getUnlockedConsultantDetails,
} from './types';

interface ReportActionPlanTableProps {
  priorityActionFindings: Array<TeaserFindingItem | UnredactedFindingItem>;
  totalActionableErrors: number;
  critCount: number;
  warnCount: number;
  nokEstimate: number;
  isUnlocked: boolean;
  businessName: string;
  city: string | null;
  onOpenUnlockModal: () => void;
}

export default function ReportActionPlanTable({
  priorityActionFindings,
  totalActionableErrors,
  critCount,
  warnCount,
  nokEstimate,
  isUnlocked,
  businessName,
  city,
  onOpenUnlockModal,
}: ReportActionPlanTableProps) {
  return (
    <section
      id="del-5"
      aria-labelledby="heading-del-5"
      className="scroll-mt-24 w-full bg-brand-light print:bg-white text-brand-dark py-[clamp(2.5rem,6vw,5rem)] print:pt-6 print:pb-0"
    >
      <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8 flex flex-col gap-8 print:gap-5">
        <div className="flex flex-col items-start gap-5 pb-6 border-b border-brand-dark/15 print:break-inside-avoid">
          <div className="flex flex-col gap-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mb-1">
              <span className="inline-block px-3 py-1 rounded-sm bg-brand-dark text-brand-accent text-micro print:tracking-normal font-bold uppercase tracking-widest">
                DEL 5 · PRIORITERT HANDLINGSPLAN
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-red-50 text-red-700 border border-red-200 text-micro print:tracking-normal font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-red-600" />
                {critCount} kritiske feil
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-amber-50 text-amber-700 border border-amber-200 text-micro print:tracking-normal font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                {warnCount} advarsler
              </span>
            </div>

            <p className="text-micro print:tracking-normal uppercase tracking-wider font-bold text-brand-pine leading-relaxed m-0">
              Tiltak sortert etter høyest økonomisk effekt og raskest gjennomføringstid
            </p>

            <h2
              id="heading-del-5"
              className="font-heading text-fluid-h2 text-brand-dark leading-[1.15] m-0"
            >
              Prioritert tiltaksliste for å gjenvinne {formatNok(nokEstimate)} kr/mnd
            </h2>

            <p className="font-body text-fluid-p-lg text-brand-dark/90 leading-relaxed m-0 pt-1">
              Alle {totalActionableErrors} avdekkede feil og mangler ({critCount} kritiske og{' '}
              {warnCount} advarsler) sortert etter hvor raskt de løfter synligheten i Google Maps,
              organisk søk og AI-søkemotorer.
            </p>
          </div>

          {!isUnlocked && (
            <button
              type="button"
              onClick={onOpenUnlockModal}
              data-web-chrome="true"
              className="w-full sm:w-auto inline-flex flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5 px-5 py-2.5 rounded-sm bg-brand-rust hover:bg-brand-accent text-brand-dark text-micro font-heading font-bold uppercase tracking-wider transition cursor-pointer shadow-xs text-center"
            >
              <span className="whitespace-nowrap">🔓 Lås opp komplett handlingsplan</span>
              <span className="whitespace-nowrap">(1 490 kr eks. mva.) →</span>
            </button>
          )}
        </div>

        <div className="w-full overflow-x-auto print:overflow-visible rounded-sm border border-brand-dark/15">
          <table className="w-full text-left border-collapse font-body text-fluid-p print:text-[10px] print:leading-snug">
            <thead className="bg-brand-dark text-brand-light print:bg-brand-dark print:text-brand-light">
              <tr className="bg-brand-dark text-brand-light print:bg-brand-dark print:text-brand-light text-micro print:text-[9px] print:tracking-normal uppercase tracking-wider">
                <th className="bg-brand-dark text-brand-light print:bg-brand-dark print:text-brand-light py-3 px-3.5 print:py-2 print:px-2 font-bold align-bottom leading-tight">
                  Prioritet
                </th>
                <th className="bg-brand-dark text-brand-light print:bg-brand-dark print:text-brand-light py-3 px-3.5 print:py-2 print:px-2 font-bold align-bottom leading-tight">
                  Faktor & Område
                </th>
                <th className="bg-brand-dark text-brand-light print:bg-brand-dark print:text-brand-light py-3 px-3.5 print:py-2 print:px-2 font-bold align-bottom leading-tight">
                  Problem som må løses
                </th>
                <th className="bg-brand-dark text-brand-light print:bg-brand-dark print:text-brand-light py-3 px-3.5 print:py-2 print:px-2 font-bold align-bottom leading-tight">
                  Konkret tiltak & Løsning
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-dark/10 bg-brand-light">
              {priorityActionFindings.map((item, idx) => {
                const badge = getStatusBadge(item.status);
                const fullItem = item as UnredactedFindingItem;
                const unlockedDetails = isUnlocked
                  ? getUnlockedConsultantDetails(fullItem, businessName, city || 'Oslo')
                  : null;

                return (
                  <tr
                    key={item.factorCode}
                    className="hover:bg-brand-sand/40 align-top print:break-inside-avoid"
                  >
                    <td className="py-4 px-3.5 print:py-2.5 print:px-2 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 print:px-1.5 print:py-0.5 rounded-sm text-micro print:text-[9px] print:tracking-normal uppercase tracking-wider font-bold border ${badge.bg} ${badge.text} ${badge.border}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                        #{idx + 1} · {badge.label}
                      </span>
                    </td>
                    <td className="py-4 px-3.5 print:py-2.5 print:px-2">
                      <span className="font-mono text-micro print:text-[9px] print:tracking-normal uppercase tracking-wider font-bold text-brand-blue block">
                        {item.factorCode} · Del {item.part} ({item.groupName})
                      </span>
                      {isUnlocked ? (
                        <span className="font-heading text-fluid-h4 print:text-[11px] font-bold text-brand-dark block mt-0.5">
                          {item.nameNo}
                        </span>
                      ) : (
                        <span
                          aria-hidden="true"
                          className="font-heading text-fluid-h4 print:text-[11px] text-brand-dark blur-sm select-none pointer-events-none block mt-0.5"
                        >
                          Skjult målepunkt i dette området
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-3.5 print:py-2.5 print:px-2 font-body text-fluid-p print:text-[10px] text-brand-dark/90 max-w-xs print:max-w-none">
                      {isUnlocked ? (
                        getVisibleProblemIndicator(item)
                      ) : (
                        <span
                          aria-hidden="true"
                          className="blur-sm select-none pointer-events-none block font-body text-fluid-p print:text-[10px] text-brand-dark/70"
                        >
                          Kritisk synlighetsavvik som holder igjen rangeringen og sender lokale
                          kunder til konkurrentene.
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-3.5 print:py-2.5 print:px-2 max-w-md print:max-w-none">
                      {isUnlocked && unlockedDetails ? (
                        <p className="font-body text-fluid-p print:text-[10px] text-brand-dark/90 whitespace-pre-line m-0">
                          {unlockedDetails.actionSteps}
                        </p>
                      ) : (
                        <div className="flex items-center justify-between gap-2">
                          <span
                            aria-hidden="true"
                            className="select-none blur-[5px] pointer-events-none font-body text-fluid-p print:text-[10px] text-brand-dark/70"
                          >
                            Steg-for-steg oppskrift og teknisk implementering for å rette dette
                            avviket.
                          </span>
                          <button
                            type="button"
                            onClick={onOpenUnlockModal}
                            data-web-chrome="true"
                            className="px-3 py-1.5 rounded-sm bg-brand-rust hover:bg-brand-accent text-brand-dark text-micro font-heading font-bold uppercase tracking-wider shrink-0 cursor-pointer transition whitespace-nowrap"
                          >
                            Lås opp
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Bottom Conversion Banner for Del 5 (Always visible on mobile & desktop when locked) */}
        {!isUnlocked && (
          <div
            data-web-chrome="true"
            className="bg-brand-dark text-brand-light rounded-sm p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex flex-col gap-1.5">
              <p className="font-heading text-fluid-h4 text-brand-light m-0">
                Lås opp den komplette, prioriterte handlingsplanen for {businessName}
              </p>
              <p className="font-body text-fluid-p text-brand-light/85 m-0">
                Få umiddelbar tilgang til alle {totalActionableErrors} tiltak ({critCount} kritiske
                feil og {warnCount} advarsler), eksakte konkurrenttall og nedlastbar PDF.
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

        {/* Clean Document Sign-Off Line (Print Only) */}
        <div className="hidden print:flex items-center justify-between pt-4 mt-2 border-t border-brand-dark/20 text-[10px] text-brand-blue">
          <span>Synlighetsrapporten 2026 · Utarbeidet for {businessName}</span>
          <span>Floww AS (Org.nr. 922 758 476 MVA) · kontakt@flowwmedia.no · flowwmedia.no</span>
        </div>
      </div>
    </section>
  );
}
