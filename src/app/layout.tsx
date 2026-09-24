import type { Metadata } from "next";
import { Open_Sans, Manrope } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Definerer The Golden Standard-fontene
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap' });
const openSans = Open_Sans({ subsets: ['latin'], variable: '--font-open-sans', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://flowwmedia.no'),
  title: {
    template: "%s | Floww Media",
    default: "Floww Media | Lokal SEO og skreddersydde nettsider i Oslo",
  },
  description: "Vi bygger lynraske, skreddersydde nettsider og leverer lokal SEO med resultatgaranti for klinikker i Oslo og omegn. Topp 3 i Google-kartet, eller så betaler du ikke.",
  openGraph: {
    title: "Floww Media | Lokal SEO og skreddersydde nettsider",
    description: "Vi bygger lynraske, skreddersydde nettsider og leverer lokal SEO med resultatgaranti for klinikker i Oslo og omegn.",
    url: "https://flowwmedia.no",
    siteName: "Floww Media",
    locale: "nb_NO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Floww Media | Lokal SEO og skreddersydde nettsider",
    description: "Vi bygger lynraske, skreddersydde nettsider og leverer lokal SEO med resultatgaranti for klinikker i Oslo og omegn.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLdGlobal = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://flowwmedia.no/#organization",
        "name": "Floww Media",
        "legalName": "Floww AS",
        "url": "https://flowwmedia.no",
        "logo": "https://flowwmedia.no/images/logo.png",
        "email": "kontakt@flowwmedia.no",
        "telephone": "+4745843554",
        "taxID": "NO922758476MVA",
        "vatID": "NO922758476MVA",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Edvard Storms gate 2",
          "addressLocality": "Oslo",
          "postalCode": "0166",
          "addressCountry": "NO"
        },
        "location": {
          "@type": "Place",
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 59.9207,
            "longitude": 10.7376
          }
        },
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "08:00",
          "closes": "17:00"
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://flowwmedia.no/#website",
        "url": "https://flowwmedia.no",
        "name": "Floww Media",
        "publisher": {
          "@id": "https://flowwmedia.no/#organization"
        }
      }
    ]
  };

  return (
    <html
      lang="no"
      className={`${openSans.variable} ${manrope.variable}`}
    >
      <body id="top" className="min-h-screen flex flex-col selection:bg-brand-accent selection:text-brand-light">
        <Script id="schema-global" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGlobal) }} />

        {/* Tilgjengelighet for skjermlesere */}
        <a
          href="#content"
          className="visually-hidden fixed top-4 left-4 z-50 bg-brand-light text-brand-dark px-4 py-2 font-bold"
        >
          Hopp til hovedinnhold
        </a>

        {/* Topp-banner */}
        <div className="bg-brand-sand text-brand-sand py-3 text-micro">
          <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8 flex items-center justify-center gap-3 flex-wrap">
            <span className="text-brand-dark text-center font-medium">Tilgjengelig kapasitet til nye lokale kunder. Oppstart umiddelbart.</span>
          </div>
        </div>

        <Navbar />

        {/* Hovedinnhold */}
        <main id="content" tabIndex={-1} className="flex-1 w-full focus:outline-none">
          {children}
        </main>

        <Footer />
        <Analytics />
      </body>
    </html>
  );
}