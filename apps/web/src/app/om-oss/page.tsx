import { Metadata } from "next";
import Script from "next/script";
import Image from "next/image";
import CtaSection from "@/components/sections/CtaSection";
import EditorialSection from "@/components/sections/EditorialSection";
import Card, {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import QuoteCard from "@/components/ui/QuoteCard";
import PageHeader from "@/components/sections/PageHeader";
import { SummaryList, SummaryItem } from "@/components/ui/SummaryList";

export const metadata: Metadata = {
  title: "Om Oss",
  description:
    "Bli kjent med Floww Media, et eksklusivt byrå for organisk vekst ledet av Simen Russ og Marja Jernsletten. Kun én klient per bransje.",
  alternates: {
    canonical: "https://flowwmedia.no/om-oss",
  },
  openGraph: {
    title: "Om Oss | Floww Media",
    description:
      "Bli kjent med Floww Media, et eksklusivt byrå for organisk vekst ledet av Simen Russ og Marja Jernsletten.",
    type: "website",
    locale: "nb_NO",
    url: "https://flowwmedia.no/om-oss",
    siteName: "Floww Media",
    images: [
      {
        url: "/images/teamet.jpg",
        width: 1200,
        height: 630,
        alt: "Simen Russ og Marja Jernsletten i Floww Media",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Om Oss | Floww Media",
    description:
      "Bli kjent med Floww Media, et eksklusivt byrå for organisk vekst ledet av Simen Russ og Marja Jernsletten.",
    images: ["/images/teamet.jpg"],
  },
};

export default function OmOssPage() {
  const jsonLdAbout = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": "https://flowwmedia.no/om-oss",
        },
        name: "Om Oss | Floww Media",
        description:
          "Bli kjent med Floww Media, et eksklusivt byrå for organisk vekst ledet av Simen Russ og Marja Jernsletten.",
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
            name: "Om oss",
            item: "https://flowwmedia.no/om-oss",
          },
        ],
      },
    ],
  };

  return (
    <>
      <Script
        id="schema-about"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdAbout) }}
      />

      <PageHeader
        breadcrumbs={[{ name: "Hjem", href: "/" }, { name: "Om oss" }]}
        label="Byrået"
        title="Vi måler oss utelukkende på vekst."
        description="Floww Media er et byrå for organisk vekst for virksomheter som vil lede sin bransje. Synlighet i Google og AI-søk er bare et delmål. Lønnsomme kunder, leads og bunnlinjevekst er de eneste resultatene som teller for oss."
      />

      <section className="bg-brand-light">
        <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8">
          <SummaryList
            withBorders
            className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
          >
            <SummaryItem label="Selskap">Floww AS</SummaryItem>
            <SummaryItem label="Adresse">Edvard Storms gate 2</SummaryItem>
            <SummaryItem label="Modell">Eksklusivt partnerskap</SummaryItem>
            <SummaryItem label="Kunder">En per bransje per marked</SummaryItem>
          </SummaryList>

          <div className="w-full aspect-[21/9] md:aspect-[2.5/1] relative rounded-sm overflow-hidden mt-8 mb-4">
            <Image
              alt="Portrett av Marja Jernsletten og Simen Russ"
              className="object-cover object-[center_25%]"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              src="/images/teamet.jpg"
            />
          </div>
        </div>
      </section>

      <EditorialSection
        bg="light"
        label="Vår visjon"
        title="Synlighet der det teller."
      >
        <QuoteCard bg="sand" className="my-8 max-w-4xl">
          <p className="text-brand-dark/90 m-0 text-pretty">
            Floww Media skal være den foretrukne samarbeidspartneren for
            virksomhetene i Norge som ønsker det beste innen organisk vekst.
          </p>
        </QuoteCard>
        <div className="flex flex-col gap-5 max-w-4xl">
          <p className="text-fluid-p-lg text-brand-dark/90 m-0 text-pretty">
            Andre byråer vokser ved å ta inn flest mulig kunder, og måler seg på hvor mange de har. Floww gjør det motsatte. Med egenutviklede
            modeller og eget analyseverktøy jobber vi langsiktig og strategisk
            med et lite utvalg virksomheter som ser verdien av å være synlige på rett plass.
            Vi måler oss på kundenes forretningsresultater, ikke på hvor mange
            kunder vi har. Derfor jobber vi bare med virksomheter som både kan
            og vil bli ledende i sin bransje.
          </p>
          <p className="text-fluid-p-lg text-brand-dark/90 m-0 text-pretty">
            Synlighet har ingen verdi i seg selv. Den teller der den gir
            lønnsomme kunder, eller bygger lønnsomme leads som gir vekst på
            bunnlinjen. Derfor måles alt vi gjør for kundene i forretningsmål,
            ikke i plasseringer.
          </p>
        </div>
      </EditorialSection>

      <EditorialSection
        bg="light"
        className="!pt-0"
        label="Metodikken"
        title="Business first."
        paragraphs={[
          "Mange byråer starter med å lete etter søkeord. Vi starter med forretningen: Hva er en ny kunde faktisk verdt for dere, og hvor er marginene størst? Først når vi kjenner forretningsmodellen, vet vi hvor det er lønnsomt å bygge synlighet.",
        ]}
      >
        <QuoteCard bg="sand" className="mt-8 max-w-4xl">
          <h3 className="font-heading text-fluid-p-lg text-brand-dark mb-3">
            Hjelper man alle, hjelper man ingen
          </h3>
          <p className="text-brand-dark/90 m-0 text-pretty">
            Skal vi løfte en virksomhet forbi alle andre i markedet, kan vi ikke
            samtidig jobbe for konkurrenten deres. Derfor tar vi kun inn en
            klient per bransje. Vi tar få kunder, fordi vi gjør ingenting
            halvveis.
          </p>
        </QuoteCard>
      </EditorialSection>

      <EditorialSection
        bg="sand"
        label="Hvem er vi?"
        title="Kompetanse i alle ledd."
        titleClassName="mb-8 md:mb-10"
        paragraphs={[
          "I mange byråer møter dere seniorene i salgsmøtet og juniorene i leveransen. Hos oss gjør de som solgte oppdraget, også hele arbeidet. Teamet vårt er lite, men svært senior. Derfor starter vi med forretningen og de mest lønnsomme kundene, ikke med søkeordene.",
        ]}
      >
        <div
          id="simen"
          className="pt-8 flex flex-col gap-12 md:gap-16"
        >
          {/* --- SIMEN RUSS --- */}
          <div className="flex flex-col">
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start mb-6 md:mb-10">
              <div className="flex flex-col items-center md:items-start flex-shrink-0 w-full max-w-[240px]">
                <figure className="relative w-full aspect-square rounded-full border-4 border-brand-light overflow-hidden mb-6">
                  <Image
                    src="/images/Simen.jpg"
                    alt="Portrett av Simen Russ"
                    fill
                    sizes="(max-width: 768px) 100vw, 240px"
                    className="object-cover object-[center_15%]"
                  />
                </figure>
                <div className="flex flex-col gap-3 w-full px-2">
                  <a
                    href="https://www.linkedin.com/in/simenr/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 text-brand-dark hover:text-brand-pine transition-colors font-medium"
                  >
                    <Image
                      src="/images/LinkedIn.png"
                      alt=""
                      width={16}
                      height={16}
                      className="h-[1.1em] w-auto object-contain group-hover:opacity-100 transition-opacity motion-reduce:transition-none"
                    />
                    <span>LinkedIn</span>
                  </a>
                  <a
                    href="tel:+4745843554"
                    className="group flex items-center gap-3 text-brand-dark hover:text-brand-pine transition-colors font-medium"
                  >
                    <Image
                      src="/images/phone.svg"
                      alt=""
                      width={16}
                      height={16}
                      className="h-[1.1em] w-auto object-contain group-hover:opacity-100 transition-opacity motion-reduce:transition-none"
                    />
                    <span>458 43 554</span>
                  </a>
                  <a
                    href="mailto:simen@flowwmedia.no"
                    className="group flex items-center gap-3 text-brand-dark hover:text-brand-pine transition-colors font-medium"
                  >
                    <Image
                      src="/images/email.svg"
                      alt=""
                      width={16}
                      height={16}
                      className="h-[1.1em] w-auto object-contain group-hover:opacity-100 transition-opacity motion-reduce:transition-none"
                    />
                    <span>simen@flowwmedia.no</span>
                  </a>
                </div>
              </div>

              <div className="pt-2 text-center md:text-left flex flex-col gap-4">
                <h3 className="font-heading text-fluid-h2 text-brand-dark m-0">
                  Simen Russ
                </h3>
                <p className="text-fluid-p-lg text-brand-dark/90 m-0 text-pretty">
                  Simen er tidligere Head of SEO og fagansvarlig for organisk
                  synlighet og søk i dentsu, Norges største byråkonsern. Der var
                  hans oppgave å sette metodikk, verktøy og standarder på tvers
                  av byråene.
                </p>
                <p className="text-fluid-p-lg text-brand-dark/90 m-0 text-pretty">
                  Med over 15 års erfaring som seniorspesialist har Simen jobbet
                  med organisk synlighet for rundt 80 av landets og verdens
                  største merkevarer, inkludert Red Bull, Under Armour, XXL,
                  Bohus, VitusApotek, Re:member, Löplabbet og Byggmakker. Med
                  bakgrunn fra kommersiell strategi, forretningsrådgivning og
                  prosjektfinansiering sikrer Simen at synlighet og trafikk
                  alltid oversettes til faktisk forretningsverdi.
                </p>
              </div>
            </div>

            <QuoteCard bg="light" className="my-8 max-w-4xl">
              <p className="text-micro uppercase text-brand-pine mb-3 font-bold">
                Prisbelønnet arbeid
              </p>
              <h4 className="font-heading text-fluid-p-lg text-brand-dark mb-3">
                Gull i Performance Awards for SEO-arbeidet med Bohus
              </h4>
              <p className="text-brand-dark/90 m-0 text-pretty">
                Det samme håndverket ligger til grunn her. Forskjellen er at vi
                kombinerer dyp strategisk søkekompetanse med vår egen tekniske
                analyseplattform, slik at hvert eneste tiltak kan måles og
                etterprøves direkte.
              </p>
            </QuoteCard>

            <div className="mb-4">
              <p className="text-micro uppercase text-brand-dark/70 mb-4 font-bold">
                Et utvalg av merkevarer Simen har jobbet med
              </p>
              <ul className="flex flex-wrap gap-3 p-0 m-0 list-none">
                {[
                  "Dentsu",
                  "Red Bull",
                  "Under Armour",
                  "XXL",
                  "Bohus",
                  "VitusApotek",
                  "Re:member",
                  "Löplabbet",
                  "Byggmakker",
                  "Tibber",
                ].map((client) => (
                  <li
                    key={client}
                    className="bg-brand-light px-5 py-2.5 border border-brand-dark/10 rounded-sm text-micro text-brand-dark/80 font-medium"
                  >
                    {client}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <hr className="border-t border-brand-dark/10 w-full m-0" />

          {/* --- MARJA JERNSLETTEN --- */}
          <div className="flex flex-col">
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
                  <a
                    href="https://www.linkedin.com/in/marjaj/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 text-brand-dark hover:text-brand-pine transition-colors font-medium"
                  >
                    <Image
                      src="/images/LinkedIn.png"
                      alt=""
                      width={16}
                      height={16}
                      className="h-[1.1em] w-auto object-contain group-hover:opacity-100 transition-opacity motion-reduce:transition-none"
                    />
                    <span>LinkedIn</span>
                  </a>
                  <a
                    href="tel:+4793023612"
                    className="group flex items-center gap-3 text-brand-dark hover:text-brand-pine transition-colors font-medium"
                  >
                    <Image
                      src="/images/phone.svg"
                      alt=""
                      width={16}
                      height={16}
                      className="h-[1.1em] w-auto object-contain group-hover:opacity-100 transition-opacity motion-reduce:transition-none"
                    />
                    <span>930 23 612</span>
                  </a>
                  <a
                    href="mailto:marja@flowwmedia.no"
                    className="group flex items-center gap-3 text-brand-dark hover:text-brand-pine transition-colors font-medium"
                  >
                    <Image
                      src="/images/email.svg"
                      alt=""
                      width={16}
                      height={16}
                      className="h-[1.1em] w-auto object-contain group-hover:opacity-100 transition-opacity motion-reduce:transition-none"
                    />
                    <span>marja@flowwmedia.no</span>
                  </a>
                </div>
              </div>

              <div className="pt-2 text-center md:text-left flex flex-col gap-4">
                <h3 className="font-heading text-fluid-h2 text-brand-dark m-0">
                  Marja Jernsletten
                </h3>
                <p className="text-fluid-p-lg text-brand-dark/90 m-0 text-pretty">
                  Utvikler med ti års erfaring. Marja tar det tekniske
                  fundamentet på nettstedet der det må endres: struktur,
                  hastighet, merking og oppsett som verken lar seg fikse i et
                  publiseringsverktøy eller forklares bort.
                </p>
                <p className="text-fluid-p-lg text-brand-dark/90 m-0 text-pretty">
                  Marja eier alt det tekniske i Floww Media. Synlighet i dag
                  krever mer enn bare godt innhold, det krever en feilfri
                  teknisk grunnmur og strukturert datamerking for å bli forstått
                  av AI-søkemotorer. Marja bygger og vedlikeholder våre
                  egenutviklede analysemodeller, som Synlighetsrapporten. Hennes
                  tekniske tyngde sikrer at de strategiske anbefalingene våre
                  ikke bare forblir ord i en PDF, men faktisk blir implementert
                  i produksjon.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl">
              <Card accent="left">
                <CardHeader>
                  <CardTitle as="h4">Teknisk grunnlag</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Hastighet (Core Web Vitals), mobiltilpasning, indeksering og
                    oppsett som lar seg måle.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card accent="left">
                <CardHeader>
                  <CardTitle as="h4">Struktur og merking</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Tjenestesider, intern lenking og strukturerte data (JSON-LD)
                    som Google og AI-tjenester faktisk leser.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </EditorialSection>

      <CtaSection bg="light" />
    </>
  );
}
