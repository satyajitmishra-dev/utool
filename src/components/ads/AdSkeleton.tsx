"use client";

import React from "react";
import { getReservationClasses } from "@/lib/ads/sizes";
import { cn } from "@/utils/cn";

interface AdSkeletonProps {
  size: string;
  className?: string;
}

export function AdSkeleton({ size, className }: AdSkeletonProps) {
  const reservationClass = getReservationClasses(size);

  return (
    <div
      className={cn(
        "relative rounded-2xl bg-neutral-900/40 border border-white/[0.04] overflow-hidden flex flex-col items-center justify-center p-4",
        reservationClass,
        className
      )}
    >
      {/* Skeleton Animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-shimmer" style={{ backgroundSize: "200% 100%" }} />

      <div className="flex flex-col items-center gap-2 relative z-10 opacity-40">
        <div className="h-2 w-16 bg-white/[0.08] rounded-full animate-pulse" />
        <div className="h-3.5 w-32 bg-white/[0.08] rounded-full animate-pulse" />
        {size === "300x600" || size === "970x250" || size === "native" ? (
          <div className="h-8 w-24 bg-white/[0.08] rounded-xl mt-2 animate-pulse" />
        ) : null}
      </div>
    </div>
  );
}
