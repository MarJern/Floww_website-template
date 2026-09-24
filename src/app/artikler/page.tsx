import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Script from "next/script";
import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardEyebrow, CardFooter } from "@/components/ui/Card";
import CtaSection from "@/components/sections/CtaSection";
import PageHeader from "@/components/sections/PageHeader";

export const metadata = {
    title: "Artikler og Innsikt | Floww Media",
    description: "Lær mer om lokal SEO, AI-SEO og nettsideoptimalisering. Her deler vi teknikker og strategier som faktisk virker.",
    alternates: {
        canonical: "https://flowwmedia.no/artikler",
    },
};

export default function ArtiklerIndexPage() {
    const contentDir = path.join(process.cwd(), "src/content/artikler");

    let articles: any[] = [];

    if (fs.existsSync(contentDir)) {
        const files = fs.readdirSync(contentDir);

        articles = files
            .filter((file) => file.endsWith(".mdx"))
            .map((file) => {
                const filePath = path.join(contentDir, file);
                const fileContent = fs.readFileSync(filePath, "utf8");
                const { data } = matter(fileContent);

                return {
                    slug: file.replace(".mdx", ""),
                    title: data.title || "Uten tittel",
                    description: data.description || "",
                    category: data.category || "Fagartikkel",
                    date: data.date || "",
                    readTime: data.readTime || "5 min lesetid",
                };
            })
            // Sorter artiklene etter dato (nyeste først)
            .sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()));
    }

    const jsonLdCollection = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Innsikt og artikler om SEO",
        "description": "Vi deler alt vi vet om SEO, ytelse og konvertering. Ingen hemmeligheter, bare teknikk og strategi som virker.",
        "url": "https://flowwmedia.no/artikler"
    };

    return (
        <>
            <Script id="schema-collection-artikler" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdCollection) }} />

            <PageHeader
                label="Innsikt"
                title="Innsikt og artikler"
                description="Vi deler løpende verdifull innsikt om lokal SEO, AI-SEO og nettsideoptimalisering. Følg med her for bransjenyheter og annen oppdatert informasjon."
            />

            <main className="py-[clamp(3rem,6.5vw,5.4rem)] bg-brand-sand min-h-[50vh]">
                <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8 grid grid-cols-1 md:grid-cols-[minmax(0,7rem)_minmax(0,1fr)] gap-[clamp(1.2rem,4vw,3.2rem)] items-start">

                    {/* Venstre kolonne (Etikett) */}
                    <p className="text-micro uppercase text-brand-dark/50 m-0 mt-2">
                        Kom i gang
                    </p>

                    {/* Høyre kolonne (Innholdet) */}
                    <div>
                        <h2 className="font-heading text-fluid-h2 mb-3 text-brand-dark">
                            Grunnlaget
                        </h2>
                        <p className="text-fluid-p-lg text-brand-dark/90 max-w-prose mb-8">
                            Start her hvis du vil forstå hva som avgjør plasseringen, og hva du kan gjøre selv.
                        </p>

                        {articles.length === 0 ? (
                            <p className="text-fluid-h4 text-brand-dark/90">Ingen artikler publisert ennå. Sjekk tilbake senere!</p>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {articles.map((article) => (
                                    <Card key={article.slug} href={`/artikler/${article.slug}`} interactive accent="left" variant="light">
                                        <CardHeader>
                                            <CardTitle as="h3">{article.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <CardDescription>{article.description}</CardDescription>
                                        </CardContent>
                                        <CardFooter>
                                            <CardEyebrow>{article.readTime}</CardEyebrow>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <CtaSection bg="light" />
        </>
    );
}