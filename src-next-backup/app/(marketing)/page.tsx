"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ToolCard } from "@/components/ui/tool-card";
import { PricingCard } from "@/components/ui/pricing-card";
import { Section, SectionHeading, Container, fadeUp, stagger } from "@/components/ui/section";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { detectCurrency, formatPrice, CurrencyCode, convertInrToCurrency } from "@/utils/currency";
import { useRemoteConfig } from "@/services/remote-config.service";
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
} from "lucide-react";

/* ═══════════════════════════════════════════════════
   LANDING PAGE
   ═══════════════════════════════════════════════════ */
export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <ToolGridSection />
      <FeaturesSection />
      <SocialProofSection />
      <PricingSection />
      <FAQSection />
    </>
  );
}

/* ─── HERO ─── */
function HeroSection() {
  return (
    <div className="hero-gradient relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="mx-auto max-w-4xl px-6 text-center"
      >
        <motion.div variants={fadeUp} custom={0}>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[hsl(var(--ring)_/_0.2)] bg-[hsl(var(--ring)_/_0.08)] px-3.5 py-1 text-xs font-semibold text-primary tracking-wide uppercase">
            <Sparkles className="h-3 w-3" />
            Now with 60+ premium tools
          </span>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          custom={1}
          className="mt-8 text-display-xl text-foreground"
        >
          Every tool you need.
          <br />
          <span className="gradient-text">
            One beautiful workspace.
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          custom={2}
          className="mt-6 text-body-l text-muted-foreground max-w-2xl mx-auto"
        >
          Stop juggling ten different apps. utool brings file converters,
          code formatters, image tools, and productivity utilities together in
          a workspace that&apos;s fast, clean, and delightful to use.
        </motion.p>

        <motion.div
          variants={fadeUp}
          custom={3}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/signup">
            <Button size="lg" className="rounded-full shadow-lg shadow-primary/20 group">
              Start for free
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
          <a href="#features">
            <Button variant="outline" size="lg" className="rounded-full">
              See how it works
            </Button>
          </a>
        </motion.div>

        <motion.p
          variants={fadeUp}
          custom={4}
          className="mt-8 text-caption text-muted-foreground"
        >
          Free forever plan · No credit card required · Cancel anytime
        </motion.p>
      </motion.div>
    </div>
  );
}

/* ─── TOOL GRID ─── */
function ToolGridSection() {
  return (
    <Section id="tools">
      <SectionHeading
        badge="Tool Suite"
        title="Every utility, one click away"
        subtitle="From file conversion to code formatting, every tool is crafted with care and precision. No clutter, no ads — just tools that work."
      />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={stagger}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <ToolCard
          title="PDF Workstation"
          description="Merge, split, and compress PDF documents client-side instantly with zero server latency."
          href="/pdf-tools"
          tag="pdf-tools"
          status="live"
          index={0}
        />
        <ToolCard
          title="QR Code Generator"
          description="Generate customized high-quality QR codes for URLs, plain text, email templates, and Wi-Fi credentials."
          href="/tools/qr-generator"
          tag="qr-static"
          status="live"
          index={1}
        />
        <ToolCard
          title="Short Link Creator"
          description="Create, track, and manage clean short links with detailed browser click statistics."
          href="/tools/url-shortener"
          tag="url-shortener"
          status="live"
          index={2}
        />
        <ToolCard
          title="Resume Builder"
          description="Design and print beautiful, professional resumes with clean PDF templates."
          href="/tools/resume-builder"
          tag="resume-builder"
          status="beta"
          index={3}
        />
        <ToolCard
          title="AI PDF OCR Extractor"
          description="Extract text elements, layout fields, and tables from scanned documents using server OCR."
          href="/premium-tools"
          tag="pdf-extractor"
          status="pro"
          isPremium={true}
          index={4}
        />
        <ToolCard
          title="Smart Image Resizer"
          description="Crop, resize, and optimize multiple images with pixel-perfect resolution grids."
          href="/premium-tools"
          tag="image-resize"
          status="pro"
          isPremium={true}
          index={5}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="mt-10 text-center"
      >
        <Link
          href="/tools"
          className="inline-flex items-center gap-1.5 text-body-s font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          Browse all 60+ tools
          <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>
    </Section>
  );
}

/* ─── FEATURES ─── */
function FeaturesSection() {
  const features = [
    {
      icon: Zap,
      title: "Instant Execution",
      desc: "Edge-optimized infrastructure with 50ms cold starts. Results appear before you blink.",
      gradient: "from-amber-500 to-orange-500",
    },
    {
      icon: Lock,
      title: "Privacy First",
      desc: "Files are processed in isolated environments and never stored. Your data stays yours.",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      icon: Layers,
      title: "Unified Workspace",
      desc: "One subscription, one interface, every tool. Stop context-switching between apps.",
      gradient: "from-indigo-500 to-violet-500",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      desc: "SOC 2 compliant infrastructure with end-to-end encryption and audit logging.",
      gradient: "from-slate-600 to-slate-800",
    },
    {
      icon: BarChart3,
      title: "Usage Analytics",
      desc: "Track credit usage, tool popularity, and team activity with built-in dashboards.",
      gradient: "from-rose-500 to-pink-500",
    },
    {
      icon: Globe,
      title: "API Access",
      desc: "Integrate any tool into your workflow via our REST API. Full OpenAPI documentation.",
      gradient: "from-cyan-500 to-blue-500",
    },
  ];

  return (
    <Section id="features" className="section-divider">
      <SectionHeading
        badge="Why utool"
        title="Built for people who care about craft"
        subtitle="Enterprise performance meets consumer-grade design. Every detail is intentional."
      />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={stagger}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {features.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <GlassCard
              key={feature.title}
              variant="interactive"
              hover={false}
              className="p-7"
            >
              <motion.div variants={fadeUp} custom={i}>
                <div
                  className={`inline-flex rounded-xl bg-gradient-to-br ${feature.gradient} p-2.5 text-white shadow-sm mb-5`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-[16px] font-semibold text-foreground tracking-tight">
                  {feature.title}
                </h3>
                <p className="mt-2.5 text-body-s text-muted-foreground">
                  {feature.desc}
                </p>
              </motion.div>
            </GlassCard>
          );
        })}
      </motion.div>
    </Section>
  );
}

/* ─── SOCIAL PROOF ─── */
function SocialProofSection() {
  return (
    <Section className="section-divider">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={stagger}
        className="text-center max-w-3xl mx-auto"
      >
        <motion.div variants={fadeUp} custom={0}>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[hsl(var(--ring)_/_0.2)] bg-[hsl(var(--ring)_/_0.08)] px-3.5 py-1 text-xs font-semibold text-primary tracking-wide uppercase">
            Trusted by builders
          </span>
        </motion.div>

        <motion.div
          variants={fadeUp}
          custom={1}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-12 gap-y-6"
        >
          {[
            { value: "12,000+", label: "Active users" },
            { value: "2.4M", label: "Tools executed" },
            { value: "4.9", label: "Average rating", hasStar: true },
            { value: "99.9%", label: "Uptime SLA" },
          ].map((stat) => (
            <div key={stat.label} className="text-center px-4">
              <p className="text-[32px] sm:text-[36px] font-bold tracking-tighter text-foreground flex items-center justify-center gap-1">
                {stat.value}
                {stat.hasStar && (
                  <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                )}
              </p>
              <p className="mt-1 text-caption text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>

        <motion.div
          variants={fadeUp}
          custom={2}
          className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-3"
        >
          {[
            {
              quote:
                "utool replaced five different bookmarks for me. It's faster and just looks better than anything else out there.",
              name: "Sarah Chen",
              role: "Frontend Developer",
            },
            {
              quote:
                "The attention to detail is insane. Every tool feels like it was designed by a product team, not thrown together.",
              name: "Marcus Rivera",
              role: "Design Lead, Figma",
            },
            {
              quote:
                "We rolled this out to our entire engineering team. The API access alone pays for the subscription.",
              name: "Priya Sharma",
              role: "CTO, Buildstack",
            },
          ].map((testimonial) => (
            <GlassCard
              key={testimonial.name}
              hover={false}
              className="rounded-2xl p-6 text-left"
            >
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star
                    key={j}
                    className="h-3.5 w-3.5 text-amber-400 fill-amber-400"
                  />
                ))}
              </div>
              <p className="text-body-s text-muted-foreground italic">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-body-s font-semibold text-foreground">
                  {testimonial.name}
                </p>
                <p className="text-caption text-muted-foreground">
                  {testimonial.role}
                </p>
              </div>
            </GlassCard>
          ))}
        </motion.div>
      </motion.div>
    </Section>
  );
}

/* ─── PRICING ─── */
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
      desc: "For casual users exploring the toolkit.",
      features: [
        "1 action / day (guest)",
        "3 actions / day (free login)",
        "Rate limits: 10 req / min",
        "Community support",
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
      desc: "For professionals who ship every day.",
      features: [
        "Unlimited tool actions",
        "Access to all 60+ tools",
        "Rate limits: 60 req / min",
        "10 GB storage",
        "Priority support",
        "API access",
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
      launchOffer: pricingConfig.enterprise.discountEnabled ? "Early Supporter" : undefined,
      timerText: pricingConfig.enterprise.discountEnabled && timeRemaining ? timeRemaining : undefined,
      period: "per month",
      desc: "For teams that need scale and control.",
      features: [
        "Everything in Pro",
        "300 req / min rate limit",
        "Custom integrations",
        "Dedicated instances",
        "SLA guarantee",
        "24/7 Slack support",
      ],
      cta: "Contact sales",
      href: "/signup?plan=enterprise",
      highlighted: false,
    },
  ];

  return (
    <Section id="pricing" className="section-divider">
      <SectionHeading
        badge="Pricing"
        title="Simple, honest pricing"
        subtitle="Start free. Upgrade when you're ready. No hidden fees, no surprises."
      />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={stagger}
        className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-stretch max-w-5xl mx-auto"
      >
        {tiers.map((tier, i) => (
          <motion.div key={tier.name} variants={fadeUp} custom={i}>
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
      </motion.div>
    </Section>
  );
}

/* ─── FAQ ─── */
function FAQSection() {
  const faqs = [
    {
      q: "Is there really a free plan?",
      a: "Yes. The Starter plan is free forever with 100 monthly credits. No credit card required to get started.",
    },
    {
      q: "How do credits work?",
      a: "Each tool execution costs 1–5 credits depending on complexity. Credits reset monthly. Pro plan users get unlimited credits.",
    },
    {
      q: "Can I use utool for my team?",
      a: "Absolutely. The Enterprise plan includes team management, shared workspaces, and dedicated infrastructure.",
    },
    {
      q: "What payment methods do you accept?",
      a: "We use Razorpay for secure payments. We accept all major credit/debit cards, UPI, net banking, and wallets.",
    },
    {
      q: "Is my data safe?",
      a: "Yes. Files are processed in isolated containers and immediately deleted. We never store your files or share your data.",
    },
    {
      q: "Can I cancel anytime?",
      a: "Of course. No lock-in contracts. Cancel from your dashboard with one click, effective at the end of your billing period.",
    },
  ];

  return (
    <Section id="faq" className="section-divider">
      <SectionHeading
        badge="FAQ"
        title="Questions? Answers."
        subtitle="Everything you need to know about utool. Can't find what you're looking for? Reach out to our team."
      />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={stagger}
        className="mx-auto max-w-2xl divide-y divide-border"
      >
        {faqs.map((faq, i) => (
          <FAQItem key={i} q={faq.q} a={faq.a} index={i} />
        ))}
      </motion.div>
    </Section>
  );
}

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div variants={fadeUp} custom={index}>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left group"
      >
        <span className="text-[15px] font-medium text-foreground pr-8 group-hover:text-primary transition-colors">
          {q}
        </span>
        <ChevronDown
          className={`h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""
            }`}
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.25, ease: [0.25, 0.4, 0.25, 1] as const }}
        className="overflow-hidden"
      >
        <p className="pb-5 text-body-s text-muted-foreground pr-12">
          {a}
        </p>
      </motion.div>
    </motion.div>
  );
}
