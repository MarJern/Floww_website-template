'use client';

import React from 'react';
import type { GeoGridPoint, AiQuestionOverviewItem } from './types';

interface GeoGridSectionProps {
  businessName: string;
  city: string | null;
  geoGrid: {
    centerLat: number;
    centerLng: number;
    radiusKm: number;
    points: GeoGridPoint[];
    averageMapRank: number;
  };
}

export function ReportGeoGrid({ businessName, city, geoGrid }: GeoGridSectionProps) {
  return (
    <div className="mt-8 pt-6 border-t border-brand-dark/10 flex flex-col gap-5 print:break-inside-avoid">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-micro uppercase tracking-widest font-bold text-brand-pine block">
            3×3 Geo-Grid Kartmåling (Radius {geoGrid.radiusKm} km rundt virksomheten)
          </span>
          <h3 className="font-heading text-fluid-h4 text-brand-dark leading-snug m-0">
            Slik rangerer {businessName} i Google Maps fra ulike nærområder (Snittposisjon: #
            {geoGrid.averageMapRank})
          </h3>
        </div>
        <span className="text-micro text-brand-dark/80 font-medium">
          Grønn = Topp 3 (Kartpakken) · Mørk = Utenfor Topp 3 (Usynlig uten klikk)
        </span>
      </div>

      <div className="grid grid-cols-3 print:grid-cols-3 gap-2 sm:gap-3 max-w-2xl">
        {geoGrid.points.map((pt) => {
          const isTop3 = pt.mapRank !== null && pt.mapRank <= 3;
          return (
            <div
              key={pt.id}
              className={`rounded-sm p-2.5 sm:p-4 border text-center flex flex-col items-center justify-center gap-1 ${
                isTop3
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-500 print:bg-emerald-50 print:text-emerald-900 print:border-emerald-500'
                  : 'bg-brand-dark text-brand-light border-brand-dark print:bg-brand-dark print:text-brand-light print:border-brand-dark'
              }`}
            >
              <span className="text-micro print:tracking-normal font-bold block opacity-85">
                {pt.label}
              </span>
              <span className="font-heading text-fluid-h3 font-bold block">
                #{pt.mapRank ?? '10+'}
              </span>
              <span
                className={`text-micro print:tracking-normal font-bold uppercase tracking-widest ${
                  isTop3 ? 'text-emerald-700 print:text-emerald-700' : 'text-brand-rust print:text-brand-rust'
                }`}
              >
                {isTop3 ? 'Topp 3 i kartet' : 'Taper klikkene'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface AiMatrixSectionProps {
  businessName: string;
  isUnlocked: boolean;
  aiQuestions: AiQuestionOverviewItem[];
  onOpenUnlockModal: () => void;
}

export function ReportAiMatrix({
  businessName,
  isUnlocked,
  aiQuestions,
  onOpenUnlockModal,
}: AiMatrixSectionProps) {
  if (aiQuestions.length === 0) return null;

  return (
    <div className="mt-8 pt-6 border-t border-brand-dark/10 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div className="flex flex-col gap-2">
          <span className="text-micro print:tracking-normal uppercase tracking-widest font-bold text-brand-pine block">
            Måleprotokoll: 10 bransjespørsmål stilt til ChatGPT, Gemini, Claude & Perplexity
          </span>
          <h3 className="font-heading text-fluid-h4 text-brand-dark leading-snug m-0">
            Resultat fra AI-søk: {businessName} ble kun anbefalt i{' '}
            {aiQuestions.filter((q) => q.mentioned).length} av {aiQuestions.length} kundespørsmål
          </h3>
        </div>
        {!isUnlocked && (
          <button
            type="button"
            onClick={onOpenUnlockModal}
            data-web-chrome="true"
            className="text-micro uppercase tracking-wider font-heading font-bold text-brand-pine underline hover:text-brand-dark cursor-pointer self-start sm:self-auto"
          >
            Lås opp eksakte AI-svar og konkurrentsitater →
          </button>
        )}
      </div>

      <div className="overflow-x-auto print:overflow-visible rounded-sm border border-brand-dark/15">
        <table className="w-full text-left border-collapse font-body text-fluid-p print:text-[10px] print:leading-snug">
          <thead className="bg-brand-dark text-brand-light print:bg-brand-dark print:text-brand-light">
            <tr className="bg-brand-dark text-brand-light print:bg-brand-dark print:text-brand-light text-micro print:text-[9px] print:tracking-normal uppercase tracking-wider">
              <th className="bg-brand-dark text-brand-light print:bg-brand-dark print:text-brand-light py-3 px-3.5 print:py-2 print:px-2 font-bold">
                #
              </th>
              <th className="bg-brand-dark text-brand-light print:bg-brand-dark print:text-brand-light py-3 px-3.5 print:py-2 print:px-2 font-bold">
                Spørsmål stilt til AI
              </th>
              <th className="bg-brand-dark text-brand-light print:bg-brand-dark print:text-brand-light py-3 px-3.5 print:py-2 print:px-2 font-bold text-center">
                ChatGPT
              </th>
              <th className="bg-brand-dark text-brand-light print:bg-brand-dark print:text-brand-light py-3 px-3.5 print:py-2 print:px-2 font-bold text-center">
                Gemini
              </th>
              <th className="bg-brand-dark text-brand-light print:bg-brand-dark print:text-brand-light py-3 px-3.5 print:py-2 print:px-2 font-bold text-center">
                Claude
              </th>
              <th className="bg-brand-dark text-brand-light print:bg-brand-dark print:text-brand-light py-3 px-3.5 print:py-2 print:px-2 font-bold text-center">
                Perplexity
              </th>
              <th className="bg-brand-dark text-brand-light print:bg-brand-dark print:text-brand-light py-3 px-3.5 print:py-2 print:px-2 font-bold">
                AI-svar & Hvem som anbefales
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-dark/10 bg-brand-light">
            {aiQuestions.map((q) => (
              <tr key={q.id} className="hover:bg-brand-sand/40 print:break-inside-avoid">
                <td className="py-3 px-3.5 print:py-2 print:px-2 font-mono text-micro print:text-[10px] font-bold text-brand-blue">
                  {q.id}
                </td>
                <td className="py-3 px-3.5 print:py-2 print:px-2">
                  <span className="text-micro print:text-[9px] print:tracking-normal font-bold uppercase tracking-widest text-brand-blue block">
                    {q.category}
                  </span>
                  <span className="font-body text-fluid-p print:text-[10px] font-bold text-brand-dark">
                    «{q.prompt}»
                  </span>
                </td>
                <td className="py-3 px-3.5 print:py-2 print:px-1.5 text-center whitespace-nowrap">
                  {q.models.chatgpt ? (
                    <span className="inline-flex px-2 py-0.5 print:px-1.5 print:py-0.5 rounded-sm bg-emerald-50 text-emerald-700 border border-emerald-200 text-micro print:text-[9px] print:tracking-normal uppercase tracking-wider font-bold">
                      Nevnt {q.position ? `(#${q.position})` : ''}
                    </span>
                  ) : (
                    <span className="inline-flex px-2 py-0.5 print:px-1.5 print:py-0.5 rounded-sm bg-red-50 text-red-700 border border-red-200 text-micro print:text-[9px] print:tracking-normal uppercase tracking-wider font-bold">
                      Utelatt
                    </span>
                  )}
                </td>
                <td className="py-3 px-3.5 print:py-2 print:px-1.5 text-center whitespace-nowrap">
                  {q.models.gemini ? (
                    <span className="inline-flex px-2 py-0.5 print:px-1.5 print:py-0.5 rounded-sm bg-emerald-50 text-emerald-700 border border-emerald-200 text-micro print:text-[9px] print:tracking-normal uppercase tracking-wider font-bold">
                      Nevnt
                    </span>
                  ) : (
                    <span className="inline-flex px-2 py-0.5 print:px-1.5 print:py-0.5 rounded-sm bg-red-50 text-red-700 border border-red-200 text-micro print:text-[9px] print:tracking-normal uppercase tracking-wider font-bold">
                      Utelatt
                    </span>
                  )}
                </td>
                <td className="py-3 px-3.5 print:py-2 print:px-1.5 text-center whitespace-nowrap">
                  {q.models.claude ? (
                    <span className="inline-flex px-2 py-0.5 print:px-1.5 print:py-0.5 rounded-sm bg-emerald-50 text-emerald-700 border border-emerald-200 text-micro print:text-[9px] print:tracking-normal uppercase tracking-wider font-bold">
                      Nevnt
                    </span>
                  ) : (
                    <span className="inline-flex px-2 py-0.5 print:px-1.5 print:py-0.5 rounded-sm bg-red-50 text-red-700 border border-red-200 text-micro print:text-[9px] print:tracking-normal uppercase tracking-wider font-bold">
                      Utelatt
                    </span>
                  )}
                </td>
                <td className="py-3 px-3.5 print:py-2 print:px-1.5 text-center whitespace-nowrap">
                  {q.models.perplexity ? (
                    <span className="inline-flex px-2 py-0.5 print:px-1.5 print:py-0.5 rounded-sm bg-emerald-50 text-emerald-700 border border-emerald-200 text-micro print:text-[9px] print:tracking-normal uppercase tracking-wider font-bold">
                      Nevnt
                    </span>
                  ) : (
                    <span className="inline-flex px-2 py-0.5 print:px-1.5 print:py-0.5 rounded-sm bg-red-50 text-red-700 border border-red-200 text-micro print:text-[9px] print:tracking-normal uppercase tracking-wider font-bold">
                      Utelatt
                    </span>
                  )}
                </td>
                <td className="py-3 px-3.5 print:py-2 print:px-2 max-w-xs print:max-w-none">
                  {isUnlocked && q.responseSnippet ? (
                    <div className="flex flex-col gap-1">
                      <p className="font-body text-fluid-p print:text-[10px] text-brand-dark/90 m-0">
                        {q.responseSnippet}
                      </p>
                      {q.othersMentioned && q.othersMentioned.length > 0 && (
                        <p className="text-micro print:text-[9px] print:tracking-normal font-bold text-brand-pine m-0">
                          Anbefalte konkurrenter: {q.othersMentioned.join(', ')}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div
                      aria-hidden="true"
                      className="select-none blur-[5px] pointer-events-none font-body text-fluid-p print:text-[10px] text-brand-dark/70"
                    >
                      AI-modellen trekker frem 3 lokale konkurrenter basert på anmeldelser og
                      fagsider. Lås opp for å se svaret.
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
