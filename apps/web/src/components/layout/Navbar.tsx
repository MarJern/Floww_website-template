"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Button from "@/components/ui/Button";

const SERVICE_LINKS = [
  { href: "/seo", label: "SEO / Organisk søk" },
  { href: "/lokal-seo", label: "Lokal SEO" },
  { href: "/ai-seo", label: "AI-SEO / AI-søk" },
  { href: "/google-ads", label: "Google Ads" },
  { href: "/nettsider", label: "Nettsider" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isServiceActive = SERVICE_LINKS.some((s) => pathname === s.href);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <header
      data-web-chrome="true"
      className="sticky top-0 z-50 w-full bg-brand-dark border-b border-brand-light/10 print:hidden"
    >
      <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8 h-20 flex justify-between items-center">

        {/* Branding med Logo */}
        <Link
          href="/"
          onClick={() => setIsOpen(false)}
          className="shrink-0 hover:opacity-80 transition-opacity focus-visible:outline-brand-accent focus-visible:outline-2 focus-visible:outline-offset-4 rounded-sm relative z-50 flex items-center motion-reduce:transition-none"
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
        <nav aria-label="Primary navigation" className="hidden lg:flex lg:items-center lg:gap-7 xl:gap-8">
          <ul className="flex items-center gap-6 xl:gap-8 text-sm font-bold text-brand-light uppercase tracking-widest">

            {/* Tjenester Dropdown */}
            <li className="relative group whitespace-nowrap">
              <span
                className={`flex items-center gap-1.5 py-8 cursor-pointer whitespace-nowrap hover:text-brand-accent active:text-brand-accent transition-colors motion-reduce:transition-none focus-visible:outline-brand-accent focus-visible:outline-2 focus-visible:outline-offset-4 rounded-sm ${
                  isServiceActive ? "text-brand-accent" : "text-brand-light"
                }`}
                tabIndex={0}
              >
                Tjenester
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180 group-focus-within:rotate-180 group-hover:text-brand-accent group-focus-within:text-brand-accent ${
                    isServiceActive ? "text-brand-accent" : "text-brand-light/60"
                  }`}
                  fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </span>

              <div className="absolute top-[80%] left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 group-focus-within:translate-y-0">
                <ul className="min-w-56 bg-brand-dark border border-brand-light/10 shadow-xl rounded-sm p-2.5 flex flex-col gap-0.5">
                  {SERVICE_LINKS.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <li key={item.href} className="whitespace-nowrap">
                        <Link
                          href={item.href}
                          className={`block px-4 py-2.5 text-xs font-bold uppercase tracking-widest whitespace-nowrap hover:bg-brand-light/5 hover:text-brand-accent active:text-brand-accent transition-colors rounded-sm focus-visible:outline-brand-accent focus-visible:outline-2 ${
                            active ? "text-brand-accent bg-brand-light/5" : "text-brand-light"
                          }`}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </li>

            <li className="whitespace-nowrap">
              <Link
                href="/seo-analyse"
                className="block py-8 whitespace-nowrap text-brand-accent hover:text-brand-light active:text-brand-accent transition-colors motion-reduce:transition-none focus-visible:outline-brand-accent focus-visible:outline-2 focus-visible:outline-offset-4 rounded-sm"
              >
                SEO-analyse
              </Link>
            </li>
            <li className="whitespace-nowrap">
              <Link
                href="/om-oss"
                className={`block py-8 whitespace-nowrap hover:text-brand-accent active:text-brand-accent transition-colors motion-reduce:transition-none focus-visible:outline-brand-accent focus-visible:outline-2 focus-visible:outline-offset-4 rounded-sm ${
                  pathname === "/om-oss" ? "text-brand-accent" : "text-brand-light"
                }`}
              >
                Om oss
              </Link>
            </li>
            <li className="whitespace-nowrap">
              <Link
                href="/artikler"
                className={`block py-8 whitespace-nowrap hover:text-brand-accent active:text-brand-accent transition-colors motion-reduce:transition-none focus-visible:outline-brand-accent focus-visible:outline-2 focus-visible:outline-offset-4 rounded-sm ${
                  pathname?.startsWith("/artikler") ? "text-brand-accent" : "text-brand-light"
                }`}
              >
                Artikler
              </Link>
            </li>
          </ul>

          <Button href="/kontakt" className="uppercase tracking-widest text-xs whitespace-nowrap shrink-0">
            Kontakt
          </Button>
        </nav>

        {/* Mobile/Tablet Toggle */}
        <button
          className="lg:hidden flex items-center justify-center p-2 text-brand-light hover:text-brand-accent active:text-brand-accent focus-visible:outline-brand-accent focus-visible:outline-2 focus-visible:outline-offset-2 rounded-sm relative z-50 cursor-pointer transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Lukk meny" : "Åpne meny"}
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

      {/* Mobile/Tablet Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full max-h-[calc(100dvh-5rem)] overflow-y-auto bg-brand-dark flex flex-col items-center py-6 px-4 gap-5 border-b border-brand-light/10 shadow-2xl lg:hidden">
          <ul className="flex flex-col items-center gap-3 text-base font-bold text-brand-light uppercase tracking-widest w-full">

            {/* Mobil Tjenester Group */}
            <li className="flex flex-col items-center w-full pb-4 mb-1 border-b border-brand-light/10">
              <span className="text-brand-light/60 text-micro uppercase tracking-widest mb-2">
                TJENESTER
              </span>
              <div className="flex flex-col items-center gap-1 w-full">
                {SERVICE_LINKS.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`hover:text-brand-accent active:text-brand-accent transition-colors text-sm py-1.5 px-3 focus-visible:outline-brand-accent focus-visible:outline-2 rounded-sm ${
                        active ? "text-brand-accent" : "text-brand-light"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </li>

            <li>
              <Link
                href="/seo-analyse"
                onClick={() => setIsOpen(false)}
                className="text-brand-accent hover:text-brand-light active:text-brand-accent transition-colors py-1.5 px-3 focus-visible:outline-brand-accent focus-visible:outline-2 rounded-sm block"
              >
                SEO-analyse
              </Link>
            </li>
            <li>
              <Link
                href="/om-oss"
                onClick={() => setIsOpen(false)}
                className={`hover:text-brand-accent active:text-brand-accent transition-colors py-1.5 px-3 focus-visible:outline-brand-accent focus-visible:outline-2 rounded-sm block ${
                  pathname === "/om-oss" ? "text-brand-accent" : "text-brand-light"
                }`}
              >
                Om oss
              </Link>
            </li>
            <li>
              <Link
                href="/artikler"
                onClick={() => setIsOpen(false)}
                className={`hover:text-brand-accent active:text-brand-accent transition-colors py-1.5 px-3 focus-visible:outline-brand-accent focus-visible:outline-2 rounded-sm block ${
                  pathname?.startsWith("/artikler") ? "text-brand-accent" : "text-brand-light"
                }`}
              >
                Artikler
              </Link>
            </li>
          </ul>

          <Button
            href="/kontakt"
            onClick={() => setIsOpen(false)}
            className="uppercase tracking-widest text-xs whitespace-nowrap mt-1"
          >
            Kontakt
          </Button>
        </div>
      )}
    </header>
  );
}