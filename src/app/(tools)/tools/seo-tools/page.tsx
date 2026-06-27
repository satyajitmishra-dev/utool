import React from "react";
import { Metadata } from "next";
import { CategoryHubLayout } from "@/components/layout/category-hub-layout";

export const metadata: Metadata = {
  title: "Free SEO & Schema Generator Tools — 100% Secure | utool",
  description: "Generate robots.txt, build XML sitemaps, inspect response headers, check SSL validity, and generate JSON-LD schema markups instantly.",
  alternates: {
    canonical: "https://utool.in/tools/seo-tools",
  },
  openGraph: {
    title: "Free SEO & Schema Generator Tools — Secure | utool",
    description: "Generate robots.txt, build XML sitemaps, inspect response headers, check SSL validity, and generate JSON-LD schema markups instantly.",
    url: "https://utool.in/tools/seo-tools",
  }
};

const faqs = [
  {
    q: "Why are these SEO tools client-side?",
    a: "Running generators locally ensures that draft configs (like robots.txt and sitemap targets) remain private and safe from early crawlers until you deploy them."
  },
  {
    q: "Are my domains or sitemaps logged?",
    a: "No domain search history or WHOIS lookups are saved or logged on UTool, ensuring absolute search intent privacy."
  }
];

export default function SEOToolsCategoryPage() {
  return (
    <CategoryHubLayout
      title="SEO & Webmaster Tools"
      description="Optimize your website indexing and search engine visibility. Generate metadata tags, compile robots.txt files, build sitemaps, and write JSON-LD schema schemas."
      canonicalUrl="https://utool.in/tools/seo-tools"
      categoryName="SEO"
      faqs={faqs}
    />
  );
}
