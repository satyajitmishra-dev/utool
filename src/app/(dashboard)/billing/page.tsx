"use client";

import React, { useState, useEffect } from "react";
import { CreditCard, Check, ShieldCheck, Loader2, Sparkles, AlertCircle, Clock, ExternalLink, HelpCircle } from "lucide-react";
import { detectCurrency, formatPrice, CurrencyCode, convertInrToCurrency } from "@/utils/currency";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";
import { db } from "@/config/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useToolLimit } from "@/hooks/use-tool-limit";
import { cn } from "@/utils/cn";
import { useRemoteConfig } from "@/services/remote-config.service";

interface Invoice {
  id: string;
  uid: string;
  subscriptionId: string;
  paymentId: string;
  amount: number;
  currency: string;
  status: string;
  planName: string;
  invoiceMonth: string;
  date: string;
  createdAt: any;
  paymentType?: string;
  planType?: string;
  invoiceType?: string;
  paymentMethod?: string;
  receiptUrl?: string | null;
}

export default function BillingPage() {
  const { user, loading: authLoading } = useAuth();
  const { limitStatus } = useToolLimit();
  const { pricingConfig, timeRemaining, loading: configLoading } = useRemoteConfig();
  const [loading, setLoading] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [currency, setCurrency] = useState<CurrencyCode>("USD");

  // Live Firestore subscription state
  const [subscriptionTier, setSubscriptionTier] = useState<string>("free");
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>("none");
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [planType, setPlanType] = useState<string | null>(null);
  const [paymentReference, setPaymentReference] = useState<string | null>(null);
  
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [dbLoading, setDbLoading] = useState(true);

  useEffect(() => {
    setCurrency(detectCurrency());
  }, []);

  // Fetch billing history from secure backend API
  const fetchInvoices = async () => {
    if (!user) return;
    try {
      const res = await fetch("/api/razorpay/billing-history");
      if (res.ok) {
        const data = await res.json();
        setInvoices(data.invoices || []);
      }
    } catch (e) {
      console.error("Failed to fetch billing history:", e);
    }
  };

  // Listen to live user profile changes and fetch history
  useEffect(() => {
    if (!user) {
      if (!authLoading) {
        setDbLoading(false);
      }
      return;
    }

    const userDocRef = doc(db, "users", user.uid);
    const unsubscribeProfile = onSnapshot(
      userDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSubscriptionTier(data.subscriptionTier || "free");
          setSubscriptionStatus(data.subscriptionStatus || "none");
          setSubscriptionId(data.subscriptionId || null);
          setPlanType(data.planType || null);
          setPaymentReference(data.paymentReference || null);
        }
        setDbLoading(false);
      },
      (err) => {
        console.error("Error listening to user profile:", err);
        setDbLoading(false);
      }
    );

    // Fetch invoices on load
    fetchInvoices();

    return () => {
      unsubscribeProfile();
    };
  }, [user, authLoading]);

  // Load Razorpay script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Handle Monthly Subscription Checkout
  const handleUpgradeMonthly = async () => {
    setLoading("monthly");
    const toastId = toast.loading("Connecting to secure Razorpay Subscription portal...");

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Failed to load payment gateway. Please try again.", { id: toastId });
        setLoading(null);
        return;
      }

      // We send fixed price but server uses process.env.RAZORPAY_MONTHLY_PRICE securely
      const response = await fetch("/api/razorpay/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price: pricingConfig.monthly.price }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to initiate subscription");
      }

      const { subscriptionId: subId, keyId } = await response.json();

      const options = {
        key: keyId,
        subscription_id: subId,
        name: "Toolzy Pro",
        description: "Monthly Pro Subscription (Auto-renew)",
        handler: async function (checkoutResponse: any) {
          toast.loading("Verifying your subscription payment...", { id: toastId });
          try {
            const verifyRes = await fetch("/api/razorpay/verify-subscription", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                subscriptionId: checkoutResponse.razorpay_subscription_id,
                paymentId: checkoutResponse.razorpay_payment_id,
                signature: checkoutResponse.razorpay_signature,
              }),
            });

            if (verifyRes.ok) {
              toast.success("Subscription activated! Welcome to Toolzy Pro.", { id: toastId });
              fetchInvoices();
            } else {
              toast.error("Payment verification failed. Please contact support.", { id: toastId });
            }
          } catch (verifyError) {
            console.error("Verification endpoint error:", verifyError);
            toast.error("Payment verification failed. Please contact support.", { id: toastId });
          } finally {
            setLoading(null);
          }
        },
        prefill: {
          email: user?.email || "",
          name: user?.displayName || "",
        },
        theme: {
          color: "#6366f1",
        },
        modal: {
          ondismiss: function () {
            toast.dismiss(toastId);
            setLoading(null);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      toast.dismiss(toastId);
      rzp.open();
    } catch (error: any) {
      console.error("Monthly checkout failed:", error);
      toast.error(error.message || "Monthly checkout failed to initialize.", { id: toastId });
      setLoading(null);
    }
  };

  // Handle Lifetime One-time Order Checkout
  const handleUpgradeLifetime = async () => {
    setLoading("lifetime");
    const toastId = toast.loading("Connecting to secure Razorpay Order portal...");

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Failed to load payment gateway. Please try again.", { id: toastId });
        setLoading(null);
        return;
      }

      // Initiate Razorpay Order on server side
      const response = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price: pricingConfig.lifetime.price }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to create order");
      }

      const { orderId, keyId, amount } = await response.json();

      const options = {
        key: keyId,
        amount: amount,
        currency: "INR",
        name: "Toolzy Pro Lifetime",
        description: "One-time Lifetime Pro Activation",
        order_id: orderId,
        handler: async function (checkoutResponse: any) {
          toast.loading("Verifying your lifetime order payment...", { id: toastId });
          try {
            const verifyRes = await fetch("/api/razorpay/verify-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: checkoutResponse.razorpay_order_id,
                paymentId: checkoutResponse.razorpay_payment_id,
                signature: checkoutResponse.razorpay_signature,
              }),
            });

            if (verifyRes.ok) {
              toast.success("Lifetime Pro unlocked! Enjoy lifetime premium updates.", { id: toastId });
              fetchInvoices();
            } else {
              toast.error("Payment verification failed. Please contact support.", { id: toastId });
            }
          } catch (verifyError) {
            console.error("Verification endpoint error:", verifyError);
            toast.error("Payment verification failed. Please contact support.", { id: toastId });
          } finally {
            setLoading(null);
          }
        },
        prefill: {
          email: user?.email || "",
          name: user?.displayName || "",
        },
        theme: {
          color: "#8b5cf6", // Premium violet theme color
        },
        modal: {
          ondismiss: function () {
            toast.dismiss(toastId);
            setLoading(null);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      toast.dismiss(toastId);
      rzp.open();
    } catch (error: any) {
      console.error("Lifetime checkout failed:", error);
      toast.error(error.message || "Lifetime checkout failed to initialize.", { id: toastId });
      setLoading(null);
    }
  };

  // Handle Cancellation (only for active monthly subscribers)
  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel your Pro subscription? You will lose unlimited access at the end of the billing cycle.")) {
      return;
    }

    setCancelling(true);
    const toastId = toast.loading("Processing cancellation request...");

    try {
      const res = await fetch("/api/razorpay/cancel-subscription", {
        method: "POST",
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(
          data.message || "Your subscription will end after the current billing cycle.",
          { id: toastId }
        );
        fetchInvoices();
      } else {
        const errData = await res.json();
        toast.error(errData.error || "Cancellation failed. Please try again.", { id: toastId });
      }
    } catch (error) {
      console.error("Cancellation failed:", error);
      toast.error("Cancellation failed. Please try again.", { id: toastId });
    } finally {
      setCancelling(false);
    }
  };

  // Determine current display info
  const isPro = subscriptionTier === "pro";
  const isCancelledPending = isPro && subscriptionStatus === "cancelled";
  const isExpired = subscriptionStatus === "expired";

  const getPlanName = () => {
    if (isPro) {
      if (planType === "lifetime") return "Pro Lifetime Member";
      return "Pro Monthly Subscriber";
    }
    if (isExpired) return "Expired Pro Account";
    return "Free Starter Plan";
  };

  const getStatusBadge = () => {
    if (isCancelledPending) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-400 border border-amber-500/15">
          <AlertCircle className="h-3 w-3" />
          Expires at end of cycle
        </span>
      );
    }
    if (isPro && subscriptionStatus === "active") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/15">
          <ShieldCheck className="h-3 w-3" />
          Active
        </span>
      );
    }
    if (isExpired) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-0.5 text-xs font-semibold text-rose-400 border border-rose-500/15">
          Expired
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-500/10 px-2.5 py-0.5 text-xs font-semibold text-slate-400 border border-slate-500/15">
        Free Tier
      </span>
    );
  };

  if (authLoading || dbLoading || configLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground animate-pulse">Loading your billing details...</p>
      </div>
    );
  }

  const usageCount = limitStatus?.count || 0;
  const usageMax = limitStatus?.max || 3;
  const usagePercent = Math.min(100, Math.round((usageCount / usageMax) * 100));
  const isProOrEnterprise = isPro;

  // Localized prices for Frontend UI
  const monthlyPriceVal = convertInrToCurrency(pricingConfig.monthly.price, currency);
  const monthlyOriginalPriceVal = convertInrToCurrency(pricingConfig.monthly.originalPrice, currency);
  const monthlyPriceStr = formatPrice(monthlyPriceVal, currency);
  const monthlyOriginalPriceStr = formatPrice(monthlyOriginalPriceVal, currency);

  const lifetimePriceVal = convertInrToCurrency(pricingConfig.lifetime.price, currency);
  const lifetimeOriginalPriceVal = convertInrToCurrency(pricingConfig.lifetime.originalPrice, currency);
  const lifetimePriceStr = formatPrice(lifetimePriceVal, currency);
  const lifetimeOriginalPriceStr = formatPrice(lifetimeOriginalPriceVal, currency);

  // Localized Savings
  const monthlySavingsStr = formatPrice(monthlyOriginalPriceVal - monthlyPriceVal, currency);
  const lifetimeSavingsStr = formatPrice(lifetimeOriginalPriceVal - lifetimePriceVal, currency);

  return (
    <div className="space-y-10 pb-16 relative">
      {/* Dynamic inline styles for premium glowing effects and animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes border-pulse {
          0%, 100% {
            border-color: rgba(139, 92, 246, 0.4);
            box-shadow: 0 0 25px rgba(139, 92, 246, 0.2);
          }
          50% {
            border-color: rgba(236, 72, 153, 0.7);
            box-shadow: 0 0 45px rgba(236, 72, 153, 0.45);
          }
        }
        .lifetime-card-glow {
          animation: border-pulse 3s infinite ease-in-out;
          border: 2px solid rgba(139, 92, 246, 0.4);
        }
        .lifetime-ribbon {
          position: absolute;
          top: 18px;
          right: -32px;
          background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
          color: white;
          text-transform: uppercase;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.15em;
          padding: 4px 34px;
          transform: rotate(45deg);
          box-shadow: 0 2px 4px rgba(0,0,0,0.15);
        }
        .animate-pulse-slow {
          animation: pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}} />

      {/* 1. Header */}
      <div className="border-b border-border pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Billing & Plans</h1>
        <p className="text-body-s text-muted-foreground mt-1">
          Upgrade to unlock unlimited usage, premium tools, and speed boosts.
        </p>
      </div>

      {/* 2. Current Status Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Info */}
        <div className="lg:col-span-2 rounded-3xl border border-border bg-card/25 p-6 md:p-8 flex flex-col justify-between space-y-4 hover:border-primary/10 transition-all duration-300">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-2xs font-bold uppercase tracking-wider text-primary bg-primary/5 px-2.5 py-1 rounded-md border border-primary/10">
                Membership Tier
              </span>
              {getStatusBadge()}
            </div>
            <h3 className="text-2xl font-bold text-foreground mt-2">{getPlanName()}</h3>
            <p className="text-body-s text-muted-foreground leading-relaxed max-w-xl">
              {isCancelledPending
                ? "Your subscription has been cancelled but you maintain access to all Pro tools until the current billing cycle expires."
                : isPro
                  ? `You have unrestricted, unlimited access to all 60+ tools. Plan type: ${planType === "lifetime" ? "Lifetime (One-Time)" : "Monthly Subscription"}. Thank you for supporting Toolzy!`
                  : "You are on the free tier. Upgrading gives you unlimited operations, faster processing speeds, priority support, and premium conversion utilities."}
            </p>
          </div>
          
          {/* Cancel button is ONLY shown for Active Monthly subscribers */}
          {isPro && planType === "monthly" && !isCancelledPending && (
            <div>
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="text-xs font-semibold text-rose-500 hover:text-rose-400 disabled:opacity-50 transition flex items-center gap-1.5 cursor-pointer bg-transparent border-0 p-0"
              >
                {cancelling ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                Cancel Subscription
              </button>
            </div>
          )}
        </div>

        {/* Visual Usage Meter */}
        <div className="rounded-3xl border border-border bg-card/30 p-6 md:p-8 flex flex-col justify-between hover:border-primary/10 transition-all duration-300 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 h-24 w-24 rounded-full bg-primary/2 blur-xl" />
          <div className="space-y-4 relative z-10 w-full">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Usage Today</span>
              <span className="text-xs font-semibold text-foreground">
                {isPro ? "Unlimited" : `${usageCount} / ${usageMax} actions`}
              </span>
            </div>

            {/* Progress Bar Container */}
            <div className="h-3 w-full bg-muted rounded-full overflow-hidden border border-border/50 relative">
              <div
                style={{ width: isPro ? "100%" : `${usagePercent}%` }}
                className={cn(
                  "h-full rounded-full transition-all duration-500 ease-out shadow-sm",
                  isPro
                    ? "bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500"
                    : usagePercent < 66
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                      : usagePercent < 100
                        ? "bg-gradient-to-r from-amber-500 to-orange-500"
                        : "bg-gradient-to-r from-rose-500 to-red-500"
                )}
              />
            </div>

            <div className="flex justify-between items-center text-[11px] text-muted-foreground">
              <span>{isPro ? "Premium Status Active" : `${usagePercent}% used`}</span>
              <span>Resets daily</span>
            </div>
          </div>

          <div className="border-t border-border/60 pt-4 mt-6 w-full flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Rate Limits</span>
            <span className="text-[11px] font-semibold text-foreground">
              {isPro ? "60 req/min" : "10 req/min"}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Pricing Grid Redesign */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center gap-2 border-b border-border/60 pb-3">
          <CreditCard className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Monetization Plans</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto pt-4">
          
          {/* Card 1 — Pro Monthly (Secondary Card) */}
          <div
            className={cn(
              "rounded-3xl border p-8 flex flex-col justify-between transition-all duration-300 relative overflow-hidden min-h-[520px] bg-card/10 border-border hover:border-primary/20 hover:bg-card/15 opacity-95 hover:opacity-100",
              isPro && planType === "monthly" && !isCancelledPending && "border-emerald-500/40 bg-emerald-950/5 shadow-[0_0_20px_rgba(16,185,129,0.05)]"
            )}
          >
            {isPro && planType === "monthly" && !isCancelledPending && (
              <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-xl border-l border-b border-emerald-600/30 shadow-sm z-10">
                Active Plan
              </div>
            )}

            <div className="space-y-6">
              <div>
                <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary border border-primary/20">
                  Limited Offer • {pricingConfig.monthly.discount}% OFF
                </span>
                <div className="mt-3 flex justify-between items-baseline">
                  <h3 className="font-extrabold text-xl text-foreground">Pro Monthly</h3>
                  <div className="text-right">
                    <span className="text-xs line-through text-muted-foreground font-medium block">
                      {monthlyOriginalPriceStr}
                    </span>
                    <div className="flex items-baseline justify-end gap-0.5">
                      <span className="text-2xl font-black text-foreground">
                        {monthlyPriceStr}
                      </span>
                      <span className="text-xs font-semibold text-muted-foreground">/mo</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs font-semibold text-emerald-500 mt-1">
                  Save {monthlySavingsStr} today
                </p>
                <p className="text-caption text-muted-foreground mt-3">
                  Best for regular users. Low barrier to access premium features.
                </p>
              </div>

              {timeRemaining && (
                <div className="flex items-center gap-2 text-xs font-semibold rounded-2xl px-3 py-2 bg-primary/5 border border-primary/10 text-foreground">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  <span>Offer ends: <span className="text-primary font-bold font-mono">{timeRemaining}</span></span>
                </div>
              )}

              {/* Benefits */}
              <ul className="space-y-3 text-xs text-muted-foreground border-t border-border/60 pt-5">
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                  <span className="text-foreground/90 font-medium">Unlimited tools & actions</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                  <span className="text-foreground/90 font-medium">Premium-only tools unlocked</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                  <span className="text-foreground/90 font-medium">Faster processing & priority</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                  <span className="text-foreground/90 font-medium">Higher usage limits</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                  <span className="text-foreground/90 font-medium">Future premium updates</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                  <span className="text-foreground/90 font-medium">Priority support</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 space-y-3">
              <button
                onClick={handleUpgradeMonthly}
                disabled={loading !== null || (isPro && planType === "monthly" && !isCancelledPending) || (isPro && planType === "lifetime")}
                className={cn(
                  "w-full flex justify-center items-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-semibold transition-all duration-200 cursor-pointer shadow-sm border border-border bg-card/60 hover:bg-muted/80 text-foreground",
                  (isPro && planType === "monthly" && !isCancelledPending)
                    ? "bg-emerald-950/20 text-emerald-400 border-emerald-500/25 cursor-not-allowed"
                    : (isPro && planType === "lifetime")
                      ? "opacity-40 cursor-not-allowed"
                      : "hover:scale-[1.01]"
                )}
              >
                {loading === "monthly" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    Connecting...
                  </>
                ) : (isPro && planType === "monthly" && !isCancelledPending) ? (
                  "Subscribed to Monthly"
                ) : (isPro && planType === "lifetime") ? (
                  "Lifetime Active"
                ) : isExpired ? (
                  "Renew Pro Monthly"
                ) : (
                  `Start for ${monthlyPriceStr}/month`
                )}
              </button>
              <div className="text-[10px] text-muted-foreground text-center">
                Powered by Razorpay Subscriptions · Monthly auto-renew
              </div>
            </div>
          </div>

          {/* Card 2 — Pro Lifetime (Primary Card, Optimized for Conversion) */}
          <div
            className={cn(
              "rounded-3xl border p-8 flex flex-col justify-between transition-all duration-300 relative overflow-hidden min-h-[550px] transform md:scale-105 shadow-[0_0_35px_rgba(139,92,246,0.18)] border-violet-500/50 bg-card/20 lifetime-card-glow",
              isPro && planType === "lifetime" && "border-emerald-500/40 bg-emerald-950/5 shadow-[0_0_30px_rgba(16,185,129,0.06)] lifetime-card-glow-none"
            )}
          >
            {/* Best Value Ribbon */}
            <div className="lifetime-ribbon">Best Value</div>

            {isPro && planType === "lifetime" && (
              <div className="absolute top-0 left-0 bg-emerald-500 text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-br-xl border-r border-b border-emerald-600/30 shadow-sm z-10">
                Active Member
              </div>
            )}

            <div className="space-y-6">
              <div>
                <span className="inline-flex rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 shadow-md">
                  {pricingConfig.offerLabel || "Recommended"} • {pricingConfig.lifetime.discount}% OFF
                </span>
                <div className="mt-3 flex justify-between items-baseline">
                  <h3 className="font-extrabold text-xl text-foreground flex items-center gap-1.5">
                    Pro Lifetime
                    <Sparkles className="h-4 w-4 text-violet-400 animate-pulse" />
                  </h3>
                  <div className="text-right">
                    <span className="text-xs line-through text-muted-foreground font-medium block">
                      {lifetimeOriginalPriceStr}
                    </span>
                    <div className="flex items-baseline justify-end gap-0.5">
                      <span className="text-3xl font-black text-foreground bg-gradient-to-r from-white via-violet-100 to-violet-300 bg-clip-text text-transparent">
                        {lifetimePriceStr}
                      </span>
                      <span className="text-xs font-semibold text-muted-foreground ml-1">one-time</span>
                    </div>
                  </div>
                </div>
                <p className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent font-extrabold text-xs mt-1 animate-pulse">
                  Save {lifetimeSavingsStr} today
                </p>
                <p className="text-caption text-muted-foreground mt-3 font-medium text-foreground/90">
                  Most Popular. Single secure order payment. Lifetime access, absolutely zero renewals.
                </p>
              </div>

              {/* Benefits */}
              <ul className="space-y-3 text-xs text-muted-foreground border-t border-violet-500/20 pt-5">
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-violet-400 flex-shrink-0" />
                  <span className="text-foreground/95 font-semibold">✓ Unlimited tools & actions</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-violet-400 flex-shrink-0" />
                  <span className="text-foreground/95 font-semibold">✓ Premium-only tools unlocked</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-violet-400 flex-shrink-0" />
                  <span className="text-foreground/95 font-semibold">✓ Faster processing & priority</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-violet-400 flex-shrink-0" />
                  <span className="text-foreground/95 font-semibold">✓ Higher usage limits</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-violet-400 flex-shrink-0" />
                  <span className="text-foreground/95 font-semibold">✓ Future premium updates (FREE)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-violet-400 flex-shrink-0" />
                  <span className="text-foreground/95 font-semibold">✓ Priority VIP support</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 space-y-3">
              <button
                onClick={handleUpgradeLifetime}
                disabled={loading !== null || (isPro && planType === "lifetime")}
                className={cn(
                  "w-full flex justify-center items-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-bold transition-all duration-200 cursor-pointer shadow-md text-white bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 hover:opacity-95 hover:scale-[1.02] shadow-[0_4px_25px_rgba(139,92,246,0.3)] animate-pulse-slow",
                  (isPro && planType === "lifetime")
                    ? "bg-emerald-950/20 text-emerald-400 border-emerald-500/25 cursor-not-allowed shadow-none animate-none"
                    : ""
                )}
              >
                {loading === "lifetime" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    Connecting Order...
                  </>
                ) : (isPro && planType === "lifetime") ? (
                  "Active Lifetime Member"
                ) : (
                  `Get Lifetime for ${lifetimePriceStr}`
                )}
              </button>
              <div className="text-[10px] text-muted-foreground text-center">
                Powered by Razorpay One-time Order · Secure checkout · No renewal
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 4. Billing Statements Table */}
      <div className="space-y-6 pt-8 border-t border-border/80">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Billing Statements</h2>
        </div>
        
        {invoices.length === 0 ? (
          <div className="rounded-3xl border border-border p-12 text-center bg-card/10 border-dashed">
            <p className="text-body-s text-muted-foreground">No invoices or billing statements found for this account.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-border bg-card/30 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-bold uppercase tracking-wider text-[10px] bg-muted/40">
                  <th className="p-4">Invoice ID</th>
                  <th className="p-4">Plan / Billing Cycle</th>
                  <th className="p-4 font-center">Payment Method</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-foreground/80">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-muted/30 transition-colors duration-150">
                    <td className="p-4 font-mono font-semibold text-foreground text-xs">{inv.id}</td>
                    <td className="p-4">
                      <div className="font-semibold text-foreground">{inv.planName}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {inv.planType === "lifetime" ? "Lifetime Activation" : `Monthly Cycle: ${inv.invoiceMonth}`}
                      </div>
                    </td>
                    <td className="p-4 capitalize">
                      <span className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground border border-border/50">
                        {inv.paymentMethod || "Razorpay"}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-xs text-muted-foreground">{inv.date}</td>
                    <td className="p-4 font-bold text-foreground">
                      {formatPrice(inv.amount, (inv.currency || "INR") as CurrencyCode)}
                    </td>
                    <td className="p-4">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border",
                          inv.status?.toLowerCase() === "paid" || inv.status?.toLowerCase() === "captured"
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : inv.status?.toLowerCase() === "pending"
                              ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                              : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                        )}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {inv.receiptUrl ? (
                        <a
                          href={inv.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover transition"
                        >
                          Invoice <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground/60 flex items-center justify-center gap-1" title="No direct receipt URL. Please check Razorpay email statement.">
                          <HelpCircle className="h-3.5 w-3.5" />
                          Email Sent
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
