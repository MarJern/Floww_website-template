import { NextRequest, NextResponse } from 'next/server';
import { getDb, reports, auditJobs, businesses, eq } from '@floww/db';
import {
  processSuccessfulPayment,
  generateReportPdf,
  buildAgencyRoiSummary,
  type FullReportJson,
  type RedactedTeaserFinding,
} from '@floww/audit';
import { getTrustedAppOrigin } from '@/lib/admin-auth';
import {
  buildServerConsultantDetails,
  normalizeFactorMetadata,
} from '@/lib/report-consultant-details.server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Defense-in-depth sanitizer: guarantees that no `evidence`, `value`, or `competitorValues`
 * can ever be serialized in `teaserFindings`, and normalizes factor titles.
 */
function sanitizeTeaserFindings(rawList: unknown): RedactedTeaserFinding[] {
  if (!Array.isArray(rawList)) return [];
  return rawList
    .filter((item: any) => item?.status === 'ok' || item?.status === 'warn' || item?.status === 'crit')
    .map((item: any) => {
      const normalized = normalizeFactorMetadata({
        factorCode: String(item?.factorCode ?? ''),
        nameNo: String(item?.nameNo ?? item?.factorCode ?? ''),
      });
      const clean: RedactedTeaserFinding = {
        factorCode: normalized.factorCode,
        nameNo: normalized.nameNo || normalized.factorCode,
        groupName: String(item?.groupName ?? 'Generelt'),
        status:
          item?.status === 'ok' ||
          item?.status === 'warn' ||
          item?.status === 'crit'
            ? item.status
            : 'warn',
        part: typeof item?.part === 'number' ? item.part : 1,
      };
      if (typeof item?.headline === 'string' && item.headline.length > 0) {
        clean.headline = item.headline;
      }
      return clean;
    });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ error: 'Mangler rapport-slug.' }, { status: 400 });
    }

    const db = getDb();

    const [reportRow] = await db
      .select()
      .from(reports)
      .where(eq(reports.slug, slug))
      .limit(1);

    if (!reportRow) {
      return NextResponse.json(
        { error: 'Fant ikke rapporten.' },
        { status: 404 }
      );
    }

    // Check report expiration
    if (new Date(reportRow.expiresAt).getTime() < Date.now()) {
      return NextResponse.json(
        { error: 'Denne rapporten har utløpt (eldre enn 12 måneder).' },
        { status: 410 }
      );
    }

    // Instant Stripe Checkout Session Verification on Redirect (before webhook arrives)
    const sessionId = request.nextUrl.searchParams.get('session_id')?.trim();
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (reportRow.unlockedAt === null && sessionId && stripeSecretKey) {
      try {
        const stripeRes = await fetch(
          `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${stripeSecretKey}`,
            },
            signal: AbortSignal.timeout(10000),
          }
        );

        if (stripeRes.ok) {
          const sessionData = (await stripeRes.json()) as {
            id?: string;
            payment_status?: string;
            client_reference_id?: string | null;
            customer_email?: string | null;
            customer_details?: {
              email?: string | null;
              name?: string | null;
              phone?: string | null;
            } | null;
            amount_total?: number | null;
            metadata?: {
              reportId?: string;
              slug?: string;
            } | null;
          };

          const matchesReport =
            sessionData.metadata?.slug === slug ||
            sessionData.metadata?.reportId === reportRow.id ||
            sessionData.client_reference_id === reportRow.id;

          if (sessionData.payment_status === 'paid' && matchesReport && sessionData.id) {
            const customerEmail =
              sessionData.customer_details?.email ||
              sessionData.customer_email ||
              'stripe-kunde@flowwmedia.no';

            const paymentResult = await processSuccessfulPayment(
              {
                reportId: reportRow.id,
                stripeSessionId: sessionData.id,
                customerEmail,
                customerName: sessionData.customer_details?.name || undefined,
                customerPhone: sessionData.customer_details?.phone || undefined,
                amountOre:
                  typeof sessionData.amount_total === 'number'
                    ? sessionData.amount_total
                    : 186250,
              },
              db
            );

            reportRow.unlockedAt = paymentResult.unlockedAt;

            const origin = getTrustedAppOrigin();
            void generateReportPdf(slug, { baseUrl: origin, db }).catch((err) => {
              console.warn('⚠️ [Redirect Unlock] Background PDF generation warning:', err);
            });
          }
        }
      } catch (verifyErr) {
        console.warn('⚠️ [GET /api/seo-analyse/report/[slug]] Stripe session verify warning:', verifyErr);
      }
    }

    const [jobRow] = await db
      .select()
      .from(auditJobs)
      .where(eq(auditJobs.id, reportRow.jobId))
      .limit(1);

    const [businessRow] = jobRow
      ? await db
          .select()
          .from(businesses)
          .where(eq(businesses.id, jobRow.businessId))
          .limit(1)
      : [undefined];

    const isUnlocked = reportRow.unlockedAt !== null;
    const lockedJson = (reportRow.json ?? {}) as Partial<FullReportJson>;
    const sanitizedTeaserFindings = sanitizeTeaserFindings(reportRow.teaserFindings);
    const teaserHighlights = sanitizedTeaserFindings.filter((f) => Boolean(f.headline));

    const publicBusiness = {
      name: businessRow?.name ?? lockedJson.business?.name ?? 'Virksomhet',
      orgnr: businessRow?.orgnr ?? lockedJson.business?.orgnr ?? '',
      domain: businessRow?.domain ?? lockedJson.business?.domain ?? '',
      orgForm: businessRow?.orgForm ?? lockedJson.business?.orgForm ?? null,
      nace: businessRow?.nace ?? lockedJson.business?.nace ?? null,
      naceName: businessRow?.naceName ?? lockedJson.business?.naceName ?? null,
      address: businessRow?.address ?? lockedJson.business?.address ?? null,
      postcode: businessRow?.postcode ?? lockedJson.business?.postcode ?? null,
      city: businessRow?.city ?? lockedJson.business?.city ?? null,
      profileType: businessRow?.profileType ?? lockedJson.business?.profileType ?? 'lokal',
    };

    const scoreTotal = Number(reportRow.scoreTotal);
    const nokEstimate = Number(reportRow.nokEstimate);
    const adsValue = lockedJson.financial?.adsValue ?? Math.round(nokEstimate * 0.17);
    const monthlyLostRevenue = lockedJson.financial?.monthlyLostRevenue ?? nokEstimate;
    const agencyRoi =
      lockedJson.financial?.agencyRoi ??
      buildAgencyRoiSummary(
        businessRow?.agencySpendMonthly ?? lockedJson.business?.agencySpendMonthly,
        businessRow?.agencyDurationMonths ?? lockedJson.business?.agencyDurationMonths,
        monthlyLostRevenue
      );

    // Prepare AI questions overview (safe public metadata when locked, full response snippets when unlocked)
    const rawAi = (lockedJson.aiSummary ?? null) as any;
    const rawQuestions: any[] = Array.isArray(rawAi?.questions) ? rawAi.questions : [];
    const rawResults: any[] = Array.isArray(rawAi?.results) ? rawAi.results : [];

    const aiQuestionsOverview = rawQuestions.map((q: any, idx: number) => {
      const qCode = String(q.id || q.code || `Q${idx + 1}`);
      const qResults = rawResults.filter(
        (r: any) => (r.questionId || r.questionCode) === qCode
      );
      const chatgpt = qResults.find((r: any) => r.model === 'chatgpt');
      const gemini = qResults.find((r: any) => r.model === 'gemini');
      const claude = qResults.find((r: any) => r.model === 'claude');
      const perplexity = qResults.find((r: any) => r.model === 'perplexity');
      const anyMentioned = qResults.some((r: any) => Boolean(r.mentioned));
      const bestPos =
        qResults
          .map((r: any) => r.position)
          .filter((p: any): p is number => typeof p === 'number')[0] ?? null;

      return {
        id: qCode,
        category: String(q.category || 'Bransjesøk'),
        prompt: String(q.prompt || q.question || ''),
        mentioned: anyMentioned,
        position: bestPos,
        models: {
          chatgpt: chatgpt ? Boolean(chatgpt.mentioned) : false,
          gemini: gemini ? Boolean(gemini.mentioned) : anyMentioned,
          claude: claude ? Boolean(claude.mentioned) : Boolean(gemini?.mentioned ?? anyMentioned),
          perplexity: perplexity ? Boolean(perplexity.mentioned) : false,
        },
        ...(isUnlocked
          ? {
              responseSnippet:
                chatgpt?.responseSnippet ??
                chatgpt?.snippet ??
                gemini?.responseSnippet ??
                gemini?.snippet ??
                claude?.responseSnippet ??
                claude?.snippet ??
                perplexity?.responseSnippet ??
                perplexity?.snippet ??
                null,
              othersMentioned:
                chatgpt?.othersMentioned ??
                gemini?.othersMentioned ??
                claude?.othersMentioned ??
                [],
              citedDomain: chatgpt?.citedDomain ?? null,
            }
          : {}),
      };
    });

    const aiOverview = {
      overallMentionRate: typeof rawAi?.overallMentionRate === 'number' ? rawAi.overallMentionRate : 0.2,
      citationRate: typeof rawAi?.citationRate === 'number' ? rawAi.citationRate : 0.2,
      topCompetitorsMentioned:
        isUnlocked && Array.isArray(rawAi?.topCompetitorsMentioned)
          ? rawAi.topCompetitorsMentioned
          : [],
      questions: aiQuestionsOverview,
    };

    // ========================================================================
    // LOCKED STATE (Teaser Mode):
    // Strictly omit `json.findings`, `evidence`, `value`, and `competitorValues`!
    // ========================================================================
    if (!isUnlocked) {
      return NextResponse.json({
        isUnlocked: false,
        slug: reportRow.slug,
        createdAt: reportRow.createdAt,
        expiresAt: reportRow.expiresAt,
        business: publicBusiness,
        scoreTotal,
        scoresByPart: reportRow.scoresByPart,
        findingCounts: reportRow.findingCounts,
        nokEstimate,
        adsValue,
        financialSummary: {
          nokEstimate,
          adsValue,
          monthlyLostRevenue,
          annualLostRevenue: lockedJson.financial?.annualLostRevenue ?? nokEstimate * 12,
          monthlyAdsValue: lockedJson.financial?.monthlyAdsValue ?? adsValue,
          annualAdsValue: lockedJson.financial?.annualAdsValue ?? adsValue * 12,
          monthlyLostClicks: lockedJson.financial?.monthlyLostClicks ?? 0,
          annualLostClicks: lockedJson.financial?.annualLostClicks ?? 0,
          benchmarks: lockedJson.financial?.benchmarks ?? null,
          keywords: lockedJson.financial?.keywords ?? [],
          summaryText: lockedJson.financial?.summaryText ?? '',
          agencyRoi,
        },
        teaserHighlights,
        teaserFindings: sanitizedTeaserFindings,
        competitors: lockedJson.competitors ?? [],
        geoGrid: lockedJson.geoGrid ?? null,
        aiOverview,
      });
    }

    // ========================================================================
    // UNLOCKED STATE (Paid Report Mode):
    // Return full unredacted `json` payload including evidence, values, and server-enriched consultantDetails,
    // while stripping internal model metadata (`rule`, `notes`, `source`, `evidence.sourceLabel`).
    // ========================================================================
    const enrichedReport = {
      ...lockedJson,
      findings: Array.isArray(lockedJson.findings)
        ? lockedJson.findings.map((f: any) => {
            const normalized = normalizeFactorMetadata(f);
            const consultantDetails = buildServerConsultantDetails(
              normalized,
              publicBusiness.name,
              publicBusiness.city
            );
            const {
              rule: _rule,
              notes: _notes,
              source: _source,
              ...safeFinding
            } = normalized;
            if (safeFinding.evidence && typeof safeFinding.evidence === 'object') {
              const { sourceLabel: _sl, ...safeEvidence } = safeFinding.evidence;
              safeFinding.evidence = safeEvidence;
            }
            return {
              ...safeFinding,
              consultantDetails,
            };
          })
        : lockedJson.findings,
    };

    return NextResponse.json({
      isUnlocked: true,
      slug: reportRow.slug,
      unlockedAt: reportRow.unlockedAt,
      pdfPath: reportRow.pdfPath,
      createdAt: reportRow.createdAt,
      expiresAt: reportRow.expiresAt,
      business: publicBusiness,
      scoreTotal,
      scoresByPart: reportRow.scoresByPart,
      findingCounts: reportRow.findingCounts,
      nokEstimate,
      adsValue,
      financialSummary: lockedJson.financial
        ? {
            ...lockedJson.financial,
            agencyRoi,
          }
        : null,
      teaserHighlights,
      teaserFindings: sanitizedTeaserFindings,
      competitors: lockedJson.competitors ?? [],
      geoGrid: lockedJson.geoGrid ?? null,
      aiOverview,
      report: enrichedReport,
    });
  } catch (error: any) {
    console.error('❌ [GET /api/seo-analyse/report/[slug]] Error:', error);
    return NextResponse.json(
      { error: 'Kunne ikke laste rapporten.' },
      { status: 500 }
    );
  }
}
