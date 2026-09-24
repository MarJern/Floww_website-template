import Link from 'next/link';
import Image from 'next/image'; // <-- 1. Importer Image

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-dark text-brand-light px-6 md:px-12 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">

          {/* Column 1: Brand med Logo */}
          <div className="flex flex-col gap-4 items-start">
            <Link href="/" className="inline-block hover:opacity-80 transition-opacity focus-visible:outline-brand-accent focus-visible:outline-2 focus-visible:outline-offset-4 rounded-sm">
              <span className="sr-only">Floww Media</span>

              <Image
                src="/images/logo.svg"
                alt="Floww Media Logo"
                width={150}
                height={40}
                className="w-auto h-8 object-contain"
              />
            </Link>
            <p className="text-brand-light/80 text-pretty mt-2">
              Søk har flyttet seg. Har du? Vi finner ut hvor du står, og flytter deg dit du bør være.
            </p>
          </div>

          {/* Column 2: Contact Info (SEO Critical) */}
          <div className="flex flex-col gap-4">
            <strong className="font-bold uppercase tracking-widest text-sm text-brand-light/50">
              Kontakt
            </strong>
            <address className="not-italic flex flex-col gap-2 text-brand-light/90">
              <a href="mailto:kontakt@flowwmedia.no" className="hover:text-brand-accent transition-colors">
                kontakt@flowwmedia.no
              </a>
              <a href="tel:+4745843554" className="hover:text-brand-accent transition-colors">
                +47 458 43 554
              </a>
              <p className="mt-2 text-brand-light/70">
                Edvard Storms gate 2, 0166 Oslo
              </p>
            </address>
          </div>

          {/* Column 3: Legal */}
          <div className="flex flex-col gap-4">
            <strong className="font-bold uppercase tracking-widest text-sm text-brand-light/50">
              Selskap
            </strong>
            <p className="text-brand-light/80">
              Floww AS
              <br />
              Org.nr: 922 758 476
            </p>
          </div>

        </div>

        {/* Bottom Line */}
        <div className="pt-8 border-t border-brand-accent flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-sm text-brand-light/60">
          <p>© {currentYear} Floww Media.</p>
          <div className="flex gap-6">
            <Link href="/personvern" className="hover:text-brand-accent transition-colors">
              Personvern
            </Link>
            <Link href="/vilkar" className="hover:text-brand-accent transition-colors">
              Vilkår
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
