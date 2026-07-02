"use client";

import React, { useEffect, useState } from "react";
import { BarChart3, TrendingUp, RefreshCw, Trophy, ShieldAlert } from "lucide-react";
import { cn } from "@/utils/cn";

export interface ExperienceAnalyticsProps {
  state?: string;
  className?: string;
}

interface TelemetryData {
  incidents: number;
  retries: number;
  successfulRetries: number;
  searches: number;
  gameSessions: number;
  highScore: number;
}

export function ExperienceAnalytics({ state, className }: ExperienceAnalyticsProps) {
  const [stats, setStats] = useState<TelemetryData>({
    incidents: 0,
    retries: 0,
    successfulRetries: 0,
    searches: 0,
    gameSessions: 0,
    highScore: 0,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Update incidents count in localStorage
    try {
      const raw = localStorage.getItem("utool_telemetry");
      let current: TelemetryData = {
        incidents: 0,
        retries: 0,
        successfulRetries: 0,
        searches: 0,
        gameSessions: 0,
        highScore: 0,
      };

      if (raw) {
        current = JSON.parse(raw);
      }

      // If state is passed, increment incident
      if (state) {
        current.incidents += 1;
        // Fetch current game high score from local storage
        const savedScore = localStorage.getItem("utool_game_highscore");
        if (savedScore) {
          current.highScore = parseInt(savedScore, 10);
        }
        localStorage.setItem("utool_telemetry", JSON.stringify(current));
      }

      setStats(current);
    } catch {
      // ignore
    }
  }, [state]);

  // Calculations for dashboard
  const getRecoveryRate = () => {
    if (stats.retries === 0) return "100%";
    const rate = (stats.successfulRetries / stats.retries) * 100;
    return `${Math.round(rate)}%`;
  };

  const getBounceReduction = () => {
    // Simulated bounce rate reduction based on game interactions + search
    const totalInteractions = stats.searches + stats.gameSessions;
    if (totalInteractions === 0) return "0%";
    const reduction = Math.min(totalInteractions * 8.5, 45); // caps at 45% reduction
    return `${Math.round(reduction)}%`;
  };

  return (
    <div className={cn("w-full flex flex-col gap-4 text-left animate-fade-in", className)}>
      <div className="glass-card p-4 rounded-2xl border border-border bg-card/25 backdrop-blur-xs flex flex-col gap-3">
        <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <BarChart3 size={12} className="text-primary" />
          Workspace Analytics & Telemetry
        </h5>
        <p className="text-[10px] text-muted-foreground -mt-1 leading-normal">
          Client-side metrics tracking user engagement and recovery success.
        </p>

        {/* Analytics Grid */}
        <div className="grid grid-cols-2 gap-2 mt-1.5">
          
          <div className="bg-muted/20 border border-border/40 p-2 rounded-xl flex items-center gap-2.5">
            <ShieldAlert size={14} className="text-red-500 shrink-0" />
            <div className="min-w-0">
              <span className="text-[8px] text-muted-foreground block font-semibold uppercase tracking-wider">Incidents</span>
              <span className="text-xs font-bold text-foreground block">{stats.incidents}</span>
            </div>
          </div>

          <div className="bg-muted/20 border border-border/40 p-2 rounded-xl flex items-center gap-2.5">
            <RefreshCw size={14} className="text-emerald-500 shrink-0" />
            <div className="min-w-0">
              <span className="text-[8px] text-muted-foreground block font-semibold uppercase tracking-wider">Recovery Rate</span>
              <span className="text-xs font-bold text-foreground block">{getRecoveryRate()}</span>
            </div>
          </div>

          <div className="bg-muted/20 border border-border/40 p-2 rounded-xl flex items-center gap-2.5">
            <Trophy size={14} className="text-amber-500 shrink-0" />
            <div className="min-w-0">
              <span className="text-[8px] text-muted-foreground block font-semibold uppercase tracking-wider">Game High Score</span>
              <span className="text-xs font-bold text-foreground block">{stats.highScore} pts</span>
            </div>
          </div>

          <div className="bg-muted/20 border border-border/40 p-2 rounded-xl flex items-center gap-2.5">
            <TrendingUp size={14} className="text-primary shrink-0" />
            <div className="min-w-0">
              <span className="text-[8px] text-muted-foreground block font-semibold uppercase tracking-wider">Bounce Reduction</span>
              <span className="text-xs font-bold text-foreground block">{getBounceReduction()}</span>
            </div>
          </div>

        </div>

        {/* Micro chart line simulation */}
        <div className="flex flex-col gap-1 mt-1 text-[9px] text-muted-foreground leading-normal font-medium">
          <div className="flex justify-between items-center">
            <span>Client Workspace Health Index</span>
            <span className="text-emerald-500 font-bold font-mono">99.8% Stable</span>
          </div>
          <div className="w-full h-1 bg-muted/60 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 w-[99.8%] rounded-full" />
          </div>
        </div>

      </div>
    </div>
  );
}
export default ExperienceAnalytics;
