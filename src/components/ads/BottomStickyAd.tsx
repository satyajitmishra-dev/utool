"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";

interface BottomStickyAdProps {
  children: React.ReactNode;
  className?: string;
}

export function BottomStickyAd({ children, className }: BottomStickyAdProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isKeyboardActive, setIsKeyboardActive] = useState(false);

  // Keyboard detection: hide ad when an input/textarea is focused on mobile
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        setIsKeyboardActive(true);
      }
    };

    const handleFocusOut = () => {
      setIsKeyboardActive(false);
    };

    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);

    // Visual Viewport resize detection (extra safety for Android keyboards)
    const handleViewportChange = () => {
      const viewport = window.visualViewport;
      if (viewport) {
        // If height shrinks substantially, keyboard is likely active
        const isShrunk = viewport.height < window.innerHeight * 0.75;
        setIsKeyboardActive(isShrunk);
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleViewportChange);
    }

    return () => {
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleViewportChange);
      }
    };
  }, []);

  if (isDismissed || isKeyboardActive) return null;

  return (
    <AnimatePresence>
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/85 backdrop-blur-md border-t border-white/[0.06] py-2 flex justify-center pb-safe-bottom md:hidden",
          className
        )}
      >
        <div className="relative w-full max-w-[320px] flex items-center justify-center">
          {/* Dismiss trigger */}
          <button
            onClick={() => setIsDismissed(true)}
            className="absolute -top-3 -right-3 h-6 w-6 rounded-full bg-neutral-900 border border-white/[0.08] text-neutral-400 hover:text-white flex items-center justify-center shadow-md transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="h-3 w-3" />
          </button>

          <div className="flex-1 flex justify-center overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
}
export default BottomStickyAd;
