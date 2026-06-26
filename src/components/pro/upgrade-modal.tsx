"use client";

import React from "react";
import { Modal } from "@/components/ui/modal";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
}

export function UpgradeModal({ open, onClose }: UpgradeModalProps) {
  const handleUpgrade = () => {
    onClose();
    // Redirect to the centralized billing page
    window.location.href = "/billing";
  };

  return (
    <Modal open={open} onClose={onClose} size="sm" className="!bg-card/95 border-border shadow-2xl backdrop-blur-md">
      <div className="text-center space-y-6 py-2">
        {/* Sparkle Icon */}
        <div className="inline-flex rounded-2xl bg-amber-500/10 p-4 text-amber-500 mx-auto">
          <Sparkles className="h-8 w-8 animate-pulse" />
        </div>

        {/* Header Title */}
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Upgrade to Pro</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Get unlimited access to state-of-the-art AI tools, fast local processing, and priority assistance.
          </p>
        </div>

        {/* Benefits Card */}
        <div className="bg-muted/40 rounded-2xl p-5 border border-border/80 space-y-3.5 text-left">
          <div className="flex items-center gap-3 text-sm text-foreground/90 font-medium">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500 shrink-0">
              <Check className="h-3 w-3" />
            </div>
            <span>Unlimited access with no rate limits</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-foreground/90 font-medium">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500 shrink-0">
              <Check className="h-3 w-3" />
            </div>
            <span>Premium AI-powered tools</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-foreground/90 font-medium">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500 shrink-0">
              <Check className="h-3 w-3" />
            </div>
            <span>Faster server processing priorities</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-foreground/90 font-medium">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500 shrink-0">
              <Check className="h-3 w-3" />
            </div>
            <span>24/7 Priority support channel</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-2.5 pt-2">
          <Button variant="premium" className="w-full py-6 text-sm tracking-wide font-bold transition-transform hover:scale-[1.01] active:scale-[0.99]" onClick={handleUpgrade}>
            Upgrade Now
          </Button>
          <Button variant="ghost" className="w-full text-muted-foreground hover:text-foreground text-xs" onClick={onClose}>
            Maybe Later
          </Button>
        </div>
      </div>
    </Modal>
  );
}
