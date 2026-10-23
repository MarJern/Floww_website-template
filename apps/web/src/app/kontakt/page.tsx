import { Metadata } from "next";
import Script from "next/script";
import PageHeader from "@/components/sections/PageHeader";
import ContactSection from "@/components/sections/ContactSection";
import { SummaryList, SummaryItem } from "@/components/ui/SummaryList";

export const metadata: Metadata = {
  title: "Kontakt Oss",
  description:
    "Ta kontakt med Floww Media for en uforpliktende samtale om organisk vekst, lokal SEO, AI-synlighet og teknisk webutvikling.",
  alternates: {
    canonical: "https://flowwmedia.no/kontakt",
  },
  openGraph: {
    title: "Kontakt Oss | Floww Media",
    description:
      "Ta kontakt med Floww Media for en uforpliktende samtale om organisk vekst, lokal SEO, AI-synlighet og teknisk webutvikling.",
    type: "website",
    locale: "nb_NO",
    url: "https://flowwmedia.no/kontakt",
    siteName: "Floww Media",
    images: [
      {
        url: "/images/teamet.jpg",
        width: 1200,
        height: 630,
        alt: "Kontakt Floww Media",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kontakt Oss | Floww Media",
    description:
      "Ta kontakt med Floww Media for en uforpliktende samtale om organisk vekst.",
    images: ["/images/teamet.jpg"],
  },
};

export default function KontaktPage() {
  const jsonLdContact = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        name: "Kontakt Floww Media",
        description:
          "Ta kontakt med Floww Media for en samtale om organisk vekst, lokal SEO, AI-synlighet og teknisk webutvikling.",
        url: "https://flowwmedia.no/kontakt",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Hjem",
            item: "https://flowwmedia.no",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Kontakt",
            item: "https://flowwmedia.no/kontakt",
          },
        ],
      },
    ],
  };

  return (
    <>
      <Script
        id="schema-contact-page"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdContact) }}
      />

      <PageHeader
        breadcrumbs={[{ name: "Hjem", href: "/" }, { name: "Kontakt" }]}
        label="Kontakt Oss"
        title="Søk har flyttet seg. Har dere?"
        description="Ta kontakt for en uforpliktende samtale. Vi kartlegger hvor dere står i dag, og hvilke grep som gir størst utslag på bunnlinjen."
      />

      <section className="bg-brand-light" aria-label="Kontaktinformasjon">
        <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8">
          <SummaryList
            withBorders
            className="grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"
          >
            <SummaryItem label="E-post">
              <a
                href="mailto:kontakt@flowwmedia.no"
                className="text-fluid-p-lg underline decoration-brand-accent/40 text-brand-dark hover:text-brand-pine transition-colors font-heading font-medium whitespace-nowrap"
              >
                kontakt@flowwmedia.no
              </a>
            </SummaryItem>
            <SummaryItem label="Telefon">
              <a
                href="tel:+4745843554"
                className="text-fluid-p-lg underline decoration-brand-accent/40 text-brand-dark hover:text-brand-pine transition-colors font-heading font-medium whitespace-nowrap"
              >
                +47 458 43 554
              </a>
            </SummaryItem>
            <SummaryItem label="Adresse">
              <span className="text-fluid-p-lg text-brand-dark font-heading font-medium">
                Edvard Storms gate 2, Oslo
              </span>
            </SummaryItem>
          </SummaryList>
        </div>
      </section>

      <section className="pt-[clamp(2.5rem,5vw,4rem)] pb-8 bg-brand-light">
        <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8">
          <div className="max-w-4xl">
            <h2 className="font-heading text-fluid-h2 tracking-tight mb-4 text-brand-dark">
              Send oss en melding
            </h2>
            <p className="text-fluid-p-lg text-brand-dark/80 m-0 text-pretty">
              Bruk skjemaet nedenfor for å fortelle oss kort om bedriften og hva
              dere ønsker å oppnå, så tar vi kontakt så snart vi kan.
            </p>
          </div>
        </div>
      </section>

      <ContactSection />
    </>
  );
}
