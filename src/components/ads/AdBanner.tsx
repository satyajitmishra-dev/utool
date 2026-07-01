"use client";

import React, { useEffect } from "react";
import { AdPlacementConfig } from "@/lib/ads/types";
import { pushAdSenseEvent } from "@/lib/ads/providers";
import { getReservationClasses } from "@/lib/ads/sizes";
import { cn } from "@/utils/cn";

interface AdBannerProps {
  size: string;
  placementConfig: AdPlacementConfig;
  publisherId: string;
  testAds: boolean;
  onAdLoaded: () => void;
  onAdFailed: (msg: string) => void;
}

export function AdBanner({
  size,
  placementConfig,
  publisherId,
  testAds,
  onAdLoaded,
  onAdFailed,
}: AdBannerProps) {
  const isAuto = size === "auto";

  // Trigger load tracking events
  useEffect(() => {
    if (testAds) {
      const timer = setTimeout(onAdLoaded, 600); // Simulate network load
      return () => clearTimeout(timer);
    } else {
      // In production: trigger Google AdSense
      try {
        pushAdSenseEvent();
        onAdLoaded();
      } catch (err: any) {
        onAdFailed(err.message || "AdSense push error");
      }
    }
  }, [testAds, onAdLoaded, onAdFailed]);

  // Size details
  const [w, h] = !isAuto ? size.split("x") : ["100%", "auto"];
  const reservationClass = getReservationClasses(size);

  if (testAds) {
    return (
      <div
        className={cn(
          "bg-neutral-800/10 border border-dashed border-neutral-700/30 rounded-xl flex flex-col items-center justify-center p-3 text-center",
          reservationClass
        )}
      >
        <span className="text-[10px] font-black text-neutral-400/30 uppercase tracking-widest">
          Test Ad Unit
        </span>
        <span className="text-xs text-neutral-500 font-bold">
          {placementConfig.name} ({size})
        </span>
        <span className="text-[9px] text-neutral-600">
          ID: {placementConfig.adUnitId}
        </span>
      </div>
    );
  }

  // Production Google AdSense HTML Block
  return (
    <div className={cn("overflow-hidden flex items-center justify-center", reservationClass)}>
      <ins
        className="adsbygoogle"
        style={{
          display: isAuto ? "block" : "inline-block",
          width: isAuto ? "100%" : `${w}px`,
          height: isAuto ? "auto" : `${h}px`,
        }}
        data-ad-client={publisherId}
        data-ad-slot={placementConfig.adUnitId}
        data-ad-format={isAuto ? "auto" : undefined}
        data-full-width-responsive={isAuto ? "true" : undefined}
      />
    </div>
  );
}
export default AdBanner;
