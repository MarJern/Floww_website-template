import { Metadata } from "next";
import Script from "next/script";
import FAQSection from "@/components/sections/FAQSection";
import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardEyebrow } from "@/components/ui/Card";
import PageHeader from "@/components/sections/PageHeader";
import QuoteCard from "@/components/ui/QuoteCard";
import CtaSection from "@/components/sections/CtaSection";

// --- PRIS- OG MATEMATIKK-KONSTANTER ---
const PRICE_TOTAL = "79 000";
const PRICE_UPFRONT = "39 500";
const PRICE_TIER_1 = "39 500"; // Topp 1-3
const PRICE_TIER_2 = "23 700"; // Topp 4-5
const PRICE_TIER_3 = "15 800"; // Topp 6-10

export const metadata: Metadata = {
  title: "Skreddersydde Nettsider & Plattformer | Floww Media",
  description: "Er nettsiden din en flaskehals for synlighet? Vi bygger lynraske, optimaliserte nettsider, eller fikser den plattformen du allerede har.",
  alternates: {
    canonical: "/nettsider",
  },
  openGraph: {
    title: "Skreddersydde Nettsider & Plattformer | Floww Media",
    description: "Er nettsiden din en flaskehals for synlighet? Vi bygger lynraske, optimaliserte nettsider, eller fikser den plattformen du allerede har.",
    type: "website",
    locale: "nb_NO",
    url: "https://flowwmedia.no/nettsider/",
    siteName: "Floww Media"
  },
};

const webFaqs = [
  {
    question: "Må vi bygge ny nettside for å få hjelp med SEO?",
    answer: "Ikke nødvendigvis. Vi starter alltid med en analyse. Hvis din eksisterende plattform (som WordPress, Shopify eller Webflow) kan reddes, optimaliserer vi den. Men hvis den tekniske gjelden er for stor og hindrer deg i å nå topp 3 i Google-kartet, vil vi anbefale å bygge en ny, skreddersydd løsning."
  },
  {
    question: "Hvor lang tid tar det å bygge en ny nettside?",
    answer: "Normalt tar et standard nettsideprosjekt mellom 4 til 8 uker fra oppstartsmøte til lansering. Dette avhenger av prosjektets kompleksitet og hvor raskt innholdet er på plass."
  },
  {
    question: "Hva koster en skreddersydd plattform?",
    answer: "Investeringen varierer basert på funksjonalitet, designkrav og integrasjoner. Siden vi ikke bruker trege, ferdige maler, skreddersyr vi et tilbud basert på hva som faktisk kreves for at din bedrift skal dominere i deres marked. Ta kontakt for en gratis kartlegging."
  },
  {
    question: "Hva skjer etter lansering? Må vi oppdatere siden selv?",
    answer: "Du slipper å logge inn i kompliserte systemer og frykte at noe knekker. Vi tilbyr faste, trygge vedlikeholdsavtaler der vi tar oss av hosting, sikkerhetsoppdateringer, overvåking og publisering av nytt innhold. Du fokuserer på pasientene, vi fikser teknologien."
  }
];

export default function NettsiderPage() {

  const jsonLdService = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Webdesign og Webutvikling",
    "provider": {
      "@type": "ProfessionalService",
      "name": "Floww Media",
      "url": "https://flowwmedia.no/"
    },
    "description": "Vi bygger lynraske plattformer for lokal SEO, eller optimaliserer den nettsiden du allerede har."
  };

  return (
    <>
      <Script id="schema-service-nettsider" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdService) }} />

      <PageHeader
        label="Webdesign & Utvikling"
        title="Når nettsiden din står i veien for synligheten."
        description="Vi leverer lokal SEO med resultatgaranti.* Men hvis dagens nettside er treig og usynlig for Google, må grunnmuren fikses først. Vi bygger lynraske plattformer, eller optimaliserer den du allerede har."
      />

      <article className="py-[clamp(3rem,6.5vw,5.4rem)] bg-brand-light">
        <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8 grid grid-cols-1 md:grid-cols-[minmax(0,7rem)_minmax(0,1fr)] gap-[clamp(1.2rem,4vw,3.2rem)] items-start">
          <p className="text-micro uppercase text-brand-dark/50 m-0">Problemet</p>
          <div>
            <h2 className="font-heading text-fluid-h2 mb-5 text-brand-dark text-pretty">
              Hastighet dreper konverteringer.
            </h2>
            <p className="text-fluid-p-lg text-brand-dark/90 max-w-prose mb-4 text-pretty">
              Måten en nettside er programmert på dikterer hvor godt Google forstår den, som igjen bestemmer din rangering i søkevinduet. For at kunden skal velge deg, må du rangere høyt på Google når de søker etter dine tjenester.
            </p>
            <p className="text-fluid-p-lg text-brand-dark/90 max-w-prose mb-8 text-pretty">
              Men synlighet er bare halve jobben. Hvis nettsiden din er treg når kunden først klikker, straffes du dobbelt av både brukerne og Google.
            </p>

            <QuoteCard bg="sand" className="mt-10 max-w-4xl">
              <p>
                SEO får kunden til døra, men hastigheten avgjør om de faktisk går inn. Hvis siden din er treg, snur de i døra og da noterer Google deg umiddelbart at du ikke er verdt å anbefale neste gang.
              </p>
            </QuoteCard>

          </div>
        </div>
      </article>

      <article className="py-[clamp(3rem,6.5vw,5.4rem)] bg-brand-sand">
        <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8 grid grid-cols-1 md:grid-cols-[minmax(0,7rem)_minmax(0,1fr)] gap-[clamp(1.2rem,4vw,3.2rem)] items-start">
          <p className="text-micro uppercase text-brand-dark/50 m-0">Strategi</p>
          <div>
            <h2 className="font-heading text-fluid-h2 mb-5 text-brand-dark text-pretty">
              Nettside med synlighet som utgangspunkt.
            </h2>
            <p className="text-fluid-p-lg text-brand-dark/90 max-w-prose mb-4 text-pretty">
              Vi skiller ikke på webutvikling og SEO. Å bygge en nettside uten å tenke synlighet fra første kodelinje, er som å bygge en fantastisk klinikk i skogen uten vei frem.
            </p>
            <p className="text-fluid-p-lg text-brand-dark/90 max-w-prose mb-4 text-pretty">
              Derfor starter vi alltid prosessen med den samme dyptgående analysen vi bruker for våre rene synlighetskunder. Når du investerer i en plattform fra oss, får du skreddersydd design, innholdsstruktur og teknisk SEO i fullstendig harmoni.
            </p>
            <ul className="mt-8 mb-0 p-0 list-none">
              <li className="relative py-4 pl-6 border-t border-brand-dark/10 text-brand-dark/90 first:border-t-0 before:absolute before:left-0 before:top-[1.6rem] before:w-2 before:h-px before:bg-brand-accent max-w-prose text-pretty">
                <strong className="font-bold text-brand-dark block mb-1">Innsikt før kode</strong>
                Vi bygger ingenting før vi vet nøyaktig hva dine potensielle pasienter søker etter, og hvordan konkurrentene dine er posisjonert lokalt. Alt innhold kartlegges før designet tegnes.
              </li>
              <li className="relative py-4 pl-6 border-t border-brand-dark/10 text-brand-dark/90 before:absolute before:left-0 before:top-[1.6rem] before:w-2 before:h-px before:bg-brand-accent max-w-prose text-pretty">
                <strong className="font-bold text-brand-dark block mb-1">Teknologi som Google elsker</strong>
                Vi bruker bransjens ledende rammeverk for ytelse (Next.js). Ikke fordi det er kult, men fordi lynraske sider med ren kode belønnes direkte i Googles algoritmer med høyere rangering.
              </li>
              <li className="relative py-4 pl-6 border-t border-brand-dark/10 text-brand-dark/90 before:absolute before:left-0 before:top-[1.6rem] before:w-2 before:h-px before:bg-brand-accent max-w-prose text-pretty">
                <strong className="font-bold text-brand-dark block mb-1">Tailwind CSS & Universell Utforming</strong>
                Skreddersydd designsystem bygget fra grunnen av, uten unødvendig kode. Det betyr millimeterpresisjon, lynrask innlasting og full WCAG-kompatibilitet for alle brukere.
              </li>
              <li className="relative py-4 pl-6 border-t border-brand-dark/10 text-brand-dark/90 before:absolute before:left-0 before:top-[1.6rem] before:w-2 before:h-px before:bg-brand-accent max-w-prose text-pretty">
                <strong className="font-bold text-brand-dark block mb-1">Universell utforming (WCAG)</strong>
                Vi designer for alle. Sidene vi bygger er fullt ut tilgjengelige for svaksynte og skjermlesere, noe som både er lovpålagt i Norge og et sterkt kvalitetssignal til søkemotorene.
              </li>
              <li className="relative py-4 pl-6 border-t border-brand-dark/10 text-brand-dark/90 before:absolute before:left-0 before:top-[1.6rem] before:w-2 before:h-px before:bg-brand-accent max-w-prose text-pretty">
                <strong className="font-bold text-brand-dark block mb-1">Strukturert for lokal dominans</strong>
                Nettsiden bygges med avansert Schema-merking og dedikerte landingssider for hver eneste behandling dere tilbyr. Alt er rigget for å treffe rett inn i Googles lokalpakke.
              </li>
              <li className="relative py-4 pl-6 border-t border-brand-dark/10 text-brand-dark/90 before:absolute before:left-0 before:top-[1.6rem] before:w-2 before:h-px before:bg-brand-accent max-w-prose text-pretty">
                <strong className="font-bold text-brand-dark block mb-1">Optimalisering av eksisterende plattformer</strong>
                Trenger du ikke en helt ny side? Ingen problem. Enten du sitter på WordPress, Webflow eller Shopify, kan vi gå inn i maskinrommet og rydde opp teknisk gjeld slik at siden din faktisk yter optimalt.
              </li>
            </ul>
          </div>
        </div>
      </article>

      <article className="py-[clamp(3rem,6.5vw,5.4rem)] bg-brand-light">
        <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8 grid grid-cols-1 md:grid-cols-[minmax(0,7rem)_minmax(0,1fr)] gap-[clamp(1.2rem,4vw,3.2rem)] items-start">
          <p className="text-micro uppercase text-brand-dark/50 m-0 mt-2">Metodikk</p>
          <div className="w-full">
            <h2 className="font-heading text-fluid-h2 mb-5 text-brand-dark text-pretty">
              Vi bygger baklengs. Fra Google-søket til ferdig nettside.
            </h2>
            <p className="text-fluid-p-lg text-brand-dark/90 max-w-prose mb-10 text-pretty">
              De fleste byråer designer en pen nettside først, og prøver å &quot;legge til SEO&quot; helt til slutt. Det fungerer sjelden. Vi snur det på hodet. Vi begynner med å finne ut nøyaktig hva pasientene i ditt område faktisk søker etter, og lar det diktere hele arkitekturen.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
              <Card accent="left" variant="sand">
                <CardHeader>
                  <CardTitle as="h3" className="break-words hyphens-auto">Én side per problem</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Pasienter søker etter spesifikke løsninger, ikke lister over tjenester. Ved å bygge en egen landingsside for hvert enkelt problem dere behandler, sørger vi for at Google matcher riktig pasient med riktig behandling. Det er slik vi vinner de lokale søkene.</CardDescription>
                </CardContent>
              </Card>

              <Card accent="left" variant="sand">
                <CardHeader>
                  <CardTitle as="h3" className="break-words hyphens-auto">Pasientens språk</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Folk søker sjelden etter metoden, de søker etter problemet de vil ha løst. De googler «hælsmerter», ikke nødvendigvis «trykkbølgebehandling». Sidene vi bygger heter det kunden søker på, og forklarer metoden deretter.</CardDescription>
                </CardContent>
              </Card>

              <Card accent="left" variant="sand">
                <CardHeader>
                  <CardTitle as="h3" className="break-words hyphens-auto">Rigget for maskiner</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Navn, adresse, åpningstider, priser og tjenester merkes i koden (Schema) slik at søkemotorer forstår det entydig. Skifter vi ut din gamle nettside, setter vi også opp trygge viderekoblinger slik at dere beholder eksisterende trafikk.</CardDescription>
                </CardContent>
              </Card>

              <Card accent="left" variant="sand">
                <CardHeader>
                  <CardTitle as="h3" className="break-words hyphens-auto">Mobil & måling</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Flertallet av lokale søk skjer på mobil. Plattformen bygges for den lille skjermen først. Før lansering setter vi opp analyseverktøy og presis sporing av telefonklikk, slik at vi fra dag én kan måle nøyaktig hva som fungerer.</CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </article>

      <article className="py-[clamp(3rem,6.5vw,5.4rem)] bg-brand-dark text-brand-light">
        <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8 grid grid-cols-1 md:grid-cols-[minmax(0,7rem)_minmax(0,1fr)] gap-[clamp(1.2rem,4vw,3.2rem)] items-start">
          <p className="text-micro uppercase text-brand-light/50 m-0 mt-2">
            Regnestykket
          </p>
          <div className="w-full">
            <h2 className="font-heading text-fluid-h2 mb-5 text-brand-light text-pretty">
              Er du usynlig organisk, må du kjøpe trafikken.
            </h2>
            <p className="text-fluid-p-lg text-brand-light/90 max-w-prose mb-16 text-pretty">
              Det er den skjulte kostnaden ved en dårlig nettside. Trafikken du skulle hatt gratis, må erstattes med annonser og den regningen kommer hver eneste måned, i all framtid.
            </p>

            <div className="max-w-4xl">
              {/* --- DATAGRAF --- */}
              <div className="flex h-48 sm:h-56 items-end gap-1.5 sm:gap-3 border-b border-brand-light/20 pb-1">
                {[0, 6, 12, 18, 24, 30, 36].map((m) => {
                  const ads = m * 7500;
                  const web = m === 0 ? 0 : 60000 + (m * 444.44);
                  const max = 270000;

                  return (
                    <div key={m} className="flex h-full flex-1 items-end justify-center gap-0.5 sm:gap-1">
                      <div
                        className="w-full max-w-[24px] bg-brand-light/30 rounded-t-sm"
                        style={{ height: `${Math.max((ads / max) * 100, 1)}%` }}
                        aria-hidden="true"
                      />
                      <div
                        className="w-full max-w-[24px] bg-brand-accent rounded-t-sm"
                        style={{ height: `${Math.max((web / max) * 100, 1)}%` }}
                        aria-hidden="true"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Akse for måneder */}
              <div className="mt-2 flex gap-1.5 sm:gap-3">
                {[0, 6, 12, 18, 24, 30, 36].map((m) => (
                  <span key={m} className="flex-1 text-center text-micro text-brand-light/50">
                    {m}
                  </span>
                ))}
              </div>

              {/* Forklaring (Legend) */}
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-brand-light/90">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-brand-light/30 rounded-sm"></span>
                  Annonser, kumulativt
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-brand-accent rounded-sm"></span>
                  Egen nettside, kumulativt
                </span>
                <span className="text-brand-light/40 ml-auto hidden sm:block">Måneder</span>
              </div>

              {/* --- TALL-GRID --- */}
              <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-px bg-brand-light/10 border border-brand-light/10 rounded-sm overflow-hidden">
                <div className="bg-brand-dark/90 p-5 sm:p-6 flex flex-col justify-center">
                  <span className="block font-heading text-fluid-h3 text-brand-accent mb-2 leading-none">
                    7 500 kr
                  </span>
                  <span className="block text-micro leading-[1.5] text-brand-light/90 text-pretty">
                    i måneden for 300 klikk til 25 kroner stykket
                  </span>
                </div>
                <div className="bg-brand-dark/90 p-5 sm:p-6 flex flex-col justify-center">
                  <span className="block font-heading text-fluid-h3 text-brand-accent mb-2 leading-none">
                    9 mnd
                  </span>
                  <span className="block text-micro leading-[1.5] text-brand-light/90 text-pretty">
                    før annonsene har kostet mer enn hele nettsiden
                  </span>
                </div>
                <div className="bg-brand-dark/90 p-5 sm:p-6 flex flex-col justify-center">
                  <span className="block font-heading text-fluid-h3 text-brand-accent mb-2 leading-none">
                    270 000
                  </span>
                  <span className="block text-micro leading-[1.5] text-brand-light/90 text-pretty">
                    kroner i annonser over tre år.
                  </span>
                </div>
              </div>

              <QuoteCard bg="light" className="mt-8 max-w-4xl">
                <p>
                  Annonser er leie. Organisk synlighet er å eie. Slutter du med annonser, forsvinner trafikken samme dag. En plassering du har opparbeidet blir stående.
                </p>
              </QuoteCard>

              <p className="mt-8 leading-[1.6] text-brand-light/50 max-w-prose text-pretty">
                Tallene over er et eksempel med forsiktige forutsetninger. Klikkprisen i konkurranseutsatte lokale søk ligger ofte høyere enn 25 kroner, og da kommer krysningspunktet tidligere.
              </p>

              <div className="mt-8 space-y-3">
                <p className="text-brand-light/90 m-0 text-pretty">
                  <strong className="text-brand-light font-semibold">Annonser: </strong>
                  Stopper du, forsvinner trafikken. Kostnaden stiger med konkurransen.
                </p>
                <p className="text-brand-light/90 m-0 text-pretty">
                  <strong className="text-brand-light font-semibold">Organisk: </strong>
                  Engangsinvestering. Plasseringen består, og vedlikehold koster en brøkdel.
                </p>
                <p className="text-brand-light/90 m-0 text-pretty">
                  <strong className="text-brand-light font-semibold">Sammen: </strong>
                  Best resultat. Men annonser bør supplere synlighet, ikke erstatte den.
                </p>
              </div>

            </div>
          </div>
        </div>
      </article>

      <article className="py-[clamp(3rem,6.5vw,5.4rem)] bg-brand-sand">
        <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8 grid grid-cols-1 md:grid-cols-[minmax(0,7rem)_minmax(0,1fr)] gap-[clamp(1.2rem,4vw,3.2rem)] items-start">
          <p className="text-micro uppercase text-brand-dark/50 m-0 mt-2">
            Et ærlig svar
          </p>
          <div className="w-full">
            <h2 className="font-heading text-fluid-h2 mb-5 text-brand-dark text-pretty">
              De fleste trenger ikke en ny nettside.
            </h2>
            <p className="text-fluid-p-lg text-brand-dark/90 max-w-prose mb-10 text-pretty">
              Det er verdt å si med én gang. Mange sider kan forbedres uten å bygges om, og det er både raskere og billigere. Vi anbefaler en ny side i tre situasjoner:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
              <Card accent="top">
                <CardHeader>
                  <CardEyebrow>Situasjon 1</CardEyebrow>
                  <CardTitle as="h3" className="break-words hyphens-auto">Siden er for treg</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Hastighet er en av faktorene Google måler direkte, og de aller fleste lokale søk skjer på telefon. Noen sider lar seg optimalisere. Andre er bygget på et fundament som ikke kan gjøres raskt.</CardDescription>
                </CardContent>
              </Card>

              <Card accent="top">
                <CardHeader>
                  <CardEyebrow>Situasjon 2</CardEyebrow>
                  <CardTitle as="h3" className="break-words hyphens-auto">Strukturen stopper arbeidet</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Det enkeltgrepet som gir mest er egne sider per tjeneste. Lar ikke siden deg legge til sider, eller krever hver endring en utvikler, blir arbeidet dyrere enn å begynne på nytt.</CardDescription>
                </CardContent>
              </Card>

              <Card accent="top">
                <CardHeader>
                  <CardEyebrow>Situasjon 3</CardEyebrow>
                  <CardTitle as="h3" className="break-words hyphens-auto">Ingen har tilgang</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Overraskende ofte er det ingen i bedriften som kan endre nettstedet. Byrået som laget det er borte, eller løsningen er låst. Da står alt arbeid stille, uansett hva analysen viser.</CardDescription>
                </CardContent>
              </Card>
            </div>

            <QuoteCard bg="light" className="mt-10 max-w-4xl">
              <p>
                <strong className="text-brand-dark font-semibold">Analysen sier hvilken av disse som gjelder deg,</strong> og om det i det hele tatt er nettsiden som er flaskehalsen. Den koster ingenting.
              </p>
            </QuoteCard>

          </div>
        </div>
      </article>

      <FAQSection faqs={webFaqs} />
      <CtaSection bg="sand" label="Kontakt oss" title="La oss ta en prat!" description="Hvis du nysgjerrig, usikker på hva dere eventuelt trenger hjelp med, eller ønsker en uforpliktende audit av dagens nettside. Ta kontakt så hjelper vi deg." buttonText="Se kontaktinfo" buttonHref="/kontakt" />

      <section className="pt-[clamp(2rem,4vw,3rem)] pb-4 bg-brand-sand">
        <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8">
          <p className="text-micro text-brand-dark/70 leading-[1.55] max-w-[58ch] m-0">* {PRICE_UPFRONT} kroner eks. mva. faktureres ved signering og refunderes ikke. Resterende beløp faktureres etter åtte uker, og størrelsen avhenger av oppnådd plassering i Googles lokalpakke, målt fra klinikkens egen adresse på søkeord avtalt skriftlig ved oppstart.</p>
        </div>
      </section>


    </>
  );
}