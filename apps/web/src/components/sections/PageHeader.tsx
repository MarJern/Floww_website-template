import React from "react";
import Link from "next/link";

export interface BreadcrumbItem {
  name: string;
  href?: string;
}

export interface PageHeaderProps {
  title: React.ReactNode;
  titleAs?: "h1" | "h2" | "h3" | "h4";
  titleSize?: "h1" | "h2" | "h3";
  bg?: "dark" | "light" | "sand";
  description?: React.ReactNode;
  label?: string;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
  children?: React.ReactNode;
}

export default function PageHeader({
  title,
  titleAs: TitleTag = "h1",
  titleSize,
  bg = "dark",
  description,
  label,
  breadcrumbs,
  className = "",
  children,
}: PageHeaderProps) {
  const resolvedBreadcrumbs: BreadcrumbItem[] =
    breadcrumbs !== undefined
      ? breadcrumbs
      : label
        ? [{ name: "Hjem", href: "/" }, { name: label }]
        : [];

  const isDark = bg === "dark";

  const sectionBgClass =
    bg === "light"
      ? "bg-brand-light text-brand-dark border-b border-brand-dark/10"
      : bg === "sand"
        ? "bg-brand-sand text-brand-dark border-b border-brand-dark/10"
        : "bg-brand-dark text-brand-light border-b border-brand-light/10";

  const resolvedSize =
    titleSize ?? (TitleTag === "h2" ? "h2" : TitleTag === "h3" ? "h3" : "h1");

  const titleSizeClass =
    resolvedSize === "h2"
      ? "text-fluid-h2"
      : resolvedSize === "h3"
        ? "text-fluid-h3"
        : "text-fluid-h1";

  const titleColorClass = isDark ? "text-brand-light" : "text-brand-dark";
  const descriptionColorClass = isDark
    ? "text-brand-light/85 [&_strong]:text-brand-light"
    : "text-brand-dark/85 [&_strong]:text-brand-dark";

  const hasCustomPt = /\b(pt-|py-|p-)/.test(className);
  const hasCustomPb = /\b(pb-|py-|p-)/.test(className);
  const defaultPaddingClass = `${hasCustomPt ? "" : "pt-10"} ${
    hasCustomPb ? "" : "pb-20 md:pb-28"
  }`.trim();

  return (
    <section
      aria-label="Sidehode"
      className={`${sectionBgClass} ${defaultPaddingClass} ${className}`.trim()}
    >
      <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8 flex flex-col gap-6">
        {resolvedBreadcrumbs.length > 0 && (
          <nav
            aria-label="Breadcrumb"
            className={`text-micro uppercase tracking-wider ${
              isDark ? "text-brand-light/60" : "text-brand-blue"
            }`}
          >
            <ol className="flex flex-wrap items-center gap-2 list-none m-0 p-0">
              {resolvedBreadcrumbs.map((crumb, idx) => {
                const isLast = idx === resolvedBreadcrumbs.length - 1;
                return (
                  <React.Fragment key={`${crumb.name}-${idx}`}>
                    {idx > 0 && (
                      <li aria-hidden="true" className="select-none">
                        /
                      </li>
                    )}
                    <li>
                      {crumb.href && !isLast ? (
                        <Link
                          href={crumb.href}
                          className={
                            isDark
                              ? "hover:text-brand-light transition-colors"
                              : "hover:text-brand-dark transition-colors"
                          }
                        >
                          {crumb.name}
                        </Link>
                      ) : (
                        <span
                          className={
                            isLast
                              ? isDark
                                ? "text-brand-accent"
                                : "text-brand-pine font-bold"
                              : ""
                          }
                          aria-current={isLast ? "page" : undefined}
                        >
                          {crumb.name}
                        </span>
                      )}
                    </li>
                  </React.Fragment>
                );
              })}
            </ol>
          </nav>
        )}

        <div className="max-w-4xl flex flex-col gap-6 items-start">
          {label && (
            <div
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-sm text-micro uppercase tracking-widest ${
                isDark
                  ? "bg-brand-light/5 border border-brand-light/15 text-brand-accent"
                  : "bg-brand-pine/10 border border-brand-pine/25 text-brand-pine font-bold"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full animate-pulse ${
                  isDark ? "bg-brand-accent" : "bg-brand-pine"
                }`}
              />
              {label}
            </div>
          )}

          <TitleTag
            className={`font-heading ${titleSizeClass} m-0 text-balance ${titleColorClass}`}
          >
            {title}
          </TitleTag>

          {description && (
            <p
              className={`font-body text-fluid-p-lg leading-relaxed max-w-3xl text-pretty m-0 ${descriptionColorClass}`}
            >
              {description}
            </p>
          )}
        </div>

        {children && <div>{children}</div>}
      </div>
    </section>
  );
}