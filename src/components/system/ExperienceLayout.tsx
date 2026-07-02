"use client";

import React, { useEffect, useState } from "react";
import { STATE_CONFIGS, ExperienceState } from "./ExperienceConfig";
import { ExperienceTheme } from "./ExperienceTheme";
import { ExperienceIllustration } from "./ExperienceIllustration";
import { ExperienceActions } from "./ExperienceActions";
import { ExperienceSearch } from "./ExperienceSearch";
import { ExperienceRecommendations } from "./ExperienceRecommendations";
import { ExperienceRecentTools } from "./ExperienceRecentTools";
import { ExperienceHistory } from "./ExperienceHistory";
import { ExperienceFacts } from "./ExperienceFacts";
import { ExperienceTips } from "./ExperienceTips";
import { ExperienceProgress } from "./ExperienceProgress";
import { ExperienceStatus } from "./ExperienceStatus";
import { ExperienceRetry } from "./ExperienceRetry";
import { ExperienceGame } from "./ExperienceGame";
import { ExperienceFeedback } from "./ExperienceFeedback";
import { ExperienceFooter } from "./ExperienceFooter";
import { ExperienceAnalytics } from "./ExperienceAnalytics";
import { CanvasConfetti, useKonamiCode, SlideUp, ScaleIn } from "./ExperienceAnimation";
import { siteConfig } from "@/config/site";

import { toast } from "sonner";
import { cn } from "@/utils/cn";

export interface ExperienceLayoutProps {
  state: ExperienceState;
  onRetry?: () => void | Promise<void>;
  error?: Error & { digest?: string };
  reset?: () => void;
  className?: string;
}

export function ExperienceLayout({
  state,
  onRetry,
  error,
  reset,
  className,
}: ExperienceLayoutProps) {
  const [mounted, setMounted] = useState(false);
  const [konamiUnlocked, setKonamiUnlocked] = useState(false);

  // Load config based on active state
  const config = STATE_CONFIGS[state] || STATE_CONFIGS["404"];

  // 1. Avoid Hydration Mismatch
  useEffect(() => {
    setMounted(true);

    // Dynamically set client page title
    if (typeof document !== "undefined") {
      document.title = `${config.title} ${config.subtitle ? `— ${config.subtitle}` : ""} | ${siteConfig.name}`;
    }
  }, [config]);

  // 2. Setup Konami Code listener for secret easter egg
  useKonamiCode(() => {
    setKonamiUnlocked(true);
    if (typeof window !== "undefined") {
      (window as any).__KONAMI_UNLOCKED__ = true;
      (window as any).__UTOOL_KONAMI__ = true;
    }
    toast.success("🎮 SECRET CHEAT UNLOCKED! Enjoy the confetti rain!", { duration: 5000 });
  });

  if (!mounted) {
    // Return loading fallback shell during SSR
    return (
      <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Handle retry callbacks
  const handleRetryTrigger = onRetry || reset;

  return (
    <ExperienceTheme variant={config.gradientVariant} className={className}>
      {/* Canvas Confetti overlay for Konami code */}
      <CanvasConfetti active={konamiUnlocked} duration={5000} />

      {/* Top Header navbar branding */}
      <header className="w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between z-20">
        <a href="/" className="flex items-center gap-2">
          <span className="text-xl font-extrabold tracking-tighter text-foreground bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
            {siteConfig.name}
          </span>
          <span className="text-[10px] font-bold font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-full select-none">
            v1.6.0
          </span>
        </a>
      </header>

      {/* Responsive Grid layout */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start z-10">
        
        {/* LEFT COLUMN: Illustration + Main info (occupies 7 columns on desktop) */}
        <section className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left gap-6 lg:pr-8">
          
          <ScaleIn className="w-full flex justify-center lg:justify-start">
            <ExperienceIllustration
              variant={config.illustrationVariant}
              className="max-w-xs md:max-w-md w-full drop-shadow-2xl"
            />
          </ScaleIn>

          <SlideUp delay={0.1} className="w-full flex flex-col gap-2">
            <span className="text-sm font-bold text-primary uppercase tracking-widest leading-none">
              {config.subtitle || "Workspace Status Alert"}
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
              {config.title}
            </h1>
            <p className="mt-2 text-sm md:text-base text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed">
              {config.description}
            </p>
          </SlideUp>

          {/* Action buttons (Retry, Surprise Me, Upgrade, Home) */}
          <SlideUp delay={0.2} className="w-full flex justify-center lg:justify-start">
            <ExperienceActions
              actions={config.actions}
              onRetry={handleRetryTrigger}
              errorCode={config.extraConfig?.errorCode}
              state={config.state}
            />
          </SlideUp>

          {/* Universal Tool Search (mobile viewport only) */}
          {config.features.showSearch && (
            <SlideUp delay={0.22} className="w-full lg:hidden">
              <ExperienceSearch />
            </SlideUp>
          )}

          {/* Interactive Loading simulations */}
          {config.features.showProgress && (
            <SlideUp delay={0.3} className="w-full mt-4">
              <ExperienceProgress simulate={state === "loading" || state === "slow-network"} />
            </SlideUp>
          )}

          {/* Connection Speed meters */}
          {config.features.showStatus && (
            <SlideUp delay={0.3} className="w-full mt-4">
              <ExperienceStatus fileSizeMB={state === "file-too-large" ? 65 : 12} />
            </SlideUp>
          )}

          {/* Automatic Retry backoff countdown ring */}
          {config.features.showRetry && (
            <SlideUp delay={0.3} className="w-full mt-4">
              <ExperienceRetry
                onRetry={handleRetryTrigger}
                initialCountdown={config.extraConfig?.countdownSeconds || 10}
              />
            </SlideUp>
          )}

        </section>

        {/* RIGHT COLUMN: Sidebar elements (grid layout on tablets, flex column on desktop/mobile) */}
        <aside className="lg:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:flex lg:flex-col gap-6 w-full lg:sticky lg:top-8">
          
          {/* Universal Tool Search (desktop viewport only) */}
          {config.features.showSearch && (
            <SlideUp delay={0.25} className="w-full hidden lg:block">
              <ExperienceSearch />
            </SlideUp>
          )}

          {/* Canvas mini game */}
          {config.features.showGame && (
            <SlideUp delay={0.3} className="w-full">
              <ExperienceGame isOffline={state === "offline"} />
            </SlideUp>
          )}

          {/* Tool recommendations */}
          {config.features.showRecommendations && (
            <SlideUp delay={0.35} className="w-full">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                Discover Utilities
              </h4>
              <ExperienceRecommendations limit={4} />
            </SlideUp>
          )}

          {/* Locally viewed tools */}
          {config.features.showRecentTools && (
            <SlideUp delay={0.4} className="w-full">
              <ExperienceRecentTools limit={3} />
            </SlideUp>
          )}

          {/* File processing logs */}
          {config.features.showHistory && (
            <SlideUp delay={0.45} className="w-full">
              <ExperienceHistory isOffline={state === "offline"} />
            </SlideUp>
          )}

          {/* Robot Speech + Computer Trivia */}
          {config.features.showFacts && (
            <SlideUp delay={0.5} className="w-full">
              <ExperienceFacts state={config.state} />
            </SlideUp>
          )}

          {/* Hotkey guides & Privacy checklists */}
          {config.features.showTips && (
            <SlideUp delay={0.55} className="w-full">
              <ExperienceTips />
            </SlideUp>
          )}

          {/* Incident Telemetry log visualization */}
          <SlideUp delay={0.6} className="w-full">
            <ExperienceAnalytics state={config.state} />
          </SlideUp>

          {/* Feedback triggers */}
          {config.features.showFeedback && (
            <SlideUp delay={0.65} className="w-full">
              <ExperienceFeedback state={config.state} />
            </SlideUp>
          )}

        </aside>

      </main>

      {/* SaaS footer links */}
      <ExperienceFooter />
    </ExperienceTheme>
  );
}
export default ExperienceLayout;
