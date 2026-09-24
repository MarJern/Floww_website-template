import { Metadata } from "next";
import Script from "next/script";
import PageHeader from "@/components/sections/PageHeader";

export const metadata: Metadata = {
  title: "Personvernerklæring | Floww Media",
  description: "Slik behandler Floww AS dine personopplysninger. Vi bruker ingen informasjonskapsler (cookies) og du surfer helt anonymt.",
  alternates: {
    canonical: "https://flowwmedia.no/personvern",
  },
  openGraph: {
    title: "Personvernerklæring | Floww Media",
    description: "Slik behandler Floww AS dine personopplysninger. Ingen cookies, full anonymitet.",
    type: "website",
    locale: "nb_NO",
    url: "https://flowwmedia.no/personvern",
    siteName: "Floww Media"
  },
};

export default function PersonvernPage() {
  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Forside", "item": "https://flowwmedia.no/" },
      { "@type": "ListItem", "position": 2, "name": "Personvern", "item": "https://flowwmedia.no/personvern" }
    ]
  };

  return (
    <>
      <Script id="schema-breadcrumb-personvern" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <PageHeader
        label="Juridisk"
        title="Personvernerklæring"
        description="Slik behandler Floww AS dine personopplysninger. Vi bruker ingen informasjonskapsler (cookies) og du surfer helt anonymt."
      />
      <article className="py-[clamp(3rem,6.5vw,5.4rem)] bg-brand-light">
        <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8 grid grid-cols-1 md:grid-cols-[minmax(0,7rem)_minmax(0,1fr)] gap-[clamp(1.2rem,4vw,3.2rem)] items-start">
          <p className="text-micro uppercase text-brand-dark/50 m-0 mt-2">Personvern</p>
          <div className="flex flex-col gap-6">
            <p className="text-fluid-p-lg text-brand-dark/90 max-w-prose text-pretty">
              Når du besøker flowwmedia.no, eller tar kontakt med oss, deler du informasjon. Her forklarer vi hva vi samler inn, hvorfor vi gjør det, og hvordan vi beskytter dataene dine.
              <br /><br />
              Floww AS (org.nr. 922 758 476) er behandlingsansvarlig for personopplysningene vi samler inn.
            </p>
            <p className="text-fluid-p-lg text-brand-dark/90 max-w-prose text-pretty">
              Vi bruker ingen sporingsverktøy, ingen informasjonskapsler til markedsføring, og vi deler ingenting med annonsenettverk.
            </p>

            <h2 className="font-heading text-fluid-h3 text-brand-dark mt-6">Hva vi bruker opplysningene til</h2>
            <p className="text-fluid-p-lg text-brand-dark/90 max-w-prose text-pretty">
              Når du fyller ut kontaktskjemaet, ber vi om navn, e-post og telefonnummer. Opplysningene brukes utelukkende til å svare på henvendelsen din og gjennomføre en eventuell gratis gjennomgang av klinikkens synlighet. 
              <br /><br />
              Grunnlaget for behandlingen er berettiget interesse etter personvernforordningen artikkel 6 nr. 1 bokstav f, det vil si å besvare en henvendelse du selv har initiert.
            </p>

            <h2 className="font-heading text-fluid-h3 text-brand-dark mt-6">Hvor lenge vi lagrer dem</h2>
            <p className="text-fluid-p-lg text-brand-dark/90 max-w-prose text-pretty">
              Henvendelser som ikke fører til et kundeforhold, slettes senest innen tolv måneder. Blir du kunde hos oss, lagres opplysningene så lenge kundeforholdet varer, og deretter i fem år av hensyn til bokføringsloven.
            </p>

            <h2 className="font-heading text-fluid-h3 text-brand-dark mt-6">Sikkerhet og hvem som har tilgang</h2>
            <p className="text-fluid-p-lg text-brand-dark/90 max-w-prose text-pretty">
              Kun ansatte i Floww AS har tilgang til opplysningene, og vi prioriterer sikkerhet høyt. Når du fyller ut skjemaet på nettsiden, går dataene via vår sikre hosting-leverandør (Vercel) og behandles av vår e-postleverandør (Resend), før den mottas og lagres i vårt bedriftssystem for e-post (Google Workspace). All overføring skjer kryptert.
              <br /><br />
              Vi selger aldri opplysninger videre, og vi bruker dem ikke til nyhetsbrev eller annen markedsføring uten at du aktivt har bedt om det. Vi har inngått databehandleravtaler med alle våre leverandører for å sikre at de ivaretar ditt personvern.
            </p>

            <h2 className="font-heading text-fluid-h3 text-brand-dark mt-6">Informasjonskapsler (Cookies) og tredjeparter</h2>
            <p className="text-fluid-p-lg text-brand-dark/90 max-w-prose text-pretty">
              Nettstedet bruker ingen informasjonskapsler for sporing. Vi har derfor bevisst valgt bort det irriterende samtykkebanneret. 
              <br /><br />
              Fordi nettsiden vår er bygget med moderne teknologi (Next.js), er også alle skrifttyper lagret lokalt hos oss. Det betyr at ingen data eller IP-adresser sendes til tredjeparter som Google Fonts når du leser sidene våre. Du surfer helt anonymt.
            </p>

            <h2 className="font-heading text-fluid-h3 text-brand-dark mt-6">Dine rettigheter</h2>
            <p className="text-fluid-p-lg text-brand-dark/90 max-w-prose text-pretty">
              I henhold til GDPR har du flere rettigheter knyttet til vår behandling av dine personopplysninger:
            </p>
            <ul className="flex flex-col gap-3 ml-6 list-disc">
              <li className="text-fluid-p text-brand-dark/90 max-w-prose text-pretty">
                <strong>Innsyn:</strong> Du har rett til å få vite hvilke opplysninger vi har lagret om deg.
              </li>
              <li className="text-fluid-p text-brand-dark/90 max-w-prose text-pretty">
                <strong>Retting og sletting:</strong> Du kan be oss rette feilaktige opplysninger eller slette personopplysninger vi ikke lenger har lovmessig grunnlag for å beholde.
              </li>
              <li className="text-fluid-p text-brand-dark/90 max-w-prose text-pretty">
                <strong>Begrensning og protest:</strong> Du har rett til å kreve behandlingen begrenset eller protestere mot vår bruk av dataene.
              </li>
              <li className="text-fluid-p text-brand-dark/90 max-w-prose text-pretty">
                <strong>Dataportabilitet:</strong> Rett til å få utlevert dataene dine i et maskinlesbart format.
              </li>
            </ul>
            <p className="text-fluid-p-lg text-brand-dark/90 max-w-prose text-pretty mt-4">
              For å benytte deg av rettighetene dine, send en e-post til kontakt@flowwmedia.no, så svarer vi så raskt som mulig, og senest innen 30 dager.
              <br /><br />
              Mener du at vi behandler opplysninger i strid med regelverket, oppfordrer vi deg til å kontakte oss først, men du har også full rett til å klage til Datatilsynet (www.datatilsynet.no).
            </p>
          </div>
        </div>
      </article>
    </>
  );
}
