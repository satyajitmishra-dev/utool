"use client";

import React from "react";
import { cn } from "@/utils/cn";

interface AdLabelProps {
  className?: string;
  label?: string;
}

export function AdLabel({ className, label = "Sponsored" }: AdLabelProps) {
  return (
    <div
      className={cn(
        "text-[9px] uppercase tracking-widest text-neutral-500 font-bold select-none pb-1.5",
        className
      )}
    >
      {label}
    </div>
  );
}
export default AdLabel;
