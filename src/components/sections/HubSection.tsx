import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardEyebrow, CardAction } from "@/components/ui/Card";

export default function HubSection() {
  return (
    <section className="py-[clamp(4rem,8vw,8rem)] bg-brand-sand" aria-label="Våre tjenester">
      <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8 grid grid-cols-1 md:grid-cols-[minmax(0,7rem)_minmax(0,1fr)] gap-[clamp(1.2rem,4vw,3.2rem)] items-start">

        {/* Dette forblir en <p>, for "Tjenester" har ikke SEO-verdi for dere */}
        <p className="text-micro uppercase text-brand-dark/50 m-0 mt-2 font-bold tracking-wider">
          Tjenester
        </p>

        <div className="w-full">
          {/* Endret fra h2 til h3 for å følge semantikken fra Hero */}
          <h3 className="font-heading text-fluid-h2 mb-10 text-brand-dark">
            Våre Kjerneområder
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <Card variant="light" href="/lokal-seo" interactive>
              <CardHeader>
                <CardEyebrow>Lokal SEO</CardEyebrow>
                {/* Endret til h4 */}
                <CardTitle as="h4">Lokal Synlighet i Oslo</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Vi tar klinikken din til topp 3 i Google-kartet, eller så betaler du ikke. Lokal SEO som faktisk gir deg nye kunder.
                </CardDescription>
              </CardContent>
              <CardFooter>
                <CardAction>Hvordan vi jobber</CardAction>
              </CardFooter>
            </Card>

            <Card variant="dark" href="/nettsider" interactive>
              <CardHeader>
                <CardEyebrow>Webdesign & Utvikling</CardEyebrow>
                {/* Endret til h4 */}
                <CardTitle as="h4">Skreddersydde Nettsider</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Lynraske, skreddersydde nettsider som er optimalisert for økt synlighet og lavest mulig annonsekostnader.
                </CardDescription>
              </CardContent>
              <CardFooter>
                <CardAction>Les mer</CardAction>
              </CardFooter>
            </Card>
          </div>
        </div>

      </div>
    </section>
  );
}