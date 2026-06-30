"use client";

import React from "react";
import { Clock, Eye, MessageSquare, ShieldCheck, Zap } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { TextStats, SOCIAL_PLATFORMS } from "@/lib/text/analyzers";

interface TextStatisticsProps {
  stats: TextStats;
}

export function TextStatistics({ stats }: TextStatisticsProps) {
  // Format reading/speaking time
  const formatTime = (minutes: number) => {
    if (minutes === 0) return "0s";
    const sec = Math.round(minutes * 60);
    if (sec < 60) return `${sec}s`;
    const min = Math.floor(sec / 60);
    const remSec = sec % 60;
    return remSec > 0 ? `${min}m ${remSec}s` : `${min}m`;
  };

  const statItems = [
    { label: "Characters", value: stats.characters.toLocaleString() },
    { label: "Chars (No Spaces)", value: stats.charactersNoSpaces.toLocaleString() },
    { label: "Words", value: stats.words.toLocaleString() },
    { label: "Lines", value: stats.lines.toLocaleString() },
    { label: "Paragraphs", value: stats.paragraphs.toLocaleString() },
    { label: "Sentences", value: stats.sentences.toLocaleString() },
    { label: "Byte Size", value: stats.bytes < 1024 ? `${stats.bytes} B` : `${(stats.bytes / 1024).toFixed(2)} KB` },
    { label: "Token Estimate", value: stats.tokens.toLocaleString() },
  ];

  return (
    <div className="space-y-6">
      {/* Grid of basic stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map((item, idx) => (
          <GlassCard key={idx} className="p-4 border border-border bg-card/40 hover:bg-card/70 transition" hover={false}>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">{item.label}</span>
            <span className="text-xl font-black text-foreground mt-1 block tracking-tight">{item.value}</span>
          </GlassCard>
        ))}
      </div>

      {/* Reading/Speaking Time & Extra statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassCard className="p-4 border border-border bg-gradient-to-br from-primary/5 to-transparent flex items-center gap-4" hover={false}>
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Eye className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Estimated Reading Time</span>
            <span className="text-sm font-black text-foreground mt-0.5">{formatTime(stats.readingTimeMin)}</span>
            <span className="text-[10px] text-muted-foreground block leading-none mt-1">Based on 200 words per minute.</span>
          </div>
        </GlassCard>

        <GlassCard className="p-4 border border-border bg-gradient-to-br from-secondary/5 to-transparent flex items-center gap-4" hover={false}>
          <div className="h-10 w-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Estimated Speaking Time</span>
            <span className="text-sm font-black text-foreground mt-0.5">{formatTime(stats.speakingTimeMin)}</span>
            <span className="text-[10px] text-muted-foreground block leading-none mt-1">Based on 130 words per minute.</span>
          </div>
        </GlassCard>
      </div>

      {/* Line metrics (duplicates, lengths) */}
      {(stats.longestLine > 0 || stats.duplicateLines > 0) && (
        <GlassCard className="p-4 border border-border bg-card/25" hover={false}>
          <h4 className="text-xs font-bold text-foreground mb-3 uppercase tracking-wider">Line Analytics</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-muted-foreground block">Duplicate Lines</span>
              <span className={`text-sm font-bold ${stats.duplicateLines > 0 ? "text-amber-500" : "text-foreground"}`}>
                {stats.duplicateLines.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block">Longest Line</span>
              <span className="text-sm font-bold text-foreground">{stats.longestLine.toLocaleString()} chars</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Shortest Line</span>
              <span className="text-sm font-bold text-foreground">{stats.shortestLine.toLocaleString()} chars</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Average Length</span>
              <span className="text-sm font-bold text-foreground">{stats.avgLineLength} chars</span>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Social Media Character Limits */}
      <GlassCard className="p-4 border border-border bg-card/20" hover={false}>
        <h4 className="text-xs font-bold text-foreground mb-3 uppercase tracking-wider">Social Media Limits</h4>
        <div className="space-y-3">
          {SOCIAL_PLATFORMS.map((platform, idx) => {
            const count = stats.characters;
            const pct = Math.min(100, (count / platform.limit) * 100);
            const isOver = count > platform.limit;

            return (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">{platform.label}</span>
                  <span className={isOver ? "text-rose-500 font-bold" : "text-foreground"}>
                    {count.toLocaleString()} / {platform.limit.toLocaleString()}
                  </span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isOver ? "bg-rose-500" : pct >= 90 ? "bg-amber-500" : "bg-primary"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}
