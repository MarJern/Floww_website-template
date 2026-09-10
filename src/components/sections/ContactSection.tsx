"use client";

import { useState } from "react";

export default function ContactSection() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [service, setService] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      company: formData.get("company") as string,
      email: formData.get("email") as string,
      service: formData.get("service") as string,
      message: formData.get("message") as string,
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
      setService("");
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error("Fetch error:", error);
      setStatus("error");
      setErrorMessage("Noe gikk galt. Vennligst prøv igjen eller send e-post til kontakt@flowwmedia.no.");
    }
  };

  return (
    <section id="kontakt" className="py-24 md:py-32 bg-brand-olive px-6 md:px-12" aria-labelledby="kontakt-heading">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl text-brand-dark">
          <h2 id="kontakt-heading" className="text-3xl md:text-4xl mb-8">
            La oss ta en prat!
          </h2>
          <p className="text-lg text-brand-dark/70 mb-12 text-pretty">
            Klar for å løfte din digitale tilstedeværelse? Fyll ut skjemaet nedenfor, så hører du fra oss innen 24 timer.
          </p>

          {status === "success" && (
            <div className="mb-12 p-6 border border-brand-dark bg-brand-dark/5" role="alert">
              <strong className="block text-lg mb-2">Melding mottatt</strong>
              <p className="text-brand-dark/80">Takk for henvendelsen. Vi tar kontakt med deg snart.</p>
            </div>
          )}

          {status === "error" && (
            <div className="mb-12 p-6 border border-red-500 bg-red-500/20 text-red-200" role="alert">
              <p>{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10" noValidate>
            <div className="flex flex-col">
              <label htmlFor="name" className="text-sm font-bold uppercase tracking-widest mb-2">
                Navn
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="bg-transparent border-0 border-b border-brand-dark/30 py-3 px-0 text-lg text-brand-dark focus:ring-0 focus-visible:outline-brand-light focus:border-brand-light transition-colors duration-300 placeholder-brand-dark/60"
                placeholder="Ola Nordmann"
                disabled={status === "loading"}
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="company" className="text-sm font-bold uppercase tracking-widest mb-2">
                Bedrift
              </label>
              <input
                type="text"
                id="company"
                name="company"
                required
                className="bg-transparent border-0 border-b border-brand-dark/30 py-3 px-0 text-lg text-brand-dark focus:ring-0 focus-visible:outline-brand-light focus:border-brand-light transition-colors duration-300 placeholder-brand-dark/60"
                placeholder="Acme AS"
                disabled={status === "loading"}
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="email" className="text-sm font-bold uppercase tracking-widest mb-2">
                E-post
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="bg-transparent border-0 border-b border-brand-dark/30 py-3 px-0 text-lg text-brand-dark focus:ring-0 focus-visible:outline-brand-light focus:border-brand-light transition-colors duration-300 placeholder-brand-dark/60"
                placeholder="ola@eksempel.no"
                disabled={status === "loading"}
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="service" className="text-sm font-bold uppercase tracking-widest mb-2">
                Hva trenger dere hjelp til?
              </label>
              <select
                id="service"
                name="service"
                required
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="bg-transparent border-0 border-b border-brand-dark/30 py-3 px-0 text-lg text-brand-dark focus:ring-0 focus-visible:outline-brand-light focus:border-brand-light transition-colors duration-300"
                disabled={status === "loading"}
              >
                <option value="" disabled className="bg-brand-olive text-brand-dark">
                  Velg en tjeneste...
                </option>
                <option value="Ny skreddersydd nettside" className="bg-brand-olive text-brand-dark">
                  Ny skreddersydd nettside
                </option>
                <option value="SEO & synlighet (eksisterende side)" className="bg-brand-olive text-brand-dark">
                  SEO & synlighet (eksisterende side)
                </option>
                <option value="Begge deler / Usikker" className="bg-brand-olive text-brand-dark">
                  Begge deler / Usikker
                </option>
              </select>
            </div>

            <div className="flex flex-col">
              <label htmlFor="message" className="text-sm font-bold uppercase tracking-widest mb-2">
                Hva ønsker du å oppnå?
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                className="bg-transparent border-0 border-b border-brand-dark/30 py-3 px-0 text-lg text-brand-dark focus:ring-0 focus-visible:outline-brand-light focus:border-brand-light transition-colors duration-300 resize-none placeholder-brand-dark/60"
                placeholder="Beskriv målene dine kort..."
                disabled={status === "loading"}
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex items-center justify-center bg-brand-accent text-brand-light px-10 py-5 font-bold uppercase tracking-widest text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "loading" ? "Sender..." : "Send henvendelse"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
