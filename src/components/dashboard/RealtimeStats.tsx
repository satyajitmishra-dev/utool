"use client";

import React, { useMemo } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUsageStats } from "@/hooks/useUsageStats";
import { Activity, BarChart2, Calendar } from "lucide-react";

export function RealtimeStats() {
  const { stats, loading, error } = useUsageStats();

  const formattedTime = useMemo(() => {
    if (!stats.lastActiveAt) return "Never";
    try {
      const ts = stats.lastActiveAt;
      const date = typeof ts.toDate === "function" ? ts.toDate() : new Date(ts);
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Stale";
    }
  }, [stats.lastActiveAt]);

  const friendlyToolName = (slug: string) => {
    if (!slug || slug === "None") return "None";
    return slug
      .split("-")
      .map((word) => (word.toLowerCase() === "pdf" ? "PDF" : word.charAt(0).toUpperCase() + word.slice(1)))
      .join(" ");
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <GlassCard hover={false} className="p-6 space-y-4">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-8 w-1/2" />
        </GlassCard>
        <GlassCard hover={false} className="p-6 space-y-4">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-8 w-1/2" />
        </GlassCard>
      </div>
    );
  }

  if (error) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <GlassCard hover={false} className="p-6 relative overflow-hidden flex items-start gap-4 h-full min-h-[140px]">
        <div className="rounded-xl bg-secondary/10 p-3 text-secondary">
          <BarChart2 className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <p className="text-body-s font-medium text-muted-foreground">Most Used Utility</p>
          <h4 className="text-xl font-bold text-foreground mt-1">
            {friendlyToolName(stats.mostUsedTool)}
          </h4>
          <span className="text-caption text-muted-foreground block">Based on total lifetime logs</span>
        </div>
      </GlassCard>

      <GlassCard hover={false} className="p-6 relative overflow-hidden flex items-start gap-4 h-full min-h-[140px]">
        <div className="rounded-xl bg-accent/10 p-3 text-accent">
          <Activity className="h-6 w-6 text-accent animate-pulse" />
        </div>
        <div className="space-y-1">
          <p className="text-body-s font-medium text-muted-foreground">Last Activity</p>
          <h4 className="text-xl font-bold text-foreground mt-1">
            {friendlyToolName(stats.lastUsedTool)}
          </h4>
          <span className="text-caption text-muted-foreground flex items-center gap-1 mt-0.5">
            <Calendar className="h-3.5 w-3.5" />
            {formattedTime}
          </span>
        </div>
      </GlassCard>
    </div>
  );
}
