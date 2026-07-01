"use client";

import { useContext } from "react";
import { usePathname } from "next/navigation";
import { AdContext } from "@/context/AdContext";
import { useDevice } from "./useDevice";
import { useNetworkStatus } from "./useNetworkStatus";
import { evaluateAdRule, RuleContext } from "@/lib/ads/rules";
import { useAuth } from "./use-auth";

/**
 * Custom hook to evaluate whether an ad placement should render,
 * query details, and verify configuration status.
 */
export function useAds(placementId: string) {
  const adContext = useContext(AdContext);
  const { device } = useDevice();
  const { networkSpeed } = useNetworkStatus();
  const pathname = usePathname();
  const { membership, isAdmin } = useAuth();

  if (!adContext) {
    return {
      shouldRender: false,
      reason: "AdContext not found",
      config: null,
      isLoading: true,
    };
  }

  const { adConfig, isLoading, isOffline, consent, sessionStats } = adContext;

  // Resolve user tier
  let userTier: RuleContext["userTier"] = "free";
  if (isAdmin) {
    userTier = "admin";
  } else if (membership.plan === "pro" && membership.active) {
    userTier = "pro";
  } else if ((membership.plan as string) === "enterprise" && membership.active) {
    // Treat other non-free tiers as enterprise if configured
    userTier = "enterprise";
  }

  const ruleContext: RuleContext = {
    userTier,
    device,
    networkSpeed,
    consent,
    sessionImpressions: sessionStats.impressions,
    sessionElapsedSeconds: sessionStats.elapsedSeconds,
    path: pathname,
  };

  const evaluation = evaluateAdRule(placementId, adConfig, ruleContext);

  // If client is offline, force hiding of ads (we will show fallbacks or placeholders)
  const shouldRender = evaluation.shouldRender && !isOffline;

  return {
    shouldRender,
    reason: isOffline ? "Client is offline" : evaluation.reason,
    config: adConfig,
    placementConfig: adConfig.placements[placementId] || null,
    isLoading,
    isOffline,
    consent,
  };
}
