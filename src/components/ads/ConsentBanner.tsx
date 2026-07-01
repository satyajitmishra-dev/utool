"use client";

import React, { useContext, useEffect, useState } from "react";
import { AdContext } from "@/context/AdContext";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, X, Cookie, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ConsentBanner() {
  const context = useContext(AdContext);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!context) return;
    // Show banner after 2 seconds if consent has not been saved yet
    if (!context.consent.saved && !context.isPremiumUser) {
      const timer = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [context]);

  if (!context || !visible) return null;

  const handleAcceptAll = () => {
    context.setConsent({
      gdprConsent: true,
      ccpaConsent: true,
      saved: true,
    });
    setVisible(false);
  };

  const handleDeclineAll = () => {
    context.setConsent({
      gdprConsent: false,
      ccpaConsent: false,
      saved: true,
    });
    setVisible(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-45">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="rounded-3xl border border-white/[0.08] bg-neutral-900/90 p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-16 -right-16 h-32 w-32 rounded-full bg-primary/10 blur-2xl pointer-events-none" />

          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary">
              <Cookie className="h-5 w-5" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  Privacy Settings
                </h4>
                <button
                  onClick={handleDeclineAll}
                  className="text-neutral-400 hover:text-white transition-colors"
                  aria-label="Close consent banner"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed text-justify">
                We use cookies and identifiers to analyze traffic, personalize advertisements, and enhance your workspace experience. Review our privacy policies for more information.
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <Button
              onClick={handleDeclineAll}
              variant="outline"
              className="flex-1 h-9 rounded-xl text-xs bg-transparent border-neutral-800 hover:bg-neutral-800 text-neutral-300 font-semibold"
            >
              Essential Only
            </Button>
            <Button
              onClick={handleAcceptAll}
              className="flex-1 h-9 rounded-xl text-xs bg-primary hover:bg-primary/95 text-white font-semibold flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="h-4 w-4" /> Accept All
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
