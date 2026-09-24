import Button from "@/components/ui/Button";

export default function AiTeaserSection() {
    return (
        <section className="py-[clamp(4rem,8vw,8rem)] bg-brand-dark" aria-label="AI-SEO og Synlighet">
            <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8 grid grid-cols-1 md:grid-cols-[minmax(0,7rem)_minmax(0,1fr)] gap-[clamp(1.2rem,4vw,3.2rem)] items-start">

                {/* Eyebrow: Beholder vi som en sterk <p> */}
                <p className="text-micro uppercase text-brand-rust m-0 mt-2 font-bold tracking-wider">
                    AI-SEO & AI-søk
                </p>

                <div className="w-full">
                    {/* Endret fra h2 til h3 for perfekt semantikk */}
                    <h3 className="font-heading text-fluid-h2 mb-5 text-brand-light text-pretty">
                        Er dere synlige når kunden spør AI?
                    </h3>

                    <p className="text-fluid-p-lg text-brand-light/80 max-w-prose mb-5 text-pretty">
                        Kunden skroller ikke lenger forbi ti blå lenker. De stiller et spørsmål til assistenten, og får ett fasitsvar. Vi hjelper markedsteam med å forstå og dominere det nye AI-landskapet før konkurrentene gjør det.
                    </p>

                    <p className="text-fluid-p-lg text-brand-light/80 max-w-prose mb-10 text-pretty">
                        Se hvem ChatGPT faktisk anbefaler i deres bransje, og få en konkret handlingsplan for hvordan dere vinner posisjonen.
                    </p>

                    <div className="flex flex-wrap items-center gap-4">
                        <Button href="/ai-seo">
                            Les mer om tjenesten
                        </Button>
                    </div>
                </div>

            </div>
        </section>
    );
}