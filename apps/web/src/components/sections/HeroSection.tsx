import React from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";

export interface HeroSectionProps {
  titleAs?: "h1" | "h2";
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  videoSlot?: React.ReactNode;
}

export default function HeroSection({
  titleAs: TitleTag = "h1",
  eyebrow = "Eksklusivt byrå for organisk vekst",
  title = "Synlighet der det teller. Målt på bunnlinjen, ikke i aktivitetsrapporter.",
  description = "Andre byråer vokser ved å ta inn flest mulig kunder. Vi gjør det motsatte: Med egenutviklede analysemodeller og kun senioreksperter jobber vi langsiktig med én utvalgt virksomhet per bransje.",
  videoSlot,
}: HeroSectionProps) {
  return (
    <section
      className="relative overflow-hidden w-full bg-brand-light text-brand-dark py-20 md:py-28 lg:py-36 border-b border-brand-dark/10"
      aria-label="Om vår kjerneleveranse"
    >
      <Image
        src="/images/hero-bg.jpg"
        alt="Bakgrunnsbilde for Floww Media"
        fill
        sizes="100vw"
        className="object-cover object-center opacity-25"
        priority
      />

      <div className="absolute inset-0 bg-gradient-to-r from-brand-light via-brand-light/95 to-brand-light/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-light via-brand-light/50 to-transparent" />

      <div className="relative z-10 mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8">
        <div
          className={
            videoSlot
              ? "grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center"
              : "max-w-4xl"
          }
        >
          <div className={videoSlot ? "lg:col-span-7" : ""}>
            {eyebrow && (
              <p className="text-micro uppercase tracking-wider text-brand-pine mb-4 font-heading font-bold m-0">
                {eyebrow}
              </p>
            )}

            <TitleTag className="font-heading text-fluid-h1 font-bold text-brand-dark mb-6 text-balance">
              {title}
            </TitleTag>

            {description && (
              <p className="text-fluid-p-lg max-w-3xl text-brand-dark font-medium text-pretty">
                {description}
              </p>
            )}

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button href="/seo-analyse" variant="primary">
                Test bedriften deres gratis →
              </Button>
              <Button href="/lokal-seo" variant="outline">
                Les om lokal synlighet
              </Button>
            </div>
          </div>

          {videoSlot && (
            <div className="lg:col-span-5 w-full">{videoSlot}</div>
          )}
        </div>
      </div>
    </section>
  );
}