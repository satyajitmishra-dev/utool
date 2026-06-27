import React from "react";
import { constructMetadata } from "@/utils/seo";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { Cpu, ShieldCheck, Zap, WifiOff, FileCode, CheckCircle2 } from "lucide-react";

export const metadata = constructMetadata({
  title: "Why Local Processing? Browser-Native Security Explained | utool",
  description: "Learn how utool uses WebAssembly and modern browser APIs to process PDFs, images, and code 100% locally on your device without cloud server uploads.",
});

export default function WhyLocalProcessingPage() {
  const mechanisms = [
    {
      icon: Cpu,
      title: "WebAssembly (WASM)",
      desc: "WebAssembly allows us to compile high-performance desktop libraries (written in C++ or Rust, such as FFmpeg or QPDF) into lightweight binaries that run directly in your browser tab at near-native execution speeds."
    },
    {
      icon: FileCode,
      title: "Modern Browser APIs",
      desc: "By utilizing FileSystem APIs, Web Streams, and volatile browser memory, files are read and modified dynamically. The original data resides entirely on your local filesystem and never traverses the network."
    },
    {
      icon: ShieldCheck,
      title: "Isolated Client Sandbox",
      desc: "Every process is containerized by your browser's strict security sandbox model. This prevents cross-site scripting (XSS), script injections, and eliminates server-side database hacking risks entirely."
    },
    {
      icon: WifiOff,
      title: "Offline Uptime Capacity",
      desc: "Since all script engines and compilers are downloaded and cached in your browser session, you can run tools completely offline without any active internet connection."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
        {/* Header */}
        <div className="space-y-4 max-w-3xl">
          <Badge variant="primary" className="inline-flex items-center gap-1">
            <Cpu className="h-3 w-3" />
            Technology Guide
          </Badge>
          <h1 className="text-display-sm md:text-display-md font-extrabold tracking-tight text-foreground leading-tight">
            How Browser-Native Processing Works
          </h1>
          <p className="text-body-sm text-muted-foreground leading-relaxed">
            Traditionally, websites processing PDFs, images, or code require you to upload files to their servers. We rebuilt these utility workflows from scratch to execute 100% locally on your own machine.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border border-border/40 rounded-[2rem] p-8 bg-card/10 backdrop-blur-md">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2">
              <span>✕</span> Traditional Cloud Utilities
            </h3>
            <ul className="space-y-3 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">•</span>
                <span>Requires uploading documents to cloud servers, wasting upload bandwidth.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">•</span>
                <span>Exposes invoices, resumes, and medical records to security leaks and database breaches.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">•</span>
                <span>Violates compliance laws (GDPR, HIPAA, CCPA) by transmitting personal customer details.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">•</span>
                <span>Subject to server queue delays, server downtime, and paywalls.</span>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4 md:border-l md:border-border/30 md:pl-8">
            <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
              <span>✓</span> utool Browser-Native Platform
            </h3>
            <ul className="space-y-3 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span>0 bytes transferred. Document processing happens entirely inside client memory.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span>Files never hit external drives or servers, guaranteeing absolute data confidentiality.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span>Compliant by architecture. You do not need standard data controller agreements since we collect nothing.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span>No queue wait times. Process multi-megabyte datasets instantly at local hardware speeds.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Technology Cards */}
        <div className="space-y-6">
          <h2 className="text-h3 font-bold text-foreground">The Architectural Engines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mechanisms.map((mech) => {
              const Icon = mech.icon;
              return (
                <GlassCard key={mech.title} className="p-6 space-y-3">
                  <div className="h-9 w-9 items-center justify-center rounded-xl bg-primary/5 text-primary flex">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xs font-bold text-foreground">{mech.title}</h3>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {mech.desc}
                  </p>
                </GlassCard>
              );
            })}
          </div>
        </div>

        {/* Performance and Compliance stats */}
        <div className="space-y-6 text-xs text-muted-foreground leading-relaxed max-w-3xl text-justify">
          <h2 className="text-base font-bold text-foreground">Eliminating the Network Bottleneck</h2>
          <p>
            Traditional utility workflows consume gigabytes of bandwidth. When you upload a 50MB PDF report to split or merge, your browser must package, upload, wait for the server to process, and then download the resultant file. On average network configurations, this takes between 15 to 45 seconds.
          </p>
          <p>
            With browser-native compilers, that same operation takes under <strong>100 milliseconds</strong>. By leveraging the client's multi-core hardware threads directly, the output is ready instantly.
          </p>
          <p>
            utool is designed to bring premium, desktop-grade utilities to a simple web client window. Experience performance, privacy, and simplicity without compromise.
          </p>
        </div>
      </div>
    </div>
  );
}
