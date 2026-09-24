import { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import CtaSection from "@/components/sections/CtaSection";
import FAQSection from "@/components/sections/FAQSection";
import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardEyebrow, CardFooter } from "@/components/ui/Card";
import QuoteCard from "@/components/ui/QuoteCard";
import StatCard from "@/components/ui/StatCard";
import PageHeader from "@/components/sections/PageHeader";
import { SummaryList, SummaryItem } from "@/components/ui/SummaryList";

// --- PRIS- OG MATEMATIKK-KONSTANTER ---
const PRICE_TOTAL = "79 000";
const PRICE_UPFRONT = "39 500";
const PRICE_TIER_1 = "39 500"; // Topp 1-3
const PRICE_TIER_2 = "23 700"; // Topp 4-5
const PRICE_TIER_3 = "15 800"; // Topp 6-10

export const metadata: Metadata = {
  title: "Lokal SEO i Oslo: topp 3 i Google-kartet, eller gratis",
  description: `Lokal SEO og Google Business-profil for klinikker i Oslo. Halve honoraret faktureres først når dere ligger topp tre i kartet. ${PRICE_TOTAL} kr eks. mva.`,
  alternates: {
    canonical: "/synlighet",
  },
  openGraph: {
    title: "Lokal SEO i Oslo: topp 3 i Google-kartet, eller gratis",
    description: `Lokal SEO og Google Business-profil for klinikker i Oslo. Halve honoraret faktureres først når dere ligger topp tre i kartet. ${PRICE_TOTAL} kr eks. mva.`,
    type: "website",
    locale: "nb_NO",
    url: "https://flowwmedia.no/synlighet/",
    siteName: "Floww Media"
  },
};

const seoFaqs = [
  {
    question: "Hva er lokal SEO?",
    answer: "Lokal SEO handler om å bli synlig når noen i nærheten søker etter det du tilbyr. Google vurderer tre ting: hvor godt virksomheten matcher søket, hvor nær den ligger den som søker, og hvor etablert den framstår. Google Business-profilen er den viktigste enkeltfaktoren."
  },
  {
    question: "Hvor stor andel av klikkene går til de tre øverste i Google-kartet?",
    answer: "Rundt 48 prosent av alle klikk på en lokal søkeside går til de tre øverste i kartet. Førsteplassen tar cirka 17,6 prosent, andreplassen 15,4 og tredjeplassen 15,1. Virksomheter i topp tre får 126 prosent mer trafikk enn de på plass fire til ti."
  },
  {
    question: "Hva koster lokal SEO?",
    answer: `${PRICE_TOTAL} kroner eks. mva. Halvparten faktureres ved signering. Resten avhenger av oppnådd plassering etter åtte uker: ${PRICE_TIER_1} ved topp tre, ${PRICE_TIER_2} ved plass fire til fem, ${PRICE_TIER_3} ved plass seks til ti, og ingenting utenfor topp ti.`
  },
  {
    question: "Hvor lang tid tar det å komme på topp tre i Google-kartet?",
    answer: "Det tar ofte lengre tid enn man tror å rangere top tre i Google, spesielt i konkurranseutsatte bransjer. Vi har derfor åtte ukers leveringstid og vi jobber aktivt med å økte plasseringen gjennom hele perioden."
  },
  {
    question: "Hvordan måles plasseringen?",
    answer: "Plassering i Googles lokalpakke, målt fra klinikkens egen adresse, på tre til fem søkeord avtalt skriftlig før arbeidet starter. Lokalpakken er posisjonsavhengig, så målingen må ta utgangspunkt i ett fast sted."
  },
  {
    question: "Hva skjer hvis dere ikke når topp tre?",
    answer: "Da faktureres et redusert beløp avhengig av oppnådd plassering. Ved plassering utenfor topp ti faktureres ingenting utover forskuddet."
  }
];

export default function SynlighetPage() {
  const jsonLdLocalBusiness = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": "https://flowwmedia.no/#organization",
    "name": "Floww Media",
    "alternateName": "Floww Media",
    "description": "Lokal SEO og Google Business-profil for private klinikker i Oslo og omegn. Halve honoraret faktureres først ved oppnådd topp tre-plassering i Googles lokalpakke.",
    "url": "https://flowwmedia.no/lokal-seo/",
    "email": "kontakt@flowwmedia.no",
    "telephone": "+4745843554",
    "priceRange": `${PRICE_TOTAL} NOK`,
    "legalName": "Floww AS",
    "vatID": "NO922758476MVA",
    "identifier": {
      "@type": "PropertyValue",
      "propertyID": "Organisasjonsnummer",
      "value": "922758476"
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Edvard Storms gate 2",
      "postalCode": "0166",
      "addressLocality": "Oslo",
      "addressRegion": "Oslo",
      "addressCountry": "NO"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 59.9207,
      "longitude": 10.7376
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "08:00",
      "closes": "17:00"
    },
    "image": [
      "https://flowwmedia.no/images/teamet.jpg"
    ],
    "knowsAbout": [
      "Lokal SEO",
      "Google Business-profil",
      "Søkemotoroptimalisering",
      "Lokalpakken",
      "Organisk synlighet",
      "Nettsteder for klinikker"
    ],
    "areaServed": [
      { "@type": "City", "name": "Oslo" },
      { "@type": "City", "name": "Bærum" },
      { "@type": "City", "name": "Asker" },
      { "@type": "City", "name": "Lillestrøm" },
      { "@type": "City", "name": "Nordre Follo" }
    ],
    "audience": {
      "@type": "BusinessAudience",
      "name": "Private klinikker: fysioterapi, kiropraktikk, psykolog, tannlege, tannregulering og hudpleie"
    },
    "makesOffer": {
      "@type": "Offer",
      "price": "79000",
      "priceCurrency": "NOK",
      "description": `${PRICE_TOTAL} kr eks. mva. Halvparten ved signering, resten avhengig av oppnådd plassering etter åtte uker.`
    }
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Forside",
        "item": "https://flowwmedia.no/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Lokal SEO i Oslo",
        "item": "https://flowwmedia.no/lokal-seo/"
      }
    ]
  };

  return (
    <>
      <Script id="schema-local-business-synlighet" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdLocalBusiness) }} />
      <Script id="schema-breadcrumb-synlighet" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />

      <PageHeader
        label="Synlighet"
        title="Topp 3 i Google-kartet, eller så betaler du ikke.*"
        description="Lokal søkemotoroptimalisering: Vi sørger for at kundene finner deg når de søker. Halvparten betales ved oppstart. Resten avhenger av hvilken plassering dere oppnår etter 8 uker."
      />

      <section className="bg-brand-light">
        <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8">
          <SummaryList withBorders className="grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <SummaryItem label="Pris">{PRICE_TOTAL} kr eks. mva.</SummaryItem>
            <SummaryItem label="Omfang">109 kontrollpunkter</SummaryItem>
            <SummaryItem label="Leveringstid">Åtte uker</SummaryItem>
            <SummaryItem label="Område">Oslo og omegn</SummaryItem>
          </SummaryList>
        </div>
      </section>

      <article className="py-[clamp(2rem,6.5vw,5.4rem)] bg-brand-light">
        <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8 grid grid-cols-1 md:grid-cols-[minmax(0,7rem)_minmax(0,1fr)] gap-[clamp(1.2rem,4vw,3.2rem)] items-start">

          <p className="text-micro uppercase text-brand-dark/50 m-0 mt-2">
            Hvorfor de tre øverste alltid er målet
          </p>

          <div>
            <h2 className="font-heading text-fluid-h2 mb-5 text-brand-dark">
              Nesten halvparten av trafikken går til de tre øverste i Google-kartet.
            </h2>
            <p className="text-fluid-p-lg text-brand-dark/90 max-w-prose mb-8 md:mb-14 text-pretty">
              Når noen søker etter en klinikk i nærheten, får de opp et kart med tre navn. Nesten halvparten av all trafikk går til disse tre.
            </p>

            <div className="w-full max-w-4xl mb-8 md:mb-16 sm:mb-10 md:mb-20">

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
                    <div key={bar.pos} className="flex flex-col items-center justify-end w-full h-full group">
                      <span className={`text-[10px] sm:text-micro font-medium mb-2 sm:mb-3 whitespace-nowrap transition-colors ${bar.hi ? "text-brand-dark" : "text-brand-dark/40 group-hover:text-brand-dark/70"}`}>
                        {bar.val}
                      </span>
                      <div className={`w-full rounded-t-[2px] transition-all duration-300 ${bar.h} ${bar.hi ? "bg-brand-accent" : "bg-brand-dark/10 group-hover:bg-brand-dark/15"}`}></div>
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
                  {/* Her er det lagt til mb-8 (margin-bottom) på mobil, som nullstilles (sm:mb-0) på desktop */}
                  <p className="m-0 text-micro text-brand-dark/70 text-left sm:text-right mb-4 sm:mb-0">
                    Andel av klikk, estimat basert på publiserte bransjetall
                  </p>
                </div>
              </div>

            </div>

            <div className="flex flex-col gap-6 md:gap-12">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl">
                <StatCard variant="dark" title="126 %">
                  mer trafikk enn plass 4 til 10.
                </StatCard>

                <StatCard variant="dark" title="93 %">
                  flere anrop, klikk og veibeskrivelser.
                </StatCard>

                <StatCard variant="dark" title="55 %">
                  av rangeringen avgjøres av nærhet.
                </StatCard>
              </div>

              <QuoteCard bg="sand" className="mt-8 max-w-4xl">
                <p>
                  Ligger dere på tolvteplass, må pasienten aktivt lete for å finne dere. Det er det få som gjør. Forskjellen på tredjeplass og tolvteplass er derfor ikke gradvis, den er nærmest av eller på.
                </p>
              </QuoteCard>
            </div>

          </div>
        </div>
      </article>

      <article className="py-[clamp(2rem,6.5vw,5.4rem)] bg-brand-sand">
        <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8 grid grid-cols-1 md:grid-cols-[minmax(0,7rem)_minmax(0,1fr)] gap-[clamp(1.2rem,4vw,3.2rem)] items-start">

          <p className="text-micro uppercase text-brand-dark/50 m-0 mt-2">
            Slik starter det
          </p>

          <div>
            <h2 className="font-heading text-fluid-h2 mb-5 text-brand-dark max-w-[25ch]">
              Auditen danner grunnlaget. Den koster ingenting.
            </h2>
            <p className="text-fluid-p-lg text-brand-dark/90 max-w-prose mb-6 md:mb-12 text-pretty">
              To forskjellige ting, og det er lett å blande dem. Auditen er gratis og tar oss en halvtime. Synlighetsanalysen er selve oppdraget, med åtte ukers arbeid.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-5xl">
              <Card accent="top" variant="light">
                <CardHeader>
                  <CardEyebrow>Trinn 1</CardEyebrow>
                  <CardTitle as="h3">Gratis audit</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-fluid-p-lg text-brand-pine font-medium mb-6">0 kr</p>
                  <CardDescription className="text-fluid-p-lg">
                    Vi søker opp klinikken fra deres egen adresse og ser hvor dere ligger i Google-kartet i dag.
                  </CardDescription>

                  <ul className="flex flex-col m-0 p-0 list-none my-8">
                    <li className="py-3 border-t border-brand-dark/10 flex items-start gap-3">
                      <span className="text-brand-dark/30 mt-[2px]">—</span>
                      <span>Plasseringen deres på de viktigste søkeordene</span>
                    </li>
                    <li className="py-3 border-t border-brand-dark/10 flex items-start gap-3">
                      <span className="text-brand-dark/30 mt-[2px]">—</span>
                      <span>Hvem som ligger over dere, og hvor mange anmeldelser de har</span>
                    </li>
                    <li className="py-3 border-t border-brand-dark/10 flex items-start gap-3">
                      <span className="text-brand-dark/30 mt-[2px]">—</span>
                      <span>De tre tydeligste svakhetene vi ser</span>
                    </li>
                    <li className="py-3 border-t border-brand-dark/10 flex items-start gap-3">
                      <span className="text-brand-dark/30 mt-[2px]">—</span>
                      <span>En kort samtale om hva vi fant</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <p className="text-micro m-0">
                    Tar en halvtime. Ingen forpliktelser.
                  </p>
                </CardFooter>
              </Card>

              <Card variant="dark">
                <CardHeader>
                  <CardEyebrow className="!text-brand-accent">Trinn 2</CardEyebrow>
                  <CardTitle as="h3">Synlighetsanalysen</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-fluid-p-lg text-brand-accent font-medium mb-6">{PRICE_TOTAL} kr eks. mva.</p>
                  <CardDescription className="text-fluid-p-lg">
                    Hele oppdraget: full gjennomgang av 109 kontrollpunkter, og åtte uker med arbeid for å løfte dere til topp tre.
                  </CardDescription>

                  <ul className="flex flex-col m-0 p-0 list-none my-8">
                    <li className="py-3 border-t border-brand-light/10 text-brand-light flex items-start gap-3">
                      <span className="text-brand-light/30 mt-[2px]">—</span>
                      <span>109 kontrollpunkter i seks vektede områder</span>
                    </li>
                    <li className="py-3 border-t border-brand-light/10 text-brand-light flex items-start gap-3">
                      <span className="text-brand-light/30 mt-[2px]">—</span>
                      <span>Grundig analyse av de tre øverste konkurrentene</span>
                    </li>
                    <li className="py-3 border-t border-brand-light/10 text-brand-light flex items-start gap-3">
                      <span className="text-brand-light/30 mt-[2px]">—</span>
                      <span>Åtte uker med gjennomføring, ikke bare anbefalinger</span>
                    </li>
                    <li className="py-3 border-t border-brand-light/10 text-brand-light flex items-start gap-3">
                      <span className="text-brand-light/30 mt-[2px]">—</span>
                      <span>Måling før og etter fra samme punkt</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <p className="text-micro text-brand-light m-0">
                    Halvparten ved oppstart. Resten avhenger av plasseringen dere oppnår.
                  </p>
                </CardFooter>
              </Card>

            </div>
          </div>
        </div>
      </article>

      <article className="py-[clamp(2rem,6.5vw,5.4rem)] bg-brand-light">
        <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8 grid grid-cols-1 md:grid-cols-[minmax(0,7rem)_minmax(0,1fr)] gap-[clamp(1.2rem,4vw,3.2rem)] items-start">
          <p className="text-micro uppercase text-brand-dark/50 m-0 mt-2">
            Bransjefokus
          </p>
          <div>
            <h2 className="font-heading text-fluid-h2 mb-5 text-brand-dark">
              Hvorfor bare klinikker.
            </h2>
            <p className="text-fluid-p-lg text-brand-dark/90 mb-5 text-pretty">
              Vi kjenner konkurransebildet i hver bydel, vi vet hvilke kategorier som gjelder, og vi vet hva som faktisk flytter en klinikk oppover framfor hva som bare ser bra ut i en rapport.
            </p>
            <p className="text-fluid-p-lg text-brand-dark/90 mb-10 text-pretty">
              Et byrå som tar alle bransjer må sette seg inn i markedet ditt hver gang. Vi kjenner det allerede.
            </p>
          </div>
        </div>
      </article>

      <article className="py-[clamp(2rem,6.5vw,5.4rem)] bg-brand-sand">
        <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8 grid grid-cols-1 md:grid-cols-[minmax(0,7rem)_minmax(0,1fr)] gap-[clamp(1.2rem,4vw,3.2rem)] items-start">

          <p className="text-micro uppercase text-brand-dark/50 m-0 mt-2">
            Hvorfor det lønner seg
          </p>

          <div className="w-full">
            <h2 className="font-heading text-fluid-h2 mb-5 text-brand-dark max-w-[22ch]">
              1,3 nye kunder i måneden dekker hele investeringen.
            </h2>
            <p className="text-fluid-p-lg text-brand-dark/90 max-w-prose mb-8 md:mb-14 text-pretty">
              Et eksempel fra en fysioterapiklinikk, med lave inntektsprognoser. Gjenkjøp er ikke regnet med.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-8 w-full max-w-4xl">
              <StatCard className="flex-1 w-full" title="850 kr">
                per behandling
              </StatCard>
              <div className="text-brand-dark font-heading text-2xl hidden sm:block">
                ×
              </div>
              <StatCard className="flex-1 w-full" title="6">
                behandlinger i et forløp
              </StatCard>
              <div className="text-brand-dark font-heading text-2xl hidden sm:block">
                =
              </div>
              <StatCard variant="dark" className="flex-[1.2] w-full" title="5 100 kr">
                én ny pasient
              </StatCard>
            </div>

            <Card variant="dark" className="md:flex-row md:items-end justify-between gap-4 mb-10 max-w-4xl">
              <CardHeader className="!mb-0">
                <CardEyebrow >Nullpunkt</CardEyebrow>
                <CardTitle>
                  15,5 nye pasienter
                </CardTitle>
              </CardHeader>
              <CardContent className="md:pb-1">
                <p className="text-micro text-brand-light">
                  gjennom året, altså 1,3 i måneden
                </p>
              </CardContent>
            </Card>

            <div className="max-w-4xl mb-8 md:mb-16">
              <div className="flex flex-col sm:flex-row sm:justify-between text-brand-dark/50 mb-4 px-1 gap-2 sm:gap-4">
                <span className="font-semibold sm:font-normal">Nye pasienter i måneden</span>
                <span className="text-sm sm:text-base leading-snug">Grått er tiden det tar. Grønt er resten av året i ren gevinst.</span>
              </div>

              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-[1rem_1fr_4rem] sm:grid-cols-[1.5rem_1fr_4rem] gap-4 items-center">
                  <span className="font-bold text-brand-pine text-micro">2</span>
                  <div className="w-full h-3 sm:h-4 flex rounded-sm overflow-hidden">
                    <div className="bg-brand-dark/15 h-full w-[64.5%]"></div>
                    <div className="bg-brand-pine h-full flex-1"></div>
                  </div>
                  <span className="text-micro text-brand-dark/90 text-right font-medium">7,7 mnd</span>
                </div>
                <div className="grid grid-cols-[1rem_1fr_4rem] sm:grid-cols-[1.5rem_1fr_4rem] gap-4 items-center">
                  <span className="font-bold text-brand-pine text-micro">3</span>
                  <div className="w-full h-3 sm:h-4 flex rounded-sm overflow-hidden">
                    <div className="bg-brand-dark/15 h-full w-[43%]"></div>
                    <div className="bg-brand-pine h-full flex-1"></div>
                  </div>
                  <span className="text-micro text-brand-dark/90 text-right font-medium">5,2 mnd</span>
                </div>
                <div className="grid grid-cols-[1rem_1fr_4rem] sm:grid-cols-[1.5rem_1fr_4rem] gap-4 items-center">
                  <span className="font-bold text-brand-dark text-micro">5</span>
                  <div className="w-full h-3 sm:h-4 flex rounded-sm overflow-hidden">
                    <div className="bg-brand-dark/15 h-full w-[26%]"></div>
                    <div className="bg-brand-accent h-full flex-1"></div>
                  </div>
                  <span className="text-micro text-brand-pine text-right font-bold">3,1 mnd</span>
                </div>
                <div className="grid grid-cols-[1rem_1fr_4rem] sm:grid-cols-[1.5rem_1fr_4rem] gap-4 items-center">
                  <span className="font-bold text-brand-dark text-micro">8</span>
                  <div className="w-full h-3 sm:h-4 flex rounded-sm overflow-hidden">
                    <div className="bg-brand-dark/15 h-full w-[16%]"></div>
                    <div className="bg-brand-accent h-full flex-1"></div>
                  </div>
                  <span className="text-micro text-brand-pine text-right font-bold">1,9 mnd</span>
                </div>
              </div>
            </div>

            <div className="max-w-4xl mb-10 md:mb-20">
              <h3 className="font-heading text-fluid-h3 text-brand-dark mb-2">
                Igjen etter at analysen er betalt, første år
              </h3>
              <p className="text-fluid-p-lg text-brand-dark/90 mb-6">
                Samlet pasientverdi over tolv måneder, minus investeringen på {PRICE_TOTAL} kr.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card accent="left">
                  <CardHeader>
                    <CardEyebrow className="text-micro text-brand-dark/70">2 nye i måneden</CardEyebrow>
                    <CardTitle as="span" className="text-fluid-h4">43 400 kr</CardTitle>
                  </CardHeader>
                </Card>
                <Card accent="left">
                  <CardHeader>
                    <CardEyebrow className="text-micro text-brand-dark/70">3 nye i måneden</CardEyebrow>
                    <CardTitle as="span" className="text-fluid-h4">104 600 kr</CardTitle>
                  </CardHeader>
                </Card>
                <Card accent="left">
                  <CardHeader>
                    <CardEyebrow className="text-micro text-brand-dark/70">5 nye i måneden</CardEyebrow>
                    <CardTitle as="span" className="text-fluid-h4">227 000 kr</CardTitle>
                  </CardHeader>
                </Card>
                <Card accent="left">
                  <CardHeader>
                    <CardEyebrow className="text-micro text-brand-dark/70">8 nye i måneden</CardEyebrow>
                    <CardTitle as="span" className="text-fluid-h4">410 600 kr</CardTitle>
                  </CardHeader>
                </Card>
              </div>
            </div>

            <div className="max-w-4xl mb-8 md:mb-16">
              <h3 className="font-heading text-fluid-h3 text-brand-dark mb-4">
                Nullpunkt i andre nisjer
              </h3>
              <p className="text-fluid-p-lg text-brand-dark/90 max-w-prose mb-8 text-pretty">
                Fysioterapi har lavest verdi per pasient. For de øvrige er regnestykket vesentlig bedre.
              </p>

              <div className="w-full">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="py-2 pr-2 sm:py-4 sm:pr-4 border-b border-brand-dark/20 text-[10px] sm:text-micro uppercase text-brand-dark/50 font-bold align-bottom leading-tight">
                        Bransje
                      </th>
                      <th className="py-2 px-2 sm:py-4 sm:px-4 border-b border-brand-dark/20 text-[10px] sm:text-micro uppercase text-brand-dark/50 font-bold text-center align-bottom leading-tight">
                        Verdi per <br className="sm:hidden" />pasient
                      </th>
                      <th className="py-2 pl-2 sm:py-4 sm:pl-4 border-b border-brand-dark/20 text-[10px] sm:text-micro uppercase text-brand-dark/50 font-bold text-right align-bottom leading-tight">
                        Nye pasienter <br className="sm:hidden" />før betalt
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-brand-dark/80 text-sm sm:text-base">
                    <tr>
                      <td className="py-3 pr-2 sm:py-4 sm:pr-4 font-bold text-brand-dark">Tannregulering</td>
                      <td className="py-3 px-2 sm:py-4 sm:px-4 text-center whitespace-nowrap">57 750 kr</td>
                      <td className="py-3 pl-2 sm:py-4 sm:pl-4 text-right text-brand-blue font-medium text-xl sm:text-fluid-h4 whitespace-nowrap">1,4</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-2 sm:py-4 sm:pr-4 font-bold text-brand-dark">Psykolog</td>
                      <td className="py-3 px-2 sm:py-4 sm:px-4 text-center whitespace-nowrap">23 400 kr</td>
                      <td className="py-3 pl-2 sm:py-4 sm:pl-4 text-right text-brand-blue font-medium text-xl sm:text-fluid-h4 whitespace-nowrap">3,4</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-2 sm:py-4 sm:pr-4 font-bold text-brand-dark">Hudpleieklinikk</td>
                      <td className="py-3 px-2 sm:py-4 sm:px-4 text-center whitespace-nowrap">14 520 kr</td>
                      <td className="py-3 pl-2 sm:py-4 sm:pl-4 text-right text-brand-blue font-medium text-xl sm:text-fluid-h4 whitespace-nowrap">5,4</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-2 sm:py-4 sm:pr-4 text-brand-dark">Tannlege</td>
                      <td className="py-3 px-2 sm:py-4 sm:px-4 text-center whitespace-nowrap">7 560 kr</td>
                      <td className="py-3 pl-2 sm:py-4 sm:pl-4 text-right text-brand-dark/70 text-base sm:text-fluid-p whitespace-nowrap">10,4</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-2 sm:py-4 sm:pr-4 text-brand-dark">Fysioterapi</td>
                      <td className="py-3 px-2 sm:py-4 sm:px-4 text-center whitespace-nowrap">6 720 kr</td>
                      <td className="py-3 pl-2 sm:py-4 sm:pl-4 text-right text-brand-dark/70 text-base sm:text-fluid-p whitespace-nowrap">11,8</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-2 sm:py-4 sm:pr-4 text-brand-dark">Kiropraktikk</td>
                      <td className="py-3 px-2 sm:py-4 sm:px-4 text-center whitespace-nowrap">6 375 kr</td>
                      <td className="py-3 pl-2 sm:py-4 sm:pl-4 text-right text-brand-dark/70 text-base sm:text-fluid-p whitespace-nowrap">12,4</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-micro text-brand-dark/70 mt-4 mb-0">
                Verdien per pasient er regnet med gjenkjøp. Tallene justeres etter klinikkens faktiske priser i gjennomgangen.
              </p>
            </div>

            <QuoteCard bg="light" className="mt-8 max-w-4xl">
              <p>
                En tannreguleringsklinikk trenger halvannen ny pasient før investeringen er dekket. Det er derfor vi tør binde halve honoraret til resultatet.              </p>
            </QuoteCard>

          </div>
        </div>
      </article>

      <article className="py-[clamp(2rem,6.5vw,5.4rem)] bg-brand-light">
        <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8 grid grid-cols-1 md:grid-cols-[minmax(0,7rem)_minmax(0,1fr)] gap-[clamp(1.2rem,4vw,3.2rem)] items-start">
          <p className="text-micro uppercase text-brand-dark/50 m-0 mt-2">
            Metoden vår
          </p>
          <div className="w-full">
            <h2 className="font-heading text-fluid-h2 mb-5 text-brand-dark">
              Synlighetsanalysen
            </h2>
            <p className="text-fluid-p-lg font-medium text-brand-dark/90 max-w-prose mb-4 text-pretty">
              Bransjens mest omfattende analyse for lokal synlighet, med 109 kontrollpunkter som grupperes og vektes.
            </p>
            <p className="text-fluid-p-lg text-brand-dark/90 max-w-prose mb-6 md:mb-12 text-pretty">
              Vektingen følger Whitesparks Local Search Ranking Factors, der 47 av fagfeltets ledende spesialister årlig rangerer 187 faktorer etter observert effekt. Vi supplerer med kjennskap til det lokale markedet i Oslo.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 md:mb-16 max-w-5xl">
              <Card variant="dark" accent="top">
                <CardHeader>
                  <CardTitle as="h3">Automatisert</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>56 punkter hentes direkte fra nettstedet: teknisk oppsett, struktur, merking og innhold på hver enkelt side.</CardDescription>
                </CardContent>
              </Card>
              <Card variant="dark" accent="top">
                <CardHeader>
                  <CardTitle as="h3">Manuelt</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>53 punkter observeres manuelt. Google-profilen, anmeldelsene og kartet, målt fra klinikkens egen adresse.</CardDescription>
                </CardContent>
              </Card>
              <Card variant="dark" accent="top">
                <CardHeader>
                  <CardTitle as="h3">Grundig konkurrentanalyse</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>De tre øverste i kartet analyseres og sammenlignes. Topp tre er en konkurranse hvor vår lange erfaring fra søk og lokalkjennskap ofte er det som vipper vektskålen i vår favør.</CardDescription>
                </CardContent>
              </Card>
            </div>

            <h3 className="font-heading text-fluid-h3 text-brand-dark mb-6">
              De seks områdene og hvordan de vektes
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 md:mb-12 max-w-5xl">
              <Card variant="sand" accent="left">
                <CardHeader>
                  <div className="font-heading text-fluid-h3 text-brand-pine leading-none mb-1">
                    32 %
                  </div>
                  <CardTitle as="h4">Google Business Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Google Business-profilen og alt som omhandler den er det som vektes høyest av alle rangeringsfaktorene. Primærkategorien alene avgjør hvilke søk dere i det hele tatt vurderes for.</CardDescription>
                </CardContent>
              </Card>

              <Card variant="sand" accent="left">
                <CardHeader>
                  <div className="font-heading text-fluid-h3 text-brand-pine leading-none mb-1">
                    20 %
                  </div>
                  <CardTitle as="h4">Anmeldelser</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Antall, snittkarakter og hyppighet. Hyppighet er hvor jevnt nye anmeldelser kommer inn, og den teller mer enn totalen. Fire nye i måneden, hver måned, er verdt mer enn hundre som kom for to år siden.</CardDescription>
                </CardContent>
              </Card>

              <Card variant="sand" accent="left">
                <CardHeader>
                  <div className="font-heading text-fluid-h3 text-brand-pine leading-none mb-1">
                    18 %
                  </div>
                  <CardTitle as="h4">Nettstedet</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Teknisk rigg med hastighet og lastetid, sidestruktur, egen side per behandling, og merking Google kan lese. Egne behandlingssider er det enkeltgrepet som gir mest på nettstedet, og de færreste klinikker har dem.</CardDescription>
                </CardContent>
              </Card>

              <Card variant="sand" accent="left">
                <CardHeader>
                  <div className="font-heading text-fluid-h3 text-brand-pine leading-none mb-1">
                    15 %
                  </div>
                  <CardTitle as="h4">Lenkesignaler</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Lenker fra foreninger, idrettslag, lokalaviser og samarbeidende klinikker. Lokale lenker teller langt tyngre enn generelle kataloger, og dette er området nesten ingen klinikker jobber systematisk med.</CardDescription>
                </CardContent>
              </Card>

              <Card variant="sand" accent="left">
                <CardHeader>
                  <div className="font-heading text-fluid-h3 text-brand-pine leading-none mb-1">
                    8 %
                  </div>
                  <CardTitle as="h4">Atferdssignaler</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Anrop, klikk til nettstedet og forespørsler om veibeskrivelse. Google måler hvor stor andel av dem som ser profilen som faktisk gjør noe, og bruker det som et signal på relevans.</CardDescription>
                </CardContent>
              </Card>

              <Card variant="sand" accent="left">
                <CardHeader>
                  <div className="font-heading text-fluid-h3 text-brand-pine leading-none mb-1">
                    7 %
                  </div>
                  <CardTitle as="h4">NAP og kataloger</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>NAP står for navn, adresse og telefonnummer. Disse må stå helt identisk på Google-profilen, nettstedet og i alle registre dere er oppført i. Minste avvik i skrivemåte demper plasseringen.</CardDescription>
                </CardContent>
              </Card>

            </div>

            <QuoteCard bg="sand" className="my-8 max-w-4xl">
              <p>
                Verktøyet henter det som kan hentes. Resten krever at noen vurderer hva som er verdt å prioritere i nettopp dette området og nettopp denne bransjen. Det krever lang erfaring med lokalt søk.
              </p>
            </QuoteCard>

            <p className=" text-fluid-p-lg text-brand-dark/90 max-w-prose">
              Vi holder ikke igjen på hva som virker. I <Link href="/artikler" className="text-brand-pine font-semibold underline decoration-brand-pine/40 underline-offset-2">artiklene våre</Link> går vi gjennom alt sammen, blant annet <Link href="/artikler/hvordan-komme-overst-i-google-kartet" className="text-brand-pine font-semibold underline decoration-brand-pine/40 underline-offset-2">hvordan du kommer øverst i Google-kartet</Link> og <Link href="/artikler/google-business-profil-klinikk" className="text-brand-pine font-semibold underline decoration-brand-pine/40 underline-offset-2">hvordan Google Business-profilen bør settes opp</Link>.
            </p>

          </div>
        </div>
      </article>

      <article className="py-[clamp(2rem,6.5vw,5.4rem)] bg-brand-dark border-0" id="garanti">
        <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8 grid grid-cols-1 md:grid-cols-[minmax(0,7rem)_minmax(0,1fr)] gap-[clamp(1.2rem,4vw,3.2rem)] items-start">
          <p className="text-micro uppercase text-brand-accent m-0 mt-2">Hva koster det?</p>
          <div>
            <h2 className="font-heading text-fluid-h2 mb-5 text-brand-light">Du betaler for plasseringen vi oppnår, ikke for arbeidet vi utfører.</h2>
            <p className="text-fluid-p-lg text-brand-light/80 max-w-prose mb-4"><strong className="text-brand-light">{PRICE_UPFRONT} kr eks. mva.</strong> 39 500 faktureres ved signering og refunderes ikke. Resten faktureres etter åtte uker, ut fra hvilken plassering dere har oppnådd. Vi har skrevet om <Link href="/artikler/hva-koster-lokal-seo" className="text-brand-accent font-semibold underline decoration-brand-accent/40 hover:text-brand-light hover:decoration-brand-accent transition-colors">hva lokal SEO koster i markedet ellers</Link>.</p>

            <table className="w-full border-collapse mt-8 text-micro max-w-prose">
              <thead>
                <tr>
                  <th className="text-left text-micro uppercase text-brand-light/50 pb-3 border-b border-brand-light/20">Resultat etter åtte uker</th>
                  <th className="text-right text-micro uppercase text-brand-light/50 pb-3 border-b border-brand-light/20 whitespace-nowrap pl-4">Faktureres</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-3 sm:py-4 border-b border-brand-light/10 text-brand-light align-top">Plass 1–3 i kartet (Målet)</td>
                  <td className="py-3 sm:py-4 border-b border-brand-light/10 text-brand-light text-right whitespace-nowrap pl-4 font-heading text-fluid-h4 align-top">{PRICE_TIER_1}</td>
                </tr>
                <tr>
                  <td className="py-3 sm:py-4 border-b border-brand-light/10 text-brand-light/80 align-top">Plass 4–5</td>
                  <td className="py-3 sm:py-4 border-b border-brand-light/10 text-brand-light text-right whitespace-nowrap pl-4 font-heading text-fluid-h4 align-top">{PRICE_TIER_2}</td>
                </tr>
                <tr>
                  <td className="py-3 sm:py-4 border-b border-brand-light/10 text-brand-light/80 align-top">Plass 6–10</td>
                  <td className="py-3 sm:py-4 border-b border-brand-light/10 text-brand-light text-right whitespace-nowrap pl-4 font-heading text-fluid-h4 align-top">{PRICE_TIER_3}</td>
                </tr>
                <tr>
                  <td className="py-3 sm:py-4 border-b border-brand-light/10 text-brand-light/80 align-top">Utenfor topp 10</td>
                  <td className="py-3 sm:py-4 border-b border-brand-light/10 text-brand-light/40 text-right whitespace-nowrap pl-4 font-heading text-fluid-h4 align-top">0</td>
                </tr>
              </tbody>
            </table>

            <div className="mt-8 pt-6 border-t border-brand-light/20 text-brand-light/70 max-w-[60ch]">
              <p className="mb-4 max-w-prose text-fluid-p-lg"><strong className="text-brand-light">Slik måles det.</strong> Plassering i Googles lokalpakke, målt fra klinikkens egen adresse, på tre til fem søkeord vi blir enige om skriftlig før arbeidet starter. Begge parter ser samme tall.</p>
              <p className="mb-0 max-w-prose text-fluid-p-lg">Nås ikke topp tre, faktureres det etter trappen over. Ligger dere utenfor topp ti, faktureres ingenting utover forskuddet.</p>
            </div>

          </div>
        </div>
      </article>

      <article className="py-[clamp(2rem,6.5vw,5.4rem)] bg-brand-light">
        <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8 grid grid-cols-1 md:grid-cols-[minmax(0,7rem)_minmax(0,1fr)] gap-[clamp(1.2rem,4vw,3.2rem)] items-start">
          <p className="text-micro uppercase text-brand-dark/50 m-0 mt-2">Leveransen</p>
          <div>
            <h2 className="font-heading text-fluid-h2 mb-8 text-brand-dark">Dette inngår i lokal SEO hos oss.</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card variant="sand" accent="top">
                <CardHeader>
                  <CardTitle as="h3">Google Business profilen</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Riktig primærkategori, som er den enkeltfaktoren som betyr mest. Sekundærkategorier, tjenester lagt inn hver for seg, tjenesteområde, bilder, åpningstider og beskrivelse.</CardDescription>
                </CardContent>
              </Card>

              <Card variant="sand" accent="top">
                <CardHeader>
                  <CardTitle as="h3">Optimalisering av nettside</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Mobilvennlig og raskt, egen side per tjeneste, teknisk merking av virksomhetsdata, lokale titler og beskrivelser.</CardDescription>
                </CardContent>
              </Card>

              <Card variant="sand" accent="top">
                <CardHeader>
                  <CardTitle as="h3">Datastruktur</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Navn, adresse og telefon identisk på profil, nettsted og i alle kataloger. Avvik her demper plasseringen mer enn de fleste tror.</CardDescription>
                </CardContent>
              </Card>

              <Card variant="sand" accent="top">
                <CardHeader>
                  <CardTitle as="h3">Anmeldelsesrutine</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Anmeldelser er nest viktigste rangeringsfaktor. Dere får lenke, mal og en rutine som faktisk lar seg følge i en travel klinikk.</CardDescription>
                </CardContent>
              </Card>

              <Card variant="sand" accent="top">
                <CardHeader>
                  <CardTitle as="h3">Måling fra dag én</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Baseline før vi starter, og rangeringsmåling underveis, så ingen er i tvil om hva som har skjedd.</CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </article>

      <article className="py-[clamp(2rem,6.5vw,5.4rem)] bg-brand-dark">
        <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8 grid grid-cols-1 md:grid-cols-[minmax(0,7rem)_minmax(0,1fr)] gap-[clamp(1.2rem,4vw,3.2rem)] items-start">
          <p className="text-micro uppercase text-brand-accent m-0 mt-2">Tidslinje</p>
          <div>
            <h2 className="font-heading text-fluid-h2 mb-5 text-brand-light">Fra gjennomgang til plassering.</h2>
            <div className="mt-7 border-l-[1.5px] border-brand-light/10 ml-1">
              <div className="relative pb-8 pl-7 last:pb-0 before:absolute before:-left-[5.5px] before:top-[0.55rem] before:w-[9px] before:h-[9px] before:rounded-full before:bg-brand-accent before:ring-[3px] before:ring-brand-dark">
                <p className="text-micro uppercase text-brand-light/50 mb-1">Dag 0</p>
                <h3 className="font-heading text-fluid-h4 mb-1.5 text-brand-light">Gjennomgang/Audit</h3>
                <p className="text-brand-light/70 text-fluid-p-lg m-0 max-w-prose text-pretty">Vi kartlegger konkurransebildet fra klinikkens adresse og går gjennom profil og nettsted. Dere får en skriftlig vurdering med score og prioritert tiltaksliste. Gratis.</p>
              </div>
              <div className="relative pb-8 pl-7 last:pb-0 before:absolute before:-left-[5.5px] before:top-[0.55rem] before:w-[9px] before:h-[9px] before:rounded-full before:bg-brand-accent before:ring-[3px] before:ring-brand-dark">
                <p className="text-micro uppercase text-brand-light/50 mb-1">Dag 1–6</p>
                <h3 className="font-heading text-fluid-h4 mb-1.5 text-brand-light">Alt settes opp</h3>
                <p className="text-brand-light/70 text-fluid-p-lg m-0 max-w-prose text-pretty">Profil, nettsted, virksomhetsdata, anmeldelsesrutine og måling. Selve arbeidet tar under en uke.</p>
              </div>
              <div className="relative pb-8 pl-7 last:pb-0 before:absolute before:-left-[5.5px] before:top-[0.55rem] before:w-[9px] before:h-[9px] before:rounded-full before:bg-brand-accent before:ring-[3px] before:ring-brand-dark">
                <p className="text-micro uppercase text-brand-light/50 mb-1">Uke 2–8</p>
                <h3 className="font-heading text-fluid-h4 mb-1.5 text-brand-light">Plasseringen setter seg</h3>
                <p className="text-brand-light/70 text-fluid-p-lg m-0 max-w-prose text-pretty">Google bruker uker på å registrere endringene, og anmeldelser bygges opp underveis. Dere får oppdatering hver fjortende dag.</p>
              </div>
              <div className="relative pb-0 pl-7 last:pb-0 before:absolute before:-left-[5.5px] before:top-[0.55rem] before:w-[9px] before:h-[9px] before:rounded-full before:bg-brand-accent before:ring-[3px] before:ring-brand-dark">
                <p className="text-micro uppercase text-brand-light/50 mb-1">Uke 8</p>
                <h3 className="font-heading text-fluid-h4 mb-1.5 text-brand-light">Måling og faktura</h3>
                <p className="text-brand-light/70 text-fluid-p-lg m-0 max-w-prose text-pretty">Vi måler sammen fra klinikkens adresse. Resultatet avgjør hva som faktureres.</p>
              </div>
            </div>
          </div>
        </div>
      </article>


      <article className="py-[clamp(2rem,6.5vw,5.4rem)] bg-brand-sand">
        <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8 grid grid-cols-1 md:grid-cols-[minmax(0,7rem)_minmax(0,1fr)] gap-[clamp(1.2rem,4vw,3.2rem)] items-start">
          <p className="text-micro uppercase text-brand-dark/50 m-0 mt-2">Hvem det er for</p>
          <div>
            <h2 className="font-heading text-fluid-h2 mb-5 text-brand-dark">Private klinikker i Oslo og omegn.</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-7 mt-6 mb-8">
              <div>
                <h3 className="font-heading text-fluid-h4 mb-2 text-brand-dark">Behandling og helse</h3>
                <p className="text-fluid-p-lg text-brand-dark/90 m-0 max-w-prose">Fysioterapi, kiropraktikk, osteopati, naprapati, psykolog, ernæringsfysiolog og fotterapi.</p>
              </div>
              <div>
                <h3 className="font-heading text-fluid-h4 mb-2 text-brand-dark">Tann og estetikk</h3>
                <p className="text-fluid-p-lg text-brand-dark/90 m-0 max-w-prose">Tannlege, tannregulering, hudpleie og estetiske klinikker.</p>
              </div>
            </div>

            <QuoteCard bg="light" className="mt-8 max-w-4xl">
              <p>
                Én klinikk per bransje, per bydel. Skal vi løfte dere til topp tre, kan vi ikke samtidig jobbe for dem dere konkurrerer mot.
              </p>
            </QuoteCard>

            <h3 className="font-heading text-fluid-h3 text-brand-dark mb-4 mt-8">Områder vi dekker</h3>
            <p className="text-fluid-p-lg text-brand-dark/90 max-w-prose mb-4 text-pretty">
              Frogner, Majorstuen, St. Hanshaugen, Grünerløkka, Sagene, Torshov, Bislett, Sentrum, Bjørvika, Løren, Ullern, Skøyen, Nordstrand og Røa.
            </p>
            <p className="text-fluid-p-lg text-brand-dark/90 max-w-prose mb-4 text-pretty">
              I omegn: Bærum, Sandvika, Lysaker, Asker, Lillestrøm, Ski og Kolbotn.
            </p>
            <p className="text-fluid-p-lg text-brand-dark/90 max-w-prose mb-10 text-pretty">
              En klinikk på Majorstuen konkurrerer med klinikkene på Majorstuen, ikke med hele Oslo. Derfor måler vi alltid fra deres egen adresse.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl">
              <Card accent="top" variant="light">
                <CardHeader>
                  <CardTitle as="h3">Hva vi trenger fra dere</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Under en time til sammen. Tilgang til Google-profilen og nettstedet, en kort samtale om behandlinger og priser, og beskjed om hvem som svarer på anmeldelser. Utover det gjør vi alt.</CardDescription>
                </CardContent>
              </Card>
              <Card accent="top">
                <CardHeader>
                  <CardTitle as="h3">Etter de åtte ukene</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>De fleste fortsetter på en lettere månedsavtale som beskytter plasseringen. Typisk 7 500 kroner i måneden. Ingen bindingstid, og avtalen er valgfri.</CardDescription>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </article>

      <article className="py-[clamp(2rem,6.5vw,5.4rem)] bg-brand-light">
        <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8 grid grid-cols-1 md:grid-cols-[minmax(0,7rem)_minmax(0,1fr)] gap-[clamp(1.2rem,4vw,3.2rem)] items-start">

          <p className="text-micro uppercase text-brand-dark/50 m-0 mt-2">
            Artikler
          </p>

          <div>
            <h2 className="font-heading text-fluid-h2 mb-5 text-brand-dark">
              Vi skriver om det vi jobber med.
            </h2>
            <p className="text-fluid-p-lg text-brand-dark/90 max-w-prose mb-10 text-pretty">
              Hva som avgjør hvem som rangerer i Google-kartet, forklart for deg som klinikkeier.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 w-full max-w-5xl">
              <Card accent="left" href="/artikler/hvordan-komme-overst-i-google-kartet" interactive>
                <CardHeader>
                  <CardTitle as="h3">Hvordan komme øverst i Google-kartet</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>De tre øverste tar nesten halvparten av trafikken. Her er hva som avgjør plasseringen, i riktig rekkefølge.</CardDescription>
                  <CardEyebrow className="mt-4">6 min lesetid</CardEyebrow>
                </CardContent>
              </Card>

              <Card accent="left" href="/artikler/google-business-profil-klinikk" interactive className="h-full">
                <CardHeader>
                  <CardTitle as="h3">Google Business-profil for klinikker</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Profilen er det tyngste enkeltverktøyet i lokalt søk. Slik setter du den opp riktig.</CardDescription>
                  <CardEyebrow className="mt-4">7 min lesetid</CardEyebrow>
                </CardContent>
              </Card>

              <Card accent="left" href="/artikler/flere-anmeldelser-klinikk" interactive>
                <CardHeader>
                  <CardTitle as="h3">Slik får klinikken flere anmeldelser</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Anmeldelser er nest viktigst. Men det er ikke antallet som teller mest.</CardDescription>
                  <CardEyebrow className="mt-4">6 min lesetid</CardEyebrow>
                </CardContent>
              </Card>
            </div>

            <p className="m-0">
              <Link href="/artikler" className="text-brand-pine font-semibold text-fluid-p-lg underline decoration-brand-pine/40 underline-offset-2">
                Se alle artiklene
              </Link>
            </p>

          </div>
        </div>
      </article>

      <article className="py-[clamp(2rem,6vw,4rem)] bg-brand-dark text-center">
        <div className="mx-auto max-w-3xl w-full px-4 sm:px-6 md:px-8">
          <h2 className="text-fluid-h2 mb-4 text-brand-light">Vår metodikk er bygget på 15 års byråerfaring med Norges største merkevarer.</h2>
          <Link href="/om-oss" className="inline-flex text-fluid-p-lg items-center gap-2 text-brand-rust hover:text-brand-sand transition-colors motion-reduce:transition-none  mt-4">
            Bli kjent med teamet i Floww Media <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </article>

      <FAQSection faqs={seoFaqs} />
      <CtaSection />

      <section className="pt-[clamp(2rem,4vw,3rem)] pb-4 bg-brand-sand">
        <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8">
          <p className="text-micro text-brand-dark/70 leading-[1.55] max-w-[58ch] m-0">* {PRICE_UPFRONT} kroner eks. mva. faktureres ved signering og refunderes ikke. Resterende beløp faktureres etter åtte uker, og størrelsen avhenger av oppnådd plassering i Googles lokalpakke, målt fra klinikkens egen adresse på søkeord avtalt skriftlig ved oppstart.</p>
        </div>
      </section>
    </>
  );
}