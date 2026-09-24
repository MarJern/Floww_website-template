"use client";

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image"; // <-- 1. Importer Image fra next/image
import Button from "@/components/ui/Button";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-brand-dark border-b border-brand-light/10">
      <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8 h-20 flex justify-between items-center">

        {/* Branding med Logo */}
        <Link
          href="/"
          onClick={() => setIsOpen(false)}
          className="hover:opacity-80 transition-opacity focus-visible:outline-brand-accent focus-visible:outline-2 focus-visible:outline-offset-4 rounded-sm relative z-50 flex items-center motion-reduce:transition-none"
          aria-label="Forside"
        >
          <span className="sr-only">Floww Media</span>

          <Image
            src="/images/logo.svg"
            priority alt="Floww Media Logo"
            width={400}
            height={100}
            
            
            className="w-auto h-8 md:h-10 object-contain"
            />
        </Link>

        {/* Desktop Navigation & CTA */}
        <nav aria-label="Primary navigation" className="hidden md:flex md:items-center md:gap-6 lg:gap-10">
          <ul className="flex items-center gap-6 lg:gap-10 text-sm font-bold text-brand-light uppercase tracking-widest">

            {/* The Golden Standard Dropdown */}
            <li className="relative group">
              <span
                className="flex items-center gap-1.5 py-8 cursor-pointer hover:text-brand-sand transition-colors motion-reduce:transition-none focus-visible:outline-brand-accent focus-visible:outline-2 focus-visible:outline-offset-4 rounded-sm"
                tabIndex={0}
              >
                Synlighet
                <svg
                  className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180 text-brand-light/60 group-hover:text-brand-sand"
                  fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </span>

              <div className="absolute top-[80%] left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                <ul className="w-48 bg-brand-dark border border-brand-light/10 shadow-xl rounded-sm p-2 flex flex-col">
                  <li>
                    <Link
                      href="/lokal-seo"
                      className="block px-4 py-3 text-xs font-bold uppercase tracking-widest text-brand-light hover:bg-brand-light/5 hover:text-brand-accent transition-colors rounded-sm focus-visible:outline-brand-accent focus-visible:outline-2"
                    >
                      Lokal SEO
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/ai-seo"
                      className="block px-4 py-3 text-xs font-bold uppercase tracking-widest text-brand-light hover:bg-brand-light/5 hover:text-brand-accent transition-colors rounded-sm focus-visible:outline-brand-accent focus-visible:outline-2"
                    >
                      AI-SEO / AI-søk
                    </Link>
                  </li>
                </ul>
              </div>
            </li>

            <li>
              <Link href="/nettsider" className="block py-8 hover:text-brand-sand transition-colors motion-reduce:transition-none focus-visible:outline-brand-accent focus-visible:outline-2 focus-visible:outline-offset-4 rounded-sm">
                Nettside
              </Link>
            </li>
            <li>
              <Link href="/om-oss" className="block py-8 hover:text-brand-sand transition-colors motion-reduce:transition-none focus-visible:outline-brand-accent focus-visible:outline-2 focus-visible:outline-offset-4 rounded-sm">
                Om Oss
              </Link>
            </li>
            <li>
              <Link href="/artikler" className="block py-8 hover:text-brand-sand transition-colors motion-reduce:transition-none focus-visible:outline-brand-accent focus-visible:outline-2 focus-visible:outline-offset-4 rounded-sm">
                Artikler
              </Link>
            </li>
          </ul>

          <Button href="/kontakt" className="uppercase tracking-widest text-xs">
            Kontakt
          </Button>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden flex items-center justify-center p-2 text-brand-light focus-visible:outline-brand-accent focus-visible:outline-2 focus-visible:outline-offset-2 rounded-sm relative z-50"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Åpne meny"
        >
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-brand-dark flex flex-col items-center py-8 gap-6 border-b border-brand-light/10 shadow-2xl md:hidden">
          <ul className="flex flex-col items-center gap-6 text-base font-bold text-brand-light uppercase tracking-widest w-full">

            {/* Mobil Synlighet Group */}
            <li className="flex flex-col items-center w-full pb-4 border-b border-brand-light/5">
              <span className="text-brand-light/40 text-micro tracking-widest mb-3">Synlighet</span>
              <div className="flex flex-col items-center gap-4">
                <Link
                  href="/lokal-seo"
                  onClick={() => setIsOpen(false)}
                  className="hover:text-brand-accent transition-colors text-sm p-2 focus-visible:outline-brand-accent focus-visible:outline-2 rounded-sm"
                >
                  Lokal SEO
                </Link>
                <Link
                  href="/ai-seo"
                  onClick={() => setIsOpen(false)}
                  className="hover:text-brand-accent transition-colors text-sm p-2 focus-visible:outline-brand-accent focus-visible:outline-2 rounded-sm"
                >
                  AI-SEO / AI-søk
                </Link>
              </div>
            </li>

            <li>
              <Link href="/nettsider" onClick={() => setIsOpen(false)} className="hover:text-brand-sand transition-colors p-2 focus-visible:outline-brand-accent focus-visible:outline-2 rounded-sm">
                Nettsider
              </Link>
            </li>
            <li>
              <Link href="/om-oss" onClick={() => setIsOpen(false)} className="hover:text-brand-sand transition-colors p-2 focus-visible:outline-brand-accent focus-visible:outline-2 rounded-sm">
                Om oss
              </Link>
            </li>
            <li>
              <Link href="/artikler" onClick={() => setIsOpen(false)} className="hover:text-brand-sand transition-colors p-2 focus-visible:outline-brand-accent focus-visible:outline-2 rounded-sm">
                Artikler
              </Link>
            </li>
          </ul>

          <Link
            href="/kontakt"
            onClick={() => setIsOpen(false)}
            className="inline-flex items-center justify-center bg-brand-accent text-brand-light px-8 py-4 font-bold uppercase tracking-widest text-xs hover:bg-brand-accent/80 transition-colors mt-2 rounded-sm focus-visible:outline-brand-accent focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            Gratis audit
          </Link>
        </div>
      )}
    </header>
  );
}