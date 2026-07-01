"use client";

import React from "react";
import { AdPlacementConfig } from "@/lib/ads/types";
import { useDevice } from "@/hooks/useDevice";
import { AdBanner } from "./AdBanner";
import { NativeAd } from "./NativeAd";

interface ResponsiveAdProps {
  placementConfig: AdPlacementConfig;
  publisherId: string;
  testAds: boolean;
  onAdLoaded: () => void;
  onAdFailed: (msg: string) => void;
}

export function ResponsiveAd({
  placementConfig,
  publisherId,
  testAds,
  onAdLoaded,
  onAdFailed,
}: ResponsiveAdProps) {
  const { device } = useDevice();

  // Resolve sizes for current device
  const size = placementConfig.sizes[device] || "auto";

  if (size === "native") {
    return (
      <NativeAd
        placementConfig={placementConfig}
        publisherId={publisherId}
        testAds={testAds}
        onAdLoaded={onAdLoaded}
        onAdFailed={onAdFailed}
      />
    );
  }

  return (
    <AdBanner
      size={size}
      placementConfig={placementConfig}
      publisherId={publisherId}
      testAds={testAds}
      onAdLoaded={onAdLoaded}
      onAdFailed={onAdFailed}
    />
  );
}
export default ResponsiveAd;
