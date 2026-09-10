export default function ServicesSection() {
  return (
    <section id="tjenester" className="py-24 md:py-32 bg-brand-sand border-b border-brand-dark/10 px-6 md:px-12" aria-labelledby="tjenester-heading">
      <div className="max-w-7xl mx-auto">
        <h2 id="tjenester-heading" className="text-3xl md:text-4xl lg:text-5xl tracking-tighter mb-16 max-w-3xl text-balance text-brand-dark">
          Alt du trenger for å vokse på nett, ingenting du ikke trenger.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          
          <article>
            <h3 className="text-xl md:text-2xl font-bold mb-6 text-brand-dark">Skreddersydd Webdesign</h3>
            <p className="text-lg text-brand-dark/80 text-pretty">
              Raskt, sikkert og bygget for å konvertere. Vi bruker ikke trege maler; vi bygger skreddersydde digitale opplevelser som bygger tillit og får bedriften din til å skille seg ut.
            </p>
          </article>

          <article>
            <h3 className="text-xl md:text-2xl font-bold mb-6 text-brand-dark">Synlighet & SEO</h3>
            <p className="text-lg text-brand-dark/80 text-pretty">
              En stilig nettside er verdiløs hvis ingen ser den. Enten vi bygger plattformen din fra bunnen av, eller optimaliserer nettsiden du allerede har, sørger vi for at du klatrer på Google. Vi fikser teknisk SEO, hastighet og innhold, slik at du treffer kunder akkurat når de leter etter deg.
            </p>
          </article>

        </div>
      </div>
    </section>
  );
}
