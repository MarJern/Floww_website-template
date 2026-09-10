import type { Metadata } from "next";
import { Inter, Manrope, Fraunces } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-logo",
  subsets: ["latin"],
});

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    template: "%s | Floww Media",
    default: "Floww Media | Frontend & SEO",
  },
  description: "High-end frontend development paired with expert SEO architecture. A minimalistic, high-converting portfolio.",
  openGraph: {
    title: "Floww Media | Frontend & SEO",
    description: "High-end frontend development paired with expert SEO architecture. A minimalistic, high-converting portfolio.",
    url: "https://flowwmedia.example.com",
    siteName: "Floww Media",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Floww Media | Frontend & SEO",
    description: "High-end frontend development paired with expert SEO architecture. A minimalistic, high-converting portfolio.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${manrope.variable} ${fraunces.variable} h-full scroll-smooth`}
    >
      <body id="top" className="min-h-full flex flex-col selection:bg-brand-accent selection:text-brand-light">
        <a 
          href="#content" 
          className="visually-hidden fixed top-4 left-4 z-50 bg-brand-light text-brand-dark px-4 py-2 font-bold"
        >
          Skip to main content
        </a>
        
        <Navbar />

        <main id="content" tabIndex={-1} className="flex-1 w-full focus:outline-none">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
