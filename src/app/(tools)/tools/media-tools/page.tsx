import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ToolCard } from "@/components/ui/tool-card";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import {
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Home,
  ArrowRight,
  Download,
  Video,
  Music,
  FileText,
  Maximize2,
  FileVideo,
  Image as ImageIcon,
  Film,
  Camera,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Free Online Media Tools — 100% Private Video & Audio Tools | utool",
  description: "Download, convert, compress, edit, and enhance video, audio, and images locally in your web browser. Your media never leaves your computer.",
  alternates: {
    canonical: "https://utool.in/tools/media-tools",
  },
  openGraph: {
    title: "Free Online Media Tools — 100% Private & Local | utool",
    description: "Download, convert, compress, edit, and enhance media files in your web browser. No server uploads.",
    url: "https://utool.in/tools/media-tools",
  }
};

const mediaTools = [
  {
    id: "media-downloader",
    name: "Media Downloader",
    description: "Queue and download online media streams client-side where permitted.",
    tag: "download",
    status: "live" as const,
    isPremium: false,
    href: "/tools/media-workspace",
    icon: Download
  },
  {
    id: "video-converter",
    name: "Video Converter",
    description: "Convert video streams between MP4, WebM, and AVI formats locally.",
    tag: "convert",
    status: "live" as const,
    isPremium: false,
    href: "/tools/media-workspace",
    icon: FileVideo
  },
  {
    id: "video-compressor",
    name: "Video Compressor",
    description: "Shrink video filesizes by adjusting bitrates and output presets.",
    tag: "compress",
    status: "live" as const,
    isPremium: false,
    href: "/tools/media-workspace",
    icon: Video
  },
  {
    id: "audio-extractor",
    name: "Audio Extractor",
    description: "Strip video frames and extract clean background audio tracks.",
    tag: "utilities",
    status: "live" as const,
    isPremium: false,
    href: "/tools/media-workspace",
    icon: Music
  },
  {
    id: "gif-creator",
    name: "GIF Creator",
    description: "Compile images or video clips into animated web GIFs.",
    tag: "convert",
    status: "live" as const,
    isPremium: false,
    href: "/tools/media-workspace",
    icon: ImageIcon
  },
  {
    id: "subtitle-generator",
    name: "Subtitle Generator",
    description: "Write transcriptions and burn auto subtitle tracks using AI.",
    tag: "ai",
    status: "pro" as const,
    isPremium: true,
    href: "/premium-tools",
    icon: FileText
  }
];

const faqs = [
  {
    q: "Are my media files safe when processing on Utool?",
    a: "Yes, 100% secure. Utool uses browser-native technologies including WebAssembly (WASM) and local Canvas/HTML5 decoders to compress, convert, and edit files directly in your browser. Since no media is uploaded to remote servers, your files remain completely private."
  },
  {
    q: "Do I need to pay or create an account to use the Media Workspace?",
    a: "No. The core Media Workspace utilities and local converters are completely free with no registration. Premium AI transcription models and upscalers require a pro account."
  },
  {
    q: "Is there a video file size limit for local compression?",
    a: "Unlike cloud compressors that limit uploads to 50MB, Utool runs on your local system's CPU and memory, allowing you to compress large files. Your local hardware is the only limit."
  },
  {
    q: "Can I download videos from any website?",
    a: "Downloads are only supported where users have explicit permission from the content author, or where copyright and platform policies permit downloading. Utool operates client-side and respects intellectual property regulations."
  }
];

export default function MediaToolsCategoryPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://utool.in" },
      { "@type": "ListItem", "position": 2, "name": "Tools", "item": "https://utool.in/tools" },
      { "@type": "ListItem", "position": 3, "name": "Media Tools", "item": "https://utool.in/tools/media-tools" }
    ]
  };

  const faqSchema = {
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
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
            <span className="text-foreground font-bold">Media Tools</span>
          </nav>

          {/* Hero Section */}
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card/25 p-8 md:p-12 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 h-80 w-80 rounded-full bg-indigo-500/5 blur-3xl" />
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
              <div className="lg:col-span-3 space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="primary" className="inline-flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Media Workspace Module
                  </Badge>
                  <Badge variant="success" className="inline-flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    100% Secure Client-Side
                  </Badge>
                </div>
                <h1 className="text-display-l font-extrabold tracking-tight text-foreground leading-tight">
                  Free Online <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Media Tools</span>
                </h1>
                <p className="text-body-m text-muted-foreground leading-relaxed">
                  Download, convert, compress, trim, crop, and enhance video, audio, and image files instantly. Process your media locally in browser storage with absolute confidentiality.
                </p>
              </div>
              <div className="lg:col-span-2 border border-border rounded-2xl p-6 bg-card space-y-4 shadow-sm">
                <h3 className="text-sm font-bold text-foreground">Why Local Media Processing?</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Large video uploads consume bandwidth and expose personal clips. Utool demuxes audio tracks and compresses bitrates client-side, which prevents leaks and provides offline execution speeds.
                </p>
              </div>
            </div>
          </div>

          {/* Tools Grid */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Select Media Utility Spoke</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {mediaTools.map((tool, idx) => {
                const IconComponent = tool.icon;
                return (
                  <Link key={tool.id} href={tool.href} className="group">
                    <GlassCard className="p-5 h-full flex flex-col justify-between hover:border-primary/20 transition-all duration-300">
                      <div>
                        <div className="inline-flex rounded-xl bg-primary/10 p-2.5 text-primary mb-4 group-hover:scale-105 transition-transform duration-300">
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <h3 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors flex items-center gap-1.5">
                          {tool.name}
                          {tool.status === "pro" && <Badge variant="pro" className="text-[8px] px-1.5 py-0.5">PRO</Badge>}
                        </h3>
                        <p className="text-caption text-muted-foreground mt-2 leading-relaxed">
                          {tool.description}
                        </p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-border/60 flex items-center justify-between text-caption font-bold text-primary group-hover:text-primary-hover">
                        <span>Launch Pipeline</span>
                        <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </GlassCard>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <hr className="border-border/60" />

          {/* FAQs Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="space-y-3">
              <h2 className="text-h2 font-extrabold text-foreground tracking-tight">Frequently Asked Questions</h2>
              <p className="text-body-s text-muted-foreground leading-relaxed">
                Have questions about formats, limits, or security specifications? Here is everything you need to know about Utool Media Workspace.
              </p>
            </div>
            <div className="lg:col-span-2">
              <FaqAccordion faqs={faqs} />
            </div>
          </div>

          {/* CTA Banner */}
          <section className="border border-border rounded-3xl p-8 md:p-10 bg-card/50 text-center space-y-4 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-[image:var(--gradient-primary)]" />
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              Ready to launch the integrated Media Workspace?
            </h2>
            <p className="text-xs text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Open the Media OS dashboard to access downloader queue trackers, video bitrates transcoders, audio cutters, and AI enhancers in one tab.
            </p>
            <div className="pt-2">
              <Link
                href="/tools/media-workspace"
                className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/95 shadow-sm transition-all hover:scale-[1.01]"
              >
                Launch Media Workspace
              </Link>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
