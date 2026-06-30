"use client";

import React, { useState } from "react";
import { Copy, Download, Share2, Check, ArrowRight, Eye, Columns } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { TextEditor } from "./TextEditor";
import { toast } from "sonner";
import { copyToClipboard } from "@/lib/text/clipboard";
import { downloadTextFile, downloadCsvFile } from "@/lib/text/download";

interface TextResultProps {
  toolId: string;
  inputText: string;
  outputText: string;
  modificationsCount?: number;
  processingTimeMs?: number;
  wordWrap?: boolean;
}

export function TextResult({
  toolId,
  inputText,
  outputText,
  modificationsCount = 0,
  processingTimeMs = 0,
  wordWrap = true,
}: TextResultProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"after" | "before" | "side">("after");

  const handleCopy = async () => {
    const success = await copyToClipboard(outputText);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Output copied to clipboard!");
    }
  };

  const handleDownloadTxt = () => {
    downloadTextFile(outputText, `${toolId}-output.txt`);
    toast.success("Downloaded output as TXT file.");
  };

  const handleDownloadCsv = () => {
    // Generate CSV by splitting lines
    const lines = outputText.split("\n");
    downloadCsvFile(lines, ["Line Number", "Text Content"], `${toolId}-output.csv`);
    toast.success("Downloaded output as CSV file.");
  };

  const handleShare = () => {
    try {
      // Store settings in query parameters (excluding the text itself for security/privacy)
      const currentUrl = new URL(window.location.href);
      navigator.clipboard.writeText(currentUrl.toString());
      toast.success("Shareable URL copied! It saves your option settings locally.");
    } catch (e) {
      toast.error("Failed to generate share link.");
    }
  };

  // Check if CSV download is applicable (line-based tools)
  const isCsvApplicable = ["text-sorter", "remove-duplicate-lines", "line-counter"].includes(toolId);

  // Compute text modifications explanation text
  const getModificationsText = () => {
    if (modificationsCount === 0) return "No changes made";
    switch (toolId) {
      case "remove-duplicate-lines":
        return `${modificationsCount} duplicate lines removed`;
      case "text-sorter":
        return `${modificationsCount} duplicate lines removed while sorting`;
      case "find-and-replace":
        return `${modificationsCount} occurrences replaced`;
      default:
        return `${modificationsCount} changes executed`;
    }
  };

  return (
    <div className="space-y-4">
      {/* Top action header and before/after tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Comparison Tabs */}
        <div className="flex border border-border rounded-xl p-1 bg-muted/15 select-none text-xs">
          <button
            onClick={() => setActiveTab("after")}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-bold rounded-lg transition-all ${
              activeTab === "after" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Eye className="h-3.5 w-3.5" /> Output (After)
          </button>
          <button
            onClick={() => setActiveTab("before")}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-bold rounded-lg transition-all ${
              activeTab === "before" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Before
          </button>
          <button
            onClick={() => setActiveTab("side")}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-bold rounded-lg transition-all ${
              activeTab === "side" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Columns className="h-3.5 w-3.5" /> Side-by-Side
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            onClick={handleCopy}
            className="h-9 px-3 text-xs font-bold gap-1.5 rounded-xl border border-primary/20 hover:bg-primary/5 transition text-primary"
            title="Copy output text"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
            Copy
          </Button>

          <Button
            variant="outline"
            onClick={handleDownloadTxt}
            className="h-9 px-3 text-xs font-bold gap-1.5 rounded-xl transition hover:bg-muted"
            title="Download as text file (.txt)"
          >
            <Download className="h-4 w-4" />
            TXT
          </Button>

          {isCsvApplicable && (
            <Button
              variant="outline"
              onClick={handleDownloadCsv}
              className="h-9 px-3 text-xs font-bold gap-1.5 rounded-xl transition hover:bg-muted"
              title="Download as spreadsheet table (.csv)"
            >
              <Download className="h-4 w-4" />
              CSV
            </Button>
          )}

          <Button
            variant="outline"
            size="icon"
            onClick={handleShare}
            className="h-9 w-9 rounded-xl hover:bg-muted transition"
            title="Share settings link"
          >
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>

      {/* Render selected view content */}
      <div className="min-h-[350px] flex flex-col flex-1">
        {activeTab === "after" && (
          <TextEditor value={outputText} onChange={() => {}} readOnly={true} wordWrap={wordWrap} id="text-result-after" />
        )}
        {activeTab === "before" && (
          <TextEditor value={inputText} onChange={() => {}} readOnly={true} wordWrap={wordWrap} id="text-result-before" />
        )}
        {activeTab === "side" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-muted-foreground mb-1 select-none">ORIGINAL INPUT</span>
              <TextEditor value={inputText} onChange={() => {}} readOnly={true} wordWrap={wordWrap} id="text-result-side-before" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-muted-foreground mb-1 select-none">PROCESSED OUTPUT</span>
              <TextEditor value={outputText} onChange={() => {}} readOnly={true} wordWrap={wordWrap} id="text-result-side-after" />
            </div>
          </div>
        )}
      </div>

      {/* Results details info card */}
      <GlassCard className="p-3.5 border border-border/60 bg-muted/5 flex flex-wrap items-center justify-between gap-4 select-none text-xs" hover={false}>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-muted-foreground">Speed:</span>
          <span className="font-mono text-foreground bg-muted/80 px-2 py-0.5 rounded border border-border">
            {processingTimeMs.toFixed(1)} ms
          </span>
        </div>

        {modificationsCount > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-emerald-500 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
              {getModificationsText()}
            </span>
          </div>
        )}

        <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-semibold">
          <span>In: {inputText.length.toLocaleString()} ch</span>
          <ArrowRight className="h-3 w-3" />
          <span className="text-foreground">Out: {outputText.length.toLocaleString()} ch</span>
        </div>
      </GlassCard>
    </div>
  );
}
