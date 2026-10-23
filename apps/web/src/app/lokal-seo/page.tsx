import { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import AuditScannerHero from "@/components/synlighetsrapport/AuditScannerHero";
import CtaSection from "@/components/sections/CtaSection";
import EditorialSection from "@/components/sections/EditorialSection";
import FAQSection from "@/components/sections/FAQSection";
import Card, {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardEyebrow,
} from "@/components/ui/Card";
import QuoteCard from "@/components/ui/QuoteCard";
import StatCard from "@/components/ui/StatCard";
import PageHeader from "@/components/sections/PageHeader";
import { SummaryList, SummaryItem } from "@/components/ui/SummaryList";

export const metadata: Metadata = {
  title: "Lokal SEO & Synlighet i Google-kartet",
  description:
    "48 % av alle lokale søk går til de tre øverste i Google-kartet. Vi bygger lokal synlighet som gir lønnsomme kunder, med kun én samarbeidspartner per bransje.",
  alternates: {
    canonical: "https://flowwmedia.no/lokal-seo",
  },
  openGraph: {
    title: "Lokal SEO & Synlighet i Google-kartet | Floww Media",
    description:
      "48 % av alle lokale søk går til de tre øverste i Google-kartet. Vi bygger lokal synlighet som gir lønnsomme kunder, med kun én samarbeidspartner per bransje.",
    type: "website",
    locale: "nb_NO",
    url: "https://flowwmedia.no/lokal-seo",
    siteName: "Floww Media",
    images: [
      {
        url: "/images/teamet.jpg",
        width: 1200,
        height: 630,
        alt: "Floww Media, Lokal SEO og Google Kartpakken",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lokal SEO & Synlighet i Google-kartet | Floww Media",
    description:
      "48 % av alle lokale søk går til de tre øverste i Google-kartet. Vi bygger lokal synlighet som gir lønnsomme kunder.",
    images: ["/images/teamet.jpg"],
  },
};

const seoFaqs = [
  {
    question: "Hva er lokal SEO?",
    answer:
      "Lokal SEO handler om å bli valgt når noen i ditt geografiske nedslagsfelt søker etter tjenestene dere tilbyr. Google vurderer tre hovedfaktorer i kartpakken: relevans (hvor presist profilen og nettsiden matcher søket), avstand (hvor nær søkeren befinder seg), og autoritet (anmeldelser, lenker og konsistente virksomhetsdata i norske kataloger).",
  },
  {
    question: "Hvor stor andel av klikkene går til de tre øverste i Google-kartet?",
    answer:
      "Rundt 48 prosent av alle klikk på en lokal søkeside går til de tre øverste plasseringene i kartpakken (Map Pack). Førsteplassen tar cirka 17,6 prosent, andreplassen 15,4 prosent og tredjeplassen 15,1 prosent. Virksomheter i topp tre får i snitt 126 prosent mer trafikk enn dem på plass fire til ti.",
  },
  {
    question: "Hvordan måler dere lokal synlighet på tvers av en by eller kommune?",
    answer:
      "Plasseringen i Google-kartet varierer etter hvor kunden befinner seg når søket gjøres. Derfor måler vi aldri bare fra ett enkelt punkt. Vår analyseplattform bruker et 3×3 Geo-Grid som simulerer søk fra ni geografiske punkter rundt bedriften din, slik at vi ser nøyaktig i hvilke bydeler og gater dere vinner eller taper kunder.",
  },
  {
    question: "Hvorfor er norske katalogoppføringer (NAP) viktige for Google?",
    answer:
      "NAP står for navn, adresse og telefonnummer. Google kryssjekker opplysningene på Google Business-profilen og nettsiden din mot offisielle kilder som Brønnøysundregistrene, 1881, Gule Sider og Proff. Sprik i skrivemåte, gamle adresser eller feil telefonnummer svekker tilliten hos søkemotorene og demper synligheten i kartet.",
  },
  {
    question: "Hvorfor tar dere kun en klient per bransje i hvert område?",
    answer:
      "Det er bare tre plasser i toppen av Google-kartet. Skal vi løfte en virksomhet forbi alle andre i sitt lokale marked, kan vi ikke samtidig jobbe for konkurrenten i samme bydel eller kommune. Derfor inngår vi kun ett eksklusivt samarbeid per bransje i hvert geografiske område.",
  },
  {
    question: "Er lokalt søk i Google-kartet (Map Pack) viktig for alle bedrifter?",
    answer:
      "Nei, absolutt ikke. Lokal synlighet i kartet er helt avgjørende hvis du driver en fysisk virksomhet hvor kundene kommer til deg, eller du drar ut til dem i et bestemt geografisk område (for eksempel tannleger, håndverkere eller fysioterapeuter). For en programvarebedrift, en nettbutikk eller en B2B-leverandør som opererer nasjonalt, har kartplasseringen svært lite å si for bunnlinjen. I slike tilfeller vil analysen vår flagge manglende kartplassering som et avvik, men strategisk vil vi råde dere til å ignorere det, og heller fokusere innsatsen på organisk SEO og autoritet som treffer den nasjonale kjøperen. Vi bygger ikke synlighet for synlighetens skyld, vi bygger det som driver lønnsomhet i din bransje.",
  },
  {
    question: "Hvordan starter et samarbeid om lokal synlighet?",
    answer:
      "Alt starter med tall. Du kan kjøre en gratis forhåndsanalyse i vår SEO-analyse på 45 sekunder. Der ser vi teknisk status, 3×3 Geo-Grid i kartet og estimert tapt omsetning. Deretter vurderer vi sammen om det er grunnlag for et langsiktig samarbeid.",
  },
];

export default function SynlighetPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": "https://flowwmedia.no/lokal-seo/#service",
        name: "Lokal SEO, Google Business Profile og Google Kartpakken",
        description:
          "Lokal SEO, Google Business Profile og lokal synlighet for ambisiøse virksomheter i Norge. Vi tar kun én klient per bransje i hvert geografiske område.",
        url: "https://flowwmedia.no/lokal-seo",
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
            name: "Lokal SEO",
            item: "https://flowwmedia.no/lokal-seo",
          },
        ],
      },
    ],
  };

  return (
    <>
      <Script
        id="schema-service-lokal-seo"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      {/* 1. PAGE HERO (DARK) */}
      <PageHeader
        breadcrumbs={[
          { name: "Hjem", href: "/" },
          { name: "Lokal SEO" },
        ]}
        label="Lokal synlighet & Google Kartpakken"
        title="48 % av kundene velger en av de tre øverste i Google-kartet."
        description="Når noen søker etter en tjeneste i sitt nærområde, viser Google et kart med tre bedrifter øverst. Står dere utenfor disse tre, går kunden til konkurrenten. Vi kombinerer teknisk SEO, Google Business Profile og lokale autoritetssignaler for å ta posisjonen som gir lønnsomme henvendelser."
      />

      {/* SUMMARY BAR (LIGHT) */}
      <section className="bg-brand-light" aria-label="Nøkkeltall for lokal SEO">
        <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8">
          <SummaryList
            withBorders
            className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
          >
            <SummaryItem label="Kartpakken">48 % av alle lokale klikk</SummaryItem>
            <SummaryItem label="Målepunkter">245 faktorer i vår motor</SummaryItem>
            <SummaryItem label="Geografi">Målt i 3×3 Geo-Grid</SummaryItem>
            <SummaryItem label="Eksklusivitet">En klient per bransje</SummaryItem>
          </SummaryList>
        </div>
      </section>

      {/* 2. THE PROBLEM: CLICK DISTRIBUTION IN GOOGLE MAPS (LIGHT) */}
      <EditorialSection
        bg="light"
        label="Tallene bak kartet"
        title="Nesten halvparten av trafikken går til de tre øverste i Google-kartet."
        paragraphs={[
          "Lokale søk har høy kjøpsintensjon. Kunden leter ikke etter generell informasjon, de leter etter en tilbyder i nærheten de kan kontakte eller besøke nå. Google presenterer tre utvalgte bedrifter øverst i kartpakken, og det er disse tre som tar brorparten av kundestrømmen.",
        ]}
      >
        <div className="w-full max-w-4xl mt-6 md:mt-10 mb-8 sm:mb-10 md:mb-20">
          <div className="overflow-x-auto w-full -mx-4 px-4 sm:mx-0 sm:px-0 pb-4 mb-2 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-brand-pine [&::-webkit-scrollbar-thumb]:rounded-full">
            <div className="flex items-end justify-between h-[220px] sm:h-[280px] gap-2 lg:gap-3 min-w-[450px] sm:min-w-0">
              {[
                { pos: 1, val: "17,6 %", h: "h-full", hi: true },
                { pos: 2, val: "15,4 %", h: "h-[87%]", hi: true },
                { pos: 3, val: "15,1 %", h: "h-[85%]", hi: true },
                { pos: 4, val: "7,2 %", h: "h-[41%]", hi: false },
                { pos: 5, val: "5,1 %", h: "h-[29%]", hi: false },
                { pos: 6, val: "4,0 %", h: "h-[23%]", hi: false },
                { pos: 7, val: "3,2 %", h: "h-[18%]", hi: false },
                { pos: 8, val: "2,6 %", h: "h-[15%]", hi: false },
                { pos: 9, val: "2,1 %", h: "h-[12%]", hi: false },
                { pos: 10, val: "1,8 %", h: "h-[10%]", hi: false },
              ].map((bar) => (
                <div
                  key={bar.pos}
                  className="flex flex-col items-center justify-end w-full h-full group"
                >
                  <span
                    className={`text-[10px] sm:text-micro font-medium mb-2 sm:mb-3 whitespace-nowrap transition-colors ${bar.hi
                      ? "text-brand-dark"
                      : "text-brand-dark/40 group-hover:text-brand-dark/70"
                      }`}
                  >
                    {bar.val}
                  </span>
                  <div
                    className={`w-full rounded-t-[2px] transition-all duration-300 ${bar.h
                      } ${bar.hi
                        ? "bg-brand-accent"
                        : "bg-brand-dark/10 group-hover:bg-brand-dark/15"
                      }`}
                    aria-hidden="true"
                  />
                  <span className="text-[10px] sm:text-micro text-brand-dark/40 mt-2 sm:mt-3 mb-1">
                    {bar.pos}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pt-4 sm:pt-5 border-t border-brand-dark/10 mt-1 px-1">
              <p className="m-0 font-heading text-fluid-h4">
                48 % av klikkene går til de tre øverste
              </p>
              <p className="text-micro text-brand-dark/70 text-left sm:text-right mb-4 sm:mb-0">
                Andel av klikk per plassering i Googles lokalpakke
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 md:gap-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
            <StatCard variant="dark" title="126 %">
              mer trafikk til topp 3 enn til plass 4 til 10.
            </StatCard>

            <StatCard variant="dark" title="93 %">
              flere direkte anrop, nettsideklikk og veibeskrivelser.
            </StatCard>

            <StatCard variant="dark" title="3×3 Grid">
              viser hvordan plasseringen varierer fra gate til gate.
            </StatCard>
          </div>

          <QuoteCard bg="sand" className="mt-4 max-w-4xl">
            <p>
              Ligger dere på åttende- eller tolvteplass, må kunden aktivt åpne
              flere resultater og lete for å finne dere. Det er det svært få
              som gjør. Forskjellen på tredjeplass og tolvteplass i kartet er
              derfor ikke gradvis, den er nærmest av eller på.
            </p>
          </QuoteCard>
        </div>
      </EditorialSection>

      <AuditScannerHero
        bg="sand"
        scannerVariant="dark"
        titleAs="h2"
        title={
          <>
            Se hvor dere ligger i Google-kartet i dag {" "}
            <span className="text-brand-pine">
              og hva tapte plasseringer koster dere hver måned.
            </span>
          </>
        }
        description={
          <>
            Skriv inn domenet til virksomheten din. Vårt eget analyseverktøy
            kryssjekker bedriften mot <strong>Brønnøysundregistrene</strong>,
            simulerer lokal synlighet i et 3×3 Geo-Grid rundt adressen deres, og
            regner ut det økonomiske tapet før vi foreslår et eneste tiltak.
          </>
        }
      />

      {/* 4. THE SOLUTION: OUR METHODOLOGY & 6 WEIGHTED RANKING PILLARS (LIGHT) */}
      <EditorialSection
        bg="light"
        label="Metoden vår"
        title="Seks vektede områder avgjør hvem som vinner det lokale søket."
        paragraphs={[
          <>
            Å fylle ut Google Business-profilen alene er sjelden nok i bransjer
            med høy konkurranse. Google kryssjekker profilen mot{" "}
            <Link
              href="/nettsider"
              className="text-brand-pine font-semibold underline decoration-brand-pine/40 underline-offset-2"
            >
              den tekniske strukturen på nettsiden
            </Link>
            , hastigheten på mobil, lokale landingssider,{" "}
            <Link
              href="/seo"
              className="text-brand-pine font-semibold underline decoration-brand-pine/40 underline-offset-2"
            >
              lenkeautoritet
            </Link>{" "}
            og norske katalogregistre.
          </>,
          "Vektingen vår bygger på internasjonale rangeringsstudier for lokalt søk kalibrert mot norske søkedata, norske kataloger og vår egen plattform med 245 målepunkter.",
        ]}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 mb-12 max-w-5xl">
          <Card variant="dark" accent="top">
            <CardHeader>
              <CardTitle as="h3">Teknisk datafangst</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Plattformen vår henter inn teknisk oppsett, Schema.org-merking,
                Core Web Vitals, sidestruktur og katalogkonsistens automatisk.
              </CardDescription>
            </CardContent>
          </Card>
          <Card variant="dark" accent="top">
            <CardHeader>
              <CardTitle as="h3">3×3 Geo-Grid i kartet</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Vi måler kartplasseringen fra ni geografiske punkter rundt
                forretningsadressen deres, ikke bare fra ett enkelt postnummer.
              </CardDescription>
            </CardContent>
          </Card>
          <Card variant="dark" accent="top">
            <CardHeader>
              <CardTitle as="h3">Konkurrentgap</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                De tre øverste i kartet analyseres punkt for punkt mot deres
                egen profil og nettside, slik at vi ser nøyaktig hva som skiller
                dere.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <h3 className="font-heading text-fluid-h3 text-brand-dark mb-6">
          Hvordan rangeringsfaktorene vektes i lokalt søk
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 max-w-5xl">
          <Card variant="sand" accent="left">
            <CardHeader>
              <div className="font-heading text-fluid-h3 text-brand-pine leading-none mb-1">
                32 %
              </div>
              <CardTitle as="h4">Google Business Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Profilen er enkeltfaktoren som vektes tyngst i kartpakken.
                Valg av primærkategori, sekundærkategorier, strukturerte
                tjenester og verifisert plassering avgjør hvilke søk dere i det
                hele tatt vurderes for.
              </CardDescription>
            </CardContent>
          </Card>

          <Card variant="sand" accent="left">
            <CardHeader>
              <div className="font-heading text-fluid-h3 text-brand-pine leading-none mb-1">
                20 %
              </div>
              <CardTitle as="h4">Anmeldelser &amp; takt</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Antall omtaler, snittkarakter, svarfrekvens og ikke minst
                hyppighet. Jevn tilstrømming av nye, ekte kundeomtaler hver
                måned teller vesentlig mer enn et høyt antall som ble samlet for
                to år siden.
              </CardDescription>
            </CardContent>
          </Card>

          <Card variant="sand" accent="left">
            <CardHeader>
              <div className="font-heading text-fluid-h3 text-brand-pine leading-none mb-1">
                18 %
              </div>
              <CardTitle as="h4">Nettsted &amp; tjenestesider</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Teknisk hastighet, intern lenkestruktur, LocalBusiness
                JSON-LD-merking og dedikerte landingssider for hver kjerne-tjeneste
                dere leverer. Nettsiden bekrefter overfor Google at dere er en
                faglig autoritet.
              </CardDescription>
            </CardContent>
          </Card>

          <Card variant="sand" accent="left">
            <CardHeader>
              <div className="font-heading text-fluid-h3 text-brand-pine leading-none mb-1">
                15 %
              </div>
              <CardTitle as="h4">Lokale lenkesignaler</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Henvisende domener fra norske bransjeorganisasjoner, lokalpresse,
                samarbeidspartnere og relevante fagmiljøer. Ekte lokal omtale
                bygger autoritet som konkurrentene ikke kan kopiere over natten.
              </CardDescription>
            </CardContent>
          </Card>

          <Card variant="sand" accent="left">
            <CardHeader>
              <div className="font-heading text-fluid-h3 text-brand-pine leading-none mb-1">
                8 %
              </div>
              <CardTitle as="h4">Bruker- &amp; atferdssignaler</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Klikkrate fra søkeresultatet, telefonanrop, forespørsler om
                veibeskrivelse og tid brukt på nettsiden. Google måler om
                kundene faktisk velger og samhandler med oppføringen deres.
              </CardDescription>
            </CardContent>
          </Card>

          <Card variant="sand" accent="left">
            <CardHeader>
              <div className="font-heading text-fluid-h3 text-brand-pine leading-none mb-1">
                7 %
              </div>
              <CardTitle as="h4">NAP &amp; norske kataloger</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Navn, adresse og telefonnummer (NAP) må være 100 % konsistente
                mellom Brønnøysundregistrene, Google, nettsiden, 1881, Gule
                Sider og Proff. Avvik skaper tvil hos algoritmen.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <QuoteCard bg="sand" className="my-8 max-w-4xl">
          <p>
            Verktøyet vårt avslører nøyaktig hvor skoen trykker på sekunder.
            Resten handler om prioritering og gjennomføringskraft: å vite hvilke
            grep som gir raskest utslag på bunnlinjen i akkurat ditt marked.
          </p>
        </QuoteCard>
      </EditorialSection>

      {/* 5. BUSINESS MODEL & EXCLUSIVITY (DARK) */}
      <EditorialSection
        bg="dark"
        label="Forretningsmodellen"
        title="En klient per bransje. Målt i lønnsomme kunder."
        paragraphs={[
          "De fleste byråer selger faste timepakker til så mange bedrifter som mulig, gjerne tre eller fire konkurrenter i samme by. Men det finnes bare tre plasser øverst i Google-kartet. Hjelper du alle i samme bransje, hjelper du i praksis ingen.",
          <>
            Vi jobber derfor kun med en utvalgt virksomhet per bransje i hvert
            geografiske område. Før vi inngår et samarbeid, regner vi på hva en
            ny kunde er verdt for dere, hvor marginene er høyest, og hvor mye
            dere kan spare i{" "}
            <Link
              href="/google-ads"
              className="text-brand-accent font-semibold underline decoration-brand-accent/40 underline-offset-2"
            >
              løpende Google Ads-kostnader
            </Link>{" "}
            når{" "}
            <Link
              href="/seo"
              className="text-brand-accent font-semibold underline decoration-brand-accent/40 underline-offset-2"
            >
              den organiske posisjonen
            </Link>{" "}
            sitter.
          </>,
        ]}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 max-w-5xl">
          <StatCard variant="dark" accent="left" title="En">
            eksklusiv samarbeidspartner per bransje i hvert lokalmarked.
          </StatCard>
          <StatCard variant="dark" accent="left" title="100 %">
            seniorleveranse: De som analyserer og legger strategien, gjør også
            jobben.
          </StatCard>
          <StatCard variant="dark" accent="left" title="Bunnlinje">
            vi styrer etter kvalifiserte henvendelser og spart annonsekostnad,
            ikke tomme visningstall.
          </StatCard>
        </div>
      </EditorialSection>

      {/* 6. CONCRETE DELIVERABLES (LIGHT) */}
      <EditorialSection
        bg="light"
        label="Leveransen"
        title="Hva vi faktisk bygger og rydder opp i."
        paragraphs={[
          "Vi leverer ikke lange PDF-anbefalinger som blir liggende i en skuff hos utvikleren eller markedsavdelingen deres. Vi går selv inn i maskinrommet og gjennomfører endringene på tvers av profil, kode og kataloger.",
        ]}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8 max-w-5xl">
          <Card variant="sand" accent="top">
            <CardHeader>
              <CardTitle as="h3">Google Business Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Presist valg av primær- og sekundærkategorier, utbygging av
                tjenestekatalog, tjenesteområder, attribusjonssporing (UTM) og
                strukturerte beskrivelser som matcher søkeintensjonen.
              </CardDescription>
            </CardContent>
          </Card>

          <Card variant="sand" accent="top" href="/seo" interactive>
            <CardHeader>
              <CardTitle as="h3">Teknisk SEO &amp; tjenestesider</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Dedikerte landingssider for hver tjeneste og lokasjon, optimalisert
                for mobilhastighet (Core Web Vitals), lokal tittel- og
                overskriftsstruktur og tydelige konverteringspunkter.
              </CardDescription>
            </CardContent>
          </Card>

          <Card variant="sand" accent="top">
            <CardHeader>
              <CardTitle as="h3">JSON-LD Schema &amp; entitetsdata</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Maskinlesbar merking av organisasjonsnummer, geokoordinater,
                åpningstider, tjenester og omtaler i kildekoden, avgjørende for
                både Google-kartet og AI-søkemotorer.
              </CardDescription>
            </CardContent>
          </Card>

          <Card variant="sand" accent="top">
            <CardHeader>
              <CardTitle as="h3">NAP-opprydding i norske registre</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Full synkronisering av firmanavn, adresse og telefonnummer mot
                Enhetsregisteret, 1881, Gule Sider, Proff, Apple Maps og Bing
                Places.
              </CardDescription>
            </CardContent>
          </Card>

          <Card variant="sand" accent="top">
            <CardHeader>
              <CardTitle as="h3">Systematikk for kundeomtaler</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Praktisk oppsett med direkte omtalelenker, malverk og rutiner som
                gir en jevn strøm av autentiske anmeldelser fra fornøyde kunder,
                pluss strategi for profesjonell besvarelse.
              </CardDescription>
            </CardContent>
          </Card>

          <Card variant="sand" accent="top">
            <CardHeader>
              <CardTitle as="h3">Løpende Geo-Grid- og verdifølging</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Kontinuerlig måling av posisjoner i kartet,{" "}
                <Link
                  href="/seo"
                  className="text-brand-pine font-semibold underline decoration-brand-pine/40 underline-offset-2"
                >
                  organisk søk
                </Link>
                , anropsklikk og tilsvarende{" "}
                <Link
                  href="/google-ads"
                  className="text-brand-pine font-semibold underline decoration-brand-pine/40 underline-offset-2"
                >
                  Google Ads-verdi
                </Link>
                , slik at effekten på bunnlinjen alltid er dokumentert.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </EditorialSection>

      {/* 7. RELATED ARTICLES (SAND) */}
      <EditorialSection
        bg="sand"
        label="Fagartikler"
        title="Vi skriver åpent om det vi jobber med."
        paragraphs={[
          "Les våre grundige gjennomganger av hva som styrer rangeringen i Google-kartet og hvordan lokal synlighet fungerer i praksis.",
        ]}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 mb-8 w-full max-w-5xl">
          <Card
            accent="left"
            variant="light"
            href="/artikler/hvordan-komme-overst-i-google-kartet"
            interactive
          >
            <CardHeader>
              <CardTitle as="h3">
                Hvordan komme øverst i Google-kartet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                De tre øverste tar nesten halvparten av trafikken. Her er hva som
                avgjør plasseringen, i riktig rekkefølge.
              </CardDescription>
              <CardEyebrow className="mt-4">6 min lesetid</CardEyebrow>
            </CardContent>
          </Card>

          <Card
            accent="left"
            variant="light"
            href="/artikler/google-business-profil-klinikk"
            interactive
            className="h-full"
          >
            <CardHeader>
              <CardTitle as="h3">
                Slik setter du opp Google Business-profilen riktig
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Profilen er det tyngste enkeltverktøyet i lokalt søk. Se hvilke
                innstillinger som gir størst utslag.
              </CardDescription>
              <CardEyebrow className="mt-4">7 min lesetid</CardEyebrow>
            </CardContent>
          </Card>

          <Card
            accent="left"
            variant="light"
            href="/artikler/flere-anmeldelser-klinikk"
            interactive
          >
            <CardHeader>
              <CardTitle as="h3">
                Slik bygger dere flere og jevnere kundeomtaler
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Anmeldelser er nest viktigste rangeringsfaktor i kartet, men det
                er takten som teller mest.
              </CardDescription>
              <CardEyebrow className="mt-4">6 min lesetid</CardEyebrow>
            </CardContent>
          </Card>
        </div>

        <p className="m-0">
          <Link
            href="/artikler"
            className="text-brand-pine font-semibold text-fluid-p-lg underline decoration-brand-pine/40 underline-offset-2"
          >
            Se alle artiklene våre →
          </Link>
        </p>
      </EditorialSection>

      {/* 8. SENIOR AUTHORITY BANNER (DARK) */}
      <article className="py-[clamp(2.5rem,6vw,4.5rem)] bg-brand-dark text-center">
        <div className="mx-auto max-w-3xl w-full px-4 sm:px-6 md:px-8">
          <h2 className="text-fluid-h2 mb-4 text-brand-light">
            Vår metodikk er bygget på 15 års seniorerfaring med Norges største
            merkevarer.
          </h2>
          <Link
            href="/om-oss"
            className="inline-flex text-fluid-p-lg items-center gap-2 text-brand-rust hover:text-brand-sand transition-colors motion-reduce:transition-none mt-4"
          >
            Bli kjent med teamet i Floww Media{" "}
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </article>

      {/* 9. FAQ & CONVERSION CLOSER */}
      <FAQSection faqs={seoFaqs} />
      <CtaSection
        bg="sand"
        label="Eksklusivt samarbeid"
        title="Sjekk utgangspunktet til bedriften din."
        description="Kjør en gratis analyse på 45 sekunder for å se hvor dere ligger i Google-kartet i dag, eller ta kontakt med oss for å høre om bransjen din er ledig i ditt område."
        buttonText="Sjekk din bedrift →"
        buttonHref="/seo-analyse"
      />
    </>
  );
}