import React from "react";
import type { Metadata } from "next";
import Script from "next/script";
import Image from "next/image";
import Link from "next/link";
import Card, {
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardEyebrow,
} from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";
import QuoteCard from "@/components/ui/QuoteCard";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/sections/PageHeader";
import EditorialSection from "@/components/sections/EditorialSection";
import CtaSection from "@/components/sections/CtaSection";
import FAQSection, { type FAQItem } from "@/components/sections/FAQSection";
import { SummaryList, SummaryItem } from "@/components/ui/SummaryList";
import AuditScannerHero from "@/components/synlighetsrapport/AuditScannerHero";

export const metadata: Metadata = {
  title: "AI-SEO: Bli synlig i ChatGPT, Gemini, Claude & Perplexity",
  description:
    "Slik blir bedriften anbefalt når kunden spør ChatGPT, Gemini, Claude og Perplexity. Vi bygger den tekniske strukturen (JSON-LD, llms.txt og entiteter) som kreves.",
  alternates: {
    canonical: "https://flowwmedia.no/ai-seo",
  },
  openGraph: {
    title: "AI-SEO: Bli synlig i ChatGPT, Gemini, Claude & Perplexity | Floww Media",
    description:
      "Slik blir bedriften anbefalt når kunden spør ChatGPT, Gemini, Claude og Perplexity. Vi bygger den tekniske strukturen (JSON-LD, llms.txt og entiteter) som kreves.",
    url: "https://flowwmedia.no/ai-seo",
    siteName: "Floww Media",
    locale: "nb_NO",
    type: "website",
    images: [
      {
        url: "/images/teamet.jpg",
        width: 1200,
        height: 630,
        alt: "Floww Media, AI-SEO og synlighet i språkmodeller",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI-SEO: Bli synlig i ChatGPT, Gemini, Claude & Perplexity | Floww Media",
    description:
      "Slik blir bedriften anbefalt når kunden spør ChatGPT, Gemini, Claude og Perplexity.",
    images: ["/images/teamet.jpg"],
  },
};

const aiFaqs: FAQItem[] = [
  {
    question: "Hvilke AI-tjenester måler og optimaliserer dere for?",
    answer:
      "Vi fokuserer på plattformene norske beslutningstakere og forbrukere faktisk bruker når de ber om anbefalinger: ChatGPT, Gemini, Claude og Perplexity, i tillegg til Googles egne AI-svar (AI Overviews).",
  },
  {
    question: "Hva er forskjellen på AEO, GEO, AIO og AI-SEO?",
    answer:
      "AEO (Answer Engine Optimization) handler om tilpasning av innhold for direktesvar i søk. GEO (Generative Engine Optimization) gjelder optimalisering spesifikt for generative språkmodeller som ChatGPT, Gemini, Claude og Perplexity. AIO (AI Optimization) er generell teknisk tilrettelegging av data for kunstig intelligens, mens SEO er klassisk søkemotoroptimalisering. Vi samler disse disiplinene under begrepet AI-SEO, slik at bedriften står teknisk og innholdsmessig rustet på tvers av både Google og språkmodellene.",
    richAnswer: (
      <div className="flex flex-col gap-6 mt-2">
        <ul className="flex flex-col gap-3 m-0 p-0 list-none">
          <li className="flex items-start gap-3">
            <span className="text-brand-pine mt-1 flex-shrink-0">✔</span>
            <span>
              <strong className="text-brand-dark">
                AEO (Answer Engine Optimization):
              </strong>{" "}
              Tilpasning av innhold for å bli trukket frem som direktesvar, blant
              annet i Googles AI-oversikter.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-brand-pine mt-1 flex-shrink-0">✔</span>
            <span>
              <strong className="text-brand-dark">
                GEO (Generative Engine Optimization):
              </strong>{" "}
              Strukturering av kilder og entiteter for generative motorer som
              ChatGPT, Gemini, Claude og Perplexity.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-brand-pine mt-1 flex-shrink-0">✔</span>
            <span>
              <strong className="text-brand-dark">
                AIO (AI Optimization):
              </strong>{" "}
              Teknisk tilrettelegging av maskinlesbar struktur som JSON-LD
              Schema.org og llms.txt.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-brand-pine mt-1 flex-shrink-0">✔</span>
            <span>
              <strong className="text-brand-dark">
                SEO (Search Engine Optimization):
              </strong>{" "}
              <Link
                href="/seo"
                className="text-brand-pine font-semibold underline decoration-brand-pine/40 underline-offset-2"
              >
                Klassisk organisk synlighet i Google Søk
              </Link>{" "}
              og{" "}
              <Link
                href="/lokal-seo"
                className="text-brand-pine font-semibold underline decoration-brand-pine/40 underline-offset-2"
              >
                Google Maps
              </Link>
              , som fortsatt utgjør en viktig del av kildegrunnlaget AI-motorene
              henter fra.
            </span>
          </li>
        </ul>
        <p className="m-0 text-brand-dark/80">
          Vi samler disse disiplinene under <strong>AI-SEO</strong>. Når vi
          bygger organisk vekst for en klient, sørger vi for at nettside,
          strukturerte data og eksterne kataloger henger sammen for både Google
          og språkmodellene.
        </p>
      </div>
    ),
  },
  {
    question: "Hvordan sjekker vi om bedriften vår er synlig i AI-søk i dag?",
    answer:
      "Du kan teste domenet ditt gratis i Synlighetsrapporten vår. Motoren vår kontrollerer 40 spesifikke AI-målepunkter: Inkludert JSON-LD Schema.org, llms.txt, tilgang for AI-crawlere, entitetsdata mot Brønnøysundregistrene og bransjespørringer mot ChatGPT, Gemini, Claude og Perplexity.",
  },
  {
    question: "Kan dere garantere at vi blir anbefalt av ChatGPT?",
    answer:
      "Nei, og det bør du være skeptisk til om noen gjør. Ingen kontrollerer hva en generativ språkmodell svarer fra dag til dag. Det vi derimot kontrollerer fullt ut, er de tekniske og redaksjonelle signalene modellene krever for å verifisere et selskap: entydige strukturerte data, konsistent firmainformasjon i norske registre og innhold som besvarer kjøpsspørsmålene direkte.",
  },
  {
    question:
      "Holder dere fortsatt foredrag om AI-søk for ledergrupper og fagmiljøer?",
    answer:
      "Ja. Simen Russ holder jevnlig faglige gjennomganger og foredrag for ledergrupper, styrer og markedsavdelinger. Hvert foredrag bygger på en konkret analyse av selskapets egen bransje, slik at deltakerne ser sine egne tall og konkurrenter i ChatGPT, Gemini, Claude og Perplexity.",
  },
];

export default function AiSeoPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": "https://flowwmedia.no/ai-seo/#service",
        name: "AI-SEO og synlighet i ChatGPT, Gemini, Claude og Perplexity",
        description:
          "Teknisk og strategisk optimalisering for AI-søk (ChatGPT, Gemini, Claude og Perplexity) med JSON-LD Schema.org, llms.txt og entitetsbygging for norske virksomheter.",
        url: "https://flowwmedia.no/ai-seo",
        provider: {
          "@id": "https://flowwmedia.no/#organization",
        },
        areaServed: {
          "@type": "Country",
          name: "Norway",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Hjem",
            item: "https://flowwmedia.no",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "AI-SEO",
            item: "https://flowwmedia.no/ai-seo",
          },
        ],
      },
    ],
  };

  return (
    <>
      <Script
        id="ai-seo-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. HERO SECTION (DARK) */}
      <PageHeader
        bg="dark"
        breadcrumbs={[
          { name: "Hjem", href: "/" },
          { name: "AI-SEO" },
        ]}
        label="AI-SEO & GENERATIVT SØK"
        title="Når kunden spør ChatGPT, Gemini, Claude eller Perplexity, hvem blir anbefalt?"
        description="Stadig flere kjøpsbeslutninger starter med et spørsmål til en språkmodell i stedet for et tradisjonelt Google-søk. Der Google viser ti blå lenker, gir AI-motorene ett ferdig svar med to eller tre navngitte selskaper. Vi bygger det tekniske fundamentet som gjør at bedriften deres blir forstått, verifisert og sitert."
      >
        <div className="flex flex-wrap items-center gap-4">
          <Button href="/seo-analyse">Test din AI-synlighet gratis →</Button>
        </div>
      </PageHeader>

      {/* 2. KEY FACTS BAR (LIGHT) */}
      <section aria-label="Nøkkelfakta om AI-SEO" className="bg-brand-light">
        <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8">
          <SummaryList
            withBorders
            className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
          >
            <SummaryItem label="Plattformer">
              ChatGPT, Gemini, Claude &amp; Perplexity
            </SummaryItem>
            <SummaryItem label="Målepunkter">
              40 AI-faktorer i vår motor
            </SummaryItem>
            <SummaryItem label="Teknisk grunnmur">
              JSON-LD, llms.txt &amp; NAP
            </SummaryItem>
            <SummaryItem label="Eksklusivitet">
              En klient per bransje
            </SummaryItem>
          </SummaryList>
        </div>
      </section>

      {/* 3. THE PROBLEM: THE BLIND SPOT IN TRADITIONAL ANALYTICS (LIGHT) */}
      <EditorialSection
        bg="light"
        label="Blindsonen"
        title="Valget tas før klikket. Det gamle analyseverktøyet ditt ser det ikke."
        paragraphs={[
          "Kunden skroller ikke lenger bare gjennom ti blå lenker i Google. Når en beslutningstaker spør ChatGPT, Gemini, Claude eller Perplexity om hvilken leverandør de bør velge, får de ett ferdig resonnement med to eller tre selskaper.",
          "Tradisjonelle rapporter teller kun klikk til nettsiden. De forteller ingenting om hvor mange ganger bedriften din ble utelatt i selve AI-svaret før kunden i det hele tatt åpnet en nettleser.",
        ]}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mt-8 mb-10">
          <StatCard variant="dark" title="2–3">
            selskaper nevnes normalt ved navn når en AI-assistent gir en direkte
            kjøpsanbefaling.
          </StatCard>
          <StatCard variant="dark" title="3,4x">
            høyere sannsynlighet for å bli sitert i AI-svar med komplett,
            maskinlesbar JSON-LD Schema.org.
          </StatCard>
          <StatCard variant="dark" title="0 klikk">
            registreres i Google Analytics når kunden velger konkurrenten
            direkte i ChatGPT.
          </StatCard>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
          <Card variant="sand" accent="left">
            <CardHeader>
              <CardTitle as="h3">Valget tas før klikket</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Står dere ikke i svaret fra språkmodellen, besøker kunden aldri
                nettsiden. Tapet av disse kundene synes ikke i vanlig
                trafikkstatistikk.
              </CardDescription>
            </CardContent>
          </Card>

          <Card variant="sand" accent="left">
            <CardHeader>
              <CardTitle as="h3">Språkmodeller gjetter ikke</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                ChatGPT, Gemini, Claude og Perplexity anbefaler selskaper de finner
                entydige, strukturerte og kryssbekreftede data om på tvers av
                nettet.
              </CardDescription>
            </CardContent>
          </Card>

          <Card variant="sand" accent="left">
            <CardHeader>
              <CardTitle as="h3">Forspranget bygges nå</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Akkurat som i{" "}
                <Link
                  href="/seo"
                  className="text-brand-pine font-semibold underline decoration-brand-pine/40 underline-offset-2"
                >
                  organisk Google-søk
                </Link>{" "}
                for femten år siden, er det bedriftene som rydder i
                datastrukturen tidlig som blir stående som standardsvaret i sin
                kategori.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </EditorialSection>

      {/* 4. THE PROOF: INTERACTIVE SCANNER ENTRY POINT (SAND) */}
      <AuditScannerHero
        bg="sand"
        scannerVariant="dark"
        breadcrumbs={[]}
        label="SYNLIGHETSRAPPORTEN · 40 AI-MÅLEPUNKTER"
        titleAs="h2"
        titleSize="h2"
        title="Sjekk om ChatGPT, Gemini, Claude og Perplexity kjenner dere."
        description="Vi selger ikke frittstående sjekklister. Skriv inn bedriftsnavn eller domene nedenfor, så tester vår egenutviklede motor bedriften mot 245 rangeringsfaktorer, inkludert maskinlesbar Schema.org, llms.txt og synlighet i AI-søk."
      />

      {/* 5. THE SOLUTION: THE FLOWW APPROACH TO AI-SEO (DARK) */}
      <EditorialSection
        bg="dark"
        label="Metodikk & 4 pilarer"
        title="Pilar 1–3 er den tekniske grunnmuren. Pilar 4 er der dere vinner anbefalingen."
        paragraphs={[
          "For at ChatGPT, Gemini, Claude og Perplexity skal anbefale bedriften deres, kreves to ting i riktig rekkefølge: Først må den tekniske grunnmuren på egen nettside være maskinlesbar (Pilar 1–3). Deretter starter det viktigste arbeidet (Pilar 4), nemlig å bygge fortjent tredjepartsomtale på plattformene der kundene deres faktisk ferdes.",
        ]}
      >
        <div className="flex flex-col gap-6 max-w-5xl mt-8 mb-10">
          {/* ROW 1: PILLARS 1-3 (THE TECHNICAL FOUNDATION) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="light" accent="top">
              <CardHeader>
                <CardEyebrow>Pilar 1 · Grunnmur (Kode)</CardEyebrow>
                <CardTitle as="h3">JSON-LD Schema.org</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Vi bygger skreddersydd JSON-LD-merking (Organization,
                  LocalBusiness, Service og FAQPage) som forteller AI-motorene
                  nøyaktig hva dere leverer, hvem dere er, og hvilket område
                  dere dekker.
                </CardDescription>
              </CardContent>
            </Card>

            <Card variant="light" accent="top">
              <CardHeader>
                <CardEyebrow>Pilar 2 · Grunnmur (Tilgang)</CardEyebrow>
                <CardTitle as="h3">llms.txt &amp; AI-indeksering</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Vi setter opp dedikert llms.txt-dokumentasjon, ren semantisk
                  HTML (H1–H3), rask serverrespons (TTFB) og åpner robots.txt
                  for relevante AI-crawlere som GPTBot, ClaudeBot og
                  PerplexityBot.
                </CardDescription>
              </CardContent>
            </Card>

            <Card variant="light" accent="top">
              <CardHeader>
                <CardEyebrow>Pilar 3 · Grunnmur (Entitet)</CardEyebrow>
                <CardTitle as="h3">Konsistens i norske registre</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Språkmodeller kryssjekker bedriften mot autoritative kilder.
                  Vi sikrer 100 % samsvar i firmanavn, org.nr., adresse og
                  kategori mellom nettsiden, Brønnøysundregistrene, Google,
                  1881, Gule Sider og Proff.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* ROW 2: PILLAR 4 SPOTLIGHT (EARNED PR & EXTERNAL PLATFORMS) */}
          <Card variant="sand" accent="left" className="p-6 sm:p-8 md:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 flex flex-col gap-4">
                <CardEyebrow className="!mb-0">
                  Pilar 4 · Vårt hovedfokus i det løpende arbeidet
                </CardEyebrow>
                <CardTitle as="h3" className="!text-fluid-h2">
                  Fortjent tredjepartsomtale (Earned PR) der kundene deres
                  faktisk er
                </CardTitle>
                <CardDescription className="!text-fluid-p-lg !text-brand-dark/90">
                  Pilar 1 til 3 sørger for at språkmodellene forstår nettsiden
                  deres, men ingen AI-modell stoler blindt på det en bedrift
                  skriver om seg selv. Akkurat som mennesker skiller
                  AI-motorene skarpt mellom betalt synlighet (<em>Paid</em>),
                  egne påstander (<em>Owned</em>) og uavhengig omtale fra andre
                  (<em>Earned</em>).
                </CardDescription>
                <CardDescription className="!text-fluid-p-lg !text-brand-dark/90">
                  Det en uavhengig tredjepart sier om dere utenfor nettsiden,
                  veier langt tyngre enn hva dere sier om dere selv. Derfor
                  handler det løpende arbeidet vårt om å bygge ekte omtale,
                  faglig synlighet og siteringer på plattformene der deres
                  kunder diskuterer og søker råd, enten det er i fagtråder på{" "}
                  <strong>LinkedIn</strong>, ærlige brukererfaringer på{" "}
                  <strong>Reddit</strong>, bransjemedier, uavhengige
                  sammenligninger eller verifiserte anmeldelser.
                </CardDescription>
              </div>

              <div className="lg:col-span-5 rounded-sm bg-brand-dark text-brand-light p-6 flex flex-col gap-5">
                <p className="text-micro uppercase tracking-wider font-heading font-bold text-brand-accent m-0">
                  Slik vektlegger språkmodellene kilder
                </p>

                <div className="flex flex-col gap-1.5 pb-4 border-b border-brand-light/15">
                  <span className="text-micro uppercase tracking-wider font-bold text-brand-rust">
                    Lavere vekt · Egenpåstander &amp; Paid
                  </span>
                  <p className="text-fluid-p text-brand-light/85 m-0">
                    Salgstekster på egen nettside og betalte annonser. Nødvendig
                    for konvertering når kunden først klikker, men alene ikke
                    nok til at AI-en utpeker dere som bransjevinner.
                  </p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-micro uppercase tracking-wider font-bold text-brand-accent">
                    Høyest vekt · Earned PR &amp; 3. part
                  </span>
                  <p className="text-fluid-p text-brand-light/90 m-0">
                    Uavhengige anbefalinger og diskusjoner på{" "}
                    <strong>LinkedIn</strong> og <strong>Reddit</strong>,
                    redaksjonell omtale i fagpresse, «beste i bransjen»-kåringer
                    og ekte kundeomtaler på tvers av nettet.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <QuoteCard bg="light" className="max-w-4xl">
          <p>
            <strong>En ting vi aldri lover:</strong> Vi lover aldri en garantert
            plassering i et generert AI-svar. Ingen kontrollerer en
            språkmodell. Det vi kontrollerer er den tekniske grunnmuren,
            entitetsdataene og kildene som avgjør om modellen har grunnlag for å
            anbefale dere fremfor konkurrenten.
          </p>
        </QuoteCard>
      </EditorialSection>

      {/* 6. EXCLUSIVITY, SENIOR TEAM & LECTURES (SAND) */}
      <EditorialSection
        bg="sand"
        label="Eksklusivitet & fagtyngde"
        title="En klient per bransje. Ledet direkte av seniorer."
        paragraphs={[
          "Når ChatGPT, Gemini, Claude eller Perplexity kun trekker frem to eller tre bedrifter i et svar, sier det seg selv at et byrå ikke kan bygge AI-synlighet for fire konkurrenter i samme by samtidig. Derfor tar vi kun én klient per bransje i hvert geografiske område.",
        ]}
      >
        <div className="grid md:grid-cols-[1fr_1.5fr] gap-6 md:gap-12 items-start w-full mt-8">
          <Image
            src="/images/teamet.jpg"
            alt="Simen Russ, fagansvarlig for SEO og AI-søk i Floww Media"
            width={720}
            height={720}
            className="w-full aspect-square object-cover rounded-sm shadow-sm object-[center_15%]"
          />
          <div>
            <h3 className="font-heading text-fluid-h2 text-brand-dark mb-4">
              Simen Russ &amp; Marja Jernsletten
            </h3>
            <p className="text-fluid-p-lg text-brand-dark/90 mb-4 text-pretty">
              Arbeidet ledes direkte av Simen Russ (tidligere Head of SEO i
              dentsu med 15 års erfaring fra rundt 80 norske og internasjonale
              merkevarer, og innleid fagekspert på AI-synlighet for blant annet
              Transact) og seniorutvikler Marja Jernsletten (arkitekten bak vår
              analyseplattform og tekniske kundeleveranser).
            </p>
            <p className="text-fluid-p-lg text-brand-dark/90 mb-6 text-pretty">
              Vi måler ikke suksess i tekniske aktivitetsrapporter, men i
              kvalifiserte henvendelser, lavere avhengighet av{" "}
              <Link
                href="/google-ads"
                className="text-brand-pine font-semibold underline decoration-brand-pine/40 underline-offset-2"
              >
                betalt annonsering
              </Link>{" "}
              og reell effekt på bunnlinjen. For ledergrupper og fagsamlinger
              holder vi også skreddersydde foredrag om AI-søk basert på ferske
              tall fra deres egen kategori.
            </p>

            <ul className="flex flex-col border-t border-brand-dark/10 mb-8 m-0 p-0 list-none">
              <li className="flex flex-col sm:flex-row sm:justify-between py-4 border-b border-brand-dark/10 gap-1 sm:gap-4">
                <strong className="text-brand-dark text-fluid-p">
                  AI-synlighet i praksis
                </strong>
                <span className="text-brand-blue text-fluid-p text-left sm:text-right">
                  Volkswagen og Obs Bygg (via Transact)
                </span>
              </li>
              <li className="flex flex-col sm:flex-row sm:justify-between py-4 border-b border-brand-dark/10 gap-1 sm:gap-4">
                <strong className="text-brand-dark text-fluid-p">
                  Internasjonal erfaring
                </strong>
                <span className="text-brand-blue text-fluid-p text-left sm:text-right">
                  Red Bull, Under Armour, J&amp;J
                </span>
              </li>
              <li className="flex flex-col sm:flex-row sm:justify-between py-4 border-b border-brand-dark/10 gap-1 sm:gap-4">
                <strong className="text-brand-dark text-fluid-p">
                  Norske merkevarer
                </strong>
                <span className="text-brand-blue text-fluid-p text-left sm:text-right">
                  Bohus (Gull i Performance Awards), VitusApotek, Byggmakker, Eviny, Remember
                </span>
              </li>
            </ul>

            <Button href="/seo-analyse">
              Kjør gratis synlighetsrapport →
            </Button>
          </div>
        </div>
      </EditorialSection>

      {/* 7. FAQ SECTION (LIGHT) */}
      <FAQSection faqs={aiFaqs} />

      {/* 8. BOTTOM CTA SECTION (SAND) */}
      <CtaSection
        bg="sand"
        label="SYNLIGHETSRAPPORTEN"
        title="Se hvordan bedriften rangerer i Google og AI-søk."
        description="Kjør en gratis analyse på 45 sekunder. Vi sjekker 245 målepunkter på tvers av Google Maps, teknisk SEO, norske kataloger og AI-synlighet i ChatGPT, Gemini, Claude og Perplexity."
        buttonText="Test din synlighet gratis →"
        buttonHref="/seo-analyse"
      />
    </>
  );
}