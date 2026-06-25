import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/auth-context";
import {
  sendUserEmailVerification,
  reloadUserAuth,
  syncVerificationToFirestore,
  syncVerificationSessionCookie
} from "@/lib/firebase/verification";
import { toast } from "sonner";

const COOLDOWN_KEY = "utool_verification_cooldown";

export function useEmailVerification() {
  const { user } = useAuth();
  const [isVerified, setIsVerified] = useState<boolean>(user?.emailVerified ?? false);
  const [checking, setChecking] = useState<boolean>(false);
  const [resendCooldown, setResendCooldown] = useState<number>(0);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // Read initial cooldown from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedCooldown = localStorage.getItem(COOLDOWN_KEY);
    if (storedCooldown) {
      const remaining = Math.ceil((parseInt(storedCooldown, 10) - Date.now()) / 1000);
      if (remaining > 0) {
        setResendCooldown(remaining);
      } else {
        localStorage.removeItem(COOLDOWN_KEY);
      }
    }
  }, []);

  // Cooldown countdown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          localStorage.removeItem(COOLDOWN_KEY);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Track isVerified state matches user object updates
  useEffect(() => {
    if (user) {
      setIsVerified(user.emailVerified);
    }
  }, [user]);

  // Sync verification status function
  const handleVerificationSuccess = useCallback(async (uid: string) => {
    try {
      setIsVerified(true);
      setModalOpen(false);

      // Firestore sync
      await syncVerificationToFirestore(uid);

      // Session cookie sync
      await syncVerificationSessionCookie();

      toast.success("Email verified successfully!");

      // Analytics Tracking
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "verification_success", { uid });
      }
      console.log("[Analytics] verification_success", { uid });
    } catch (err) {
      console.error("Failed to sync email verification status:", err);
    }
  }, []);

  // 15-second polling system
  useEffect(() => {
    // If not logged in, or already verified, don't poll
    if (!user || isVerified) return;

    const interval = setInterval(async () => {
      try {
        const reloadedUser = await reloadUserAuth();
        if (reloadedUser && reloadedUser.emailVerified) {
          clearInterval(interval); // Stop polling immediately
          await handleVerificationSuccess(reloadedUser.uid);
        }
      } catch (err) {
        console.error("Polling error checking verification status:", err);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [user, isVerified, handleVerificationSuccess]);

  // Manual refresh status function
  const refreshStatus = useCallback(async () => {
    if (!user) return;
    setChecking(true);
    toast.info("Checking verification status...");

    try {
      const reloadedUser = await reloadUserAuth();
      if (reloadedUser && reloadedUser.emailVerified) {
        await handleVerificationSuccess(reloadedUser.uid);
      } else {
        toast.error("Your email is not verified yet. Please check your inbox.");
      }
    } catch (err: any) {
      console.error("Failed to reload user:", err);
      toast.error("Error checking verification status: " + err.message);
    } finally {
      setChecking(false);
    }
  }, [user, handleVerificationSuccess]);

  // Resend verification email function with localStorage cooldown rate-limiting
  const resendEmail = useCallback(async () => {
    if (!user) return;
    if (resendCooldown > 0) {
      toast.error(`Rate limit exceeded. Please wait ${resendCooldown} seconds before resending.`);
      return;
    }

    try {
      await sendUserEmailVerification();
      
      // Set 60-second cooldown and persist in localStorage
      const cooldownExpiry = Date.now() + 60000;
      localStorage.setItem(COOLDOWN_KEY, cooldownExpiry.toString());
      setResendCooldown(60);

      toast.success("Verification email sent!");

      // Analytics Tracking
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "verification_email_sent", { uid: user.uid });
      }
      console.log("[Analytics] verification_email_sent", { uid: user.uid });
    } catch (err: any) {
      console.error("Resend verification error:", err);
      toast.error(err.message || "Failed to send verification email.");
    }
  }, [user, resendCooldown]);

  // Opens/closes verification warning popup modal
  const triggerModal = useCallback((open: boolean) => {
    setModalOpen(open);
    if (open) {
      // Analytics Tracking
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "premium_access_blocked", { uid: user?.uid });
      }
      console.log("[Analytics] premium_access_blocked", { uid: user?.uid });
    }
  }, [user]);

  return {
    isVerified,
    checking,
    resendCooldown,
    modalOpen,
    setModalOpen: triggerModal,
    resendEmail,
    refreshStatus,
  };
}
