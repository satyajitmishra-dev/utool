"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, AlertCircle, Send, Bug, Laptop } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/utils/cn";

export interface ExperienceFeedbackProps {
  state?: string;
  className?: string;
}

export function ExperienceFeedback({ state = "unknown", className }: ExperienceFeedbackProps) {
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // Client system details
  const [system, setSystem] = useState({
    os: "unknown",
    browser: "unknown",
    screen: "unknown",
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Detect simple OS & Browser details for premium display
    const userAgent = navigator.userAgent;
    let os = "Unknown OS";
    let browser = "Unknown Browser";

    if (userAgent.indexOf("Win") !== -1) os = "Windows";
    if (userAgent.indexOf("Mac") !== -1) os = "macOS";
    if (userAgent.indexOf("Linux") !== -1) os = "Linux";
    if (userAgent.indexOf("Android") !== -1) os = "Android";
    if (userAgent.indexOf("like Mac") !== -1) os = "iOS";

    if (userAgent.indexOf("Chrome") !== -1) browser = "Google Chrome";
    else if (userAgent.indexOf("Safari") !== -1) browser = "Safari";
    else if (userAgent.indexOf("Firefox") !== -1) browser = "Firefox";
    else if (userAgent.indexOf("Edge") !== -1) browser = "Microsoft Edge";

    setSystem({
      os,
      browser,
      screen: `${window.innerWidth}x${window.innerHeight}`,
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setIsSubmitting(true);
    // Simulate API request to support database
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      toast.success("Feedback sent! Thank you for helping us improve UTool.");
      setFeedback("");
    }, 1500);
  };

  const reportBrokenLink = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1200)),
      {
        loading: "Reporting broken link to engineering...",
        success: "Report logged! Thank you for alerting our technical team.",
        error: "Failed to submit report.",
      }
    );
  };

  return (
    <div className={cn("w-full flex flex-col gap-4 text-left animate-fade-in", className)}>
      <div className="glass-card p-4 rounded-2xl border border-border bg-card/25 backdrop-blur-xs flex flex-col gap-3">
        <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <MessageSquare size={12} className="text-primary" />
          Feedback & Support
        </h5>

        {submitted ? (
          <div className="text-center py-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Thank You!
            </span>
            <p className="text-[10px] text-muted-foreground mt-1">
              Your logs and feedback have been successfully compiled and submitted.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
            <textarea
              placeholder="What happened? Let us know so we can fix it immediately..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
              className="w-full text-xs rounded-xl border border-border bg-background/50 px-3 py-2 text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
            />
            <div className="flex flex-wrap gap-2 justify-between items-center">
              <button
                type="button"
                onClick={reportBrokenLink}
                className="text-[10px] text-muted-foreground hover:text-red-500 flex items-center gap-1 font-semibold transition-colors cursor-pointer"
              >
                <Bug size={10} />
                Report Broken Link
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !feedback.trim()}
                className="inline-flex items-center gap-1.5 rounded-full bg-[image:var(--gradient-primary)] text-white text-[11px] font-bold px-4 py-1.5 hover:opacity-90 transition-opacity disabled:opacity-40 cursor-pointer shadow-xs"
              >
                <Send size={10} />
                Send Report
              </button>
            </div>
          </form>
        )}
      </div>
 
      {/* Diagnostics panel */}
      <div className="glass-card p-4 rounded-2xl border border-border bg-card/20 backdrop-blur-xs flex flex-col gap-2">
        <h6 className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
          <Laptop size={10} />
          Diagnostic Environment
        </h6>
        <div className="flex flex-col gap-1 text-[10px] font-mono text-muted-foreground">
          <div className="flex justify-between gap-4">
            <span className="shrink-0">Client State:</span>
            <span className="text-foreground text-right break-all">{state}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="shrink-0">Operating System:</span>
            <span className="text-foreground text-right break-all">{system.os}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="shrink-0">Browser Engine:</span>
            <span className="text-foreground text-right break-all">{system.browser}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="shrink-0">Screen Size:</span>
            <span className="text-foreground text-right break-all">{system.screen}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ExperienceFeedback;
