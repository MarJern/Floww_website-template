import { Metadata } from "next";
import Script from "next/script";
import Card, { CardHeader, CardTitle, CardEyebrow } from "@/components/ui/Card";
import PageHeader from "@/components/sections/PageHeader";
import ContactSection from "@/components/sections/ContactSection";

export const metadata: Metadata = {
  title: "Kontakt Oss | Floww Media",
  description: "Ta kontakt med Floww Media i Oslo for en uforpliktende prat om skreddersydde nettsider og lokal SEO.",
  alternates: {
    canonical: "/kontakt",
  },
};

export default function KontaktPage() {
  const jsonLdContact = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Kontakt Floww Media",
    "description": "Ta kontakt for en uforpliktende prat om SEO og lokal synlighet.",
    "url": "https://flowwmedia.no/kontakt"
  };
  return (
    <>
      <Script id="schema-contact-page" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdContact) }} />

      <PageHeader
        label="Kontakt Oss"
        title="Søk har flyttet seg. Har du?"
        description="Ta kontakt for en uforpliktende prat. Vi finner ut hvor du står, og flytter deg dit du bør være."
      />

      <section className="pt-[clamp(4rem,6vw,6rem)] bg-brand-light">
        <div className="mx-auto max-w-3xl w-full px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
            <Card accent="left" variant="sand" href="mailto:kontakt@flowwmedia.no" interactive>
              <CardHeader className="!mb-0">
                <CardEyebrow>Send en e-post</CardEyebrow>
                <CardTitle as="span" className="!text-fluid-p-lg underline decoration-brand-accent/40">
                  kontakt@flowwmedia.no
                </CardTitle>
              </CardHeader>
            </Card>

            <Card accent="left" variant="sand" href="tel:+4745843554" interactive className="flex flex-col justify-center">
              <CardHeader className="!mb-0">
                <CardEyebrow>Ring oss</CardEyebrow>
                <CardTitle as="span" className="!text-fluid-p-lg underline decoration-brand-accent/40">
                  +47 458 43 554
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          <div className="max-w-prose -mb-6 md:-mb-16 relative z-10">
            <h2 className="font-heading text-fluid-h2 tracking-tight mb-4 text-brand-dark">
              Eller send oss en melding
            </h2>
            <p className="text-fluid-p-lg text-brand-dark/80 m-0 text-pretty">
              Bruk skjemaet nedenfor for å fortelle oss litt om hva du trenger hjelp med, så tar vi kontakt med deg så snart vi kan.
            </p>
          </div>
        </div>
      </section>

      <ContactSection />
    </>
  );
}
