import Image from "next/image";

export default function AboutSection() {
  return (
    <section id="om-oss" className="py-24 md:py-32 bg-brand-sand px-6 md:px-12" aria-labelledby="om-oss-heading">
      <div className="max-w-7xl mx-auto">
        <h2 id="om-oss-heading" className="text-3xl md:text-4xl lg:text-5xl tracking-tighter mb-16 text-center text-brand-dark">
          Hvem er vi?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* Marja Profile */}
          <article className="flex flex-col">
            <figure className="relative aspect-square w-full max-w-[320px] mx-auto rounded-full border-4 border-brand-light overflow-hidden mb-8">
              <Image
                src="/images/Marja.jpg"
                alt="Portrett av Marja"
                fill
                sizes="(max-width: 768px) 100vw, 320px"
                className="object-cover object-[center_20%]"
              />
            </figure>
            <h3 className="font-heading text-2xl md:text-3xl font-bold text-brand-dark mb-4 text-center md:text-left">
              Marja Jernsletten
            </h3>
            <p className="text-lg text-brand-dark/80 text-pretty mb-6 text-center md:text-left">
              Med bakgrunn som byråleder og tidligere Country Manager, forstår Marja at en nettside er en forretningsinvestering, ikke bare et digitalt visittkort. Hun kombinerer dyp teknisk ekspertise i moderne frontend-utvikling med en strategisk forståelse for brukeropplevelse, slik at løsningene både ser fantastiske ut og konverterer.
            </p>
            <div className="flex flex-wrap gap-6 justify-center md:justify-start mt-auto">
              <a href="https://www.linkedin.com/in/marjaj/" target="_blank" rel="noopener noreferrer" className="font-sans font-medium text-brand-dark hover:text-brand-accent transition-colors">
                LinkedIn
              </a>
              <a href="tel:93023612" className="font-sans font-medium text-brand-dark hover:text-brand-accent transition-colors">
                930 23 612
              </a>
            </div>
          </article>

          {/* Simen Profile */}
          <article className="flex flex-col">
            <figure className="relative aspect-square w-full max-w-[320px] mx-auto rounded-full border-4 border-brand-light overflow-hidden mb-8">
              <Image
                src="/images/Simen.jpg"
                alt="Portrett av Simen"
                fill
                sizes="(max-width: 768px) 100vw, 320px"
                className="object-cover object-[center_15%]"
              />
            </figure>
            <h3 className="font-heading text-2xl md:text-3xl font-bold text-brand-dark mb-4 text-center md:text-left">
              Simen Russ
            </h3>
            <p className="text-lg text-brand-dark/80 text-pretty mb-6 text-center md:text-left">
              Simen er eksperten som sørger for at den tekniske plattformen faktisk blir sett. Med et sylskarpt fokus på SEO og digital synlighet, bygger han strategiene som løfter bedriften din i søkeresultatene og dirigerer relevant, kjøpeklar trafikk rett til nettsiden din.
            </p>
            <div className="flex flex-wrap gap-6 justify-center md:justify-start mt-auto">
              <a href="https://www.linkedin.com/in/simenr/" target="_blank" rel="noopener noreferrer" className="font-sans font-medium text-brand-dark hover:text-brand-accent transition-colors">
                LinkedIn
              </a>
              <a href="tel:45843554" className="font-sans font-medium text-brand-dark hover:text-brand-accent transition-colors">
                458 43 554
              </a>
            </div>
          </article>

        </div>
      </div>
    </section>
  );
}
