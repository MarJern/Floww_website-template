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
  title: "SEO & Søkemotoroptimalisering: Teknisk og Organisk Vekst",
  description:
    "Vi bygger organisk synlighet i Google gjennom teknisk SEO, semantiske innholdssiloer og målbar autoritet. Kun én samarbeidspartner per bransje. Test domenet gratis.",
  alternates: {
    canonical: "https://flowwmedia.no/seo",
  },
  openGraph: {
    title:
      "SEO & Søkemotoroptimalisering: Teknisk og Organisk Vekst | Floww Media",
    description:
      "Vi bygger organisk synlighet i Google gjennom teknisk SEO, semantiske innholdssiloer og målbar autoritet. Kun én samarbeidspartner per bransje.",
    type: "website",
    locale: "nb_NO",
    url: "https://flowwmedia.no/seo",
    siteName: "Floww Media",
    images: [
      {
        url: "/images/teamet.jpg",
        width: 1200,
        height: 630,
        alt: "Floww Media, SEO og søkemotoroptimalisering",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SEO & Søkemotoroptimalisering: Teknisk og Organisk Vekst | Floww Media",
    description:
      "Vi bygger organisk synlighet i Google gjennom teknisk SEO, semantiske innholdssiloer og målbar autoritet.",
    images: ["/images/teamet.jpg"],
  },
};

const seoFaqs: FAQItem[] = [
  {
    question: "Hva er forskjellen på teknisk SEO, On-Page SEO og Off-Page SEO?",
    answer:
      "Teknisk SEO handler om grunnmuren i kildekoden: lastetid (Core Web Vitals), serverrespons, skjemadata (JSON-LD) og at søkemotorene kan lese og indeksere sidene uten hindringer. On-Page SEO handler om innholdsarkitekturen: dedikerte landingssider for hver kjerneleveranse med strengt H1–H3-hierarki som svarer presist på det kunden søker etter. Off-Page SEO handler om ekstern autoritet: relevante innlenker fra norske bransjeaktører, redaksjonell omtale og konsistente selskapsopplysninger i offentlige registre.",
  },
  {
    question: "Hva er forskjellen på generell SEO og lokal SEO?",
    answer:
      "Lokal SEO fokuserer på synlighet i Googles kartpakke (Map Pack) for geografisk avgrensede søk der Google Business Profile og fysisk nærhet veier tyngst. Generell SEO fokuserer på de organiske søkeresultatene under kartet og nasjonale bransjesøk, der nettsidens tekniske tilstand, innholdssiloer og domeneautoritet avgjør rangeringen. I Synlighetsrapporten måler vi begge deler parallelt.",
  },
  {
    question: "Hvorfor tar dere kun én klient per bransje i hvert geografiske område?",
    answer:
      "De tre øverste organiske plasseringene i Google tar over halvparten av alle klikk. Et byrå som selger søkemotoroptimalisering til fire konkurrenter i samme bransje og by, må enten holde igjen eller la kundene by over hverandre. Vi velger én samarbeidspartner per kategori og setter hele vår tekniske og strategiske kapasitet bak den virksomheten.",
  },
  {
    question: "Hvordan henger klassisk SEO sammen med synlighet i ChatGPT, Gemini, Claude og Perplexity?",
    answer:
      "Språkmodellene henter kildegrunnlaget sitt direkte fra åpne søkeindekser, strukturerte skjemadata (JSON-LD Schema.org) og uavhengige autoritetskilder. En nettside med ren semantisk kode, høy organisk autoritet og entydige virksomhetsdata har 3,4 ganger høyere sannsynlighet for å bli sitert når kunden ber en AI-assistent om en anbefaling.",
  },
  {
    question: "Hvordan måler dere hvilke SEO-tiltak som gir best lønnsomhet?",
    answer:
      "Vi starter alltid med å kjøre domenet gjennom vår egenutviklede analyseplattform mot 245 vektede rangeringsfaktorer. Deretter kobler vi tekniske funn mot faktiske norske søkevolumer, klikkpriser i Google Ads og snittverdi per ny kunde i deres NACE-bransje. Da ser vi krone for krone hvilke hull som bør tettes først.",
  },
];

export default function SeoPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": "https://flowwmedia.no/seo/#service",
        name: "Søkemotoroptimalisering (Teknisk SEO, On-Page og Autoritet)",
        description:
          "Datadrevet søkemotoroptimalisering (SEO) bygget på teknisk nettsidearkitektur, semantiske innholdssiloer og verifisert lenke- og katalogautoritet for norske virksomheter.",
        url: "https://flowwmedia.no/seo",
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
            name: "SEO",
            item: "https://flowwmedia.no/seo",
          },
        ],
      },
    ],
  };

  return (
    <>
      <Script
        id="schema-service-seo"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. HERO SECTION (DARK) */}
      <PageHeader
        bg="dark"
        breadcrumbs={[
          { name: "Hjem", href: "/" },
          { name: "SEO" },
        ]}
        label="ORGANISK SØK & TEKNISK SEO"
        title="Organisk synlighet er ikke gjetting. Det er teknikk, innholdsstruktur og målbar autoritet."
        description="Når kunden søker etter tjenestene dere leverer i Google, avgjør tre målbare forhold hvem som vinner klikket: den tekniske grunnmuren i kildekoden, hvordan tjenestesidene besvarer søkeintensjonen, og hvilke eksterne kilder som bekrefter autoriteten deres. Vi bygger posisjoner dere eier selv, med kun én klient per bransje i hvert geografiske område."
      >
        <div className="flex flex-wrap items-center gap-4">
          <Button href="/seo-analyse">
            Kjør gratis SEO-analyse av domenet ditt →
          </Button>
        </div>
      </PageHeader>

      {/* 2. KEY FACTS BAR (LIGHT) */}
      <section
        aria-label="Nøkkelfakta om søkemotoroptimalisering"
        className="bg-brand-light"
      >
        <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8">
          <SummaryList
            withBorders
            className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
          >
            <SummaryItem label="Målepunkter">
              245 rangeringsfaktorer
            </SummaryItem>
            <SummaryItem label="De 3 pilarene">
              Teknisk, On-Page &amp; Off-Page
            </SummaryItem>
            <SummaryItem label="Klikkandel">
              Topp 3 tar 54 % av organiske klikk
            </SummaryItem>
            <SummaryItem label="Eksklusivitet">
              En klient per bransje
            </SummaryItem>
          </SummaryList>
        </div>
      </section>

      {/* 3. ECONOMICS OF ORGANIC SEARCH (LIGHT) */}
      <EditorialSection
        bg="light"
        label="Eie vs. leie trafikk"
        title="Forskjellen på førsteplass og side to i Google måles på bunnlinjen."
        paragraphs={[
          <>
            Kunder som bruker Google for å finne en fagperson, tjenesteyter eller
            B2B-leverandør har høy kjøpsintensjon. De tre øverste organiske
            treffene tar over halvparten av alle klikkene, mens under én prosent
            blar videre til side to. Ligger dere på åttendeplass, eksisterer
            dere i praksis ikke for majoriteten av markedet.
          </>,
          <>
            Mange bedrifter kompenserer for svak organisk synlighet ved å kjøpe
            dyre klikk i{" "}
            <Link
              href="/google-ads"
              className="text-brand-pine font-semibold underline decoration-brand-pine/40 underline-offset-2"
            >
              Google Ads
            </Link>{" "}
            måned etter måned. Utfordringen er at betalt trafikk stopper samme
            dag budsjettet skrus av, samtidig som tekniske mangler på nettsiden
            driver klikkprisene i været. Organisk synlighet og{" "}
            <Link
              href="/lokal-seo"
              className="text-brand-pine font-semibold underline decoration-brand-pine/40 underline-offset-2"
            >
              lokal synlighet i Google-kartet
            </Link>{" "}
            er derimot en varig eiendel i selskapet.
          </>,
        ]}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mt-8 mb-10">
          <StatCard variant="dark" title="54,4 %">
            av alle organiske klikk i Google går til de tre øverste
            plasseringene i søkeresultatet.
          </StatCard>
          <StatCard variant="dark" title="< 1 %">
            av brukerne klikker seg videre til side 2 i Google når de leter
            etter en leverandør.
          </StatCard>
          <StatCard variant="dark" title="0 kr">
            i klikkpris (CPC) for hver kunde som finner dere gjennom organisk
            rangering.
          </StatCard>
        </div>

        <QuoteCard bg="sand" className="max-w-4xl">
          <p>
            Betalt annonsering er å leie oppmerksomhet per klikk. Organisk
            synlighet er å eie posisjonen i markedet ditt. Når grunnmuren og
            autoriteten sitter, leverer søkemotoren kvalifiserte henvendelser
            hver uke uten at klikkprisen spiser opp marginen.
          </p>
        </QuoteCard>
      </EditorialSection>

      {/* 4. INTERACTIVE SCANNER ENTRY POINT (SAND) */}
      <AuditScannerHero
        bg="sand"
        scannerVariant="dark"
        breadcrumbs={[]}
        label="SYNLIGHETSRAPPORTEN · TEKNISK, ON-PAGE & AUTORITET"
        titleAs="h2"
        titleSize="h2"
        title="Se nøyaktig hva som holder domenet deres tilbake i Google."
        description="Skriv inn domenet deres nedenfor. På 45 sekunder kontrollerer vår egenutviklede motor 245 målepunkter på tvers av kildekode, hastighet, innholdsstruktur, lenkeautoritet og samsvar mot Brønnøysundregistrene."
      />

      {/* 5. THE 3 PILLARS OF SEO (DARK) */}
      <EditorialSection
        bg="dark"
        label="De tre grunnpilarene"
        title="Hva som faktisk avgjør hvem Google plasserer øverst."
        paragraphs={[
          "Søkemotoroptimalisering blir ofte fremstilt som uoversiktlig og abstrakt. I virkeligheten består disiplinen av tre konkrete og målbare lag som må fungere sammen. Svikter ett av dem, faller effekten av de to andre:",
        ]}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mt-8 mb-10">
          <Card variant="light" accent="top" href="/nettsider" interactive>
            <CardHeader>
              <CardEyebrow>Pilar 1 · 85 målepunkter</CardEyebrow>
              <CardTitle as="h3">Teknisk SEO &amp; arkitektur</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Søkemotoren må kunne hente, tolke og indeksere sidene lynraskt.
                Vi rydder i serverrespons (TTFB under 0,5 s), Core Web Vitals på
                mobil (LCP og INP), kanoniske URL-er, XML-sidekart og
                maskinlesbar JSON-LD Schema.org.
              </CardDescription>
            </CardContent>
          </Card>

          <Card variant="light" accent="top">
            <CardHeader>
              <CardEyebrow>Pilar 2 · Semantisk struktur</CardEyebrow>
              <CardTitle as="h3">On-Page SEO &amp; innholdssiloer</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                En samleside med ti tjenester rangerer sjelden på noen av dem.
                Vi bygger dedikerte landingssider for hvert høymargin-søk med
                strengt H1–H3-hierarki, presise metadata, intern lenkestruktur
                og tydelige konverteringspunkter.
              </CardDescription>
            </CardContent>
          </Card>

          <Card variant="light" accent="top" href="/ai-seo" interactive>
            <CardHeader>
              <CardEyebrow>Pilar 3 · 48 målepunkter</CardEyebrow>
              <CardTitle as="h3">Off-Page SEO &amp; autoritet</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Når to nettsider er like gode teknisk, vinner den med høyest
                tillit. Vi kartlegger lenkeprofilen fra norske bransjesider og
                medier, redaksjonelle omtaler og 100 % konsistente foretaksdata
                i Enhetsregisteret, 1881, Gule Sider og Proff.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <QuoteCard bg="light" className="max-w-4xl">
          <p>
            <strong>Rekkefølgen avgjør avkastningen:</strong> Mange produserer
            artikkel etter artikkel på en nettside med treg kode, flatt
            overskriftshierarki og sprikende firmainformasjon. Det gir minimal
            effekt. Vi fikser alltid den tekniske grunnmuren først, og bygger
            deretter ut tjenestesider og autoritet.
          </p>
        </QuoteCard>
      </EditorialSection>

      {/* 6. HOW SYNLIGHETSRAPPORTEN CONNECTS SEO TO REVENUE (SAND) */}
      <EditorialSection
        bg="sand"
        label="Fra analyse til bunnlinje"
        title="Slik kobler vi 245 tekniske målepunkter til tapt omsetning."
        paragraphs={[
          "Vi starter aldri et samarbeid med magefølelse eller generelle sjekklister. Plattformen vår måler tilstanden på domenet deres mot konkurrentene som ligger på topp 3 i deres bransje i dag:",
        ]}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mt-8">
          <Card variant="light" accent="left">
            <CardHeader>
              <CardEyebrow>Steg 1 · Sanntidsdata</CardEyebrow>
              <CardTitle as="h3">Teknisk revisjon uten synsing</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Motoren vår crawler kildekoden, måler reell mobilhastighet,
                validerer Schema.org og sjekker om viktige tjenestesider mangler
                eller kannibaliserer hverandre.
              </CardDescription>
            </CardContent>
          </Card>

          <Card variant="light" accent="left">
            <CardHeader>
              <CardEyebrow>Steg 2 · Bransjesammenligning</CardEyebrow>
              <CardTitle as="h3">Konkurrentgap per NACE-kode</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Ved å koble analysen direkte mot Brønnøysundregistrene måler vi
                dere mot de faktiske vinnerne i deres bransje, på både{" "}
                <Link
                  href="/lokal-seo"
                  className="text-brand-pine font-semibold underline decoration-brand-pine/40 underline-offset-2"
                >
                  Google-kartet
                </Link>
                , organisk søk og{" "}
                <Link
                  href="/ai-seo"
                  className="text-brand-pine font-semibold underline decoration-brand-pine/40 underline-offset-2"
                >
                  AI-søkemotorer
                </Link>
                .
              </CardDescription>
            </CardContent>
          </Card>

          <Card variant="light" accent="left">
            <CardHeader>
              <CardEyebrow>Steg 3 · Kommersiell effekt</CardEyebrow>
              <CardTitle as="h3">Prioritert etter kroneverdi</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Hvert funn vektes etter hvor mye trafikk og omsetning feilen
                koster dere hver måned, og hvor mye dere kan spare i løpende{" "}
                <Link
                  href="/google-ads"
                  className="text-brand-pine font-semibold underline decoration-brand-pine/40 underline-offset-2"
                >
                  Google Ads-budsjett
                </Link>{" "}
                ved å eie posisjonen selv.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </EditorialSection>

      {/* 7. FAQ SECTION (LIGHT) */}
      <FAQSection faqs={seoFaqs} />

      {/* 8. BOTTOM CTA SECTION (SAND) */}
      <CtaSection
        bg="sand"
        label="SYNLIGHETSRAPPORTEN"
        title="Sjekk hvor mye organisk trafikk dere går glipp av."
        description="Kjør en gratis analyse på 45 sekunder. Vi kontrollerer teknisk SEO, innholdsstruktur, autoritet, Google Maps og synlighet i ChatGPT, Gemini, Claude og Perplexity."
        buttonText="Test domenet ditt gratis →"
        buttonHref="/seo-analyse"
      />
    </>
  );
}
