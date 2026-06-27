import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { generateBlogMetadata } from "@/utils/seo";
import { blogPosts } from "@/config/blog-data";
import { getToolBySlug } from "@/config/tool-registry";
import { getAuthorByName } from "@/config/authors";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  ChevronRight,
  Home,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return generateBlogMetadata(slug);
}

export default async function BlogPostReaderPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts[slug];

  if (!post) {
    notFound();
  }

  const toolData = post.ctaToolSlug ? getToolBySlug(post.ctaToolSlug) : null;
  const authorData = getAuthorByName(post.author);

  // Article Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.h1,
    "description": post.description,
    "image": "https://utool.in/favicon.ico",
    "datePublished": new Date(post.date).toISOString(),
    "author": {
      "@type": "Person",
      "name": post.author,
    },
    "publisher": {
      "@type": "Organization",
      "name": "utool",
      "logo": {
        "@type": "ImageObject",
        "url": "https://utool.in/apple-touch-icon.png",
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://utool.in/blog/${post.slug}`,
    },
  };

  // Breadcrumb Schema
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
        "name": "Blog",
        "item": "https://utool.in/blog",
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.h1,
        "item": `https://utool.in/blog/${post.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-foreground">
        <main className="max-w-4xl w-full mx-auto px-6 py-10 space-y-8">
          {/* Navigation controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <nav className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <Link href="/" className="hover:text-foreground flex items-center gap-1 transition-colors">
                <Home className="h-3.5 w-3.5" />
                Home
              </Link>
              <ChevronRight className="h-3 w-3" />
              <Link href="/blog" className="hover:text-foreground transition-colors">
                Blog
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground font-bold truncate max-w-[200px]">
                {post.title.split(" | ")[0]}
              </span>
            </nav>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-caption font-bold text-muted-foreground hover:text-foreground transition uppercase tracking-wider"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Catalog
            </Link>
          </div>

          {/* Article Header */}
          <div className="space-y-4 border-b border-border pb-6">
            <div className="flex flex-wrap gap-3">
              <Badge variant="primary">{post.category}</Badge>
              <span className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                <Calendar className="h-3 w-3" />
                {post.date}
              </span>
              <span className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                <Clock className="h-3 w-3" />
                {post.readTime}
              </span>
            </div>
            <h1 className="text-display-sm md:text-display-md font-extrabold tracking-tight text-foreground leading-tight">
              {post.h1}
            </h1>
            <div className="flex items-center gap-2 pt-2">
              {authorData ? (
                <Link href={`/authors/${authorData.slug}`} className="flex items-center gap-2 group">
                  <div className="h-8 w-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-extrabold text-[10px] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                    {authorData.avatar}
                  </div>
                  <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                    {post.author}
                  </span>
                </Link>
              ) : (
                <>
                  <div className="h-8 w-8 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground shadow-2xs">
                    <User className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-xs font-bold text-foreground">{post.author}</span>
                </>
              )}
            </div>
          </div>

          {/* Lead/Summary quote box */}
          <div className="border-l-4 border-primary bg-primary/5 rounded-r-2xl p-5 italic text-sm text-foreground/80 leading-relaxed">
            {post.summary}
          </div>

          {/* Article Body Content */}
          <article className="space-y-6 text-sm text-muted-foreground leading-relaxed text-justify">
            {post.paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </article>

          {/* Action CTA Widget (Internal Link Engine: Blog -> Tool) */}
          {toolData && (
            <section className="border border-border rounded-3xl p-6 md:p-8 bg-card/60 relative overflow-hidden shadow-sm">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-[image:var(--gradient-primary)]" />
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="space-y-2">
                  <Badge variant="primary" className="inline-flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Recommended Utility
                  </Badge>
                  <h3 className="text-sm font-bold text-foreground">
                    Try {toolData.name} Online
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
                    {toolData.description}
                  </p>
                </div>
                <Link
                  href={`/tools/${post.ctaToolSlug}`}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/95 shadow-sm transition-all whitespace-nowrap"
                >
                  {post.ctaText}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </section>
          )}

          {/* E-E-A-T Author Information Card */}
          <footer className="border-t border-border pt-8 mt-12">
            <GlassCard className="p-6 flex flex-col sm:flex-row gap-5 items-start bg-muted/20">
              <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-extrabold text-xs flex items-center justify-center shadow-2xs shrink-0">
                {authorData ? authorData.avatar : "ER"}
              </div>
              <div className="space-y-2.5">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-foreground">
                    {authorData ? (
                      <Link href={`/authors/${authorData.slug}`} className="hover:text-primary transition-colors">
                        {post.author}
                      </Link>
                    ) : (
                      post.author
                    )}
                  </span>
                  <span className="text-4xs font-bold uppercase tracking-widest text-primary mt-0.5">
                    Verified Expert Contributor
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {authorData ? authorData.bio : `This guide was written by ${post.author.split(",")[0]}, a vetted specialist in document infrastructure and digital tools. All recommendations are validated against standards to guarantee layout precision, security configuration compliance, and applicant parsing success.`}
                </p>
                {authorData && (
                  <div className="flex gap-4 pt-1 text-[11px] font-semibold text-primary">
                    <a href={authorData.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">LinkedIn</a>
                    <a href={authorData.github} target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub</a>
                    <a href={authorData.website} target="_blank" rel="noopener noreferrer" className="hover:underline">Website</a>
                  </div>
                )}
                <div className="flex gap-2 text-4xs font-semibold text-muted-foreground items-center bg-card rounded-lg px-2.5 py-1.5 border border-border w-fit">
                  <ShieldAlert className="h-3.5 w-3.5 text-primary" />
                  Processed 100% locally in-browser for ultimate security
                </div>
              </div>
            </GlassCard>
          </footer>
        </main>
      </div>
    </>
  );
}
