import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32 lg:py-40 px-6 md:px-12" aria-label="Introduction">
      {/* Background Image */}
      <Image
        src="/images/hero-bg.jpg"
        alt="Bakgrunnsbilde for Floww Media"
        fill
        className="object-cover object-center"
        priority={true}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/90 to-brand-dark/70" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-6xl lg:text-7xl tracking-tighter mb-8 text-balance text-brand-light">
            Nettsider som ser bra ut, og som faktisk blir funnet.
          </h1>
          <p className="text-lg md:text-xl max-w-2xl text-brand-light/80 text-pretty">
            Vi er en Oslo-basert duo som spesialiserer oss på skreddersydd webdesign og synlighet på nett. Vi bygger raske og sikre nettsider som hjelper lokale bedrifter med å tiltrekke og sikre nye kunder.
          </p>
          <div className="mt-12 flex flex-wrap gap-4">
            <a
              href="#kontakt"
              className="inline-flex items-center justify-center bg-brand-accent text-brand-light px-8 py-4 font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-opacity"
            >
              Dette gjør vi
            </a>
            <a
              href="#om-oss"
              className="inline-flex items-center justify-center bg-transparent border-2 border-brand-light text-brand-light px-8 py-4 font-bold uppercase tracking-widest text-xs hover:bg-brand-light/10 transition-colors"
            >
              Hvem er vi
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
