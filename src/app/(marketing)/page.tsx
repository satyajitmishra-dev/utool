"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion, AnimatePresence, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { ModularHeroVisual } from "@/components/ui/modular-hero-visual";
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
  Scale,
  Cpu,
  Camera,
  Video
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

      {/* 3. Trust Numbers (Metrics) */}
      <MetricsSection />

      {/* 4. Benefits Section */}
      <BenefitsSection />

      {/* 5. Popular Categories */}
      <PopularCategoriesSection />

      {/* 6. Featured Tools */}
      <FeaturedToolsSection />

      {/* 7. Why UTool Section */}
      <WhyUToolSection />

      {/* 8. Privacy Section (Trust & Privacy Layer) */}
      <TrustLayerSection />

      {/* 9. Testimonials Section */}
      <TestimonialsSection />

      {/* 10. FAQ Accordion */}
      <FAQSection />

      {/* 11. Final Call-to-Action */}
      <FinalCTASection />
    </div>
  );
}

/* ─── 2. HERO SECTION — Premium Two-Column Layout ─── */
const HERO_CONFIGS = {
  wasm: {
    id: "wasm",
    badge: "WASM Compiling Engines",
    badgeIcon: Cpu,
    title: "Everything You Need.",
    gradientTitle: "Nothing Leaves Your Device.",
    intro: "Convert PDFs, edit images, optimize files, generate resumes, and use powerful developer tools directly in your browser. No uploads. No waiting. Complete privacy.",
    bullets: ["⚡ Fast", "🔒 Private", "💻 Browser-based", "🌍 Free", "❤️ No Installation"],
    primaryCta: "Start Using Tools",
    primaryLink: "/tools",
    secondaryCta: "Why Local Processing?",
    secondaryLink: "/why-local-processing",
    glowClass: "bg-purple-500/[0.07]"
  },
  media: {
    id: "media",
    badge: "Media Workspace Module",
    badgeIcon: Sparkles,
    title: "Everything You Need.",
    gradientTitle: "Nothing Leaves Your Device.",
    intro: "Convert PDFs, edit images, optimize files, generate resumes, and use powerful developer tools directly in your browser. No uploads. No waiting. Complete privacy.",
    bullets: ["⚡ Fast", "🔒 Private", "💻 Browser-based", "🌍 Free", "❤️ No Installation"],
    primaryCta: "Start Using Tools",
    primaryLink: "/tools",
    secondaryCta: "Why Local Processing?",
    secondaryLink: "/why-local-processing",
    glowClass: "bg-indigo-500/[0.07]"
  },
  ai: {
    id: "ai",
    badge: "AI Workspace Module",
    badgeIcon: Sparkles,
    title: "Everything You Need.",
    gradientTitle: "Nothing Leaves Your Device.",
    intro: "Convert PDFs, edit images, optimize files, generate resumes, and use powerful developer tools directly in your browser. No uploads. No waiting. Complete privacy.",
    bullets: ["⚡ Fast", "🔒 Private", "💻 Browser-based", "🌍 Free", "❤️ No Installation"],
    primaryCta: "Start Using Tools",
    primaryLink: "/tools",
    secondaryCta: "Why Local Processing?",
    secondaryLink: "/why-local-processing",
    glowClass: "bg-rose-500/[0.07]"
  }
};

function HeroSection() {
  const [activeHero, setActiveHero] = useState<"wasm" | "media" | "ai">("wasm");
  const activeConfig = HERO_CONFIGS[activeHero];
  const BadgeIcon = activeConfig.badgeIcon;

  return (
    <div className="relative min-h-screen flex flex-col justify-center border-b border-white/[0.04] overflow-visible pt-20">
      {/* Hero-specific glow behind active config */}
      <div className={cn(
        "absolute top-[15%] right-[15%] w-[700px] h-[700px] rounded-full blur-[200px] pointer-events-none transition-all duration-1000",
        activeConfig.glowClass
      )} />

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

      <Container wide className="grid grid-cols-1 lg:grid-cols-[46fr_54fr] gap-8 lg:gap-4 items-center relative z-10 pt-16 pb-16 lg:pb-24">
        
        {/* Left Side: Copy & CTA — 46% */}
        <div className="flex flex-col space-y-6 order-2 lg:order-1 items-center lg:items-start">
          
          {/* Vercel/Linear Style Segment Controller */}
          <div className="inline-flex rounded-full border border-white/[0.08] bg-white/[0.03] p-1 mb-2 shadow-inner">
            {[
              { id: "wasm" as const, label: "WASM Engines" },
              { id: "media" as const, label: "Media Hub" },
              { id: "ai" as const, label: "AI Workspaces" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveHero(tab.id)}
                className={cn(
                  "rounded-full px-4.5 py-1.5 text-[10px] font-extrabold tracking-wider uppercase transition-all duration-300 cursor-pointer select-none",
                  activeHero === tab.id
                    ? "bg-indigo-600 text-white shadow-[0_4px_12px_rgba(99,102,241,0.25)] border-white/5"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeHero}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start"
            >
              <div>
                <span className="relative inline-flex items-center gap-1.5 rounded-full border border-indigo-500/25 bg-indigo-500/[0.08] px-4 py-1.5 text-xs font-semibold tracking-wider text-indigo-400 uppercase overflow-hidden group">
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                  <BadgeIcon className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
                  {activeConfig.badge}
                </span>
              </div>

              <h1 className="text-[36px] sm:text-[48px] md:text-[56px] lg:text-[60px] xl:text-[76px] leading-[1.05] font-extrabold text-foreground tracking-[-0.04em]">
                {activeConfig.title}
                <br />
                <span className={cn(
                  "bg-gradient-to-r bg-clip-text text-transparent transition-all duration-500",
                  activeHero === "wasm" && "from-purple-400 via-indigo-400 to-blue-400",
                  activeHero === "media" && "from-indigo-400 via-purple-400 to-pink-400",
                  activeHero === "ai" && "from-pink-400 via-rose-400 to-purple-400"
                )}>
                  {activeConfig.gradientTitle}
                </span>
              </h1>

              <div className="space-y-4 max-w-[620px]">
                <p className="text-[15px] sm:text-[17px] lg:text-[18px] text-muted-foreground leading-relaxed">
                  {activeConfig.intro}
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-2">
                  {[
                    { label: "Fast", icon: Zap, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
                    { label: "Private", icon: Lock, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
                    { label: "Browser-based", icon: Laptop, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
                    { label: "Free", icon: Globe, color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" },
                    { label: "No Installation", icon: Heart, color: "text-rose-400 bg-rose-500/10 border-rose-500/20" }
                  ].map((promise) => {
                    const PromiseIcon = promise.icon;
                    return (
                      <div
                        key={promise.label}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[11px] font-bold tracking-wider uppercase backdrop-blur-md transition-all duration-300 hover:scale-105",
                          promise.color
                        )}
                      >
                        <PromiseIcon className="h-3.5 w-3.5" />
                        <span>{promise.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 w-full sm:w-auto">
                {/* Primary CTA */}
                <Link href={activeConfig.primaryLink} className="w-full sm:w-auto">
                  <button className="group relative inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 px-8 h-14 w-full sm:w-auto text-[15px] font-bold text-white transition-all hover:-translate-y-0.5 active:scale-95 shadow-[0_8px_32px_rgba(99,102,241,0.3)] hover:shadow-[0_12px_40px_rgba(99,102,241,0.45)] cursor-pointer">
                    <span className="relative z-10">{activeConfig.primaryCta}</span>
                    <ArrowRight className="h-4 w-4 relative z-10 transition-transform group-hover:translate-x-0.5" />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </Link>

                {/* Secondary CTA */}
                <Link href={activeConfig.secondaryLink} className="w-full sm:w-auto">
                  <button className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-md px-7 h-14 w-full sm:w-auto text-[15px] font-semibold text-muted-foreground transition-all hover:text-foreground hover:bg-white/[0.08] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)] active:scale-95 cursor-pointer">
                    {activeConfig.secondaryCta}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </Link>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-6 text-caption text-muted-foreground/80 pt-2">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>WASM core execution</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <LockKeyhole className="h-4 w-4 text-emerald-500" />
                  <span>100% Client-Side Privacy</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Side: Reusable Hero Visual Variants — 54% */}
        <div className="flex items-center justify-center lg:justify-end relative order-1 lg:order-2 w-full overflow-visible">
          <div className="transform-gpu scale-[0.65] sm:scale-[0.78] md:scale-[0.85] lg:scale-[0.92] xl:scale-100 origin-center lg:origin-right w-full">
            <ModularHeroVisual variant={activeHero} />
          </div>
        </div>
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

function AnimatedCounter({ value, label, desc, icon: Icon }: { value: string; label: string; desc: string; icon?: any }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  // Parse numeric part and suffix
  const numMatch = value.match(/[\d,.]+/);
  const hasNumeric = numMatch !== null;
  const suffix = hasNumeric ? value.replace(/[\d,.]+/, "") : value;
  const targetNum = hasNumeric ? parseFloat(numMatch[0].replace(/,/g, "")) : 0;
  
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
    if (isInView && hasNumeric) {
      animate(count, targetNum, { duration: 2.5, ease: "easeOut" });
    }
  }, [isInView, targetNum, count, hasNumeric]);

  return (
    <div ref={ref} className="text-center space-y-3 p-4 flex flex-col items-center select-none">
      {Icon && (
        <div className="h-10 w-10 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary mb-2 shadow-xs">
          <Icon className="h-5.5 w-5.5" />
        </div>
      )}
      <h3 className="text-display-l font-extrabold text-foreground tracking-tighter flex items-center justify-center">
        {hasNumeric ? (
          <>
            <motion.span>{display}</motion.span>
            <span>{suffix}</span>
          </>
        ) : (
          <span>{value}</span>
        )}
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
    { value: "100+", label: "Tools Available", desc: "Utility workflows for every day", icon: Layers },
    { value: "100%", label: "Browser Processing", desc: "All conversions run inside your client", icon: Laptop },
    { value: "0", label: "File Storage", desc: "Your data never hits our disks", icon: LockKeyhole },
    { value: "Free", label: "Forever", desc: "No subscriptions for most tools", icon: Heart },
    { value: "Fast", label: "Lightning Fast", desc: "Processed instantly at local CPU speeds", icon: Zap },
    { value: "Private", label: "Privacy First", desc: "GDPR & HIPAA compliant by design", icon: Shield },
  ];

  return (
    <Section className="section-divider py-20 bg-background/50">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-card/60 px-3.5 py-1 text-xs font-semibold text-muted-foreground tracking-wide uppercase mb-8">
          Trust by the numbers
        </span>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
            >
              <AnimatedCounter value={stat.value} label={stat.label} desc={stat.desc} icon={stat.icon} />
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
            <Link href="/tools">
              <MagneticButton variant="primary" glow={true} className="px-10 py-4 text-body-m">
                Start Using Tools
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

/* ─── NEW PHASE 0 HOME SECTIONS ─── */

function BenefitsSection() {
  const benefits = [
    {
      icon: Lock,
      title: "Complete Privacy",
      desc: "Your files never leave your device. All computations run in-memory within your local browser sandbox.",
      color: "rgba(16, 185, 129, 0.1)"
    },
    {
      icon: Zap,
      title: "Instant Processing",
      desc: "No waiting. No uploads. No server queues. Files are processed at the speed of your device CPU.",
      color: "rgba(99, 102, 241, 0.1)"
    },
    {
      icon: Globe,
      title: "Works Everywhere",
      desc: "Compatible with Windows, macOS, Linux, Android, and iOS. If you have a web browser, UTool just works.",
      color: "rgba(59, 130, 246, 0.1)"
    },
    {
      icon: Sparkles,
      title: "Free & Simple",
      desc: "No subscriptions required for core tools. Zero installation, zero signup barriers, pure utility.",
      color: "rgba(245, 158, 11, 0.1)"
    }
  ];

  return (
    <Section id="benefits" className="section-divider py-24 bg-card/5">
      <SectionHeading
        badge="Benefits"
        title="Utility that respects your time and privacy"
        subtitle="Engineered with modern client-side runtimes to bypass standard cloud-processing hazards."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto px-6">
        {benefits.map((b, i) => {
          const Icon = b.icon;
          return (
            <GlassCard key={b.title} className="p-8 space-y-4 rounded-3xl border-white/[0.06] flex flex-col justify-between" hover={true}>
              <div className="space-y-4">
                <div className="h-10 w-10 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-body-s font-bold text-foreground tracking-tight">{b.title}</h3>
                <p className="text-caption text-muted-foreground leading-relaxed">{b.desc}</p>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </Section>
  );
}

function PopularCategoriesSection() {
  const categories = [
    { title: "PDF Workspace", desc: "Merge, split, and compress PDF documents 100% locally.", link: "/tools/pdf-tools", icon: FileText, border: "hover:border-red-500/30" },
    { title: "Image Optimizer", desc: "Bulk compress, convert WebP, and resize images without quality loss.", link: "/tools/image-tools", icon: PenTool, border: "hover:border-blue-500/30" },
    { title: "Developer Suite", desc: "Format JSON, minify code, and generate QR matrices securely.", link: "/tools/developer-tools", icon: Cpu, border: "hover:border-emerald-500/30" },
    { title: "Resume Builder", desc: "Build ATS-friendly, single-column portfolios for recruiter review.", link: "/tools/resume-tools", icon: Briefcase, border: "hover:border-purple-500/30" },
    { title: "Media Workspace", desc: "Extract clean audio streams and compress MP4/WebM files client-side.", link: "/tools/media-tools", icon: Activity, border: "hover:border-pink-500/30" }
  ];

  return (
    <Section id="categories" className="section-divider py-24 bg-background">
      <SectionHeading
        badge="Popular Categories"
        title="Designed for every modern workflow"
        subtitle="Select a workspace category to open your browser-native tools suite."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto px-6">
        {categories.map((cat, i) => {
          const Icon = cat.icon;
          return (
            <Link key={cat.title} href={cat.link} className="block group">
              <GlassCard className={cn("p-6 space-y-4 rounded-3xl border-white/[0.06] transition-all duration-300 h-full", cat.border)} hover={true}>
                <div className="h-10 w-10 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-body-s font-bold text-foreground group-hover:text-primary transition-colors">{cat.title}</h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{cat.desc}</p>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 pt-2">
                  <span>Open Suite</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </GlassCard>
            </Link>
          );
        })}
      </div>
    </Section>
  );
}

function FeaturedToolsSection() {
  const [filter, setFilter] = useState<"all" | "live" | "coming-soon">("all");
  const [tools, setTools] = useState<any[]>([
    { slug: "merge-pdf", name: "Merge PDF Documents", desc: "Combine PDF pages locally. Preserves vectors, images, and formatting.", badge: "PDF", icon: FileText, status: "Live", completion: 100 },
    { slug: "qr-generator", name: "Wi-Fi QR Code", desc: "Generate secure auto-login QR codes for guest networks. Offline compliant.", badge: "QR", icon: QrCode, status: "Live", completion: 100 },
    { slug: "resume-builder", name: "ATS Resume Builder", desc: "Build professional recruiter-ready resumes from clean markdown layouts.", badge: "Career", icon: Briefcase, status: "Live", completion: 100 },
    { slug: "pdf-ocr", name: "PDF OCR Engine", desc: "Extract text from scanned PDFs locally using browser-based OCR.", badge: "Pro", icon: Cpu, status: "Testing", completion: 90 },
    { slug: "image-compressor", name: "Image Compressor", desc: "Reduce photo sizes locally without losing quality.", badge: "Image", icon: Camera, status: "Live", completion: 100 },
    { slug: "background-remover", name: "AI Background Remover", desc: "Remove image backgrounds locally in-browser using web-native models.", badge: "AI", icon: Sparkles, status: "In Progress", completion: 60 },
    { slug: "subtitle-generator", name: "AI Subtitle Generator", desc: "Generate captions for videos locally using WebAssembly engines.", badge: "Video", icon: Video, status: "In Progress", completion: 40 },
    { slug: "env-validator", name: "Environment Validator", desc: "Check and validate .env files securely with offline checking.", badge: "Developer", icon: Terminal, status: "Live", completion: 100 }
  ]);

  useEffect(() => {
    // Fetch live statuses from API to overlay
    fetch("/api/tools?limit=100")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.tools) {
          setTools((prev) =>
            prev.map((t) => {
              const matched = data.tools.find((d: any) => d.slug === t.slug);
              if (matched) {
                return {
                  ...t,
                  status: matched.status,
                  completion: matched.completion,
                  priority: matched.priority,
                };
              }
              return t;
            })
          );
        }
      })
      .catch((err) => console.error("Error fetching live tool statuses for home page:", err));
  }, []);

  const filteredTools = tools.filter((tool) => {
    if (tool.status === "Hidden") return false;
    if (filter === "live") return tool.status === "Live";
    if (filter === "coming-soon") return tool.status !== "Live";
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Live":
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">🟢 Live</span>;
      case "Testing":
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">🔵 Testing</span>;
      case "In Progress":
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">🟠 Progress</span>;
      case "Planned":
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">🟣 Planned</span>;
      case "Beta":
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">👑 Beta</span>;
      case "Deprecated":
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold text-zinc-400 bg-zinc-500/10 px-2 py-0.5 rounded-full border border-zinc-500/20">⚠️ Deprecated</span>;
      case "Broken":
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">🔴 Broken</span>;
      default:
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold text-zinc-400 bg-zinc-500/10 px-2 py-0.5 rounded-full border border-zinc-500/20">⚫ Hidden</span>;
    }
  };

  return (
    <Section id="featured-tools" className="section-divider py-24 bg-card/5">
      <SectionHeading
        badge="Featured Tools"
        title="High performance utility engines"
        subtitle="Vetted browser-native tools that execute in milliseconds on your own device hardware."
      />

      {/* Filter Tabs */}
      <div className="flex justify-center gap-3 mb-12">
        {[
          { id: "all" as const, label: "All Tools" },
          { id: "live" as const, label: "Live & Working" },
          { id: "coming-soon" as const, label: "Coming Soon" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={cn(
              "rounded-full px-5 py-2 text-xs font-bold transition-all duration-300 cursor-pointer border select-none",
              filter === tab.id
                ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-105"
                : "bg-white/[0.04] text-muted-foreground border-white/[0.08] hover:bg-white/[0.08] hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto px-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                key={tool.slug}
                className="h-full"
              >
                <GlassCard className="p-8 space-y-4 rounded-3xl border-white/[0.06] flex flex-col justify-between h-full" hover={true}>
                  <div className="space-y-4 w-full">
                    {/* Top elements */}
                    <div className="flex items-center justify-between">
                      <div className="h-9 w-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-primary">
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <div className="flex items-center gap-1.5">
                        {getStatusBadge(tool.status)}
                      </div>
                    </div>

                    {/* Titles */}
                    <div>
                      <h3 className="text-body-s font-bold text-foreground tracking-tight">{tool.name}</h3>
                      <p className="text-[10px] text-primary/70 font-semibold mt-1">
                        {tool.completion}% Complete
                      </p>
                      
                      {/* Animated completion progress bar */}
                      <div className="w-full bg-white/[0.05] h-1.5 rounded-full overflow-hidden mt-1.5 border border-white/[0.02]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${tool.completion}%` }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
                        />
                      </div>
                    </div>

                    <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">{tool.desc}</p>
                  </div>
                  
                  <Link href={`/tools/${tool.slug}`} className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:text-primary/80 transition-colors pt-4 w-fit">
                    <span>Start Tool</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </GlassCard>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </Section>
  );
}

function WhyUToolSection() {
  return (
    <Section id="why-utool" className="section-divider py-24 bg-background">
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2.5 py-0.5 rounded-full">
            Architecture
          </span>
          <h2 className="text-display-xs md:text-display-sm font-extrabold text-foreground leading-tight tracking-tight">
            Why process files locally?
          </h2>
          <p className="text-body-sm text-muted-foreground leading-relaxed">
            Traditional online utilities force you to upload your personal files—invoices, tax forms, employee resumes, ID cards—to cloud servers. This exposes you to database leaks, hacking risks, and violates compliance laws like GDPR.
          </p>
          <p className="text-body-sm text-muted-foreground leading-relaxed">
            UTool is designed differently. By writing compiled C++ libraries in WebAssembly, we process everything inside your local browser memory sandbox. No file uploads. No server queues. Complete privacy.
          </p>
          <div className="pt-2">
            <Link href="/why-local-processing">
              <button className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.04] px-6 h-12 text-xs font-semibold text-foreground hover:bg-white/[0.08] transition-all cursor-pointer">
                <span>Learn How Local Processing Works</span>
                <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" />
              </button>
            </Link>
          </div>
        </div>
        <div className="relative rounded-[2rem] border border-white/[0.06] bg-card/35 p-8 overflow-hidden shadow-lg space-y-6">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-emerald-500 to-teal-500" />
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Traditional Cloud vs. Local Processing</h4>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="h-6 w-6 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center text-xs shrink-0 font-bold">✕</div>
              <div>
                <p className="text-[11px] font-bold text-foreground">Cloud Processing</p>
                <p className="text-[10px] text-muted-foreground">Uploads documents, processes on third-party servers, stores in temporary cache files, high latency.</p>
              </div>
            </div>
            <div className="h-px bg-white/[0.04]" />
            <div className="flex gap-3">
              <div className="h-6 w-6 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-xs shrink-0 font-bold">✓</div>
              <div>
                <p className="text-[11px] font-bold text-foreground">Local Processing (UTool)</p>
                <p className="text-[10px] text-muted-foreground">Files never leave your CPU, zero server retention, millisecond speeds, runs offline, GDPR compliant.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

function TestimonialsSection() {
  const testimonials = [
    {
      quote: "UTool is a lifesaver for security. As a legal consultant, I can't upload customer agreements to cloud compressors. UTool lets me do it all locally.",
      author: "Sarah D., Legal Compliance Officer",
      color: "rgba(99, 102, 241, 0.05)"
    },
    {
      quote: "Stitching 200MB engineering files in under a second directly in my browser was mindblowing. No queues or network bottleneck limiters.",
      author: "Marcus K., Senior Backend Developer",
      color: "rgba(239, 68, 68, 0.05)"
    },
    {
      quote: "We require our authors to use UTool's markdown resume editor. It ensures student data stays private and layouts are parsed by ATS software perfectly.",
      author: "Prof. Elena G., Career Services Director",
      color: "rgba(16, 185, 129, 0.05)"
    }
  ];

  return (
    <Section id="testimonials" className="section-divider py-24 bg-card/5">
      <SectionHeading
        badge="Testimonials"
        title="Loved by teams, trusted by engineers"
        subtitle="Read what security experts and developers say about local browser computing."
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto px-6">
        {testimonials.map((t, i) => (
          <GlassCard key={t.author} className="p-8 space-y-4 rounded-3xl border-white/[0.06] flex flex-col justify-between" hover={false}>
            <p className="text-xs text-muted-foreground leading-relaxed italic">"{t.quote}"</p>
            <div className="flex items-center gap-3 pt-2">
              <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                {t.author.substring(0, 2)}
              </div>
              <span className="text-[11px] font-bold text-foreground">{t.author}</span>
            </div>
          </GlassCard>
        ))}
      </div>
    </Section>
  );
}
