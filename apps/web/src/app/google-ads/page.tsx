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
import QualityScoreCalculator from "@/components/sections/QualityScoreCalculator";
import { SummaryList, SummaryItem } from "@/components/ui/SummaryList";
import AuditScannerHero from "@/components/synlighetsrapport/AuditScannerHero";

export const metadata: Metadata = {
  title: "Google Ads & Quality Score: Få lavere klikkpris",
  description:
    "En treg nettside gir lav Quality Score og tvinger dere til å betale opptil 400 % mer per klikk i Google Ads. Vi kombinerer teknisk SEO og målrettet annonsering.",
  alternates: {
    canonical: "https://flowwmedia.no/google-ads",
  },
  openGraph: {
    title:
      "Google Ads & Quality Score: Få lavere klikkpris | Floww Media",
    description:
      "En treg nettside gir lav Quality Score og tvinger dere til å betale opptil 400 % mer per klikk i Google Ads. Vi kombinerer teknisk SEO og målrettet annonsering.",
    type: "website",
    locale: "nb_NO",
    url: "https://flowwmedia.no/google-ads",
    siteName: "Floww Media",
    images: [
      {
        url: "/images/teamet.jpg",
        width: 1200,
        height: 630,
        alt: "Floww Media, Google Ads og Quality Score",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Google Ads & Quality Score: Få lavere klikkpris | Floww Media",
    description:
      "En treg nettside gir lav Quality Score og dyrere klikk i Google Ads. Vi kombinerer teknisk SEO og målrettet annonsering.",
    images: ["/images/teamet.jpg"],
  },
};

const adsFaqs: FAQItem[] = [
  {
    question: "Hva er Quality Score (kvalitetsscore) i Google Ads?",
    answer:
      "Quality Score er Googles vurdering av kvaliteten på søkeordene, annonsene og landingssidene deres på en skala fra 1 til 10. Scoren beregnes i hver eneste annonseauksjon ut fra tre faktorer: forventet klikkrate (CTR), annonserelevans og opplevelsen på landingssiden. En høy Quality Score belønnes med lavere pris per klikk (CPC) og bedre annonseplassering.",
  },
  {
    question: "Hvor mye mer betaler vi per klikk hvis nettsiden har lav Quality Score?",
    answer:
      "Google bruker kvalitetsscoren 5/10 som referansenivå. Faller landingssiden og annonsen ned til 1/10 på grunn av treg innlasting på mobil eller svak sammenheng mellom søkeord og overskrift, må dere betale opptil 400 prosent mer per klikk enn en konkurrent med normal score for nøyaktig samme plassering. Øker vi scoren til 8–10 av 10, kutter Google klikkprisen med opptil 50 prosent.",
  },
  {
    question: "Hvorfor selger dere ikke Google Ads uten å kontrollere nettsiden først?",
    answer:
      "Fordi det er dårlig økonomi å sende dyr, betalt trafikk inn på en landingsside som laster tregt på mobil eller mangler tydelige konverteringspunkter. Da betaler dere først overpris i selve annonseauksjonen, og mister deretter kunden før henvendelsen er sendt. Derfor starter vi alltid med å analysere den tekniske tilstanden på domenet i Synlighetsrapporten.",
  },
  {
    question: "Bør vi satse på Google Ads eller organisk SEO?",
    answer:
      "De mest lønnsomme virksomhetene bruker begge i riktig rekkefølge. Teknisk SEO og dedikerte tjenestesider senker først klikkprisen i Google Ads gjennom høyere Quality Score. Deretter bruker vi Google Ads kirurgisk på søkeord med høy margin mens vi bygger varige organiske topp-plasseringer i Google Søk og Google-kartet, slik at dere gradvis gjør dere mindre avhengige av å leie hvert eneste klikk.",
  },
  {
    question: "Hvordan måler Synlighetsrapporten annonseøkonomien vår?",
    answer:
      "I Del 4 av Synlighetsrapporten måler vi de tekniske faktorene som direkte styrer Quality Score og konvertering: mobilhastighet (LCP og INP), samsvar mellom søkeord og H1-struktur, HTTPS/sikkerhet, synlige konverteringspunkter over bretten og den faktiske Google Ads-verdien av søkevolumet i deres NACE-bransje.",
  },
];

export default function GoogleAdsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": "https://flowwmedia.no/google-ads/#service",
        name: "Google Ads, Quality Score og teknisk landingssideoptimalisering",
        description:
          "Kombinert teknisk SEO og Google Ads-forvaltning som løfter Quality Score, senker klikkprisen (CPC) og øker konverteringsraten for norske virksomheter.",
        url: "https://flowwmedia.no/google-ads",
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
            name: "Google Ads",
            item: "https://flowwmedia.no/google-ads",
          },
        ],
      },
    ],
  };

  return (
    <>
      <Script
        id="schema-service-google-ads"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. HERO SECTION (DARK) */}
      <PageHeader
        bg="dark"
        breadcrumbs={[
          { name: "Hjem", href: "/" },
          { name: "Google Ads" },
        ]}
        label="GOOGLE ADS & QUALITY SCORE"
        title="Betaler dere overpris for hvert eneste klikk i Google Ads?"
        description="I Google Ads betaler ikke alle det samme for førsteplassen. Google gir hver annonse en Quality Score fra 1 til 10 basert på relevans og den tekniske tilstanden på landingssiden deres. Har dere treg mobillasting og svak sidestruktur, straffes dere med opptil 400 % høyere klikkpris enn konkurrenten for nøyaktig samme plassering."
      >
        <div className="flex flex-wrap items-center gap-4">
          <Button href="/seo-analyse">
            Sjekk om nettsiden fordyrer annonsene deres →
          </Button>
          <Link
            href="#kalkulator"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-[3px] border border-brand-light/25 text-brand-light hover:border-brand-accent hover:text-brand-accent transition-colors text-micro uppercase tracking-wider font-semibold"
          >
            Test Quality Score-kalkulatoren ↓
          </Link>
        </div>
      </PageHeader>

      {/* 2. KEY FACTS BAR (LIGHT) */}
      <section
        aria-label="Nøkkelfakta om Google Ads og Quality Score"
        className="bg-brand-light"
      >
        <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8">
          <SummaryList
            withBorders
            className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
          >
            <SummaryItem label="Kvalitetsscore">
              Skala fra 1 til 10 i hver auksjon
            </SummaryItem>
            <SummaryItem label="Straff ved lav score">
              Opptil +400 % dyrere klikk
            </SummaryItem>
            <SummaryItem label="Gevinst ved topp-score">
              Opptil 50 % rabatt per klikk
            </SummaryItem>
            <SummaryItem label="Hastighetskrav">
              LCP under 2,5 sek på mobil
            </SummaryItem>
          </SummaryList>
        </div>
      </section>

      {/* 3. THE QUALITY SCORE MATH (LIGHT) */}
      <EditorialSection
        bg="light"
        label="Auksjonsmatematikken"
        title="Teknisk gjeld på nettsiden blir en skjult skatt på annonsebudsjettet."
        paragraphs={[
          <>
            Mange bedrifter tror at den som byr høyest i Google Ads automatisk
            vinner førsteplassen. Slik fungerer ikke auksjonen. Google ganger
            maksbudet ditt med annonsens <strong>Quality Score (1–10)</strong>{" "}
            for å avgjøre hvem som vises øverst, og hvor mye du faktisk må
            betale for klikket.
          </>,
          <>
            Når et tradisjonelt annonsebyrå kun justerer bud inne i Google
            Ads-kontoen mens trafikken sendes til en treg og ustrukturert{" "}
            <Link
              href="/nettsider"
              className="text-brand-pine font-semibold underline decoration-brand-pine/40 underline-offset-2"
            >
              nettside
            </Link>
            , faller kvalitetsscoren. Da må dere betale opptil 400 % mer per
            klikk enn en konkurrent med raskere kode og bedre{" "}
            <Link
              href="/seo"
              className="text-brand-pine font-semibold underline decoration-brand-pine/40 underline-offset-2"
            >
              teknisk SEO
            </Link>{" "}
            for å beholde nøyaktig samme synlighet.
          </>,
        ]}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mt-8 mb-10">
          <StatCard variant="dark" title="+400 %">
            høyere klikkpris (CPC) ved laveste Quality Score (1 av 10)
            sammenlignet med konkurrenter på normalnivået (5 av 10).
          </StatCard>
          <StatCard variant="dark" title="-50 %">
            lavere pris per klikk for annonsører som oppnår 10 av 10 i Quality
            Score gjennom rask og presis landingsside.
          </StatCard>
          <StatCard variant="dark" title="39 %">
            av vekten i Quality Score styres direkte av landingssideopplevelsen
            (hastighet, mobilkode og struktur).
          </StatCard>
        </div>

        <QuoteCard bg="sand" className="max-w-4xl">
          <p>
            De fleste byråer styrer Google Ads isolert fra kildekoden. De skrur
            opp klikkbudene inne i annonsekontoen uten å røre den trege
            landingssiden kunden lander på. Det eneste som skjer da, er at
            Google tar en høyere pris for samme trafikk.
          </p>
        </QuoteCard>
      </EditorialSection>

      {/* 4. INTERACTIVE QUALITY SCORE CALCULATOR (DARK) */}
      <QualityScoreCalculator variant="full" bg="dark" id="kalkulator" />

      {/* 5. INTERACTIVE SCANNER ENTRY POINT (SAND) */}
      <AuditScannerHero
        bg="sand"
        scannerVariant="dark"
        breadcrumbs={[]}
        label="SYNLIGHETSRAPPORTEN · DEL 4: ADS-ØKONOMI & QUALITY SCORE"
        titleAs="h2"
        titleSize="h2"
        title="Test hvordan Google vurderer landingssidene og annonseøkonomien deres."
        description="Skriv inn domenet deres nedenfor. På 45 sekunder måler motoren vår mobilhastighet (LCP, INP og TTFB), overskriftshierarki (H1–H3), konverteringspunkter og den kommersielle verdien av søkene i bransjen deres."
      />

      {/* 5. THE 3 COMPONENTS OF QUALITY SCORE (DARK) */}
      <EditorialSection
        bg="dark"
        label="De 3 komponentene i Quality Score"
        title="God teknisk SEO gir billigere annonser. Slik henger disiplinene sammen."
        paragraphs={[
          "Google vurderer tre tekniske og redaksjonelle forhold i millisekundet før en annonse vises. Når vi rydder i disse tre, faller klikkprisen samtidig som konverteringsraten øker:",
        ]}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mt-8 mb-10">
          <Card variant="light" accent="top" href="/nettsider" interactive>
            <CardHeader>
              <CardEyebrow>Komponent 1 · Teknisk ytelse</CardEyebrow>
              <CardTitle as="h3">Landingssideopplevelse</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Google måler reell innlasting på mobil (Core Web Vitals). Bruker
                hovedinnholdet (LCP) mer enn 2,5 sekunder på å laste, eller
                hopper skjermbildet under innlasting (CLS), settes karakteren
                til «Under gjennomsnittet» og klikkprisen spretter opp.
              </CardDescription>
            </CardContent>
          </Card>

          <Card variant="light" accent="top" href="/seo" interactive>
            <CardHeader>
              <CardEyebrow>Komponent 2 · Innholdssiloer</CardEyebrow>
              <CardTitle as="h3">Annonserelevans &amp; H1-samsvar</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Sender dere femten ulike søkeord til den samme generelle
                forsiden, taper dere relevans. Hver kjerneleveranse krever en
                dedikert tjenesteside der sidetittel, H1-overskrift og innhold
                stemmer overens med søket og annonseteksten.
              </CardDescription>
            </CardContent>
          </Card>

          <Card variant="light" accent="top" href="/lokal-seo" interactive>
            <CardHeader>
              <CardEyebrow>Komponent 3 · Tillit &amp; respons</CardEyebrow>
              <CardTitle as="h3">Forventet klikkrate &amp; CRO</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Strukturerte annonseelementer, verifiserte kundeomtaler,
                tydelig prisinformasjon og et synlig verdiforslag over bretten
                på mobil løfter både klikkraten (CTR) i søket og andelen
                besøkende som faktisk tar kontakt.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <QuoteCard bg="light" className="max-w-4xl">
          <p>
            <strong>Dobbel effekt av samme arbeid:</strong> Når vi optimaliserer
            Core Web Vitals og bygger dedikerte tjenestesider for organisk søk,
            skjer det to ting samtidig: dere klatrer gratis i det organiske
            søkeresultatet, og prisen dere betaler per klikk i Google Ads
            faller.
          </p>
        </QuoteCard>
      </EditorialSection>

      {/* 6. HYBRID STRATEGY: RENT WHILE WE BUILD, OWN WHEN WE RANK (SAND) */}
      <EditorialSection
        bg="sand"
        label="Samspillet mellom SEO og Ads"
        title="Bruk Google Ads kirurgisk mens vi bygger posisjonene dere eier."
        paragraphs={[
          "Målet vårt er aldri at dere skal bruke mest mulig penger på annonser. Målet er lavest mulig kostnad per ny, lønnsom kunde gjennom et styrt samspill mellom betalt og organisk synlighet:",
        ]}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mt-8">
          <Card variant="light" accent="left">
            <CardHeader>
              <CardEyebrow>Fase 1 · Grunnmuren</CardEyebrow>
              <CardTitle as="h3">Teknisk opprydding først</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Før vi skalerer annonsebudsjettet, sørger vi for at
                tjenestesidene laster på under 2,5 sekunder på mobil, har riktig
                H1–H3-struktur og måler reelle henvendelser. Det løfter Quality
                Score umiddelbart.
              </CardDescription>
            </CardContent>
          </Card>

          <Card variant="light" accent="left">
            <CardHeader>
              <CardEyebrow>Fase 2 · Presisjon</CardEyebrow>
              <CardTitle as="h3">Kirurgisk annonsering på høymargin-søk</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Vi byr kun på kommersielle søk med dokumentert kjøpsintensjon og
                høy kundeverdi i deres bransje, og filtrerer bort brede
                informasjonssøk som tømmer budsjettet uten å gi kunder.
              </CardDescription>
            </CardContent>
          </Card>

          <Card variant="light" accent="left">
            <CardHeader>
              <CardEyebrow>Fase 3 · Eierposisjon</CardEyebrow>
              <CardTitle as="h3">Skift fra leid til eid trafikk</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Etter hvert som dere tar topp 3-plasseringene i{" "}
                <Link
                  href="/lokal-seo"
                  className="text-brand-pine font-semibold underline decoration-brand-pine/40 underline-offset-2"
                >
                  Google-kartet
                </Link>{" "}
                og det{" "}
                <Link
                  href="/seo"
                  className="text-brand-pine font-semibold underline decoration-brand-pine/40 underline-offset-2"
                >
                  organiske søkeresultatet
                </Link>
                , kan annonsebudsjettet flyttes eller reduseres uten at
                kundestrømmen faller.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </EditorialSection>

      {/* 7. FAQ SECTION (LIGHT) */}
      <FAQSection faqs={adsFaqs} />

      {/* 8. BOTTOM CTA SECTION (SAND) */}
      <CtaSection
        bg="sand"
        label="SYNLIGHETSRAPPORTEN"
        title="Sjekk om trege landingssider fordyrer annonsene deres."
        description="Kjør en gratis analyse på 45 sekunder. Vi måler Core Web Vitals, landingssidestruktur, organisk synlighet og estimert annonseverdi for bedriften deres."
        buttonText="Test nettsiden gratis →"
        buttonHref="/seo-analyse"
      />
    </>
  );
}
