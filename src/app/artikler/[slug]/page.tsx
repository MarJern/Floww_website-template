import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CtaSection from "@/components/sections/CtaSection";
import QuoteCard from "@/components/ui/QuoteCard";
import PageHeader from "@/components/sections/PageHeader";

const mdxComponents = {
    QuoteCard: (props: any) => <QuoteCard {...props} />,
    CtaSection: (props: any) => (<CtaSection {...props} />),
    h2: (props: any) => <h2 className="font-heading text-fluid-h2 text-brand-dark mt-2 mb-6" {...props} />,
    h3: (props: any) => <h3 className="font-heading text-fluid-h3 text-brand-dark mt-12 mb-4" {...props} />,

    p: (props: any) => <p className="text-fluid-p-lg text-brand-dark/80 mb-6 text-pretty" {...props} />,
    ul: (props: any) => <ul className="list-none p-0 m-0 my-8 border-t border-brand-dark/10" {...props} />,
    li: (props: any) => (
        <li className="relative py-4 pl-6 border-b border-brand-dark/10 text-fluid-p-lg text-brand-dark/80 before:absolute before:left-0 before:top-[1.05rem] before:content-['-'] before:text-brand-dark/50" {...props} />
    ),

    a: (props: any) => <a className="text-brand-pine font-semibold underline decoration-brand-pine/40 underline-offset-2" {...props} />,
    strong: (props: any) => <strong className="font-bold text-brand-dark" {...props} />,
};

export async function generateStaticParams() {
    const contentDir = path.join(process.cwd(), "src/content/artikler");
    if (!fs.existsSync(contentDir)) return [];
    const files = fs.readdirSync(contentDir);
    return files
        .filter((file) => file.endsWith(".mdx"))
        .map((file) => ({
            slug: file.replace(".mdx", ""),
        }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const contentDir = path.join(process.cwd(), "src/content/artikler");
    const filePath = path.join(contentDir, `${decodedSlug}.mdx`);

    if (!fs.existsSync(filePath)) return {};

    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileContent);
    const articleUrl = `https://flowwmedia.no/artikler/${decodedSlug}`;

    return {
        title: `${data.title} | Floww Media`,
        description: data.description,
        alternates: {
            canonical: articleUrl,
        },
        openGraph: {
            title: data.title,
            description: data.description,
            type: "article",
            url: articleUrl,
            images: data.image
                ? [{ url: `https://flowwmedia.no${data.image}` }]
                : [{ url: "https://flowwmedia.no/images/teamet.jpg" }], // Lagt inn team-bildet
            authors: data.author ? [data.author] : undefined,
        },
        twitter: {
            card: "summary_large_image",
            images: data.image
                ? [`https://flowwmedia.no${data.image}`]
                : ["https://flowwmedia.no/images/teamet.jpg"], // Lagt inn team-bildet
        },
        other: {
            "geo.region": "NO-03",
            "geo.placename": "Oslo",
        }
    };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);

    const contentDir = path.join(process.cwd(), "src/content/artikler");
    const filePath = path.join(contentDir, `${decodedSlug}.mdx`);

    if (!fs.existsSync(filePath)) {
        notFound();
    }

    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContent);

    const formattedDate = data.date
        ? new Date(data.date).toLocaleDateString('no-NO', { day: 'numeric', month: 'long', year: 'numeric' })
        : '';

    const domain = "https://flowwmedia.no";
    const articleUrl = `${domain}/artikler/${decodedSlug}`;

    const articleSchema: any = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": data.title,
        "description": data.description,
        "url": articleUrl,
        "datePublished": data.date,
        "dateModified": data.date,
        "inLanguage": "nb-NO",
        "author": { "@type": "Person", "name": data.author || "Floww Media" },
        "publisher": { "@type": "Organization", "name": "Floww Media", "logo": { "@type": "ImageObject", "url": `${domain}/logo.png` } },
        "mainEntityOfPage": articleUrl
    };

    articleSchema.image = [
        `${domain}/images/teamet.jpg`
    ];

    // Beholder tag-logikken din intakt!
    if (data.tags && Array.isArray(data.tags)) {
        articleSchema.about = data.tags.map((tag: string) => ({ "@type": "Thing", "name": tag }));
    }

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Hjem", "item": `${domain}/` },
            { "@type": "ListItem", "position": 2, "name": "Artikler", "item": `${domain}/artikler/` },
            { "@type": "ListItem", "position": 3, "name": data.title, "item": `${articleUrl}/` }
        ]
    };

    let faqSchema = null;
    if (data.faqs && Array.isArray(data.faqs)) {
        faqSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": data.faqs.map((faq: any) => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
            }))
        };
    }

    return (
        <>
            <Script id="article-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
            <Script id="breadcrumb-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
            {faqSchema && <Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

            <PageHeader
                label={data.category || "Artikkel"}
                title={data.title}
                description={data.description}
            />

            {/* LYS ARTIKKEL-SEKSJON (Innhold) */}
            <main className="w-full bg-brand-sand pt-[clamp(3rem,5vw,4rem)] pb-[clamp(3rem,6.5vw,5.4rem)]">
                <article className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8 grid grid-cols-1 md:grid-cols-[minmax(0,7rem)_minmax(0,1fr)] gap-[clamp(1.2rem,4vw,3.2rem)] items-start">

                    {/* Venstre kolonne */}
                    <div className="hidden md:block">
                        <p className="text-micro uppercase text-brand-dark/50 m-0 mt-[0.35rem] sticky top-24">
                            Innhold
                        </p>
                    </div>

                    {/* Høyre kolonne */}
                    <div className="w-full max-w-3xl">

                        <Link
                            href="/artikler"
                            className="inline-flex items-center gap-2 text-micro uppercase text-brand-dark/50 hover:text-brand-pine transition-colors mb-8 font-bold motion-reduce:transition-none"
                        >
                            &larr; Tilbake
                        </Link>

                        <div className="flex items-center gap-2 text-micro text-brand-dark/70 pb-4 border-b border-brand-dark/10 mb-6">
                            Oppdatert {formattedDate} · {data.readTime}
                        </div>

                        <div className="max-w-none text-pretty">
                            <MDXRemote source={content} components={mdxComponents} />
                        </div>

                    </div>
                </article>
            </main>

            <div>
                <CtaSection bg="light" />
            </div>
        </>
    );
}