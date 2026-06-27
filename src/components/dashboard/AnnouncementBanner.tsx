"use client";

import React, { useState, useEffect } from "react";
import { useRemoteConfig } from "@/services/remote-config.service";
import { Megaphone, X, ArrowRight, Sparkles, Info, AlertTriangle, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/utils/cn";

export function AnnouncementBanner() {
  const { bannerConfig, loading } = useRemoteConfig();
  const [dismissed, setDismissed] = useState(true); // Default to true (hidden) to prevent layout shift

  useEffect(() => {
    if (loading || !bannerConfig?.enabled) return;

    // Check localStorage to see if user has already dismissed this specific announcement
    const localKey = `dismissed_announcement_${encodeURIComponent(bannerConfig.text)}`;
    const isDismissed = localStorage.getItem(localKey) === "true";
    setDismissed(isDismissed);
  }, [loading, bannerConfig?.enabled, bannerConfig?.text]);

  const handleDismiss = () => {
    if (!bannerConfig?.text) return;
    const localKey = `dismissed_announcement_${encodeURIComponent(bannerConfig.text)}`;
    localStorage.setItem(localKey, "true");
    setDismissed(true);
  };

  if (loading || !bannerConfig?.enabled || dismissed) return null;

  // Icon selector based on announcement type
  const getIcon = () => {
    switch (bannerConfig.type) {
      case "premium":
        return <Sparkles className="h-5 w-5 text-white" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-success" />;
      case "info":
      default:
        return <Info className="h-5 w-5 text-primary" />;
    }
  };

  // Color scheme based on type
  const typeStyles = {
    premium: "bg-slate-900/90 dark:bg-card/45 border-indigo-500/30 text-white shadow-glow",
    info: "bg-primary/5 border-primary/20 text-foreground",
    warning: "bg-warning/5 border-warning/20 text-foreground",
    success: "bg-success/5 border-success/20 text-foreground",
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0, y: -10 }}
        animate={{ height: "auto", opacity: 1, y: 0 }}
        exit={{ height: 0, opacity: 0, y: -10 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full overflow-hidden mb-6"
      >
        <div
          className={cn(
            "relative w-full border rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all duration-300 backdrop-blur-md",
            typeStyles[bannerConfig.type as keyof typeof typeStyles] || typeStyles.info
          )}
        >
          {/* Background Gradient effects for Premium variant */}
          {bannerConfig.type === "premium" && (
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent pointer-events-none" />
          )}

          {/* Announcement content */}
          <div className="flex items-start gap-3.5 relative z-10">
            <div
              className={cn(
                "rounded-xl p-2.5 flex-shrink-0 flex items-center justify-center",
                bannerConfig.type === "premium"
                  ? "bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-md"
                  : bannerConfig.type === "warning"
                  ? "bg-warning/10"
                  : bannerConfig.type === "success"
                  ? "bg-success/10"
                  : "bg-primary/10"
              )}
            >
              {getIcon()}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "text-3xs font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider",
                    bannerConfig.type === "premium"
                      ? "bg-indigo-500/20 text-indigo-200 border border-indigo-400/20"
                      : "bg-muted-foreground/10 text-muted-foreground"
                  )}
                >
                  Announcement
                </span>
              </div>
              <p className="text-body-s font-medium leading-relaxed max-w-[700px]">
                {bannerConfig.text}
              </p>
            </div>
          </div>

          {/* Action links & close */}
          <div className="flex items-center gap-3 w-full md:w-auto self-stretch md:self-auto justify-end relative z-10 pl-11 md:pl-0">
            {bannerConfig.link && bannerConfig.linkText && (
              <Link href={bannerConfig.link} className="flex-1 md:flex-none">
                <button
                  className={cn(
                    "flex items-center justify-center gap-1.5 rounded-full text-body-s font-semibold px-4.5 py-2 transition-all active:scale-95 cursor-pointer",
                    bannerConfig.type === "premium"
                      ? "bg-white text-slate-900 hover:bg-white/90 shadow-sm"
                      : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shadow-primary/10"
                  )}
                >
                  {bannerConfig.linkText}
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </Link>
            )}

            <button
              onClick={handleDismiss}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-xl border transition-all active:scale-95 cursor-pointer",
                bannerConfig.type === "premium"
                  ? "border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10"
                  : "border-border/60 bg-card/30 text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
              aria-label="Dismiss announcement"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
export default AnnouncementBanner;
