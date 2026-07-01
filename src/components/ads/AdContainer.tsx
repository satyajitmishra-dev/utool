"use client";

import React from "react";
import { cn } from "@/utils/cn";
import { AdLabel } from "./AdLabel";

interface AdContainerProps {
  children: React.ReactNode;
  className?: string;
  size: string;
  showLabel?: boolean;
}

export function AdContainer({ children, className, size, showLabel = true }: AdContainerProps) {
  // Center alignments based on sizes
  const isSidebar = size === "300x600" || size === "250x250";
  const isBottomSticky = size === "bottom-sticky";

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center w-full mx-auto my-6 text-center select-none",
        isBottomSticky && "my-0",
        className
      )}
    >
      {showLabel && <AdLabel />}
      <div
        className={cn(
          "relative border border-white/[0.04] bg-neutral-900/10 dark:bg-black/10 rounded-2xl p-1.5 shadow-xs overflow-hidden flex items-center justify-center backdrop-blur-xs",
          isSidebar && "p-2",
          isBottomSticky && "border-none bg-transparent rounded-none p-0 shadow-none backdrop-blur-none"
        )}
      >
        {children}
      </div>
    </div>
  );
}
export default AdContainer;
