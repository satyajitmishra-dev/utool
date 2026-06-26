"use client";

import React from "react";
import { usePro } from "@/hooks/use-pro";
import { Lock } from "lucide-react";
import { cn } from "@/utils/cn";
import { FeatureKey } from "@/types/pro";

interface ProFeatureProps {
  children: React.ReactNode;
  feature?: FeatureKey;
  fallbackVariant?: "button" | "card" | "inline";
  className?: string;
}

export function ProFeature({
  children,
  feature,
  fallbackVariant = "button",
  className,
}: ProFeatureProps) {
  const { isPro, canUse, showUpgrade } = usePro();
  const allowed = feature ? canUse(feature) : isPro;

  if (allowed) {
    return <>{children}</>;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    showUpgrade();
  };

  if (fallbackVariant === "button") {
    // If children is a valid React element, we attempt to clone and style it
    if (React.isValidElement(children)) {
      const child = children as React.ReactElement<any>;
      return React.cloneElement(child, {
        disabled: false, // We control click, so keep click active for modal
        className: cn(
          child.props.className,
          "relative overflow-hidden cursor-pointer select-none filter blur-[0.3px] opacity-75"
        ),
        onClick: handleClick,
        children: (
          <span className="flex items-center gap-1.5 justify-center">
            <Lock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            {child.props.children}
            <span className="text-[9px] bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide shrink-0">
              PRO
            </span>
          </span>
        ),
      });
    }

    // Fallback if children is not a valid element
    return (
      <button
        onClick={handleClick}
        className={cn(
          "inline-flex items-center justify-center font-semibold h-10 px-5 text-sm gap-2 rounded-xl border border-border bg-muted/60 text-muted-foreground hover:bg-muted/80 cursor-pointer",
          className
        )}
      >
        <Lock className="h-4 w-4 shrink-0" />
        Unlock Premium
        <span className="text-[9px] bg-amber-500 text-white font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide">
          PRO
        </span>
      </button>
    );
  }

  if (fallbackVariant === "card") {
    return (
      <div
        className={cn("relative group cursor-pointer overflow-hidden rounded-3xl", className)}
        onClick={handleClick}
      >
        {/* Faded/blurred content */}
        <div className="opacity-45 blur-[1.5px] select-none pointer-events-none transition-all group-hover:opacity-30">
          {children}
        </div>
        {/* Centered lock overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-background/35 backdrop-blur-[1px] border border-dashed border-border/80 rounded-3xl transition-all duration-300 group-hover:bg-background/45">
          <div className="bg-card/90 border border-border p-3.5 rounded-2xl shadow-xl text-primary mb-3 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
            <Lock className="h-5 w-5 text-amber-500" />
          </div>
          <span className="text-xs font-extrabold bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-1 rounded-full uppercase tracking-widest mb-1.5 shadow-md">
            Unlock PRO Feature
          </span>
          <span className="text-[10px] text-muted-foreground font-semibold text-center max-w-[200px]">
            This feature is available only for Pro members. Click to upgrade.
          </span>
        </div>
      </div>
    );
  }

  // Inline Fallback
  return (
    <span
      onClick={handleClick}
      className={cn(
        "inline-flex items-center gap-1.5 text-xs text-amber-500 font-bold cursor-pointer hover:underline bg-amber-500/5 px-2 py-1 rounded-lg border border-amber-500/10",
        className
      )}
      title="This feature is available only for Pro members."
    >
      <Lock className="h-3 w-3 shrink-0" />
      PRO
    </span>
  );
}
