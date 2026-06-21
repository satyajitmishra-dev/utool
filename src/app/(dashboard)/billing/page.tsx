"use client";

import React, { useState, useEffect } from "react";
import { CreditCard, Check, ShieldCheck, Loader2, Sparkles, AlertCircle, Clock } from "lucide-react";
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

  const handleUpgrade = async (planId: string) => {
    if (planId !== "pro") {
      toast.info("Please contact sales at sales@utool.in for Enterprise plan inquiry.");
      return;
    }

    setLoading("pro");
    const toastId = toast.loading("Redirecting to secure checkout...");

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Failed to load payment gateway. Please try again.", { id: toastId });
        setLoading(null);
        return;
      }

      const response = await fetch("/api/razorpay/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price: pricingConfig.pro.price }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to initiate subscription");
      }

      const { subscriptionId: subId, keyId } = await response.json();

      // If it's a local mock subscription, bypass the Razorpay modal checkout and verify directly
      if (subId.startsWith("sub_mock_")) {
        toast.loading("Simulating payment verification locally...", { id: toastId });
        try {
          const verifyRes = await fetch("/api/razorpay/verify-subscription", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              subscriptionId: subId,
              paymentId: "pay_mock_" + Math.random().toString(36).substring(2, 10),
              signature: "mock_signature_for_development",
            }),
          });

          if (verifyRes.ok) {
            toast.success("Local mock subscription activated successfully!", { id: toastId });
            // Refresh invoice history immediately
            fetchInvoices();
            // Force reload to sync premium UI
            window.location.reload();
          } else {
            toast.error("Mock verification failed.", { id: toastId });
          }
        } catch (verifyError) {
          console.error("Local mock verification error:", verifyError);
          toast.error("Mock verification failed.", { id: toastId });
        } finally {
          setLoading(null);
        }
        return;
      }

      const options = {
        key: keyId,
        subscription_id: subId,
        name: "utool Pro",
        description: "Monthly Pro Subscription",
        handler: async function (checkoutResponse: any) {
          toast.loading("Verifying payment...", { id: toastId });
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
              toast.success("Subscription activated successfully.", { id: toastId });
              // Refresh invoice history immediately
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
      console.error("Checkout initialization failed:", error);
      toast.error(error.message || "Checkout failed to initialize.", { id: toastId });
      setLoading(null);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel your Pro subscription?")) {
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
        // Refresh invoices in case status changed
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
    if (isPro) return "Pro Utility";
    return "Free Starter";
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
        Free
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
  const isProOrEnterprise = isPro || subscriptionTier === "pro" || subscriptionTier === "enterprise";

  return (
    <div className="space-y-10 pb-16">
      {/* 1. Header */}
      <div className="border-b border-border pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Billing & Plans</h1>
        <p className="text-body-s text-muted-foreground mt-1">
          Manage your subscription plans, credits, and review billing statements.
        </p>
      </div>

      {/* 2. Current Subscription Status & Usage Meter */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Info */}
        <div className="lg:col-span-2 rounded-3xl border border-border bg-card/25 p-6 md:p-8 flex flex-col justify-between space-y-4 hover:border-primary/10 transition-all duration-300">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-2xs font-bold uppercase tracking-wider text-primary bg-primary/5 px-2.5 py-1 rounded-md border border-primary/10">
                Current Plan
              </span>
              {getStatusBadge()}
            </div>
            <h3 className="text-2xl font-bold text-foreground mt-2">{getPlanName()}</h3>
            <p className="text-body-s text-muted-foreground leading-relaxed max-w-xl">
              {isCancelledPending
                ? "Your subscription is cancelled but you maintain access to all premium features until your billing cycle ends. You can renew by upgrading again when your access expires."
                : isProOrEnterprise
                  ? "You have unlimited daily tool actions and unrestricted access to all 60+ tools. Thank you for supporting Toolzy!"
                  : "You are currently on the free tier. Upgrading lifts daily limits and unlocks premium utilities."}
            </p>
          </div>
          
          {isProOrEnterprise && !isCancelledPending && (
            <div>
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="text-xs font-semibold text-rose-500 hover:text-rose-400 disabled:opacity-50 transition flex items-center gap-1.5 cursor-pointer"
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
                {isProOrEnterprise ? "Unlimited" : `${usageCount} / ${usageMax} actions`}
              </span>
            </div>

            {/* Progress Bar Container */}
            <div className="h-3 w-full bg-muted rounded-full overflow-hidden border border-border/50 relative">
              <div
                style={{ width: isProOrEnterprise ? "100%" : `${usagePercent}%` }}
                className={cn(
                  "h-full rounded-full transition-all duration-500 ease-out shadow-sm",
                  isProOrEnterprise
                    ? "bg-gradient-to-r from-primary via-secondary to-accent animate-pulse-glow"
                    : usagePercent < 66
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                      : usagePercent < 100
                        ? "bg-gradient-to-r from-amber-500 to-orange-500"
                        : "bg-gradient-to-r from-rose-500 to-red-500"
                )}
              />
            </div>

            <div className="flex justify-between items-center text-[11px] text-muted-foreground">
              <span>{isProOrEnterprise ? "Premium Active" : `${usagePercent}% used`}</span>
              <span>Resets daily</span>
            </div>
          </div>

          <div className="border-t border-border/60 pt-4 mt-6 w-full flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Rate Limits</span>
            <span className="text-[11px] font-semibold text-foreground">
              {isProOrEnterprise ? "60 req/min" : "10 req/min"}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Upgrade Tiers Grid */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center gap-2 border-b border-border/60 pb-3">
          <CreditCard className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Subscription Plans</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pro Card */}
          <div
            className={cn(
              "rounded-3xl border p-8 flex flex-col justify-between transition-all duration-300 relative overflow-hidden",
              isProOrEnterprise && !isCancelledPending
                ? "border-emerald-500/30 bg-emerald-950/5 shadow-[0_0_30px_rgba(16,185,129,0.03)]"
                : "border-border bg-card/20 hover:border-primary/30 hover:shadow-[0_0_30px_rgba(99,102,241,0.08)] hover:-translate-y-0.5"
            )}
          >
            {isProOrEnterprise && !isCancelledPending && (
              <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-xl border-l border-b border-emerald-600/30 shadow-sm z-10">
                Active Plan
              </div>
            )}
            
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-xl text-foreground">Pro Utility</h3>
                    {isProOrEnterprise && !isCancelledPending && (
                      <span className="inline-flex rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-500 border border-emerald-500/20">
                        Current
                      </span>
                    )}
                    {pricingConfig.pro.discountEnabled && (
                      <span className="inline-flex rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 shadow-sm">
                        Launch Offer
                      </span>
                    )}
                  </div>
                  <p className="text-body-s text-muted-foreground">
                    For developers, creators, and power users.
                  </p>
                </div>
                <div className="text-right space-y-1">
                  {pricingConfig.pro.discountEnabled && (
                    <div className="flex items-center justify-end gap-1.5">
                      <span className="text-xs line-through text-muted-foreground font-medium">
                        {formatPrice(convertInrToCurrency(pricingConfig.pro.originalPrice, currency), currency)}
                      </span>
                      <span className="inline-flex rounded bg-rose-500/10 px-1 py-0.5 text-[9px] font-extrabold uppercase text-rose-500 tracking-wider border border-rose-500/25">
                        {pricingConfig.pro.discountPercentage}% OFF
                      </span>
                    </div>
                  )}
                  <div className="flex items-baseline justify-end gap-0.5">
                    <span className="text-2xl font-extrabold text-foreground">
                      {formatPrice(convertInrToCurrency(pricingConfig.pro.price, currency), currency)}
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground">/mo</span>
                  </div>
                </div>
              </div>

              {pricingConfig.pro.discountEnabled && timeRemaining && (
                <div className="flex items-center gap-2 text-xs font-semibold rounded-2xl px-3.5 py-2.5 bg-primary/5 border border-primary/20 text-foreground transition-all">
                  <Clock className="h-3.5 w-3.5 text-primary animate-pulse" />
                  <span>Offer ends in: <span className="text-primary font-bold font-mono">{timeRemaining}</span></span>
                </div>
              )}

              <ul className="space-y-3.5 text-sm text-muted-foreground border-t border-border/60 pt-5">
                <li className="flex items-center gap-2.5">
                  <div className="rounded-full bg-primary/10 p-0.5">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-foreground/90 font-medium">Unlimited daily actions</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="rounded-full bg-primary/10 p-0.5">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-foreground/90 font-medium">All 60+ tools included</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="rounded-full bg-primary/10 p-0.5">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-foreground/90 font-medium">60 requests / minute rate limit</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleUpgrade("pro")}
              disabled={loading !== null || (isProOrEnterprise && !isCancelledPending)}
              className={cn(
                "mt-8 w-full flex justify-center items-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-semibold transition-all duration-200 cursor-pointer shadow-sm",
                isProOrEnterprise && !isCancelledPending
                  ? "bg-muted text-muted-foreground border border-border cursor-not-allowed"
                  : "bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:from-primary-hover hover:to-secondary hover:shadow-[0_4px_20px_rgba(99,102,241,0.25)] hover:scale-[1.01]"
              )}
            >
              {loading === "pro" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Connecting Razorpay...
                </>
              ) : isProOrEnterprise && !isCancelledPending ? (
                "Subscribed to Pro"
              ) : isExpired ? (
                "Renew Subscription"
              ) : (
                "Upgrade to Pro"
              )}
            </button>
          </div>

          {/* Enterprise Card */}
          <div className="rounded-3xl border border-border bg-card/20 p-8 flex flex-col justify-between hover:border-primary/30 hover:shadow-[0_0_30px_rgba(99,102,241,0.08)] hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden">
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-xl text-foreground">Enterprise Plan</h3>
                    {pricingConfig.enterprise.discountEnabled && (
                      <span className="inline-flex rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 shadow-sm">
                        Early Supporter
                      </span>
                    )}
                  </div>
                  <p className="text-body-s text-muted-foreground">
                    For high-throughput scaling teams.
                  </p>
                </div>
                <div className="text-right space-y-1">
                  {pricingConfig.enterprise.discountEnabled && (
                    <div className="flex items-center justify-end gap-1.5">
                      <span className="text-xs line-through text-muted-foreground font-medium">
                        {formatPrice(convertInrToCurrency(pricingConfig.enterprise.originalPrice, currency), currency)}
                      </span>
                      <span className="inline-flex rounded bg-rose-500/10 px-1 py-0.5 text-[9px] font-extrabold uppercase text-rose-500 tracking-wider border border-rose-500/25">
                        {pricingConfig.enterprise.discountPercentage}% OFF
                      </span>
                    </div>
                  )}
                  <div className="flex items-baseline justify-end gap-0.5">
                    <span className="text-2xl font-extrabold text-foreground">
                      {formatPrice(convertInrToCurrency(pricingConfig.enterprise.price, currency), currency)}
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground">/mo</span>
                  </div>
                </div>
              </div>

              {pricingConfig.enterprise.discountEnabled && timeRemaining && (
                <div className="flex items-center gap-2 text-xs font-semibold rounded-2xl px-3.5 py-2.5 bg-muted/40 border border-border text-muted-foreground transition-all">
                  <Clock className="h-3.5 w-3.5 text-primary animate-pulse" />
                  <span>Offer ends in: <span className="text-primary font-bold font-mono">{timeRemaining}</span></span>
                </div>
              )}

              <ul className="space-y-3.5 text-sm text-muted-foreground border-t border-border/60 pt-5">
                <li className="flex items-center gap-2.5">
                  <div className="rounded-full bg-primary/10 p-0.5">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-foreground/90 font-medium">300 requests / minute rate limit</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="rounded-full bg-primary/10 p-0.5">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-foreground/90 font-medium">Dedicated configurations</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="rounded-full bg-primary/10 p-0.5">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-foreground/90 font-medium">Enterprise SLA & Email support</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleUpgrade("enterprise")}
              disabled={loading !== null}
              className="mt-8 w-full flex justify-center items-center gap-2 rounded-2xl border border-border bg-card/50 hover:bg-muted/80 hover:text-foreground px-4 py-3.5 text-sm font-semibold text-muted-foreground transition-all duration-200 cursor-pointer"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </div>

      {/* 4. Invoices Table */}
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
                  <th className="p-4">Plan Name</th>
                  <th className="p-4">Billing Month</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Payment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-foreground/80">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-muted/30 transition-colors duration-150">
                    <td className="p-4 font-mono font-semibold text-foreground text-xs">{inv.id}</td>
                    <td className="p-4 font-medium">{inv.planName || "Pro Utility"}</td>
                    <td className="p-4 text-muted-foreground">{inv.invoiceMonth || "—"}</td>
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
