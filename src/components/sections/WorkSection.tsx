export default function WorkSection() {
  return (
    <section id="arbeid" aria-label="Prosess" className="w-full">
      {/* Block 2: Our Process */}
      <div className="w-full bg-brand-sand text-brand-dark py-24 md:py-32">
        <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8">
          <h2 className="text-fluid-h2 tracking-tight leading-tight mb-20 text-center">
            Vår prosess: Fra idé til nye kunder
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">

            <article>
              <div className="font-heading font-bold text-fluid-h1 text-brand-pine mb-6 leading-none">
                1
              </div>
              <h3 className="text-fluid-p-lg mb-4">
                1. Strategi & Kartlegging
              </h3>
              <p className="text-fluid-p-lg text-brand-dark/80 text-pretty max-w-prose">
                Vi starter med et uforpliktende møte. Hvem er drømmekunden din? Hva må de vite før de kontakter deg? Vi bygger ingenting før vi forstår forretningen din og har en tydelig plan.
              </p>
            </article>

            <article>
              <div className="font-heading font-bold text-fluid-h1 text-brand-pine mb-6 leading-none">
                2
              </div>
              <h3 className="text-fluid-p-lg mb-4">
                2. Design & Utvikling
              </h3>
              <p className="text-fluid-p-lg text-brand-dark/80 text-pretty max-w-prose">
                Når strategien er satt, designer og koder vi en lynrask, universelt utformet nettside. Vi bruker ikke trege systemer; vi bygger en skreddersydd plattform som bygger tillit og guider de besøkende mot å ta kontakt.
              </p>
            </article>

            <article>
              <div className="font-heading font-bold text-fluid-h1 text-brand-pine mb-6 leading-none">
                3
              </div>
              <h3 className="text-fluid-p-lg mb-4">
                3. SEO & Lansering
              </h3>
              <p className="text-fluid-p-lg text-brand-dark/80 text-pretty max-w-prose">
                Vi optimaliserer alt innhold og kode for søkemotorene, kobler på analyseverktøy og lanserer. Siden din er teknisk klargjort for å klatre på Google og ta imot trafikk fra dag én.
              </p>
            </article>

          </div>
        </div>
      </div>

    </section>
  );
}
