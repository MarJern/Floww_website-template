import type { Metadata } from "next";
import { Open_Sans, Manrope } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/ui/ScrollToTop";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const openSans = Open_Sans({ subsets: ["latin"], variable: "--font-open-sans", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://flowwmedia.no"),
  title: {
    template: "%s | Floww Media",
    default: "Floww Media | Eksklusivt byrå for organisk vekst",
  },
  description:
    "Eksklusivt byrå for organisk vekst. Vi kombinerer lokal SEO, AI-synlighet og lynraske nettsider målt på bunnlinjen, med kun én klient per bransje.",
  alternates: {
    canonical: "https://flowwmedia.no",
  },
  openGraph: {
    title: "Floww Media | Eksklusivt byrå for organisk vekst",
    description:
      "Eksklusivt byrå for organisk vekst. Vi kombinerer lokal SEO, AI-synlighet og lynraske nettsider målt på bunnlinjen, med kun én klient per bransje.",
    url: "https://flowwmedia.no",
    siteName: "Floww Media",
    locale: "nb_NO",
    type: "website",
    images: [
      {
        url: "/images/teamet.jpg",
        width: 1200,
        height: 630,
        alt: "Floww Media, eksklusivt byrå for organisk vekst",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Floww Media | Eksklusivt byrå for organisk vekst",
    description:
      "Eksklusivt byrå for organisk vekst. Lokal SEO, AI-synlighet og lynraske nettsider, med kun én klient per bransje.",
    images: ["/images/teamet.jpg"],
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
        name: "Floww Media",
        legalName: "Floww AS",
        url: "https://flowwmedia.no",
        logo: "https://flowwmedia.no/images/logo.svg",
        image: "https://flowwmedia.no/images/teamet.jpg",
        email: "kontakt@flowwmedia.no",
        telephone: "+4745843554",
        taxID: "NO922758476MVA",
        vatID: "NO922758476MVA",
        sameAs: [
          "https://virksomhet.brreg.no/nb/oppslag/enheter/922758476",
          "https://www.proff.no/selskap/floww-as/oslo/-/IF941980000",
        ],
        founder: [
          {
            "@type": "Person",
            name: "Simen Russ",
            jobTitle: "Senior SEO-spesialist & Partner",
            url: "https://flowwmedia.no/om-oss",
          },
          {
            "@type": "Person",
            name: "Marja Jernsletten",
            jobTitle: "Utvikler, Teknisk Arkitekt & Partner",
            url: "https://flowwmedia.no/om-oss",
          },
        ],
        address: {
          "@type": "PostalAddress",
          streetAddress: "Edvard Storms gate 2",
          addressLocality: "Oslo",
          postalCode: "0166",
          addressCountry: "NO",
        },
        location: {
          "@type": "Place",
          geo: {
            "@type": "GeoCoordinates",
            latitude: 59.9207,
            longitude: 10.7376,
          },
        },
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "08:00",
          closes: "17:00",
        },
        areaServed: {
          "@type": "Country",
          name: "Norway",
        },
      },
      {
        "@type": "WebSite",
        "@id": "https://flowwmedia.no/#website",
        url: "https://flowwmedia.no",
        name: "Floww Media",
        inLanguage: "nb-NO",
        publisher: {
          "@id": "https://flowwmedia.no/#organization",
        },
      },
    ],
  };

  return (
    <html lang="nb" className={`${openSans.variable} ${manrope.variable}`}>
      <body
        id="top"
        className="min-h-screen flex flex-col selection:bg-brand-accent selection:text-brand-light"
      >
        <Script
          id="schema-global"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGlobal) }}
        />

        <a
          href="#content"
          className="visually-hidden print:hidden fixed top-4 left-4 z-50 bg-brand-light text-brand-dark px-4 py-2 font-bold"
        >
          Hopp til hovedinnhold
        </a>

        <Navbar />

        <main
          id="content"
          tabIndex={-1}
          className="flex-1 w-full focus:outline-none"
        >
          {children}
        </main>

        <ScrollToTop />
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}