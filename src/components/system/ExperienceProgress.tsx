"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "@/utils/cn";

export interface ExperienceProgressProps {
  progress?: number; // Optional exact progress (0-100)
  className?: string;
  simulate?: boolean;
}

const PROGRESS_PHASES = [
  "Initializing local sandboxed environment...",
  "Loading client-side WebAssembly files...",
  "Reading file metadata structures...",
  "Compressing streams and optimizing layout...",
  "Running vector optimization algorithms...",
  "Finalizing rendering tree and preparing output...",
  "Almost ready! Verifying formatting safety...",
];

export function ExperienceProgress({ progress, className, simulate = true }: ExperienceProgressProps) {
  const [simulatedPercent, setSimulatedPercent] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);

  // Simulation timer if no static progress value is supplied
  useEffect(() => {
    if (progress !== undefined || !simulate) return;

    // Simulate progress increments
    const progressTimer = setInterval(() => {
      setSimulatedPercent((prev) => {
        if (prev >= 98) {
          clearInterval(progressTimer);
          return 98; // Stay at 98% until parent finishes/resets
        }
        const increment = Math.floor(Math.random() * 8) + 2;
        return Math.min(prev + increment, 98);
      });
    }, 450);

    // Simulate phase shifts
    const phaseTimer = setInterval(() => {
      setPhaseIndex((prev) => (prev < PROGRESS_PHASES.length - 1 ? prev + 1 : prev));
    }, 2200);

    return () => {
      clearInterval(progressTimer);
      clearInterval(phaseTimer);
    };
  }, [progress, simulate]);

  const activePercent = progress !== undefined ? progress : simulatedPercent;
  const activePhase = PROGRESS_PHASES[phaseIndex];

  return (
    <div className={cn("w-full max-w-md mx-auto flex flex-col gap-4 text-center select-none animate-fade-in", className)}>
      {/* Percentage Loader Card */}
      <div className="glass-card p-5 rounded-2xl border border-border/80 bg-card/30 shadow-xs backdrop-blur-md flex flex-col gap-3.5">
        <div className="flex justify-between items-center text-xs">
          <span className="font-semibold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
            <Sparkles size={12} className="text-primary animate-pulse" />
            Local Processing Engine
          </span>
          <span className="font-mono font-bold text-foreground text-sm">
            {activePercent}%
          </span>
        </div>

        {/* Progress bar shell */}
        <div className="w-full h-3 bg-muted/60 rounded-full overflow-hidden border border-border/30">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${activePercent}%` }}
            transition={{ ease: "easeOut", duration: 0.3 }}
            className="h-full bg-linear-to-r from-primary to-secondary rounded-full relative"
          >
            {/* Shimmer reflection */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.25)_50%,transparent_100%)] w-1/2 animate-shimmer" />
          </motion.div>
        </div>

        {/* Status Message */}
        <div className="h-4 flex items-center justify-center">
          <motion.span
            key={activePhase}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="text-xs text-muted-foreground font-medium"
          >
            {activePhase}
          </motion.span>
        </div>
      </div>

      {/* Structured Loading Skeletons */}
      <div className="flex flex-col gap-2 p-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-muted animate-pulse" />
          <div className="flex-1 flex flex-col gap-1.5">
            <div className="w-1/3 h-3 bg-muted rounded-full animate-pulse" />
            <div className="w-2/3 h-2 bg-muted rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
export default ExperienceProgress;
