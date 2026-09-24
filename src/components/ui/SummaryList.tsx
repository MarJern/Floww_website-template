import React from "react";

interface SummaryListProps extends React.HTMLAttributes<HTMLDListElement> {
    children: React.ReactNode;
    withBorders?: boolean; // Smart prop for å slå av og på strekene oppe og nede!
}

export function SummaryList({ children, withBorders = false, className = "", ...props }: SummaryListProps) {
    return (
        <dl
            className={`grid py-8 ${withBorders ? "border-y border-brand-dark/10" : ""} ${className}`}
            {...props}
        >
            {children}
        </dl>
    );
}

interface SummaryItemProps extends React.HTMLAttributes<HTMLDivElement> {
    label: string;
    children: React.ReactNode;
}

export function SummaryItem({ label, children, className = "", ...props }: SummaryItemProps) {
    return (
        <div className={`flex flex-col items-start ${className}`} {...props}>
            <dt className="text-micro uppercase text-brand-dark/50 mb-1">{label}</dt>
            <dd className="text-fluid-p text-brand-dark font-medium">{children}</dd>
        </div>
    );
}