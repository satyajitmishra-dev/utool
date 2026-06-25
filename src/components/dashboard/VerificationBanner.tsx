"use client";

import React from "react";
import { MailWarning, RefreshCw, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEmailVerification } from "@/hooks/useEmailVerification";
import { motion, AnimatePresence } from "framer-motion";

export function VerificationBanner() {
  const { isVerified, checking, resendCooldown, resendEmail, refreshStatus } = useEmailVerification();

  if (isVerified) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="w-full overflow-hidden"
      >
        <div className="bg-gradient-to-r from-warning/20 via-warning/10 to-transparent border border-warning/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 premium-shadow mb-6">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-warning/15 p-2 text-warning mt-0.5">
              <MailWarning className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground text-sm sm:text-base">Verify your email to unlock full features</h4>
              <p className="text-body-s text-muted-foreground mt-0.5">
                We sent a verification link to your email. Please check your inbox and verify your address.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              onClick={resendEmail}
              disabled={resendCooldown > 0}
              variant="outline"
              size="sm"
              className="rounded-xl flex-1 sm:flex-none"
            >
              <Send className="h-3.5 w-3.5 mr-1.5" />
              {resendCooldown > 0 ? `Resend (${resendCooldown}s)` : "Resend Email"}
            </Button>
            <Button
              onClick={refreshStatus}
              disabled={checking}
              variant="primary"
              size="sm"
              className="rounded-xl flex-1 sm:flex-none"
            >
              {checking ? (
                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
              ) : (
                <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              )}
              I Verified, Refresh
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
