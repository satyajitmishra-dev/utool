"use client";

import React, { useEffect, useContext } from "react";
import { AdContext, AdProviderWrapper } from "@/context/AdContext";
import { injectAdProviderScript } from "@/lib/ads/providers";
import { ConsentBanner } from "./ConsentBanner";

interface AdProviderProps {
  children: React.ReactNode;
}

function AdScriptInitializer({ children }: { children: React.ReactNode }) {
  const context = useContext(AdContext);

  // Dynamically load external scripts once the config and consent states are loaded
  useEffect(() => {
    if (!context || context.isLoading || context.isOffline || context.isPremiumUser) return;

    const { activeProvider, adsensePubId, enabled, emergencyKillSwitch } = context.adConfig;

    if (enabled && !emergencyKillSwitch) {
      injectAdProviderScript(activeProvider, adsensePubId, context.consent);
    }
  }, [context]);

  return (
    <>
      {children}
      <ConsentBanner />
    </>
  );
}

export function AdProvider({ children }: AdProviderProps) {
  return (
    <AdProviderWrapper>
      <AdScriptInitializer>{children}</AdScriptInitializer>
    </AdProviderWrapper>
  );
}
export default AdProvider;
