'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { formatNok } from './types';

interface ReportCheckoutModalAndStickyBarProps {
  slug: string;
  isUnlocked: boolean;
  businessName: string;
  domain: string;
  critCount: number;
  warnCount: number;
  totalCount: number;
  nokEstimate: number;
  showUnlockModal: boolean;
  onOpenUnlockModal: () => void;
  onCloseUnlockModal: () => void;
}

export default function ReportCheckoutModalAndStickyBar({
  slug,
  isUnlocked,
  businessName,
  critCount,
  warnCount,
  totalCount,
  nokEstimate,
  showUnlockModal,
  onOpenUnlockModal,
  onCloseUnlockModal,
}: ReportCheckoutModalAndStickyBarProps) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!showUnlockModal) return;

    const focusTimer = setTimeout(() => {
      submitButtonRef.current?.focus();
    }, 30);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isCheckingOut) {
        onCloseUnlockModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showUnlockModal, isCheckingOut, onCloseUnlockModal]);

  const handleCheckout = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!slug || isCheckingOut) return;

    setIsCheckingOut(true);
    setCheckoutError(null);

    try {
      const response = await fetch('/api/seo-analyse/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
        }),
        signal: AbortSignal.timeout(15000),
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || 'Kunne ikke starte betaling.');
      }

      if (resData.alreadyUnlocked && resData.redirectUrl) {
        window.location.href = resData.redirectUrl;
        return;
      }

      if (resData.checkoutUrl) {
        window.location.href = resData.checkoutUrl;
        return;
      }
    } catch (err: any) {
      setCheckoutError(err?.message || 'Kunne ikke starte utsjekk.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <>
      {/* STICKY BOTTOM CONVERSION BAR (Always visible when locked) */}
      {!isUnlocked && (
        <aside
          data-web-chrome="true"
          data-sticky-conversion-bar="true"
          aria-label="Lås opp hele rapporten"
          className="fixed bottom-0 left-0 right-0 w-full z-40 bg-brand-dark border-t border-brand-light/15 text-brand-light shadow-2xl"
        >
          <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 md:px-8 py-3 lg:py-3.5 flex items-center justify-between gap-3 lg:gap-4">
            <div className="flex items-center gap-3 lg:gap-3.5 min-w-0">
              <div className="hidden lg:flex w-10 h-10 rounded-sm bg-brand-blue border border-brand-accent/40 text-brand-accent items-center justify-center font-heading font-bold text-base shrink-0">
                🔓
              </div>
              <div className="min-w-0">
                {/* Compact Mobile & Tablet Headline (< 1024px) */}
                <p className="block lg:hidden max-w-none font-heading text-xs sm:text-sm font-bold text-brand-light leading-snug m-0">
                  Lås opp <span className="text-brand-rust">{critCount} kritiske feil</span> og{' '}
                  <span className="text-brand-accent">{warnCount} advarsler</span>
                </p>

                {/* Full Desktop Headline & Subtitle (>= 1024px) */}
                <p className="hidden lg:block max-w-none font-heading text-base xl:text-fluid-h4 font-bold text-brand-light leading-snug m-0">
                  Lås opp full teknisk utredning, bevis og steg-for-steg løsning for alle{' '}
                  <span className="text-brand-rust">
                    {critCount} kritiske feil og {warnCount} advarsler
                  </span>
                </p>
                <p className="hidden lg:block max-w-none font-body text-xs xl:text-sm text-brand-light/80 leading-snug m-0 mt-0.5">
                  Inkluderer alle {totalCount} sjekkpunkter, eksakte konkurrenttall og
                  nedlastbar PDF · Engangsbeløp 1 490 kr eks. mva. (12 mnd tilgang)
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenUnlockModal}
              className="inline-flex flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5 px-4 lg:px-6 py-2.5 lg:py-3 rounded-[3px] bg-brand-rust hover:bg-brand-accent text-brand-dark font-heading font-bold text-micro uppercase tracking-wider shrink-0 transition shadow-sm cursor-pointer text-center"
            >
              <span className="whitespace-nowrap">Lås opp</span>
              <span className="whitespace-nowrap lg:hidden">(1 490 kr) →</span>
              <span className="whitespace-nowrap hidden lg:inline">nå (1 490 kr eks. mva.) →</span>
            </button>
          </div>
        </aside>
      )}

      {/* CHECKOUT MODAL — Compact, centered, zero redundant email input */}
      {showUnlockModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="unlock-modal-title"
          data-web-chrome="true"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isCheckingOut) {
              onCloseUnlockModal();
            }
          }}
          className="fixed inset-0 z-50 bg-brand-dark/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto overscroll-contain"
        >
          <div className="bg-brand-light rounded-sm max-w-md w-full max-h-[86dvh] overflow-y-auto overscroll-contain p-5 sm:p-6 border-t-[4px] border-t-brand-accent border border-brand-dark/20 shadow-2xl flex flex-col gap-3.5 my-auto">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-1.5 min-w-0">
                <span className="self-start text-micro uppercase tracking-widest font-bold text-brand-pine bg-brand-sand px-2 py-0.5 rounded-sm">
                  Øyeblikkelig opplåsing · B2B Kvittering
                </span>
                <h2
                  id="unlock-modal-title"
                  className="font-heading text-lg sm:text-xl font-bold text-brand-dark leading-snug m-0 break-words"
                >
                  Lås opp komplett Synlighetsrapport for {businessName}
                </h2>
              </div>
              <button
                type="button"
                onClick={onCloseUnlockModal}
                disabled={isCheckingOut}
                className="text-brand-blue hover:text-brand-dark font-heading text-lg font-bold px-1.5 py-0.5 cursor-pointer shrink-0"
                aria-label="Lukk betalingsvindu"
              >
                ✕
              </button>
            </div>

            <ul className="flex flex-col gap-2 font-body text-sm text-brand-dark/90 bg-brand-sand p-3.5 rounded-sm border border-brand-dark/10 list-none m-0">
              <li className="flex items-start gap-2">
                <span className="text-brand-pine font-bold shrink-0">✓</span>
                <span>
                  Full teknisk utredning og målte bevis på alle{' '}
                  <strong className="text-brand-dark">{totalCount} faktorer</strong>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-pine font-bold shrink-0">✓</span>
                <span>
                  Steg-for-steg oppskrift for å tette synlighetstapet på{' '}
                  <strong className="text-brand-dark">{formatNok(nokEstimate)} kr/mnd</strong>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-pine font-bold shrink-0">✓</span>
                <span>Utskriftsvennlig PDF-rapport og 12 måneders tilgang til lenken</span>
              </li>
            </ul>

            {/* B2B Pricing & 25% Norwegian VAT Summary — Same background as modal (bg-brand-light) */}
            <div className="rounded-sm bg-brand-light text-brand-dark p-3.5 border border-brand-dark/15 flex flex-col gap-1.5 font-body text-sm">
              <div className="flex items-center justify-between text-brand-dark/80">
                <span>Pris eks. mva.:</span>
                <span className="font-bold text-brand-dark">1 490,00 kr</span>
              </div>
              <div className="flex items-center justify-between text-brand-dark/80 gap-2">
                <span>25 % mva. (Floww AS Org.nr. 922 758 476 MVA):</span>
                <span className="font-bold text-brand-dark shrink-0">372,50 kr</span>
              </div>
              <div className="flex items-center justify-between pt-2 mt-0.5 border-t border-brand-dark/15 font-heading text-base font-bold text-brand-pine">
                <span>Totalt å betale:</span>
                <span>1 862,50 kr</span>
              </div>
            </div>

            <form onSubmit={handleCheckout} className="flex flex-col gap-3">
              {checkoutError && (
                <div className="p-2.5 rounded-sm bg-brand-sand border-l-[4px] border-l-brand-rust font-body text-xs text-brand-dark font-medium">
                  {checkoutError}
                </div>
              )}

              <p className="font-body text-xs text-brand-blue leading-relaxed m-0 max-w-none">
                Kvittering m/MVA og PDF-rapport sendes til din registrerte e-postadresse. Ved å gå videre bekrefter du at kjøpet gjelder næringsvirksomhet i henhold til{' '}
                <Link
                  href="/vilkar"
                  target="_blank"
                  className="underline font-semibold text-brand-dark hover:text-brand-pine"
                >
                  Avtalevilkår for bedriftskjøp
                </Link>{' '}
                og vår{' '}
                <Link
                  href="/personvern"
                  target="_blank"
                  className="underline font-semibold text-brand-dark hover:text-brand-pine"
                >
                  Personvernerklæring
                </Link>
                .
              </p>

              <button
                ref={submitButtonRef}
                type="submit"
                disabled={isCheckingOut}
                className="w-full inline-flex flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5 py-3 px-5 rounded-[3px] bg-brand-rust hover:bg-brand-accent disabled:opacity-50 text-brand-dark font-heading font-bold text-micro uppercase tracking-wider transition cursor-pointer shadow-sm text-center"
              >
                {isCheckingOut ? (
                  <span className="whitespace-nowrap">Låser opp rapporten...</span>
                ) : (
                  <>
                    <span className="whitespace-nowrap">Gå til betaling: 1 490 kr eks. mva.</span>
                    <span className="whitespace-nowrap">(1 862,50 kr inkl. mva.) →</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
