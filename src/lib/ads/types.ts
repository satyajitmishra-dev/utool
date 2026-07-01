export type AdProviderType =
  | "adsense"
  | "admanager"
  | "medianet"
  | "custom"
  | "affiliate"
  | "sponsored";

export interface AdPlacementConfig {
  id: string;
  name: string;
  enabled: boolean;
  devices: {
    mobile: boolean;
    tablet: boolean;
    desktop: boolean;
  };
  sizes: {
    mobile: string;  // e.g. "320x50" or "auto"
    tablet: string;  // e.g. "728x90" or "auto"
    desktop: string; // e.g. "970x90" or "auto"
  };
  adUnitId?: string; // Provider-specific ad unit ID override
  className?: string; // Custom styling overrides
}

export interface GlobalAdConfig {
  enabled: boolean;
  emergencyKillSwitch: boolean;
  activeProvider: AdProviderType;
  debugMode: boolean;
  testAds: boolean;
  adsensePubId: string; // e.g. "pub-XXXXXXXXXXXXXXXX"
  frequencyCap: number; // Max ads displayed per user session (0 = unlimited)
  sessionMinDelay: number; // Minimum seconds a user must be on site before ads load
  placements: Record<string, AdPlacementConfig>;
}

export interface UserConsent {
  gdprConsent: boolean; // Accept cookies & personalized tracking
  ccpaConsent: boolean; // Opt-in to sale/sharing of data
  saved: boolean;       // Has the preference been submitted
}

export interface AdEventLog {
  id: string;
  timestamp: number;
  eventType: "requested" | "loaded" | "filled" | "failed" | "visible" | "clicked";
  placementId: string;
  provider: AdProviderType;
  path: string;
  toolSlug?: string;
  device: "mobile" | "tablet" | "desktop";
  networkSpeed: "slow-3g" | "fast-3g" | "4g" | "5g-fast" | "unknown";
  visibleDuration?: number; // How many seconds the ad was visible
  errorMessage?: string;
  country?: string;
}

export interface AdAnalyticsSummary {
  impressions: number;
  clicks: number;
  ctr: number;      // Click-Through Rate: clicks / impressions
  fillRate: number; // filled / requested
  rpm: number;      // Revenue Per Mille: (revenue / impressions) * 1000
  estimatedEarnings: number;
  history: {
    date: string;
    impressions: number;
    clicks: number;
    revenue: number;
  }[];
}
