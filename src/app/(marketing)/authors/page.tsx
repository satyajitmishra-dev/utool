import React from "react";
import { constructMetadata } from "@/utils/seo";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { authors } from "@/config/authors";
import Link from "next/link";
import { ArrowRight, User } from "lucide-react";

export const metadata = constructMetadata({
  title: "UTool Editorial Team & Technical Experts | utool",
  description: "Meet the experts behind utool's technical guides and tools. Read profiles of software engineers, cybersecurity administrators, and career coaches.",
});

export default function AuthorsPage() {
  const authorsList = Object.values(authors);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
        {/* Header */}
        <div className="space-y-4 max-w-xl">
          <Badge variant="primary" className="inline-flex items-center gap-1">
            <User className="h-3.5 w-3.5" />
            Our Authors
          </Badge>
          <h1 className="text-display-sm font-extrabold tracking-tight text-foreground leading-tight">
            Meet Our Experts
          </h1>
          <p className="text-body-sm text-muted-foreground leading-relaxed">
            UTool tutorials, reviews, and architectural posts are written by vetted engineers and domain experts to guarantee accuracy and compliance.
          </p>
        </div>

        {/* Authors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {authorsList.map((author) => (
            <GlassCard key={author.slug} className="p-8 flex gap-6 items-start bg-card/25" hover={true}>
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 text-indigo-400 font-extrabold text-xs flex items-center justify-center shrink-0">
                {author.avatar}
              </div>
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground hover:text-primary transition-colors">
                    <Link href={`/authors/${author.slug}`}>{author.name}</Link>
                  </h3>
                  <p className="text-[10px] font-semibold text-primary uppercase tracking-wider mt-0.5">{author.role}</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                  {author.bio}
                </p>
                <Link href={`/authors/${author.slug}`} className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:text-primary/80 transition-colors pt-2">
                  <span>View Full Profile</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
