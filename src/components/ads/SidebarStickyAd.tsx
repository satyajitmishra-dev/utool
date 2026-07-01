"use client";

import React from "react";
import { cn } from "@/utils/cn";

interface SidebarStickyAdProps {
  children: React.ReactNode;
  className?: string;
  topOffset?: number; // Distance in pixels from the top viewport (e.g. 96 for header height)
}

export function SidebarStickyAd({ children, className, topOffset = 96 }: SidebarStickyAdProps) {
  return (
    <aside
      className={cn(
        "hidden lg:block shrink-0 w-[300px] self-start z-10",
        className
      )}
      style={{
        position: "sticky",
        top: `${topOffset}px`,
      }}
    >
      <div className="w-full flex flex-col gap-3">
        {children}
      </div>
    </aside>
  );
}
export default SidebarStickyAd;
