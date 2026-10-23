import type { Metadata } from 'next';
import { cache } from 'react';
import { getDb, reports, auditJobs, businesses, eq } from '@floww/db';
import ReportInteractiveView from '../../../components/synlighetsrapport/ReportInteractiveView';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    session_id?: string;
    unlocked?: string;
    checkout?: string;
    print?: string;
    pdf?: string;
  }>;
}

const getReportMetaBySlug = cache(async (slug: string) => {
  try {
    const db = getDb();
    const [report] = await db
      .select({
        id: reports.id,
        slug: reports.slug,
        jobId: reports.jobId,
        scoreTotal: reports.scoreTotal,
        json: reports.json,
      })
      .from(reports)
      .where(eq(reports.slug, slug))
      .limit(1);

    if (!report) return null;

    const jsonData = (report.json ?? {}) as {
      business?: { name?: string; domain?: string };
    };

    let businessName = jsonData.business?.name || 'Bedrift';
    let domain = jsonData.business?.domain || '';

    if (report.jobId) {
      const [job] = await db
        .select({ businessId: auditJobs.businessId })
        .from(auditJobs)
        .where(eq(auditJobs.id, report.jobId))
        .limit(1);

      if (job?.businessId) {
        const [biz] = await db
          .select({
            name: businesses.name,
            domain: businesses.domain,
          })
          .from(businesses)
          .where(eq(businesses.id, job.businessId))
          .limit(1);

        if (biz) {
          businessName = biz.name || biz.domain || businessName;
          domain = biz.domain || domain;
        }
      }
    }

    return {
      slug: report.slug,
      businessName,
      domain,
      scoreTotal: Number(report.scoreTotal) || 0,
    };
  } catch {
    return null;
  }
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const meta = await getReportMetaBySlug(slug);

  const businessLabel = meta?.businessName || slug;

  return {
    title: `SEO-analyse for ${businessLabel}`,
    description: `Teknisk SEO-, Google Maps- og AI-synlighetsanalyse (245 målepunkter) for ${businessLabel}, utført av Floww Media.`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function SynlighetsrapportSlugPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const resolvedSearch = await searchParams;
  const meta = await getReportMetaBySlug(slug);

  const businessLabel = meta?.businessName || 'Bedrift';
  const sessionIdParam = resolvedSearch?.session_id || '';
  const justUnlockedParam =
    resolvedSearch?.unlocked === '1' || resolvedSearch?.checkout === 'success';
  const isPdfMode =
    resolvedSearch?.pdf === '1' || resolvedSearch?.print === '1';

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Hjem',
        item: 'https://flowwmedia.no',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'SEO-analyse',
        item: 'https://flowwmedia.no/seo-analyse',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `SEO-analyse for ${businessLabel}`,
        item: `https://flowwmedia.no/seo-analyse/${encodeURIComponent(slug)}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <ReportInteractiveView
        slug={slug}
        sessionIdParam={sessionIdParam}
        justUnlockedParam={justUnlockedParam}
        isPdfMode={isPdfMode}
      />
    </>
  );
}
