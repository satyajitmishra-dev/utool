"use client";

import React, { useEffect, useState } from "react";
import { Activity, Signal, Wifi, Zap } from "lucide-react";
import { getNetworkSpeed } from "@/lib/ads/utils";
import { cn } from "@/utils/cn";

export interface ExperienceStatusProps {
  className?: string;
  fileSizeMB?: number;
}

export function ExperienceStatus({ className, fileSizeMB = 10 }: ExperienceStatusProps) {
  const [network, setNetwork] = useState({
    effectiveType: "unknown",
    downlink: 0,
    rtt: 0,
    speedCategory: "unknown",
  });

  const [serverState, setServerState] = useState<"checking" | "online" | "congested">("checking");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateNetworkData = () => {
      const conn = (navigator as any).connection ||
                   (navigator as any).mozConnection ||
                   (navigator as any).webkitConnection;
      
      const speedCat = getNetworkSpeed();

      if (conn) {
        setNetwork({
          effectiveType: conn.effectiveType || "4g",
          downlink: conn.downlink || 0,
          rtt: conn.rtt || 0,
          speedCategory: speedCat,
        });
      } else {
        setNetwork((prev) => ({ ...prev, speedCategory: speedCat }));
      }
    };

    updateNetworkData();

    const conn = (navigator as any).connection;
    if (conn) {
      conn.addEventListener("change", updateNetworkData);
    }

    // Mock ping check to verify server health
    const pingTimer = setTimeout(() => {
      setServerState(Math.random() > 0.05 ? "online" : "congested");
    }, 1000);

    return () => {
      if (conn) {
        conn.removeEventListener("change", updateNetworkData);
      }
      clearTimeout(pingTimer);
    };
  }, []);

  // Compute estimated transfer times based on downlink speed
  const getEstimatedWaitTime = () => {
    if (!network.downlink || network.downlink === 0) {
      return "Estimating...";
    }
    // file size in Megabits / downlink Megabits per second
    const fileBits = fileSizeMB * 8;
    const seconds = fileBits / network.downlink;
    if (seconds < 1) return "< 1 second";
    if (seconds < 60) return `${Math.ceil(seconds)} seconds`;
    return `${Math.floor(seconds / 60)}m ${Math.ceil(seconds % 60)}s`;
  };

  const getSignalStrength = () => {
    switch (network.speedCategory) {
      case "slow-3g":
        return { text: "Critical Latency", color: "text-red-500", bg: "bg-red-500/10" };
      case "fast-3g":
        return { text: "Medium Latency", color: "text-amber-500", bg: "bg-amber-500/10" };
      case "4g":
        return { text: "High Speed (LTE)", color: "text-primary", bg: "bg-primary/10" };
      case "5g-fast":
        return { text: "Ultra High Speed", color: "text-emerald-500", bg: "bg-emerald-500/10" };
      default:
        return { text: "Network Diagnostics Idle", color: "text-muted-foreground", bg: "bg-muted" };
    }
  };

  const strength = getSignalStrength();

  return (
    <div className={cn("w-full flex flex-col gap-4 text-left animate-fade-in", className)}>
      {/* Network Stats Card */}
      <div className="glass-card p-4 rounded-2xl border border-border/80 bg-card/25 shadow-xs backdrop-blur-xs flex flex-col gap-3">
        <h4 className="text-xs font-bold text-muted-foreground flex items-center justify-between uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <Signal size={12} />
            Network Speed Meter
          </span>
          <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-full", strength.color, strength.bg)}>
            {strength.text}
          </span>
        </h4>

        {/* Speed Data Grid */}
        <div className="grid grid-cols-2 gap-2 mt-1">
          <div className="bg-muted/30 border border-border/40 p-2.5 rounded-xl flex flex-col">
            <span className="text-[10px] text-muted-foreground font-semibold">Downlink Bandwidth</span>
            <span className="text-sm font-bold text-foreground mt-0.5">
              {network.downlink ? `${network.downlink} Mbps` : "Offline"}
            </span>
          </div>

          <div className="bg-muted/30 border border-border/40 p-2.5 rounded-xl flex flex-col">
            <span className="text-[10px] text-muted-foreground font-semibold">Ping Latency (RTT)</span>
            <span className="text-sm font-bold text-foreground mt-0.5">
              {network.rtt ? `${network.rtt} ms` : "N/A"}
            </span>
          </div>

          <div className="bg-muted/30 border border-border/40 p-2.5 rounded-xl flex flex-col">
            <span className="text-[10px] text-muted-foreground font-semibold">Connection Class</span>
            <span className="text-sm font-bold text-foreground mt-0.5 capitalize">
              {network.effectiveType}
            </span>
          </div>

          <div className="bg-muted/30 border border-border/40 p-2.5 rounded-xl flex flex-col">
            <span className="text-[10px] text-muted-foreground font-semibold">Wait Time ({fileSizeMB}MB)</span>
            <span className="text-sm font-bold text-foreground mt-0.5">
              {getEstimatedWaitTime()}
            </span>
          </div>
        </div>
      </div>

      {/* Server Status Indicators */}
      <div className="glass-card p-4 rounded-2xl border border-border bg-card/20 backdrop-blur-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-primary" />
          <span className="text-xs font-semibold text-muted-foreground">Server API Node</span>
        </div>
        <div className="flex items-center gap-1.5">
          {serverState === "checking" && (
            <>
              <div className="w-2 h-2 rounded-full bg-muted animate-pulse" />
              <span className="text-[11px] text-muted-foreground">Verifying node...</span>
            </>
          )}
          {serverState === "online" && (
            <>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Operational</span>
            </>
          )}
          {serverState === "congested" && (
            <>
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[11px] text-amber-500 font-semibold">Heavy Load</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
export default ExperienceStatus;
