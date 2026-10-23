import type { Metadata } from "next";
import Script from "next/script";
import Card, {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardEyebrow,
  CardFooter,
} from "@/components/ui/Card";
import CtaSection from "@/components/sections/CtaSection";
import EditorialSection from "@/components/sections/EditorialSection";
import PageHeader from "@/components/sections/PageHeader";
import { getAllArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Artikler og Innsikt",
  description:
    "Fagartikler om lokal SEO, Google-kartet, AI-søk og teknisk nettsidearkitektur, skrevet av Simen Russ i Floww Media.",
  alternates: {
    canonical: "https://flowwmedia.no/artikler",
  },
  openGraph: {
    title: "Artikler og Innsikt | Floww Media",
    description:
      "Fagartikler om lokal SEO, Google-kartet, AI-søk og teknisk nettsidearkitektur, skrevet av Simen Russ i Floww Media.",
    type: "website",
    locale: "nb_NO",
    url: "https://flowwmedia.no/artikler",
    siteName: "Floww Media",
    images: [
      {
        url: "/images/teamet.jpg",
        width: 1200,
        height: 630,
        alt: "Artikler og Innsikt fra Floww Media",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Artikler og Innsikt | Floww Media",
    description:
      "Fagartikler om lokal SEO, Google-kartet, AI-søk og teknisk nettsidearkitektur.",
    images: ["/images/teamet.jpg"],
  },
};

export default function ArtiklerIndexPage() {
  const articles = getAllArticles();

  const jsonLdCollection = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "Innsikt og artikler om organisk synlighet og SEO",
        description:
          "Fagartikler om lokal SEO, AI-søk, teknisk webutvikling og konvertering. Ingen hemmeligheter, kun dokumenterte metoder som virker.",
        url: "https://flowwmedia.no/artikler",
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
            name: "Artikler",
            item: "https://flowwmedia.no/artikler",
          },
        ],
      },
    ],
  };

  return (
    <>
      <Script
        id="schema-collection-artikler"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdCollection) }}
      />

      <PageHeader
        breadcrumbs={[{ name: "Hjem", href: "/" }, { name: "Artikler" }]}
        label="Innsikt"
        title="Innsikt og fagartikler"
        description="Vi deler løpende kunnskap om lokal synlighet i Google-kartet, AI-søk og teknisk nettsidearkitektur. Ingen bransjefloskler, bare det som faktisk flytter plasseringer og gir merverdi."
      />

      <EditorialSection
        as="section"
        bg="sand"
        className="min-h-[50vh]"
        label="Fagbibliotek"
        title="Grunnlaget for organisk vekst"
        titleClassName="mb-3"
        paragraphs={[
          "Start her hvis dere vil forstå hvilke faktorer som avgjør plasseringen i Google og AI-søk, og hvilke grep dere kan gjøre selv.",
        ]}
      >
        <div className="mt-8">
          {articles.length === 0 ? (
            <p className="text-fluid-h4 text-brand-dark/90">
              Ingen artikler publisert ennå. Sjekk tilbake senere!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.map((article) => (
                <Card
                  key={article.slug}
                  href={`/artikler/${article.slug}`}
                  interactive
                  accent="left"
                  variant="light"
                >
                  <CardHeader>
                    <CardEyebrow>{article.category}</CardEyebrow>
                    <CardTitle as="h3">{article.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{article.description}</CardDescription>
                  </CardContent>
                  <CardFooter>
                    <CardEyebrow>
                      Av {article.author} · {article.readTime}
                    </CardEyebrow>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </EditorialSection>

      <CtaSection bg="light" />
    </>
  );
}