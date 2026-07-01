"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AD_POLICY_FORBIDDEN_PATHS } from "@/lib/ads/constants";

interface AdPolicyGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Enforces Google AdSense compliance by preventing ad components from rendering
 * in highly interactive settings like converters, processing steps, or checkout paths.
 */
export function AdPolicyGuard({ children, fallback = null }: AdPolicyGuardProps) {
  const pathname = usePathname();

  // 1. Check if the pathname matches forbidden paths
  const isForbidden = AD_POLICY_FORBIDDEN_PATHS.some((forbidden) =>
    pathname.startsWith(forbidden)
  );

  // 2. Extra checks: make sure we are not inside active operations (e.g. upload settings, canvas)
  const isToolWorkspacePage = pathname.includes("/tools/") && 
    (pathname.includes("/processing") || 
     pathname.includes("/results") || 
     pathname.includes("/edit"));

  if (isForbidden || isToolWorkspacePage) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
