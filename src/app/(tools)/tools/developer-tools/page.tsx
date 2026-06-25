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
  Terminal,
  Code,
  QrCode,
  Link2,
  Brush,
  Globe
} from "lucide-react";

export const metadata: Metadata = {
  title: "Free Developer Tools Online — Secure Formatters & Utilities | utool",
  description: "Free, high-speed, and secure web tools for developers and designers. Beautify JSON payloads, create short links, generate QR codes, and preview meta tags locally.",
  alternates: {
    canonical: "https://utool.in/tools/developer-tools",
  },
  openGraph: {
    title: "Free Developer Tools Online — Secure & Local | utool",
    description: "Format JSON, shorten links, generate QR codes, and construct SEO meta tags. Your data processed entirely in the browser.",
    url: "https://utool.in/tools/developer-tools",
  }
};

const devTools = [
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
    id: "url-shortener",
    name: "Short Link Creator",
    description: "Create, track, and manage clean short links with analytics.",
    tag: "url-shortener",
    status: "live" as const,
    isPremium: false,
    href: "/tools/url-shortener",
    icon: Link2
  },
  {
    id: "qr-generator",
    name: "QR Code Generator",
    description: "Generate customized QR codes for URLs, text, email, and Wi-Fi.",
    tag: "qr",
    status: "live" as const,
    isPremium: false,
    href: "/tools/qr-generator",
    icon: QrCode
  },
  {
    id: "meta-tag-generator",
    name: "Meta Tag Generator",
    description: "Generate and preview Google Search and social media card meta tags.",
    tag: "meta",
    status: "live" as const,
    isPremium: false,
    href: "/tools/meta-tag-generator",
    icon: Globe
  },
  {
    id: "css-gradient-generator",
    name: "CSS Gradient Generator",
    description: "Build, preview, and export premium HSL radial CSS gradients.",
    tag: "gradient",
    status: "live" as const,
    isPremium: false,
    href: "/tools/css-gradient-generator",
    icon: Brush
  }
];

const faqs = [
  {
    q: "Is it safe to format sensitive configurations or API payloads here?",
    a: "Yes. All operations, such as parsing JSON data, validating syntax structures, and generating web backgrounds, execute 100% locally in your web browser sandbox. Your inputs are never uploaded to our servers, making it safe for database credentials, raw configs, and API responses."
  },
  {
    q: "Do you charge for creating shortened links or QR codes?",
    a: "No. Our Short Link Creator and QR Code Generator are free utilities with no scan caps, paywalls, or hidden charges."
  },
  {
    q: "How does the SEO preview tool work?",
    a: "The Meta Tag Generator renders visual representations of your webpage titles, descriptions, and social images as they would appear on Google search results pages (SERP) and social cards (Twitter, Facebook, LinkedIn), helping you optimize titles to prevent truncation."
  }
];

export default function DeveloperToolsCategoryPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://utool.in" },
      { "@type": "ListItem", "position": 2, "name": "Tools", "item": "https://utool.in/tools" },
      { "@type": "ListItem", "position": 3, "name": "Developer Tools", "item": "https://utool.in/tools/developer-tools" }
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
            <span className="text-foreground font-bold">Developer Tools</span>
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
                    Client-Side Processing
                  </Badge>
                </div>
                <h1 className="text-display-l font-extrabold tracking-tight text-foreground leading-tight">
                  Free Developer <span className="gradient-text bg-gradient-to-r from-primary via-secondary to-accent">Utilities Hub</span>
                </h1>
                <p className="text-body-m text-muted-foreground leading-relaxed">
                  Clean code structures, generate sharing hooks, and build visual palettes locally. Process configurations and design metrics with zero network latency.
                </p>
              </div>
              <div className="lg:col-span-2 border border-border rounded-2xl p-6 bg-card space-y-4 shadow-sm">
                <h3 className="text-sm font-bold text-foreground">Zero Latency Local Processing</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  By running JSON parsers and gradient generator calculations directly inside your browser cache sandbox, Utool eliminates database upload times and secures API tokens and configuration strings from interception.
                </p>
              </div>
            </div>
          </div>

          {/* Tools Grid */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Select Developer Utility Spoke</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {devTools.map((tool, idx) => (
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
                Enhancing Coder Workflows with High-Speed Client-Side Execution
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed text-justify">
                A primary requirement for web developers, system administrators, and designers is the availability of lightweight, secure tools to edit, format, and audit visual parameters and configuration strings. When sharing API tokens or formatting database payloads, uploading snippets to cloud validators represents a security risk. Utool addresses this by keeping all execution client-side.
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed text-justify">
                Our JSON Formatter runs inside browser JS engines, offering syntax validation and indentation locally without sharing developer credentials. Similarly, our Meta Tag Generator lets marketers fill out title and description fields, preview SERP snippets and card layouts in real-time, and copy clean headers to boost CTR.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Visual Assets and Redirection Helpers
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed text-justify">
                To simplify marketing assets delivery, Utool provides a static QR Code Generator that compiles destination credentials, Wi-Fi parameters, and text messages into uncompressed download grids. For clean social media links, the Short Link Creator uses serverless route caching to optimize redirection, keeping forward latency low.
              </p>
            </div>
          </section>

          {/* FAQs Accordion */}
          <section className="border-t border-border pt-10 space-y-6 max-w-4xl">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Frequently Asked Questions (Developer Category)
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
              <Link href="/tools/resume-tools" className="flex justify-between items-center border border-border hover:border-primary/20 rounded-xl p-4 bg-card hover:bg-muted/30 transition-all text-xs font-bold">
                Resume Tools
                <ArrowRight className="h-4 w-4 text-primary" />
              </Link>
              <Link href="/tools/text-tools" className="flex justify-between items-center border border-border hover:border-primary/20 rounded-xl p-4 bg-card hover:bg-muted/30 transition-all text-xs font-bold">
                Text Tools
                <ArrowRight className="h-4 w-4 text-primary" />
              </Link>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
