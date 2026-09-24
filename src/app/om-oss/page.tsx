import { Metadata } from "next";
import Script from "next/script";
import Image from "next/image";
import CtaSection from "@/components/sections/CtaSection";
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import QuoteCard from "@/components/ui/QuoteCard";
import PageHeader from "@/components/sections/PageHeader";
import { SummaryList, SummaryItem } from "@/components/ui/SummaryList";

export const metadata: Metadata = {
  title: "Om Oss | Floww Media",
  description: "Bli kjent med Floww Media. Vi er et Oslo-basert byrå som kombinerer dyp teknisk ekspertise i frontend-utvikling med strategisk SEO.",
  alternates: {
    canonical: "/om-oss",
  },
};

export default function OmOssPage() {
  const jsonLdAbout = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://flowwmedia.no/om-oss"
    },
    "name": "Om Oss | Floww Media",
    "description": "Bli kjent med Floww Media. Vi er et Oslo-basert byrå som kombinerer dyp teknisk ekspertise i frontend-utvikling med strategisk SEO."
  };

  return (
    <>
      <Script id="schema-about" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdAbout) }} />

      <PageHeader
        label="Byrået"
        title="Femten år med søk og synlighet for Norges største selskaper. Nå går vi helt lokalt."
        description="Floww Media er et lite nisjebyrå. To personer: Simen med over femten års erfaring med SEO for mange av Norges største selskaper, og Marja som har over ti års erfaring som utvikler."
      />

      <section className="w-full bg-brand-light py-[clamp(2rem,4.5vw,3.5rem)]">
        <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8">
          <div className="w-full aspect-[21/9] md:aspect-[2.5/1] relative rounded-sm overflow-hidden mb-6 md:mb-10">
            <Image alt="Portrett av Marja Jernsletten og Simen Russ" className="object-cover object-[center_25%]" fill priority src="/images/teamet.jpg" />
          </div>

          <SummaryList withBorders className="grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <SummaryItem label="Selskap">Floww AS</SummaryItem>
            <SummaryItem label="Adresse">Edvard Storms gate 2</SummaryItem>
            <SummaryItem label="Nisje">Private klinikker</SummaryItem>
            <SummaryItem label="Kunder">Én per bransje per bydel</SummaryItem>
          </SummaryList>
        </div>
      </section>

      <article className="py-[clamp(2rem,4.5vw,3.5rem)] bg-brand-sand">
        <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8 grid grid-cols-1 md:grid-cols-[minmax(0,7rem)_minmax(0,1fr)] gap-[clamp(1.2rem,4vw,3.2rem)] items-start">
          <p className="text-micro uppercase text-brand-dark/50 m-0 mt-2">Profil</p>
          <div>
            <h2 className="font-heading text-fluid-h2 mb-8 md:mb-6 md:mb-10 text-brand-dark">
              Hvem er vi?
            </h2>

            <div id="simen" className="flex flex-col gap-12 md:gap-16">
              {/* --- SIMEN RUSS --- */}
              <div className="flex flex-col">

                {/* Toppseksjon Simen (Bilde og introduksjon) */}
                <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start mb-6 md:mb-10">
                  <div className="flex flex-col items-center md:items-start flex-shrink-0 w-full max-w-[240px]">
                    <figure className="relative w-full aspect-square rounded-full border-4 border-brand-light overflow-hidden mb-6">
                      <Image
                        src="/images/Simen.jpg"
                        alt="Portrett av Simen"
                        fill
                        sizes="(max-width: 768px) 100vw, 240px"
                        className="object-cover object-[center_15%]"
                      />
                    </figure>
                    <div className="flex flex-col gap-3 w-full px-2">
                      <a href="https://www.linkedin.com/in/simenr/" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 text-brand-dark hover:text-brand-pine transition-colors font-medium">
                        <Image src="/images/LinkedIn.png" alt="LinkedIn" width={16} height={16} className="h-[1.1em] w-auto object-contain group-hover:opacity-100 transition-opacity motion-reduce:transition-none" />
                        <span>LinkedIn</span>
                      </a>
                      <a href="tel:45843554" className="group flex items-center gap-3 text-brand-dark hover:text-brand-pine transition-colors font-medium">
                        <Image src="/images/phone.svg" alt="Telefon" width={16} height={16} className="h-[1.1em] w-auto object-contain group-hover:opacity-100 transition-opacity motion-reduce:transition-none" />
                        <span>458 43 554</span>
                      </a>
                      <a href="mailto:simen@flowwmedia.no" className="group flex items-center gap-3 text-brand-dark hover:text-brand-pine transition-colors font-medium">
                        <Image src="/images/email.svg" alt="E-post" width={16} height={16} className="h-[1.1em] w-auto object-contain group-hover:opacity-100 transition-opacity motion-reduce:transition-none" />
                        <span>simen@flowwmedia.no</span>
                      </a>
                    </div>
                  </div>

                  <div className="pt-2 text-center md:text-left">
                    <h3 className="font-heading text-fluid-h2 text-brand-dark mb-4">
                      Simen Russ
                    </h3>
                    <p className="text-fluid-p-lg text-brand-dark/90 max-w-prose mb-4 text-pretty">
                      Simen har vært fagansvarlig for organisk synlighet og søk i dentsu, Norges største byråkonsern. Der var hans oppgave å sette metodikk, verktøy og standarder på tvers av byråene.
                    </p>
                    <p className="text-fluid-p-lg text-brand-dark/90 max-w-prose mb-0 text-pretty">
                      Han har femten år som seniorspesialist på søk, for merkevarer som Red Bull, Under Armour, XXL, Bohus, VitusApotek, Re:member, Löplabbet og Byggmakker, med mer.
                    </p>
                  </div>
                </div>

                {/* Uthevet sitat */}
                <QuoteCard bg="light" className="my-8 max-w-4xl">
                  <p className="text-micro uppercase text-brand-dark/70 mb-3 font-bold">Prisbelønnet arbeid</p>
                  <h4 className="font-heading text-fluid-p-lg text-brand-dark mb-3">Gull i Performance Awards for SEO-arbeidet med Bohus</h4>
                  <p className="text-brand-dark/90 max-w-prose m-0 text-pretty">
                    Det samme håndverket ligger til grunn her. Forskjellen er at lokalt søk er målbart på dager framfor kvartaler, og at resultatet kan etterprøves av hvem som helst på ti sekunder.
                  </p>
                </QuoteCard>

                {/* Kundeliste */}
                <div className="mb-8 md:mb-10">
                  <p className="text-micro uppercase text-brand-dark/70 mb-4 font-bold">Et utvalg av kunder</p>
                  <ul className="flex flex-wrap gap-3 p-0 m-0 list-none">
                    {['Dentsu', 'Red Bull', 'Under Armour', 'XXL', 'Bohus', 'VitusApotek', 'Re:member', 'Löplabbet', 'Byggmakker', 'Tibber'].map(client => (
                      <li key={client} className="bg-brand-light px-5 py-2.5 border border-brand-dark/10 rounded-sm text-micro text-brand-dark/80 font-medium">
                        {client}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Uthevet sitat */}
                <QuoteCard bg="light" className="my-8 max-w-4xl">
                  Når effekten er så tydelig, kan vi gjøre noe byråer flest ikke gjør: la halve honoraret avhenge av resultatet.
                </QuoteCard>
              </div>

              {/* Skillelinje mellom profilene */}
              <hr className="border-t border-brand-dark/10 w-full" />

              {/* --- MARJA JERNSLETTEN --- */}
              <div className="flex flex-col">

                {/* Toppseksjon Marja (Bilde og introduksjon) */}
                <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start mb-6 md:mb-10">
                  <div className="flex flex-col items-center md:items-start flex-shrink-0 w-full max-w-[240px]">
                    <figure className="relative w-full aspect-square rounded-full border-4 border-brand-light overflow-hidden mb-6">
                      <Image
                        src="/images/Marja.jpg"
                        alt="Portrett av Marja Jernsletten"
                        fill
                        sizes="(max-width: 768px) 100vw, 240px"
                        className="object-cover object-[center_20%]"
                      />
                    </figure>
                    <div className="flex flex-col gap-3 w-full px-2">
                      <a href="https://www.linkedin.com/in/marjaj/" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 text-brand-dark hover:text-brand-pine transition-colors font-medium">
                        <Image src="/images/LinkedIn.png" alt="LinkedIn" width={16} height={16} className="h-[1.1em] w-auto object-contain  group-hover:opacity-100 transition-opacity motion-reduce:transition-none" />
                        <span>LinkedIn</span>
                      </a>
                      <a href="tel:93023612" className="group flex items-center gap-3 text-brand-dark hover:text-brand-pine transition-colors font-medium">
                        <Image src="/images/phone.svg" alt="Telefon" width={16} height={16} className="h-[1.1em] w-auto object-contain  group-hover:opacity-100 transition-opacity motion-reduce:transition-none" />
                        <span>930 23 612</span>
                      </a>
                      <a href="mailto:marja@flowwmedia.no" className="group flex items-center gap-3 text-brand-dark hover:text-brand-pine transition-colors font-medium">
                        <Image src="/images/email.svg" alt="E-post" width={16} height={16} className="h-[1.1em] w-auto object-contain group-hover:opacity-100 transition-opacity motion-reduce:transition-none" />
                        <span>marja@flowwmedia.no</span>
                      </a>
                    </div>
                  </div>

                  <div className="pt-2 text-center md:text-left">
                    <h3 className="font-heading text-fluid-h2 text-brand-dark mb-4">
                      Marja Jernsletten
                    </h3>
                    <p className="text-fluid-p-lg text-brand-dark/90 max-w-prose mb-4 text-pretty">
                      Utvikler med ti års erfaring. Marja tar det tekniske fundamentet på nettstedet der det må endres: struktur, hastighet, merking og oppsett som verken lar seg fikse i et publiseringsverktøy eller forklares bort.
                    </p>
                    <p className="text-fluid-p-lg text-brand-dark/90 max-w-prose mb-0 text-pretty">
                      I praksis betyr det at anbefalingene våre faktisk blir gjennomført. Mange byråer leverer en liste klinikken må ta videre til en utvikler eller spesialist, og det er ofte der ting stopper opp.
                    </p>
                  </div>
                </div>

                {/* To-kolonne grid med kort */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 md:mb-10 max-w-4xl">
                  <Card accent="left">
                    <CardHeader>
                      <CardTitle as="h4">Teknisk grunnlag</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>Hastighet, mobiltilpasning, indeksering og oppsett som lar seg måle.</CardDescription>
                    </CardContent>
                  </Card>
                  <Card accent="left">
                    <CardHeader>
                      <CardTitle as="h4">Struktur og merking</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>Tjenestesider, intern lenking og strukturerte data som Google og AI-tjenester faktisk leser.</CardDescription>
                    </CardContent>
                  </Card>
                </div>
              </div>

            </div>
          </div>
        </div>
      </article>

      <CtaSection bg="light" label="Kontakt oss" title="La oss ta en prat!" description="Hvis du nysgjerrig, usikker på hva dere eventuelt trenger hjelp med, eller ønsker en uforpliktende audit av dagens nettside. Ta kontakt så hjelper vi deg." buttonText="Se kontaktinfo" buttonHref="/kontakt" />
    </>
  );
}
