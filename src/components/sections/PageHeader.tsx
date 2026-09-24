import React from "react";
interface PageHeaderProps {
    title: React.ReactNode;
    description?: React.ReactNode;
    label?: string; // Den lille grønne teksten over tittelen (f.eks. "Artikkel" eller "Tjenester")
}

export default function PageHeader({ title, description, label }: PageHeaderProps) {
    return (
        <header className="bg-brand-dark pt-[clamp(4rem,6vw,5rem)] pb-[clamp(2rem,4vw,3rem)]">
            <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8">

                {label && (
                    <p className="text-micro uppercase text-brand-accent mb-4 font-bold">
                        {label}
                    </p>
                )}

                <h1 className="font-heading text-fluid-h2 text-brand-light mb-6 max-w-[20ch]">
                    {title}
                </h1>

                {description && (
                    <p className="text-fluid-p-lg text-brand-light/80 max-w-prose text-pretty">
                        {description}
                    </p>
                )}

            </div>
        </header>
    );
}