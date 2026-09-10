export default function SeoCallout() {
  return (
    <div className="bg-brand-dark text-brand-light py-24 md:py-32 px-6 md:px-12">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl tracking-tighter mb-8 text-balance">
          Har du allerede en nettside, men mangler trafikk?
        </h2>
        <p className="text-lg md:text-xl text-brand-light/80 text-pretty">
          Mange bedrifter har flotte nettsider som er usynlige for Google. Vi tilbyr dyptgående SEO-analyser og teknisk optimalisering av eksisterende nettsider, uavhengig av hvilken plattform den er bygget på.
        </p>
        <div className="mt-12 flex flex-wrap gap-4 inline-flex items-center justify-center">
          <a
            href="#kontakt"
            className="inline-flex items-center justify-center bg-brand-accent text-brand-light px-8 py-4 font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-opacity"
          >
            Få en uforpliktende SEO-analyse
          </a>
        </div>
      </div>
    </div>
  );
}
