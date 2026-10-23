import { Metadata } from "next";
import Script from "next/script";
import EditorialSection from "@/components/sections/EditorialSection";
import PageHeader from "@/components/sections/PageHeader";

const PRICE_REPORT = "1 490";
const PRICE_REPORT_INCL_VAT = "1 862,50";

export const metadata: Metadata = {
  title: "Avtalevilkår og Betingelser",
  description:
    "Generelle forretnings- og avtalevilkår for leveranser fra Floww AS, inkludert Synlighetsrapporten (SEO-analyse), lokal SEO, AI-synlighet og teknisk webutvikling.",
  alternates: {
    canonical: "https://flowwmedia.no/vilkar",
  },
  openGraph: {
    title: "Avtalevilkår og Betingelser | Floww Media",
    description:
      "Generelle forretnings- og avtalevilkår for leveranser fra Floww AS.",
    type: "website",
    locale: "nb_NO",
    url: "https://flowwmedia.no/vilkar",
    siteName: "Floww Media",
    images: [
      {
        url: "/images/teamet.jpg",
        width: 1200,
        height: 630,
        alt: "Avtalevilkår og Betingelser for Floww Media",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Avtalevilkår og Betingelser | Floww Media",
    description:
      "Generelle forretnings- og avtalevilkår for leveranser fra Floww AS.",
    images: ["/images/teamet.jpg"],
  },
};

export default function VilkarPage() {
  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
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
        name: "Vilkår",
        item: "https://flowwmedia.no/vilkar",
      },
    ],
  };

  return (
    <>
      <Script
        id="schema-breadcrumb-vilkar"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <PageHeader
        breadcrumbs={[{ name: "Hjem", href: "/" }, { name: "Vilkår" }]}
        label="Juridisk"
        title="Avtalevilkår"
        description="Generelle forretnings- og avtalevilkår for leveranser fra Floww AS (org.nr. 922 758 476 MVA)."
      />
      <EditorialSection bg="light" label="Vilkår">
        <div className="flex flex-col gap-6 max-w-4xl">
          <h2 className="font-heading text-fluid-h3 text-brand-dark">
            1. Innledning
          </h2>
          <p className="text-fluid-p-lg text-brand-dark/90 text-pretty">
            Disse vilkårene gjelder for alle kjøp og avtaler inngått mellom
            Floww AS, org.nr. 922 758 476 MVA, Edvard Storms gate 2, 0166 Oslo
            (heretter &quot;Floww Media&quot; eller &quot;vi&quot;) og våre
            bedriftskunder (&quot;Kunden&quot;). Vilkårene omfatter SEO-analysen
            (Synlighetsrapporten), løpende partnerskap for organisk vekst (SEO,
            Lokal SEO og AI-SEO), Google Ads-forvaltning, foredrag og teknisk
            webutvikling.
          </p>

          <h2 className="font-heading text-fluid-h3 text-brand-dark mt-6">
            2. SEO-analysen / Kjøp av Synlighetsrapporten (Digital Bedriftsrapport)
          </h2>
          <p className="text-fluid-p-lg text-brand-dark/90 text-pretty">
            Synlighetsrapporten er en automatisert, datadreven teknisk SEO-,
            Google Maps- og AI-synlighetsanalyse med 245 målepunkter og
            tilhørende handlingsplan for norske virksomheter.
          </p>
          <ul className="flex flex-col gap-3 ml-6 list-disc">
            <li className="text-fluid-p text-brand-dark/90 text-pretty">
              <strong>Gratis forhåndsanalyse og bruksgrense:</strong> Den
              innledende skanningen og forhåndsanalysen leveres kostnadsfritt
              mot bekreftet jobb-e-postadresse. For å beskytte plattformen mot
              automatisert skraping og overbelastning av eksterne datakilder
              gjelder en bruksgrense (fair use) på maksimalt 3 gratis analyser
              per 24 timer. Tjenesten er forbeholdt norske virksomheter utenfor
              byråbransjen.
            </li>
            <li className="text-fluid-p text-brand-dark/90 text-pretty">
              <strong>Utelukkende B2B (Næringskjøp):</strong> Avtalen og kjøp av
              Synlighetsrapporten gjelder utelukkende mellom næringsdrivende
              (bedrifter med organisasjonsnummer). Angrerettloven gjelder ikke
              ved kjøp mellom næringsdrivende (jf. angrerettloven § 1). Dersom
              kjøper er et enkeltpersonforetak (ENK), leveres den digitale
              rapporten umiddelbart ved betaling, og kjøper samtykker til at
              levering påbegynnes straks slik at eventuell angrerett bortfaller
              (jf. angrerettloven § 22 bokstav n).
            </li>
            <li className="text-fluid-p text-brand-dark/90 text-pretty">
              <strong>Pris og Betaling:</strong> Komplett opplåsing av
              Synlighetsrapporten har en engangspris på{" "}
              <strong>{PRICE_REPORT} kr eks. mva.</strong> (
              <strong>{PRICE_REPORT_INCL_VAT} kr inkl. 25 % mva.</strong>), helt
              uten abonnement eller løpende binding. Betaling skjer med sikker
              kortbetaling via Stripe og gir umiddelbar opplåsing av full
              interaktiv rapport, nedlastbar PDF-utgave og regnskapskvittering
              med spesifisert MVA.
            </li>
            <li className="text-fluid-p text-brand-dark/90 text-pretty">
              <strong>Tilgangstid og Fradrag ved Videre Samarbeid:</strong>{" "}
              Rapporten er tilgjengelig via bedriftens unike, skjulte lenke i 12
              måneder fra kjøpsdato. Dersom bedriften inngår samarbeidsavtale
              med Floww Media innen 60 dager etter kjøpet, trekkes hele beløpet
              ({PRICE_REPORT} kr eks. mva.) fra første faktura.
            </li>
            <li className="text-fluid-p text-brand-dark/90 text-pretty">
              <strong>Reklamasjon:</strong> Henvendelser ved tekniske feil eller
              mangler ved rapportleveransen rettes til{" "}
              <a
                href="mailto:kontakt@flowwmedia.no"
                className="text-brand-pine underline font-semibold"
              >
                kontakt@flowwmedia.no
              </a>
              , så bistår vi eller foretar ny kjøring uten kostnad.
            </li>
          </ul>

          <h2 className="font-heading text-fluid-h3 text-brand-dark mt-6">
            3. Strategisk Partnerskap, SEO, Google Ads og Teknisk Webutvikling
          </h2>
          <p className="text-fluid-p-lg text-brand-dark/90 text-pretty">
            Leveranseomfang, resultatmal, eksklusivitetsklausul (én klient per
            bransje per avtalt geografisk eller nasjonalt marked) og
            kommersielle betingelser for løpende vekstpartnerskap og
            webutviklingsprosjekter reguleres i egen skriftlig oppdragsavtale
            mellom Floww AS og Kunden.
          </p>

          <h2 className="font-heading text-fluid-h3 text-brand-dark mt-6">
            4. AI-SEO, Foredrag og Rådgivning
          </h2>
          <p className="text-fluid-p-lg text-brand-dark/90 text-pretty">
            Vi gjør uttrykkelig oppmerksom på at svar i søkemotorer og
            språkmodeller (som ChatGPT, Gemini, Claude og Perplexity) genereres
            dynamisk av tredjepartsleverandører. Floww Media garanterer aldri
            et bestemt statisk tekstsvar i en språkmodell, men leverer det
            tekniske og strukturelle arbeidet (JSON-LD Schema.org,
            entitetsdata, katalogkonsistens og kildegrunnlag) som disse
            systemene henter informasjonen sin fra.
          </p>

          <h2 className="font-heading text-fluid-h3 text-brand-dark mt-6">
            5. Konfidensialitet, ansvar og verneting
          </h2>
          <p className="text-fluid-p-lg text-brand-dark/90 text-pretty">
            Kunden beholder eierskap til alt innhold og alle data de selv
            leverer. Eventuelle økonomiske opplysninger som Kunden frivillig
            oppgir om eksisterende byråforhold og markedsføringskostnader
            (Byrå-regnskapet) behandles strengt konfidensielt. Opplysningene
            benyttes utelukkende til å beregne avkastning (ROI) i Kundens egen
            rapport og ved direkte rådgiverdialog med Kunden, og vil aldri bli
            publisert eller delt med tredjeparter.
            <br />
            <br />
            Floww Media fraskriver seg ethvert ansvar for direkte eller
            indirekte tap som følge av endringer i tredjeparters algoritmer
            (f.eks. Google, OpenAI, Anthropic eller Perplexity). Vårt maksimale
            erstatningsansvar er i alle tilfeller begrenset til det beløpet
            Kunden har betalt for den spesifikke tjenesten de siste 12 månedene.
            Avtalen reguleres av norsk rett, med Oslo tingrett som verneting.
          </p>
        </div>
      </EditorialSection>
    </>
  );
}