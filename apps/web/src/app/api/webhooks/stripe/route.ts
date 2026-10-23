import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getDb, createBoss, QUEUES } from '@floww/db';
import { processSuccessfulPayment, generateReportPdf } from '@floww/audit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/**
 * Verifies the Stripe webhook signature header (`t=timestamp,v1=hmac...`)
 * against the raw request payload using HMAC-SHA256 and constant-time comparison.
 */
function verifyStripeWebhookSignature(
  rawBody: string,
  signatureHeader: string,
  webhookSecret: string,
  toleranceSeconds = 300
): boolean {
  const parts = signatureHeader.split(',').map((p) => p.trim());
  const timestampPart = parts.find((p) => p.startsWith('t='));
  const v1Parts = parts
    .filter((p) => p.startsWith('v1='))
    .map((p) => p.slice(3));

  if (!timestampPart || v1Parts.length === 0) {
    return false;
  }

  const timestamp = Number(timestampPart.slice(2));
  if (isNaN(timestamp)) {
    return false;
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  if (Math.abs(nowSeconds - timestamp) > toleranceSeconds) {
    return false;
  }

  const signedPayload = `${timestamp}.${rawBody}`;
  const expectedSig = crypto
    .createHmac('sha256', webhookSecret)
    .update(signedPayload, 'utf8')
    .digest('hex');

  const expectedBuf = Buffer.from(expectedSig, 'hex');

  return v1Parts.some((sig) => {
    try {
      const candidateBuf = Buffer.from(sig, 'hex');
      if (candidateBuf.length !== expectedBuf.length) return false;
      return crypto.timingSafeEqual(candidateBuf, expectedBuf);
    } catch {
      return false;
    }
  });
}

interface StripeWebhookEvent {
  id: string;
  type: string;
  data: {
    object: {
      id: string;
      payment_status?: string | null;
      client_reference_id?: string | null;
      customer_email?: string | null;
      amount_total?: number | null;
      metadata?: {
        reportId?: string;
        slug?: string;
      } | null;
      customer_details?: {
        email?: string | null;
        name?: string | null;
        phone?: string | null;
      } | null;
    };
  };
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('stripe-signature') || '';
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      return NextResponse.json(
        { error: 'STRIPE_WEBHOOK_SECRET is not configured.' },
        { status: 500 }
      );
    }

    const isValid = verifyStripeWebhookSignature(rawBody, signature, webhookSecret);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid Stripe webhook signature.' },
        { status: 400 }
      );
    }

    const event = JSON.parse(rawBody) as StripeWebhookEvent;

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      if (session.payment_status && session.payment_status !== 'paid') {
        return NextResponse.json({
          received: true,
          ignoredPaymentStatus: session.payment_status,
        });
      }

      const reportId =
        session.metadata?.reportId || session.client_reference_id || '';

      if (!reportId) {
        return NextResponse.json(
          { error: 'Missing reportId in checkout.session.completed payload.' },
          { status: 400 }
        );
      }

      const customerEmail =
        session.customer_details?.email ||
        session.customer_email ||
        'kunde@flowwmedia.no';
      const customerName = session.customer_details?.name || undefined;
      const customerPhone = session.customer_details?.phone || undefined;
      const amountOre = session.amount_total ?? 186250;

      const db = getDb();
      const paymentResult = await processSuccessfulPayment(
        {
          reportId,
          stripeSessionId: session.id,
          customerEmail,
          customerName,
          customerPhone,
          amountOre,
        },
        db
      );

      // Enqueue generate-pdf job in pg-boss (with graceful fallback if queue is offline)
      try {
        const boss = await createBoss();
        await boss.start();
        await boss.send(QUEUES.PDF_GENERATION, {
          reportId: paymentResult.reportId,
          slug: paymentResult.slug,
        });
        await boss.stop();
      } catch (queueErr) {
        console.warn(
          '⚠️ [Stripe Webhook] pg-boss PDF queue unavailable, triggering PDF generation inline:',
          queueErr
        );
        void generateReportPdf(paymentResult.slug, { db }).catch((pdfErr) => {
          console.error('⚠️ [Stripe Webhook] Inline PDF generation failed:', pdfErr);
        });
      }

      return NextResponse.json({
        received: true,
        reportId: paymentResult.reportId,
        slug: paymentResult.slug,
        leadId: paymentResult.leadId,
        unlockedAt: paymentResult.unlockedAt,
      });
    }

    return NextResponse.json({ received: true, ignoredType: event.type });
  } catch (error: any) {
    console.error('❌ [POST /api/webhooks/stripe] Error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed.' },
      { status: 500 }
    );
  }
}
