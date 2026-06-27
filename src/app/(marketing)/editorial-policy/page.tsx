import React from "react";
import { constructMetadata } from "@/utils/seo";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { CheckSquare, ShieldCheck, Heart, Scroll } from "lucide-react";

export const metadata = constructMetadata({
  title: "Editorial Policy & Quality Standards | utool",
  description: "Learn about the editorial policy, review guidelines, and security verification standards followed by the utool team to create accurate, privacy-first guides.",
});

export default function EditorialPolicyPage() {
  const policies = [
    {
      icon: CheckSquare,
      title: "Vetted Information & Accuracy",
      desc: "All technical tutorials, command lines, and tool guides are written and tested by experienced engineers. We verify that all steps are accurate, functional, and up to date."
    },
    {
      icon: ShieldCheck,
      title: "Security Verification",
      desc: "We ensure that any tool workflow or library recommended in our guides complies with user-side sandboxing. We do not promote tools that upload customer files to unchecked databases."
    },
    {
      icon: Heart,
      title: "Zero Sponsored Influence",
      desc: "Our comparisons and reviews are entirely objective. We do not accept sponsorship fees to rank low-quality, cloud-based tools that compromise user privacy."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="max-w-3xl mx-auto px-6 py-16 space-y-12">
        {/* Header */}
        <div className="space-y-4 max-w-xl">
          <Badge variant="primary" className="inline-flex items-center gap-1">
            <Scroll className="h-3.5 w-3.5" />
            Editorial Policy
          </Badge>
          <h1 className="text-display-sm font-extrabold tracking-tight text-foreground leading-tight">
            Our Quality & Content Standards
          </h1>
          <p className="text-body-sm text-muted-foreground leading-relaxed">
            At utool, we publish guidelines, comparisons, and technical guides that you can trust. We hold our content writers and reviewers to high compliance standards.
          </p>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 gap-6">
          {policies.map((policy) => {
            const Icon = policy.icon;
            return (
              <GlassCard key={policy.title} className="p-6 flex flex-col sm:flex-row gap-5 items-start">
                <div className="h-10 w-10 rounded-2xl bg-primary/5 text-primary flex items-center justify-center shrink-0">
                  <Icon className="h-5.5 w-5.5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs font-bold text-foreground">{policy.title}</h3>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {policy.desc}
                  </p>
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Policy Text */}
        <div className="space-y-6 text-xs text-muted-foreground leading-relaxed text-justify">
          <h2 className="text-sm font-bold text-foreground">Content Creation Workflow</h2>
          <p>
            Every guide or blog post published on the utool blog goes through a multi-step review pipeline. First, the topic is researched to identify genuine user problems in PDF management, image conversion, QR coding, or developer tools. Second, the author validates the solution by executing it inside the utool workspace sandbox to ensure it works.
          </p>
          <p>
            Third, our engineering editors double-check the draft for clarity, readability, and technical accuracy. We avoid jargon and prioritize simple, step-by-step answers that help readers solve their problems in under 5 minutes.
          </p>
          <h2 className="text-sm font-bold text-foreground">Author Experience & Credentials</h2>
          <p>
            We only work with contributors who have verified credentials in software engineering, cybersecurity, tech recruiting, or digital growth. Every author bio features links to their professional website, GitHub, and LinkedIn profile to maintain transparency and trustworthiness.
          </p>
          <h2 className="text-sm font-bold text-foreground">Corrections & Feedback</h2>
          <p>
            If you notice an error, outdated command, or broken link in any of our guides, please let us know. We review all user reports and edit articles within 24 hours of receiving feedback. You can reach our editorial desk directly at <span className="text-primary font-semibold">editorial@utool.in</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
