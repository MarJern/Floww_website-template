import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, company, email, service, message } = body;

    if (!name || !email || !message || !service) {
      return NextResponse.json(
        { error: "Name, email, service, and message are required." },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: "Floww Media Leads <onboarding@resend.dev>",
      to: "kontakt@flowwmedia.no",
      replyTo: email,
      subject: `Ny forespørsel fra ${name}`,
      html: `
        <h2>Ny forespørsel fra nettsiden</h2>
        <p><strong>Tjeneste ønsket:</strong> ${service}</p>
        <p><strong>Navn:</strong> ${name}</p>
        <p><strong>Bedrift:</strong> ${company || "Ikke oppgitt"}</p>
        <p><strong>E-post:</strong> ${email}</p>
        <p><strong>Prosjekt / Mål:</strong></p>
        <p>${message}</p>
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
