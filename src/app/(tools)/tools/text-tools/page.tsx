import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ToolCard } from "@/components/ui/tool-card";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  ShieldCheck, 
  ChevronRight, 
  Home, 
  ArrowRight,
  Type,
  FileText,
  Terminal,
  Code
} from "lucide-react";

export const metadata: Metadata = {
  title: "Free Online Text Tools — Case Converters & SEO Utilities | utool",
  description: "Free, high-speed text utilities and string converters. Change capitalization cases, validate markup languages, and generate search tags locally in your web browser.",
  alternates: {
    canonical: "https://utool.in/tools/text-tools",
  },
  openGraph: {
    title: "Free Online Text Tools — Capitalization & Formatting | utool",
    description: "Format capitalizations, clean paragraphs, and generate metadata structures locally. Your copy safe from server uploads.",
    url: "https://utool.in/tools/text-tools",
  }
};

const textTools = [
  {
    id: "meta-tag-generator",
    name: "Meta Tag Generator",
    description: "Generate and preview Google Search and social media card meta tags.",
    tag: "meta",
    status: "live" as const,
    isPremium: false,
    href: "/tools/meta-tag-generator",
    icon: FileText
  },
  {
    id: "json-formatter",
    name: "JSON Formatter",
    description: "Format, validate, and beautify raw JSON with syntax checks.",
    tag: "json",
    status: "live" as const,
    isPremium: false,
    href: "/tools/json-formatter",
    icon: Code
  },
  {
    id: "markdown-html",
    name: "Markdown to HTML",
    description: "Convert markdown documents to clean, semantic HTML output.",
    tag: "converter",
    status: "coming-soon" as const,
    isPremium: false,
    href: "/tools/markdown-html",
    icon: Type
  }
];

const faqs = [
  {
    q: "Are my text inputs secure on Utool?",
    a: "Yes. All operations run directly in your web browser using client-side JavaScript. None of the text, codes, or descriptions you input or generate are uploaded to our databases."
  },
  {
    q: "Can I convert markdown to HTML offline?",
    a: "Yes. Once the web app page is loaded, the converter utilities are stored in your browser sandbox, enabling you to translate and package files offline."
  }
];

export default function TextToolsCategoryPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://utool.in" },
      { "@type": "ListItem", "position": 2, "name": "Tools", "item": "https://utool.in/tools" },
      { "@type": "ListItem", "position": 3, "name": "Text Tools", "item": "https://utool.in/tools/text-tools" }
    ]
  };

  const hubSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": { "@type": "Answer", "text": faq.a }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hubSchema) }}
      />

      <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-foreground">
        <main className="max-w-6xl w-full mx-auto px-6 py-10 space-y-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <Link href="/" className="hover:text-foreground flex items-center gap-1 transition-colors">
              <Home className="h-3.5 w-3.5" />
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/tools" className="hover:text-foreground transition-colors">
              Tools
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-bold">Text Tools</span>
          </nav>

          {/* Hero Section */}
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card/25 p-8 md:p-12 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
              <div className="lg:col-span-3 space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="primary" className="inline-flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Free Utility Hub
                  </Badge>
                  <Badge variant="success" className="inline-flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    Browser Local
                  </Badge>
                </div>
                <h1 className="text-display-l font-extrabold tracking-tight text-foreground leading-tight">
                  Free Online <span className="gradient-text bg-gradient-to-r from-primary via-secondary to-accent">Text Tools</span>
                </h1>
                <p className="text-body-m text-muted-foreground leading-relaxed">
                  Convert cases, format code markups, and construct semantic page metadata locally. Clean paragraph string data arrays with high-speed in-browser scripts.
                </p>
              </div>
              <div className="lg:col-span-2 border border-border rounded-2xl p-6 bg-card space-y-4 shadow-sm">
                <h3 className="text-sm font-bold text-foreground">Decentralized Formatting</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Managing copywriting drafts, metadata previews, and coding payloads offline keeps your credentials secure and eliminates server upload delays.
                </p>
              </div>
            </div>
          </div>

          {/* Tools Grid */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Select Text Utility Spoke</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {textTools.map((tool, idx) => (
                <ToolCard
                  key={tool.id}
                  title={tool.name}
                  description={tool.description}
                  href={tool.href}
                  tag={tool.tag}
                  status={tool.status}
                  isPremium={tool.isPremium}
                  index={idx}
                />
              ))}
            </div>
          </div>

          {/* SEO Core Long-Form Copy Block (Topical Authority Construction) */}
          <section className="border-t border-border pt-10 space-y-8 max-w-4xl">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Enhancing String Manipulation Workflows online
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed text-justify">
                Writers, editors, developers, and marketers process text strings hourly — changing capitalizations, validating schema markup tags, parsing JSON formats, and converting markdown documentation files. Standard web converters require pasting inputs onto distant servers, risking leaks of passwords, draft content, or client records. Utool solves this by executing all text manipulations locally in the browser sandbox.
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed text-justify">
                Our Meta Tag Generator helps you write descriptions, preview how page layouts appear on Google search results pages, and copy semantic headers with a single click. Similarly, our formatters validation scripts parse JSON data, finding syntax errors directly on your local CPU thread.
              </p>
            </div>
          </section>

          {/* FAQs Accordion */}
          <section className="border-t border-border pt-10 space-y-6 max-w-4xl">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Frequently Asked Questions (Text Category)
            </h2>
            <FaqAccordion faqs={faqs} />
          </section>

          {/* Horizontal category navigation */}
          <section className="border-t border-border pt-10 space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Other Categories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Link href="/tools/pdf-tools" className="flex justify-between items-center border border-border hover:border-primary/20 rounded-xl p-4 bg-card hover:bg-muted/30 transition-all text-xs font-bold">
                PDF Tools
                <ArrowRight className="h-4 w-4 text-primary" />
              </Link>
              <Link href="/tools/image-tools" className="flex justify-between items-center border border-border hover:border-primary/20 rounded-xl p-4 bg-card hover:bg-muted/30 transition-all text-xs font-bold">
                Image Tools
                <ArrowRight className="h-4 w-4 text-primary" />
              </Link>
              <Link href="/tools/developer-tools" className="flex justify-between items-center border border-border hover:border-primary/20 rounded-xl p-4 bg-card hover:bg-muted/30 transition-all text-xs font-bold">
                Developer Tools
                <ArrowRight className="h-4 w-4 text-primary" />
              </Link>
              <Link href="/tools/resume-tools" className="flex justify-between items-center border border-border hover:border-primary/20 rounded-xl p-4 bg-card hover:bg-muted/30 transition-all text-xs font-bold">
                Resume Tools
                <ArrowRight className="h-4 w-4 text-primary" />
              </Link>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
