import { ReactNode } from "react";

export interface EditorialSectionProps {
  id?: string;
  as?: "article" | "section";
  ariaLabel?: string;
  bg?: "light" | "sand" | "dark";
  padding?: "default" | "none";
  className?: string;
  label?: ReactNode;
  labelClassName?: string;
  title?: ReactNode;
  titleAs?: "h1" | "h2" | "h3" | "h4";
  titleSize?: "h1" | "h2" | "h3";
  titleClassName?: string;
  paragraphs?: ReactNode[];
  children?: ReactNode;
}

export default function EditorialSection({
  id,
  as: WrapperTag = "article",
  ariaLabel,
  bg = "light",
  padding = "default",
  className = "",
  label,
  labelClassName = "",
  title,
  titleAs: TitleTag = "h2",
  titleSize,
  titleClassName = "",
  paragraphs,
  children,
}: EditorialSectionProps) {
  const isDark = bg === "dark";

  const bgClasses = {
    light: "bg-brand-light",
    sand: "bg-brand-sand",
    dark: "bg-brand-dark text-brand-light",
  }[bg];

  const paddingClass =
    padding === "none" ? "" : "py-[clamp(2rem,6.5vw,5.4rem)]";

  const resolvedTitleSize =
    titleSize ?? (TitleTag === "h1" ? "h1" : TitleTag === "h3" ? "h3" : "h2");

  const titleSizeClass =
    resolvedTitleSize === "h1"
      ? "text-fluid-h1"
      : resolvedTitleSize === "h3"
        ? "text-fluid-h3"
        : "text-fluid-h2";

  const defaultLabelColor = isDark
    ? "text-brand-accent"
    : "text-brand-dark/50";

  const defaultTitleColor = isDark ? "text-brand-light" : "text-brand-dark";
  const defaultParagraphColor = isDark
    ? "text-brand-light/85"
    : "text-brand-dark/90";

  return (
    <WrapperTag
      id={id}
      aria-label={ariaLabel}
      className={`${paddingClass} ${bgClasses} ${className}`.trim()}
    >
      <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8 min-w-0">
        {label && (
          <p
            className={`text-micro uppercase m-0 mb-3 ${defaultLabelColor} ${labelClassName}`.trim()}
          >
            {label}
          </p>
        )}

        {title && (
          <TitleTag
            className={`font-heading ${titleSizeClass} mb-5 max-w-4xl ${defaultTitleColor} text-pretty ${titleClassName}`.trim()}
          >
            {title}
          </TitleTag>
        )}

        {paragraphs &&
          paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className={`text-fluid-p-lg max-w-4xl ${defaultParagraphColor} mb-5 text-pretty`}
            >
              {paragraph}
            </p>
          ))}

        {children}
      </div>
    </WrapperTag>
  );
}
