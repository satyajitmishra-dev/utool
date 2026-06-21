import React from "react";
import { constructMetadata } from "@/utils/seo";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { ShieldCheck, Sparkles, Cpu, Lock } from "lucide-react";

export const metadata = constructMetadata({
  title: "About Toolzy — Privacy-First Document & Development Utilities",
  description: "Learn about Toolzy's mission to rebuild online utilities from scratch using 100% browser-only client-side computation for absolute compliance.",
});

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
        {/* Header */}
        <div className="space-y-4 max-w-2xl">
          <Badge variant="primary" className="inline-flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            Our Mission
          </Badge>
          <h1 className="text-display-sm md:text-display-md font-extrabold tracking-tight text-foreground leading-tight">
            We believe your data belongs to you.
          </h1>
          <p className="text-body-sm text-muted-foreground leading-relaxed">
            Toolzy was built by developers who were tired of uploading sensitive PDF invoices, Wi-Fi credentials, and resume histories to mysterious, unverified cloud servers just to perform basic modifications.
          </p>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard className="p-6 space-y-3">
            <div className="h-9 w-9 items-center justify-center rounded-xl bg-primary/5 text-primary flex">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground">100% Client-Side Computing</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every operation—from stitching PDFs to compiling QR code matrices—is performed directly on your local device CPU. Your private documents never touch our servers.
            </p>
          </GlassCard>

          <GlassCard className="p-6 space-y-3">
            <div className="h-9 w-9 items-center justify-center rounded-xl bg-primary/5 text-primary flex">
              <Cpu className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground">High Performance Speed</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              By utilizing next-generation web technologies like WebAssembly and optimized JavaScript, we eliminate network upload queues and deliver results in milliseconds.
            </p>
          </GlassCard>
        </div>

        {/* Long Text */}
        <div className="space-y-6 text-xs text-muted-foreground leading-relaxed max-w-3xl text-justify">
          <h2 className="text-base font-bold text-foreground">A New Paradigm for Web Utilities</h2>
          <p>
            Traditional utility sites like iLovePDF, Smallpdf, and Canva online have revolutionized document modification, but they make a critical design trade-off: they force you to send your files to their backend systems. In an era of strict data protection laws (GDPR, HIPAA, SOC2), uploading documents that contain employee records, tax invoices, or personal signatures is a major risk.
          </p>
          <p>
            Toolzy is built on a simple premise: modern browser runtimes are powerful enough to execute compilers, image processors, and text analyzers locally. By writing specialized client-side scripts, we turn your browser into a local workstation. This ensures absolute compliance, total privacy, and offline processing capability.
          </p>
          <p>
            Whether you are a developer formatting JSON structures, a marketing lead creating static Wi-Fi QR codes, or a job applicant editing a resume, Toolzy provides the secure sandbox environment you need to get things done without exposure.
          </p>
        </div>

        {/* Trust Stats */}
        <div className="border border-border rounded-3xl p-6 bg-card flex flex-col md:flex-row gap-6 md:items-center justify-around text-center shadow-xs">
          <div className="space-y-1">
            <span className="text-display-xs font-black text-primary">0</span>
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Files Saved on Server</p>
          </div>
          <div className="h-px md:h-12 w-full md:w-px bg-border" />
          <div className="space-y-1">
            <span className="text-display-xs font-black text-primary">100%</span>
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Browser-Only Merging</p>
          </div>
          <div className="h-px md:h-12 w-full md:w-px bg-border" />
          <div className="space-y-1">
            <span className="text-display-xs font-black text-primary">Millisecond</span>
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Average Processing Time</p>
          </div>
        </div>
      </div>
    </div>
  );
}
