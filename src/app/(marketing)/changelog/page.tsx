import React from "react";
import { constructMetadata } from "@/utils/seo";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { Sparkles, Calendar, ArrowRight, Zap, ShieldCheck } from "lucide-react";
import Link from "next/link";

export const metadata = constructMetadata({
  title: "UTool Public Changelog — Release Notes & Performance Upgrades | utool",
  description: "Browse the utool public release notes. Track client-side compilation improvements, WebAssembly performance speedups, and newly released browser tools.",
});

export default function ChangelogPage() {
  const releases = [
    {
      version: "v1.2.0",
      date: "June 26, 2026",
      badge: "Performance Release",
      title: "Local Media Compression Core",
      changes: [
        "Integrated WebAssembly FFmpeg decoders running 100% locally inside the browser's Sandbox.",
        "Added local MP4/WebM compression preset options: 'Email Friendly' and 'Slack Compact'.",
        "Decreased client-side media demux latency by 35% using V8 compiler optimizations."
      ],
      icon: Zap
    },
    {
      version: "v1.1.0",
      date: "June 18, 2026",
      badge: "Feature Release",
      title: "Wi-Fi Auto-Login QR Codes & PDF stitching",
      changes: [
        "Released the Wi-Fi auto-login constructor producing QR codes thatスマートフォン can parse to join networks automatically.",
        "Improved local PDF merge quality: rearranged objects instead of rasterizing to preserve vector elements and fonts.",
        "Created client-side password extraction utilities for unencrypted PDFs."
      ],
      icon: Sparkles
    },
    {
      version: "v1.0.0",
      date: "June 10, 2026",
      badge: "Major Launch",
      title: "UTool Utility Operating System Launch",
      changes: [
        "Launched UTool platform with 60+ browser-native utilities (PDF, Image, Text, and Code formatters).",
        "Established zero-data retention architecture where no document files are sent to remote servers.",
        "Implemented high-performance edge link redirection caching via Upstash Redis databases."
      ],
      icon: ShieldCheck
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="max-w-3xl mx-auto px-6 py-16 space-y-12">
        {/* Header */}
        <div className="space-y-4 max-w-xl">
          <Badge variant="primary" className="inline-flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5" />
            Release Log
          </Badge>
          <h1 className="text-display-sm font-extrabold tracking-tight text-foreground leading-tight">
            Product Changelog
          </h1>
          <p className="text-body-sm text-muted-foreground leading-relaxed">
            Follow the latest feature releases, client performance speedups, and security updates compiled by our engineering team.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative border-l border-border/40 pl-6 ml-4 space-y-12">
          {releases.map((release) => {
            const Icon = release.icon;
            return (
              <div key={release.version} className="relative group">
                {/* Node icon */}
                <div className="absolute -left-[38px] top-1.5 h-6 w-6 rounded-full bg-background border border-primary flex items-center justify-center text-primary shadow-xs z-10 transition-transform group-hover:scale-115">
                  <Icon className="h-3 w-3" />
                </div>

                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-mono font-bold text-primary">{release.version}</span>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {release.date}
                    </span>
                    <Badge variant="primary" className="text-[9px] font-bold tracking-widest">{release.badge}</Badge>
                  </div>
                  
                  <h3 className="text-sm font-bold text-foreground">{release.title}</h3>

                  <GlassCard className="p-6">
                    <ul className="space-y-2.5 text-xs text-muted-foreground">
                      {release.changes.map((change, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className="text-primary mt-1">•</span>
                          <span className="leading-relaxed">{change}</span>
                        </li>
                      ))}
                    </ul>
                  </GlassCard>
                </div>
              </div>
            );
          })}
        </div>

        <div className="border border-border/40 rounded-3xl p-6 bg-card/20 text-center space-y-4 max-w-xl mx-auto shadow-xs">
          <h4 className="text-xs font-bold text-foreground">Have a tool request or found a bug?</h4>
          <p className="text-[11px] text-muted-foreground max-w-md mx-auto leading-relaxed">
            We release updates weekly. Let us know what local client-side tool you would like to see next in the UTool workspace.
          </p>
          <Link href="/contact" className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:text-primary/80 transition-colors pt-2">
            <span>Reach out to Support</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
