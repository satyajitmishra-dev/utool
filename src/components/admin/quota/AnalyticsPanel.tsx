"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Activity,
  Layers,
  Users,
  Database,
  Globe,
  Sparkles,
  RefreshCw,
  Clock
} from "lucide-react";
import { toast } from "sonner";
import { GlassCard } from "@/components/ui/glass-card";

export function AnalyticsPanel() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/analytics");
      if (!res.ok) throw new Error("Could not load analytics");
      const d = await res.json();
      if (d.success) {
        setData(d);
      }
    } catch (e: any) {
      toast.error("Error loading analytics: " + (e.message || "Network Error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <RefreshCw className="h-8 w-8 text-purple-500 animate-spin" />
        <span className="text-sm font-bold text-muted-foreground">Compiling aggregated SaaS analytics...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Failed to compile analytics dashboard data.
      </div>
    );
  }

  const { stats, charts } = data;

  // Render SVG User Growth Line Chart
  const renderGrowthChart = () => {
    const chartPoints = charts.growthChartData || [];
    if (chartPoints.length === 0) return null;

    const maxVal = Math.max(...chartPoints.map((p: any) => p.count));
    const minVal = Math.min(...chartPoints.map((p: any) => p.count)) * 0.95;
    const range = maxVal - minVal;
    
    const width = 500;
    const height = 180;
    const padding = 20;

    const pointsString = chartPoints
      .map((p: any, idx: number) => {
        const x = padding + (idx * (width - padding * 2)) / (chartPoints.length - 1);
        const y = height - padding - ((p.count - minVal) * (height - padding * 2)) / (range || 1);
        return `${x},${y}`;
      })
      .join(" ");

    const pathArea = `M ${padding},${height - padding} L ${pointsString} L ${width - padding},${height - padding} Z`;

    return (
      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          <defs>
            <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(238, 75%, 57%)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="hsl(238, 75%, 57%)" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(255,255,255,0.06)" />
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="rgba(255,255,255,0.03)" strokeDasharray="3" />
          <path d={pathArea} fill="url(#growthGrad)" />
          <polyline fill="none" stroke="hsl(var(--color-primary))" strokeWidth="2.5" points={pointsString} />
          {chartPoints.map((p: any, idx: number) => {
            if (idx % 5 !== 0 && idx !== chartPoints.length - 1) return null;
            const x = padding + (idx * (width - padding * 2)) / (chartPoints.length - 1);
            const y = height - padding - ((p.count - minVal) * (height - padding * 2)) / (range || 1);
            return (
              <g key={idx}>
                <circle cx={x} cy={y} r="3.5" fill="hsl(var(--background))" stroke="hsl(var(--color-primary))" strokeWidth="2" />
                <text x={x} y={y - 8} fill="rgba(255,255,255,0.6)" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                  {p.count}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 4 Extra Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Storage Consumed", value: `${(stats.storageUsedBytes / (1024 * 1024 * 1024)).toFixed(2)} GB`, desc: "R2 storage footprint", icon: Database, color: "text-zinc-400" },
          { label: "Today's Credit Burn", value: stats.creditsConsumedToday?.toLocaleString(), desc: "Credits spent in 24h", icon: TrendingUp, color: "text-emerald-500" },
          { label: "Today's AI Actions", value: stats.aiRequestsToday?.toLocaleString(), desc: "Groq & Whisper actions", icon: Sparkles, color: "text-purple-400" },
          { label: "Revenue Summary", value: `$${stats.revenueSummary?.toLocaleString()}`, desc: "Aggregate sales cash flow", icon: Globe, color: "text-blue-400" }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <GlassCard key={i} className="p-6 border-white/[0.04] bg-card/30 flex flex-col justify-between" hover={false}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</span>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <h3 className="text-2xl font-black mt-4 text-foreground tracking-tight">{stat.value}</h3>
                <p className="text-[10.5px] text-muted-foreground mt-1 leading-relaxed">{stat.desc}</p>
              </div>
            </GlassCard>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Growth Chart */}
        <GlassCard className="p-6 border-white/[0.04] bg-card/35 space-y-4 lg:col-span-2" hover={false}>
          <div className="flex justify-between items-center leading-none">
            <h4 className="text-xs font-black uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              User Registration growth (Last 30 Days)
            </h4>
          </div>
          {renderGrowthChart()}
        </GlassCard>

        {/* Funnel Conversions */}
        <GlassCard className="p-6 border-white/[0.04] bg-card/35 space-y-4" hover={false}>
          <h4 className="text-xs font-black uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-purple-500" />
            Conversion Funnel
          </h4>

          <div className="space-y-4 pt-2 text-xs font-semibold">
            {charts.conversionFunnel?.map((step: any, idx: number) => {
              const widths = ["w-full", "w-[60%]", "w-[25%]"];
              const colors = ["bg-purple-500", "bg-indigo-500", "bg-pink-500"];
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs leading-none">
                    <span className="text-foreground">{step.name}</span>
                    <span className="text-muted-foreground font-mono">{step.count} users</span>
                  </div>
                  <div className="h-4 bg-muted/65 rounded-lg overflow-hidden relative">
                    <div className={`h-full ${colors[idx]} rounded-lg ${widths[idx]}`} />
                    <span className="absolute inset-0 flex items-center pl-2 text-[9px] font-black uppercase tracking-wider text-white">
                      {idx === 0 ? "100%" : idx === 1 ? `${Math.round((step.count / charts.conversionFunnel[0].count) * 100)}%` : `${stats.conversionRate}%`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Tools Popularity */}
        <GlassCard className="p-6 border-white/[0.04] bg-card/35 space-y-4" hover={false}>
          <h4 className="text-xs font-black uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
            <Activity className="h-4 w-4 text-purple-500" />
            Top Executed Tools
          </h4>

          <div className="space-y-3 pt-2 text-xs">
            {stats.topTools?.map((tool: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center border-b border-white/[0.03] pb-2 font-semibold">
                <span className="text-foreground">{tool.name}</span>
                <span className="text-muted-foreground font-mono bg-muted px-2.5 py-0.5 rounded-md text-[10px] font-bold">
                  {tool.count} calls
                </span>
              </div>
            ))}
            {(!stats.topTools || stats.topTools.length === 0) && (
              <div className="text-center text-muted-foreground py-4">No tool calls registered yet.</div>
            )}
          </div>
        </GlassCard>

        {/* Top Countries Map */}
        <GlassCard className="p-6 border-white/[0.04] bg-card/35 space-y-4" hover={false}>
          <h4 className="text-xs font-black uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
            <Globe className="h-4 w-4 text-purple-500" />
            Top Countries distribution
          </h4>

          <div className="space-y-3 pt-2 text-xs">
            {stats.topCountries?.map((c: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center border-b border-white/[0.03] pb-2 font-semibold">
                <span className="text-foreground">Country Origin: {c.country}</span>
                <span className="text-muted-foreground font-mono bg-muted px-2.5 py-0.5 rounded-md text-[10px] font-bold">
                  {c.count} users
                </span>
              </div>
            ))}
            {(!stats.topCountries || stats.topCountries.length === 0) && (
              <div className="text-center text-muted-foreground py-4">No country origin records found.</div>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
