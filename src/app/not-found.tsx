import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-brand-dark text-brand-light px-4 sm:px-6 md:px-8 text-center">
      <p className="text-brand-accent font-bold tracking-widest uppercase mb-4">404</p>
      <h1 className="font-heading text-fluid-h1 mb-6 text-brand-light text-pretty">
        Siden ble ikke funnet
      </h1>
      <p className="text-fluid-p-lg text-brand-light/80 max-w-prose mb-10 text-pretty">
        Beklager, men siden du leter etter har enten blitt flyttet eller eksisterer ikke lenger.
      </p>
      <Link 
        href="/"
        className="inline-flex items-center justify-center bg-brand-accent text-brand-dark px-8 py-4 font-bold uppercase tracking-widest text-xs hover:bg-brand-accent/80 transition-colors rounded-sm focus-visible:outline-brand-accent focus-visible:outline-2 focus-visible:outline-offset-4"
      >
        Tilbake til forsiden
      </Link>
    </div>
  );
}
