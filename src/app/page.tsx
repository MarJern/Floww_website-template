import { Metadata } from "next";
import HeroSection from "@/components/sections/HeroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import SeoCallout from "@/components/sections/SeoCallout";
import WorkSection from "@/components/sections/WorkSection";
import AboutSection from "@/components/sections/AboutSection";
import ContactSection from "@/components/sections/ContactSection";
import { generateProfessionalServiceSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Home",
  description: "Custom web design and SEO services in Oslo. We build fast, secure websites that help local companies rank higher on Google, increase their visibility, and secure new customers.",
};

export default function Home() {
  const jsonLd = generateProfessionalServiceSchema({
    name: "Floww Media",
    description: "Custom web design and SEO services in Oslo. We build fast, secure websites that help local companies rank higher on Google, increase their visibility, and secure new customers.",
    url: "https://flowwmedia.example.com",
    priceRange: "$$$",
    email: "kontakt@flowwmedia.no",
    telephone: "+4745843554",
    taxID: "922758476",
    address: {
      streetAddress: "Edvard Storms gate 2",
      postalCode: "0166",
      addressLocality: "Oslo",
      addressCountry: "NO",
    },
    geo: {
      latitude: 59.9139,
      longitude: 10.7522,
    }
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />
      <ServicesSection />
      <WorkSection />
      <SeoCallout />
      <AboutSection />
      <ContactSection />
    </>
  );
}
