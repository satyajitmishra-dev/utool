"use client";

import React from "react";
import { cn } from "@/utils/cn";
import { Sparkles, Loader2 } from "lucide-react";

interface ProcessButtonProps {
  onClick: () => void;
  isProcessing: boolean;
  progress: number; // 0-100
  progressLabel: string; // e.g. "Uploading...", "Processing..."
  idleLabel: string; // e.g. "Generate Subtitles"
  className?: string;
}

export function ProcessButton({
  onClick,
  isProcessing,
  progress,
  progressLabel,
  idleLabel,
  className,
}: ProcessButtonProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <button
      onClick={onClick}
      disabled={isProcessing}
      className={cn(
        "relative w-full h-12 rounded-xl font-bold text-sm overflow-hidden",
        "transition-all duration-300",
        "focus-ring",
        !isProcessing &&
          "bg-[image:var(--gradient-primary)] text-white shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.97] cursor-pointer",
        isProcessing && "bg-muted border border-border text-primary disabled:cursor-not-allowed",
        className
      )}
    >
      {/* Animated progress fill */}
      {isProcessing && (
        <div
          className="absolute inset-y-0 left-0 rounded-xl transition-[width] duration-500 ease-out bg-primary/15 dark:bg-primary/25"
          style={{
            width: `${clampedProgress}%`,
          }}
        />
      )}

      {/* Shimmer sweep on progress bar */}
      {isProcessing && clampedProgress > 0 && (
        <div
          className="absolute inset-y-0 left-0 rounded-xl overflow-hidden pointer-events-none"
          style={{ width: `${clampedProgress}%` }}
        >
          <div
            className="absolute inset-0 animate-[shimmer_2s_ease-in-out_infinite]"
            style={{
              backgroundImage:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
              backgroundSize: "200% 100%",
            }}
          />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center gap-2.5 px-4">
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin shrink-0" />
            <span className="truncate">
              {progressLabel || "Processing..."}
            </span>
            {clampedProgress > 0 && (
              <span className="text-[11px] font-black tabular-nums opacity-90 ml-auto shrink-0">
                {clampedProgress}%
              </span>
            )}
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 shrink-0" />
            <span>{idleLabel}</span>
          </>
        )}
      </div>
    </button>
  );
}
