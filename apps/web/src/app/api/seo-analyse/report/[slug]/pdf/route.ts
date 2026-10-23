import fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import { getDb, reports, eq } from '@floww/db';
import { generateReportPdf } from '@floww/audit';
import { getTrustedAppOrigin } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

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

    // CRITICAL SECURITY GATE: Reject PDF downloads for locked reports
    if (reportRow.unlockedAt === null) {
      return NextResponse.json(
        {
          error:
            'Rapporten er låst. Fullfør betaling for å laste ned PDF-utgaven av Synlighetsrapporten.',
        },
        { status: 403 }
      );
    }

    let pdfBuffer: Buffer | null = null;
    const useCachedOnly = request.nextUrl.searchParams.get('cached') === '1';
    const forceNativePdf = request.nextUrl.searchParams.get('engine') === 'native-pdf';
    const isBrowserNavigation = (request.headers.get('accept') || '').includes('text/html');
    const origin = getTrustedAppOrigin();

    if (
      useCachedOnly &&
      reportRow.pdfPath &&
      fs.existsSync(/*turbopackIgnore: true*/ reportRow.pdfPath)
    ) {
      pdfBuffer = fs.readFileSync(/*turbopackIgnore: true*/ reportRow.pdfPath);
    } else {
      const preferPlaywright = !forceNativePdf;

      try {
        const generated = await generateReportPdf(slug, {
          baseUrl: origin,
          db,
          preferPlaywright,
        });
        if (
          generated.engine === 'native-pdf' &&
          !forceNativePdf &&
          isBrowserNavigation
        ) {
          return NextResponse.redirect(
            `${origin}/seo-analyse/${encodeURIComponent(slug)}?pdf=1&autoprint=1`,
            302
          );
        }
        pdfBuffer = generated.pdfBuffer;
      } catch (genErr) {
        if (
          reportRow.pdfPath &&
          fs.existsSync(/*turbopackIgnore: true*/ reportRow.pdfPath)
        ) {
          pdfBuffer = fs.readFileSync(/*turbopackIgnore: true*/ reportRow.pdfPath);
        } else if (isBrowserNavigation) {
          return NextResponse.redirect(
            `${origin}/seo-analyse/${encodeURIComponent(slug)}?pdf=1&autoprint=1`,
            302
          );
        } else {
          throw genErr;
        }
      }
    }

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="synlighetsrapport-${slug}.pdf"`,
        'Cache-Control': 'private, no-store',
      },
    });
  } catch (error: any) {
    console.error('❌ [GET /api/seo-analyse/report/[slug]/pdf] Error:', error);
    return NextResponse.json(
      { error: 'Kunne ikke generere PDF-rapport.' },
      { status: 500 }
    );
  }
}
