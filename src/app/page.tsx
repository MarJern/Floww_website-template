import { Metadata } from "next";
import Script from "next/script";
import HeroSection from "@/components/sections/HeroSection";
import HubSection from "@/components/sections/HubSection";
import AiTeaserSection from "@/components/sections/AiTeaserSection";
import CtaSection from "@/components/sections/CtaSection";

export const metadata: Metadata = {
  title: "Floww Media | Skreddersydde Nettsider & Lokal Synlighet i Oslo",
  description: "Vi bygger lynraske plattformer og skalerer lokal synlighet for bedrifter. Skreddersydd webdesign, neste generasjons teknologi og AI-SEO som gir resultater.",
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["ProfessionalService", "LocalBusiness"],
    // ... (resten av ditt eksisterende Schema er identisk)
    "@id": "https://flowwmedia.no/#localbusiness",
    "name": "Floww Media",
    "description": "Lokal SEO og Google Business-profil for private klinikker",
    "url": "https://flowwmedia.no",
    "telephone": "+4745843554",
    "email": "kontakt@flowwmedia.no",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Edvard Storms gate 2",
      "addressLocality": "Oslo",
      "postalCode": "0166",
      "addressCountry": "NO"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 59.9207,
      "longitude": 10.7376
    },
    "areaServed": [
      { "@type": "City", "name": "Oslo" },
      { "@type": "Place", "name": "Frogner" },
      { "@type": "Place", "name": "Majorstuen" },
      { "@type": "Place", "name": "St. Hanshaugen" },
      { "@type": "Place", "name": "Grünerløkka" },
      { "@type": "Place", "name": "Sagene" },
      { "@type": "Place", "name": "Torshov" },
      { "@type": "Place", "name": "Ullern" },
      { "@type": "Place", "name": "Skøyen" },
      { "@type": "Place", "name": "Nordstrand" },
      { "@type": "Place", "name": "Røa" },
      { "@type": "Place", "name": "Bærum" },
      { "@type": "Place", "name": "Sandvika" },
      { "@type": "Place", "name": "Asker" },
      { "@type": "Place", "name": "Lillestrøm" },
      { "@type": "Place", "name": "Ski" }
    ]
  };

  return (
    <>
      <Script
        id="schema-local-business"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />
      <HubSection />
      <AiTeaserSection />
      <CtaSection
        bg="light"
        label="Neste steg"
        title="La oss ta en prat."
        description="Fyll ut skjemaet eller ring oss, så tar vi en uforpliktende gjennomgang av deres synlighet og potensial."
        buttonText="Gå til kontakt"
        buttonHref="/kontakt"
      />
    </>
  );
}