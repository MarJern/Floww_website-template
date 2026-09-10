export default function WorkSection() {
  return (
    <section id="arbeid" aria-label="Verdiforslag og Prosess">
      
      {/* Block 1: Value Proposition */}
      <div className="bg-brand-dark text-brand-light py-24 md:py-32 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl tracking-tighter mb-8 text-balance">
            En stilig nettside er verdiløs hvis ingen finner den.
          </h2>
          <p className="text-lg md:text-xl text-brand-light/80 text-pretty">
            Det holder ikke lenger å bare &apos;være på nett&apos;. Konkurransen er knallhard. For at kundene skal velge deg, må du rangere høyt på Google når de søker etter dine tjenester. Dette krever lynrask innlasting, feilfri kode og riktig strukturert data – noe enkle mal-nettsider ofte feiler på. Det er akkurat derfor vi kombinerer skreddersydd webdesign med dyp SEO-ekspertise.
          </p>
        </div>
      </div>

      {/* Block 2: Our Process */}
      <div className="bg-brand-sand text-brand-dark py-24 md:py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl tracking-tighter mb-20 text-center">
            Vår prosess: Fra idé til nye kunder
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            
            <article>
              <div className="font-heading font-bold text-5xl md:text-6xl text-brand-accent mb-6">
                1
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-4">
                1. Strategi & Kartlegging
              </h3>
              <p className="text-lg text-brand-dark/80 text-pretty">
                Vi starter med et uforpliktende møte. Hvem er drømmekunden din? Hva må de vite før de kontakter deg? Vi bygger ingenting før vi forstår forretningen din og har en tydelig plan.
              </p>
            </article>

            <article>
              <div className="font-heading font-bold text-5xl md:text-6xl text-brand-accent mb-6">
                2
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-4">
                2. Design & Utvikling
              </h3>
              <p className="text-lg text-brand-dark/80 text-pretty">
                Når strategien er satt, designer og koder vi en lynrask, universelt utformet nettside. Vi bruker ikke trege systemer; vi bygger en skreddersydd plattform som bygger tillit og guider de besøkende mot å ta kontakt.
              </p>
            </article>

            <article>
              <div className="font-heading font-bold text-5xl md:text-6xl text-brand-accent mb-6">
                3
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-4">
                3. SEO & Lansering
              </h3>
              <p className="text-lg text-brand-dark/80 text-pretty">
                Vi optimaliserer alt innhold og kode for søkemotorene, kobler på analyseverktøy og lanserer. Siden din er teknisk klargjort for å klatre på Google og ta imot trafikk fra dag én.
              </p>
            </article>

          </div>
        </div>
      </div>

    </section>
  );
}
