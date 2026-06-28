"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Copy, Check, Eye, Columns, Trash2, ArrowRightLeft, Sliders, CheckSquare, Square } from "lucide-react";
import { toast } from "sonner";

interface DiffRow {
  original: {
    lineNum?: number;
    value: string;
    type: "removed" | "unchanged" | "empty";
  };
  modified: {
    lineNum?: number;
    value: string;
    type: "added" | "unchanged" | "empty";
  };
}

export function DiffChecker() {
  const [originalText, setOriginalText] = useState("Hello World\nThis is the original text.\nSome lines will be changed.\nAnother line here.");
  const [modifiedText, setModifiedText] = useState("Hello World\nThis is the modified text.\nSome lines are changed.\nAnother line here.\nAnd a new line is added.");
  
  const [diffRows, setDiffRows] = useState<DiffRow[]>([]);
  const [hasCompared, setHasCompared] = useState(false);
  const [viewMode, setViewMode] = useState<"side-by-side" | "inline">("side-by-side");
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  
  const [copiedOriginal, setCopiedOriginal] = useState(false);
  const [copiedModified, setCopiedModified] = useState(false);

  const cleanString = (str: string) => {
    let res = str;
    if (ignoreCase) res = res.toLowerCase();
    if (ignoreWhitespace) res = res.trim();
    return res;
  };

  const handleCompare = () => {
    const one = originalText.split("\n");
    const two = modifiedText.split("\n");

    const n = one.length;
    const m = two.length;
    
    // DP table
    const dp: number[][] = Array(n + 1).fill(0).map(() => Array(m + 1).fill(0));

    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= m; j++) {
        if (cleanString(one[i - 1]) === cleanString(two[j - 1])) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }

    let i = n;
    let j = m;
    const tempRows: DiffRow[] = [];

    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && cleanString(one[i - 1]) === cleanString(two[j - 1])) {
        tempRows.unshift({
          original: { lineNum: i, value: one[i - 1], type: "unchanged" },
          modified: { lineNum: j, value: two[j - 1], type: "unchanged" }
        });
        i--;
        j--;
      } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
        tempRows.unshift({
          original: { value: "", type: "empty" },
          modified: { lineNum: j, value: two[j - 1], type: "added" }
        });
        j--;
      } else {
        tempRows.unshift({
          original: { lineNum: i, value: one[i - 1], type: "removed" },
          modified: { value: "", type: "empty" }
        });
        i--;
      }
    }

    setDiffRows(tempRows);
    setHasCompared(true);
    toast.success("Comparison completed!");
  };

  const handleClear = () => {
    setOriginalText("");
    setModifiedText("");
    setDiffRows([]);
    setHasCompared(false);
  };

  const copyToClipboard = (text: string, setCopied: (c: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Text copied!");
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h2 className="text-h2 font-extrabold text-foreground tracking-tight">Diff Checker & Compare</h2>
        <p className="text-body-s text-muted-foreground mt-0.5">
          Compare two text files or snippets side-by-side to highlight differences instantly.
        </p>
      </div>

      {/* Editor inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side: Original */}
        <GlassCard className="p-5 flex flex-col space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-foreground">Original Text</span>
            <div className="flex gap-2">
              <button
                onClick={() => copyToClipboard(originalText, setCopiedOriginal)}
                className="p-1.5 rounded bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted/80 transition"
                title="Copy Original"
              >
                {copiedOriginal ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
              <button
                onClick={() => setOriginalText("")}
                className="p-1.5 rounded bg-muted/40 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition"
                title="Clear Original"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <textarea
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
            placeholder="Paste your original text or code here..."
            className="w-full min-h-[220px] rounded-xl border border-border bg-muted/20 p-4 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-y leading-relaxed"
          />
        </GlassCard>

        {/* Right Side: Modified */}
        <GlassCard className="p-5 flex flex-col space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-foreground">Modified Text</span>
            <div className="flex gap-2">
              <button
                onClick={() => copyToClipboard(modifiedText, setCopiedModified)}
                className="p-1.5 rounded bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted/80 transition"
                title="Copy Modified"
              >
                {copiedModified ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
              <button
                onClick={() => setModifiedText("")}
                className="p-1.5 rounded bg-muted/40 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition"
                title="Clear Modified"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <textarea
            value={modifiedText}
            onChange={(e) => setModifiedText(e.target.value)}
            placeholder="Paste your modified/updated text or code here..."
            className="w-full min-h-[220px] rounded-xl border border-border bg-muted/20 p-4 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-y leading-relaxed"
          />
        </GlassCard>
      </div>

      {/* Settings / Controls */}
      <GlassCard className="p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex flex-wrap gap-4 items-center">
          <button
            onClick={() => setIgnoreCase(!ignoreCase)}
            className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition cursor-pointer select-none"
          >
            {ignoreCase ? <CheckSquare className="h-4 w-4 text-primary" /> : <Square className="h-4 w-4" />}
            Ignore Case
          </button>
          <button
            onClick={() => setIgnoreWhitespace(!ignoreWhitespace)}
            className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition cursor-pointer select-none"
          >
            {ignoreWhitespace ? <CheckSquare className="h-4 w-4 text-primary" /> : <Square className="h-4 w-4" />}
            Ignore Whitespace
          </button>
        </div>

        <div className="flex gap-3 w-full sm:w-auto shrink-0">
          <Button variant="outline" onClick={handleClear} className="flex-1 sm:flex-none justify-center items-center gap-1.5">
            <Trash2 className="h-4 w-4" /> Clear All
          </Button>
          <Button onClick={handleCompare} className="flex-1 sm:flex-none justify-center items-center gap-1.5 font-bold">
            <ArrowRightLeft className="h-4 w-4" /> Compare Texts
          </Button>
        </div>
      </GlassCard>

      {/* Diff Results */}
      {hasCompared && (
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-border pb-2">
            <span className="text-xs font-bold text-foreground">Visual Comparison</span>
            <div className="flex rounded-lg overflow-hidden border border-border bg-muted/30 p-0.5">
              <button
                onClick={() => setViewMode("side-by-side")}
                className={`flex items-center gap-1 text-[10px] font-bold px-3 py-1.5 rounded-md transition ${
                  viewMode === "side-by-side" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Columns className="h-3 w-3" /> Split
              </button>
              <button
                onClick={() => setViewMode("inline")}
                className={`flex items-center gap-1 text-[10px] font-bold px-3 py-1.5 rounded-md transition ${
                  viewMode === "inline" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Eye className="h-3 w-3" /> Unified
              </button>
            </div>
          </div>

          <GlassCard className="overflow-hidden border border-border">
            {viewMode === "side-by-side" ? (
              <div className="grid grid-cols-2 divide-x divide-border font-mono text-[11px] leading-relaxed bg-muted/10 overflow-x-auto select-text">
                {/* Original Column */}
                <div className="min-w-[300px]">
                  <div className="bg-muted/40 py-1.5 px-4 font-bold border-b border-border text-muted-foreground text-[10px] uppercase">
                    Original
                  </div>
                  <div className="py-2">
                    {diffRows.map((row, idx) => {
                      const { type, value, lineNum } = row.original;
                      const isRemoved = type === "removed";
                      const isEmpty = type === "empty";
                      return (
                        <div
                          key={`orig-${idx}`}
                          className={`flex items-stretch min-h-[22px] px-3 ${
                            isRemoved ? "bg-red-500/10 border-l-2 border-red-500 text-red-700 dark:text-red-300" : ""
                          } ${isEmpty ? "bg-muted/20 text-transparent select-none pointer-events-none" : ""}`}
                        >
                          <span className="w-8 shrink-0 text-muted-foreground/40 text-right pr-2 select-none select-none border-r border-border/10 mr-2">
                            {lineNum || ""}
                          </span>
                          <span className="whitespace-pre-wrap flex-1 break-all py-0.5">
                            {isEmpty ? "\u00A0" : value || " "}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Modified Column */}
                <div className="min-w-[300px]">
                  <div className="bg-muted/40 py-1.5 px-4 font-bold border-b border-border text-muted-foreground text-[10px] uppercase">
                    Modified
                  </div>
                  <div className="py-2">
                    {diffRows.map((row, idx) => {
                      const { type, value, lineNum } = row.modified;
                      const isAdded = type === "added";
                      const isEmpty = type === "empty";
                      return (
                        <div
                          key={`mod-${idx}`}
                          className={`flex items-stretch min-h-[22px] px-3 ${
                            isAdded ? "bg-emerald-500/10 border-l-2 border-emerald-500 text-emerald-700 dark:text-emerald-300" : ""
                          } ${isEmpty ? "bg-muted/20 text-transparent select-none pointer-events-none" : ""}`}
                        >
                          <span className="w-8 shrink-0 text-muted-foreground/40 text-right pr-2 select-none border-r border-border/10 mr-2">
                            {lineNum || ""}
                          </span>
                          <span className="whitespace-pre-wrap flex-1 break-all py-0.5">
                            {isEmpty ? "\u00A0" : value || " "}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              /* Inline Unified View */
              <div className="font-mono text-[11px] leading-relaxed bg-muted/10 overflow-x-auto select-text py-2">
                {diffRows.map((row, idx) => {
                  // In inline view, we print removals followed by additions, or unchanged.
                  const orig = row.original;
                  const mod = row.modified;

                  if (orig.type === "removed") {
                    return (
                      <div
                        key={`inline-rem-${idx}`}
                        className="flex items-stretch min-h-[22px] px-3 bg-red-500/10 border-l-2 border-red-500 text-red-700 dark:text-red-300"
                      >
                        <span className="w-8 shrink-0 text-red-500/40 text-right pr-2 select-none border-r border-border/10 mr-2 font-bold">-</span>
                        <span className="whitespace-pre-wrap flex-1 break-all py-0.5">{orig.value || " "}</span>
                      </div>
                    );
                  } else if (mod.type === "added") {
                    return (
                      <div
                        key={`inline-add-${idx}`}
                        className="flex items-stretch min-h-[22px] px-3 bg-emerald-500/10 border-l-2 border-emerald-500 text-emerald-700 dark:text-emerald-300"
                      >
                        <span className="w-8 shrink-0 text-emerald-500/40 text-right pr-2 select-none border-r border-border/10 mr-2 font-bold">+</span>
                        <span className="whitespace-pre-wrap flex-1 break-all py-0.5">{mod.value || " "}</span>
                      </div>
                    );
                  } else if (orig.type === "unchanged") {
                    return (
                      <div
                        key={`inline-unc-${idx}`}
                        className="flex items-stretch min-h-[22px] px-3"
                      >
                        <span className="w-8 shrink-0 text-muted-foreground/30 text-right pr-2 select-none border-r border-border/10 mr-2">{orig.lineNum}</span>
                        <span className="whitespace-pre-wrap flex-1 break-all py-0.5">{orig.value || " "}</span>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            )}
          </GlassCard>
        </div>
      )}
    </div>
  );
}
