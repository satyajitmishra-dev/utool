import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getToolBySlug, TOOL_REGISTRY } from "@/config/tool-registry";
import { computeRelatedTools } from "@/lib/seo/internal-links";
import { ConverterLayout } from "@/components/converter/ConverterLayout";
import { generateSoftwareSchema, generateFAQSchema, generateBreadcrumbSchema } from "@/lib/seo/engine";
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
  LifeBuoy,
  AlertTriangle,
  BookOpen,
  Lock,
  Layers,
} from "lucide-react";

import { ToolWorkspaceClient } from "@/components/tools/tool-workspace-client";
import { Button } from "@/components/ui/button";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  
  if (!tool) {
    return { title: 'Not Found' };
  }
  
  return {
    title: tool.seoMeta.title,
    description: tool.seoMeta.description,
    keywords: tool.seoMeta.keywords,
    openGraph: {
      title: tool.seoMeta.title,
      description: tool.seoMeta.description,
      type: 'website',
      url: `https://utool.in/tools/${slug}`,
    }
  };
}

export default async function ProgrammaticToolPage({ params }: Props) {
  const { slug } = await params;

  // 1. Check if tool exists in unified registry
  const tool = getToolBySlug(slug);
  if (!tool) {
    notFound();
  }

  // Define structured JSON-LD schemas
  const appSchema = generateSoftwareSchema(tool as any);
  const faqSchema = generateFAQSchema(tool as any);
  const breadcrumbSchema = generateBreadcrumbSchema(tool as any);

  // Compute effective related tools: use registry-defined list if populated,
  // otherwise fall back to the auto-computed internal linking system.
  const effectiveRelatedTools =
    tool.relatedTools && tool.relatedTools.length > 0
      ? tool.relatedTools
      : computeRelatedTools(tool, TOOL_REGISTRY, 6);

  // 2. Converters get the unified ConverterLayout
  if (tool.isConverter) {
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
        {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <ConverterLayout config={tool as any} />
      </>
    );
  }

  // 3. Render utilities with standard SEO layouts
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-foreground">
        <main className="max-w-6xl w-full mx-auto px-6 py-10 space-y-16">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex-wrap">
            <Link href="/" className="hover:text-foreground flex items-center gap-1 transition-colors">
              <Home className="h-3.5 w-3.5" /> Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/tools" className="hover:text-foreground transition-colors">Tools</Link>
            {tool.parentToolSlug && (
              <>
                <ChevronRight className="h-3 w-3" />
                <Link href={`/tools/${tool.parentToolSlug}`} className="hover:text-foreground transition-colors capitalize">
                  {tool.parentToolSlug.replace(/-/g, ' ')}
                </Link>
              </>
            )}
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-bold">{tool.name}</span>
          </nav>

          {/* Hero & Intro */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            <div className="lg:col-span-3 space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="primary" className="inline-flex items-center gap-1 bg-purple-50 text-purple-600 border border-purple-100">
                  <Sparkles className="h-3 w-3" /> Free Tool
                </Badge>
                <Badge variant="success" className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <ShieldCheck className="h-3 w-3" /> 100% Secure & Client-Side
                </Badge>
                {/* Intent variant context badge */}
                {tool.intentContext && (
                  <Badge variant="outline" className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 border border-blue-200">
                    <Layers className="h-3 w-3" /> {tool.intentContext}
                  </Badge>
                )}
              </div>
              <h1 className="text-[32px] md:text-[38px] font-black tracking-tight text-foreground leading-tight">
                {tool.seoMeta.h1 || tool.name}
              </h1>
              <p className="text-[14px] text-muted-foreground leading-relaxed">
                {tool.intro || tool.description}
              </p>
            </div>
            <div className="lg:col-span-2 border border-border rounded-3xl p-6 bg-card space-y-4 shadow-sm">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Zap className="h-4.5 w-4.5 text-primary" /> Performance Advantage
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2.5 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Zero server uploads:</strong> Safe from security leaks.</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Instant execution:</strong> Runs in milliseconds.</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>No signup required:</strong> Unlimited access.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Interactive Workspace Area */}
          <section className="border border-border rounded-3xl bg-card/40 p-6 md:p-10 shadow-sm relative overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-purple-500 to-indigo-500" />
            <div className="w-full flex flex-col items-stretch">
              <ToolWorkspaceClient slug={tool.parentToolSlug || slug} />
            </div>
          </section>

          {/* Benefits */}
          {tool.benefits && tool.benefits.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-xl font-bold tracking-tight text-foreground">Key Features & Benefits</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {tool.benefits.map((benefit, idx) => (
                  <div key={idx} className="border border-border rounded-2xl p-6 bg-card space-y-3 shadow-xs">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/5 text-primary">
                      {idx === 0 ? <ShieldCheck className="h-5 w-5" /> : idx === 1 ? <Cpu className="h-5 w-5" /> : <Zap className="h-5 w-5" />}
                    </div>
                    <h4 className="text-sm font-bold text-foreground">{benefit.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{benefit.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* How It Works */}
          {tool.howItWorks && tool.howItWorks.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-xl font-bold tracking-tight text-foreground">How to Use {tool.name} Online</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {tool.howItWorks.map((step, idx) => (
                  <div key={idx} className="border border-border rounded-2xl p-5 bg-card relative shadow-xs">
                    <span className="absolute top-4 right-4 text-display-xs font-black text-muted-foreground/15">{idx + 1}</span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/5 text-primary font-bold text-sm mb-4">{idx + 1}</div>
                    <p className="text-xs text-foreground font-semibold leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Long-form Content */}
          {tool.longFormContent && tool.longFormContent.length > 0 && (
            <section className="border-t border-border pt-10 space-y-8">
              {tool.longFormContent.map((section, idx) => (
                <div key={idx} className="space-y-4 max-w-4xl">
                  <h2 className="text-xl font-bold tracking-tight text-foreground">{section.sectionTitle}</h2>
                  {section.paragraphs.map((p, pIdx) => (
                    <p key={pIdx} className="text-xs text-muted-foreground leading-relaxed text-justify">{p}</p>
                  ))}
                </div>
              ))}
            </section>
          )}

          {/* Privacy Explanation */}
          {tool.privacyExplanation && (
            <section className="border-t border-border pt-10 space-y-4 max-w-4xl">
              <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <Lock className="h-5 w-5 text-emerald-500" /> Privacy & Security
              </h2>
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-6">
                <p className="text-xs text-muted-foreground leading-relaxed">{tool.privacyExplanation}</p>
              </div>
            </section>
          )}

          {/* Common Mistakes */}
          {tool.commonMistakes && tool.commonMistakes.length > 0 && (
            <section className="border-t border-border pt-10 space-y-4 max-w-4xl">
              <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" /> Common Mistakes to Avoid
              </h2>
              <ul className="space-y-3">
                {tool.commonMistakes.map((mistake, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs text-muted-foreground">
                    <span className="flex-shrink-0 mt-0.5 h-4 w-4 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-[10px] font-bold">{idx + 1}</span>
                    <span>{mistake}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Examples */}
          {tool.examples && tool.examples.length > 0 && (
            <section className="border-t border-border pt-10 space-y-6">
              <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" /> Usage Examples
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tool.examples.map((ex, idx) => (
                  <div key={idx} className="border border-border rounded-2xl p-5 bg-card space-y-2 shadow-xs">
                    <h4 className="text-sm font-bold text-foreground">{ex.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{ex.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* FAQ */}
          {tool.faqs && tool.faqs.length > 0 && (
            <section className="border-t border-border pt-10 space-y-6 max-w-4xl">
              <h2 className="text-xl font-bold tracking-tight text-foreground">Frequently Asked Questions</h2>
              <FaqAccordion faqs={tool.faqs.map(f => ({ q: f.question || (f as any).q, a: f.answer || (f as any).a }))} />
            </section>
          )}

          <section className="border-t border-border pt-10 space-y-6 flex justify-center">
            <Link href={`/dashboard/support?tool=${slug}&newTicket=true`}>
              <Button variant="outline" className="rounded-full flex items-center gap-2">
                <LifeBuoy className="h-4 w-4" /> Need Help?
              </Button>
            </Link>
          </section>

          {/* Related Tools — uses auto-computed internal links if relatedTools is empty */}
          {effectiveRelatedTools.length > 0 && (
            <section className="border-t border-border pt-10 space-y-6">
              <h2 className="text-base font-bold tracking-tight text-foreground uppercase tracking-widest">Related Utilities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {effectiveRelatedTools.map((relSlug) => {
                  const relTool = getToolBySlug(relSlug);
                  if (!relTool) return null;
                  return (
                    <Link key={relSlug} href={`/tools/${relSlug}`} className="flex justify-between items-center border border-border hover:border-primary/25 rounded-2xl p-5 bg-card hover:bg-muted/30 transition-all shadow-xs">
                      <div>
                        <h4 className="text-sm font-bold text-foreground">{relTool.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1 truncate max-w-xs md:max-w-md">{relTool.description}</p>
                      </div>
                      <ArrowLeft className="h-4 w-4 text-muted-foreground rotate-180" />
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

        </main>
      </div>
    </>
  );
}
