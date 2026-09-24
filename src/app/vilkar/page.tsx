import { Metadata } from "next";
import Script from "next/script";
import PageHeader from "@/components/sections/PageHeader";

// --- PRIS- OG MATEMATIKK-KONSTANTER ---
const PRICE_TOTAL = "79 000";
const PRICE_UPFRONT = "39 500";
const PRICE_TIER_1 = "39 500"; // Topp 1-3
const PRICE_TIER_2 = "23 700"; // Topp 4-5
const PRICE_TIER_3 = "15 800"; // Topp 6-10
const PRICE_RETAINER = "7 500"; // Månedlig vedlikehold
const PRICE_LECTURE = "25 000"; // Foredrag
const PRICE_AI_CHECK = "15 000"; // AI-synlighetssjekk

export const metadata: Metadata = {
  title: "Avtalevilkår og Betingelser | Floww Media",
  description: "Generelle forretnings- og avtalevilkår for leveranser fra Floww AS, inkludert Lokal SEO, AI-synlighet og skreddersydde nettsider.",
  alternates: {
    canonical: "https://flowwmedia.no/vilkar",
  },
  openGraph: {
    title: "Avtalevilkår og Betingelser | Floww Media",
    description: "Generelle forretnings- og avtalevilkår for leveranser fra Floww AS.",
    type: "website",
    locale: "nb_NO",
    url: "https://flowwmedia.no/vilkar",
    siteName: "Floww Media"
  },
};

export default function VilkarPage() {
  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Forside", "item": "https://flowwmedia.no/" },
      { "@type": "ListItem", "position": 2, "name": "Vilkår", "item": "https://flowwmedia.no/vilkar" }
    ]
  };

  return (
    <>
      <Script id="schema-breadcrumb-vilkar" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <PageHeader
        label="Juridisk"
        title="Avtalevilkår"
        description="Generelle forretnings- og avtalevilkår for leveranser fra Floww AS."
      />
      <article className="py-[clamp(3rem,6.5vw,5.4rem)] bg-brand-light">
        <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8 grid grid-cols-1 md:grid-cols-[minmax(0,7rem)_minmax(0,1fr)] gap-[clamp(1.2rem,4vw,3.2rem)] items-start">
          <p className="text-micro uppercase text-brand-dark/50 m-0 mt-2">Vilkår</p>
          <div className="flex flex-col gap-6">
            <h2 className="font-heading text-fluid-h3 text-brand-dark">Innledning</h2>
            <p className="text-fluid-p-lg text-brand-dark/90 max-w-prose text-pretty">
              Disse vilkårene gjelder for alle avtaler inngått mellom Floww AS (heretter &quot;Floww Media&quot; eller &quot;vi&quot;) og våre bedriftskunder (&quot;Kunden&quot;). Vilkårene gjelder tjenester som Lokal SEO, AI-synlighetssjekk, foredrag og webutvikling.
            </p>

            <h2 className="font-heading text-fluid-h3 text-brand-dark mt-6">Lokal SEO & Synlighetsanalyse</h2>
            <p className="text-fluid-p-lg text-brand-dark/90 max-w-prose text-pretty">
              Oppdraget for Lokal SEO har en fastpris på {PRICE_TOTAL} kr eks. mva.
            </p>
            <ul className="flex flex-col gap-3 ml-6 list-disc">
              <li className="text-fluid-p text-brand-dark/90 max-w-prose text-pretty">
                <strong>Oppstart:</strong> {PRICE_UPFRONT} kr eks. mva. faktureres ved avtaleinngåelse. Beløpet er ikke refunderbart.
              </li>
              <li className="text-fluid-p text-brand-dark/90 max-w-prose text-pretty">
                <strong>Resultatbasert honorar:</strong> Det resterende beløpet faktureres etter åtte uker, utelukkende basert på oppnådd plassering i Googles lokalpakke. Plasseringen måles fra klinikkens egen, fysiske adresse på de 3–5 søkeordene vi har avtalt skriftlig.
              </li>
              <li className="text-fluid-p text-brand-dark/90 max-w-prose text-pretty">
                <strong>Resultattrapp:</strong> Plass 1-3 faktureres med {PRICE_TIER_1} kr. Plass 4-5 med {PRICE_TIER_2} kr. Plass 6-10 med {PRICE_TIER_3} kr. Ligger bedriften utenfor topp 10, faktureres ingenting utover oppstartshonoraret.
              </li>
            </ul>

            <h2 className="font-heading text-fluid-h3 text-brand-dark mt-6">Løpende vedlikehold</h2>
            <p className="text-fluid-p-lg text-brand-dark/90 max-w-prose text-pretty">
              Etter at de åtte ukene med Synlighetsanalysen er gjennomført, har kunden mulighet til å inngå en løpende vedlikeholdsavtale (normalt {PRICE_RETAINER} kr/mnd) for å beskytte plasseringen. Avtalen har ingen bindingstid og kan sies opp med inneværende + 1 måneds varsel.
            </p>

            <h2 className="font-heading text-fluid-h3 text-brand-dark mt-6">AI-SEO og Rådgivning</h2>
            <p className="text-fluid-p-lg text-brand-dark/90 max-w-prose text-pretty">
              For foredrag ({PRICE_LECTURE} kr) og AI-synlighetssjekk ({PRICE_AI_CHECK} kr) faktureres beløpet i sin helhet etter gjennomført leveranse med 14 dagers forfall. Vi gjør uttrykkelig oppmerksom på at AI-motorers (som ChatGPT) svar genereres dynamisk. Floww Media garanterer aldri en spesifikk plassering i et AI-svar, men leverer strukturelt arbeid for å optimalisere kildene disse maskinene lener seg på.
            </p>

            <h2 className="font-heading text-fluid-h3 text-brand-dark mt-6">Ansvar og rettigheter</h2>
            <p className="text-fluid-p-lg text-brand-dark/90 max-w-prose text-pretty">
              Kunden beholder eierskap til alt innhold de selv leverer. Floww Media fraskriver seg ethvert ansvar for direkte eller indirekte tap som følge av endringer i tredjeparters algoritmer (f.eks. Google). Vårt maksimale erstatningsansvar er i alle tilfeller begrenset til det beløpet Kunden har betalt for den spesifikke tjenesten de siste 12 månedene.
            </p>

            <h2 className="font-heading text-fluid-h3 text-brand-dark mt-6">Tvister</h2>
            <p className="text-fluid-p-lg text-brand-dark/90 max-w-prose text-pretty">
              Avtalen reguleres av norsk rett. Eventuelle tvister som ikke løses i minnelighet, har Oslo tingrett som verneting.
            </p>
          </div>
        </div>
      </article>
    </>
  );
}