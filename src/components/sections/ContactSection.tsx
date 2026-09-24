"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "../ui/Card";

export default function ContactSection() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("navn") as string,
      company: formData.get("klinikk") as string,
      address: formData.get("adresse") as string,
      email: formData.get("epost") as string,
      phone: formData.get("telefon") as string,
      message: formData.get("melding") as string,
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
        throw new Error("Failed to send message.");
      }

      setStatus("success");
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error("Fetch error:", error);
      setStatus("error");
      setErrorMessage("Noe gikk galt. Vennligst prøv igjen eller send e-post til kontakt@flowwmedia.no.");
    }
  };

  return (
    <section id="kontakt" className="w-full bg-brand-light py-[clamp(3rem,6.5vw,5.4rem)] text-brand-dark">
      <div className="mx-auto max-w-3xl w-full px-4 sm:px-6 md:px-8">

        <Card variant="dark" className="border border-brand-light/10 shadow-sm mb-12">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>

            {/* Rad 1: Navn og Klinikk */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="navn" className="text-micro font-medium text-brand-light">Navn</label>
                <input
                  type="text"
                  id="navn"
                  name="navn"
                  disabled={status === "loading"}
                  className="w-full bg-brand-light/5 border border-brand-light/20 rounded-sm px-4 py-3 text-brand-light placeholder:text-brand-light/30 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-colors disabled:opacity-50"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="klinikk" className="text-micro font-medium text-brand-light">Klinikk</label>
                <input
                  type="text"
                  id="klinikk"
                  name="klinikk"
                  disabled={status === "loading"}
                  className="w-full bg-brand-light/5 border border-brand-light/20 rounded-sm px-4 py-3 text-brand-light placeholder:text-brand-light/30 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-colors disabled:opacity-50"
                  required
                />
              </div>
            </div>

            {/* Rad 2: Adresse */}
            <div className="flex flex-col gap-2">
              <label htmlFor="adresse" className="text-micro font-medium text-brand-light">Adresse</label>
              <input
                type="text"
                id="adresse"
                name="adresse"
                disabled={status === "loading"}
                className="w-full bg-brand-light/5 border border-brand-light/20 rounded-sm px-4 py-3 text-brand-light placeholder:text-brand-light/30 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-colors disabled:opacity-50"
                required
              />
              <p className="text-micro text-brand-light/50 m-0 mt-1">
                Gateadresse og postnummer. Vi søker fra deres adresse, ikke fra vår.
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

            {/* Knapp */}
            <div className="mt-2">
              <Button type="submit" disabled={status === "loading"} className="w-full sm:w-auto">
                {status === "loading" ? "Sender..." : "Send skjema"}
              </Button>
            </div>
          </form>
        </Card>

        {/* Suksess / Feil-meldinger forblir uendret */}
        {status === "success" && (
          <div className="mb-10 p-6 border border-brand-accent/50 bg-brand-accent/10 rounded-sm" role="alert">
            <strong className="block text-lg mb-2 text-brand-pine font-heading">Melding mottatt</strong>
            <p className="text-brand-dark/80 max-w-prose m-0">Takk for henvendelsen. Vi tar en kikk og kontakter deg snart.</p>
          </div>
        )}

        {status === "error" && (
          <div className="mb-10 p-6 border border-red-500/50 bg-red-500/10 text-red-200 rounded-sm" role="alert">
            <p className="m-0">{errorMessage}</p>
          </div>
        )}

        {/* Footer Info (Sentert under skjemaet) */}
        <div className="border-t border-brand-dark/10 pt-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <p className="text-micro uppercase text-brand-dark/50 mb-2 font-bold tracking-[0.15em]">E-post</p>
              <a href="mailto:kontakt@flowwmedia.no" className="text-fluid-p-lg underline decoration-brand-accent/40 text-brand-dark hover:text-brand-pine transition-colors font-heading font-medium">
                kontakt@flowwmedia.no
              </a>
            </div>
            <div>
              <p className="text-micro uppercase text-brand-dark/50 mb-2 font-bold tracking-[0.15em]">Telefon</p>
              <a href="tel:45843554" className="text-fluid-p-lg underline decoration-brand-accent/40 text-brand-dark hover:text-brand-pine transition-colors font-heading font-medium">
                +47 458 43 554
              </a>
            </div>
            <div>
              <p className="text-micro uppercase text-brand-dark/50 mb-2 font-bold tracking-[0.15em]">Adresse</p>
              <p className="text-fluid-p-lg text-brand-dark font-heading font-medium m-0">
                Edvard Storms gate 2, Oslo
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}