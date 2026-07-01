"use client";

import { useContext } from "react";
import { AdContext } from "@/context/AdContext";

export function useNetworkStatus() {
  const context = useContext(AdContext);
  if (!context) {
    return { isOffline: false, networkSpeed: "unknown" as const };
  }
  return {
    isOffline: context.isOffline,
    networkSpeed: context.networkSpeed,
  };
}
