"use client";

import React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { MailCheck, RefreshCw, Send, Loader2 } from "lucide-react";
import { useEmailVerification } from "@/hooks/useEmailVerification";

interface VerificationModalProps {
  open: boolean;
  onClose: () => void;
}

export function VerificationModal({ open, onClose }: VerificationModalProps) {
  const { checking, resendCooldown, resendEmail, refreshStatus, isVerified } = useEmailVerification();

  // If verified inside the modal, auto close
  React.useEffect(() => {
    if (isVerified && open) {
      onClose();
    }
  }, [isVerified, open, onClose]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
    >
      <div className="text-center p-2">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-warning/20 to-warning/5 text-warning mx-auto mb-6 border border-warning/20">
          <MailCheck className="h-8 w-8 animate-float" />
        </div>
        <h2 className="text-h2 text-foreground font-bold">
          Verify Your Email
        </h2>
        <p className="mt-3 text-body-m text-muted-foreground">
          Your email is not verified. Please verify your email to unlock premium tools and premium features.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Button
            onClick={resendEmail}
            disabled={resendCooldown > 0}
            variant="outline"
            className="flex-1 rounded-xl h-11"
          >
            <Send className="h-4 w-4 mr-2" />
            {resendCooldown > 0 ? `Resend (${resendCooldown}s)` : "Resend Email"}
          </Button>
          <Button
            onClick={refreshStatus}
            disabled={checking}
            variant="primary"
            className="flex-1 rounded-xl h-11"
          >
            {checking ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            I Verified, Refresh
          </Button>
        </div>
        <button
          onClick={onClose}
          className="mt-4 text-body-s text-muted-foreground hover:text-foreground transition-colors"
        >
          Maybe later
        </button>
      </div>
    </Modal>
  );
}
