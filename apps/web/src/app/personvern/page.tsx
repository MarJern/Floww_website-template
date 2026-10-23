import { Metadata } from "next";
import Script from "next/script";
import EditorialSection from "@/components/sections/EditorialSection";
import PageHeader from "@/components/sections/PageHeader";

export const metadata: Metadata = {
  title: "Personvernerklæring",
  description:
    "Slik behandler Floww AS dine personopplysninger ved kontakt og bruk av SEO-analysen (Synlighetsrapporten). Ingen markedsføringscookies og full etterlevelse av GDPR.",
  alternates: {
    canonical: "https://flowwmedia.no/personvern",
  },
  openGraph: {
    title: "Personvernerklæring | Floww Media",
    description:
      "Slik behandler Floww AS dine personopplysninger ved kontakt og bruk av SEO-analysen (Synlighetsrapporten).",
    type: "website",
    locale: "nb_NO",
    url: "https://flowwmedia.no/personvern",
    siteName: "Floww Media",
    images: [
      {
        url: "/images/teamet.jpg",
        width: 1200,
        height: 630,
        alt: "Personvernerklæring for Floww Media",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Personvernerklæring | Floww Media",
    description:
      "Slik behandler Floww AS dine personopplysninger ved kontakt og bruk av SEO-analysen (Synlighetsrapporten).",
    images: ["/images/teamet.jpg"],
  },
};

export default function PersonvernPage() {
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
        name: "Personvern",
        item: "https://flowwmedia.no/personvern",
      },
    ],
  };

  return (
    <>
      <Script
        id="schema-breadcrumb-personvern"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <PageHeader
        breadcrumbs={[{ name: "Hjem", href: "/" }, { name: "Personvern" }]}
        label="Juridisk"
        title="Personvernerklæring"
        description="Slik behandler Floww AS (org.nr. 922 758 476 MVA) opplysninger når du bruker nettsiden vår, kjører SEO-analysen (Synlighetsrapporten) eller tar kontakt med oss."
      />
      <EditorialSection bg="light" label="Personvern">
        <div className="flex flex-col gap-6 max-w-4xl">
          <p className="text-fluid-p-lg text-brand-dark/90 text-pretty">
            Når du besøker flowwmedia.no, benytter SEO-analysen
            (Synlighetsrapporten) eller tar kontakt med oss, behandler vi
            opplysninger i samsvar med personopplysningsloven og EUs
            personvernforordning (GDPR).
            <br />
            <br />
            <strong>Floww AS</strong> (org.nr. 922 758 476 MVA, Edvard Storms
            gate 2, 0166 Oslo, e-post:{" "}
            <a
              href="mailto:kontakt@flowwmedia.no"
              className="text-brand-pine underline font-semibold"
            >
              kontakt@flowwmedia.no
            </a>
            ) er behandlingsansvarlig.
          </p>

          <h2 className="font-heading text-fluid-h3 text-brand-dark mt-6">
            1. Hvilke opplysninger vi behandler og rettslig grunnlag
          </h2>
          <p className="text-fluid-p-lg text-brand-dark/90 text-pretty">
            Vi behandler kun opplysninger som er nødvendige for å levere våre
            digitale analyser, besvare henvendelser, beskytte tjenesten mot
            misbruk og oppfylle avtaler med bedriftskunder:
          </p>
          <ul className="flex flex-col gap-3 ml-6 list-disc">
            <li className="text-fluid-p text-brand-dark/90 text-pretty">
              <strong>Kontaktskjema og kundedialog:</strong> Når du fyller ut
              kontaktskjemaet på nettsiden eller bestiller oppfølging fra en
              rådgiver, registrerer vi navn, bedriftsnavn, adresse,
              e-postadresse, telefonnummer og eventuell melding.
              Behandlingsgrunnlaget er GDPR art. 6 nr. 1 bokstav f (berettiget
              interesse i å besvare henvendelser du selv initierer) og art. 6
              nr. 1 bokstav b (tiltak før avtaleinngåelse).
            </li>
            <li className="text-fluid-p text-brand-dark/90 text-pretty">
              <strong>
                SEO-analysen / Synlighetsrapporten (Offentlige foretaksdata og
                teknisk analyse, GDPR art. 14):
              </strong>{" "}
              Når en bedrift søkes opp eller analyseres, henter systemet
              offentlig tilgjengelig foretaksinformasjon fra
              Brønnøysundregistrene (Enhetsregisteret, herunder firmanavn,
              organisasjonsnummer, NACE-bransjekode, forretningsadresse og
              registrert daglig leder), samt offentlig tilgjengelig informasjon
              fra bedriftens nettside, Google Business Profile / Google Maps og
              åpne norske bransjekataloger. Behandlingsgrunnlaget er GDPR art. 6
              nr. 1 bokstav f (berettiget interesse i å utføre en etterspurt
              B2B-synlighetsanalyse basert på åpne, offentlige kilder).
            </li>
            <li className="text-fluid-p text-brand-dark/90 text-pretty">
              <strong>
                Bestilling av gratis forhåndsanalyse og valgfritt byrå-regnskap
                (GDPR art. 13):
              </strong>{" "}
              For å generere og få tilsendt lenke til den gratis
              forhåndsanalysen oppgir du jobb-e-postadressen din. Vi utfører en
              automatisk teknisk kontroll av at e-postdomenet har gyldig
              e-postmottak (DNS MX-oppslag) for å forhindre falske oppslag,
              sender rapportlenken på e-post og registrerer henvendelsen for
              eventuell faglig rådgiveroppfølging. Dersom du frivillig oppgir
              nåværende månedlig byråkostnad og samarbeidsvarighet
              (Byrå-regnskapet), behandles disse tallene konfidensielt for å
              beregne avkastning (ROI) i bedriftens rapport og som grunnlag ved
              eventuell rådgiverdialog. Opplysningene deles eller publiseres
              aldri eksternt. Behandlingsgrunnlaget er GDPR art. 6 nr. 1
              bokstav b (levering av etterspurt digital analyse) og art. 6 nr. 1
              bokstav f (berettiget interesse i B2B-kundedialog).
            </li>
            <li className="text-fluid-p text-brand-dark/90 text-pretty">
              <strong>
                Kjøp og opplåsing av komplett rapport (GDPR art. 13):
              </strong>{" "}
              Ved kjøp av full tilgang til Synlighetsrapporten behandler vi
              kjøpers e-postadresse, bedriftsnavn, organisasjonsnummer og
              betalingsstatus for å levere den ulåste rapporten, generere
              PDF-styrerapport og utstede regnskapskvittering. Kortopplysninger
              håndteres direkte av Stripe og lagres aldri hos oss.
              Behandlingsgrunnlaget er GDPR art. 6 nr. 1 bokstav b (oppfyllelse
              av kjøpsavtale) og art. 6 nr. 1 bokstav c (rettslig forpliktelse
              etter bokføringsloven).
            </li>
            <li className="text-fluid-p text-brand-dark/90 text-pretty">
              <strong>
                Sikkerhet, misbruksvern og hastighetsbegrensning:
              </strong>{" "}
              For å beskytte analyseplattformen og kontaktskjemaet mot
              automatisert skraping, spam og misbruk av eksterne datakilder,
              håndhever vi en bruksgrense på maksimalt 3 gratis analyser per 24
              timer (samt inntil 5 skjemainnsendinger per 10 minutter). Rå
              IP-adresser lagres aldri i vår database: ved skanning omgjøres
              IP-adressen umiddelbart i arbeidsminnet til en enveis kryptert og
              saltet SHA-256-hash som slettes automatisk etter 7 dager.
              Behandlingsgrunnlaget er GDPR art. 6 nr. 1 bokstav f (berettiget
              interesse i informasjonssikkerhet og vern mot misbruk, jf. GDPR
              art. 32).
            </li>
          </ul>

          <h2 className="font-heading text-fluid-h3 text-brand-dark mt-6">
            2. Databehandlere og datakilder (GDPR art. 28)
          </h2>
          <p className="text-fluid-p-lg text-brand-dark/90 text-pretty">
            Vi selger aldri opplysninger videre til tredjeparter. For å drifte
            tjenesten sikkert benytter vi følgende underleverandører og
            datakilder regulert av databehandleravtaler:
          </p>
          <ul className="flex flex-col gap-3 ml-6 list-disc">
            <li className="text-fluid-p text-brand-dark/90 text-pretty">
              <strong>Vercel Inc.:</strong> Sikker applikasjonsdrift (hosting)
              og anonymisert, informasjonskapselfri trafikkmåling (Vercel Web
              Analytics).
            </li>
            <li className="text-fluid-p text-brand-dark/90 text-pretty">
              <strong>Supabase:</strong> Sikker PostgreSQL-databaselagring
              (EU-region) for genererte synlighetsrapporter, henvendelser og
              ordrestatus.
            </li>
            <li className="text-fluid-p text-brand-dark/90 text-pretty">
              <strong>Stripe Payments Europe Ltd.:</strong> Sikker kortbetaling
              og kvitteringshåndtering ved opplåsing av Synlighetsrapporten.
            </li>
            <li className="text-fluid-p text-brand-dark/90 text-pretty">
              <strong>Resend &amp; Google Workspace:</strong> Kryptert
              utsendelse av transaksjons-e-post (rapportlenke og kvittering)
              samt mottak og oppfølging av skjemameldinger.
            </li>
            <li className="text-fluid-p text-brand-dark/90 text-pretty">
              <strong>Offentlige registre og tekniske måleverktøy:</strong>{" "}
              Brønnøysundregistrene (åpne foretaksdata) samt offentlige søke-,
              kart- og ytelsesverktøy (herunder Google-tjenester og eksterne
              SERP-/indekseringsleverandører) for teknisk analyse av offentlige
              bedriftsdomener.
            </li>
          </ul>

          <h2 className="font-heading text-fluid-h3 text-brand-dark mt-6">
            3. Lagringstid og sletting
          </h2>
          <p className="text-fluid-p-lg text-brand-dark/90 text-pretty">
            Vi lagrer ikke opplysninger lenger enn det som er nødvendig for
            formålet:
          </p>
          <ul className="flex flex-col gap-3 ml-6 list-disc">
            <li className="text-fluid-p text-brand-dark/90 text-pretty">
              <strong>Anonymisert sikkerhets-hash (misbruksvern):</strong>{" "}
              Enveis krypterte IP-hasher for hastighetsbegrensning utløper og
              slettes etter <strong>7 dager</strong>.
            </li>
            <li className="text-fluid-p text-brand-dark/90 text-pretty">
              <strong>Midlertidige rådata fra teknisk skanning:</strong> Rådata
              og mellomlagrede nettstedssvar fra skanninger slettes automatisk
              etter <strong>30 dager</strong>.
            </li>
            <li className="text-fluid-p text-brand-dark/90 text-pretty">
              <strong>Synlighetsrapporter og henvendelser:</strong> Genererte
              synlighetsrapporter (inkludert eventuelle frivillig oppgitte
              byråkostnader) og tilhørende salgs-/rådgiverhenvendelser lagres i
              opptil <strong>12 måneder</strong> slik at bedriften har tilgang
              til sin unike rapportlenke, eller slettes tidligere på forespørsel
              til{" "}
              <a
                href="mailto:kontakt@flowwmedia.no"
                className="text-brand-pine underline font-semibold"
              >
                kontakt@flowwmedia.no
              </a>
              .
            </li>
            <li className="text-fluid-p text-brand-dark/90 text-pretty">
              <strong>Regnskaps- og betalingsdokumentasjon:</strong> Ordre- og
              transaksjonsdata ved kjøp oppbevares i <strong>5 år</strong> etter
              regnskapsårets slutt i henhold til bokføringsloven § 13.
            </li>
          </ul>

          <h2 className="font-heading text-fluid-h3 text-brand-dark mt-6">
            4. Informasjonskapsler (Cookies) og anonym trafikkmåling
          </h2>
          <p className="text-fluid-p-lg text-brand-dark/90 text-pretty">
            Nettstedet bruker <strong>null markedsføringscookies</strong> og
            ingen sporing på tvers av nettsteder. Vi deler ingen besøksdata med
            annonsenettverk.
            <br />
            <br />
            Vi benytter kun Vercel Web Analytics for overordnet, anonymisert
            trafikkmåling (sidevisninger og ytelse) helt uten bruk av
            informasjonskapsler (cookies), og alle skrifttyper lastes lokalt fra
            vår egen server uten kall til Google Fonts.
            <br />
            <br />
            Dersom du velger å låse opp den komplette Synlighetsrapporten, kan
            vår betalingsleverandør Stripe benytte strengt nødvendige
            sikkerhets- og sesjonskapsler under selve betalingsprosessen for å
            gjennomføre transaksjonen og forhindre kortsvindel. Siden vi kun
            benytter strengt nødvendige funksjons- og sikkerhetsmekanismer (jf.
            ekomloven § 3-15), kreves det ikke samtykkebanner på nettstedet.
          </p>

          <h2 className="font-heading text-fluid-h3 text-brand-dark mt-6">
            5. Dine rettigheter
          </h2>
          <p className="text-fluid-p-lg text-brand-dark/90 text-pretty">
            I henhold til GDPR kapittel III har du rett til:
          </p>
          <ul className="flex flex-col gap-3 ml-6 list-disc">
            <li className="text-fluid-p text-brand-dark/90 text-pretty">
              <strong>Innsyn:</strong> Få vite hvilke opplysninger vi eventuelt
              har lagret om deg eller ditt foretak.
            </li>
            <li className="text-fluid-p text-brand-dark/90 text-pretty">
              <strong>Retting og sletting:</strong> Kreve feilaktige
              opplysninger rettet eller be om at en generert synlighetsrapport,
              oppgitte byråtall eller en henvendelse slettes umiddelbart.
            </li>
            <li className="text-fluid-p text-brand-dark/90 text-pretty">
              <strong>Begrensning, protest og dataportabilitet:</strong>{" "}
              Protestere mot behandling basert på berettiget interesse (GDPR
              art. 21) eller få utlevert opplysninger i maskinlesbart format.
            </li>
          </ul>
          <p className="text-fluid-p-lg text-brand-dark/90 text-pretty mt-4">
            For å benytte deg av rettighetene dine, send en e-post til{" "}
            <a
              href="mailto:kontakt@flowwmedia.no"
              className="text-brand-pine underline font-semibold"
            >
              kontakt@flowwmedia.no
            </a>
            , så svarer vi så raskt som mulig og senest innen 30 dager. Du har
            også rett til å klage til Datatilsynet (www.datatilsynet.no) dersom
            du mener behandlingen er i strid med regelverket.
          </p>
        </div>
      </EditorialSection>
    </>
  );
}
