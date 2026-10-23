import fs from 'fs';
import path from 'path';
import os from 'os';
import { getDb, Database, reports, eq } from '@floww/db';
import type { FullReportJson } from './engine/report';

export interface GenerateReportPdfOptions {
  baseUrl?: string;
  outputDir?: string;
  db?: Database;
  preferPlaywright?: boolean;
}

export interface GenerateReportPdfResult {
  slug: string;
  pdfPath: string;
  pdfBuffer: Buffer;
  engine: 'playwright' | 'native-pdf';
}

/**
 * Escapes characters for PDF literal strings `( ... )` and maps Norwegian characters
 * to WinAnsiEncoding octal codes so native PDF text renders æ, ø, å, Æ, Ø, Å, – cleanly.
 */
function encodePdfText(input: string): string {
  const charMap: Record<string, string> = {
    æ: '\\346',
    ø: '\\370',
    å: '\\345',
    Æ: '\\306',
    Ø: '\\330',
    Å: '\\305',
    '–': '\\261',
    '—': '\\261',
    '«': '\\253',
    '»': '\\273',
    '·': '\\267',
    '×': 'x',
  };

  let out = '';
  for (const ch of input) {
    if (ch === '\\') out += '\\\\';
    else if (ch === '(') out += '\\(';
    else if (ch === ')') out += '\\)';
    else if (charMap[ch]) out += charMap[ch];
    else if (ch.charCodeAt(0) >= 32 && ch.charCodeAt(0) <= 126) out += ch;
    else out += ' ';
  }
  return out;
}

/**
 * Generates a valid, standards-compliant PDF 1.4 binary buffer containing the executive
 * summary, 4-part scores, financial loss calculation, and unlocked findings.
 */
export function buildNativeReportPdfBuffer(
  slug: string,
  reportRow: {
    scoreTotal: string | number;
    scoresByPart: { part1: number; part2: number; part3: number; part4: number };
    findingCounts: { total: number; ok: number; warn: number; crit: number; na: number };
    nokEstimate: string | number;
    json: unknown;
  }
): Buffer {
  const full = (reportRow.json ?? {}) as Partial<FullReportJson>;
  const businessName = full.business?.name || full.business?.domain || 'Virksomhet';
  const domain = full.business?.domain || '';
  const orgnr = full.business?.orgnr || '';
  const scoreTotal = Math.round(Number(reportRow.scoreTotal));
  const nokMonthly = Math.round(Number(reportRow.nokEstimate)).toLocaleString('nb-NO');
  const adsMonthly = Math.round(
    Number(full.financial?.adsValue ?? Number(reportRow.nokEstimate) * 0.17)
  ).toLocaleString('nb-NO');

  const lines: Array<{ text: string; size: number; bold?: boolean; gap?: number }> = [
    { text: 'FLOWW MEDIA - SYNLIGHETSRAPPORTEN 2026', size: 10, bold: true, gap: 16 },
    { text: `${businessName} (${domain})`, size: 18, bold: true, gap: 18 },
    {
      text: `Org.nr: ${orgnr}  |  Rapport-ID: ${slug}  |  Status: Ulast fullrapport`,
      size: 9,
      gap: 20,
    },
    {
      text: `SAMLET SYNLIGHETSSCORE: ${scoreTotal} / 100`,
      size: 13,
      bold: true,
      gap: 16,
    },
    {
      text: `Del 1 (Lokalt sok / Kart): ${Math.round(reportRow.scoresByPart.part1)}/100   |   Del 2 (Teknisk & Organisk SEO): ${Math.round(reportRow.scoresByPart.part2)}/100`,
      size: 10,
      gap: 14,
    },
    {
      text: `Del 3 (AI-synlighet): ${Math.round(reportRow.scoresByPart.part3)}/100   |   Del 4 (Google Ads & Okonomi): ${Math.round(reportRow.scoresByPart.part4)}/100`,
      size: 10,
      gap: 18,
    },
    {
      text: `FUNNOVERSIKT: ${reportRow.findingCounts.crit} kritiske feil, ${reportRow.findingCounts.warn} advarsler, ${reportRow.findingCounts.ok} godkjente (${reportRow.findingCounts.total} sjekkpunkter)`,
      size: 10,
      bold: true,
      gap: 18,
    },
    {
      text: `OKONOMISK TAPSANALYSE: ${nokMonthly} kr/mnd i tapt omsetningspotensial (Ads-verdi: ${adsMonthly} kr/mnd)`,
      size: 11,
      bold: true,
      gap: 22,
    },
    { text: 'HOVEDFUNN OG TEKNISKE OBSERVASJONER:', size: 12, bold: true, gap: 16 },
  ];

  const findingsList = full.findings ?? [];
  const prioritized = [...findingsList].sort((a, b) => {
    const order = { crit: 0, warn: 1, ok: 2, na: 3 };
    return (order[a.status] ?? 3) - (order[b.status] ?? 3);
  });

  for (const item of prioritized.slice(0, 22)) {
    const statusTag =
      item.status === 'crit'
        ? '[KRITISK]'
        : item.status === 'warn'
          ? '[ADVARSEL]'
          : item.status === 'ok'
            ? '[OK]'
            : '[NA]';
    const snippet = item.evidence?.snippet ? ` - ${item.evidence.snippet}` : '';
    const lineText = `${item.factorCode} ${statusTag} ${item.nameNo}${snippet}`.slice(0, 108);
    lines.push({
      text: lineText,
      size: 8.5,
      bold: item.status === 'crit',
      gap: 12,
    });
  }

  let y = 800;
  const contentOps: string[] = ['BT'];
  for (const line of lines) {
    if (y < 50) break;
    const fontRef = line.bold ? '/F2' : '/F1';
    contentOps.push(`${fontRef} ${line.size} Tf`);
    contentOps.push(`1 0 0 1 42 ${y} Tm`);
    contentOps.push(`(${encodePdfText(line.text)}) Tj`);
    y -= line.gap ?? 14;
  }
  contentOps.push('ET');

  const streamContent = contentOps.join('\n');
  const streamByteLength = Buffer.byteLength(streamContent, 'latin1');

  const objects: string[] = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>\nendobj\n',
    '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>\nendobj\n',
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>\nendobj\n',
    `6 0 obj\n<< /Length ${streamByteLength} >>\nstream\n${streamContent}\nendstream\nendobj\n`,
  ];

  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [0];
  for (const obj of objects) {
    offsets.push(Buffer.byteLength(pdf, 'latin1'));
    pdf += obj;
  }

  const xrefOffset = Buffer.byteLength(pdf, 'latin1');
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  for (let i = 1; i < offsets.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  return Buffer.from(pdf, 'latin1');
}

/**
 * Renders the unlocked report at `${baseUrl}/seo-analyse/${slug}?print=1` to an A4 PDF
 * using Playwright (`chromium.launch({ headless: true })`), saves the file path to `reports.pdf_path`,
 * and returns the PDF buffer and path. Falls back to native PDF generation if Playwright browser
 * or target server is unavailable.
 */
export async function generateReportPdf(
  slug: string,
  options?: GenerateReportPdfOptions
): Promise<GenerateReportPdfResult> {
  const db = options?.db ?? getDb();

  const [reportRow] = await db
    .select()
    .from(reports)
    .where(eq(reports.slug, slug))
    .limit(1);

  if (!reportRow) {
    throw new Error(`Report not found for slug=${slug}`);
  }

  if (!reportRow.unlockedAt) {
    throw new Error(`Cannot generate PDF for locked report slug=${slug}`);
  }

  const baseUrl =
    options?.baseUrl ||
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'http://localhost:3000';
  const outputDir = options?.outputDir || path.join(os.tmpdir(), 'floww-reports');
  fs.mkdirSync(outputDir, { recursive: true });

  const pdfPath = path.join(outputDir, `synlighetsrapport-${slug}.pdf`);
  const tryPlaywright = options?.preferPlaywright ?? true;

  let pdfBuffer: Buffer | null = null;
  let engine: 'playwright' | 'native-pdf' = 'native-pdf';

  if (tryPlaywright) {
    try {
      const { chromium } = await import('playwright');
      let browser;
      try {
        browser = await chromium.launch({ headless: true, timeout: 10000 });
      } catch {
        browser = await chromium.launch({
          headless: true,
          channel: 'chrome',
          timeout: 10000,
        });
      }
      try {
        const page = await browser.newPage({
          viewport: { width: 1280, height: 900 },
        });
        const targetUrl = `${baseUrl.replace(/\/$/, '')}/seo-analyse/${encodeURIComponent(
          slug
        )}?print=1&pdf=1`;
        await page.goto(targetUrl, {
          waitUntil: 'networkidle',
          timeout: 20000,
        });
        await page.waitForSelector('#report-main-heading', { timeout: 15000 });
        await page.evaluate(async () => {
          const doc = (globalThis as any).document;
          if (doc?.fonts?.ready) {
            await doc.fonts.ready;
          }
          const images: any[] = doc ? Array.from(doc.querySelectorAll('img')) : [];
          await Promise.all(
            images.map((img: any) =>
              img.complete
                ? Promise.resolve()
                : new Promise<void>((resolve) => {
                    img.addEventListener('load', () => resolve(), { once: true });
                    img.addEventListener('error', () => resolve(), { once: true });
                  })
            )
          );
        });
        const rawBytes = await page.pdf({
          format: 'A4',
          printBackground: true,
          margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' },
        });
        pdfBuffer = Buffer.from(rawBytes);
        engine = 'playwright';
      } finally {
        await browser.close();
      }
    } catch (pwError: any) {
      console.warn(
        `⚠️ [PDF] Playwright headless render skipped/fell back to native PDF (${pwError?.message || 'browser unavailable'})`
      );
    }
  }

  if (!pdfBuffer) {
    pdfBuffer = buildNativeReportPdfBuffer(slug, reportRow);
    engine = 'native-pdf';
  }

  fs.writeFileSync(pdfPath, pdfBuffer);

  await db
    .update(reports)
    .set({
      pdfPath,
      updatedAt: new Date(),
    })
    .where(eq(reports.id, reportRow.id));

  return {
    slug,
    pdfPath,
    pdfBuffer,
    engine,
  };
}
