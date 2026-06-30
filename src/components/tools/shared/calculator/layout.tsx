"use client";

import React from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { History, Calculator } from "lucide-react";
import { cn } from "@/utils/cn";

interface CalculatorLayoutProps {
  header: React.ReactNode;
  inputs: React.ReactNode;
  results: React.ReactNode;
  historyPanel: React.ReactNode;
  activeTab: "calculate" | "history";
  setActiveTab: (tab: "calculate" | "history") => void;
  hasHistory?: boolean;
}

export function CalculatorLayout({
  header,
  inputs,
  results,
  historyPanel,
  activeTab,
  setActiveTab,
  hasHistory = true,
}: CalculatorLayoutProps) {
  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {header}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Parameters / Inputs */}
        <div className="lg:col-span-5 space-y-6">
          {hasHistory && (
            <div className="flex border border-border rounded-xl p-1 bg-muted/20 w-fit select-none">
              <button
                onClick={() => setActiveTab("calculate")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all",
                  activeTab === "calculate"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Calculator className="h-3.5 w-3.5" />
                Calculator
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all",
                  activeTab === "history"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <History className="h-3.5 w-3.5" />
                History
              </button>
            </div>
          )}

          {activeTab === "calculate" ? (
            <GlassCard className="p-6 space-y-6 border border-border/60" hover={false}>
              {inputs}
            </GlassCard>
          ) : (
            <GlassCard className="p-6 space-y-6 border border-border/60" hover={false}>
              {historyPanel}
            </GlassCard>
          )}
        </div>

        {/* Right Side: Calculation Results & Details */}
        <div className="lg:col-span-7 space-y-6">
          {activeTab === "calculate" ? (
            <div className="space-y-6">{results}</div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border rounded-3xl bg-muted/5 text-center">
              <History className="h-8 w-8 text-muted-foreground/60 mb-2" />
              <h3 className="text-sm font-bold text-foreground">Query History Active</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                Select a previous calculation from the history list in the left panel to reload values.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
