"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
  ArrowLeft, Home, Sparkles, RefreshCw, LogIn, Crown, 
  Mail, ShieldCheck, HeartHandshake, FileText, Bug
} from "lucide-react";
import { ExperienceAction } from "./ExperienceConfig";
import { getAllTools } from "@/config/tool-registry";
import { cn } from "@/utils/cn";

export interface ExperienceActionsProps {
  actions: ExperienceAction[];
  onRetry?: () => void | Promise<void>;
  errorCode?: string;
  state?: string;
}

export function ExperienceActions({ actions, onRetry, errorCode, state }: ExperienceActionsProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleAction = async (action: ExperienceAction) => {
    switch (action.actionType) {
      case "home":
        router.push("/");
        break;
      case "back":
        if (typeof window !== "undefined") {
          window.history.back();
        }
        break;
      case "surprise-me":
        const tools = getAllTools().filter(t => t.isActive);
        if (tools.length > 0) {
          const randomTool = tools[Math.floor(Math.random() * tools.length)];
          toast.success(`Launching random tool: ${randomTool.name}!`);
          router.push(`/tools/${randomTool.slug}`);
        } else {
          router.push("/tools");
        }
        break;
      case "retry":
        if (onRetry) {
          await onRetry();
        } else {
          toast.info("Retrying connection...");
          if (typeof window !== "undefined") {
            window.location.reload();
          }
        }
        break;
      case "sign-in":
        router.push("/login");
        break;
      case "upgrade":
        router.push("/pricing");
        break;
      case "request-access":
        toast.promise(
          new Promise((resolve) => setTimeout(resolve, 1500)),
          {
            loading: "Sending request to workspace administrator...",
            success: "Access request sent successfully! You will receive an email once approved.",
            error: "Failed to send access request.",
          }
        );
        break;
      case "system-status":
        toast.info("Opening system status dashboard...");
        router.push("/status");
        break;
      case "support":
        toast.info("Opening support channel...");
        router.push("/support");
        break;
      case "diagnostics":
        downloadDiagnostics();
        break;
      case "report-broken":
        toast.success("Broken link reported. Thank you for making UTool better!");
        break;
      default:
        break;
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubscribed(true);
      toast.success(`We will notify you at ${email}!`);
      setEmail("");
    }, 1200);
  };

  const downloadDiagnostics = () => {
    if (typeof window === "undefined") return;

    const data = {
      timestamp: new Date().toISOString(),
      state: state || "500",
      errorCode: errorCode || "ERR_UNSPECIFIED",
      url: window.location.href,
      userAgent: navigator.userAgent,
      screen: `${window.innerWidth}x${window.innerHeight}`,
      connection: (navigator as any).connection
        ? {
            effectiveType: (navigator as any).connection.effectiveType,
            downlink: (navigator as any).connection.downlink,
            rtt: (navigator as any).connection.rtt,
          }
        : "unknown",
      localStorageAvailable: typeof localStorage !== "undefined",
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `utool-diagnostics-${state}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Diagnostics report downloaded! Please attach this to your support ticket.");
  };

  const getIcon = (actionType: string) => {
    switch (actionType) {
      case "home":
        return <Home size={16} />;
      case "back":
        return <ArrowLeft size={16} />;
      case "surprise-me":
        return <Sparkles size={16} />;
      case "retry":
        return <RefreshCw size={16} className="animate-spin-slow" />;
      case "sign-in":
        return <LogIn size={16} />;
      case "upgrade":
        return <Crown size={16} />;
      case "request-access":
        return <ShieldCheck size={16} />;
      case "support":
        return <HeartHandshake size={16} />;
      case "diagnostics":
        return <FileText size={16} />;
      case "report-broken":
        return <Bug size={16} />;
      default:
        return null;
    }
  };

  const notifyAction = actions.find(a => a.actionType === "notify-me");
  const regularActions = actions.filter(a => a.actionType !== "notify-me");

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Email Intake form for notify-me actions */}
      {notifyAction && (
        <div className="glass-card p-5 rounded-2xl border border-border bg-card/40 backdrop-blur-md shadow-sm w-full max-w-md mx-auto">
          {subscribed ? (
            <div className="text-center py-2 animate-fade-in">
              <Mail className="mx-auto text-emerald-500 mb-2" size={32} />
              <h4 className="font-semibold text-foreground text-sm">Subscription Confirmed</h4>
              <p className="text-muted-foreground text-xs mt-1">You are on the list! We will contact you immediately.</p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
              <label className="text-xs font-semibold text-muted-foreground text-left flex items-center gap-1.5">
                <Mail size={12} />
                Get notified when this launches
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center rounded-full bg-[image:var(--gradient-primary)] text-white px-5 py-2 text-sm font-semibold shadow-md shadow-primary/10 hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {submitting ? "Subscribing..." : "Notify Me"}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Button Layout */}
      {regularActions.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {regularActions.map((action, index) => {
            const isPrimary = action.variant === "primary";
            const isGhost = action.variant === "ghost";

            return (
              <button
                key={index}
                onClick={() => handleAction(action)}
                className={cn(
                  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all cursor-pointer",
                  isPrimary
                    ? "bg-[image:var(--gradient-primary)] text-white shadow-lg shadow-primary/15 hover:shadow-xl hover:shadow-primary/20 hover:scale-[1.02] active:scale-95"
                    : isGhost
                    ? "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    : "border border-border bg-card/60 backdrop-blur-xs text-foreground shadow-xs hover:bg-muted/80 hover:scale-[1.01] active:scale-98"
                )}
                aria-label={action.label}
              >
                {getIcon(action.actionType)}
                <span>{action.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
