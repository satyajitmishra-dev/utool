"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAds } from "@/hooks/useAds";
import { useAdAnalytics } from "@/hooks/useAdAnalytics";
import { registerLazyLoad } from "@/lib/ads/lazyLoad";
import { AdErrorBoundary } from "./AdErrorBoundary";
import { AdPolicyGuard } from "./AdPolicyGuard";
import { AdSkeleton } from "./AdSkeleton";
import { AdPlaceholder } from "./AdPlaceholder";
import { AdContainer } from "./AdContainer";
import { AdVisibilityTracker } from "./AdVisibilityTracker";
import { ResponsiveAd } from "./ResponsiveAd";
import { SidebarStickyAd } from "./SidebarStickyAd";
import { BottomStickyAd } from "./BottomStickyAd";
import { useDevice } from "@/hooks/useDevice";
import { cn } from "@/utils/cn";

interface AdSlotProps {
  placement: string;
  className?: string;
  showLabel?: boolean;
}

export function AdSlot({ placement, className, showLabel = true }: AdSlotProps) {
  const { shouldRender, placementConfig, config, isOffline, isLoading } = useAds(placement);
  const analytics = useAdAnalytics(placement);
  const { device } = useDevice();

  const [inView, setInView] = useState(false);
  const [adState, setAdState] = useState<"idle" | "loading" | "loaded" | "failed">("idle");
  const [loadError, setLoadError] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);

  // 1. Lazy loading initialization
  useEffect(() => {
    const el = containerRef.current;
    if (!shouldRender || !el) return;

    const cleanup = registerLazyLoad(
      el,
      () => {
        setInView(true);
        setAdState("loading");
        analytics.trackRequested();
      },
      { rootMargin: "150px 0px" } // Load 150px before viewport
    );

    return () => cleanup();
  }, [shouldRender, analytics]);

  if (isLoading) {
    // Return empty placeholder with reservation to avoid shifts during initial config loading
    if (placementConfig) {
      const activeSize = placementConfig.sizes[device] || "auto";
      return <div className={cn("opacity-0", className)} style={{ minHeight: activeSize === "native" ? "180px" : "90px" }} />;
    }
    return null;
  }

  // If rules block the rendering (e.g. premium user, disabled page), render nothing
  if (!shouldRender) {
    return null;
  }

  const activeSize = placementConfig?.sizes[device] || "auto";

  const handleAdLoaded = () => {
    setAdState("loaded");
    analytics.trackLoaded();
    analytics.trackFilled();
  };

  const handleAdFailed = (msg: string) => {
    setAdState("failed");
    setLoadError(msg);
    analytics.trackFailed(msg);
  };

  const handleVisibleImpression = () => {
    analytics.trackVisible();
  };

  const handleAdClick = () => {
    analytics.trackClicked();
  };

  // Render main ad block contents
  const renderAdBody = () => {
    if (adState === "failed") {
      return (
        <AdPlaceholder
          size={activeSize}
          reason={isOffline ? "offline" : "blocked"}
        />
      );
    }

    return (
      <div onClick={handleAdClick} className="w-full h-full">
        {/* Render ad skeleton while loading resources */}
        {adState === "loading" && <AdSkeleton size={activeSize} />}
        
        <div className={cn(adState !== "loaded" && "hidden")}>
          <AdVisibilityTracker onVisible={handleVisibleImpression}>
            <ResponsiveAd
              placementConfig={placementConfig!}
              publisherId={config!.adsensePubId}
              testAds={config!.testAds}
              onAdLoaded={handleAdLoaded}
              onAdFailed={handleAdFailed}
            />
          </AdVisibilityTracker>
        </div>
      </div>
    );
  };

  // Render ad slot wrapped in appropriate container layouts
  const renderSlotLayout = () => {
    if (placement === "bottom-mobile") {
      return (
        <BottomStickyAd className={className}>
          {renderAdBody()}
        </BottomStickyAd>
      );
    }

    if (placement === "sidebar-desktop") {
      return (
        <SidebarStickyAd className={className}>
          <AdContainer size={activeSize} showLabel={showLabel}>
            {renderAdBody()}
          </AdContainer>
        </SidebarStickyAd>
      );
    }

    return (
      <AdContainer size={activeSize} showLabel={showLabel} className={className}>
        {renderAdBody()}
      </AdContainer>
    );
  };

  return (
    <div ref={containerRef} className="w-full flex justify-center">
      <AdErrorBoundary placementId={placement} fallback={<AdPlaceholder size={activeSize} reason="blocked" />}>
        <AdPolicyGuard>
          {renderSlotLayout()}
        </AdPolicyGuard>
      </AdErrorBoundary>
    </div>
  );
}
export default AdSlot;
