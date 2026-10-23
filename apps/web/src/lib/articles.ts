import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { FAQItem } from "@/components/sections/FAQSection";

export interface ArticleMeta {
  slug: string;
  title: string;
  description: string;
  category: string;
  author: string;
  authorRole: string;
  readTime: string;
  date: string;
  image: string;
  tags: string[];
  summary: string[];
  faqs: FAQItem[];
}

export interface ArticleData extends ArticleMeta {
  content: string;
}

const ARTICLES_DIR = path.join(process.cwd(), "src/content/artikler");

function parseArticleFile(slug: string, fileContent: string): ArticleData {
  const { data, content } = matter(fileContent);

  const resolvedImage =
    data.image && data.image !== "/bilder/deling.jpg"
      ? data.image
      : "/images/teamet.jpg";

  const summary: string[] = Array.isArray(data.summary)
    ? data.summary.filter((item): item is string => typeof item === "string")
    : [];

  const faqs: FAQItem[] = Array.isArray(data.faqs)
    ? data.faqs
        .filter(
          (f: unknown): f is { question: string; answer: string } =>
            Boolean(
              f &&
                typeof f === "object" &&
                "question" in f &&
                "answer" in f &&
                typeof (f as { question: unknown }).question === "string" &&
                typeof (f as { answer: unknown }).answer === "string"
            )
        )
        .map((f) => ({ question: f.question, answer: f.answer }))
    : [];

  return {
    slug,
    title: data.title || "Uten tittel",
    description: data.description || "",
    category: data.category || "Fagartikkel",
    author: data.author || "Simen Russ",
    authorRole: data.authorRole || "Senior SEO-spesialist & Partner",
    readTime: data.readTime || "5 min lesetid",
    date: data.date || "2026-09-15",
    image: resolvedImage,
    tags: Array.isArray(data.tags) ? data.tags : [],
    summary,
    faqs,
    content,
  };
}

export function getAllArticles(): ArticleMeta[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];

  const files = fs.readdirSync(ARTICLES_DIR);

  return files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const filePath = path.join(ARTICLES_DIR, file);
      const fileContent = fs.readFileSync(filePath, "utf8");
      const { content: _content, ...meta } = parseArticleFile(slug, fileContent);
      return meta;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getArticleBySlug(slug: string): ArticleData | null {
  const decodedSlug = decodeURIComponent(slug);
  const filePath = path.join(ARTICLES_DIR, `${decodedSlug}.mdx`);

  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf8");
  return parseArticleFile(decodedSlug, fileContent);
}
