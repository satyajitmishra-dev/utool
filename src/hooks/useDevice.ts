"use client";

import { useState, useEffect } from "react";
import { getDeviceViewport } from "@/lib/ads/utils";

export function useDevice() {
  const [device, setDevice] = useState<"mobile" | "tablet" | "desktop">("desktop");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setDevice(getDeviceViewport());
    };

    handleResize(); // Initial call
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    device,
    isMobile: device === "mobile",
    isTablet: device === "tablet",
    isDesktop: device === "desktop",
  };
}
