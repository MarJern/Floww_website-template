import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CtaSection from "@/components/sections/CtaSection";
import FAQSection from "@/components/sections/FAQSection";
import QuoteCard from "@/components/ui/QuoteCard";
import PageHeader from "@/components/sections/PageHeader";
import { getAllArticles, getArticleBySlug } from "@/lib/articles";

const mdxComponents = {
  QuoteCard: (props: React.ComponentProps<typeof QuoteCard>) => <QuoteCard {...props} />,
  CtaSection: (props: React.ComponentProps<typeof CtaSection>) => <CtaSection {...props} />,
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="font-heading text-fluid-h2 text-brand-dark mt-2 mb-6" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="font-heading text-fluid-h3 text-brand-dark mt-12 mb-4" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="text-fluid-p-lg text-brand-dark/80 mb-6 text-pretty" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="list-none p-0 m-0 my-8 border-t border-brand-dark/10" {...props} />
  ),
  li: (props: React.LiHTMLAttributes<HTMLLIElement>) => (
    <li
      className="relative py-4 pl-6 border-b border-brand-dark/10 text-fluid-p-lg text-brand-dark/80 before:absolute before:left-0 before:top-[1.05rem] before:content-['-'] before:text-brand-dark/50"
      {...props}
    />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      className="text-brand-pine font-semibold underline decoration-brand-pine/40 underline-offset-2"
      {...props}
    />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-bold text-brand-dark" {...props} />
  ),
};

export async function generateStaticParams() {
  return getAllArticles().map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) return {};

  const articleUrl = `https://flowwmedia.no/artikler/${article.slug}`;
  const resolvedImage = `https://flowwmedia.no${article.image}`;

  return {
    title: article.title,
    description: article.description,
    alternates: {
      canonical: articleUrl,
    },
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      url: articleUrl,
      siteName: "Floww Media",
      locale: "nb_NO",
      images: [{ url: resolvedImage, width: 1200, height: 630, alt: article.title }],
      authors: [article.author],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: [resolvedImage],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const formattedDate = article.date
    ? new Date(article.date).toLocaleDateString("no-NO", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const domain = "https://flowwmedia.no";
  const articleUrl = `${domain}/artikler/${article.slug}`;

  const articleSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    abstract:
      article.summary.length > 0 ? article.summary.join(" ") : article.description,
    url: articleUrl,
    datePublished: article.date,
    dateModified: article.date,
    inLanguage: "nb-NO",
    author: {
      "@type": "Person",
      name: article.author,
      jobTitle: article.authorRole,
      url: `${domain}/om-oss`,
      worksFor: {
        "@id": `${domain}/#organization`,
      },
    },
    publisher: {
      "@type": "Organization",
      "@id": `${domain}/#organization`,
      name: "Floww Media",
      logo: {
        "@type": "ImageObject",
        url: `${domain}/images/logo.svg`,
      },
    },
    image: [`${domain}${article.image}`],
    mainEntityOfPage: articleUrl,
  };

  if (article.tags.length > 0) {
    articleSchema.about = article.tags.map((tag) => ({
      "@type": "Thing",
      name: tag,
    }));
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Hjem", item: domain },
      {
        "@type": "ListItem",
        position: 2,
        name: "Artikler",
        item: `${domain}/artikler`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: articleUrl,
      },
    ],
  };

  return (
    <>
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <PageHeader
        breadcrumbs={[
          { name: "Hjem", href: "/" },
          { name: "Artikler", href: "/artikler" },
          { name: article.title },
        ]}
        label={article.category}
        title={article.title}
        description={article.description}
      />

      <div className="w-full bg-brand-sand pt-[clamp(3rem,5vw,4rem)] pb-[clamp(3rem,6.5vw,5.4rem)]">
        <article className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8 grid grid-cols-1 md:grid-cols-[minmax(0,7rem)_minmax(0,1fr)] gap-[clamp(1.2rem,4vw,3.2rem)] items-start">
          {/* Venstre kolonne */}
          <div className="hidden md:block">
            <p className="text-micro uppercase text-brand-blue m-0 mt-[0.35rem] sticky top-24">
              Innhold
            </p>
          </div>

          {/* Høyre kolonne */}
          <div className="w-full max-w-3xl">
            <Link
              href="/artikler"
              className="inline-flex items-center gap-2 text-micro uppercase text-brand-blue hover:text-brand-pine transition-colors mb-6 font-bold motion-reduce:transition-none"
            >
              &larr; Tilbake til alle artikler
            </Link>

            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-micro text-brand-dark/80 pb-5 border-b border-brand-dark/10 mb-8">
              <span>
                Skrevet av{" "}
                <Link
                  href="/om-oss"
                  className="text-brand-dark font-bold underline decoration-brand-pine/40 hover:text-brand-pine transition-colors"
                >
                  {article.author}
                </Link>
                <span className="text-brand-blue"> ({article.authorRole})</span>
              </span>
              <span aria-hidden="true">·</span>
              <span>Oppdatert {formattedDate}</span>
              <span aria-hidden="true">·</span>
              <span>{article.readTime}</span>
            </div>

            {article.summary.length > 0 && (
              <aside
                aria-label="Oppsummering av artikkelen"
                className="bg-brand-light border border-brand-dark/10 border-l-[4px] border-l-brand-pine rounded-sm p-6 sm:p-8 mb-10"
              >
                <p className="text-micro uppercase tracking-widest text-brand-pine font-bold mb-3 m-0">
                  Kort oppsummert
                </p>
                <ul className="list-none p-0 m-0 flex flex-col gap-3">
                  {article.summary.map((point, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-fluid-p text-brand-dark/90 text-pretty"
                    >
                      <span
                        aria-hidden="true"
                        className="text-brand-pine font-bold mt-0.5 select-none"
                      >
                        ✓
                      </span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </aside>
            )}

            <div className="max-w-none text-pretty">
              <MDXRemote source={article.content} components={mdxComponents} />
            </div>
          </div>
        </article>
      </div>

      {article.faqs.length > 0 && <FAQSection faqs={article.faqs} />}

      <CtaSection bg="sand" />
    </>
  );
}