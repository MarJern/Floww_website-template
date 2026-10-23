import React, { ElementType } from "react";
import Link from "next/link";

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "light" | "dark" | "sand";
  accent?: "none" | "top" | "left";
  interactive?: boolean;
  as?: ElementType | string;
  href?: string;
}

export default function Card({
  children,
  className = "",
  variant = "light",
  accent = "none",
  interactive = false,
  as: Component = "div",
  href,
  ...props
}: CardProps) {
  const baseStyles =
    "group/card flex flex-col relative overflow-hidden rounded-sm p-[clamp(1.5rem,2vw,2rem)] h-full shadow-sm";

  const variants = {
    light: "bg-brand-light",
    dark: "bg-brand-dark",
    sand: "bg-brand-sand",
  };

  const accents = {
    none: "",
    top: "border-t-[4px] border-brand-accent rounded-t-none",
    left: "border-l-[4px] border-brand-accent rounded-l-none",
  };

  const interactiveStyles = interactive
    ? "group hover:-translate-y-1 hover:shadow-md transition-all duration-300 cursor-pointer"
    : "";

  const finalClassName = `${baseStyles} ${variants[variant]} ${accents[accent]} ${interactiveStyles} ${className}`
    .trim()
    .replace(/\s+/g, " ");

  if (href) {
    return (
      <Link
        href={href}
        data-variant={variant}
        className={finalClassName}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </Link>
    );
  }

  return (
    <Component data-variant={variant} className={finalClassName} {...props}>
      {children}
    </Component>
  );
}

export function CardHeader({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`flex flex-col gap-1.5 mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardEyebrow({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={`text-micro font-bold uppercase opacity-90 mb-2 text-brand-pine group-data-[variant=dark]/card:text-brand-accent ${className}`}
      {...props}
    >
      {children}
    </p>
  );
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: ElementType;
}

export function CardTitle({
  className = "",
  as: Component = "h3",
  children,
  ...props
}: CardTitleProps) {
  return (
    <Component
      className={`font-heading text-fluid-h3 m-0 transition-colors text-brand-dark group-data-[variant=dark]/card:text-brand-light group-hover:text-brand-pine group-data-[variant=dark]/card:group-hover:text-brand-accent break-words hyphens-auto ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

export function CardDescription({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={`text-fluid-p m-0 text-pretty text-brand-dark/80 group-data-[variant=dark]/card:text-brand-light/90 ${className}`}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`flex-grow ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mt-auto pt-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardAction({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`flex items-center gap-3 text-brand-pine group-data-[variant=dark]/card:text-brand-accent font-bold ${className}`}
      {...props}
    >
      {children}
      <i
        className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:transform-none"
        aria-hidden="true"
      >
        &rarr;
      </i>
    </div>
  );
}