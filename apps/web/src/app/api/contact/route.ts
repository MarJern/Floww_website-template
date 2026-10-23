import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy");

const CONTACT_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const CONTACT_RATE_LIMIT_MAX = 5;
const contactIpBuckets = new Map<string, number[]>();

function isContactRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = contactIpBuckets.get(ip) || [];
  const valid = timestamps.filter((t) => now - t < CONTACT_RATE_LIMIT_WINDOW_MS);

  if (valid.length >= CONTACT_RATE_LIMIT_MAX) {
    contactIpBuckets.set(ip, valid);
    return true;
  }

  valid.push(now);
  contactIpBuckets.set(ip, valid);
  return false;
}

function escapeHtml(input: unknown): string {
  const str = String(input ?? "");
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(req: Request) {
  try {
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    if (isContactRateLimited(clientIp)) {
      return NextResponse.json(
        { error: "For mange henvendelser på kort tid. Vennligst prøv igjen om noen minutter." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { name, company, address, email, phone, message } = body;

    // Sjekker at alle påkrevde felt fra det nye skjemaet er med. (address og message er valgfrie)
    if (!name || !company || !email || !phone) {
      return NextResponse.json(
        { error: "Navn, bedrift, e-post og telefon er påkrevd." },
        { status: 400 }
      );
    }

    const safeCompany = escapeHtml(company);
    const safeAddress = address ? escapeHtml(address) : "<em>Ikke oppgitt</em>";
    const safeName = escapeHtml(name);
    const safePhone = escapeHtml(phone);
    const safeEmail = escapeHtml(email);
    const safeMessageHtml = message
      ? escapeHtml(message).replace(/\r?\n/g, "<br/>")
      : "<em>Ingen ekstra info oppgitt.</em>";

    const { data, error } = await resend.emails.send({
      from: "Floww Media <kontakt@flowwmedia.no>",
      to: "kontakt@flowwmedia.no",
      replyTo: String(email).trim(),
      subject: `Ny forespørsel om SEO-audit fra ${String(company).replace(/[\r\n]+/g, " ").trim()}`,
      html: `
        <h2>Ny forespørsel til Floww Media</h2>
        <p><strong>Bedrift:</strong> ${safeCompany}</p>
        <p><strong>Adresse:</strong> ${safeAddress}</p>
        <hr />
        <p><strong>Kontaktperson:</strong> ${safeName}</p>
        <p><strong>Telefon:</strong> ${safePhone}</p>
        <p><strong>E-post:</strong> ${safeEmail}</p>
        <br />
        <p><strong>Ekstra info / Melding:</strong></p>
        <p>${safeMessageHtml}</p>
      `,
    });

    if (error) {
      console.error("Resend API Error:", error);
      return NextResponse.json(
        { error: "Kunne ikke sende e-post akkurat nå. Vennligst prøv igjen." },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error("Internal API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}