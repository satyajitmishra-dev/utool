"use client";

import React, { createContext, useState, useEffect } from "react";
import { Membership, FeatureKey } from "@/types/pro";
import { FEATURES } from "@/config/features";
import { useAuth } from "@/context/auth-context";
import { subscribeToUserProfile } from "@/lib/firebase/dashboard";
import { UpgradeModal } from "@/components/pro/upgrade-modal";

// Central module-scoped reference for non-hook client code
let currentMembership: Membership = { plan: "free", active: false };

/**
 * Returns whether the user has an active Pro subscription on the client.
 */
export function isProUser(): boolean {
  return currentMembership.plan === "pro" && currentMembership.active;
}

/**
 * Checks if the current user can access a specific feature.
 */
export function hasFeature(featureName: FeatureKey): boolean {
  const flag = FEATURES[featureName];
  if (!flag) return false;
  return isProUser();
}

/**
 * Asserts the current user has Pro membership on the client. Throws an error if not.
 */
export function requirePro(): void {
  if (!isProUser()) {
    throw new Error("Pro subscription required");
  }
}

export interface ProContextType {
  isPro: boolean;
  upgrade: () => void;
  canUse: (featureName: FeatureKey) => boolean;
  showUpgrade: () => void;
}

export const ProContext = createContext<ProContextType | undefined>(undefined);

export function ProProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [membership, setMembership] = useState<Membership>({ plan: "free", active: false });
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      const defaultFree: Membership = { plan: "free", active: false };
      setMembership(defaultFree);
      currentMembership = defaultFree;
      return;
    }

    const unsubscribe = subscribeToUserProfile(
      user.uid,
      (profileData) => {
        if (profileData) {
          const derived: Membership = {
            plan: profileData.subscriptionTier === "pro" ? "pro" : "free",
            active: profileData.subscriptionStatus === "active",
            expiresAt: profileData.createdAt ? new Date(profileData.createdAt) : null,
          };
          setMembership(derived);
          currentMembership = derived;
        } else {
          const defaultFree: Membership = { plan: "free", active: false };
          setMembership(defaultFree);
          currentMembership = defaultFree;
        }
      },
      (error) => {
        console.error("[Pro Context] Firestore subscription error:", error);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const value: ProContextType = {
    isPro: membership.plan === "pro" && membership.active,
    upgrade: () => {
      window.location.href = "/billing";
    },
    canUse: (featureName: FeatureKey) => {
      const flag = FEATURES[featureName];
      if (!flag) return false;
      return membership.plan === "pro" && membership.active;
    },
    showUpgrade: () => {
      setUpgradeModalOpen(true);
    },
  };

  return (
    <ProContext.Provider value={value}>
      {children}
      <UpgradeModal open={upgradeModalOpen} onClose={() => setUpgradeModalOpen(false)} />
    </ProContext.Provider>
  );
}
