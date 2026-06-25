"use client";

import React from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useUsageStats } from "@/hooks/useUsageStats";
import { Wrench, Sparkles, AlertCircle } from "lucide-react";

export function LiveUsageCard() {
  const { stats, loading, error } = useUsageStats();

  if (loading) {
    return (
      <GlassCard hover={false} className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-10 w-10 rounded-xl" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </GlassCard>
    );
  }

  if (error) {
    return (
      <GlassCard hover={false} className="p-6 border-error/30 bg-error/5 flex items-start gap-4">
        <AlertCircle className="h-6 w-6 text-error flex-shrink-0" />
        <div>
          <h4 className="font-semibold text-foreground text-sm">Failed to Load Stats</h4>
          <p className="text-body-s text-muted-foreground mt-1">There was an error loading your usage limits.</p>
        </div>
      </GlassCard>
    );
  }

  const { dailyCount, remainingLimits, totalLifetimeUsage } = stats;

  return (
    <GlassCard hover={false} className="p-6 relative overflow-hidden flex flex-col justify-between h-full min-h-[180px]">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-primary/10 blur-2xl pointer-events-none" />

      <div className="flex justify-between items-start">
        <div className="rounded-xl bg-primary/10 p-3 text-primary">
          <Wrench className="h-6 w-6" />
        </div>
        <Badge variant={remainingLimits === 0 ? "error" : "success"}>
          {remainingLimits === Infinity ? "Unlimited" : `${remainingLimits} remaining`}
        </Badge>
      </div>

      <div className="mt-4">
        <p className="text-body-s font-medium text-muted-foreground">Daily Operations Used</p>
        <div className="flex items-baseline gap-1 mt-1">
          <h4 className="text-3xl font-extrabold text-foreground">{dailyCount}</h4>
          {remainingLimits !== Infinity && (
            <span className="text-body-s text-muted-foreground">/ 3 limit</span>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border flex justify-between text-caption text-muted-foreground">
        <span>Lifetime operations</span>
        <span className="font-semibold text-foreground flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-warning animate-float" />
          {totalLifetimeUsage}
        </span>
      </div>
    </GlassCard>
  );
}
