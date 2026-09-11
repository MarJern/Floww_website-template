const faqs = [
  {
    question: "Hvor lang tid tar det å bygge en nettside?",
    answer: "Normalt tar et standard nettsideprosjekt mellom 4 til 8 uker fra oppstartsmøte til lansering. Dette avhenger av prosjektets kompleksitet, antall sider og hvor raskt vi får innhold fra deg."
  },
  {
    question: "Hva koster en skreddersydd plattform?",
    answer: "Prisen varierer basert på funksjonalitet, designkrav og integrasjoner. Siden vi ikke bruker ferdige maler, men bygger alt fra bunnen av for optimal ytelse og SEO, starter våre prosjekter typisk på 30 000 NOK. Ta kontakt for et nøyaktig estimat for ditt prosjekt."
  },
  {
    question: "Tilbyr dere vedlikehold?",
    answer: "Ja, vi tilbyr faste vedlikeholdsavtaler der vi tar oss av hosting, sikkerhetsoppdateringer, overvåking og mindre justeringer, slik at du kan fokusere på din egen drift."
  }
];

export default function FAQSection() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };

  return (
    <section id="faq" className="py-24 md:py-32 bg-brand-light px-6 md:px-12" aria-labelledby="faq-heading">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-3xl mx-auto">
        <h2 id="faq-heading" className="text-3xl md:text-4xl lg:text-5xl tracking-tighter mb-16 text-center text-brand-dark">
          Ofte stilte spørsmål
        </h2>
        
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <details 
              key={index} 
              className="group border-b border-brand-dark/20 pb-6 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between text-xl font-bold text-brand-dark focus-visible:outline-brand-accent focus-visible:outline-2 focus-visible:outline-offset-4 rounded-sm">
                <span>{faq.question}</span>
                <span className="relative ml-4 h-5 w-5 flex-shrink-0">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth={2} 
                    stroke="currentColor" 
                    className="absolute inset-0 h-5 w-5 transition-transform duration-300 group-open:rotate-180"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </span>
              </summary>
              <div className="mt-4 text-brand-dark/70 text-lg leading-relaxed text-pretty md:pr-12">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
