import { Metadata } from "next";
import Script from "next/script";
import HeroSection from "@/components/sections/HeroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import SeoCallout from "@/components/sections/SeoCallout";
import WorkSection from "@/components/sections/WorkSection";
import AboutSection from "@/components/sections/AboutSection";
import FAQSection from "@/components/sections/FAQSection";
import ContactSection from "@/components/sections/ContactSection";

export const metadata: Metadata = {
  title: "Hjem",
  description: "Skreddersydd webdesign og SEO-tjenester i Oslo. Vi bygger raske, sikre nettsider som hjelper lokale bedrifter med å rangere høyere på Google og sikre nye kunder.",
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Floww Media",
    description: "Skreddersydd webdesign og SEO-tjenester i Oslo.",
    url: "https://flowwmedia.no",
    email: "kontakt@flowwmedia.no",
    telephone: "+4745843554",
    taxID: "922758476",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Edvard Storms gate 2",
      postalCode: "0166",
      addressLocality: "Oslo",
      addressCountry: "NO",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 59.9139,
      longitude: 10.7522,
    },
    founder: [
      {
        "@type": "Person",
        name: "Marja Jernsletten"
      },
      {
        "@type": "Person",
        name: "Simen Russ"
      }
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
      <ServicesSection />
      <WorkSection />
      <SeoCallout />
      <AboutSection />
      <FAQSection />
      <ContactSection />
    </>
  );
}
