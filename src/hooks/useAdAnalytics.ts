"use client";

import { usePathname } from "next/navigation";
import { useNetworkStatus } from "./useNetworkStatus";
import { useDevice } from "./useDevice";
import { useContext } from "react";
import { AdContext } from "@/context/AdContext";
import { logAdEvent } from "@/lib/ads/analytics";

export function useAdAnalytics(placementId: string) {
  const pathname = usePathname();
  const { networkSpeed } = useNetworkStatus();
  const { device } = useDevice();
  const context = useContext(AdContext);
  const provider = context?.adConfig.activeProvider || "adsense";

  // Resolve active tool slug if on a tool details route
  const getToolSlug = () => {
    if (pathname.startsWith("/tools/")) {
      return pathname.split("/")[2];
    }
    return undefined;
  };

  const triggerEvent = async (
    eventType: Parameters<typeof logAdEvent>[0]["eventType"],
    extra?: { errorMessage?: string; visibleDuration?: number }
  ) => {
    // Increment context stats
    if (context) {
      if (eventType === "visible") {
        context.incrementImpressions();
      } else if (eventType === "clicked") {
        context.incrementClicks();
      }
    }

    await logAdEvent({
      eventType,
      placementId,
      provider,
      path: pathname,
      toolSlug: getToolSlug(),
      device,
      networkSpeed,
      ...extra,
    });
  };

  return {
    trackRequested: () => triggerEvent("requested"),
    trackLoaded: () => triggerEvent("loaded"),
    trackFilled: () => triggerEvent("filled"),
    trackFailed: (msg: string) => triggerEvent("failed", { errorMessage: msg }),
    trackVisible: (duration?: number) => triggerEvent("visible", { visibleDuration: duration }),
    trackClicked: () => triggerEvent("clicked"),
  };
}
