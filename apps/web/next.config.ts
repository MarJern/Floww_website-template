import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@floww/db", "@floww/audit"],
  serverExternalPackages: [
    "crawlee",
    "@crawlee/playwright",
    "@crawlee/puppeteer",
    "@crawlee/browser",
    "@crawlee/core",
    "playwright",
    "playwright-core",
    "pg-boss",
    "postgres",
    "cheerio",
  ],
};

export default nextConfig;
