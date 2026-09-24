import React from "react";
import type { Metadata } from "next";
import Script from "next/script";
import Image from "next/image";
import Card, { CardHeader, CardTitle, CardContent, CardDescription, CardEyebrow } from "@/components/ui/Card";
import QuoteCard from "@/components/ui/QuoteCard";
import Button from "@/components/ui/Button";
import CtaSection from "@/components/sections/CtaSection";
import FAQSection from "@/components/sections/FAQSection";
import { SummaryList, SummaryItem } from "@/components/ui/SummaryList";

export const metadata: Metadata = {
    title: "AI-synlighet for markedsteam | Floww Media",
    description: "Hva svarer ChatGPT når kunden spør om dere? Foredrag og AI-synlighetssjekk, bygget på en audit av deres eget selskap og kategori.",
    alternates: {
        canonical: "https://flowwmedia.no/ai-seo",
    },
    openGraph: {
        title: "AI-synlighet for markedsteam | Floww Media",
        description: "Hva svarer ChatGPT når kunden spør om dere? Foredrag og AI-synlighetssjekk, bygget på en audit av deres eget selskap og kategori.",
        url: "https://flowwmedia.no/ai-seo",
        type: "website",
    },
};

const aiFaqs = [
    {
        question: "Hvilke AI-assistenter tester dere mot?",
        answer: "Vi tester mot de fem store: ChatGPT, Claude, Gemini, Copilot og Googles AI-svar. Det er dem kundene deres faktisk bruker i dag."
    },
    {
        question: "Hva trenger dere fra oss?",
        answer: "Én ting er konkurrenter i søk, det avdekker vi selv. Men vi trenger informasjon om hvem dere ser på som deres største konkurrenter og hvilke tjenester som betyr mest for dere."
    },
    {
        question: "Hvor lang tid i forkant må et foredrag bookes?",
        answer: "Auditen tar tid å gjøre ordentlig. Book gjerne to uker før samlingen, men vi kan snu oss rundt å levere å kort tid."
    },
    {
        question: "Vi har allerede et byrå. Er dette relevant?",
        answer: "Ja. AI-synlighetssjekken er uavhengig og gir dere en prioritert liste dere kan gi videre til byrået, eller bruke til å stille bedre spørsmål til dem."
    },
    {
        question: "Kan dere garantere at vi blir anbefalt?",
        answer: "Nei, og det kan ingen. Vi måler hvor dere står, viser hva som påvirker utfallet, og prioriterer arbeidet som har størst effekt."
    },
    {
        question: "AEO, GEO, AIO og SEO, hva er forskjellen?",
        answer: "<ul><li><strong>AEO (Answer Engine Optimization):</strong> Tilpasning av innhold for å bli lest opp som direktesvar i AI-søk, f.eks. Google AI-svar.</li><li><strong>GEO (Generative Engine Optimization):</strong> Optimalisering spesifikt for generative AI-motorer som ChatGPT, Claude og Copilot.</li><li><strong>AIO (AI-Optimization):</strong> Generell tilrettelegging av innhold for kunstig intelligens.</li><li><strong>SEO (Search Engine Optimization):</strong> Klassisk søkemotoroptimalisering.</li></ul><p>Vi har for enkelthets skyld valgt å samle alle disse betegnelsene under AI-søk, eller AI-SEO. Når du jobber med oss, vil vi ha fokus på å strukturere innhold og sider slik at du blir synlig på tvers av det nye AI-landskapet.</p>",
        richAnswer: (
            <div className="flex flex-col gap-6 mt-2">
                <ul className="flex flex-col gap-3 m-0 p-0 list-none">
                    <li className="flex items-start gap-3">
                        <span className="text-brand-accent mt-1 flex-shrink-0">✔</span>
                        <span><strong className="text-brand-dark">AEO (Answer Engine Optimization):</strong> Tilpasning av innhold for å bli lest opp som direktesvar i AI-søk, f.eks. Google AI-svar.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="text-brand-accent mt-1 flex-shrink-0">✔</span>
                        <span><strong className="text-brand-dark">GEO (Generative Engine Optimization):</strong> Optimalisering spesifikt for generative AI-motorer som ChatGPT, Claude og Copilot.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="text-brand-accent mt-1 flex-shrink-0">✔</span>
                        <span><strong className="text-brand-dark">AIO (AI-Optimization):</strong> Generell tilrettelegging av innhold for kunstig intelligens.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="text-brand-accent mt-1 flex-shrink-0">✔</span>
                        <span><strong className="text-brand-dark">SEO (Search Engine Optimization):</strong> Klassisk søkemotoroptimalisering.</span>
                    </li>
                </ul>
                <p className="m-0 text-brand-dark/80">
                    Vi har for enkelthets skyld valgt å samle alle disse betegnelsene under <strong>AI-søk</strong>, eller <strong>AI-SEO</strong>. Når du jobber med oss, vil vi ha fokus på å strukturere innhold og sider slik at du blir synlig på tvers av det nye AI-landskapet.
                </p>
            </div>
        )
    }
];

export default function SeoPage() {

    const schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Service",
                "name": "Foredrag om AI-søk og synlighet",
                "provider": { "@type": "ProfessionalService", "name": "Floww Media", "url": "https://flowwmedia.no/" },
                "audience": { "@type": "Audience", "audienceType": "Markedsteam" },
                "offers": { "@type": "Offer", "price": "25000", "priceCurrency": "NOK" }
            },
            {
                "@type": "Service",
                "name": "AI-synlighetssjekk",
                "provider": { "@type": "ProfessionalService", "name": "Floww Media", "url": "https://flowwmedia.no/" },
                "audience": { "@type": "Audience", "audienceType": "Markedsteam" },
                "offers": { "@type": "Offer", "price": "15000", "priceCurrency": "NOK" }
            },
            {
                "@type": "FAQPage",
                "mainEntity": aiFaqs.map(faq => ({
                    "@type": "Question",
                    "name": faq.question,
                    "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
                }))
            }
        ]
    };

    return (
        <>
            <Script id="ai-seo-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

            <section className="bg-brand-dark pt-[clamp(4rem,8vw,8rem)] pb-[clamp(4rem,6vw,6rem)] w-full">
                <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8 grid md:grid-cols-2 gap-[clamp(2.5rem,5vw,4rem)] items-center">
                    <div>
                        <p className="text-micro uppercase text-brand-accent m-0 mb-3 tracking-wider font-bold">
                            AI-synlighet
                        </p>
                        <h1 className="font-heading text-fluid-h1 text-brand-light mb-6 text-pretty">
                            Når kunden spør ChatGPT, hvem anbefaler den?
                        </h1>
                        <p className="text-fluid-p-lg text-brand-light/90 mb-8 max-w-prose text-pretty">
                            Vi måler hvordan selskapet deres fremstår i AI-svar, viser hvem som blir anbefalt i stedet, og hva som skal til for å endre det.
                        </p>
                        <div className="flex flex-wrap items-center gap-4">
                            <Button href="/kontakt">Book et foredrag</Button>
                            <a href="#tilbud" className="text-brand-accent uppercase hover:text-brand-light transition-colors text-fluid-p">
                                Eller bestill sjekken &rarr;
                            </a>
                        </div>
                    </div>

                    <div className="bg-brand-blue border border-brand-light/10 rounded-sm p-[clamp(1.5rem,3vw,2.5rem)] shadow-xl relative">
                        <div className="flex gap-3 items-start border-b border-brand-light/10 pb-4 mb-5">
                            <div className="w-8 h-8 rounded-full border-2 border-brand-accent flex items-center justify-center flex-shrink-0">
                                <span className="text-brand-accent font-bold text-xs">AI</span>
                            </div>
                            <p className="text-brand-light font-bold text-fluid-p m-0 mt-1">
                                Hvilket regnskapsbyrå bør en bedrift i Oslo velge?
                            </p>
                        </div>
                        <p className="text-brand-light/80 text-fluid-p mb-4">
                            Tre byråer går igjen i omtaler, sammenligninger og bransjelister:
                        </p>
                        <ul className="flex flex-col gap-3 m-0 p-0 list-none">
                            {['Byrå A', 'Byrå B', 'Byrå C'].map((byra, idx) => (
                                <li key={idx} className="bg-brand-dark rounded-sm p-3 flex items-center gap-3 text-brand-light font-bold text-sm">
                                    <span className="bg-brand-accent text-brand-dark w-6 h-6 rounded-full flex items-center justify-center text-xs">
                                        {idx + 1}
                                    </span>
                                    {byra}
                                </li>
                            ))}
                        </ul>
                        <p className="text-brand-light font-heading text-fluid-h3 mt-6 mb-0 text-right">
                            Er dere en av dem?
                        </p>
                    </div>
                </div>
            </section>

            <section className="bg-brand-light">
                <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8">
                    <SummaryList withBorders className="grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                        <SummaryItem label="15 år med søk">
                            og rundt 80 kunder i de fleste bransjer
                        </SummaryItem>
                        <SummaryItem label="Gull i Performance Awards">
                            for arbeidet med Bohus
                        </SummaryItem>
                    </SummaryList>
                </div>
            </section>

            <article className="py-[clamp(2.5rem,6vw,6rem)] bg-brand-light w-full">
                <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8 grid grid-cols-1 md:grid-cols-[minmax(0,7rem)_minmax(0,1fr)] gap-[clamp(1.2rem,4vw,3.2rem)] items-start">
                    <p className="text-micro uppercase text-brand-dark/50 m-0 mt-2">
                        Blindsonen
                    </p>
                    <div className="w-full">
                        <div className="max-w-2xl mb-6 md:mb-12">
                            <h2 className="font-heading text-fluid-h2 text-brand-dark mb-4 text-pretty">Det analyseverktøyene ikke viser</h2>
                            <p className="text-fluid-p-lg text-brand-dark/90 max-w-prose mb-4 text-pretty">
                                Kunden skroller ikke lenger ti blå lenker. Hen spør, og får ett svar med to eller tre navn i. Rapportene deres teller klikk fra Google, men sier ingenting om hvem som blir nevnt i det svaret.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card variant="sand" accent="left">
                                <CardHeader>
                                    <CardTitle as="h3">Valget tas før klikket</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription>Står dere ikke i svaret, kommer kunden aldri til nettsiden. Det finnes ingen trafikk å måle, og derfor merker de færreste at det skjer.</CardDescription>
                                </CardContent>
                            </Card>
                            <Card variant="sand" accent="left">
                                <CardHeader>
                                    <CardTitle as="h3">Det er ikke tilfeldig</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription>Assistentene henter fra kilder som kan identifiseres, og de anbefaler selskaper de har tydelige data om. Det kan påvirkes.</CardDescription>
                                </CardContent>
                            </Card>
                            <Card variant="sand" accent="left">
                                <CardHeader>
                                    <CardTitle as="h3">Forspranget tas nå</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription>Det samme skjedde i søk for femten år siden. De som ryddet tidlig ble stående i årevis, mens de som ventet betalte for plassene.</CardDescription>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </article>

            <article id="tilbud" className="py-[clamp(2.5rem,6vw,6rem)] bg-brand-sand w-full">
                <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8 grid grid-cols-1 md:grid-cols-[minmax(0,7rem)_minmax(0,1fr)] gap-[clamp(1.2rem,4vw,3.2rem)] items-start">
                    <p className="text-micro uppercase text-brand-dark/50 m-0 mt-2">
                        Tjenester
                    </p>
                    <div className="w-full">
                        <div className="max-w-2xl mb-6 md:mb-12">
                            <h2 className="font-heading text-fluid-h2 text-brand-dark mb-4 text-pretty">To måter å komme i gang</h2>
                            <p className="text-fluid-p-lg text-brand-dark/90 max-w-prose mb-4 text-pretty">
                                Foredraget gir hele markedsavdelingen det samme bildet på én time. Sjekken gir dere funnene skriftlig, som noe dere kan jobbe etter og måle mot.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                            <Card variant="light" className="border-t-[4px] border-brand-pine rounded-t-none">
                                <CardHeader>
                                    <CardEyebrow>For fagsamlinger og ledermøter</CardEyebrow>
                                    <CardTitle as="h3" className="!text-fluid-h2 break-words hyphens-auto">Foredrag om AI-søk</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="font-heading text-fluid-h3 text-brand-pine mb-6">
                                        25 000 kr <span className="text-fluid-p text-brand-dark/50 font-body font-normal">/ 60 minutter</span>
                                    </div>
                                    <ul className="flex flex-col gap-3 mb-8">
                                        {['Audit av selskapet og kategorien i forkant', 'Salen ser egne tall og egne konkurrenter', 'Quick wins og prioriteringer, gjennomgått i rommet', 'Kan tilpasses til 30 eller 45 minutter'].map((item, i) => (
                                            <li key={i} className="flex gap-3 text-brand-dark text-fluid-p items-start">
                                                <span className="text-brand-pine mt-1">✔</span> <span className="text-pretty">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Button href="/kontakt">Book et foredrag</Button>
                                </CardContent>
                            </Card>

                            <Card variant="dark" className="border-t-[4px] border-brand-accent rounded-t-none">
                                <CardHeader>
                                    <CardEyebrow>For avdelingen som vil ha det skriftlig</CardEyebrow>
                                    <CardTitle as="h3" className="!text-fluid-h2 break-words hyphens-auto">AI-synlighetssjekk</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="font-heading text-fluid-h3 text-brand-accent mb-6">
                                        15 000 kr <span className="text-fluid-p text-brand-light/60 font-body font-normal">/ 5 virkedager</span>
                                    </div>
                                    <ul className="flex flex-col gap-3 mb-8">
                                        {['Kjøpsspørsmålene kjørt mot fire AI-assistenter', 'Hvem som anbefales i stedet, og kildene', 'Prioritert handlingsplan, quick wins først', '45 minutters gjennomgang inkludert'].map((item, i) => (
                                            <li key={i} className="flex gap-3 text-brand-light/90 text-fluid-p items-start">
                                                <span className="text-brand-accent mt-1">✔</span> <span className="text-pretty">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Button href="/kontakt" variant="outline">Bestill sjekken</Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </article>

            <article className="py-[clamp(2.5rem,6vw,6rem)] bg-brand-light w-full">
                <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8 grid grid-cols-1 md:grid-cols-[minmax(0,7rem)_minmax(0,1fr)] gap-[clamp(1.2rem,4vw,3.2rem)] items-start">
                    <p className="text-micro uppercase text-brand-dark/50 m-0 mt-2">
                        Fagekspert
                    </p>
                    <div className="grid md:grid-cols-[1fr_1.5fr] gap-6 md:gap-12 items-start w-full">
                        <Image
                            src="/images/Simen.jpg"
                            alt="Simen Russ"
                            width={720}
                            height={720}
                            className="w-full aspect-square object-cover rounded-sm shadow-sm object-[center_15%]"
                        />
                        <div>
                            <h2 className="font-heading text-fluid-h2 text-brand-dark mb-4">Simen Russ</h2>
                            <p className="text-fluid-p-lg text-brand-dark/90 max-w-prose mb-4 text-pretty">
                                Senior SEO-konsulent i femten år, for rundt 80 kunder. Nylig leid inn av Transact som fagekspert på akkurat det dette handler om.
                            </p>

                            <QuoteCard bg="sand" className="mb-8">
                                <strong>Én ting jeg ikke lover:</strong> Jeg lover aldri en plassering i et AI-svar. Ingen kontrollerer hva en språkmodell siterer. Det jeg jobber med er fundamentene som faktisk avgjør utfallet: tydelig entitet, strukturerte data, og innhold som svarer direkte på kjøpsspørsmålene.
                            </QuoteCard>

                            <ul className="flex flex-col border-t border-brand-dark/10 mb-8">
                                <li className="flex flex-col sm:flex-row sm:justify-between py-4 border-b border-brand-dark/10 gap-1 sm:gap-4">
                                    <strong className="text-brand-dark text-fluid-p">AI-synlighet</strong>
                                    <span className="text-brand-blue text-fluid-p text-left sm:text-right">Volkswagen og Obs Bygg (Transact)</span>
                                </li>
                                <li className="flex flex-col sm:flex-row sm:justify-between py-4 border-b border-brand-dark/10 gap-1 sm:gap-4">
                                    <strong className="text-brand-dark text-fluid-p">Internasjonalt</strong>
                                    <span className="text-brand-blue text-fluid-p text-left sm:text-right">Red Bull, Under Armour, J&amp;J</span>
                                </li>
                                <li className="flex flex-col sm:flex-row sm:justify-between py-4 border-b border-brand-dark/10 gap-1 sm:gap-4">
                                    <strong className="text-brand-dark text-fluid-p">I Norge</strong>
                                    <span className="text-brand-blue text-fluid-p text-left sm:text-right">Bohus, Vitus Apotek, Løplabbet</span>
                                </li>
                            </ul>

                            <Button href="/om-oss#simen">
                                Les mer om Simen
                            </Button>

                        </div>
                    </div>
                </div>
            </article>

            <article id="sporsmal" className="py-[clamp(2.5rem,6vw,6rem)] bg-brand-sand w-full">
                <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8 grid grid-cols-1 md:grid-cols-[minmax(0,7rem)_minmax(0,1fr)] gap-[clamp(1.2rem,4vw,3.2rem)] items-start">
                    <p className="text-micro uppercase text-brand-dark/50 m-0 mt-2">
                        FAQ
                    </p>
                    <div className="w-full max-w-3xl">
                        <h2 className="font-heading text-fluid-h2 text-brand-dark mb-8">Spørsmål vi ofte får</h2>

                        <div className="flex flex-col border-t border-brand-dark/10">
                            {aiFaqs.map((faq, i) => (
                                <details key={i} className="group border-b border-brand-dark/10 py-5 cursor-pointer">
                                    <summary className="flex justify-between items-center font-heading text-fluid-h4 text-brand-dark font-bold list-none">
                                        {faq.question}
                                        <span className="transition-transform duration-300 group-open:rotate-180 text-brand-pine ml-4 flex-shrink-0">
                                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                            </svg>
                                        </span>
                                    </summary>
                                    <div className="mt-4">
                                        {faq.richAnswer ? (
                                            faq.richAnswer
                                        ) : (
                                            <p className="text-fluid-p-lg text-brand-blue m-0 text-pretty">
                                                {faq.answer}
                                            </p>
                                        )}
                                    </div>
                                </details>
                            ))}
                        </div>
                    </div>
                </div>
            </article>

            <CtaSection bg="light" />

        </>
    );
}