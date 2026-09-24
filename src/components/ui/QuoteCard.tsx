import React from 'react';

export interface QuoteCardProps {
  children: React.ReactNode;
  className?: string;
  bg?: "light" | "sand" | "subtle";
}

export default function QuoteCard({
  children,
  className = "",
  bg = "subtle"
}: QuoteCardProps) {

  const baseStyles = "not-prose border-l-[3px] border-brand-pine p-6 sm:p-7 shadow-sm rounded-r-sm font-medium leading-[1.6] text-brand-dark/80 text-pretty";

  const bgStyles = {
    light: "bg-brand-light",
    sand: "bg-brand-sand",
    subtle: "bg-brand-dark/5"
  };

  return (
    <div className={`${baseStyles} ${bgStyles[bg]} ${className}`}>
      <div className="quote-card-content [&_strong]:font-bold [&_strong]:text-brand-dark">
        {children}
      </div>
    </div>
  );
}