"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePDFUpload } from "@/hooks/use-pdf-upload";
import { useToolLimit } from "@/hooks/use-tool-limit";
import { splitPDF } from "@/services/pdf.service";
import { UploadZone } from "./upload-zone";
import { PDFPreview } from "./pdf-preview";
import { ProgressBar } from "./progress-bar";
import { AlertCircle, CheckCircle2, FileText, Download, RotateCcw, Lock, Plus, Trash2, Scissors } from "lucide-react";
import { motion } from "framer-motion";
import { PageRange } from "@/types/pdf";
import { toast } from "sonner";

export function SplitTool() {
  const { limitStatus, loading: limitLoading, checkLimit, recordUsage } = useToolLimit();
  const {
    files,
    error: uploadError,
    setError,
    isDragActive,
    isParsing,
    addFiles,
    clearFiles,
    dragHandlers,
  } = usePDFUpload({ tier: limitStatus.tier, allowMultiple: false });

  const [ranges, setRanges] = useState<PageRange[]>([{ start: 1, end: 1 }]);
  const [processingState, setProcessingState] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [processingProgress, setProcessingProgress] = useState(0);
  const [downloadBytes, setDownloadBytes] = useState<Uint8Array | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const file = files[0];

  const handleAddRange = () => {
    if (!file) return;
    setRanges((prev) => [...prev, { start: 1, end: file.pageCount }]);
  };

  const handleRemoveRange = (idx: number) => {
    setRanges((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleRangeChange = (idx: number, field: "start" | "end", val: number) => {
    if (!file) return;
    // Bound check
    const boundedVal = Math.min(file.pageCount, Math.max(1, isNaN(val) ? 1 : val));
    setRanges((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, [field]: boundedVal } : r))
    );
  };

  const handleSplit = async () => {
    if (!file) return;

    // Validate ranges
    for (let i = 0; i < ranges.length; i++) {
      const r = ranges[i];
      if (r.start > r.end) {
        toast.error(`Validation Error (Range ${i + 1}): Start page cannot be greater than end page.`);
        return;
      }
    }

    setGeneralError(null);
    setProcessingProgress(0);

    const isAllowed = await checkLimit();
    if (!isAllowed) {
      toast.error("You’ve reached today’s free limit.");
      return;
    }

    setProcessingState("processing");
    const toastId = toast.info("Preparing your split file...");

    try {
      const splitPdfBytes = await splitPDF(
        file.file,
        ranges,
        (progress) => setProcessingProgress(progress)
      );

      setDownloadBytes(splitPdfBytes);
      setProcessingState("success");

      toast.dismiss(toastId);
      toast.success("Your PDF is ready.");

      await recordUsage("pdf-split", "success");
    } catch (err) {
      console.error("PDF Split failure:", err);
      const errMsg = err instanceof Error ? err.message : "An error occurred while splitting the file.";
      setGeneralError(errMsg);
      setProcessingState("error");

      toast.dismiss(toastId);
      toast.error(errMsg);

      await recordUsage("pdf-split", "failed", errMsg);
    }
  };

  const handleDownload = () => {
    if (!downloadBytes || !file) return;
    toast.success("Your file is ready to download.");
    const blob = new Blob([downloadBytes as unknown as BlobPart], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `utool-split-${file.name.replace(".pdf", "")}-${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    window.dispatchEvent(new CustomEvent("tool-success", { detail: { toolSlug: "split-pdf" } }));
  };

  const handleReset = () => {
    clearFiles();
    setRanges([{ start: 1, end: 1 }]);
    setProcessingState("idle");
    setProcessingProgress(0);
    setDownloadBytes(null);
    setGeneralError(null);
  };

  const activeError = uploadError || generalError;

  return (
    <div className="relative">
      {/* Main Tool UI */}
      <div className="space-y-6">
        {/* 1. Daily Quota Warning Alert */}
        {limitStatus.isLimited && !limitLoading && (
          <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-4 flex gap-3 text-sm text-rose-800">
            <Lock className="h-5 w-5 text-rose-500 flex-shrink-0" />
            <div>
              <h4 className="font-bold">Daily Action Limit Exceeded</h4>
              <p className="mt-0.5 text-xs text-rose-600 leading-relaxed">
                Free accounts are restricted to 3 actions per day. Please upgrade to Pro for unlimited operations or check back tomorrow (limit resets daily).
              </p>
            </div>
          </div>
        )}

        {/* 2. Main Workstation Panel */}
        {processingState === "idle" && (
          <div className="space-y-6">
            {!file ? (
              <UploadZone
                isDragActive={isDragActive}
                isParsing={isParsing}
                dragHandlers={dragHandlers}
                onFileSelect={addFiles}
                maxSizeLabel={limitStatus.tier === "pro" || limitStatus.tier === "enterprise" ? "200MB" : "50MB"}
                allowMultiple={false}
              />
            ) : (
              <div className="space-y-6">
                <PDFPreview files={files} onRemove={handleReset} />

                {/* Page Range Customizer panel */}
                <div className="glass-card rounded-3xl p-6 border border-border shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-border pb-3">
                    <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">
                      Select Page Ranges to Extract
                    </h4>
                    <span className="text-xs text-muted-foreground font-semibold">
                      Document has {file.pageCount} {file.pageCount === 1 ? "page" : "pages"}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {ranges.map((range, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="flex-1 grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-4xs font-bold text-muted-foreground uppercase tracking-wider">
                              Start Page
                            </label>
                            <input
                              type="number"
                              min={1}
                              max={file.pageCount}
                              value={range.start}
                              onChange={(e) =>
                                handleRangeChange(idx, "start", parseInt(e.target.value))
                              }
                              className="block w-full rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold focus:border-indigo-500 focus:outline-none transition"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-4xs font-bold text-muted-foreground uppercase tracking-wider">
                              End Page
                            </label>
                            <input
                              type="number"
                              min={1}
                              max={file.pageCount}
                              value={range.end}
                              onChange={(e) =>
                                handleRangeChange(idx, "end", parseInt(e.target.value))
                              }
                              className="block w-full rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold focus:border-indigo-500 focus:outline-none transition"
                            />
                          </div>
                        </div>

                        {ranges.length > 1 && (
                          <button
                            onClick={() => handleRemoveRange(idx)}
                            className="mt-5 p-2 rounded-xl text-muted-foreground hover:text-rose-600 hover:bg-rose-50/50 transition-colors"
                            title="Remove range block"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleAddRange}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-500 transition-colors mt-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Another Range
                  </button>
                </div>

                {/* Action Trigger Block */}
                <div className="flex justify-end gap-3 border-t border-border pt-5">
                  <button
                    onClick={handleReset}
                    className="rounded-2xl border border-border bg-card hover:bg-muted px-5 py-3 text-xs font-bold text-muted-foreground transition"
                  >
                    Clear File
                  </button>
                  <button
                    onClick={handleSplit}
                    disabled={limitStatus.isLimited}
                    className="rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 shadow shadow-indigo-200/50 px-6 py-3 text-xs font-bold text-white transition flex items-center gap-2"
                  >
                    <FileText className="h-4.5 w-4.5" />
                    Extract & Split PDF
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. Processing State */}
        {processingState === "processing" && (
          <ProgressBar progress={processingProgress} statusMessage="Extracting selected pages..." />
        )}

        {/* 4. Success State */}
        {processingState === "success" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card border border-emerald-100 bg-emerald-50/10 rounded-3xl p-8 text-center flex flex-col items-center justify-center min-h-[280px]"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 mb-5">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Split Action Completed!</h3>
            <p className="mt-2 text-xs text-muted-foreground max-w-sm leading-relaxed">
              Successfully extracted your selected page sequence from the source document.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <button
                onClick={handleReset}
                className="rounded-2xl border border-border bg-card hover:bg-muted px-5 py-3 text-xs font-bold text-muted-foreground transition flex items-center gap-1.5"
              >
                <RotateCcw className="h-4 w-4" />
                Split Another File
              </button>
              <button
                onClick={handleDownload}
                className="rounded-2xl bg-emerald-600 hover:bg-emerald-500 shadow shadow-emerald-100/50 px-6 py-3 text-xs font-bold text-white transition flex items-center gap-1.5"
              >
                <Download className="h-4 w-4" />
                Download Split PDF
              </button>
            </div>
          </motion.div>
        )}

        {/* 6. Processing Failed State (can reset) */}
        {processingState === "error" && (
          <div className="flex justify-center mt-4">
            <button
              onClick={handleReset}
              className="rounded-2xl border border-border bg-card hover:bg-muted px-5 py-3 text-xs font-bold text-muted-foreground transition flex items-center gap-1.5"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Workspace
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
