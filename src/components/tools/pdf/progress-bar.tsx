"use client";

import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface ProgressBarProps {
  progress: number;
  statusMessage?: string;
}

export function ProgressBar({ progress, statusMessage = "Processing your files..." }: ProgressBarProps) {
  const roundedProgress = Math.min(100, Math.max(0, Math.round(progress)));

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8 border border-border/80 shadow-md flex flex-col gap-4">
      <div className="flex justify-between items-center text-sm">
        <span className="font-semibold text-foreground flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          {statusMessage}
        </span>
        <span className="font-bold text-primary font-mono text-right">{roundedProgress}%</span>
      </div>

      {/* Progress Track */}
      <div className="h-3 w-full bg-muted rounded-full overflow-hidden border border-border/20">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: `${roundedProgress}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>

      <p className="text-3xs text-muted-foreground text-center tracking-wide mt-1 uppercase font-semibold">
        Client-side process: files do not leave your browser.
      </p>
    </div>
  );
}
