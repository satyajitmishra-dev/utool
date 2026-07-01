"use client";

import React, { useEffect } from "react";
import { AdPlacementConfig } from "@/lib/ads/types";
import { pushAdSenseEvent } from "@/lib/ads/providers";
import { Sparkles, ShieldAlert, ArrowRight } from "lucide-react";
import { cn } from "@/utils/cn";
import { getReservationClasses } from "@/lib/ads/sizes";

interface NativeAdProps {
  placementConfig: AdPlacementConfig;
  publisherId: string;
  testAds: boolean;
  onAdLoaded: () => void;
  onAdFailed: (msg: string) => void;
}

export function NativeAd({
  placementConfig,
  publisherId,
  testAds,
  onAdLoaded,
  onAdFailed,
}: NativeAdProps) {
  useEffect(() => {
    if (testAds) {
      const timer = setTimeout(onAdLoaded, 500);
      return () => clearTimeout(timer);
    } else {
      try {
        pushAdSenseEvent();
        onAdLoaded();
      } catch (err: any) {
        onAdFailed(err.message || "Native Ad push error");
      }
    }
  }, [testAds, onAdLoaded, onAdFailed]);

  if (testAds) {
    return (
      <div className="w-full rounded-3xl border border-white/[0.06] bg-neutral-900/40 p-6 flex flex-col sm:flex-row gap-5 items-center backdrop-blur-md relative overflow-hidden text-left">
        {/* Subtle Ambient Radial Lights */}
        <div className="absolute top-[-10%] left-[10%] w-[150px] h-[150px] rounded-full bg-violet-500/[0.06] blur-2xl pointer-events-none" />

        <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-primary flex items-center justify-center shrink-0">
          <Sparkles className="h-7 w-7 text-primary animate-pulse" />
        </div>

        <div className="space-y-1.5 flex-1 min-w-0">
          <span className="text-[9px] uppercase tracking-widest text-primary font-bold">
            Sponsored Feature
          </span>
          <h4 className="text-sm font-bold text-white truncate">
            UTool Premium Workspace Extension
          </h4>
          <p className="text-xs text-neutral-400 leading-relaxed max-w-xl">
            Scale your operations to 10,000+ files per day. Connect external databases, automate compilation scripts, and download securely.
          </p>
        </div>

        <a
          href="/pricing"
          className="w-full sm:w-auto h-9 rounded-xl bg-primary hover:bg-primary/90 px-4 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0"
        >
          Check Pro <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>
    );
  }

  // Google AdSense Native Ad Unit
  return (
    <div className="w-full overflow-hidden min-h-[160px]">
      <ins
        className="adsbygoogle"
        style={{ display: "block", textAlign: "center" }}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client={publisherId}
        data-ad-slot={placementConfig.adUnitId}
      />
    </div>
  );
}
export default NativeAd;
