import Button from "@/components/ui/Button";
import React from "react";

export interface CtaSectionProps {
  bg?: "sand" | "light";
  label?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  buttonText?: string;
  buttonHref?: string;
}

export default function CtaSection({
  bg = "sand",
  label = "Neste steg",
  title = "Se hvor dere taper kunder i dag.",
  description = "Skriv inn domenet deres i vår interaktive skanner. På under 45 sekunder måler vi bedriften mot 245 rangeringsfaktorer i Google, Google-kartet og AI-søk, helt uforpliktende.",
  buttonText = "Kjør gratis SEO-analyse →",
  buttonHref = "/seo-analyse",
}: CtaSectionProps) {
  const bgClass = bg === "light" ? "bg-brand-light" : "bg-brand-sand";

  return (
    <section className={`w-full py-[clamp(3rem,6vw,5rem)] ${bgClass}`}>
      <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8">
        <div className="bg-brand-dark p-[clamp(2rem,5vw,4rem)] rounded-sm shadow-sm">
          {label && (
            <p className="text-micro uppercase text-brand-light/50 m-0 mb-2 font-bold">
              {label}
            </p>
          )}

          {title && (
            <h2 className="font-heading text-fluid-h3 text-brand-light m-0 leading-tight">
              {title}
            </h2>
          )}

          {description && (
            <p className="text-fluid-p-lg text-brand-light/80 my-8 max-w-3xl text-pretty">
              {description}
            </p>
          )}

          {buttonText && buttonHref && (
            <Button href={buttonHref}>{buttonText}</Button>
          )}
        </div>
      </div>
    </section>
  );
}