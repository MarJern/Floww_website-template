import type { Metadata } from 'next';
import Link from 'next/link';
import AuditScannerHero from '@/components/synlighetsrapport/AuditScannerHero';
import Card, {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardEyebrow,
} from '@/components/ui/Card';
import { SummaryList, SummaryItem } from '@/components/ui/SummaryList';
import StatCard from '@/components/ui/StatCard';
import QuoteCard from '@/components/ui/QuoteCard';
import FAQSection from '@/components/sections/FAQSection';
import CtaSection from '@/components/sections/CtaSection';
import EditorialSection from '@/components/sections/EditorialSection';

export const metadata: Metadata = {
  title: 'SEO-analyse: Gratis Teknisk SEO, Google Maps & AI-sjekk',
  description:
    'Skann bedriften din på 45 sekunder mot 245 målepunkter i Google Maps, teknisk SEO og AI-søk. Se tekniske feil og estimert månedlig omsetningstap.',
  alternates: {
    canonical: 'https://flowwmedia.no/seo-analyse',
  },
  openGraph: {
    title: 'SEO-analyse | Sjekk bedriftens digitale synlighet på 45 sekunder',
    description:
      '245 tekniske målepunkter for norske B2B- og lokalbedrifter: Google Business Profile, On-Page SEO, autoritet og AI-sitering med estimert månedlig kundetap i kroner.',
    url: 'https://flowwmedia.no/seo-analyse',
    siteName: 'Floww Media',
    locale: 'nb_NO',
    type: 'website',
    images: [
      {
        url: '/images/teamet.jpg',
        width: 1200,
        height: 630,
        alt: 'Floww Media, SEO-analyse med 245 målepunkter',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEO-analyse: 245 målepunkter for SEO, Google Maps & AI-søk',
    description:
      'Gratis SEO-analyse for norske bedrifter. Oppdag tekniske feil og estimert månedlig omsetningstap.',
    images: ['/images/teamet.jpg'],
  },
};

const faqs = [
  {
    question: 'Hva sjekker SEO-analysen egentlig?',
    answer:
      'SEO-analysen kjører en sanntidsanalyse av bedriften din på tvers av 245 målepunkter fordelt på fire hovedpilarer: Del 1: Google Business Profile & Map Pack (72 punkter), Del 2: Nettside, hastighet, teknisk SEO og konvertering (85 punkter), Del 3: Autoritet, lenkeprofil og norske katalogoppføringer (48 punkter), og Del 4: Synlighet og sitering i AI-søkemotorer som ChatGPT, Gemini, Claude, Perplexity og Google AI Overviews (40 punkter).',
  },
  {
    question: 'Hvordan beregnes det estimerte månedlige omsetningstapet i kroner?',
    answer:
      'Vi kombinerer bedriftens offisielle NACE-bransjekode og kommune fra Brønnøysundregistrene med norske søkevolumer, bransjespesifikke klikkpriser (CPC), konverteringsrater og snittverdier per ny kunde. Når vi finner konkrete hull i Google-kartet, hastighet eller AI-sitering, regner modellen ut hvor mange kvalifiserte henvendelser som lekker til lokale konkurrenter hver måned.',
  },
  {
    question: 'Hva er gratis i analysen, og hva koster det å låse opp hele handlingsplanen?',
    answer:
      'Selve skanningen, totalscoren (0–100), score per fagområde, Geo-Grid kartet, AI-synlighetsmatrisen, det økonomiske tapsestimatet og et utvalg konkrete funn er 100 % gratis og uforpliktende. Dersom dere ønsker å låse opp alle 245 tekniske målepunkter med eksakte kodeeksempler (JSON-LD), prioritert handlingsplan og nedlastbar styrerapport i PDF, koster full tilgang 1 490 kr eks. mva. som engangsbeløp (ingen abonnement).',
  },
  {
    question: 'Hvorfor er AI-synlighet (Del 4) så viktig for norske bedrifter i 2026?',
    answer:
      'Stadig flere beslutningstakere og forbrukere spør ChatGPT, Gemini, Claude, Perplexity eller Google AI Overviews direkte («Hvilken tannlege i Oslo er best på tannregulering?» eller «Hvilket regnskapsbyrå passer for vekstbedrifter?»). Uten maskinlesbar Schema.org-struktur (JSON-LD), tydelig entitetskobling mot organisasjonsnummer og konsistente katalogdata blir bedriften din usynlig i AI-svarene.',
  },
  {
    question: 'Er lokalt søk i Google-kartet (Map Pack) viktig for alle bedrifter?',
    answer:
      'Nei, absolutt ikke. Lokal synlighet i kartet er helt avgjørende hvis du driver en fysisk virksomhet hvor kundene kommer til deg, eller du drar ut til dem i et bestemt geografisk område (for eksempel tannleger, håndverkere eller fysioterapeuter). For en programvarebedrift, en nettbutikk eller en B2B-leverandør som opererer nasjonalt, har kartplasseringen svært lite å si for bunnlinjen. I slike tilfeller vil analysen vår flagge manglende kartplassering som et avvik, men strategisk vil vi råde dere til å ignorere det, og heller fokusere innsatsen på organisk SEO og autoritet som treffer den nasjonale kjøperen. Vi bygger ikke synlighet for synlighetens skyld, vi bygger det som driver lønnsomhet i din bransje.',
  },
  {
    question: 'Kan Floww Media hjelpe oss med å fikse feilene rapporten avdekker?',
    answer:
      'Ja. Rapporten er bygget slik at deres eget team eller nåværende utvikler kan følge sjekklisten steg for steg. Hvis dere heller ønsker at våre spesialister på teknisk SEO, Google Business Profile og AI-synlighet implementerer tiltakene for dere, trekker vi fra rapportprisen (1 490 kr eks. mva.) ved oppstart av samarbeid. Ta kontakt for å avdekke om et eventuelt samarbeid er mulig.',
  },
];

export default function SeoAnalyseLandingPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Hjem',
            item: 'https://flowwmedia.no',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'SEO-analyse',
            item: 'https://flowwmedia.no/seo-analyse',
          },
        ],
      },
      {
        '@type': 'SoftwareApplication',
        '@id': 'https://flowwmedia.no/seo-analyse#software',
        name: 'SEO-analyse av Floww Media',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        description:
          'Automatisert teknisk SEO-, Google Maps- og AI-synlighetsanalyse for norske bedrifter basert på 245 vektede målepunkter og Brønnøysundregistrene.',
        provider: {
          '@id': 'https://flowwmedia.no/#organization',
        },
        offers: {
          '@type': 'Offer',
          name: 'Komplett SEO-analyse (245 målepunkter + PDF handlingsplan)',
          price: '1490.00',
          priceCurrency: 'NOK',
          availability: 'https://schema.org/InStock',
          url: 'https://flowwmedia.no/seo-analyse',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: '1490.00',
            priceCurrency: 'NOK',
            valueAddedTaxIncluded: false,
          },
        },
      },
    ],
  };

  return (
    <div className="bg-brand-light min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <AuditScannerHero
        breadcrumbs={[
          { name: 'Hjem', href: '/' },
          { name: 'SEO-analyse' },
        ]}
        label="SYNLIGHETSANALYSE 2026 · 245 MÅLEPUNKTER"
      />

      {/* Summary Bar */}
      <section className="bg-brand-light">
        <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8">
          <SummaryList
            withBorders
            className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
          >
            <SummaryItem label="Omfang">245 målepunkter, vektet etter prioritet</SummaryItem>
            <SummaryItem label="Analysetid">~45 sekunder</SummaryItem>
            <SummaryItem label="Datakilder">+20 (bl.a. Brreg, Google, AI)</SummaryItem>
            <SummaryItem label="Komplett opplåsing">1 490 kr eks. mva.</SummaryItem>
          </SummaryList>
        </div>
      </section>

      {/* Editorial Section 1: Why visibility matters & Stats */}
      <EditorialSection
        bg="light"
        label="Hva rapporten avslører"
        title="Slutt å gjette hvorfor konkurrenten ligger over dere i Google og LLM's."
        paragraphs={[
          <>
            De fleste norske bedrifter har svakheter i sin tekniske grunnmur:
            manglende Schema.org-struktur, treg innlasting på mobil,
            ufullstendig Google Business-profil eller sprikende kontaktdata i
            norske kataloger. Hver eneste feil bremser{" "}
            <Link
              href="/seo"
              className="text-brand-pine font-semibold underline decoration-brand-pine/40 underline-offset-2"
            >
              organisk rangering
            </Link>
            , øker klikkprisen i{" "}
            <Link
              href="/google-ads"
              className="text-brand-pine font-semibold underline decoration-brand-pine/40 underline-offset-2"
            >
              Google Ads
            </Link>{" "}
            og fører til at varme kunder velger en konkurrent i stedet.
          </>,
        ]}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mt-6 md:mt-8 mb-10">
          <StatCard variant="dark" title="48 %">
            av alle lokale klikk i Google går til de tre øverste i kartet (Map Pack).
          </StatCard>
          <StatCard variant="dark" title="3,4x">
            høyere sannsynlighet for å bli sitert i AI-svar med komplett JSON-LD Schema.org.
          </StatCard>
          <StatCard variant="dark" title="245">
            vektede målepunkter kryssjekket mot Brønnøysundregistrene i sanntid.
          </StatCard>
        </div>

        <QuoteCard bg="sand" className="max-w-4xl">
          <p>
            Målet med vår egenutviklede analyse er å fjerne synsing fra digital synlighet. Når en
            daglig leder ser nøyaktig hvilke tekniske hull som koster bedriften 30 000 til
            150 000 kroner i tapt omsetning hver måned, blir det enkelt å sette inn støtet
            der det faktisk gir avkastning.
          </p>
        </QuoteCard>
      </EditorialSection>

      {/* Editorial Section 2: The 4 Pillars */}
      <EditorialSection
        bg="sand"
        label="Metodikk & 4 pilarer"
        title="Fire tekniske pilarer som avgjør hvem som vinner kunden."
        paragraphs={[
          "Vanlige gratisverktøy sjekker kun overfladisk HTML på forsiden. Vår motor kombinerer offisielle foretaksdata fra Enhetsregisteret med dyp teknisk crawling, lokal Geo-Grid-simulering og spørringer mot de største språkmodellene.",
        ]}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl mt-8">
          <Card accent="left" href="/lokal-seo" interactive>
            <CardHeader>
              <CardEyebrow>Del 1 · 72 målepunkter</CardEyebrow>
              <CardTitle as="h3">Google Business Profile &amp; Map Pack</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Vi sjekker kategorivalg, anmeldelsestakt, svarfrekvens, lokal synlighetsradius
                (3×3 Geo-Grid) og om profilen din konverterer søk til anrop og ruteveiledning.
              </CardDescription>
            </CardContent>
          </Card>

          <Card accent="left" href="/nettsider" interactive>
            <CardHeader>
              <CardEyebrow>Del 2 · 85 målepunkter</CardEyebrow>
              <CardTitle as="h3">Nettside, Hastighet &amp; On-Page SEO</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Vi måler TTFB, Core Web Vitals (LCP, CLS, INP), overskriftshierarki (H1–H3),
                meta-data, skjemastruktur, HTTPS/HSTS og konverteringspunkter over bretten.
              </CardDescription>
            </CardContent>
          </Card>

          <Card accent="left" href="/seo" interactive>
            <CardHeader>
              <CardEyebrow>Del 3 · 48 målepunkter</CardEyebrow>
              <CardTitle as="h3">Autoritet &amp; Norske Kataloger (NAP)</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Søkemotorer krever konsistens. Vi kryssjekker organisasjonsnummer, firmanavn,
                adresse og telefon mot Brønnøysundregistrene, 1881, Gule Sider og Proff.
              </CardDescription>
            </CardContent>
          </Card>

          <Card accent="left" href="/ai-seo" interactive>
            <CardHeader>
              <CardEyebrow>Del 4 · 40 målepunkter</CardEyebrow>
              <CardTitle as="h3">AI-synlighet (ChatGPT, Gemini, Claude &amp; Perplexity)</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Vi tester om AI-søkemotorer faktisk anbefaler bedriften din på bransjesøk, og
                om nettsiden har maskinlesbar JSON-LD Schema.org og llms.txt.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </EditorialSection>

      {/* Editorial Section 3: Transparent B2B Pricing */}
      <EditorialSection
        bg="dark"
        label="Ingen abonnement"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 flex flex-col gap-4">
            <h2 className="font-heading text-fluid-h2 text-brand-light">
              Start med gratis oversikt, eller lås opp hele oppskriften.
            </h2>
            <p className="font-body text-fluid-p text-brand-light/85 leading-relaxed">
              Tradisjonelle byråer fakturerer ofte minimum 15 000–25 000 kr for en manuell teknisk
              SEO-revisjon. Med vår SEO-analyse får du totalscore, økonomisk tapsberegning,
              Geo-Grid-kart og de første kritiske funnene gratis på under ett minutt.
            </p>
            <p className="font-body text-fluid-p text-brand-light/85 leading-relaxed">
              Ønsker dere å låse opp alle 245 målepunkter med ferdig utfylte JSON-LD
              kodeeksempler, prioritert tiltaksliste og nedlastbar A4 PDF-rapport til
              ledergruppen eller ditt nåværende byrå? Da betaler dere kun en engangssum, helt uten abonnement.
            </p>
          </div>

          <div className="lg:col-span-5 bg-brand-light text-brand-dark rounded-sm p-6 sm:p-8 border border-brand-dark/10 flex flex-col gap-5">
            <div className="flex items-baseline justify-between border-b border-brand-dark/10 pb-4">
              <div>
                <span className="text-micro uppercase tracking-wider text-brand-pine block">
                  KOMPLETT OPPLÅSING (ENGANGSKJØP)
                </span>
                <span className="font-heading text-3xl font-extrabold text-brand-dark">
                  1 490 kr
                </span>
                <span className="font-body text-xs text-brand-blue ml-1.5">eks. mva.</span>
              </div>
              <span className="px-2.5 py-1 rounded-sm bg-brand-sand text-brand-dark text-micro uppercase tracking-wider">
                Ingen binding
              </span>
            </div>

            <ul className="flex flex-col gap-2.5 font-body text-sm text-brand-dark">
              <li className="flex items-start gap-2.5">
                <span aria-hidden="true" className="text-brand-pine font-bold">✓</span>
                <span>Alle 245 tekniske målepunkter ulåst uten sensur</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span aria-hidden="true" className="text-brand-pine font-bold">✓</span>
                <span>Ferdig utfylt JSON-LD Schema.org-kode for utvikleren deres</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span aria-hidden="true" className="text-brand-pine font-bold">✓</span>
                <span>Prioritert handlingsplan sortert etter ROI vs. innsats</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span aria-hidden="true" className="text-brand-pine font-bold">✓</span>
                <span>A4 PDF-styrerapport og B2B MVA-kvittering</span>
              </li>
            </ul>
          </div>
        </div>
      </EditorialSection>

      <FAQSection faqs={faqs} />
      <CtaSection
        bg="sand"
        label="Klar til å teste?"
        title="Sjekk bedriften deres på 45 sekunder."
        description="Skriv inn domenet i skanneren øverst på siden og se hvordan dere scorer på tvers av 245 målepunkter i Google, Google-kartet og AI-søk."
        buttonText="Gå til skanneren øverst ↑"
        buttonHref="#top"
      />
    </div>
  );
}
