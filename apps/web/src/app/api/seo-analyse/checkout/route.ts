import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { getDb, reports, auditJobs, businesses, leads, orders, eq, desc } from '@floww/db';
import { processSuccessfulPayment, generateReportPdf } from '@floww/audit';
import { getTrustedAppOrigin, isAdminAuthenticated } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface CheckoutRequestBody {
  slug?: string;
  email?: string;
  customerName?: string;
  customerPhone?: string;
  demoUnlock?: boolean;
}

export const REPORT_PRICE_EX_VAT_ORE = 149000; // 1 490,00 kr eks. mva.
export const REPORT_VAT_ORE = 37250; // 372,50 kr (25 % mva.)
export const REPORT_TOTAL_INC_VAT_ORE = 186250; // 1 862,50 kr inkl. mva.
const PRODUCT_NAME =
  'Synlighetsrapporten — Komplett teknisk utredning og handlingsplan';
const VAT_LINE_NAME =
  'Merverdiavgift (25 % MVA — Floww AS Org.nr. 922 758 476 MVA)';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as CheckoutRequestBody;
    const slug = (body.slug || '').trim();
    const explicitEmail = (body.email || '').trim().toLowerCase();

    if (!slug) {
      return NextResponse.json(
        { error: 'Mangler rapport-slug.' },
        { status: 400 }
      );
    }

    const db = getDb();

    // 1. Look up the report by slug
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

    // 2. Resolve the email already captured during the 2-Step Lead Gate
    const [jobRow] = await db
      .select({ businessId: auditJobs.businessId })
      .from(auditJobs)
      .where(eq(auditJobs.id, reportRow.jobId))
      .limit(1);

    const [businessRow] = jobRow?.businessId
      ? await db
          .select({ email: businesses.email })
          .from(businesses)
          .where(eq(businesses.id, jobRow.businessId))
          .limit(1)
      : [undefined];

    const [leadRow] = await db
      .select({ email: leads.email })
      .from(leads)
      .where(eq(leads.reportId, reportRow.id))
      .orderBy(desc(leads.createdAt))
      .limit(1);

    const storedEmail = (
      explicitEmail ||
      leadRow?.email ||
      businessRow?.email ||
      ''
    )
      .trim()
      .toLowerCase();
    const customerEmail = storedEmail || 'demo@flowwmedia.no';

    const origin = getTrustedAppOrigin();

    // If already unlocked, redirect straight to the unlocked report view
    if (reportRow.unlockedAt !== null) {
      const redirectUrl = `/seo-analyse/${slug}?unlocked=1`;
      return NextResponse.json({
        alreadyUnlocked: true,
        redirectUrl,
        checkoutUrl: redirectUrl,
      });
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const isAdmin = isAdminAuthenticated(request);
    const allowDemoUnlock =
      (process.env.NODE_ENV !== 'production' && !stripeSecretKey) ||
      (isAdmin && body.demoUnlock === true);

    // ========================================================================
    // LIVE STRIPE CHECKOUT MODE (when STRIPE_SECRET_KEY is configured)
    // ========================================================================
    if (stripeSecretKey && !allowDemoUnlock) {
      const params = new URLSearchParams();
      params.append('mode', 'payment');
      params.append('client_reference_id', reportRow.id);
      if (storedEmail) {
        params.append('customer_email', storedEmail);
      }
      params.append(
        'success_url',
        `${origin}/seo-analyse/${encodeURIComponent(
          slug
        )}?unlocked=1&session_id={CHECKOUT_SESSION_ID}`
      );
      params.append(
        'cancel_url',
        `${origin}/seo-analyse/${encodeURIComponent(slug)}`
      );
      // Line item 1: Base B2B price ex. VAT (1 490,00 kr)
      params.append('line_items[0][price_data][currency]', 'nok');
      params.append('line_items[0][price_data][unit_amount]', String(REPORT_PRICE_EX_VAT_ORE));
      params.append('line_items[0][price_data][product_data][name]', PRODUCT_NAME);
      params.append('line_items[0][quantity]', '1');

      // Line item 2: 25% Norwegian VAT / MVA (372,50 kr)
      params.append('line_items[1][price_data][currency]', 'nok');
      params.append('line_items[1][price_data][unit_amount]', String(REPORT_VAT_ORE));
      params.append('line_items[1][price_data][product_data][name]', VAT_LINE_NAME);
      params.append('line_items[1][quantity]', '1');

      // Enable B2B accounting invoice & Norwegian tax ID collection
      params.append('invoice_creation[enabled]', 'true');
      params.append('tax_id_collection[enabled]', 'true');

      params.append('metadata[reportId]', reportRow.id);
      params.append('metadata[slug]', reportRow.slug);
      params.append('metadata[priceExVatOre]', String(REPORT_PRICE_EX_VAT_ORE));
      params.append('metadata[vatOre]', String(REPORT_VAT_ORE));

      const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${stripeSecretKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
        signal: AbortSignal.timeout(15000),
      });

      const sessionData = (await stripeRes.json()) as {
        id?: string;
        url?: string;
        error?: { message?: string };
      };

      if (!stripeRes.ok || !sessionData.id || !sessionData.url) {
        throw new Error(
          sessionData.error?.message || 'Kunne ikke opprette Stripe Checkout-sesjon.'
        );
      }

      // Insert pending row in orders with total amount including 25% MVA (186250 øre)
      await db
        .insert(orders)
        .values({
          stripeSessionId: sessionData.id,
          reportId: reportRow.id,
          amount: REPORT_TOTAL_INC_VAT_ORE,
          currency: 'nok',
          status: 'pending',
          email: customerEmail,
        })
        .onConflictDoNothing();

      return NextResponse.json({
        checkoutUrl: sessionData.url,
        sessionId: sessionData.id,
        priceExVatOre: REPORT_PRICE_EX_VAT_ORE,
        vatOre: REPORT_VAT_ORE,
        totalIncVatOre: REPORT_TOTAL_INC_VAT_ORE,
      });
    }

    // ========================================================================
    // LOCAL DEV / ADMIN DEMO FALLBACK
    // ========================================================================
    if (allowDemoUnlock) {
      const mockSessionId = `demo_sess_${nanoid(12)}`;

      const paymentResult = await processSuccessfulPayment(
        {
          reportId: reportRow.id,
          stripeSessionId: mockSessionId,
          customerEmail,
          customerName: body.customerName,
          customerPhone: body.customerPhone,
          amountOre: REPORT_TOTAL_INC_VAT_ORE,
        },
        db
      );

      // Trigger background PDF generation so pdf_path is ready immediately
      void generateReportPdf(slug, { baseUrl: origin, db }).catch((err) => {
        console.warn('⚠️ [Demo Checkout] Background PDF generation warning:', err);
      });

      const checkoutUrl = `/seo-analyse/${slug}?unlocked=1&demo=1`;
      return NextResponse.json({
        checkoutUrl,
        demoUnlocked: true,
        sessionId: mockSessionId,
        leadId: paymentResult.leadId,
        priceExVatOre: REPORT_PRICE_EX_VAT_ORE,
        vatOre: REPORT_VAT_ORE,
        totalIncVatOre: REPORT_TOTAL_INC_VAT_ORE,
      });
    }

    return NextResponse.json(
      { error: 'Stripe betalingsløsning er ikke konfigurert (STRIPE_SECRET_KEY mangler).' },
      { status: 503 }
    );
  } catch (error: any) {
    console.error('❌ [POST /api/seo-analyse/checkout] Error:', error);
    return NextResponse.json(
      {
        error: 'Kunne ikke starte betalingsflyten.',
      },
      { status: 500 }
    );
  }
}
