"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "../ui/Card";

export default function ContactSection() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      name: (formData.get("navn") as string)?.trim(),
      company: (formData.get("company") as string)?.trim(),
      address: (formData.get("adresse") as string)?.trim(),
      email: (formData.get("epost") as string)?.trim(),
      phone: (formData.get("telefon") as string)?.trim(),
      message: (formData.get("melding") as string)?.trim(),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errPayload = await response.json().catch(() => null);
        throw new Error(
          errPayload?.error ||
            "Noe gikk galt. Vennligst prøv igjen eller send e-post til kontakt@flowwmedia.no."
        );
      }

      setStatus("success");
      form.reset();
    } catch (error) {
      console.error("Fetch error:", error);
      setStatus("error");
      setErrorMessage(
        error instanceof Error && error.message
          ? error.message
          : "Noe gikk galt. Vennligst prøv igjen eller send e-post til kontakt@flowwmedia.no."
      );
    }
  };

  return (
    <section id="kontakt" className="w-full bg-brand-light pb-[clamp(3rem,6.5vw,5.4rem)] text-brand-dark">
      <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8">

        <Card variant="dark" className="border border-brand-light/10 shadow-sm">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            {/* Rad 1: Navn og Bedrift */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="navn" className="text-micro font-medium text-brand-light">Navn</label>
                <input
                  type="text"
                  id="navn"
                  name="navn"
                  autoComplete="name"
                  disabled={status === "loading"}
                  className="w-full bg-brand-light/5 border border-brand-light/20 rounded-sm px-4 py-3 text-brand-light placeholder:text-brand-light/30 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-colors disabled:opacity-50"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="company" className="text-micro font-medium text-brand-light">Bedrift</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  autoComplete="organization"
                  disabled={status === "loading"}
                  className="w-full bg-brand-light/5 border border-brand-light/20 rounded-sm px-4 py-3 text-brand-light placeholder:text-brand-light/30 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-colors disabled:opacity-50"
                  required
                />
              </div>
            </div>

            {/* Rad 2: Adresse */}
            <div className="flex flex-col gap-2">
              <label htmlFor="adresse" className="text-micro font-medium text-brand-light">Adresse (valgfritt)</label>
              <input
                type="text"
                id="adresse"
                name="adresse"
                autoComplete="street-address"
                disabled={status === "loading"}
                className="w-full bg-brand-light/5 border border-brand-light/20 rounded-sm px-4 py-3 text-brand-light placeholder:text-brand-light/30 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-colors disabled:opacity-50"
              />
              <p className="text-micro text-brand-light/50 m-0 mt-1">
                Gateadresse og postnummer.
              </p>
            </div>

            {/* Rad 3: E-post og Telefon */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="epost" className="text-micro font-medium text-brand-light">E-post</label>
                <input
                  type="email"
                  id="epost"
                  name="epost"
                  autoComplete="email"
                  disabled={status === "loading"}
                  className="w-full bg-brand-light/5 border border-brand-light/20 rounded-sm px-4 py-3 text-brand-light placeholder:text-brand-light/30 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-colors disabled:opacity-50"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="telefon" className="text-micro font-medium text-brand-light">Telefon</label>
                <input
                  type="tel"
                  id="telefon"
                  name="telefon"
                  autoComplete="tel"
                  disabled={status === "loading"}
                  className="w-full bg-brand-light/5 border border-brand-light/20 rounded-sm px-4 py-3 text-brand-light placeholder:text-brand-light/30 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-colors disabled:opacity-50"
                  required
                />
              </div>
            </div>

            {/* Rad 4: Valgfritt felt */}
            <div className="flex flex-col gap-2">
              <label htmlFor="melding" className="text-micro font-medium text-brand-light">Noe vi bør vite? (valgfritt)</label>
              <textarea
                id="melding"
                name="melding"
                rows={4}
                disabled={status === "loading"}
                className="w-full bg-brand-light/5 border border-brand-light/20 rounded-sm px-4 py-3 text-brand-light placeholder:text-brand-light/30 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-colors resize-y disabled:opacity-50"
              ></textarea>
            </div>

            {/* Knapp og personverninfo */}
            <div className="mt-2 flex flex-col gap-3">
              <div>
                <Button type="submit" disabled={status === "loading"} className="w-full sm:w-auto">
                  {status === "loading" ? "Sender..." : "Send skjema"}
                </Button>
              </div>
              <p className="text-micro text-brand-light/60 m-0">
                Opplysningene brukes kun til å besvare henvendelsen deres. Les vår{" "}
                <Link href="/personvern" className="underline text-brand-light/80 hover:text-brand-accent transition-colors">
                  personvernerklæring
                </Link>
                .
              </p>
            </div>
          </form>
        </Card>

        {status === "success" && (
          <div className="mt-8 p-6 border-l-[4px] border-brand-pine bg-brand-sand rounded-sm" role="alert">
            <strong className="block text-lg mb-2 text-brand-pine font-heading">Melding mottatt</strong>
            <p className="text-brand-dark/80 max-w-prose m-0">Takk for henvendelsen. Vi tar en kikk og kontakter dere snart.</p>
          </div>
        )}

        {status === "error" && (
          <div className="mt-8 p-6 border-l-[4px] border-brand-rust bg-brand-sand text-brand-dark font-medium rounded-sm" role="alert">
            <p className="m-0">{errorMessage}</p>
          </div>
        )}

      </div>
    </section>
  );
}