"use client";

import React from "react";
import { usePro } from "@/hooks/use-pro";
import { Sparkles, Crown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function UpgradeBanner() {
  const { isPro, showUpgrade } = usePro();

  if (isPro) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-amber-600/5 to-transparent p-4 mb-6 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
      {/* Decorative Blur */}
      <div className="absolute right-0 top-0 -mt-8 -mr-8 h-24 w-24 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />
      
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 shrink-0">
          <Crown className="h-5 w-5 animate-pulse" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
            Premium Tool Feature
            <span className="text-[8px] bg-amber-500 text-white font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">PRO</span>
          </h4>
          <p className="text-2xs text-muted-foreground mt-0.5 max-w-xl leading-relaxed">
            Free users can upload files and adjust processing configurations. Upgrading to Pro unlocks full execution, unlimited batch operations, and direct downloads.
          </p>
        </div>
      </div>
      
      <Button
        variant="premium"
        size="sm"
        onClick={showUpgrade}
        className="rounded-xl shrink-0 text-2xs px-4 py-2 font-bold flex items-center gap-1"
      >
        <Sparkles className="h-3 w-3" />
        Get Unlimited Access
        <ArrowRight className="h-3 w-3" />
      </Button>
    </div>
  );
}
