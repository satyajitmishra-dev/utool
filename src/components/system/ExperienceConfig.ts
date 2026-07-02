export type ExperienceState =
  | "404"
  | "offline"
  | "slow-network"
  | "loading"
  | "maintenance"
  | "500"
  | "403"
  | "session-expired"
  | "rate-limited"
  | "upload-failed"
  | "file-too-large"
  | "corrupted-file"
  | "browser-unsupported"
  | "coming-soon";

export interface ExperienceAction {
  label: string;
  actionType:
    | "home"
    | "back"
    | "retry"
    | "surprise-me"
    | "sign-in"
    | "upgrade"
    | "request-access"
    | "notify-me"
    | "system-status"
    | "support"
    | "diagnostics"
    | "report-broken";
  variant?: "primary" | "secondary" | "danger" | "ghost";
}

export interface StateConfig {
  state: ExperienceState;
  title: string;
  subtitle?: string;
  description: string;
  illustrationVariant: string;
  gradientVariant: "primary" | "premium" | "warning" | "error" | "purple" | "indigo" | "cool";
  noIndex?: boolean;
  
  // Interactive features enabled for this state
  features: {
    showSearch?: boolean;
    showGame?: boolean;
    showRecommendations?: boolean;
    showRecentTools?: boolean;
    showHistory?: boolean;
    showFacts?: boolean;
    showTips?: boolean;
    showProgress?: boolean;
    showStatus?: boolean;
    showRetry?: boolean;
    showFeedback?: boolean;
  };
  
  // Secondary widgets configuration
  extraConfig?: {
    countdownSeconds?: number;
    showRobotSpeech?: boolean;
    errorCode?: string;
    maxSizeMB?: number;
    supportedFormats?: string[];
  };

  actions: ExperienceAction[];
}

export const STATE_CONFIGS: Record<ExperienceState, StateConfig> = {
  "404": {
    state: "404",
    title: "404: Lost in the Sandbox",
    subtitle: "This utility is uncharted.",
    description: "We couldn't find the page or tool you were looking for. Let's get you back on track: search for another utility, play our mini-game, or select one of our popular tools below.",
    illustrationVariant: "lost-toolbox",
    gradientVariant: "premium",
    noIndex: true,
    features: {
      showSearch: true,
      showGame: true,
      showRecommendations: true,
      showRecentTools: true,
      showFacts: true,
      showFeedback: true,
    },
    extraConfig: {
      showRobotSpeech: true,
    },
    actions: [
      { label: "Surprise Me", actionType: "surprise-me", variant: "primary" },
      { label: "Go Home", actionType: "home", variant: "secondary" },
      { label: "Go Back", actionType: "back", variant: "ghost" },
    ],
  },
  "offline": {
    state: "offline",
    title: "You are offline",
    subtitle: "But many UTool features still work.",
    description: "Your local files can still be processed. We've queued your pending actions and will resume once you reconnect.",
    illustrationVariant: "unplugged-robot",
    gradientVariant: "cool",
    noIndex: true,
    features: {
      showGame: true,
      showRecentTools: true,
      showHistory: true,
      showFacts: true,
      showRetry: true,
    },
    extraConfig: {
      showRobotSpeech: true,
    },
    actions: [
      { label: "Retry Connection", actionType: "retry", variant: "primary" },
      { label: "Go Home", actionType: "home", variant: "secondary" },
    ],
  },
  "slow-network": {
    state: "slow-network",
    title: "Taking a bit longer...",
    subtitle: "Your network connection is very slow.",
    description: "We detected high latency. You can pause or cancel your current upload, browse other tools, or read some fun tips while we optimize.",
    illustrationVariant: "slow-connection",
    gradientVariant: "warning",
    noIndex: true,
    features: {
      showRecentTools: true,
      showTips: true,
      showProgress: true,
      showStatus: true,
      showRetry: true,
    },
    actions: [
      { label: "Pause Upload", actionType: "retry", variant: "primary" },
      { label: "Browse Tools", actionType: "home", variant: "secondary" },
    ],
  },
  "loading": {
    state: "loading",
    title: "Preparing your workspace",
    subtitle: "Building something beautiful...",
    description: "Initializing client-side WebAssembly sandboxes. Your data remains 100% private and processed on-device.",
    illustrationVariant: "loading-gears",
    gradientVariant: "indigo",
    noIndex: true,
    features: {
      showTips: true,
      showProgress: true,
      showFacts: true,
    },
    actions: [],
  },
  "maintenance": {
    state: "maintenance",
    title: "Workspace Tuning",
    subtitle: "We'll be right back.",
    description: "UTool is undergoing scheduled optimizations to improve server-side routing and client-side builds. Check back shortly!",
    illustrationVariant: "maintenance-robot",
    gradientVariant: "warning",
    noIndex: false,
    features: {
      showStatus: true,
      showFacts: true,
      showFeedback: true,
    },
    extraConfig: {
      countdownSeconds: 1800, // 30 mins default
    },
    actions: [
      { label: "Notify Me", actionType: "notify-me", variant: "primary" },
      { label: "System Status", actionType: "system-status", variant: "secondary" },
    ],
  },
  "500": {
    state: "500",
    title: "Something went wrong",
    subtitle: "Internal Workspace Glitch",
    description: "An unexpected error occurred. Diagnostics logs have been logged, and our engineering team has been auto-notified.",
    illustrationVariant: "broken-robot",
    gradientVariant: "error",
    noIndex: true,
    features: {
      showRecommendations: true,
      showRetry: true,
      showFeedback: true,
    },
    extraConfig: {
      errorCode: "ERR_INTERNAL_500_VX",
    },
    actions: [
      { label: "Try Again", actionType: "retry", variant: "primary" },
      { label: "Download Diagnostics", actionType: "diagnostics", variant: "secondary" },
      { label: "Contact Support", actionType: "support", variant: "ghost" },
    ],
  },
  "403": {
    state: "403",
    title: "Permission Denied",
    subtitle: "Exclusive Tool",
    description: "This advanced utility requires a UTool Pro subscription or specific administration permissions. Upgrade today to unlock unlimited offline processing.",
    illustrationVariant: "locked-gate",
    gradientVariant: "purple",
    features: {
      showRecommendations: true,
      showFeedback: true,
    },
    actions: [
      { label: "Upgrade to Pro", actionType: "upgrade", variant: "primary" },
      { label: "Request Access", actionType: "request-access", variant: "secondary" },
      { label: "Go Home", actionType: "home", variant: "ghost" },
    ],
  },
  "session-expired": {
    state: "session-expired",
    title: "Session Expired",
    subtitle: "Security Checkpoint",
    description: "For your security, your local workspace session has timed out. Sign back in to restore your draft files and continue working.",
    illustrationVariant: "expired-hourglass",
    gradientVariant: "indigo",
    noIndex: true,
    features: {
      showRecentTools: true,
      showTips: true,
    },
    actions: [
      { label: "Sign In Again", actionType: "sign-in", variant: "primary" },
      { label: "Go Home", actionType: "home", variant: "secondary" },
    ],
  },
  "rate-limited": {
    state: "rate-limited",
    title: "Taking a breather...",
    subtitle: "Rate Limit Exceeded",
    description: "You've initiated too many requests in a short period. Please wait a moment while UTool cools down to maintain stability.",
    illustrationVariant: "cool-down-robot",
    gradientVariant: "warning",
    noIndex: true,
    features: {
      showGame: true,
      showTips: true,
      showRetry: true,
    },
    extraConfig: {
      countdownSeconds: 60,
    },
    actions: [
      { label: "Retry Now", actionType: "retry", variant: "primary" },
      { label: "Go Home", actionType: "home", variant: "secondary" },
    ],
  },
  "upload-failed": {
    state: "upload-failed",
    title: "Upload Failed",
    subtitle: "Network Disruption or Format Error",
    description: "We couldn't upload your document. Please verify your connection, ensure your file isn't locked, and try again.",
    illustrationVariant: "upload-error",
    gradientVariant: "error",
    noIndex: true,
    features: {
      showTips: true,
      showRetry: true,
      showFeedback: true,
    },
    actions: [
      { label: "Retry Upload", actionType: "retry", variant: "primary" },
      { label: "Go Home", actionType: "home", variant: "secondary" },
    ],
  },
  "file-too-large": {
    state: "file-too-large",
    title: "File is too large",
    subtitle: "Size limit exceeded",
    description: "The selected file exceeds the maximum allowance for this browser-based tool. Compress your file or upgrade to handle larger files.",
    illustrationVariant: "giant-file",
    gradientVariant: "error",
    noIndex: true,
    features: {
      showRecommendations: true,
      showTips: true,
    },
    extraConfig: {
      maxSizeMB: 50,
    },
    actions: [
      { label: "Upgrade Plan", actionType: "upgrade", variant: "primary" },
      { label: "Choose Another File", actionType: "back", variant: "secondary" },
    ],
  },
  "corrupted-file": {
    state: "corrupted-file",
    title: "File structure corrupted",
    subtitle: "Unreadable format",
    description: "This document appears to be corrupted, incomplete, or password-protected. Please load a valid file and try again.",
    illustrationVariant: "damaged-doc",
    gradientVariant: "error",
    noIndex: true,
    features: {
      showRecommendations: true,
      showTips: true,
    },
    actions: [
      { label: "Try Another File", actionType: "back", variant: "primary" },
      { label: "Contact Support", actionType: "support", variant: "secondary" },
    ],
  },
  "browser-unsupported": {
    state: "browser-unsupported",
    title: "Unsupported Browser",
    subtitle: "Modern APIs Required",
    description: "UTool leverages modern WebAssembly, File System Access, and Web Worker APIs. Please update your browser to experience local offline speeds.",
    illustrationVariant: "old-monitor",
    gradientVariant: "cool",
    features: {
      showFacts: true,
      showFeedback: true,
    },
    extraConfig: {
      supportedFormats: ["Chrome 110+", "Safari 16.4+", "Firefox 115+", "Edge 110+"],
    },
    actions: [
      { label: "Diagnostics", actionType: "diagnostics", variant: "primary" },
      { label: "Learn More", actionType: "support", variant: "secondary" },
    ],
  },
  "coming-soon": {
    state: "coming-soon",
    title: "Feature coming soon",
    subtitle: "On the Roadmap",
    description: "We are actively engineering this utility. Upvote this feature to prioritize its release, or register to be notified when it goes live!",
    illustrationVariant: "starry-sky",
    gradientVariant: "purple",
    features: {
      showRecommendations: true,
      showFeedback: true,
      showRecentTools: true,
    },
    actions: [
      { label: "Notify Me On Release", actionType: "notify-me", variant: "primary" },
      { label: "Upvote Feature", actionType: "retry", variant: "secondary" },
      { label: "Go Home", actionType: "home", variant: "ghost" },
    ],
  },
};
