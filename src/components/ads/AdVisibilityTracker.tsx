"use client";

import React from "react";
import { useAdVisibility } from "@/hooks/useAdVisibility";

interface AdVisibilityTrackerProps {
  children: React.ReactNode;
  onVisible: () => void;
  className?: string;
}

export function AdVisibilityTracker({ children, onVisible, className }: AdVisibilityTrackerProps) {
  const { elementRef } = useAdVisibility(onVisible);

  return (
    <div ref={elementRef as any} className={className}>
      {children}
    </div>
  );
}
export default AdVisibilityTracker;
