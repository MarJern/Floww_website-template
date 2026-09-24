import Image from "next/image";
import Button from "@/components/ui/Button";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden w-full py-24 md:py-32 lg:py-40" aria-label="Introduction">

      <Image
        src="/images/hero-bg.jpg"
        alt="Bakgrunnsbilde for Floww Media"
        fill
        className="object-cover object-center"
        priority={true}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/90 to-brand-dark/70" />

      <div className="relative z-10 mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8">
        <div className="max-w-4xl">

          <h1 className="text-micro uppercase text-brand-accent m-0 mb-3 tracking-wider font-bold">
            Hjelp til søkemotoroptimalisering
          </h1>

          <h2 className="font-heading text-fluid-h1 mb-8 text-balance text-brand-light">
            Lokal synlighet for private klinikker i Oslo og omegn
          </h2>

          <p className="text-fluid-p-lg max-w-prose text-brand-light/80 text-pretty">
            Floww Media er et Oslo-basert SEO-byrå. Vårt mest solgte produkt er rettet mot lokale klinikker som ønsker å rangere topp 3 i Google-kartet.
          </p>
          <div className="mt-12 flex flex-wrap gap-4">
            <Button href="/lokal-seo" className="uppercase tracking-widest text-xs">
              Se prosessen
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}