export const AD_STORAGE_KEYS = {
  CONFIG: "utool_ad_config",
  CONSENT: "utool_ad_consent",
  SESSION_IMPRESSIONS: "utool_ad_session_impressions",
  SESSION_START: "utool_ad_session_start",
};

export const DEFAULT_ADSENSE_PUB_ID = "pub-5573426189025066"; // Safe default, overrides via Firestore/Env

export const AD_LOAD_TIMEOUT = 8000; // 8 seconds timeout before failing over
export const AD_RETRY_LIMIT = 2; // Retry loading up to 2 times
export const AD_RETRY_DELAY = 3000; // Delay before retry (3 seconds)

export const AD_POLICY_FORBIDDEN_PATHS = [
  "/pricing",
  "/signup",
  "/login",
  "/reset-password",
  "/verify-email",
  "/dashboard",
  "/admin",
  "/checkout"
];

// Fallback affiliate/sponsored items for UTool
export const FALLBACK_AFFILIATE_ADS = [
  {
    title: "Upgrade to UTool Pro",
    description: "Get unlimited daily actions, OCR scanning, premium document compiling, and a 100% ad-free experience. Support independent developers.",
    ctaText: "Go Pro — $9/mo",
    ctaUrl: "/pricing",
    image: "/brand/pro-banner.png", // Or a visual container
    tag: "Utool Premium"
  },
  {
    title: "Cloud Backup Integration",
    description: "Connect UTool directly to Dropbox, Google Drive, or OneDrive. Save your processed files automatically with one click.",
    ctaText: "Enable Cloud Sync",
    ctaUrl: "/pricing",
    image: "/brand/cloud-banner.png",
    tag: "Featured Extension"
  }
];
