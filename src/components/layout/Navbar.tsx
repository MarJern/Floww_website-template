"use client";

import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-brand-dark/90 backdrop-blur-md border-b border-brand-light/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex justify-between items-center w-full">
        {/* Branding */}
        <a
          href="#top"
          onClick={() => setIsOpen(false)}
          className="font-heading uppercase text-xl md:text-2xl hover:opacity-80 transition-opacity focus-visible:outline-brand-accent focus-visible:outline-2 focus-visible:outline-offset-4 rounded-sm relative z-50 flex gap-1.5"
          aria-label="Back to top"
        >
          <span className="font-black tracking-tight text-brand-light">Floww</span>
          <span className="font-light text-brand-light/80">Media</span>
        </a>

        {/* Desktop Navigation & CTA */}
        <nav aria-label="Primary navigation" className="hidden md:flex md:items-center md:gap-6 lg:gap-10">
          <ul className="flex items-center gap-6 lg:gap-10 text-sm font-bold text-brand-light uppercase tracking-widest">
            <li>
              <a href="#tjenester" className="hover:text-brand-sand transition-colors focus-visible:outline-brand-accent focus-visible:outline-2 focus-visible:outline-offset-4 rounded-sm">
                Tjenester
              </a>
            </li>
            <li>
              <a href="#arbeid" className="hover:text-brand-sand transition-colors focus-visible:outline-brand-accent focus-visible:outline-2 focus-visible:outline-offset-4 rounded-sm">
                Arbeid
              </a>
            </li>
            <li>
              <a href="#om-oss" className="hover:text-brand-sand transition-colors focus-visible:outline-brand-accent focus-visible:outline-2 focus-visible:outline-offset-4 rounded-sm">
                Om Oss
              </a>
            </li>
          </ul>

          <a
            href="#kontakt"
            className="inline-flex items-center justify-center bg-brand-accent text-brand-light px-6 py-3 font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-opacity focus-visible:outline-brand-accent focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            Kontakt
          </a>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden flex items-center justify-center p-2 text-brand-light focus-visible:outline-brand-accent focus-visible:outline-2 focus-visible:outline-offset-2 rounded-sm relative z-50"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Toggle navigation menu"
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
        <div className="absolute top-full left-0 w-full bg-brand-dark/95 backdrop-blur-md flex flex-col items-center py-8 gap-6 border-b border-brand-light/10 shadow-2xl md:hidden">
          <ul className="flex flex-col items-center gap-6 text-base font-bold text-brand-light uppercase tracking-widest">
            <li>
              <a
                href="#tjenester"
                onClick={() => setIsOpen(false)}
                className="hover:text-brand-sand transition-colors p-2"
              >
                Tjenester
              </a>
            </li>
            <li>
              <a
                href="#arbeid"
                onClick={() => setIsOpen(false)}
                className="hover:text-brand-sand transition-colors p-2"
              >
                Arbeid
              </a>
            </li>
            <li>
              <a
                href="#kontakt"
                onClick={() => setIsOpen(false)}
                className="hover:text-brand-sand transition-colors p-2"
              >
                Kontakt
              </a>
            </li>
          </ul>

          <a
            href="#kontakt"
            onClick={() => setIsOpen(false)}
            className="inline-flex items-center justify-center bg-brand-accent text-brand-light px-8 py-4 font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-opacity mt-4"
          >
            Start et prosjekt
          </a>
        </div>
      )}
    </header>
  );
}
