import React from "react";
import Link from "next/link";
import { constructMetadata } from "@/utils/seo";
import { blogPosts } from "@/config/blog-data";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import {
  BookOpen,
  Calendar,
  Clock,
  User,
  ArrowRight,
  ChevronRight,
  Home,
} from "lucide-react";

export const metadata = constructMetadata({
  title: "utool Blog — Document Guides, QR Customization & Career Hacks",
  description: "Expert tips on PDF workflows, ATS-friendly resumes, QR code marketing, and links optimization to improve your daily digital workflows.",
});

export default function BlogCatalogPage() {
  const posts = Object.values(blogPosts);

  // Group posts by category
  const categories = Array.from(new Set(posts.map((p) => p.category)));

  // Breadcrumb schema
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
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-foreground pt-24 md:pt-28">
        <main className="max-w-6xl w-full mx-auto px-6 py-10 space-y-12">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <Link href="/" className="hover:text-foreground flex items-center gap-1 transition-colors">
              <Home className="h-3.5 w-3.5" />
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-bold">Blog</span>
          </nav>

          {/* Page Header */}
          <div className="space-y-4 max-w-xl">
            <Badge variant="primary" className="inline-flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              Resource Hub
            </Badge>
            <h1 className="text-display-sm font-extrabold tracking-tight text-foreground leading-tight">
              utool Blog & Guides
            </h1>
            <p className="text-body-sm text-muted-foreground leading-relaxed">
              Explore step-by-step guides, technical analysis, and developer hacks to optimize document rendering, career building, and marketing redirection structures.
            </p>
          </div>

          {/* Categories & Articles Section */}
          <div className="space-y-16">
            {categories.map((category) => {
              const categoryPosts = posts.filter((p) => p.category === category);
              return (
                <div key={category} className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-border pb-3">
                    <h2 className="text-lg font-extrabold text-foreground tracking-tight">
                      {category}
                    </h2>
                    <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                      {categoryPosts.length} {categoryPosts.length === 1 ? "article" : "articles"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {categoryPosts.map((post) => (
                      <GlassCard
                        key={post.slug}
                        className="p-6 flex flex-col justify-between hover:border-primary/20 transition-all duration-300 group shadow-xs hover:shadow-md"
                      >
                        <div className="space-y-4">
                          {/* Post Meta */}
                          <div className="flex flex-wrap gap-4 text-4xs font-bold text-muted-foreground uppercase tracking-widest">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {post.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {post.readTime}
                            </span>
                          </div>

                          <h3 className="text-base font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                            <Link href={`/blog/${post.slug}`} className="focus:outline-none">
                              {post.h1}
                            </Link>
                          </h3>

                          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                            {post.summary}
                          </p>
                        </div>

                        {/* Footer info & CTA */}
                        <div className="border-t border-border mt-6 pt-4 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground">
                              <User className="h-3.5 w-3.5" />
                            </div>
                            <span className="text-[10px] font-bold text-foreground truncate max-w-[150px]">
                              {post.author}
                            </span>
                          </div>

                          <Link
                            href={`/blog/${post.slug}`}
                            className="inline-flex items-center gap-1.5 text-4xs font-extrabold uppercase tracking-wider text-primary group-hover:gap-2.5 transition-all"
                          >
                            Read Article
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA Footer banner */}
          <section className="border border-border rounded-3xl p-8 md:p-10 bg-card/50 text-center space-y-4 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-[image:var(--gradient-primary)]" />
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              Ready to execute your workspace tasks?
            </h2>
            <p className="text-xs text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Skip the reading and compile your files directly. Access PDF compilers, QR workstations, and link shorteners in our comprehensive catalog.
            </p>
            <div className="pt-2">
              <Link
                href="/tools"
                className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/95 shadow-sm transition-all hover:scale-[1.01]"
              >
                Explore Developer Catalog
              </Link>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
