export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-dark text-brand-light px-6 md:px-12 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          
          {/* Column 1: Brand */}
          <div className="flex flex-col gap-4">
            <span className="font-heading font-bold text-2xl tracking-tight uppercase">
              Floww Media
            </span>
            <p className="text-brand-light/80 text-pretty">
              Skreddersydd webdesign og synlighet for bedrifter.
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
                458 43 554
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
        <div className="pt-8 border-t border-brand-olive flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-sm text-brand-light/60">
          <p>© {currentYear} Floww Media. Med enerett.</p>
        </div>
      </div>
    </footer>
  );
}
