"use client";

import React from "react";
import { usePro } from "@/hooks/use-pro";
import { useAuth } from "@/context/auth-context";
import { Lock, ShieldAlert, Sparkles, CheckCircle2, Crown, Zap, BarChart3, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { GlassCard } from "@/components/ui/glass-card";

export default function ProDashboardPage() {
  const { isPro, showUpgrade } = usePro();
  const { authInitializing } = useAuth();

  if (authInitializing) {
    return (
      <div className="space-y-8 max-w-5xl mx-auto py-10">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full rounded-3xl" />
      </div>
    );
  }

  if (!isPro) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center max-w-2xl mx-auto px-6 text-center space-y-8">
        {/* Warning Icon */}
        <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-error/10 text-error border border-error/20">
          <ShieldAlert className="h-10 w-10 animate-bounce" />
          <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-amber-500 flex items-center justify-center text-white border border-background">
            <Lock className="h-2.5 w-2.5" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-3">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Access Restricted</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This premium section requires an active <strong className="text-foreground">Pro membership</strong>. Upgrade to unlock all advanced AI tools and OCR workflows.
          </p>
        </div>

        {/* Upgrade Card */}
        <GlassCard className="w-full p-6 text-left border-border space-y-4">
          <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
            <Crown className="h-4.5 w-4.5 text-amber-500" />
            Premium Membership Benefits
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
            <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Full Access to All 4 AI APIs</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Unlimited Operations</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Faster Processing Priority</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Priority Support Channels</span>
            </div>
          </div>
        </GlassCard>

        {/* Action Button */}
        <Button variant="premium" size="lg" className="px-10 rounded-2xl shadow-lg transition-transform hover:scale-[1.01]" onClick={showUpgrade}>
          <Sparkles className="h-4 w-4" />
          Upgrade to Pro
        </Button>
      </div>
    );
  }

  // Pro User View
  return (
    <div className="space-y-8 max-w-6xl mx-auto py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-display-sm font-extrabold tracking-tight text-foreground">Pro Member Space</h1>
            <span className="inline-flex items-center gap-1 text-[10px] bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              <Crown className="h-3 w-3 shrink-0" />
              PRO
            </span>
          </div>
          <p className="text-body-s text-muted-foreground mt-1">
            Exclusive dashboard for active Pro members. Thank you for your support!
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div className="rounded-xl bg-primary/10 p-3 text-primary">
              <Zap className="h-6 w-6" />
            </div>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-500 font-bold px-2 py-0.5 rounded-full">ACTIVE</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Priority Pipeline</p>
            <h4 className="text-2xl font-black text-foreground mt-1">Lightning Speed</h4>
            <p className="text-[11px] text-muted-foreground mt-1">Your requests bypass the standard queues for instant completion.</p>
          </div>
        </GlassCard>

        <GlassCard className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div className="rounded-xl bg-primary/10 p-3 text-primary">
              <BarChart3 className="h-6 w-6" />
            </div>
            <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full">UNLIMITED</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">AI API Requests</p>
            <h4 className="text-2xl font-black text-foreground mt-1">No Limits</h4>
            <p className="text-[11px] text-muted-foreground mt-1">Process as many images, subtitles, or OCR documents as you need.</p>
          </div>
        </GlassCard>

        <GlassCard className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div className="rounded-xl bg-primary/10 p-3 text-primary">
              <Star className="h-6 w-6" />
            </div>
            <span className="text-[10px] bg-amber-500/10 text-amber-500 font-bold px-2 py-0.5 rounded-full">VIP</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Support Tier</p>
            <h4 className="text-2xl font-black text-foreground mt-1">Direct Developer Link</h4>
            <p className="text-[11px] text-muted-foreground mt-1">Submit tickets directly to core developers with 1-hour SLA priority.</p>
          </div>
        </GlassCard>
      </div>

      {/* Main Content Area */}
      <div className="border border-border rounded-3xl p-8 bg-card/40 space-y-4 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-[image:var(--gradient-primary)]" />
        <h2 className="text-lg font-bold text-foreground">Welcome to the VIP Space</h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          You now have full access to our state-of-the-art developer suite. Navigate to any tools category to start processing files using Cloudinary, Clipdrop, Groq Whisper, and OCR.Space APIs.
        </p>
      </div>
    </div>
  );
}
