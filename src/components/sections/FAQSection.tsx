import React from "react";

export interface FAQItem {
  question: string;
  answer: string;
  richAnswer?: React.ReactNode;
}

export default function FAQSection({ faqs }: { faqs: FAQItem[] }) {
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
    <section id="faq" className="w-full bg-brand-light py-24 md:py-32" aria-labelledby="faq-heading">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 id="faq-heading" className="text-fluid-h2 tracking-tight leading-tight mb-16 text-center text-brand-dark">
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
                      className="absolute inset-0 h-5 w-5 transition-transform duration-300 group-open:rotate-180 motion-reduce:transition-none"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </span>
                </summary>
                <div className="mt-4 text-brand-dark/70 text-lg leading-relaxed text-pretty md:pr-12">
                  {/* 2. Hvis richAnswer finnes, bruk den. Hvis ikke, bruk vanlig tekst. */}
                  {faq.richAnswer ? faq.richAnswer : faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}