"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Copy, Printer, Share2, Save, Download, RotateCcw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface KeyInsight {
  label: string;
  value: string;
  badge?: string;
}

interface CalculatorResultProps {
  title?: string;
  primaryResult: string | number;
  resultLabel: string;
  summary: string;
  insights?: KeyInsight[];
  nextSteps?: string[];
  onReset: () => void;
  onSave?: () => void;
  onDownloadCsv?: () => void;
  csvFileName?: string;
  reportText?: string;
  inputs?: Record<string, any>;
}

export function CalculatorResult({
  title = "Calculation Result",
  primaryResult,
  resultLabel,
  summary,
  insights = [],
  nextSteps = [],
  onReset,
  onSave,
  onDownloadCsv,
  csvFileName = "report.csv",
  reportText = "",
  inputs = {},
}: CalculatorResultProps) {
  const [copiedText, setCopiedText] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const handleCopyReport = () => {
    if (!reportText) return;
    navigator.clipboard.writeText(reportText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
    toast.success("Detailed report copied to clipboard!");
  };

  const handleShare = () => {
    if (typeof window === "undefined") return;

    // Filter out complex object states or matrices, only keep primitive values
    const queryParams = new URLSearchParams();
    Object.entries(inputs).forEach(([key, val]) => {
      if (typeof val === "object") {
        queryParams.set(key, JSON.stringify(val));
      } else if (val !== undefined && val !== null && val !== "") {
        queryParams.set(key, String(val));
      }
    });

    const shareUrl = `${window.location.origin}${window.location.pathname}?${queryParams.toString()}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
    toast.success("Shareable URL copied! It will auto-populate inputs.");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="border border-border/80 rounded-3xl p-6 md:p-8 bg-card shadow-sm space-y-6 relative overflow-hidden">
      {/* Visual background ambient gradient to look premium */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex justify-between items-center pb-4 border-b border-border/60">
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">{title}</h3>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-bold transition select-none print:hidden"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset
        </button>
      </div>

      {/* Large Highlighted Result */}
      <div className="text-center md:text-left py-4 space-y-1">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{resultLabel}</span>
        <div className="text-display-md md:text-display-lg font-black text-foreground tracking-tight leading-none bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent py-1">
          {primaryResult}
        </div>
        <p className="text-xs text-muted-foreground font-medium mt-2 leading-relaxed max-w-xl">{summary}</p>
      </div>

      {/* Dynamic Key Insights Grid */}
      {insights.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {insights.map((insight, idx) => (
            <div
              key={idx}
              className="border border-border/50 rounded-2xl p-4 bg-muted/5 flex flex-col justify-between"
            >
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                {insight.label}
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-base font-bold text-foreground">{insight.value}</span>
                {insight.badge && (
                  <span className="text-[9px] font-extrabold bg-primary/10 text-primary border border-primary/10 px-2 py-0.5 rounded-full">
                    {insight.badge}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recommendations / Next Steps */}
      {nextSteps.length > 0 && (
        <div className="space-y-2 border-t border-border/60 pt-4 print:hidden">
          <span className="text-xs font-bold text-foreground">Recommended Actions</span>
          <ul className="space-y-2.5">
            {nextSteps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions Toolbar */}
      <div className="flex flex-wrap gap-2 pt-4 border-t border-border/60 print:hidden">
        <Button
          variant="primary"
          size="sm"
          onClick={handleShare}
          className="rounded-full flex items-center gap-1.5"
        >
          {copiedShare ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
          {copiedShare ? "Copied Link!" : "Share Result"}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyReport}
          className="rounded-full flex items-center gap-1.5"
        >
          {copiedText ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copiedText ? "Report Copied!" : "Copy Report"}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handlePrint}
          className="rounded-full flex items-center gap-1.5"
        >
          <Printer className="h-3.5 w-3.5" />
          Print / PDF
        </Button>

        {onSave && (
          <Button
            variant="outline"
            size="sm"
            onClick={onSave}
            className="rounded-full flex items-center gap-1.5"
          >
            <Save className="h-3.5 w-3.5" />
            Save Query
          </Button>
        )}

        {onDownloadCsv && (
          <Button
            variant="outline"
            size="sm"
            onClick={onDownloadCsv}
            className="rounded-full flex items-center gap-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </Button>
        )}
      </div>
    </div>
  );
}
export default CalculatorResult;
