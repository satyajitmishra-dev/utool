"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Construction, CheckCircle2, XCircle, Bell, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Feature {
  name: string;
  completed: boolean;
}

interface ComingSoonWorkspaceProps {
  toolId: string;
  toolName: string;
  completion: number;
  expectedFeatures?: Feature[];
}

export function ComingSoonWorkspace({
  toolId,
  toolName,
  completion = 0,
  expectedFeatures,
}: ComingSoonWorkspaceProps) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  // Fallback to default expected features if none are provided
  const features = expectedFeatures && expectedFeatures.length > 0
    ? expectedFeatures
    : [
        { name: "Core Frontend Structure", completed: completion >= 10 },
        { name: "User Input Interface", completed: completion >= 40 },
        { name: "WASM Processing Pipeline", completed: completion >= 70 },
        { name: "Output Generation & Download", completed: completion >= 90 },
      ];

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/tools/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, toolId }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubscribed(true);
        toast.success(data.message || "Subscribed successfully!");
      } else {
        toast.error(data.error || "Subscription failed.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 max-w-2xl mx-auto space-y-8">
      {/* Icon & Heading */}
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="h-16 w-16 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-2xl flex items-center justify-center animate-pulse">
          <Construction className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-black tracking-tight text-foreground md:text-3xl">
          {toolName} is Under Development
        </h2>
        <p className="text-sm text-muted-foreground max-w-md">
          We process all data 100% locally in your browser. We are currently implementing and refining this tool's client-side compilation engine.
        </p>
      </div>

      {/* Progress Section */}
      <div className="w-full bg-card/60 border border-border p-6 rounded-2xl space-y-4 shadow-xs">
        <div className="flex justify-between items-center text-xs font-bold text-foreground">
          <span>Development Roadmap Progress</span>
          <span className="text-primary">{completion}% Complete</span>
        </div>
        <div className="w-full bg-muted h-3 rounded-full overflow-hidden border border-border/10">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completion}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
          />
        </div>
      </div>

      {/* Expected Features List */}
      <div className="w-full bg-card/40 border border-border p-6 rounded-2xl space-y-4">
        <h4 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
          Expected Features Checklist
        </h4>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {features.map((feature, idx) => (
            <li
              key={idx}
              className="flex items-center gap-3 text-xs text-foreground font-semibold"
            >
              {feature.completed ? (
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
              ) : (
                <XCircle className="h-4.5 w-4.5 text-rose-500 shrink-0" />
              )}
              <span className={feature.completed ? "line-through text-muted-foreground/70" : ""}>
                {feature.name}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Subscription Box */}
      <div className="w-full bg-purple-500/[0.03] border border-purple-500/10 p-6 rounded-2xl flex flex-col items-center text-center space-y-4">
        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
          <Bell className="h-4 w-4" /> Get Notified
        </div>
        <p className="text-xs text-muted-foreground max-w-sm">
          Be the first to know when this tool is live. We will never spam you.
        </p>

        {subscribed ? (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold rounded-xl px-6 py-3 w-full"
          >
            ✓ Thank you! We will notify you once this tool is live.
          </motion.div>
        ) : (
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5 w-full max-w-md">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
              className="flex-1 bg-background border border-border rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary transition-all disabled:opacity-50"
              required
            />
            <Button
              type="submit"
              disabled={submitting}
              className="rounded-xl px-5 h-10 text-xs font-bold shrink-0 flex items-center justify-center gap-1.5"
            >
              {submitting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                "Notify Me"
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
