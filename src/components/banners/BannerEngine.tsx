"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToolLimit } from "@/hooks/use-tool-limit";
import { useAuth } from "@/hooks/use-auth";
import { usePathname, useRouter } from "next/navigation";
import { Sparkles, AlertTriangle, X, ShieldAlert, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BannerEngine() {
  const { limitStatus, loading, refresh } = useToolLimit();
  const { loginWithGoogle, user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  if (loading || !limitStatus || limitStatus.tier === "pro" || limitStatus.tier === "enterprise") {
    return null;
  }

  const { count, max, isLimited } = limitStatus;
  const isGuest = !user;

  // Google Sign-In with popup + redirect/merge
  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const credential = await loginWithGoogle();
      // Try calling merge endpoint
      const guestId = typeof window !== "undefined" ? localStorage.getItem("utool_anonymous_id") : null;
      if (guestId && credential?.user?.uid) {
        await fetch("/api/auth/merge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ guestId, userId: credential.user.uid }),
        });
      }
      refresh();
    } catch (err) {
      console.error("Google login failed", err);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // 1. Hard Paywall Modal (when limit is exceeded)
  if (isLimited) {
    return (
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-md p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-lg rounded-3xl border border-neutral-800 bg-neutral-900/90 p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-violet-600/10 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-indigo-600/10 blur-3xl" />

            <div className="flex flex-col items-center text-center space-y-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
                {isGuest ? <LogIn className="h-8 w-8" /> : <ShieldAlert className="h-8 w-8" />}
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold tracking-tight text-white">
                  {isGuest ? "Access Your Daily Credits" : "Limit Exceeded"}
                </h3>
                <p className="text-sm text-neutral-400">
                  {isGuest
                    ? "You've used your 1 free guest tool action today. Create a free account to unlock 3 tool actions per day."
                    : "You've reached your limit of 3 free daily tool actions. Upgrade to Pro for unlimited access."}
                </p>
              </div>

              {isGuest ? (
                <div className="w-full space-y-3 pt-2">
                  <Button
                    onClick={handleGoogleLogin}
                    disabled={isGoogleLoading}
                    className="w-full bg-white text-black hover:bg-neutral-200 h-12 rounded-xl font-semibold flex items-center justify-center gap-2.5 transition-all shadow-md"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    Continue with Google
                  </Button>

                  <Button
                    onClick={() => router.push(`/signup?redirect=${encodeURIComponent(pathname)}`)}
                    className="w-full bg-neutral-800 border border-neutral-700 text-white hover:bg-neutral-700 h-12 rounded-xl font-semibold transition-all"
                  >
                    Sign up with Email
                  </Button>

                  <button
                    onClick={() => router.push(`/pricing?redirect=${encodeURIComponent(pathname)}`)}
                    className="text-xs text-neutral-400 hover:text-white underline transition-colors block mx-auto mt-2"
                  >
                    Upgrade to Pro instead (₹29/mo)
                  </button>
                </div>
              ) : (
                <div className="w-full space-y-3 pt-2">
                  <Button
                    onClick={() => router.push(`/pricing?redirect=${encodeURIComponent(pathname)}`)}
                    className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:opacity-95 h-12 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] border-0"
                  >
                    <Sparkles className="h-5 w-5" />
                    Upgrade to Pro (₹29)
                  </Button>

                  <button
                    onClick={() => router.push("/")}
                    className="text-xs text-neutral-400 hover:text-white transition-colors block mx-auto"
                  >
                    Back to Home
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    );
  }

  // 2. Inline warning / promotion banners (count < max)
  if (bannerDismissed) return null;

  let bannerContent = null;

  if (!isGuest && count === 1) {
    // Free registered user: count is 1 (out of 3)
    bannerContent = {
      text: "Running lots of files? Upgrade to Pro for unlimited actions, high-speed rendering, and priority storage.",
      cta: "Upgrade to Pro",
      link: `/pricing?redirect=${encodeURIComponent(pathname)}`,
      icon: <Sparkles className="h-4 w-4 text-violet-400" />,
      colorClass: "bg-violet-950/20 border-violet-900/30 text-violet-300",
    };
  } else if (!isGuest && count === 2) {
    // Free registered user: count is 2 (final free action remaining)
    bannerContent = {
      text: "Daily limit warning: You have only 1 free daily action remaining. Upgrade to Pro for unlimited conversions.",
      cta: "Get Unlimited Access",
      link: `/pricing?redirect=${encodeURIComponent(pathname)}`,
      icon: <AlertTriangle className="h-4 w-4 text-amber-400" />,
      colorClass: "bg-amber-950/20 border-amber-900/30 text-amber-300",
    };
  }

  if (!bannerContent) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 shadow-sm ${bannerContent.colorClass}`}
    >
      <div className="flex items-center gap-3">
        {bannerContent.icon}
        <span className="text-sm font-medium">{bannerContent.text}</span>
      </div>
      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
        <Button
          size="sm"
          onClick={() => router.push(bannerContent!.link)}
          className="bg-white text-black hover:bg-neutral-200 text-xs py-1.5 h-8 font-semibold rounded-lg shadow-sm w-full sm:w-auto"
        >
          {bannerContent.cta}
        </Button>
        <button
          onClick={() => setBannerDismissed(true)}
          className="p-1 text-current opacity-60 hover:opacity-100 transition-opacity"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}
