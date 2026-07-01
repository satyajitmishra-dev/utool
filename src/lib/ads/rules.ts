import { GlobalAdConfig, UserConsent } from "./types";
import { AD_POLICY_FORBIDDEN_PATHS } from "./constants";

export interface RuleContext {
  userTier: "free" | "pro" | "enterprise" | "admin";
  device: "mobile" | "tablet" | "desktop";
  networkSpeed: "slow-3g" | "fast-3g" | "4g" | "5g-fast" | "unknown";
  consent: UserConsent;
  sessionImpressions: number;
  sessionElapsedSeconds: number;
  path: string;
}

/**
 * Checks all business logic and Google AdSense compliance policies 
 * to determine if a specific ad placement can render.
 */
export function evaluateAdRule(
  placementId: string,
  config: GlobalAdConfig,
  context: RuleContext
): { shouldRender: boolean; reason: string } {
  // 1. Check Global Switch & Emergency Kill Switch
  if (!config.enabled) {
    return { shouldRender: false, reason: "Global ads disabled" };
  }
  if (config.emergencyKillSwitch) {
    return { shouldRender: false, reason: "Emergency Kill Switch is active" };
  }

  // 2. Check Premium Membership Tier
  if (
    context.userTier === "pro" ||
    context.userTier === "enterprise" ||
    context.userTier === "admin"
  ) {
    return { shouldRender: false, reason: "Premium member: ad-free tier" };
  }

  // 3. Path Policy Check (e.g. no ads on pricing, login, admin page)
  const isForbiddenPath = AD_POLICY_FORBIDDEN_PATHS.some((forbidden) =>
    context.path.startsWith(forbidden)
  );
  if (isForbiddenPath) {
    return { shouldRender: false, reason: "Forbidden URL pathway" };
  }

  // 4. Session Start Delay Check
  if (context.sessionElapsedSeconds < config.sessionMinDelay) {
    return {
      shouldRender: false,
      reason: `Session delay active (${Math.round(context.sessionElapsedSeconds)}s / ${config.sessionMinDelay}s)`,
    };
  }

  // 5. Session Frequency Capping
  if (config.frequencyCap > 0 && context.sessionImpressions >= config.frequencyCap) {
    return {
      shouldRender: false,
      reason: `Frequency cap exceeded (${context.sessionImpressions} >= ${config.frequencyCap})`,
    };
  }

  // 6. Placement configuration check
  const placement = config.placements[placementId];
  if (!placement) {
    return { shouldRender: false, reason: `Unknown placement: ${placementId}` };
  }
  if (!placement.enabled) {
    return { shouldRender: false, reason: `Placement ${placementId} disabled` };
  }

  // 7. Device support filter
  const isDeviceSupported = placement.devices[context.device];
  if (!isDeviceSupported) {
    return { shouldRender: false, reason: `Device ${context.device} not allowed for ${placementId}` };
  }

  // 8. Network Connection Check (Slow Connection handling)
  if (context.networkSpeed === "slow-3g") {
    // Under Slow 3G, only allow home-top, tool-top and blog-top (above fold)
    const isAboveFold =
      placementId === "home-top" || placementId === "tool-top" || placementId === "blog-top";
    if (!isAboveFold) {
      return { shouldRender: false, reason: `Slow connection: below-fold ${placementId} deferred` };
    }
  }

  // 9. Compliance / Policy check for workspace pages
  // E.g. make sure we are not loading ads in layout paths that contain active workspace boxes.
  // This is handled by rendering component policy guards, but we double-check here.
  if (context.path.includes("/processing") || context.path.includes("/results")) {
    return { shouldRender: false, reason: "Active tool process interface" };
  }

  return { shouldRender: true, reason: "Passes all rule validations" };
}
