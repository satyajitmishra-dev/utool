import { UserConsent } from "./types";
import { AD_STORAGE_KEYS } from "./constants";

/**
 * Checks connection speed using the Network Information API.
 */
export function getNetworkSpeed(): "slow-3g" | "fast-3g" | "4g" | "5g-fast" | "unknown" {
  if (typeof navigator === "undefined") return "unknown";

  const conn = (navigator as any).connection ||
               (navigator as any).mozConnection ||
               (navigator as any).webkitConnection;

  if (!conn) return "unknown";

  // Check network speed category
  const effectiveType = conn.effectiveType; // 'slow-2g', '2g', '3g', '4g'
  const downlink = conn.downlink; // Megabits per second
  const rtt = conn.rtt; // Round-trip time in ms

  if (effectiveType === "slow-2g" || effectiveType === "2g" || (effectiveType === "3g" && rtt > 400)) {
    return "slow-3g";
  }
  if (effectiveType === "3g" || (effectiveType === "4g" && downlink < 3)) {
    return "fast-3g";
  }
  if (effectiveType === "4g" && downlink >= 3 && downlink < 15) {
    return "4g";
  }
  if (effectiveType === "4g" && downlink >= 15) {
    return "5g-fast";
  }

  return "unknown";
}

/**
 * Evaluates device viewport classifications based on width.
 */
export function getDeviceViewport(): "mobile" | "tablet" | "desktop" {
  if (typeof window === "undefined") return "desktop"; // SSR fallback

  const width = window.innerWidth;
  if (width < 768) return "mobile";
  if (width >= 768 && width < 1024) return "tablet";
  return "desktop";
}

/**
 * Loads GDPR/CCPA privacy preferences from local storage.
 */
export function loadUserConsent(): UserConsent {
  const defaultConsent: UserConsent = {
    gdprConsent: false,
    ccpaConsent: false,
    saved: false,
  };

  if (typeof window === "undefined") return defaultConsent;

  try {
    const raw = localStorage.getItem(AD_STORAGE_KEYS.CONSENT);
    if (raw) {
      return JSON.parse(raw) as UserConsent;
    }
  } catch (err) {
    console.warn("[Ad Utils] Failed to load consent from localStorage:", err);
  }

  return defaultConsent;
}

/**
 * Saves GDPR/CCPA privacy preferences to local storage.
 */
export function saveUserConsent(consent: UserConsent): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(AD_STORAGE_KEYS.CONSENT, JSON.stringify(consent));
  } catch (err) {
    console.error("[Ad Utils] Failed to save consent to localStorage:", err);
  }
}
