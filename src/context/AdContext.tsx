"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/config/firebase";
import { useAuth } from "@/hooks/use-auth";
import { GlobalAdConfig, UserConsent } from "../lib/ads/types";
import { DEFAULT_GLOBAL_AD_CONFIG } from "../lib/ads/config";
import { AD_STORAGE_KEYS } from "../lib/ads/constants";
import { getNetworkSpeed, loadUserConsent, saveUserConsent } from "../lib/ads/utils";

interface SessionStats {
  impressions: number;
  clicks: number;
  elapsedSeconds: number;
}

interface AdContextType {
  adConfig: GlobalAdConfig;
  isLoading: boolean;
  isOffline: boolean;
  networkSpeed: "slow-3g" | "fast-3g" | "4g" | "5g-fast" | "unknown";
  isPremiumUser: boolean;
  consent: UserConsent;
  sessionStats: SessionStats;
  setConsent: (consent: UserConsent) => void;
  incrementImpressions: () => void;
  incrementClicks: () => void;
  refreshConfig: () => Promise<void>;
}

export const AdContext = createContext<AdContextType | undefined>(undefined);

export function AdProviderWrapper({ children }: { children: React.ReactNode }) {
  const { membership, isAdmin } = useAuth();
  const [adConfig, setAdConfig] = useState<GlobalAdConfig>(DEFAULT_GLOBAL_AD_CONFIG);
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [networkSpeed, setNetworkSpeed] = useState<ReturnType<typeof getNetworkSpeed>>("unknown");
  const [consent, setConsentState] = useState<UserConsent>({ gdprConsent: false, ccpaConsent: false, saved: false });
  const [sessionStats, setSessionStats] = useState<SessionStats>({ impressions: 0, clicks: 0, elapsedSeconds: 0 });
  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Derive premium user tier
  const isPremiumUser = membership.plan === "pro" || (membership.active && membership.plan !== "free") || isAdmin;

  // 1. Sync config with Firestore real-time updates
  useEffect(() => {
    setIsLoading(true);
    const docRef = doc(db, "settings", "adConfig");

    // Real-time snapshot listener on Firestore configuration document
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const dbData = snapshot.data() as Partial<GlobalAdConfig>;
          setAdConfig({
            ...DEFAULT_GLOBAL_AD_CONFIG,
            ...dbData,
            placements: {
              ...DEFAULT_GLOBAL_AD_CONFIG.placements,
              ...(dbData.placements || {}),
            },
          });
        } else {
          setAdConfig(DEFAULT_GLOBAL_AD_CONFIG);
        }
        setIsLoading(false);
      },
      (error: any) => {
        if (error?.code === "permission-denied" || error?.message?.toLowerCase().includes("permission")) {
          console.warn("[Ad System] Firestore configuration listener permission denied. Ensure your local firestore.rules are deployed to the cloud. Defaulting to local ad configurations.");
        } else {
          console.warn("[Ad Context] Firestore subscribe failed, using defaults:", error);
        }
        setAdConfig(DEFAULT_GLOBAL_AD_CONFIG);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // 2. Setup Debug Mode globally on window for analytics
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).__UTOOL_AD_DEBUG__ = adConfig.debugMode || adConfig.testAds;
    }
  }, [adConfig.debugMode, adConfig.testAds]);

  // 3. Monitor Network Status & Speed
  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateNetwork = () => {
      setIsOffline(!navigator.onLine);
      setNetworkSpeed(getNetworkSpeed());
    };

    updateNetwork();

    window.addEventListener("online", updateNetwork);
    window.addEventListener("offline", updateNetwork);
    
    // Listen for connection changes
    const conn = (navigator as any).connection ||
                 (navigator as any).mozConnection ||
                 (navigator as any).webkitConnection;
    if (conn) {
      conn.addEventListener("change", updateNetwork);
    }

    return () => {
      window.removeEventListener("online", updateNetwork);
      window.removeEventListener("offline", updateNetwork);
      if (conn) {
        conn.removeEventListener("change", updateNetwork);
      }
    };
  }, []);

  // 4. Load User Consent
  useEffect(() => {
    setConsentState(loadUserConsent());
  }, []);

  const handleSetConsent = (newConsent: UserConsent) => {
    setConsentState(newConsent);
    saveUserConsent(newConsent);
  };

  // 5. Manage Session Timings and Frequency caps
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Retrieve or initialize session impressions & start time
    const initSession = () => {
      const now = Date.now();
      let startStr = sessionStorage.getItem(AD_STORAGE_KEYS.SESSION_START);
      if (!startStr) {
        sessionStorage.setItem(AD_STORAGE_KEYS.SESSION_START, now.toString());
        startStr = now.toString();
      }
      
      const sessionStart = parseInt(startStr, 10);
      const initialElapsed = (now - sessionStart) / 1000;

      const impsStr = sessionStorage.getItem(AD_STORAGE_KEYS.SESSION_IMPRESSIONS);
      const imps = impsStr ? parseInt(impsStr, 10) : 0;

      setSessionStats({
        impressions: imps,
        clicks: 0,
        elapsedSeconds: initialElapsed,
      });

      // Update timer every second
      sessionTimerRef.current = setInterval(() => {
        setSessionStats((prev) => ({
          ...prev,
          elapsedSeconds: (Date.now() - sessionStart) / 1000,
        }));
      }, 1000);
    };

    initSession();

    return () => {
      if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
    };
  }, []);

  const incrementImpressions = () => {
    setSessionStats((prev) => {
      const updated = prev.impressions + 1;
      sessionStorage.setItem(AD_STORAGE_KEYS.SESSION_IMPRESSIONS, updated.toString());
      return { ...prev, impressions: updated };
    });
  };

  const incrementClicks = () => {
    setSessionStats((prev) => ({ ...prev, clicks: prev.clicks + 1 }));
  };

  const refreshConfig = async () => {
    // Realtime listener handles config, but let's provide a trigger force-refresh just in case
    setAdConfig((prev) => ({ ...prev }));
  };

  const value: AdContextType = {
    adConfig,
    isLoading,
    isOffline,
    networkSpeed,
    isPremiumUser,
    consent,
    sessionStats,
    setConsent: handleSetConsent,
    incrementImpressions,
    incrementClicks,
    refreshConfig,
  };

  return <AdContext.Provider value={value}>{children}</AdContext.Provider>;
}
