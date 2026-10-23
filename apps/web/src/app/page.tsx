import { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import AuditScannerHero from "@/components/synlighetsrapport/AuditScannerHero";
import EditorialSection from "@/components/sections/EditorialSection";
import HeroSection from "@/components/sections/HeroSection";
import HubSection from "@/components/sections/HubSection";
import QualityScoreCalculator from "@/components/sections/QualityScoreCalculator";
import CtaSection from "@/components/sections/CtaSection";
import Button from "@/components/ui/Button";
import Card, {
  CardHeader,
  CardEyebrow,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/Card";
import QuoteCard from "@/components/ui/QuoteCard";
import StatCard from "@/components/ui/StatCard";
import { SummaryList, SummaryItem } from "@/components/ui/SummaryList";

export const metadata: Metadata = {
  title: {
    absolute: "Floww Media | SEO-byrå & Organisk Vekst",
  },
  description:
    "Floww Media er et eksklusivt byrå for organisk vekst. Vi kombinerer egen analyseplattform (245 målepunkter) med lokal SEO, AI-søk og lynraske nettsider.",
  alternates: {
    canonical: "https://flowwmedia.no",
  },
  openGraph: {
    title: "Floww Media | SEO-byrå & Organisk Vekst",
    description:
      "Floww Media er et eksklusivt byrå for organisk vekst. Vi kombinerer egen analyseplattform (245 målepunkter) med lokal SEO, AI-søk og lynraske nettsider.",
    url: "https://flowwmedia.no",
    siteName: "Floww Media",
    locale: "nb_NO",
    type: "website",
    images: [
      {
        url: "/images/teamet.jpg",
        width: 1200,
        height: 630,
        alt: "Floww Media, eksklusivt byrå for organisk vekst",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Floww Media | SEO-byrå & Organisk Vekst",
    description:
      "Floww Media er et eksklusivt byrå for organisk vekst. Vi kombinerer egen analyseplattform (245 målepunkter) med lokal SEO, AI-søk og lynraske nettsider.",
    images: ["/images/teamet.jpg"],
  },
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["ProfessionalService", "LocalBusiness"],
    "@id": "https://flowwmedia.no/#localbusiness",
    name: "Floww Media",
    legalName: "Floww AS",
    taxID: "NO922758476MVA",
    vatID: "NO922758476MVA",
    description:
      "Eksklusivt byrå for organisk vekst, teknisk SEO, lokal synlighet i Google-kartet, AI-SEO og teknisk webutvikling for norske virksomheter.",
    url: "https://flowwmedia.no",
    image: "https://flowwmedia.no/images/teamet.jpg",
    priceRange: "$$$",
    telephone: "+4745843554",
    email: "kontakt@flowwmedia.no",
    sameAs: [
      "https://virksomhet.brreg.no/nb/oppslag/enheter/922758476",
      "https://www.proff.no/selskap/floww-as/oslo/-/IF941980000",
    ],
    knowsAbout: [
      "Søkemotoroptimalisering (SEO)",
      "Lokal SEO og Google Business Profile",
      "AI-SEO og synlighet i språkmodeller (GEO)",
      "Teknisk webutvikling og Core Web Vitals",
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Edvard Storms gate 2",
      addressLocality: "Oslo",
      postalCode: "0166",
      addressCountry: "NO",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 59.9207,
      longitude: 10.7376,
    },
    areaServed: {
      "@type": "Country",
      name: "Norway",
    },
  };

  return (
    <>
      <Script
        id="schema-local-business"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. AGENCY HERO (LIGHT) */}
      <HeroSection />

      {/* AUTHORITY SUMMARY BAR (LIGHT) */}
      <section className="bg-brand-light" aria-label="Nøkkelfakta om Floww Media">
        <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8">
          <SummaryList
            withBorders={false}
            className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
          >
            <SummaryItem label="Eksklusivitet">
              En klient per bransje
            </SummaryItem>
            <SummaryItem label="Egen analyseplattform">
              245 vektede målepunkter
            </SummaryItem>
            <SummaryItem label="Seniorerfaring">
              15+ år og ~80 merkevarer
            </SummaryItem>
            <SummaryItem label="Leveranse">
              Kun seniorer, ingen juniorer
            </SummaryItem>
          </SummaryList>
        </div>
      </section>

      {/* 2. INTERACTIVE AUDIT SCANNER (DARK SECTION + LIGHT SPOTLIGHT CARD) */}
      <AuditScannerHero
        bg="dark"
        scannerVariant="light"
        titleAs="h2"
        title={
          <>
            Hvor mange kunder lekker til konkurrentene deres?{" "}
            <span className="text-brand-accent">
              Sjekk synligheten og få det økonomiske tapet beregnet på 45 sekunder.
            </span>
          </>
        }
        description={
          <>
            Skriv inn domenet til bedriften deres. Vår egenutviklede synlighetsanalyse måler
            virksomheten mot <strong>245 rangeringsfaktorer</strong> i Lokal SEO (Google
            Kartpakken), Google Ads, Tradisjonell SEO (organisk søk) og AI-assistenter (bl.a. AI-søk, ChatGPT, Gemini, Claude og Perplexity), og regner ut hva tapte
            plasseringer koster dere hver måned.
          </>
        }
      />

      {/* 3. METHODOLOGY & VISUAL COMPARISON (LIGHT) */}
      <EditorialSection
        bg="light"
        label="Metodikken"
        title="En aktivitetsrapport er ikke et resultat."
        paragraphs={[
          <>
            I altfor mange år har SEO-bransjen solgt store løfter gjemt bak ulne
            grafer og timerapporter. Mange bedrifter har betalt dyrt for
            synlighet uten å se utslag på bunnlinja. Altfor mange byråer måler
            det som er lett å måle.
            <br />
            <strong className="italic">Vi måler det som betyr noe.</strong>
          </>,
          "Synlighet betaler ingen regninger. Vi har bygget vårt eget analyseverktøy for å fjerne all synsing fra faget. Verktøyet ser vanlig søk, AI-søk, lokalt søk og annonser i en samlet analyse, og regner ut svart på hvitt hva hver tekniske svakhet koster dere i tapt omsetning.",
        ]}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 mb-8 max-w-4xl">
          <Card variant="sand">
            <CardHeader>
              <CardEyebrow>Volummodellen</CardEyebrow>
              <CardTitle as="h3">Tradisjonelle byråer</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-6">
                Bygger forretningsmodellen sin på å ta inn flest mulig kunder på
                faste månedsabonnementer.
              </CardDescription>
              <ul className="flex flex-col m-0 p-0 list-none">
                <li className="py-3 border-t border-brand-dark/10 flex items-start gap-3 text-brand-dark/85">
                  <span className="text-brand-dark/40 mt-[2px]">—</span>
                  <span>Jobber ofte for flere konkurrenter i samme bransje</span>
                </li>
                <li className="py-3 border-t border-brand-dark/10 flex items-start gap-3 text-brand-dark/85">
                  <span className="text-brand-dark/40 mt-[2px]">—</span>
                  <span>Rapporterer på klikk og visninger fremfor bunnlinjevekst/omsetning</span>
                </li>
                <li className="py-3 border-t border-brand-dark/10 flex items-start gap-3 text-brand-dark/85">
                  <span className="text-brand-dark/40 mt-[2px]">—</span>
                  <span>Seniorer i salgsmøtet, juniorer i selve leveransen</span>
                </li>
                <li className="py-3 border-t border-brand-dark/10 flex items-start gap-3 text-brand-dark/85">
                  <span className="text-brand-dark/40 mt-[2px]">—</span>
                  <span>Manuelle sjekklister uten økonomisk tapsberegning</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card variant="dark" accent="top">
            <CardHeader>
              <CardEyebrow className="!text-brand-accent">
                Forretningsmodellen
              </CardEyebrow>
              <CardTitle as="h3">Floww Media</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-6">
                Starter alltid med forretningen: Hva er en ny kunde verdt, og
                hvor er marginene størst?
              </CardDescription>
              <ul className="flex flex-col m-0 p-0 list-none">
                <li className="py-3 border-t border-brand-light/10 flex items-start gap-3 text-brand-light">
                  <span className="text-brand-accent mt-[2px]">✔</span>
                  <span>Kun en eksklusiv samarbeidspartner per bransje</span>
                </li>
                <li className="py-3 border-t border-brand-light/10 flex items-start gap-3 text-brand-light">
                  <span className="text-brand-accent mt-[2px]">✔</span>
                  <span>Måler lønnsomme kunder og spart annonsekostnad</span>
                </li>
                <li className="py-3 border-t border-brand-light/10 flex items-start gap-3 text-brand-light">
                  <span className="text-brand-accent mt-[2px]">✔</span>
                  <span>De som selger oppdraget, utfører også hele arbeidet</span>
                </li>
                <li className="py-3 border-t border-brand-light/10 flex items-start gap-3 text-brand-light">
                  <span className="text-brand-accent mt-[2px]">✔</span>
                  <span>Egenutviklet motor med 245 tekniske målepunkter</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <QuoteCard bg="sand" className="max-w-4xl">
          <p>
            Synlighet har ingen verdi i seg selv. Den teller kun der den gir
            lønnsomme kunder og vekst på bunnlinjen. Derfor setter vi sammen
            leveransen etter hvor deres mest lønnsomme kunder faktisk leter.
          </p>
        </QuoteCard>
      </EditorialSection>

      {/* 5. COMPACT QUALITY SCORE CALCULATOR (LIGHT) */}
      <QualityScoreCalculator
        variant="compact"
        bg="sand"
        id="qs-kalkulator"
      />

      {/* 4. SERVICE SILOS HUB (SAND) */}
      <HubSection
        bg="light"
        columns={3}
        label="Tjenester"
        title="Fem fagområder. En samlet vekstmotor."
        description="Vi skiller ikke på organisk søk, lokal synlighet, AI-søk, annonseøkonomi og teknisk webutvikling. Alt henger sammen i samme arkitektur, bygget for å vinne kunden før konkurrenten gjør det."
        items={[
          {
            variant: "sand",
            accent: "top",
            href: "/seo",
            interactive: true,
            eyebrow: "SEO · Organisk Søk",
            title: "Eie posisjonen i Google",
            description:
              "De tre øverste organiske treffene tar over halvparten av alle klikk. Vi bygger teknisk SEO, semantiske innholdssiloer og målbar autoritet som varer.",
            actionText: "Les om organisk SEO",
          },
          {
            variant: "sand",
            accent: "top",
            href: "/lokal-seo",
            interactive: true,
            eyebrow: "Lokal SEO · Google Kartpakken",
            title: "Topp 3 i Google-kartet",
            description:
              "48 % av alle lokale søk ender hos de tre øverste i kartpakken. Vi bygger profilstyrken, anmeldelsesflyten og de lokale signalene som plasserer dere øverst.",
            actionText: "Les om lokal synlighet",
          },
          {
            variant: "dark",
            accent: "top",
            href: "/ai-seo",
            interactive: true,
            eyebrow: "AI-SEO & Språkmodeller",
            title: "Synlighet i AI-søk",
            description:
              "Kundene spør ChatGPT, Gemini, Claude og Perplexity hvem de bør velge. Vi bygger entitetsstyrken, siteringene og datastrukturen som gjør at dere blir anbefalt.",
            actionText: "Les om AI-synlighet",
          },
          {
            variant: "sand",
            accent: "top",
            href: "/google-ads",
            interactive: true,
            eyebrow: "Google Ads & Quality Score",
            title: "Lavere klikkpris i annonser",
            description:
              "En treg og ustrukturert landingsside gir lav Quality Score og opptil 400 % dyrere klikk. Vi kombinerer teknisk SEO og kirurgisk annonsering på høymargin-søk.",
            actionText: "Se hvordan vi kutter klikkprisen",
          },
          {
            variant: "sand",
            accent: "top",
            href: "/nettsider",
            interactive: true,
            eyebrow: "Teknisk Arkitektur & CRO",
            title: "Nettsider som konverterer",
            description:
              "Synlighet betaler ingen regninger alene. Vi bygger og rydder i den tekniske grunnmuren (Core Web Vitals, innholdssiloer og JSON-LD) som gjør besøkende til kunder.",
            actionText: "Se hvordan vi bygger",
          },
        ]}
      />

      {/* 6. AI-SEARCH SPOTLIGHT (DARK) */}
      <EditorialSection
        as="section"
        ariaLabel="AI-SEO og Synlighet"
        bg="dark"
        className="py-[clamp(3.5rem,7vw,6.5rem)]"
        label="AI-SEO & AI-søk"
        labelClassName="!text-brand-rust font-bold tracking-wider"
        title="Er dere synlige når kunden spør AI?"
        paragraphs={[
          "Kunden skroller ikke lenger forbi ti blå lenker. De stiller et spørsmål til assistenten, og får ett fasitsvar med to eller tre anbefalte selskaper. Står dere ikke i det svaret, kommer kunden aldri til nettsiden.",
          "Vi hjelper bedrifter og markedsteam med å kartlegge hvem ChatGPT, Gemini, Claude og Perplexity anbefaler i deres kategori, og bygger den tekniske datastrukturen (JSON-LD Schema.org) som kreves for å eie posisjonen.",
        ]}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 mb-8 max-w-5xl">
          <StatCard variant="dark" accent="left" title="3,4x">
            høyere sannsynlighet for å bli sitert i AI-svar med komplett
            Schema.org-merking.
          </StatCard>
          <StatCard variant="dark" accent="left" title="4 modeller">
            testes direkte mot bransjens viktigste kjøpsspørsmål i vår analyse.
          </StatCard>
          <StatCard variant="dark" accent="left" title="Entitet">
            kryssjekket mot Brønnøysundregistrene, kataloger og fagkilder.
          </StatCard>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Button variant="primary" href="/ai-seo">
            Les om AI-synlighet →
          </Button>
          <Link
            href="/seo-analyse"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-[3px] border border-brand-light/25 text-brand-light hover:border-brand-accent hover:text-brand-accent transition-colors text-micro uppercase tracking-wider font-semibold"
          >
            Sjekk AI-scoren deres i SEO-analysen →
          </Link>
        </div>
      </EditorialSection>

      {/* 6. EXCLUSIVITY & SENIOR TEAM PROOF (LIGHT) */}
      <EditorialSection
        bg="light"
        label="Hvem vi er"
        title="Hjelper man alle, hjelper man ingen."
        paragraphs={[
          "Skal vi løfte en virksomhet forbi alle andre i markedet, kan vi ikke samtidig jobbe for konkurrenten deres. Derfor tar vi kun inn en klient per bransje i hvert geografiske område.",
          "Hos oss møter dere aldri ett team i salgsmøtet og et annet i leveransen. Arbeidet ledes direkte av Simen Russ (15 års erfaring som senior SEO-spesialist for rundt 80 norske og internasjonale merkevarer) og Marja Jernsletten (seniorutvikler og arkitekten bak vår analyseplattform).",
        ]}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 mb-8 max-w-5xl">
          <StatCard variant="light" accent="left" className="bg-brand-sand" title="En">
            eksklusiv samarbeidspartner per bransje og marked.
          </StatCard>
          <StatCard variant="light" accent="left" className="bg-brand-sand" title="~80">
            merkevarer løftet gjennom 15 år i søkefaget.
          </StatCard>
          <StatCard variant="light" accent="left" className="bg-brand-sand" title="100 %">
            seniorleveranse uten mellomledd eller juniorer.
          </StatCard>
        </div>

        <p className="text-fluid-p-lg text-brand-dark/90 max-w-4xl m-0">
          Les mer om{" "}
          <Link href="/om-oss">teamet og filosofien vår</Link>, eller utforsk{" "}
          <Link href="/artikler">fagartiklene våre</Link> der vi deler
          metodikken åpent.
        </p>
      </EditorialSection>

      {/* 7. CONVERSION CLOSER (SAND BAND WITH DARK CARD) */}
      <CtaSection
        bg="sand"
        label="Klar for tall fremfor synsing?"
        title="Se hvor dere taper kunder i dag."
        description="Kjør vår automatiserte SEO-analyse på 45 sekunder, eller ta direkte kontakt med oss for å sjekke om deres bransje fortsatt er ledig hos oss."
        buttonText="Kjør gratis SEO-analyse →"
        buttonHref="/seo-analyse"
      />
    </>
  );
}