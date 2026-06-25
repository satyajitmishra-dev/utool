import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { generateToolMetadata } from "@/utils/seo";
import { toolsSeoData } from "@/config/tools-seo-data";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Cpu,
  Zap,
  Home,
  ChevronRight,
} from "lucide-react";

import { ToolWorkspaceClient } from "@/components/tools/tool-workspace-client";
import ToolExecutionClient from "@/components/tools/tool-execution-client";

interface Props {
  params: Promise<{ slug: string }>;
}

const devTools = ["env-validator"];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return generateToolMetadata(slug);
}

export default async function ProgrammaticToolPage({ params }: Props) {
  const { slug } = await params;

  // 1. Check if it's a developer/utility tool with no SEO landing page
  if (devTools.includes(slug)) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10">
        <ToolExecutionClient />
      </div>
    );
  }

  // 2. Resolve programmatic SEO tool details
  const tool = toolsSeoData[slug];
  if (!tool) {
    notFound();
  }

  // Define structured JSON-LD schemas
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://utool.in",
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Tools",
        "item": "https://utool.in/tools",
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": tool.name,
        "item": `https://utool.in/tools/${tool.slug}`,
      },
    ],
  };

  const appSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": `${tool.name} | utool`,
    "url": `https://utool.in/tools/${tool.slug}`,
    "description": tool.description,
    "applicationCategory": "Utility",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": tool.faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a,
      },
    })),
  };

  return (
    <>
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-foreground">
        <main className="max-w-6xl w-full mx-auto px-6 py-10 space-y-12">
          {/* Breadcrumb Navigation */}
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
            <span className="text-foreground font-bold">{tool.name}</span>
          </nav>

          {/* Hero & Intro */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            <div className="lg:col-span-3 space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="primary" className="inline-flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Free Tool
                </Badge>
                <Badge variant="success" className="inline-flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  100% Secure & Client-Side
                </Badge>
              </div>
              <h1 className="text-display-sm font-extrabold tracking-tight text-foreground leading-tight">
                {tool.h1}
              </h1>
              <p className="text-body-sm text-muted-foreground leading-relaxed">
                {tool.intro}
              </p>
            </div>
            <div className="lg:col-span-2 border border-border rounded-3xl p-6 bg-card space-y-4 shadow-sm">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Zap className="h-4.5 w-4.5 text-primary" />
                Performance Advantage
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2.5 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Zero server uploads:</strong> Safe from security leaks.</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Instant conversion:</strong> Merged/rendered in milliseconds.</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>No signup required:</strong> Unlimited access for everyone.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Interactive Workspace Area */}
          <section className="border border-border rounded-3xl bg-card/40 p-6 md:p-10 shadow-sm relative overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-[image:var(--gradient-primary)]" />
            <div className="w-full flex flex-col items-stretch">
              <ToolWorkspaceClient slug={slug} />
            </div>
          </section>

          {/* How It Works (Steps) */}
          <section className="space-y-6">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              How to Use {tool.name} Online
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {tool.howItWorks.map((step, idx) => (
                <div
                  key={idx}
                  className="border border-border rounded-2xl p-5 bg-card relative shadow-xs"
                >
                  <span className="absolute top-4 right-4 text-display-xs font-black text-muted-foreground/15">
                    {idx + 1}
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/5 text-primary font-bold text-sm mb-4">
                    {idx + 1}
                  </div>
                  <p className="text-xs text-foreground font-semibold leading-relaxed">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Key Benefits Grid */}
          <section className="space-y-6">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Key Features & Benefits
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tool.benefits.map((benefit, idx) => (
                <div
                  key={idx}
                  className="border border-border rounded-2xl p-6 bg-card space-y-3 shadow-xs"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/5 text-primary">
                    {idx === 0 ? (
                      <ShieldCheck className="h-5 w-5" />
                    ) : idx === 1 ? (
                      <Cpu className="h-5 w-5" />
                    ) : (
                      <Zap className="h-5 w-5" />
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-foreground">{benefit.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* NLP Long-form Copy Content (1000-1500 Words target) */}
          {tool.longFormContent && tool.longFormContent.length > 0 && (
            <section className="border-t border-border pt-10 space-y-8">
              {tool.longFormContent.map((section, idx) => (
                <div key={idx} className="space-y-4 max-w-4xl">
                  <h2 className="text-xl font-bold tracking-tight text-foreground">
                    {section.sectionTitle}
                  </h2>
                  {section.paragraphs.map((p, pIdx) => (
                    <p
                      key={pIdx}
                      className="text-xs text-muted-foreground leading-relaxed text-justify"
                    >
                      {p}
                    </p>
                  ))}
                </div>
              ))}
            </section>
          )}

          {/* FAQ Accordion Section */}
          <section className="border-t border-border pt-10 space-y-6 max-w-4xl">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Frequently Asked Questions
            </h2>
            <FaqAccordion faqs={tool.faqs} />
          </section>

          {/* Related Tools & Internal Linking Engine */}
          <section className="border-t border-border pt-10 space-y-6">
            <h2 className="text-base font-bold tracking-tight text-foreground uppercase tracking-widest">
              Related Utilities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tool.relatedTools.map((relSlug) => {
                const relTool = toolsSeoData[relSlug];
                if (!relTool) return null;
                return (
                  <Link
                    key={relSlug}
                    href={`/tools/${relSlug}`}
                    className="flex justify-between items-center border border-border hover:border-primary/25 rounded-2xl p-5 bg-card hover:bg-muted/30 transition-all shadow-xs"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-foreground">{relTool.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1 truncate max-w-xs md:max-w-md">
                        {relTool.description}
                      </p>
                    </div>
                    <ArrowLeft className="h-4 w-4 text-muted-foreground rotate-180" />
                  </Link>
                );
              })}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
