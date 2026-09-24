import React from 'react';

export interface StatCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  children: React.ReactNode;
  variant?: "light" | "dark";
  accent?: "left" | "none";
  size?: "sm" | "md" | "lg";
}

export default function StatCard({
  title,
  children,
  variant = "light",
  accent = "none",
  size = "md",
  className = "",
  ...props
}: StatCardProps) {
  const isDark = variant === "dark";

  const baseClasses = "flex flex-col justify-center rounded-sm shadow-sm p-[clamp(1.5rem,2vw,2rem)] transition-colors";
  const variantClasses = isDark ? "bg-brand-blue" : "bg-brand-light";
  const accentClasses = accent === "left" ? "border-l-[4px] border-brand-accent rounded-l-none" : "";


  const titleSize =
    size === "lg" ? "text-fluid-h2" :
      size === "md" ? "text-fluid-h3" :
        "text-fluid-p-lg";

  const titleColor = isDark ? 'text-brand-light' : 'text-brand-blue';
  const textColor = isDark ? 'text-brand-light' : 'text-brand-dark/70';

  return (
    <div className={`${baseClasses} ${variantClasses} ${accentClasses} ${className}`.trim().replace(/\s+/g, ' ')} {...props}>
      <div className={`font-heading font-bold mb-2 leading-none ${titleSize} ${titleColor}`}>
        {title}
      </div>
      <div className={`text-fluid-p text-pretty m-0 ${textColor}`}>
        {children}
      </div>
    </div>
  );
}