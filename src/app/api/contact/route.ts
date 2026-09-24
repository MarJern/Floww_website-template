import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, company, address, email, phone, message } = body;

    // Sjekker at alle påkrevde felt fra det nye skjemaet er med. (message er valgfritt)
    if (!name || !company || !address || !email || !phone) {
      return NextResponse.json(
        { error: "Navn, klinikk, adresse, e-post og telefon er påkrevd." },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: "Floww Media Leads <onboarding@resend.dev>",
      to: "kontakt@flowwmedia.no",
      replyTo: email,
      subject: `Ny forespørsel om SEO-audit fra ${company}`,
      html: `
        <h2>Ny forespørsel om gratis audit</h2>
        <p><strong>Klinikk:</strong> ${company}</p>
        <p><strong>Adresse for audit:</strong> ${address}</p>
        <hr />
        <p><strong>Kontaktperson:</strong> ${name}</p>
        <p><strong>Telefon:</strong> ${phone}</p>
        <p><strong>E-post:</strong> ${email}</p>
        <br />
        <p><strong>Ekstra info / Melding:</strong></p>
        <p>${message ? message.replace(/\n/g, '<br/>') : "<em>Ingen ekstra info oppgitt.</em>"}</p>
      `,
    });

    if (error) {
      console.error("Resend API Error:", error);
      return NextResponse.json({ error }, { status: 400 });
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