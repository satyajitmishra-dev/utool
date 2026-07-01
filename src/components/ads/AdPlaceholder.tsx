"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Shield, ArrowRight } from "lucide-react";
import { getReservationClasses } from "@/lib/ads/sizes";
import { cn } from "@/utils/cn";

interface AdPlaceholderProps {
  size: string;
  className?: string;
  reason?: "offline" | "blocked" | "test";
}

export function AdPlaceholder({ size, className, reason = "blocked" }: AdPlaceholderProps) {
  const reservationClass = getReservationClasses(size);

  // If size is too small (e.g. 320x50 standard top banner), render a minimal bar
  const isMini = size === "320x50" || size === "320x100" || size === "728x90";

  if (isMini) {
    return (
      <div
        className={cn(
          "rounded-xl border border-white/[0.04] bg-neutral-900/20 backdrop-blur-xs flex items-center justify-between px-6 py-2 overflow-hidden relative",
          reservationClass,
          className
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/[0.02] to-indigo-500/[0.02] pointer-events-none" />
        <div className="flex items-center gap-2 relative z-10">
          <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
          <span className="text-[10px] md:text-xs text-neutral-400 font-medium">
            {reason === "offline" ? "You are offline. Showing offline cached version." : "Enjoy a 100% ad-free experience with UTool Pro."}
          </span>
        </div>
        <Link
          href="/pricing"
          className="text-[10px] md:text-xs text-white hover:text-primary font-bold transition-colors flex items-center gap-1 relative z-10 shrink-0 uppercase tracking-wider"
        >
          Upgrade <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    );
  }

  // Large ad slot fallback (Native or Sidebars)
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/[0.06] bg-neutral-950/40 p-6 flex flex-col justify-between items-center text-center relative overflow-hidden backdrop-blur-md",
        reservationClass,
        className
      )}
    >
      {/* Decorative Blur Backdrops */}
      <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-violet-600/10 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-indigo-600/10 blur-2xl pointer-events-none" />

      <div className="my-auto space-y-4 relative z-10 flex flex-col items-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.03] border border-white/[0.08] text-primary shadow-inner shadow-white/5">
          {reason === "offline" ? <Shield className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
        </div>

        <div className="space-y-1.5 max-w-xs">
          <h4 className="text-sm font-bold text-white tracking-tight">
            {reason === "offline" ? "UTool Offline Mode" : "Remove Ads with Pro"}
          </h4>
          <p className="text-[11px] text-neutral-400 leading-relaxed">
            {reason === "offline" 
              ? "All tools compile and process 100% locally on your machine, even without internet access." 
              : "Get unlimited document actions, OCR scanning, and a completely ad-free workspace."}
          </p>
        </div>
      </div>

      <Link
        href="/pricing"
        className="w-full h-10 mt-4 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md relative z-10 shrink-0"
      >
        Learn More <ArrowRight className="h-3.5 w-3.5 text-black" />
      </Link>
    </div>
  );
}
export default AdPlaceholder;
