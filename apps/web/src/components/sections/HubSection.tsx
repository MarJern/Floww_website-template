import React from "react";
import Card, {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardEyebrow,
  CardAction,
} from "@/components/ui/Card";

export interface HubCardItem {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
  actionText?: React.ReactNode;
  href?: string;
  variant?: "light" | "dark" | "sand";
  accent?: "none" | "top" | "left";
  interactive?: boolean;
}

export interface HubSectionProps {
  bg?: "sand" | "light" | "dark";
  ariaLabel?: string;
  label?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  items?: HubCardItem[];
  columns?: 2 | 3;
  children?: React.ReactNode;
}

const DEFAULT_HUB_ITEMS: HubCardItem[] = [
  {
    variant: "light",
    href: "/lokal-seo",
    interactive: true,
    eyebrow: "Lokal SEO",
    title: "Topp 3 i Google-kartet",
    description:
      "48 % av alle lokale søk ender hos de tre øverste i kartpakken. Vi bygger profilstyrken og signalene som plasserer dere øverst.",
    actionText: "Hvordan vi jobber",
  },
  {
    variant: "dark",
    href: "/nettsider",
    interactive: true,
    eyebrow: "Teknisk Arkitektur & CRO",
    title: "Nettsider som konverterer",
    description:
      "Lynraske nettsider bygget med semantiske innholdssiloer, maskinlesbar skjemakode og lavere klikkpris i Google Ads.",
    actionText: "Les mer",
  },
];

export default function HubSection({
  bg = "sand",
  ariaLabel = "Våre tjenester",
  label = "Tjenester",
  title = "Våre Kjerneområder",
  description,
  items = DEFAULT_HUB_ITEMS,
  columns = 2,
  children,
}: HubSectionProps) {
  const bgClasses = {
    sand: "bg-brand-sand text-brand-dark",
    light: "bg-brand-light text-brand-dark",
    dark: "bg-brand-dark text-brand-light",
  };

  const labelColorClass =
    bg === "dark" ? "text-brand-accent" : "text-brand-dark/50";
  const headingColorClass =
    bg === "dark" ? "text-brand-light" : "text-brand-dark";
  const descriptionColorClass =
    bg === "dark" ? "text-brand-light/85" : "text-brand-dark/90";
  const isFiveItemBento = columns === 3 && items.length === 5;

  const gridColsClass = isFiveItemBento
    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-6"
    : columns === 3
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      : "grid-cols-1 sm:grid-cols-2";

  return (
    <section
      className={`py-[clamp(4rem,8vw,8rem)] ${bgClasses[bg]}`}
      aria-label={ariaLabel}
    >
      <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 md:px-8">
        {label && (
          <p
            className={`text-micro uppercase ${labelColorClass} m-0 mb-3 font-bold tracking-wider`}
          >
            {label}
          </p>
        )}

        <div className="w-full">
          {title && (
            <h2
              className={`font-heading text-fluid-h2 ${
                description ? "mb-5" : "mb-10"
              } ${headingColorClass}`}
            >
              {title}
            </h2>
          )}

          {description && (
            <p
              className={`text-fluid-p-lg ${descriptionColorClass} max-w-4xl mb-10 text-pretty`}
            >
              {description}
            </p>
          )}

          {children ? (
            children
          ) : (
            <div className={`grid ${gridColsClass} gap-8`}>
              {items.map((item, idx) => {
                const isInteractive = item.interactive ?? Boolean(item.href);
                const spanClass = isFiveItemBento
                  ? idx < 3
                    ? "lg:col-span-2"
                    : idx === 4
                      ? "sm:col-span-2 lg:col-span-3"
                      : "lg:col-span-3"
                  : "";
                return (
                  <Card
                    key={idx}
                    variant={item.variant ?? "light"}
                    accent={item.accent ?? "none"}
                    href={item.href}
                    interactive={isInteractive}
                    className={spanClass}
                  >
                    <CardHeader>
                      {item.eyebrow && <CardEyebrow>{item.eyebrow}</CardEyebrow>}
                      <CardTitle as="h3">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{item.description}</CardDescription>
                    </CardContent>
                    {item.actionText && (
                      <CardFooter>
                        <CardAction>{item.actionText}</CardAction>
                      </CardFooter>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}