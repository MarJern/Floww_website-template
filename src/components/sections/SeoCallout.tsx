export default function SeoCallout() {
  return (
    <section className="w-full bg-brand-dark py-24 md:py-32">
      <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-fluid-h2 tracking-tight leading-tight mb-8 text-balance text-brand-light">
            Analysen koster ingenting.
          </h2>
          <p className="text-fluid-p-lg max-w-prose text-brand-light/80 mx-auto text-pretty">
            Mange bedrifter har flotte nettsider som er usynlige for Google. Vi tilbyr dyptgående SEO-analyser og teknisk optimalisering av eksisterende nettsider, uavhengig av hvilken plattform den er bygget på.
          </p>
          <div className="mt-12 flex flex-wrap gap-4 inline-flex items-center justify-center">
            <a
              href="/kontakt"
              className="inline-flex items-center justify-center bg-brand-sand text-brand-dark px-8 py-4 font-bold uppercase tracking-widest text-xs hover:bg-brand-accent/80 transition-colors rounded-sm"
            >
              Få en uforpliktende SEO-analyse
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
