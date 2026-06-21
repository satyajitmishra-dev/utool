"use client";

import React, { useState, useEffect } from "react";
import { CreditCard, Check, ShieldCheck, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { detectCurrency, formatPrice, CurrencyCode } from "@/utils/currency";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";
import { db } from "@/config/firebase";
import { doc, onSnapshot } from "firebase/firestore";

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
      toast.info("Please contact sales at sales@utool.com for Enterprise plan inquiry.");
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
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to initiate subscription");
      }

      const { subscriptionId: subId, keyId } = await response.json();

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

  const getProPrice = () => {
    const amount = currency === "INR" ? 299 : currency === "EUR" ? 8 : currency === "GBP" ? 7 : 9;
    const formatted = formatPrice(amount, currency);
    return currency === "INR" ? formatted : `${formatted} (INR 299 approx)`;
  };

  const getEnterprisePrice = () => {
    const amount = currency === "INR" ? 1499 : currency === "EUR" ? 45 : currency === "GBP" ? 39 : 49;
    return formatPrice(amount, currency);
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

  if (authLoading || dbLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        <p className="text-sm text-slate-400">Loading your billing details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 1. Header */}
      <div className="border-b border-slate-900 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-white">Billing & Plans</h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your subscription plans, credits, and review billing statements.
        </p>
      </div>

      {/* 2. Current Subscription Status */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/10 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
              Current Plan
            </span>
            {getStatusBadge()}
          </div>
          <h3 className="text-2xl font-bold text-white">{getPlanName()}</h3>
          <p className="text-sm text-slate-400 max-w-xl">
            {isCancelledPending
              ? "Your subscription is cancelled but you maintain access to all premium features until your billing cycle ends. You can renew by upgrading again when your access expires."
              : isPro
                ? "You have unlimited daily tool actions and unrestricted access to all 60+ tools. Thank you for supporting utool!"
                : "You are currently on the free tier. Upgrading lifts daily limits and unlocks premium utilities."}
          </p>
          {isPro && !isCancelledPending && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="mt-2 text-xs font-semibold text-rose-400 hover:text-rose-300 disabled:opacity-50 transition flex items-center gap-1"
            >
              {cancelling ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
              Cancel Subscription
            </button>
          )}
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 min-w-[200px] text-center">
          <p className="text-xs text-slate-500 font-semibold uppercase">Daily Free Actions</p>
          <p className="text-3xl font-extrabold text-white mt-1">
            {isPro ? "Unlimited" : "3"}
          </p>
          <span className="text-2xs text-slate-500 block mt-1">Resets every 24 hours</span>
        </div>
      </div>

      {/* 3. Upgrade Tiers Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-indigo-400" />
          Subscription Plans
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pro Card */}
          <div
            className={`rounded-2xl border p-6 flex flex-col justify-between transition ${isPro && !isCancelledPending
                ? "border-emerald-500/20 bg-emerald-950/5"
                : "border-indigo-500/30 bg-slate-900/20 hover:border-indigo-500/50"
              }`}
          >
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-xl text-white">Pro Utility</h3>
                    {isPro && !isCancelledPending && (
                      <span className="inline-flex rounded-full bg-emerald-500/10 px-2 py-0.5 text-2xs font-semibold text-emerald-400 border border-emerald-500/15">
                        Current Plan
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400 mt-1">
                    For developers, creators, and power users.
                  </p>
                </div>
                <span className="text-2xl font-black text-white">
                  {getProPrice()}
                  <span className="text-xs font-medium text-slate-500">/mo</span>
                </span>
              </div>
              <ul className="mt-6 space-y-2.5 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="h-4.5 w-4.5 text-indigo-400" /> Unlimited daily tool actions
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4.5 w-4.5 text-indigo-400" /> Access to all 60+ tools (including premium ones)
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4.5 w-4.5 text-indigo-400" /> Rate limits: 60 requests / min
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleUpgrade("pro")}
              disabled={loading !== null || (isPro && !isCancelledPending)}
              className={`mt-6 w-full flex justify-center items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition ${isPro && !isCancelledPending
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-500 to-violet-600 shadow shadow-indigo-500/10 hover:from-indigo-600 hover:to-violet-700"
                }`}
            >
              {loading === "pro" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Connecting Razorpay...
                </>
              ) : isPro && !isCancelledPending ? (
                "Subscribed to Pro"
              ) : isExpired ? (
                "Renew Subscription"
              ) : (
                "Upgrade to Pro"
              )}
            </button>
          </div>

          {/* Enterprise Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/10 p-6 flex flex-col justify-between hover:border-slate-700 transition">
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-xl text-white">Enterprise Plan</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    For high-throughput requirements and scaling teams.
                  </p>
                </div>
                <span className="text-2xl font-black text-white">
                  {getEnterprisePrice()}
                  <span className="text-xs font-medium text-slate-500">/mo</span>
                </span>
              </div>
              <ul className="mt-6 space-y-2.5 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="h-4.5 w-4.5 text-indigo-400" /> Dedicated rate limits: 300 requests / min
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4.5 w-4.5 text-indigo-400" /> Dedicated custom configurations
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4.5 w-4.5 text-indigo-400" /> Enterprise-level SLA support
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleUpgrade("enterprise")}
              disabled={loading !== null}
              className="mt-6 w-full flex justify-center items-center gap-2 rounded-xl border border-slate-700 hover:border-white px-4 py-2.5 text-sm font-semibold text-slate-300 hover:text-white transition"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </div>

      {/* 4. Invoices Table */}
      <div className="space-y-4 pt-6 border-t border-slate-900">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-indigo-400" />
          Billing Statements
        </h2>
        {invoices.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 p-8 text-center bg-slate-900/5">
            <p className="text-sm text-slate-500">No invoices or billing transactions found for this account.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/10">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-950/20">
                  <th className="p-4">Invoice ID</th>
                  <th className="p-4">Plan Name</th>
                  <th className="p-4">Billing Month</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Payment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 text-slate-300">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-900/10">
                    <td className="p-4 font-mono font-medium text-white">{inv.id}</td>
                    <td className="p-4">{inv.planName || "Pro Utility"}</td>
                    <td className="p-4">{inv.invoiceMonth || "—"}</td>
                    <td className="p-4">{inv.date}</td>
                    <td className="p-4">{formatPrice(inv.amount, (inv.currency || "INR") as CurrencyCode)}</td>
                    <td className="p-4">
                      <span className="inline-flex rounded-full bg-emerald-500/10 px-2 py-0.5 text-2xs font-semibold text-emerald-400 border border-emerald-500/15">
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
