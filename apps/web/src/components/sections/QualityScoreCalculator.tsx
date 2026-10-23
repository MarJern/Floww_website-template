"use client";

import React, { useState, useId } from "react";
import Link from "next/link";
import EditorialSection from "@/components/sections/EditorialSection";
import Card, {
  CardHeader,
  CardEyebrow,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export interface QualityScoreCalculatorProps {
  variant?: "full" | "compact";
  bg?: "dark" | "sand" | "light";
  id?: string;
}

const nfInteger = new Intl.NumberFormat("nb-NO", {
  maximumFractionDigits: 0,
});

const nfDecimal = new Intl.NumberFormat("nb-NO", {
  maximumFractionDigits: 1,
});

function formatKr(amount: number): string {
  return `${nfInteger.format(Math.round(amount))} kr`;
}

function getCpcMultiplier(qs: number): number {
  return 5 / qs;
}

const SCALE_STEPS = Array.from({ length: 10 }, (_, idx) => {
  const score = idx + 1;
  const deltaPct = (getCpcMultiplier(score) - 1) * 100;
  const tier: "low" | "mid" | "high" =
    score <= 3 ? "low" : score <= 6 ? "mid" : "high";

  const label =
    score === 5
      ? "snitt"
      : `${deltaPct > 0 ? "+" : ""}${nfDecimal.format(deltaPct)} %`;

  return { score, deltaPct, tier, label };
});

function parseBudgetString(raw: string): number {
  const cleaned = raw.replace(/[^\d,.]/g, "").replace(",", ".");
  const parsed = parseFloat(cleaned);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

export default function QualityScoreCalculator({
  variant = "full",
  bg = "dark",
  id = "kalkulator",
}: QualityScoreCalculatorProps) {
  const baseId = useId();
  const curInputId = `${baseId}-qs-cur`;
  const curHintId = `${baseId}-qs-cur-hint`;
  const budgetInputId = `${baseId}-budget`;
  const budgetHintId = `${baseId}-budget-hint`;
  const tgtInputId = `${baseId}-qs-tgt`;

  const [currentQs, setCurrentQs] = useState<number>(5);
  const [targetQs, setTargetQs] = useState<number>(8);
  const [budgetRaw, setBudgetRaw] = useState<string>("50 000");

  const monthlyBudget = parseBudgetString(budgetRaw);

  // 1. Comparison against Google's reference baseline (QS = 5)
  const benchmarkMonthlyCost =
    monthlyBudget * (getCpcMultiplier(5) / getCpcMultiplier(currentQs));
  const benchmarkYearlyDiff = (monthlyBudget - benchmarkMonthlyCost) * 12;

  // 2. Comparison against selected target Quality Score
  const targetMonthlyCost = monthlyBudget * (currentQs / targetQs);
  const monthlySavings = monthlyBudget - targetMonthlyCost;
  const yearlySavings = monthlySavings * 12;
  const moreClicksPct = (targetQs / currentQs - 1) * 100;

  const handleBudgetBlur = () => {
    const numeric = parseBudgetString(budgetRaw);
    setBudgetRaw(numeric > 0 ? nfInteger.format(numeric) : "");
  };

  const roundedCurrent = Math.round(currentQs);
  const roundedTarget = Math.round(targetQs);

  const isCompact = variant === "compact";
  const highlightCardVariant = bg === "light" ? "sand" : "light";

  return (
    <EditorialSection
      id={id}
      as="section"
      ariaLabel="Google Ads Quality Score-kalkulator"
      bg={bg}
      label="Google Ads-kalkulator"
      title={
        isCompact
          ? "Regn ut hva lav Quality Score koster dere."
          : "Hva koster lav Quality Score dere?"
      }
      paragraphs={[
        isCompact
          ? "Google belønner raske landingssider og presise annonser med lavere klikkpris. Test hvordan en høyere Quality Score påvirker annonsebudsjettet deres:"
          : "Google belønner relevante annonser og raske landingssider med lavere klikkpris. Legg inn snittscoren og månedsbudsjettet deres, og se hva dagens oppsett koster, og hva en bedre score er verdt.",
      ]}
    >
      {isCompact ? (
        /* COMPACT VARIANT (FOR HOME PAGE) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8 items-stretch">
          <Card
            variant="dark"
            className="lg:col-span-7 border border-brand-light/15"
          >
            <CardContent className="flex flex-col gap-6">
              <div>
                <label
                  htmlFor={budgetInputId}
                  className="block font-heading text-micro font-bold uppercase tracking-wider text-brand-accent mb-2"
                >
                  Annonsebudsjett per måned
                </label>
                <div className="flex items-center bg-brand-dark border border-brand-light/25 rounded-sm px-4 focus-within:border-brand-accent transition-colors">
                  <input
                    id={budgetInputId}
                    type="text"
                    inputMode="numeric"
                    value={budgetRaw}
                    onChange={(e) => setBudgetRaw(e.target.value)}
                    onBlur={handleBudgetBlur}
                    aria-describedby={budgetHintId}
                    className="flex-1 bg-transparent border-0 text-brand-light font-heading text-fluid-h3 py-2.5 w-full focus:outline-none"
                  />
                  <span className="text-brand-light/70 text-fluid-p font-semibold ml-2">
                    kr / mnd
                  </span>
                </div>
                <p
                  id={budgetHintId}
                  className="text-brand-light/70 text-micro tracking-normal normal-case mt-1.5 m-0"
                >
                  Det dere bruker på Google Ads i snitt hver måned.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-brand-light/10">
                <div>
                  <label
                    htmlFor={curInputId}
                    className="block font-heading text-micro font-bold uppercase tracking-wider text-brand-accent mb-2"
                  >
                    Score i dag (1–10)
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      id={curInputId}
                      type="range"
                      min="1"
                      max="10"
                      step="0.5"
                      value={currentQs}
                      aria-valuetext={`${nfDecimal.format(currentQs)} av 10`}
                      onChange={(e) =>
                        setCurrentQs(parseFloat(e.target.value))
                      }
                      className="flex-1 accent-brand-rust h-8 cursor-pointer"
                    />
                    <span className="font-heading text-fluid-h3 font-bold text-brand-light min-w-[3ch] text-right">
                      {nfDecimal.format(currentQs)}
                    </span>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor={tgtInputId}
                    className="block font-heading text-micro font-bold uppercase tracking-wider text-brand-accent mb-2"
                  >
                    Hvis scoren løftes til
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      id={tgtInputId}
                      type="range"
                      min="1"
                      max="10"
                      step="0.5"
                      value={targetQs}
                      aria-valuetext={`${nfDecimal.format(targetQs)} av 10`}
                      onChange={(e) => setTargetQs(parseFloat(e.target.value))}
                      className="flex-1 accent-brand-rust h-8 cursor-pointer"
                    />
                    <span className="font-heading text-fluid-h3 font-bold text-brand-accent min-w-[3ch] text-right">
                      {nfDecimal.format(targetQs)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            variant={highlightCardVariant}
            accent="top"
            className="lg:col-span-5 border border-brand-dark/10"
          >
            <CardHeader>
              <CardEyebrow>
                {Math.abs(yearlySavings) < 1
                  ? "Endring per år"
                  : yearlySavings > 0
                    ? "Mulig besparelse per år"
                    : "Ekstra kostnad per år"}
              </CardEyebrow>
              <output
                htmlFor={`${curInputId} ${tgtInputId} ${budgetInputId}`}
                aria-live="polite"
                className={`font-heading text-fluid-h2 font-bold leading-none block my-1 ${
                  Math.abs(yearlySavings) < 1
                    ? "text-brand-dark"
                    : yearlySavings > 0
                      ? "text-brand-pine"
                      : "text-brand-dark"
                }`}
              >
                {Math.abs(yearlySavings) < 1
                  ? "0 kr"
                  : yearlySavings > 0
                    ? formatKr(yearlySavings)
                    : `+${formatKr(-yearlySavings)}`}
              </output>
            </CardHeader>
            <CardContent>
              <p className="text-fluid-p text-brand-dark/85 m-0">
                {Math.abs(yearlySavings) < 1 ? (
                  "Velg en annen mål-score for å se effekten på budsjettet."
                ) : yearlySavings > 0 ? (
                  <>
                    Samme antall klikk for{" "}
                    <strong>{formatKr(monthlySavings)}</strong> mindre i
                    måneden, eller{" "}
                    <strong>+{nfDecimal.format(moreClicksPct)} %</strong> flere
                    klikk for samme budsjett.
                  </>
                ) : (
                  "Så mye mer ville de samme klikkene kostet med lavere score."
                )}
              </p>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-4 border-t border-brand-dark/10">
              <Button href="/seo-analyse" variant="primary" className="w-full sm:w-auto">
                Test landingssiden gratis →
              </Button>
              <Link
                href="/google-ads#kalkulator"
                className="text-micro uppercase tracking-wider font-bold text-brand-pine hover:text-brand-dark underline decoration-brand-pine/40 underline-offset-4"
              >
                Se 1–10 skala →
              </Link>
            </CardFooter>
          </Card>

          <p
            className={`lg:col-span-12 text-micro tracking-normal normal-case m-0 ${
              bg === "dark" ? "text-brand-light/70" : "text-brand-dark/65"
            }`}
          >
            Faktiske tall varierer med bransje, konkurranse og budstrategi. Bruk
            resultatet som et anslag.
          </p>
        </div>
      ) : (
        /* FULL VARIANT (FOR /GOOGLE-ADS) */
        <div className="mt-8 flex flex-col gap-6">
          {/* 1. INPUT CONTROLS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card variant="dark" className="border border-brand-light/15">
              <CardContent className="flex flex-col justify-between h-full">
                <div>
                  <label
                    htmlFor={curInputId}
                    className="block font-heading text-micro font-bold uppercase tracking-wider text-brand-accent mb-3"
                  >
                    Deres snittlige Quality Score
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      id={curInputId}
                      type="range"
                      min="1"
                      max="10"
                      step="0.5"
                      value={currentQs}
                      aria-describedby={curHintId}
                      aria-valuetext={`${nfDecimal.format(currentQs)} av 10`}
                      onChange={(e) =>
                        setCurrentQs(parseFloat(e.target.value))
                      }
                      className="flex-1 accent-brand-rust h-8 cursor-pointer"
                    />
                    <span className="font-heading text-fluid-h2 font-bold text-brand-light min-w-[3ch] text-right">
                      {nfDecimal.format(currentQs)}
                    </span>
                  </div>
                </div>
                <p
                  id={curHintId}
                  className="text-brand-light/70 text-fluid-p mt-3 m-0"
                >
                  Finnes i Google Ads under søkeord, kolonnen
                  «Kvalitetsresultat».
                </p>
              </CardContent>
            </Card>

            <Card variant="dark" className="border border-brand-light/15">
              <CardContent className="flex flex-col justify-between h-full">
                <div>
                  <label
                    htmlFor={budgetInputId}
                    className="block font-heading text-micro font-bold uppercase tracking-wider text-brand-accent mb-3"
                  >
                    Annonsebudsjett per måned
                  </label>
                  <div className="flex items-center bg-brand-dark border border-brand-light/25 rounded-sm px-4 focus-within:border-brand-accent transition-colors">
                    <input
                      id={budgetInputId}
                      type="text"
                      inputMode="numeric"
                      value={budgetRaw}
                      aria-describedby={budgetHintId}
                      onChange={(e) => setBudgetRaw(e.target.value)}
                      onBlur={handleBudgetBlur}
                      className="flex-1 bg-transparent border-0 text-brand-light font-heading text-fluid-h3 py-2.5 w-full focus:outline-none"
                    />
                    <span className="text-brand-light/70 text-fluid-p font-semibold ml-2">
                      kr
                    </span>
                  </div>
                </div>
                <p
                  id={budgetHintId}
                  className="text-brand-light/70 text-fluid-p mt-3 m-0"
                >
                  Det dere bruker på Google Ads i snitt hver måned.
                </p>
              </CardContent>
            </Card>

            <Card
              variant="dark"
              className="md:col-span-2 border border-brand-light/15"
            >
              <CardContent>
                <label
                  htmlFor={tgtInputId}
                  className="block font-heading text-micro font-bold uppercase tracking-wider text-brand-accent mb-3"
                >
                  Hvis snittscoren løftes til
                </label>
                <div className="flex items-center gap-4">
                  <input
                    id={tgtInputId}
                    type="range"
                    min="1"
                    max="10"
                    step="0.5"
                    value={targetQs}
                    aria-valuetext={`${nfDecimal.format(targetQs)} av 10`}
                    onChange={(e) => setTargetQs(parseFloat(e.target.value))}
                    className="flex-1 accent-brand-rust h-8 cursor-pointer"
                  />
                  <span className="font-heading text-fluid-h2 font-bold text-brand-accent min-w-[3ch] text-right">
                    {nfDecimal.format(targetQs)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 2. LIVE CALCULATION RESULTS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card variant="dark" className="border border-brand-light/15">
              <CardHeader>
                <CardEyebrow>Deres score mot Googles snitt (5)</CardEyebrow>
                <output
                  htmlFor={`${curInputId} ${budgetInputId}`}
                  aria-live="polite"
                  className={`font-heading text-fluid-h2 font-bold leading-none block my-1 ${
                    Math.abs(benchmarkYearlyDiff) < 1
                      ? "text-brand-light"
                      : benchmarkYearlyDiff > 0
                        ? "text-brand-rust"
                        : "text-brand-accent"
                  }`}
                >
                  {Math.abs(benchmarkYearlyDiff) < 1
                    ? "0 kr"
                    : benchmarkYearlyDiff > 0
                      ? `+${formatKr(benchmarkYearlyDiff)}`
                      : `−${formatKr(-benchmarkYearlyDiff)}`}
                </output>
              </CardHeader>
              <CardContent>
                <p className="text-fluid-p text-brand-light/85 m-0">
                  {Math.abs(benchmarkYearlyDiff) < 1
                    ? "Dere ligger på Googles referansesnitt (5 av 10)."
                    : benchmarkYearlyDiff > 0
                      ? "Så mye mer betaler dere i året for de samme klikkene, sammenlignet med en annonsør på snittscore."
                      : "Så mye mindre betaler dere i året for de samme klikkene, sammenlignet med en annonsør på snittscore."}
                </p>
              </CardContent>
            </Card>

            <Card variant="light" accent="top">
              <CardHeader>
                <CardEyebrow>
                  {Math.abs(yearlySavings) < 1
                    ? "Endring per år"
                    : yearlySavings > 0
                      ? "Mulig besparelse per år"
                      : "Ekstra kostnad per år"}
                </CardEyebrow>
                <output
                  htmlFor={`${curInputId} ${tgtInputId} ${budgetInputId}`}
                  aria-live="polite"
                  className={`font-heading text-fluid-h2 font-bold leading-none block my-1 ${
                    Math.abs(yearlySavings) < 1
                      ? "text-brand-dark"
                      : yearlySavings > 0
                        ? "text-brand-pine"
                        : "text-brand-dark"
                  }`}
                >
                  {Math.abs(yearlySavings) < 1
                    ? "0 kr"
                    : yearlySavings > 0
                      ? formatKr(yearlySavings)
                      : `+${formatKr(-yearlySavings)}`}
                </output>
              </CardHeader>
              <CardContent>
                <p className="text-fluid-p text-brand-dark/85 m-0">
                  {Math.abs(yearlySavings) < 1 ? (
                    "Velg en annen mål-score for å se effekten på annonsebudsjettet."
                  ) : yearlySavings > 0 ? (
                    <>
                      Samme antall klikk for{" "}
                      <strong>{formatKr(monthlySavings)}</strong> mindre i
                      måneden. Eller{" "}
                      <strong>+{nfDecimal.format(moreClicksPct)} %</strong>{" "}
                      flere klikk for samme budsjett.
                    </>
                  ) : (
                    "Så mye mer ville de samme klikkene kostet med lavere score."
                  )}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 3. INTERACTIVE 1-10 QUALITY SCORE SCALE */}
          <div className="pt-2">
            <div
              role="group"
              aria-label="Quality Score skala fra 1 til 10, klikk for å velge mål-score"
              className="grid grid-cols-5 md:grid-cols-10 gap-2"
            >
              {SCALE_STEPS.map((step) => {
                const isCurrent = step.score === roundedCurrent;
                const isTarget =
                  step.score === roundedTarget &&
                  roundedTarget !== roundedCurrent;

                const bottomBorderClass =
                  step.tier === "low"
                    ? "border-b-[3px] border-b-brand-rust"
                    : step.tier === "mid"
                      ? "border-b-[3px] border-b-brand-rust/60"
                      : "border-b-[3px] border-b-brand-accent";

                const activeOutlineClass = isCurrent
                  ? "outline-2 outline-brand-light -translate-y-1 bg-brand-blue"
                  : isTarget
                    ? "outline-2 outline-dashed outline-brand-rust -translate-y-1 bg-brand-blue"
                    : "bg-brand-blue/70 hover:bg-brand-blue";

                return (
                  <button
                    key={step.score}
                    type="button"
                    onClick={() => setTargetQs(step.score)}
                    aria-pressed={step.score === roundedTarget}
                    aria-label={`Sett mål-score til ${step.score} (${step.label} klikkpris mot snittet)`}
                    className={`text-center py-2.5 px-1 rounded-sm transition-all cursor-pointer ${bottomBorderClass} ${activeOutlineClass}`}
                  >
                    <strong className="block font-heading text-fluid-p font-bold text-brand-light">
                      {step.score}
                    </strong>
                    <span className="block text-micro tracking-normal normal-case text-brand-light/80">
                      {step.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-6 text-brand-light/75 text-micro tracking-normal normal-case mt-4">
              <span className="inline-flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="inline-block w-3 h-3 rounded-[2px] bg-brand-light"
                />
                Deres score ({roundedCurrent})
              </span>
              <span className="inline-flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="inline-block w-3 h-3 rounded-[2px] outline-2 outline-dashed outline-brand-rust"
                />
                Valgt mål-score ({roundedTarget})
              </span>
              <span>
                Prosenttallet viser endring i klikkpris mot Googles snitt (5) –
                klikk på et tall for å sette mål-score
              </span>
            </div>
          </div>

          {/* 4. CTA BAR & METHODOLOGY NOTE */}
          <div className="flex flex-wrap items-center justify-between gap-6 pt-6 mt-2 border-t border-brand-light/15">
            <p className="text-fluid-p-lg text-brand-light/90 max-w-2xl m-0">
              Vil dere vite hva som trekker ned deres score, og hva det koster
              dere? Synlighetsrapporten måler landingssidene deres på 45
              sekunder.
            </p>
            <Button href="/seo-analyse" variant="primary">
              Ta analysen gratis →
            </Button>
          </div>

          <p className="text-brand-light/70 text-micro tracking-normal normal-case m-0">
            Modellen bygger på en etablert bransjemodell der klikkprisen faller
            når Quality Score øker, med 5 som Googles referansepunkt.
            Klikkprisen er da omtrent 5 delt på deres score, sammenlignet med
            snittet. Faktiske tall varierer med bransje, konkurranse og
            budstrategi. Bruk resultatet som et anslag.
          </p>
        </div>
      )}
    </EditorialSection>
  );
}
