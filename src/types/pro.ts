export type MembershipPlan = "free" | "pro";

export interface Membership {
  plan: MembershipPlan;
  expiresAt?: Date | null;
  active: boolean;
}

export interface UserSessionData {
  id: string;
  email: string | null;
  membership: Membership;
}

export type FeatureKey = "AI_IMAGE" | "AI_VIDEO" | "EXPORT" | "ADVANCED_SEARCH" | "ANALYTICS";
