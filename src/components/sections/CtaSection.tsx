import Button from "@/components/ui/Button";
import React from "react";

// 1. Definerer hvilke props (tekster og farger) som er lov å sende inn
export interface CtaSectionProps {
    bg?: "sand" | "light";
    label?: React.ReactNode;
    title?: React.ReactNode;
    description?: React.ReactNode;
    buttonText?: string;
    buttonHref?: string;
}

export default function CtaSection({
    bg = "sand",
    // Standardverdier (fallback) slik at ingenting krasjer på gamle sider
    label = "Regnestykket",
    title = "Analysen koster ingenting.",
    description = "Vi søker opp virksomheten fra deres egen adresse, ser hvem som ligger over dere, og går gjennom hovedfunnene i en kort samtale. Da vet vi om en ny nettside i det hele tatt er svaret, før dere har betalt for noe.",
    buttonText = "Få en gratis audit",
    buttonHref = "/#kontakt"
}: CtaSectionProps) {

    const bgClass = bg === "light" ? "bg-brand-light" : "bg-brand-sand";

    return (
        <section className={`w-full py-[clamp(3rem,6vw,5rem)] ${bgClass}`}>
            <div className="mx-auto max-w-4xl w-full px-4 sm:px-6 md:px-8">

                <div className="bg-brand-dark p-[clamp(2rem,5vw,4rem)] rounded-sm shadow-sm">

                    {label && (
                        <p className="text-micro uppercase text-brand-light/50 m-0 mb-2 font-bold">
                            {label}
                        </p>
                    )}

                    {title && (
                        <h2 className="font-heading text-fluid-h3 text-brand-light m-0 leading-tight">
                            {title}
                        </h2>
                    )}

                    {description && (
                        <p className="text-fluid-p-lg text-brand-light/80 my-8 max-w-2xl text-pretty">
                            {description}
                        </p>
                    )}

                    {(buttonText && buttonHref) && (
                        <Button href={buttonHref}>
                            {buttonText}
                        </Button>
                    )}

                </div>

            </div>
        </section>
    );
}