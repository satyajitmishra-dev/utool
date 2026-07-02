"use client";

import React, { useEffect, useState, useRef } from "react";
import { RefreshCw, Wifi, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/utils/cn";

export interface ExperienceRetryProps {
  onRetry?: () => void | Promise<void>;
  initialCountdown?: number; // seconds
  className?: string;
}

export function ExperienceRetry({ onRetry, initialCountdown = 10, className }: ExperienceRetryProps) {
  const [countdown, setCountdown] = useState(initialCountdown);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Listen for browser returning online
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOnline = () => {
      toast.success("Internet connection restored! Autoretrying workspace...", { icon: "🌐" });
      triggerRetry();
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [retryCount]);

  // 2. Manage Countdown Timer
  useEffect(() => {
    if (countdown <= 0) {
      triggerRetry();
      return;
    }

    timerRef.current = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [countdown]);

  const triggerRetry = async () => {
    if (isRetrying) return;
    setIsRetrying(true);
    toast.info("Connecting to UTool workspace...");

    try {
      if (onRetry) {
        await onRetry();
      } else {
        // Fallback: reload page
        if (typeof window !== "undefined") {
          window.location.reload();
        }
      }
    } catch (err) {
      // Exponential Backoff: increase wait time
      const nextCount = retryCount + 1;
      setRetryCount(nextCount);
      const nextDelay = Math.min(initialCountdown * Math.pow(2, nextCount), 120); // cap at 2 mins
      setCountdown(nextDelay);
      toast.error(`Sync failed. Retrying in ${nextDelay}s (Attempt #${nextCount + 1})`);
    } finally {
      setIsRetrying(false);
    }
  };

  // SVG parameters for the countdown circle
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (countdown / initialCountdown) * circumference;

  return (
    <div className={cn("w-full max-w-sm mx-auto text-center flex flex-col items-center gap-4 animate-fade-in", className)}>
      <div className="relative w-20 h-20 flex items-center justify-center">
        {/* SVG Progress Circle */}
        <svg className="w-20 h-20 transform -rotate-90">
          <circle
            cx="40"
            cy="40"
            r={radius}
            className="stroke-muted fill-transparent"
            strokeWidth="4"
          />
          <circle
            cx="40"
            cy="40"
            r={radius}
            className="stroke-primary fill-transparent transition-all duration-1000"
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={isNaN(strokeDashoffset) ? 0 : strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>

        {/* Countdown Center Text */}
        <div className="absolute text-sm font-mono font-bold text-foreground">
          {countdown > 0 ? `${countdown}s` : <Wifi className="animate-pulse text-primary" size={20} />}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-foreground">
          {isRetrying ? "Establishing connection..." : `Next sync in ${countdown} seconds`}
        </span>
        {retryCount > 0 && (
          <span className="text-[10px] text-muted-foreground flex items-center gap-1 justify-center">
            <AlertTriangle size={10} className="text-amber-500" />
            Exponential backoff active. Attempts: {retryCount}
          </span>
        )}
      </div>

      {/* Manual retry button */}
      <button
        onClick={triggerRetry}
        disabled={isRetrying}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground px-4 py-2 shadow-xs transition-all active:scale-95 cursor-pointer disabled:opacity-50"
      >
        <RefreshCw size={12} className={cn(isRetrying && "animate-spin")} />
        Sync Now
      </button>
    </div>
  );
}
export default ExperienceRetry;
