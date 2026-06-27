import React from "react";
import { constructMetadata } from "@/utils/seo";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { ShieldCheck, Sparkles, Cpu, Mail, MapPin, Award, User } from "lucide-react";
import { authors } from "@/config/authors";
import Link from "next/link";

export const metadata = constructMetadata({
  title: "About UTool — Privacy-First Document & Development Utilities | utool",
  description: "Learn about the mission behind utool. Read the founder story, our dedication to browser-only computing compliance, and company registration details.",
});

export default function AboutPage() {
  const founder = authors["satyajit-mishra"];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-16">
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
            UTool was built because we were tired of uploading sensitive invoices, client contracts, private resumes, and network keys to unchecked cloud servers just to perform basic conversions. We believe browser runtimes are powerful enough to keep your files local.
          </p>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard className="p-6 space-y-3" hover={false}>
            <div className="h-9 w-9 items-center justify-center rounded-xl bg-primary/5 text-primary flex">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground">100% Client-Side Processing</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every operation—from merging PDF pages to compiling Wi-Fi QR networks—is executed in-memory directly on your CPU. No files ever traverse the internet.
            </p>
          </GlassCard>

          <GlassCard className="p-6 space-y-3" hover={false}>
            <div className="h-9 w-9 items-center justify-center rounded-xl bg-primary/5 text-primary flex">
              <Cpu className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground">WebAssembly Speeds</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              By utilizing next-generation technologies like WebAssembly, we process data at local CPU speeds. We eliminate network upload queues and paywalls.
            </p>
          </GlassCard>
        </div>

        {/* Founder Section */}
        <section className="space-y-6">
          <h2 className="text-h3 font-bold text-foreground flex items-center gap-2">
            <User className="h-5.5 w-5.5 text-primary" />
            The Founder's Story
          </h2>
          <GlassCard className="p-8 flex flex-col md:flex-row gap-8 items-start bg-muted/10">
            <div className="h-20 w-20 rounded-3xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-black text-display-xs flex items-center justify-center shadow-md shrink-0">
              SM
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-foreground">Satyajit Mishra</h3>
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mt-0.5">Founder & Lead Developer</p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed text-justify">
                "I started building UTool in 2026 after auditing the privacy policies of popular PDF and formatting websites. I was shocked to find that almost all of them send your documents to remote third-party databases, storing them in temporary caches for hours. I knew that with modern JavaScript engines and WebAssembly, we could run these compilers directly in the client browser sandbox.
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed text-justify">
                UTool is built on transparency. We do not run intrusive ad-trackers, we don't store your documents, and our tools run completely offline. Our goal is to own the most trusted, privacy-first workspace on the web."
              </p>
              
              <div className="flex gap-4 pt-2">
                <a href={founder.linkedin} target="_blank" rel="noopener noreferrer" className="text-caption text-primary hover:underline font-semibold">LinkedIn Profile</a>
                <a href={founder.github} target="_blank" rel="noopener noreferrer" className="text-caption text-primary hover:underline font-semibold">GitHub Profile</a>
                <a href={founder.website} target="_blank" rel="noopener noreferrer" className="text-caption text-primary hover:underline font-semibold">Personal Website</a>
              </div>
            </div>
          </GlassCard>
        </section>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border border-border rounded-3xl p-6 bg-card text-center shadow-xs">
          <div className="space-y-1">
            <span className="text-display-xs font-black text-primary">0</span>
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Files Saved on Server</p>
          </div>
          <div className="h-px md:h-12 w-full md:w-px bg-border" />
          <div className="space-y-1">
            <span className="text-display-xs font-black text-primary">100%</span>
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Local Processing</p>
          </div>
          <div className="h-px md:h-12 w-full md:w-px bg-border" />
          <div className="space-y-1">
            <span className="text-display-xs font-black text-primary">&lt;100ms</span>
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Average Compile Latency</p>
          </div>
        </div>

        {/* Company & Support Information */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-border/40 pt-12">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <Award className="h-4.5 w-4.5 text-primary" />
              Corporate Identity
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              UTool is owned and operated by UTool Technologies. We develop client-side utility platforms, PWA compilers, and serverless edge link redirections.
            </p>
            <div className="text-[10px] font-mono text-muted-foreground/80 space-y-1 bg-card/40 p-4 border border-border rounded-xl">
              <p className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Barasat Kulpi Road, West Bengal, India</p>
              <p><strong>Registration ID:</strong> IN-OR2026DEVSM12</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <Mail className="h-4.5 w-4.5 text-primary" />
              Support & Communication
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We respond to all support tickets, feature requests, and business license inquiries under 24 hours. For account billing and cancellation support, reach our email.
            </p>
            <div className="text-xs font-bold text-primary flex flex-col gap-1.5 bg-card/40 p-4 border border-border rounded-xl">
              <p>Email: support@utool.in</p>
              <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Typical Response Time: &lt; 24 Hours</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
