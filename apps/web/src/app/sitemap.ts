import { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/articles";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://flowwmedia.no";

  const routes = [
    "",
    "/seo-analyse",
    "/seo",
    "/lokal-seo",
    "/google-ads",
    "/nettsider",
    "/ai-seo",
    "/om-oss",
    "/artikler",
    "/kontakt",
    "/personvern",
    "/vilkar",
  ];

  const staticEntries: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1.0 : route === "/seo-analyse" ? 0.9 : 0.8,
  }));

  const articleEntries: MetadataRoute.Sitemap = getAllArticles().map(
    (article) => ({
      url: `${baseUrl}/artikler/${article.slug}`,
      lastModified: article.date ? new Date(article.date) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })
  );

  return [...staticEntries, ...articleEntries];
}
