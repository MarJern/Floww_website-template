import React from "react";
import type { Metadata } from "next";
import Script from "next/script";
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
  title: "Teknisk SEO og Nettsidearkitektur som konverterer",
  description:
    "Trafikk betaler ingen regninger. Vi bygger og rydder i den tekniske grunnmuren (Core Web Vitals, silo-arkitektur og JSON-LD) som gir rangering og kunder.",
  alternates: {
    canonical: "https://flowwmedia.no/nettsider",
  },
  openGraph: {
    title: "Teknisk SEO og Nettsidearkitektur som konverterer | Floww Media",
    description:
      "Trafikk betaler ingen regninger. Vi bygger og rydder i den tekniske grunnmuren (Core Web Vitals, silo-arkitektur og JSON-LD) som gir rangering og kunder.",
    type: "website",
    locale: "nb_NO",
    url: "https://flowwmedia.no/nettsider",
    siteName: "Floww Media",
    images: [
      {
        url: "/images/teamet.jpg",
        width: 1200,
        height: 630,
        alt: "Floww Media, teknisk SEO og nettsidearkitektur",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Teknisk SEO og Nettsidearkitektur som konverterer | Floww Media",
    description:
      "Vi bygger og rydder i den tekniske grunnmuren (Core Web Vitals, silo-arkitektur og JSON-LD) som gir rangering og kunder.",
    images: ["/images/teamet.jpg"],
  },
};

const webFaqs: FAQItem[] = [
  {
    question:
      "Hvorfor selger dere ikke nettsider som et frittstående webprosjekt?",
    answer:
      "Fordi en nettside uten søkedata, innholdsarkitektur og teknisk autoritet ikke skaper vekst. Vi er et eksklusivt byrå for organisk vekst og tar kun en klient per bransje i hvert geografiske område. Når vi bygger eller rydder i en nettside, gjør vi det som grunnmuren for å vinne Google-kartet, bli sitert i AI-søk og senke kundens kostnad per henvendelse.",
  },
  {
    question:
      "Hvordan påvirker nettsidens hastighet hva vi betaler i Google Ads?",
    answer:
      "Google priser hver annonseauksjon etter en kvalitetsscore (Quality Score) fra 1 til 10, der landingssideopplevelsen på mobil veier tungt. Hvis hovedinnholdet på siden (LCP) bruker mer enn 2,5 sekunder på å laste, senker Google kvalitetsscoren. Resultatet er at dere må betale opptil 400 % mer per klikk enn en konkurrent med raskere kode for å beholde samme annonseplassering.",
  },
  {
    question: "Må vi bytte ut hele nettsiden vår for å jobbe med dere?",
    answer:
      "Nei. Vi starter alltid med å kjøre domenet gjennom Synlighetsrapporten. Hvis dagens plattform (som WordPress, Webflow, Shopify eller Next.js) har sunn kode som lar oss bygge innholdssiloer, legge inn JSON-LD og nå grønne tall på Core Web Vitals, beholder vi den. Vi anbefaler kun ny plattform når teknisk gjeld eller låste systemer gjør videre vekst dyrere enn å bygge nytt.",
  },
  {
    question:
      "Hva kreves i koden for at ChatGPT, Gemini, Claude og Perplexity skal forstå nettsiden?",
    answer:
      "Språkmodeller ser ikke visuelt design. De er avhengige av ren semantisk HTML (strengt H1–H3-hierarki), maskinlesbare skjemadata (JSON-LD Schema.org for virksomhet, tjenester, priser og FAQ), en strukturert /llms.txt-fil på rotdomenet og åpne tilgangsregler i robots.txt.",
  },
];

export default function NettsiderPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": "https://flowwmedia.no/nettsider/#service",
        name: "Teknisk SEO og Nettsidearkitektur",
        description:
          "Teknisk nettsidearkitektur, Core Web Vitals, innholdssiloer, JSON-LD Schema.org og konverteringsstruktur for organisk vekst i Google og AI-søk.",
        url: "https://flowwmedia.no/nettsider",
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
            name: "Nettsider & Teknisk SEO",
            item: "https://flowwmedia.no/nettsider",
          },
        ],
      },
    ],
  };

  return (
    <>
      <Script
        id="schema-service-nettsider"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. HERO SECTION (DARK) */}
      <PageHeader
        bg="dark"
        breadcrumbs={[
          { name: "Hjem", href: "/" },
          { name: "Nettsider" },
        ]}
        label="TEKNISK SEO & NETTSIDEARKITEKTUR"
        title="Synlighet betaler ingen regninger. Nettsiden er grunnmuren for lønnsom vekst."
        description="Vi selger ikke pene nettsider som hyllevare. Vi bygger og rydder i den tekniske arkitekturen som kreves for at Google skal rangere dere, for at ChatGPT, Gemini, Claude og Perplexity skal sitere dere, og for at besøkende skal bli til betalende kunder."
      >
        <div className="flex flex-wrap items-center gap-4">
          <Button href="/seo-analyse">
            Test nettsidens tekniske helse gratis →
          </Button>
        </div>
      </PageHeader>

      {/* 2. KEY FACTS BAR (LIGHT) */}
      <section
        aria-label="Nøkkelfakta om teknisk nettsidearkitektur"
        className="bg-brand-light"
      >
        <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8">
          <SummaryList
            withBorders
            className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
          >
            <SummaryItem label="Målepunkter">
              85 tekniske faktorer
            </SummaryItem>
            <SummaryItem label="Hastighetskrav">
              LCP under 2,5 sek på mobil
            </SummaryItem>
            <SummaryItem label="AI-lesbarhet">
              JSON-LD Schema &amp; llms.txt
            </SummaryItem>
            <SummaryItem label="Annonseøkonomi">
              Opptil 50 % lavere klikkpris
            </SummaryItem>
          </SummaryList>
        </div>
      </section>

      {/* 3. CORE WEB VITALS & GOOGLE ADS PENALTY (LIGHT) */}
      <EditorialSection
        bg="light"
        label="Hastighet & økonomi"
        title="En treg nettside koster dere dobbelt: lavere rangering og dyrere annonseklikk."
        paragraphs={[
          <>
            Kunden venter ikke på trege skript og tunge bildefiler. Google måler
            nøyaktig hvor lang tid hovedinnholdet bruker på å vises på mobil
            (LCP) og hvor raskt siden reagerer når brukeren trykker på en knapp
            (INP). Ryker dere på disse kravene, holdes dere nede i{" "}
            <Link
              href="/seo"
              className="text-brand-pine font-semibold underline decoration-brand-pine/40 underline-offset-2"
            >
              det organiske søkeresultatet
            </Link>
            .
          </>,
          <>
            Samtidig{" "}
            <Link
              href="/google-ads"
              className="text-brand-pine font-semibold underline decoration-brand-pine/40 underline-offset-2"
            >
              straffes dere direkte i Google Ads
            </Link>
            . Lav hastighet og svak struktur på landingssiden trekker ned
            Quality Score, noe som tvinger dere til å betale opptil 400 % mer
            per klikk enn konkurrenten for nøyaktig samme annonseplassering.
          </>,
        ]}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mt-8 mb-10">
          <StatCard variant="dark" title="≤ 2,5 s">
            er Googles øvre grense for innlasting av hovedinnhold (LCP) på mobil
            for å få godkjent teknisk score.
          </StatCard>
          <StatCard variant="dark" title="+400 %">
            høyere klikkpris (CPC) i Google Ads når trege landingssider trekker
            ned Quality Score i auksjonen.
          </StatCard>
          <StatCard variant="dark" title="≤ 200 ms">
            responstid på interaksjon (INP) kreves for at mobilsiden ikke skal
            oppleves treg når kunden bestiller.
          </StatCard>
        </div>

        <QuoteCard bg="sand" className="max-w-4xl">
          <p>
            Annonser er å leie trafikk. Teknisk grunnmur og organisk posisjon er
            å eie den. Når nettsiden laster på under ett sekund og svarer presist
            på søket, faller{" "}
            <Link
              href="/google-ads"
              className="text-brand-pine font-semibold underline decoration-brand-pine/40 underline-offset-2"
            >
              klikkprisen i Google Ads
            </Link>{" "}
            samtidig som{" "}
            <Link
              href="/seo"
              className="text-brand-pine font-semibold underline decoration-brand-pine/40 underline-offset-2"
            >
              den organiske trafikken
            </Link>{" "}
            øker.
          </p>
        </QuoteCard>
      </EditorialSection>

      {/* 4. INTERACTIVE SCANNER ENTRY POINT (SAND) */}
      <AuditScannerHero
        bg="sand"
        scannerVariant="dark"
        breadcrumbs={[]}
        label="SYNLIGHETSRAPPORTEN · 85 TEKNISKE NETTSIDEFAKTORER"
        titleAs="h2"
        titleSize="h2"
        title="Sjekk om dagens nettside løfter eller bremser dere."
        description="Skriv inn domenet deres nedenfor. På 45 sekunder måler motoren vår serverrespons (TTFB), Core Web Vitals på mobil, overskriftshierarki (H1–H3), JSON-LD Schema.org, internlenking og konverteringspunkter."
      />

      {/* 5. THE 4 TECHNICAL PILLARS (DARK) */}
      <EditorialSection
        bg="dark"
        label="Arkitektur & 4 pilarer"
        title="Design er for mennesker. Kode er for maskiner."
        paragraphs={[
          "De fleste byråer tegner en visuell forside først, og forsøker å lime på synlighet helt til slutt. Vi bygger baklengs fra søkedata, maskinlesbarhet og konverteringskrav. Hver eneste side konstrueres rundt fire tekniske prinsipper:",
        ]}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl mt-8 mb-10">
          <Card variant="light" accent="top">
            <CardHeader>
              <CardEyebrow>Pilar 1 · Core Web Vitals</CardEyebrow>
              <CardTitle as="h3">Hastighet uten teknisk gjeld</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Vi fjerner tunge tredjepartsskript, bygger med moderne
                kantbufring (TTFB under 0,5 s) og sørger for at både LCP, INP og
                visuell stabilitet (CLS) passerer Googles mobilkrav med god
                margin.
              </CardDescription>
            </CardContent>
          </Card>

          <Card variant="light" accent="top">
            <CardHeader>
              <CardEyebrow>Pilar 2 · Semantiske innholdssiloer</CardEyebrow>
              <CardTitle as="h3">En dedikert side per kjernetjeneste</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Samler dere ti tjenester på en fellesside, rangerer dere på
                ingen av dem. Vi strukturerer egne landingssider for hvert
                høymargin-søk med strengt H1–H3-hierarki, lokal forankring og
                tydelig internlenking.
              </CardDescription>
            </CardContent>
          </Card>

          <Card variant="light" accent="top">
            <CardHeader>
              <CardEyebrow>Pilar 3 · AI-lesbarhet</CardEyebrow>
              <CardTitle as="h3">JSON-LD Schema &amp; llms.txt</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                ChatGPT, Gemini, Claude og Perplexity leser ikke grafisk design.
                Vi koder strukturerte skjemadata (Organization, Service,
                PriceSpecification og FAQPage) og setter opp /llms.txt slik at
                språkmodellene kan hente ut priser, tjenester og kontaktdata
                direkte.
              </CardDescription>
            </CardContent>
          </Card>

          <Card variant="light" accent="top">
            <CardHeader>
              <CardEyebrow>Pilar 4 · Konvertering (CRO)</CardEyebrow>
              <CardTitle as="h3">Bygget for å skape henvendelser</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Trafikk uten handling har null verdi. Hver tjenesteside bygges
                med tydelig verdiforslag over bretten på mobil, dokumenterte
                tillitssignaler, transparente priser og sporbare kontakt- og
                bestillingspunkter.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <QuoteCard bg="light" className="max-w-4xl">
          <p>
            <strong>Design er for mennesker. Kode er for maskiner.</strong> En
            nettside som ser bra ut på en stor skjerm i møterommet, men som ikke
            kan leses maskinelt av Google og språkmodellene på mobil, taper
            kampen om kunden før den har startet.
          </p>
        </QuoteCard>
      </EditorialSection>

      {/* 6. REBUILD VS. TECHNICAL CLEANUP (SAND) */}
      <EditorialSection
        bg="sand"
        label="Ryddig vurdering"
        title="Dere trenger ikke ny nettside hvis dagens plattform kan reddes."
        paragraphs={[
          "Mange nettsider har et brukbart fundament som kun mangler riktig innholdsstruktur, skjemadata og opprydding i trege skript. Vi anbefaler aldri å bygge nytt for syns skyld. Skanneren vår avslører hvilken av disse tre situasjonene dere står i:",
        ]}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mt-8">
          <Card variant="light" accent="left">
            <CardHeader>
              <CardEyebrow>Situasjon 1</CardEyebrow>
              <CardTitle as="h3">Grunnmuren holder mål</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Plattformen svarer raskt, men mangler dedikerte tjenestesider,
                riktig H1–H3-struktur og JSON-LD-merking. Da beholder vi dagens
                løsning og bygger ut arkitekturen direkte i eksisterende system.
              </CardDescription>
            </CardContent>
          </Card>

          <Card variant="light" accent="left">
            <CardHeader>
              <CardEyebrow>Situasjon 2</CardEyebrow>
              <CardTitle as="h3">Teknisk gjeld kveler hastigheten</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Siden er bygget på tunge malbyggere og utdaterte utvidelser som
                gjør det umulig å komme under 2,5 sekunder i LCP på mobil. Da
                koster tapte kunder og{" "}
                <Link
                  href="/google-ads"
                  className="text-brand-pine font-semibold underline decoration-brand-pine/40 underline-offset-2"
                >
                  dyrere Google Ads
                </Link>{" "}
                mer enn å bygge nytt.
              </CardDescription>
            </CardContent>
          </Card>

          <Card variant="light" accent="left">
            <CardHeader>
              <CardEyebrow>Situasjon 3</CardEyebrow>
              <CardTitle as="h3">Arkitekturen låser veksten</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Publiseringsløsningen hindrer dere i å bygge rene innholdssiloer
                per tjeneste, eller gir dere ikke kontroll over tekniske
                skjemadata, kanoniske URL-er og 301-videresendinger.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </EditorialSection>

      {/* 7. FAQ SECTION (LIGHT) */}
      <FAQSection faqs={webFaqs} />

      {/* 8. BOTTOM CTA SECTION (SAND) */}
      <CtaSection
        bg="sand"
        label="SYNLIGHETSRAPPORTEN"
        title="Se den tekniske tilstanden på nettsiden deres."
        description="Kjør en gratis analyse på 45 sekunder. Vi kontrollerer blant annet 85 tekniske nettsidefaktorer samt Google Maps, norske kataloger og synlighet KI-assistenter som ChatGPT, Gemini, Claude og Perplexity."
        buttonText="Test nettsiden gratis →"
        buttonHref="/seo-analyse"
      />
    </>
  );
}