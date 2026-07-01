"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Sliders,
  DollarSign,
  TrendingUp,
  Activity,
  Percent,
  Save,
  ArrowLeft,
  Settings,
  AlertOctagon,
  Eye,
  RefreshCw,
  Info,
  Tv,
  CheckCircle,
  ToggleLeft
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { fetchAdConfig, saveAdConfig } from "@/lib/ads/config";
import { fetchAdAnalyticsSummary } from "@/lib/ads/analytics";
import { GlobalAdConfig, AdAnalyticsSummary, AdProviderType } from "@/lib/ads/types";
import { DEFAULT_GLOBAL_AD_CONFIG } from "@/lib/ads/config";

export function AdminAdsDashboard() {
  const [activeTab, setActiveTab] = useState<"analytics" | "global" | "placements">("analytics");
  const [config, setConfig] = useState<GlobalAdConfig | null>(null);
  const [analytics, setAnalytics] = useState<AdAnalyticsSummary | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load configuration and analytics
  const loadData = async () => {
    setIsLoading(true);
    try {
      const liveConfig = await fetchAdConfig();
      const summary = await fetchAdAnalyticsSummary();
      setConfig(liveConfig);
      setAnalytics(summary);
    } catch (err) {
      toast.error("Failed to fetch advertisement settings.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async () => {
    if (!config) return;
    setIsSaving(true);
    try {
      await saveAdConfig(config);
      toast.success("Monetization configuration successfully updated!");
    } catch (err) {
      toast.error("Failed to save changes. Verify firestore connection.");
    } finally {
      setIsSaving(false);
    }
  };

  const updatePlacement = (
    id: string,
    key: "enabled" | "adUnitId" | "mobile" | "tablet" | "desktop" | "mobileSize" | "tabletSize" | "desktopSize",
    value: any
  ) => {
    if (!config) return;

    const currentPl = config.placements[id];
    if (!currentPl) return;

    let updatedPl = { ...currentPl };

    if (key === "enabled") updatedPl.enabled = value as boolean;
    if (key === "adUnitId") updatedPl.adUnitId = value as string;
    
    if (key === "mobile" || key === "tablet" || key === "desktop") {
      updatedPl.devices = {
        ...updatedPl.devices,
        [key]: value as boolean
      };
    }

    if (key === "mobileSize" || key === "tabletSize" || key === "desktopSize") {
      const dev = key.replace("Size", "") as "mobile" | "tablet" | "desktop";
      updatedPl.sizes = {
        ...updatedPl.sizes,
        [dev]: value as string
      };
    }

    setConfig({
      ...config,
      placements: {
        ...config.placements,
        [id]: updatedPl
      }
    });
  };

  if (isLoading || !config || !analytics) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-4">
        <RefreshCw className="h-8 w-8 text-primary animate-spin" />
        <p className="text-xs text-muted-foreground font-semibold">Retrieving Monetization Records...</p>
      </div>
    );
  }

  // Visual SVG chart helper
  const maxRevenue = Math.max(...analytics.history.map((h) => h.revenue), 1);
  const chartPoints = analytics.history
    .map((h, i) => {
      const x = (i / 6) * 100;
      const y = 80 - (h.revenue / maxRevenue) * 60; // scale to fit
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="min-h-screen bg-background text-foreground font-sans py-16 px-6 max-w-6xl mx-auto space-y-10 relative overflow-hidden">
      {/* Decorative Radial Lights */}
      <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-purple-500/[0.04] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[5%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

      {/* Admin Headers */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/80 pb-6">
        <div className="space-y-1 text-left">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground hover:text-foreground transition uppercase tracking-wider mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Portal
          </Link>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <Tv className="h-8 w-8 text-primary" /> Monetization Control Center
          </h1>
          <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
            Manage UTool advertising placements, toggles, GDPR consent parameters, and analyze revenue efficiency in real time.
          </p>
        </div>

        {/* Global Save Controls */}
        <div className="flex items-center gap-3">
          <Button
            onClick={loadData}
            variant="outline"
            className="h-10 rounded-xl bg-transparent border-neutral-800 text-xs font-semibold hover:bg-neutral-900"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1" /> Reload
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="h-10 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold shadow-md shadow-primary/10 flex items-center justify-center gap-2 px-5"
          >
            <Save className="h-4 w-4" /> {isSaving ? "Saving..." : "Save Config"}
          </Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-neutral-800 pb-px">
        {[
          { id: "analytics", label: "Revenue Analytics", icon: Activity },
          { id: "global", label: "Global Settings", icon: Settings },
          { id: "placements", label: "Placements & Sizes", icon: Sliders },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 border-b-2 text-xs font-bold transition-all relative ${
                isActive
                  ? "border-primary text-white"
                  : "border-transparent text-muted-foreground hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: ANALYTICS */}
      {activeTab === "analytics" && (
        <div className="space-y-8 animate-fade-in text-left">
          {/* Metrics summary cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <GlassCard hover={false} className="p-6 bg-neutral-900/30 flex flex-col gap-2">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-[10px] uppercase font-bold tracking-wider">Estimated Revenue</span>
                <DollarSign className="h-4 w-4 text-emerald-400" />
              </div>
              <span className="text-2xl font-black text-white">
                ${analytics.estimatedEarnings.toFixed(2)}
              </span>
              <span className="text-[9px] text-emerald-400 font-bold flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> +14.2% from last week
              </span>
            </GlassCard>

            <GlassCard hover={false} className="p-6 bg-neutral-900/30 flex flex-col gap-2">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-[10px] uppercase font-bold tracking-wider">Impressions</span>
                <Eye className="h-4 w-4 text-blue-400" />
              </div>
              <span className="text-2xl font-black text-white">
                {analytics.impressions.toLocaleString()}
              </span>
              <span className="text-[9px] text-neutral-500 font-bold">
                50% visible for 1s enforced
              </span>
            </GlassCard>

            <GlassCard hover={false} className="p-6 bg-neutral-900/30 flex flex-col gap-2">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-[10px] uppercase font-bold tracking-wider">Average CTR</span>
                <Percent className="h-4 w-4 text-purple-400" />
              </div>
              <span className="text-2xl font-black text-white">
                {(analytics.ctr * 100).toFixed(2)}%
              </span>
              <span className="text-[9px] text-purple-400 font-bold">
                Healthy user conversion rate
              </span>
            </GlassCard>

            <GlassCard hover={false} className="p-6 bg-neutral-900/30 flex flex-col gap-2">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-[10px] uppercase font-bold tracking-wider">Page RPM</span>
                <Activity className="h-4 w-4 text-rose-400" />
              </div>
              <span className="text-2xl font-black text-white">
                ${analytics.rpm.toFixed(2)}
              </span>
              <span className="text-[9px] text-rose-400 font-bold">
                Revenue per 1,000 views
              </span>
            </GlassCard>
          </div>

          {/* Revenue Chart Visualizer */}
          <GlassCard hover={false} className="p-8 bg-neutral-900/20 border border-white/[0.04] relative">
            <h3 className="text-sm font-bold text-white mb-6">Revenue Trend (Last 7 Days)</h3>
            <div className="w-full h-44 relative">
              <svg className="w-full h-full" viewBox="0 0 100 80" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(238, 75%, 57%)" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="hsl(238, 75%, 57%)" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1="0" y1="20" x2="100" y2="20" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                <line x1="0" y1="80" x2="100" y2="80" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />

                {/* Line Path */}
                <polyline
                  fill="none"
                  stroke="hsl(238, 82%, 65%)"
                  strokeWidth="1.5"
                  points={chartPoints}
                />

                {/* Area Gradient under line */}
                <path
                  d={`M 0,80 L ${chartPoints} L 100,80 Z`}
                  fill="url(#chart-glow)"
                />
              </svg>
            </div>

            {/* X-Axis labels */}
            <div className="flex justify-between mt-2 pt-2 border-t border-white/[0.04]">
              {analytics.history.map((h, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <span className="text-[9px] text-neutral-500 font-bold uppercase">{h.date.substring(5)}</span>
                  <span className="text-[10px] text-neutral-300 font-extrabold mt-0.5">${h.revenue.toFixed(1)}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}

      {/* TAB CONTENT: GLOBAL SETTINGS */}
      {activeTab === "global" && (
        <div className="space-y-6 animate-fade-in text-left max-w-3xl">
          <GlassCard hover={false} className="p-8 bg-neutral-900/20 border border-white/[0.04] space-y-6">
            {/* Global bypasses */}
            <div className="flex justify-between items-center pb-6 border-b border-white/[0.04]">
              <div className="space-y-1 max-w-md">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  Global System Toggle
                </h3>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Turn advertisements ON/OFF system-wide. Premium tiers will always remain ad-free regardless of this switch.
                </p>
              </div>
              <input
                type="checkbox"
                checked={config.enabled}
                onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
                className="h-5 w-10 appearance-none bg-neutral-800 rounded-full checked:bg-primary relative before:absolute before:h-4 before:w-4 before:rounded-full before:bg-white before:top-0.5 before:left-0.5 before:transition-all checked:before:left-5.5 cursor-pointer"
              />
            </div>

            <div className="flex justify-between items-center pb-6 border-b border-white/[0.04] bg-rose-500/[0.01] p-3 rounded-2xl border border-rose-950/20">
              <div className="space-y-1 max-w-md">
                <h3 className="text-sm font-bold text-rose-400 flex items-center gap-1.5">
                  <AlertOctagon className="h-4.5 w-4.5 text-rose-500" /> Emergency Kill Switch
                </h3>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  IMMEDIATE safety override. Activating this disables all ad fetch operations and wipes scripts/DOM spaces entirely to prevent site instability.
                </p>
              </div>
              <input
                type="checkbox"
                checked={config.emergencyKillSwitch}
                onChange={(e) => setConfig({ ...config, emergencyKillSwitch: e.target.checked })}
                className="h-5 w-10 appearance-none bg-neutral-800 rounded-full checked:bg-rose-600 relative before:absolute before:h-4 before:w-4 before:rounded-full before:bg-white before:top-0.5 before:left-0.5 before:transition-all checked:before:left-5.5 cursor-pointer"
              />
            </div>

            {/* Provider selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                  Active Monetization Provider
                </label>
                <select
                  value={config.activeProvider}
                  onChange={(e) => setConfig({ ...config, activeProvider: e.target.value as AdProviderType })}
                  className="w-full h-10 px-4 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-primary"
                >
                  <option value="adsense">Google AdSense</option>
                  <option value="admanager">Google Ad Manager (GAM)</option>
                  <option value="medianet">Media.net Contextual</option>
                  <option value="custom">Custom HTML Ads</option>
                  <option value="affiliate">UTool Affiliate Cards</option>
                  <option value="sponsored">Sponsor Card Fallbacks</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                  Google AdSense Publisher ID
                </label>
                <input
                  type="text"
                  value={config.adsensePubId}
                  onChange={(e) => setConfig({ ...config, adsensePubId: e.target.value })}
                  placeholder="pub-5573426189025066"
                  className="w-full h-10 px-4 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* Speed & Capping */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                  Session Frequency Cap (Max Impressions)
                </label>
                <input
                  type="number"
                  value={config.frequencyCap}
                  onChange={(e) => setConfig({ ...config, frequencyCap: parseInt(e.target.value, 10) || 0 })}
                  className="w-full h-10 px-4 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-primary"
                />
                <span className="text-[9px] text-neutral-500 block">
                  Prevents banner blindness. Enter 0 for unlimited impressions.
                </span>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                  Session Entry Delay (Seconds)
                </label>
                <input
                  type="number"
                  value={config.sessionMinDelay}
                  onChange={(e) => setConfig({ ...config, sessionMinDelay: parseInt(e.target.value, 10) || 0 })}
                  className="w-full h-10 px-4 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-primary"
                />
                <span className="text-[9px] text-neutral-500 block">
                  Waits N seconds after page load before starting ad triggers (enhances CLS).
                </span>
              </div>
            </div>

            {/* Test & Debug Switches */}
            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/[0.04]">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-xs font-bold text-white block">Test Advertisements</label>
                  <span className="text-[10px] text-neutral-500 leading-relaxed block">Render mock frames locally.</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.testAds}
                  onChange={(e) => setConfig({ ...config, testAds: e.target.checked })}
                  className="h-4.5 w-9 appearance-none bg-neutral-800 rounded-full checked:bg-primary relative before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-white before:top-0.5 before:left-0.5 before:transition-all checked:before:left-5 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-xs font-bold text-white block">Analytics Debug Mode</label>
                  <span className="text-[10px] text-neutral-500 leading-relaxed block">Log events to client console.</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.debugMode}
                  onChange={(e) => setConfig({ ...config, debugMode: e.target.checked })}
                  className="h-4.5 w-9 appearance-none bg-neutral-800 rounded-full checked:bg-primary relative before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-white before:top-0.5 before:left-0.5 before:transition-all checked:before:left-5 cursor-pointer"
                />
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* TAB CONTENT: PLACEMENTS */}
      {activeTab === "placements" && (
        <div className="space-y-6 animate-fade-in text-left">
          <GlassCard hover={false} className="bg-neutral-900/20 border border-white/[0.04] overflow-hidden p-6">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Sliders className="h-4 w-4 text-primary" /> Placement Sizing Control
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-neutral-300 text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-800 text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                    <th className="py-4 px-3">Placement</th>
                    <th className="py-4 px-3">Active</th>
                    <th className="py-4 px-3">Devices Allowed</th>
                    <th className="py-4 px-3">Size Options</th>
                    <th className="py-4 px-3">Unit ID Override</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900/80 font-medium">
                  {Object.values(config.placements).map((pl) => (
                    <tr key={pl.id} className="hover:bg-neutral-900/10">
                      <td className="py-4 px-3 font-bold text-white">
                        <div className="flex flex-col">
                          <span>{pl.name}</span>
                          <span className="text-[10px] font-mono text-neutral-500">{pl.id}</span>
                        </div>
                      </td>
                      
                      {/* Placement enabled checkbox */}
                      <td className="py-4 px-3">
                        <input
                          type="checkbox"
                          checked={pl.enabled}
                          onChange={(e) => updatePlacement(pl.id, "enabled", e.target.checked)}
                          className="h-4 w-8 appearance-none bg-neutral-800 rounded-full checked:bg-primary relative before:absolute before:h-3 before:w-3 before:rounded-full before:bg-white before:top-0.5 before:left-0.5 before:transition-all checked:before:left-4.5 cursor-pointer"
                        />
                      </td>

                      {/* Allowed Devices */}
                      <td className="py-4 px-3">
                        <div className="flex flex-col gap-1.5">
                          {["mobile", "tablet", "desktop"].map((d) => (
                            <label key={d} className="flex items-center gap-1.5 text-[11px] cursor-pointer">
                              <input
                                type="checkbox"
                                checked={(pl.devices as any)[d]}
                                onChange={(e) => updatePlacement(pl.id, d as any, e.target.checked)}
                                className="rounded border-neutral-800 bg-neutral-900 text-primary focus:ring-0 focus:ring-offset-0 h-3.5 w-3.5"
                              />
                              <span className="capitalize">{d}</span>
                            </label>
                          ))}
                        </div>
                      </td>

                      {/* Sizing definitions */}
                      <td className="py-4 px-3 space-y-1.5">
                        {["mobile", "tablet", "desktop"].map((d) => {
                          const isDevActive = (pl.devices as any)[d];
                          if (!isDevActive) return null;
                          return (
                            <div key={d} className="flex items-center gap-2">
                              <span className="text-[10px] uppercase font-bold text-neutral-500 w-12">{d}:</span>
                              <input
                                type="text"
                                value={(pl.sizes as any)[d]}
                                onChange={(e) => updatePlacement(pl.id, `${d}Size` as any, e.target.value)}
                                placeholder="auto"
                                className="w-24 h-7 px-2 rounded-lg bg-neutral-900 border border-neutral-800 text-[11px] text-white focus:outline-none focus:border-primary"
                              />
                            </div>
                          );
                        })}
                      </td>

                      {/* Unit ID Override */}
                      <td className="py-4 px-3">
                        <input
                          type="text"
                          value={pl.adUnitId || ""}
                          onChange={(e) => updatePlacement(pl.id, "adUnitId", e.target.value)}
                          placeholder="Default override"
                          className="w-full h-8 px-3 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-primary"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
export default AdminAdsDashboard;
