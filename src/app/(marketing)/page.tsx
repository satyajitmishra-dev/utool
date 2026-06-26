"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion, AnimatePresence, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { WorkspaceCoreVisual } from "@/components/ui/workspace-core-visual";
import { InteractiveWorkflow } from "@/components/ui/interactive-workflow";
import { BentoCard } from "@/components/ui/bento-card";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { PricingCard } from "@/components/ui/pricing-card";
import { Section, SectionHeading, Container, fadeUp, stagger } from "@/components/ui/section";
import { GlassCard } from "@/components/ui/glass-card";
import { AnimatedHeroText } from "@/components/ui/animated-hero-text";
import { cn } from "@/utils/cn";
import { detectCurrency, formatPrice, CurrencyCode, convertInrToCurrency } from "@/utils/currency";
import { useRemoteConfig } from "@/services/remote-config.service";
import QRCode from "qrcode";
import {
  ArrowRight,
  ChevronDown,
  Shield,
  Zap,
  Globe,
  Star,
  Sparkles,
  Layers,
  Lock,
  BarChart3,
  Terminal,
  MousePointerClick,
  Activity,
  User,
  Laptop,
  Briefcase,
  PenTool,
  CheckCircle2,
  LockKeyhole,
  Gauge,
  Heart,
  QrCode,
  FileText,
  Sliders,
  Scale
} from "lucide-react";

/* ═══════════════════════════════════════════════════
   LANDING PAGE (PREMIUM $100M REDESIGN)
   ═══════════════════════════════════════════════════ */
export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden selection:bg-primary/20 selection:text-foreground">
      {/* === PREMIUM BACKGROUND SYSTEM === */}
      {/* Noise texture */}
      <div className="noise-overlay" />

      {/* Dot grid with fade mask */}
      <div className="grid-dot-overlay" />

      {/* Ambient purple radial gradients */}
      <div className="absolute top-[-20%] left-[10%] w-[800px] h-[800px] rounded-full bg-indigo-500/[0.06] blur-[180px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-500/[0.05] blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-indigo-500/[0.04] blur-[140px] pointer-events-none" />

      {/* Animated light beams */}
      <div
        className="absolute top-0 right-[30%] w-[1.5px] h-[120%] bg-gradient-to-b from-transparent via-indigo-500/15 to-transparent pointer-events-none animate-light-beam"
        style={{ "--beam-angle": "25deg" } as React.CSSProperties}
      />
      <div
        className="absolute top-[-10%] left-[25%] w-[1px] h-[120%] bg-gradient-to-b from-transparent via-purple-500/10 to-transparent pointer-events-none animate-light-beam"
        style={{ "--beam-angle": "-18deg", animationDelay: "4s" } as React.CSSProperties}
      />

      {/* 2. Hero Section */}
      <HeroSection />

      {/* 3. Live Product Preview (Dashboard Visual Mockup) */}
      <ProductPreviewSection />

      {/* 4. Social Proof / Metrics */}
      <MetricsSection />

      {/* 5. Interactive Workflow Animation */}
      <Section id="workflow" className="section-divider py-24 sm:py-32">
        <SectionHeading
          badge="Interactive Compiling"
          title="Transform files at the speed of local hardware"
          subtitle="Experience instant, local processing without latency. Drag, convert, and download without ever sending a byte to a external server."
        />
        <InteractiveWorkflow />
      </Section>

      {/* 6. Use Cases by Identity */}
      <UseCasesSection />

      {/* 7. Bento Ecosystem Grid */}
      <BentoEcosystemSection />

      {/* 8. Trust & Privacy Layer */}
      <TrustLayerSection />

      {/* 9. Experience & Speed Layer */}
      <ExperienceLayerSection />

      {/* 10. Pricing Matrices */}
      <PricingSection />

      {/* 11. FAQ Accordion */}
      <FAQSection />

      {/* 12. Final Call-to-Action */}
      <FinalCTASection />
    </div>
  );
}

/* ─── 2. HERO SECTION — Premium Two-Column Layout ─── */
function HeroSection() {
  return (
    <div className="relative min-h-screen flex flex-col justify-center border-b border-white/[0.04] overflow-visible pt-20">
      {/* Hero-specific glow behind WASM engine */}
      <div className="absolute top-[15%] right-[15%] w-[700px] h-[700px] rounded-full bg-purple-500/[0.08] blur-[200px] pointer-events-none" />

      {/* Floating particles in hero */}
      {[...Array(6)].map((_, i) => (
        <div
          key={`hero-particle-${i}`}
          className="absolute rounded-full bg-indigo-400/30 pointer-events-none animate-particle-drift"
          style={{
            width: `${2 + (i % 3)}px`,
            height: `${2 + (i % 3)}px`,
            left: `${15 + i * 14}%`,
            bottom: `${-5 - i * 3}%`,
            animationDuration: `${15 + i * 5}s`,
            animationDelay: `${i * 2.5}s`,
          }}
        />
      ))}

      <Container wide className="grid grid-cols-1 lg:grid-cols-[48fr_52fr] gap-8 lg:gap-4 items-center relative z-10 pt-16 pb-16 lg:pb-24">
        {/* Left Side: Copy & CTA — 48% */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="space-y-8 text-center lg:text-left order-2 lg:order-1"
        >
          <motion.div variants={fadeUp} custom={0}>
            <span className="relative inline-flex items-center gap-1.5 rounded-full border border-indigo-500/25 bg-indigo-500/[0.08] px-4 py-1.5 text-xs font-semibold tracking-wider text-indigo-400 uppercase overflow-hidden group">
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
              <Sparkles className="h-3.5 w-3.5" />
              Utool OS v2.0
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            custom={1}
            className="text-[40px] sm:text-[52px] md:text-[60px] lg:text-[68px] xl:text-[80px] leading-[1.05] font-extrabold text-foreground tracking-[-0.04em]"
          >
            Everything you need.
            <br />
            <AnimatedHeroText />
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-[16px] sm:text-[18px] lg:text-[20px] xl:text-[22px] text-muted-foreground max-w-[620px] leading-relaxed mx-auto lg:mx-0"
          >
            A browser-native workspace that runs entirely in your client.
            Convert, compress, format, and build at the speed of local hardware.
            No server uploads, no queues, no friction.
          </motion.p>

          <motion.div
            variants={fadeUp}
            custom={3}
            className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-4 pt-2"
          >
            {/* Primary CTA — Purple gradient */}
            <Link href="/signup" className="w-full sm:w-auto">
              <button className="group relative inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 px-8 h-14 w-full sm:w-auto text-[15px] font-bold text-white transition-all hover:-translate-y-0.5 active:scale-95 shadow-[0_8px_32px_rgba(99,102,241,0.3)] hover:shadow-[0_12px_40px_rgba(99,102,241,0.45)] cursor-pointer">
                <span className="relative z-10">Open Workspace</span>
                <ArrowRight className="h-4 w-4 relative z-10 transition-transform group-hover:translate-x-0.5" />
                {/* Hover glow overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </Link>

            {/* Secondary CTA — Glass button */}
            <a href="#workflow" className="w-full sm:w-auto">
              <button className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-md px-7 h-14 w-full sm:w-auto text-[15px] font-semibold text-muted-foreground transition-all hover:text-foreground hover:bg-white/[0.08] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)] active:scale-95 cursor-pointer">
                Explore Tools
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </a>
          </motion.div>

          <motion.div
            variants={fadeUp}
            custom={4}
            className="flex items-center justify-center lg:justify-start gap-6 text-caption text-muted-foreground/80 pt-4"
          >
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>WASM compilation</span>
            </div>
            <div className="flex items-center gap-1.5">
              <LockKeyhole className="h-4 w-4 text-emerald-500" />
              <span>Zero server logging</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Side: 3D Workspace Core Element — 52% */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="flex items-center justify-center lg:justify-end relative order-1 lg:order-2"
        >
          {/* Responsive scaling: mobile 70%, tablet 85%, desktop 100% */}
          <div className="transform-gpu scale-[0.65] sm:scale-[0.78] md:scale-[0.85] lg:scale-[0.92] xl:scale-100 origin-center lg:origin-right">
            <WorkspaceCoreVisual />
          </div>
        </motion.div>
      </Container>
    </div>
  );
}

/* ─── 3. LIVE PRODUCT PREVIEW ─── */
function ProductPreviewSection() {
  return (
    <Section id="preview" className="section-divider bg-card/10 py-20">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading
          badge="Product View"
          title="The Interface for high performance"
          subtitle="Minimalist styling designed to reduce cognitive load. Access any pipeline under a unified design scheme."
        />

        {/* Mockup Dashboard Shell */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-[2rem] border border-white/[0.06] bg-card/35 backdrop-blur-xl p-3 sm:p-4 shadow-[0_20px_60px_rgba(0,0,0,0.3)] overflow-hidden group"
        >
          {/* Spotlight shimmer */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          {/* Window Header */}
          <div className="flex items-center justify-between border-b border-white/[0.04] pb-3 mb-4 px-2">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-500/30" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/30" />
              <div className="h-3 w-3 rounded-full bg-green-500/30" />
            </div>
            <div className="flex items-center gap-1.5 bg-muted/60 border border-white/[0.04] rounded-lg px-4 py-1 text-[11px] font-semibold text-muted-foreground select-none">
              <Terminal className="h-3.5 w-3.5 text-primary" />
              <span>utool.in/workspace</span>
            </div>
            <div className="h-4 w-4" /> {/* spacer */}
          </div>

          {/* Inner Dashboard mockup */}
          <div className="grid grid-cols-12 gap-4 rounded-xl overflow-hidden min-h-[380px] bg-background/50 border border-white/[0.04]">
            {/* Mock Sidebar */}
            <div className="col-span-3 border-r border-white/[0.04] p-4 hidden sm:block space-y-6 select-none bg-card/20">
              <div className="flex items-center gap-2 px-2">
                <div className="h-6 w-6 rounded-md bg-primary/20 text-primary flex items-center justify-center">
                  <Layers className="h-3.5 w-3.5" />
                </div>
                <span className="text-[12px] font-bold tracking-tight">OS Workspace</span>
              </div>

              <div className="space-y-1.5">
                <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider px-2">Core engines</div>
                {[
                  { label: "PDF Workstation", active: true },
                  { label: "Image Optimizer", active: false },
                  { label: "QR Constructor", active: false },
                  { label: "Code Compiler", active: false },
                  { label: "Data Formatter", active: false },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={cn(
                      "flex items-center px-2 py-1.5 rounded-lg text-[11px] font-semibold transition-all",
                      item.active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Mock Workspace Panel */}
            <div className="col-span-12 sm:col-span-9 p-6 flex flex-col justify-between">
              {/* Mock Top bar */}
              <div className="flex items-center justify-between border-b border-white/[0.04] pb-4">
                <div>
                  <h4 className="text-body-s font-bold text-foreground">PDF Workstation</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Compress and optimize PDFs client-side</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-7 w-20 rounded bg-muted/70 border border-white/[0.04]" />
                  <div className="h-7 w-12 rounded bg-primary/15 text-primary text-[10px] font-bold flex items-center justify-center">WASM</div>
                </div>
              </div>

              {/* Mock Drop Container */}
              <div className="my-6 flex-1 border border-dashed border-white/[0.08] rounded-xl bg-muted/10 flex flex-col items-center justify-center p-6 text-center select-none">
                <FileText className="h-8 w-8 text-muted-foreground/50 mb-3 animate-pulse" />
                <span className="text-body-s font-semibold text-muted-foreground">Select files to optimize</span>
                <span className="text-[10px] text-muted-foreground/60 mt-1">Accepts up to 100MB per local load</span>
              </div>

              {/* Mock status footer */}
              <div className="flex items-center justify-between text-[10px] text-muted-foreground border-t border-white/[0.04] pt-4">
                <span className="flex items-center gap-1"><Lock className="h-3 w-3 text-emerald-500" /> Client-side sandbox active</span>
                <span>Latency: 0.1ms</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

function AnimatedCounter({ value, label, desc }: { value: string; label: string; desc: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  // Parse numeric part and suffix
  const numMatch = value.match(/[\d,.]+/);
  const suffix = value.replace(/[\d,.]+/, "");
  const targetNum = numMatch ? parseFloat(numMatch[0].replace(/,/g, "")) : 0;
  
  const count = useMotionValue(0);
  const display = useTransform(count, (latest) => {
    if (targetNum >= 10000) {
      return Math.floor(latest).toLocaleString();
    }
    if (targetNum < 100 && targetNum % 1 !== 0) {
      return latest.toFixed(1);
    }
    return Math.floor(latest).toString();
  });

  useEffect(() => {
    if (isInView) {
      animate(count, targetNum, { duration: 2.5, ease: "easeOut" });
    }
  }, [isInView, targetNum, count]);

  return (
    <div ref={ref} className="text-center space-y-2 p-4">
      <h3 className="text-display-l font-extrabold text-foreground tracking-tighter flex items-center justify-center">
        <motion.span>{display}</motion.span>
        <span>{suffix}</span>
      </h3>
      <p className="text-body-s font-semibold text-foreground uppercase tracking-wider">
        {label}
      </p>
      <p className="text-caption text-muted-foreground leading-relaxed">
        {desc}
      </p>
    </div>
  );
}

/* ─── 4. SOCIAL PROOF / METRICS ─── */
function MetricsSection() {
  const stats = [
    { value: "4.8M+", label: "Files transformed", desc: "Compiled directly inside client browsers" },
    { value: "24,000+", label: "Upload hours saved", desc: "Zero network transmission latency" },
    { value: "100%", label: "Absolute Privacy", desc: "Files never hit external server paths" },
    { value: "99.99%", label: "Active SLA Uptime", desc: "Edge-hosted local worker modules" },
  ];

  return (
    <Section className="section-divider py-20 bg-background/50">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-card/60 px-3.5 py-1 text-xs font-semibold text-muted-foreground tracking-wide uppercase mb-8">
          Trusted by digital builders
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
            >
              <AnimatedCounter value={stat.value} label={stat.label} desc={stat.desc} />
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ─── 6. USE CASES BY IDENTITY ─── */
function UseCasesSection() {
  const [activeTab, setActiveTab] = useState<number>(0);

  const useCases = [
    {
      role: "Developers",
      icon: Laptop,
      title: "Clean syntax. Quick formats. Zero friction.",
      description: "Format messy minified JSON, clean code snippets, generate Wi-Fi QR templates, and compile structures securely without pasting client data to unsecured public directories.",
      bullets: ["Client-side Prettier compiler", "JSON schema validation tools", "Static code parser tools", "Offline mode compatibility"],
    },
    {
      role: "Creators",
      icon: PenTool,
      title: "Optimized formats for instant publishing.",
      description: "Bulk resize high-res images, convert heavy files to WebP instantly, build customized branding QR codes for cards, and compile visual assets without waiting for server queues.",
      bullets: ["WASM image optimizations", "WebP and SVG export layers", "Branded QR code designs", "Zero compression loss"],
    },
    {
      role: "Freelancers",
      icon: Briefcase,
      title: "Compile contracts. Sign invoices. Instantly.",
      description: "Merge multiple PDF invoices, split scan pages, write resumes with customized layout engines, and convert documents locally for client deliveries.",
      bullets: ["PDF Mergers & Compressors", "High quality Resume templates", "Secure encryption engines", "One-click downloads"],
    },
    {
      role: "Students",
      icon: User,
      title: "Format projects. Share guides. Fast.",
      description: "Compress study reports to email sizes, convert raw files, print QR tags for sharing online links, and clean document layouts inside the browser.",
      bullets: ["Offline PDF utilities", "Quick Link shortener tools", "Resume builders for careers", "Zero pop-up advertising"],
    },
  ];

  return (
    <Section id="use-cases" className="section-divider py-24 sm:py-32 bg-card/5">
      <SectionHeading
        badge="Identities"
        title="Designed for how you build"
        subtitle="Custom workspaces tailor-made for your specific flow. Pick your profile and feel the speed."
      />

      <div className="mx-auto max-w-5xl px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Navigation Tabs (Left) */}
        <div className="lg:col-span-4 flex flex-row lg:flex-col gap-2.5 overflow-x-auto pb-4 lg:pb-0 scrollbar-none w-full">
          {useCases.map((uc, index) => {
            const Icon = uc.icon;
            return (
              <button
                key={uc.role}
                onClick={() => setActiveTab(index)}
                className={cn(
                  "flex items-center gap-3 px-5 py-3.5 rounded-2xl text-body-s font-semibold transition-all w-full text-left whitespace-nowrap cursor-pointer",
                  activeTab === index
                    ? "bg-card border border-white/[0.08] shadow-sm text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-card/30 border border-transparent"
                )}
              >
                <Icon className={cn("h-4 w-4", activeTab === index ? "text-primary" : "text-muted-foreground")} />
                <span>For {uc.role}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Display (Right) */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-[2rem] border border-white/[0.06] bg-card/45 backdrop-blur-xl p-8 shadow-sm space-y-6"
            >
              <h3 className="text-h3 text-foreground font-bold tracking-tight">
                {useCases[activeTab].title}
              </h3>
              <p className="text-body-m text-muted-foreground leading-relaxed">
                {useCases[activeTab].description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4 border-t border-white/[0.04]">
                {useCases[activeTab].bullets.map((bullet) => (
                  <div key={bullet} className="flex items-center gap-2 text-body-s text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Section>
  );
}

/* ─── 7. BENTO ECOSYSTEM GRID ─── */
function BentoEcosystemSection() {
  const { resolvedTheme } = useTheme();
  const [compressRatio, setCompressRatio] = useState<number>(75);
  const [qrText, setQrText] = useState<string>("utool.in");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [shortUrl, setShortUrl] = useState<string>("launch-day");
  const [minified, setMinified] = useState<boolean>(false);

  // Generate real QR code for utool.in — adapts to theme
  useEffect(() => {
    const generateQR = async () => {
      try {
        const isDark = resolvedTheme === "dark";
        const dataUrl = await QRCode.toDataURL(qrText || "utool.in", {
          color: {
            dark: isDark ? "#e2e8f0" : "#1a1a2e",
            light: isDark ? "#0a0a0a" : "#ffffff",
          },
          margin: 2,
          errorCorrectionLevel: "M",
          width: 256,
        });
        setQrDataUrl(dataUrl);
      } catch (err) {
        console.error("QR generation error:", err);
      }
    };
    generateQR();
  }, [qrText, resolvedTheme]);

  return (
    <Section id="bento-ecosystem" className="section-divider py-24 sm:py-32">
      <SectionHeading
        badge="Ecosystem"
        title="Everything connected in one system"
        subtitle="No longer separate applications with disjointed profiles. One interface, same shortcuts, ultimate performance."
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-5xl mx-auto px-6">

        {/* Card 1: PDF Compressor (Span 7 Columns) */}
        <BentoCard className="md:col-span-7" glowColor="rgba(239, 68, 68, 0.1)">
          <div className="space-y-4">
            <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest bg-red-500/10 border border-red-500/20 px-2.5 py-0.5 rounded-full">
              WASM Engine
            </span>
            <h4 className="text-h3 font-bold text-foreground">PDF Compressing Workstation</h4>
            <p className="text-caption text-muted-foreground">Adjust ratio on-the-fly and observe local file size estimations.</p>

            {/* Interactive sliders widget */}
            <div className="bg-background/40 border border-white/[0.06] rounded-2xl p-4 space-y-4 mt-6">
              <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground uppercase">
                <span>Compression Level</span>
                <span className="text-red-400">{compressRatio}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="95"
                value={compressRatio}
                onChange={(e) => setCompressRatio(parseInt(e.target.value))}
                className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-red-400"
              />
              <div className="flex items-center justify-between text-body-s border-t border-white/[0.04] pt-3">
                <span className="text-muted-foreground">Output Est:</span>
                <span className="font-bold text-foreground">
                  {Math.round(24 * (1 - compressRatio / 100))} MB <span className="text-[11px] text-emerald-400 font-normal">({compressRatio}% saved)</span>
                </span>
              </div>
            </div>
          </div>
        </BentoCard>

        {/* Card 2: QR Customizer (Span 5 Columns - Tall) — Real QR for utool.in */}
        <BentoCard className="md:col-span-5 md:row-span-2" glowColor="rgba(16, 185, 129, 0.1)">
          <div className="flex flex-col justify-between h-full space-y-6">
            <div className="space-y-4">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                QR Generator
              </span>
              <h4 className="text-h3 font-bold text-foreground">Dynamic Brand QR</h4>
              <p className="text-caption text-muted-foreground">Type any endpoint to inspect the vector code rendering.</p>
            </div>

            {/* Interactive QR Input widget with real QR code */}
            <div className="flex flex-col items-center bg-background/40 border border-white/[0.06] rounded-2xl p-5 space-y-4">
              <div className="h-32 w-32 bg-white dark:bg-[#0a0a0a] rounded-xl p-2 flex items-center justify-center shadow-md overflow-hidden">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt={`QR code for ${qrText}`} className="h-full w-full object-contain" />
                ) : (
                  <QrCode className="h-full w-full text-zinc-950 p-2" />
                )}
              </div>
              <input
                type="text"
                value={qrText}
                onChange={(e) => setQrText(e.target.value)}
                placeholder="utool.in"
                className="w-full text-[12px] bg-card border border-white/[0.06] rounded-xl px-3 py-2 text-center text-foreground outline-none focus:border-emerald-500/50 transition-colors"
              />
              <p className="text-[9px] text-muted-foreground text-center">Live QR preview • Scans to <span className="text-emerald-400 font-semibold">{qrText || "utool.in"}</span></p>
            </div>
          </div>
        </BentoCard>

        {/* Card 3: Short URLs (Span 4 Columns) */}
        <BentoCard className="md:col-span-4" glowColor="rgba(139, 92, 246, 0.1)">
          <div className="space-y-4">
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 rounded-full">
              URL Engines
            </span>
            <h4 className="text-h3 font-bold text-foreground">Short Links</h4>

            {/* Interactive Link Widget */}
            <div className="bg-background/40 border border-white/[0.06] rounded-2xl p-4 space-y-3 mt-4">
              <div className="text-[10px] text-muted-foreground font-bold uppercase">Alias Input</div>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-foreground bg-card border border-white/[0.06] rounded-xl px-3 py-2">
                <span className="text-muted-foreground">utool.sh/</span>
                <input
                  type="text"
                  value={shortUrl}
                  onChange={(e) => setShortUrl(e.target.value)}
                  className="bg-transparent outline-none flex-1 font-bold text-primary"
                />
              </div>
            </div>
          </div>
        </BentoCard>

        {/* Card 4: Code compiler (Span 3 Columns) */}
        <BentoCard className="md:col-span-3" glowColor="rgba(59, 130, 246, 0.1)">
          <div className="space-y-4">
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-full">
              WASM Core
            </span>
            <h4 className="text-h3 font-bold text-foreground">JSON Minifier</h4>

            <button
              onClick={() => setMinified(!minified)}
              className="w-full text-left font-mono text-[9px] bg-background/50 border border-white/[0.06] rounded-xl p-3.5 mt-2 h-20 overflow-hidden cursor-pointer hover:border-blue-500/30 transition-all select-none"
            >
              {minified ? (
                <div className="text-blue-400">{"{\"status\":\"success\",\"records\":[{\"id\":1,\"data\":\"wasm_core\"}]}"}</div>
              ) : (
                <div className="text-muted-foreground">
                  {"{\n  \"status\": \"success\",\n  \"records\": [\n    {\n      \"id\": 1\n    }\n  ]\n}"}
                </div>
              )}
            </button>
          </div>
        </BentoCard>

        {/* Card 5: Large Identity Layout (Span 12 Columns) */}
        <BentoCard className="md:col-span-12" glowColor="rgba(245, 158, 11, 0.08)">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3.5 max-w-lg">
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                Unified Ecosystem
              </span>
              <h4 className="text-h2 font-bold text-foreground">A fully integrated system of 60+ components</h4>
              <p className="text-body-s text-muted-foreground leading-relaxed">
                We design tools that feel like one product. The shortcuts, typography, interface guidelines, and responsive layouts remain completely identical.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 max-w-sm justify-center md:justify-end">
              {["PDF Merge", "Image Crop", "WebP Convert", "Wi-Fi QR", "URL Short", "JSON Lint", "SVG Opt", "Base64", "MD to PDF", "CSV Editor", "Regex Test"].map((t) => (
                <span key={t} className="px-3.5 py-1.5 rounded-xl border border-white/[0.06] bg-background/60 text-caption font-semibold text-foreground">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </BentoCard>
      </div>
    </Section>
  );
}

/* ─── 8. TRUST & PRIVACY LAYER ─── */
function TrustLayerSection() {
  const points = [
    {
      icon: Lock,
      title: "Runs entirely in your browser",
      desc: "Utool runs local WebAssembly compiled instances in your client window. Your files do not get sent to any cloud server.",
    },
    {
      icon: Shield,
      title: "Your files stay on your device",
      desc: "Because computations complete locally, there are no databases storing files, no cache paths, and no network storage risks.",
    },
    {
      icon: LockKeyhole,
      title: "No tracker footprints",
      desc: "We do not host cookie-based ad networks or analytical profiles. A premium utility workspace should have absolute transparency.",
    },
  ];

  return (
    <Section id="privacy-trust" className="section-divider py-24 sm:py-32 bg-card/10">
      <SectionHeading
        badge="Security"
        title="Privacy by Architecture, not by promises"
        subtitle="We build tools that can't look at your data even if we wanted to. Absolute compliance out of the box."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto px-6">
        {points.map((p, i) => {
          const Icon = p.icon;
          return (
            <GlassCard key={p.title} hover={false} className="p-8 space-y-4 rounded-3xl border-white/[0.06]">
              <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-body-s font-bold text-foreground tracking-tight">{p.title}</h3>
              <p className="text-caption text-muted-foreground leading-relaxed">{p.desc}</p>
            </GlassCard>
          );
        })}
      </div>
    </Section>
  );
}

/* ─── 9. EXPERIENCE & SPEED LAYER ─── */
function ExperienceLayerSection() {
  const experiences = [
    { icon: Gauge, metric: "Sub-10ms", label: "Interactivity", desc: "No cold starts. React spring-driven click states respond instantly." },
    { icon: Zap, metric: "Zero waiting", label: "No server queues", desc: "Local WASM cores execute compiler tasks immediately on launch." },
    { icon: MousePointerClick, metric: "One click", label: "No registration", desc: "Guest mode operates without logins or account barriers." },
  ];

  return (
    <Section className="section-divider py-24 bg-background">
      <div className="mx-auto max-w-5xl px-6 text-center space-y-16">
        <div className="max-w-2xl mx-auto space-y-4">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2.5 py-0.5 rounded-full">
            Performance
          </span>
          <h2 className="text-h2 font-bold text-foreground">Speed that feels like local software</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {experiences.map((exp) => {
            const Icon = exp.icon;
            return (
              <div key={exp.label} className="space-y-3 p-4 flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-primary/5 flex items-center justify-center text-primary mb-2 border border-primary/10">
                  <Icon className="h-5.5 w-5.5" />
                </div>
                <div className="text-[32px] font-black tracking-tight text-foreground">{exp.metric}</div>
                <div className="text-body-s font-bold text-foreground uppercase tracking-wider">{exp.label}</div>
                <p className="text-caption text-muted-foreground max-w-xs">{exp.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

/* ─── 10. PRICING SECTION ─── */
function PricingSection() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const { pricingConfig, timeRemaining } = useRemoteConfig();

  useEffect(() => {
    setCurrency(detectCurrency());
  }, []);

  const freePrice = formatPrice(0, currency);

  // Pro pricing values
  const proPriceVal = convertInrToCurrency(pricingConfig.pro.price, currency);
  const proOriginalPriceVal = convertInrToCurrency(pricingConfig.pro.originalPrice, currency);
  const proPrice = formatPrice(proPriceVal, currency);
  const proOriginalPrice = pricingConfig.pro.discountEnabled ? formatPrice(proOriginalPriceVal, currency) : undefined;

  // Enterprise pricing values
  const entPriceVal = convertInrToCurrency(pricingConfig.enterprise.price, currency);
  const entOriginalPriceVal = convertInrToCurrency(pricingConfig.enterprise.originalPrice, currency);
  const entPrice = formatPrice(entPriceVal, currency);
  const entOriginalPrice = pricingConfig.enterprise.discountEnabled ? formatPrice(entOriginalPriceVal, currency) : undefined;

  const tiers = [
    {
      name: "Starter",
      price: freePrice,
      period: "forever",
      desc: "For quick actions and casual utility tools.",
      features: [
        "1 action / day (guest user)",
        "3 actions / day (free login)",
        "Standard client rates",
        "Community support paths",
      ],
      cta: "Get started free",
      href: "/signup",
      highlighted: false,
    },
    {
      name: "Pro",
      price: proPrice,
      originalPrice: proOriginalPrice,
      discountPercentage: pricingConfig.pro.discountEnabled ? pricingConfig.pro.discountPercentage : undefined,
      launchOffer: pricingConfig.pro.discountEnabled ? "Launch Offer" : undefined,
      timerText: pricingConfig.pro.discountEnabled && timeRemaining ? timeRemaining : undefined,
      period: "per month",
      desc: "For professionals who build and ship daily.",
      features: [
        "Unlimited local conversions",
        "Access to all 60+ modules",
        "Priority processing limits",
        "10 GB workspace storage",
        "Priority Discord support",
        "CLI & API compilation access",
      ],
      cta: "Start free trial",
      href: "/signup?plan=pro",
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: entPrice,
      originalPrice: entOriginalPrice,
      discountPercentage: pricingConfig.enterprise.discountEnabled ? pricingConfig.enterprise.discountPercentage : undefined,
      launchOffer: pricingConfig.enterprise.discountEnabled ? "Early Access" : undefined,
      timerText: pricingConfig.enterprise.discountEnabled && timeRemaining ? timeRemaining : undefined,
      period: "per month",
      desc: "For scaling engineering and creator crews.",
      features: [
        "Everything in Pro Tier",
        "Custom domain link shortener",
        "Workspace team access rules",
        "Dedicated compile instances",
        "SLA availability contracts",
        "Dedicated Slack support manager",
      ],
      cta: "Contact sales",
      href: "/signup?plan=enterprise",
      highlighted: false,
    },
  ];

  return (
    <Section id="pricing" className="section-divider py-24 bg-card/5">
      <SectionHeading
        badge="Pricing Plans"
        title="Predictable, transparent values"
        subtitle="Start entirely free. Upgrade to Pro when you need limitless local transformations and API compiler pipelines."
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 items-stretch max-w-5xl mx-auto px-6">
        {tiers.map((tier, i) => (
          <motion.div
            key={tier.name}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={i}
          >
            <PricingCard
              name={tier.name}
              price={tier.price}
              originalPrice={tier.originalPrice}
              discountPercentage={tier.discountPercentage}
              launchOffer={tier.launchOffer}
              timerText={tier.timerText}
              period={tier.period}
              description={tier.desc}
              features={tier.features}
              cta={tier.cta}
              href={tier.href}
              highlighted={tier.highlighted}
            />
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ─── 11. FAQ ACCORDION ─── */
function FAQSection() {
  const faqs = [
    {
      q: "How does local client compilation work?",
      a: "Instead of uploading your document (like a PDF or raw PNG) to a cloud database, Utool downloads a compiled WebAssembly script directly to your browser memory when you click on a tool. The file is processed locally using your device's CPU, ensuring absolute data security and zero upload delays.",
    },
    {
      q: "Does Utool store any copies of my files?",
      a: "No. Your files are processed in isolated local script contexts and never sent to our servers. Once you close the tab, the memory is completely recycled by your browser. Your files stay exactly where they belong: on your computer.",
    },
    {
      q: "What payment platforms do you support?",
      a: "We integrate Stripe and Razorpay to support secure global credit cards, debit cards, UPI, Apple Pay, Google Pay, and localized bank transfer channels depending on your region.",
    },
    {
      q: "Can I use Utool offline?",
      a: "Yes. Once the workspace application resources are cached in your browser, the majority of client-side compiler tools (PDF compressing, short links generator, QR engines, minifiers) operate perfectly without an active internet connection.",
    },
    {
      q: "How easy is it to cancel my subscription?",
      a: "Very easy. You can cancel your subscription with one click directly inside your workspace settings menu. Your subscription benefits remain active until the end of your current billing period.",
    },
  ];

  return (
    <Section id="faq" className="section-divider py-24 bg-background">
      <SectionHeading
        badge="FAQ Support"
        title="Got questions? We've got answers."
        subtitle="Learn more about client-side architectures, local compiler mechanics, and secure payment setups."
      />

      <div className="mx-auto max-w-2xl divide-y divide-white/[0.06] px-6">
        {faqs.map((faq, i) => (
          <FAQItem key={i} q={faq.q} a={faq.a} index={i} />
        ))}
      </div>
    </Section>
  );
}

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      custom={index}
      className="py-4"
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-4 text-left group cursor-pointer"
      >
        <span className="text-[15px] font-semibold text-foreground pr-8 group-hover:text-primary transition-colors">
          {q}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform duration-300",
            open ? "rotate-180 text-primary" : ""
          )}
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden"
      >
        <p className="pb-4 text-body-s text-muted-foreground pr-12 leading-relaxed">
          {a}
        </p>
      </motion.div>
    </motion.div>
  );
}

/* ─── 12. FINAL CALL-TO-ACTION ─── */
function FinalCTASection() {
  return (
    <Container className="py-20">
      <div className="relative rounded-[2.5rem] border border-white/[0.06] bg-card/35 backdrop-blur-xl p-10 sm:p-16 text-center overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
        {/* Glow backdrop shapes */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-purple-500/15 rounded-full blur-[60px] pointer-events-none" />

        <div className="max-w-2xl mx-auto space-y-8 relative z-10">
          <span className="inline-flex items-center gap-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
            Ecosystem Access
          </span>
          <h2 className="text-display-xl font-extrabold text-foreground tracking-tighter">
            Ready to upgrade your digital toolbox?
          </h2>
          <p className="text-body-m text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Open the workspace today and experience the speed of the browser-native utility operating system.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/signup">
              <MagneticButton variant="primary" glow={true} className="px-10 py-4 text-body-m">
                Open workspace
                <ArrowRight className="h-4 w-4" />
              </MagneticButton>
            </Link>
          </div>

          <p className="text-caption text-muted-foreground/80">
            Free tier includes 3 daily transformations · Cancel any tier at any time
          </p>
        </div>
      </div>
    </Container>
  );
}
