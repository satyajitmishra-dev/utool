"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePDFUpload } from "@/hooks/use-pdf-upload";
import { useToolLimit } from "@/hooks/use-tool-limit";
import { compressPDF } from "@/services/pdf.service";
import { UploadZone } from "./upload-zone";
import { PDFPreview } from "./pdf-preview";
import { ProgressBar } from "./progress-bar";
import { AlertCircle, CheckCircle2, FileText, Download, RotateCcw, Lock, Percent, ArrowRight, Minimize2 } from "lucide-react";
import { motion } from "framer-motion";
import { CompressionLevel } from "@/types/pdf";
import { toast } from "sonner";
import { ToolChaining } from "@/components/tools/ToolChaining";

export function CompressTool() {
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

  const [level, setLevel] = useState<CompressionLevel>("medium");
  const [processingState, setProcessingState] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [processingProgress, setProcessingProgress] = useState(0);
  const [downloadBytes, setDownloadBytes] = useState<Uint8Array | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const file = files[0];

  const handleCompress = async () => {
    if (!file) return;

    setGeneralError(null);
    setProcessingProgress(0);

    const isAllowed = await checkLimit();
    if (!isAllowed) {
      toast.error("You’ve reached today’s free limit.");
      return;
    }

    setProcessingState("processing");
    const toastId = toast.info("Optimizing your PDF...");

    try {
      const compressedPdfBytes = await compressPDF(
        file.file,
        level,
        (progress) => setProcessingProgress(progress)
      );

      setDownloadBytes(compressedPdfBytes);
      setProcessingState("success");

      toast.dismiss(toastId);
      toast.success("Your PDF is ready.");

      await recordUsage("pdf-compress", "success");
    } catch (err) {
      console.error("PDF Compression failure:", err);
      const errMsg = err instanceof Error ? err.message : "An error occurred during file compression.";
      setGeneralError(errMsg);
      setProcessingState("error");

      toast.dismiss(toastId);
      toast.error(errMsg);

      await recordUsage("pdf-compress", "failed", errMsg);
    }
  };

  const handleDownload = () => {
    if (!downloadBytes || !file) return;
    toast.success("Your file is ready to download.");
    const blob = new Blob([downloadBytes as unknown as BlobPart], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `utool-compressed-${file.name.replace(".pdf", "")}-${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    window.dispatchEvent(new CustomEvent("tool-success", { detail: { toolSlug: "compress-pdf" } }));
  };

  const handleReset = () => {
    clearFiles();
    setLevel("medium");
    setProcessingState("idle");
    setProcessingProgress(0);
    setDownloadBytes(null);
    setGeneralError(null);
  };

  const formatSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const activeError = uploadError || generalError;

  // Calculate compression statistics
  const originalSize = file ? file.size : 0;
  const compressedSize = downloadBytes ? downloadBytes.length : 0;
  const savingsBytes = originalSize - compressedSize;
  const savingsPercent = originalSize > 0 ? ((savingsBytes / originalSize) * 100).toFixed(0) : "0";
  const wasReduced = savingsBytes > 0;

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

                {/* Compression Configuration Card */}
                <div className="glass-card rounded-3xl p-6 border border-border shadow-sm space-y-4">
                  <h4 className="text-sm font-bold text-foreground uppercase tracking-wider border-b border-border pb-3">
                    Select Compression Level
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      {
                        id: "low",
                        label: "Low Compression",
                        desc: "Maximum visual quality, minimal file size reduction.",
                      },
                      {
                        id: "medium",
                        label: "Medium Compression",
                        desc: "Balanced output quality and file size reduction.",
                      },
                      {
                        id: "high",
                        label: "High Compression",
                        desc: "Maximum file size reduction, slight quality compromises.",
                      },
                    ].map((levelItem) => (
                      <button
                        key={levelItem.id}
                        type="button"
                        onClick={() => setLevel(levelItem.id as CompressionLevel)}
                        className={`text-left p-4 rounded-2xl border transition-all ${level === levelItem.id
                            ? "border-indigo-500 bg-indigo-50/10 text-primary-foreground shadow-sm"
                            : "border-border hover:border-primary hover:bg-muted text-foreground"
                          }`}
                      >
                        <span className="block text-xs font-bold">{levelItem.label}</span>
                        <span className="block text-4xs text-muted-foreground mt-1 font-semibold leading-relaxed">
                          {levelItem.desc}
                        </span>
                      </button>
                    ))}
                  </div>
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
                    onClick={handleCompress}
                    disabled={limitStatus.isLimited}
                    className="rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 shadow shadow-indigo-200/50 px-6 py-3 text-xs font-bold text-white transition flex items-center gap-2"
                  >
                    <FileText className="h-4.5 w-4.5" />
                    Compress PDF File
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. Processing State */}
        {processingState === "processing" && (
          <ProgressBar progress={processingProgress} statusMessage="Compressing document object streams..." />
        )}

        {/* 4. Success State */}
        {processingState === "success" && file && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card border border-emerald-100 bg-emerald-50/10 rounded-3xl p-8 text-center flex flex-col items-center justify-center min-h-[280px]"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 mb-5">
                {wasReduced ? (
                  <Percent className="h-6 w-6" />
                ) : (
                  <CheckCircle2 className="h-6 w-6" />
                )}
              </div>

              <h3 className="text-lg font-bold text-foreground">
                {wasReduced ? "Compression Successful!" : "Optimization Completed!"}
              </h3>

              {/* Size Comparison Card */}
              <div className="mt-6 glass-card px-6 py-4 rounded-2xl border border-border shadow-sm flex items-center justify-center gap-6 max-w-sm">
                <div className="text-left">
                  <span className="block text-4xs text-muted-foreground font-bold uppercase tracking-wider">Before</span>
                  <span className="text-xs font-bold text-muted-foreground font-mono">{formatSize(originalSize)}</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <div className="text-left">
                  <span className="block text-4xs text-indigo-400 font-bold uppercase tracking-wider">After</span>
                  <span className="text-xs font-bold text-indigo-600 font-mono">{formatSize(compressedSize)}</span>
                </div>
                {wasReduced && (
                  <div className="border-l border-border pl-4 py-1 flex flex-col items-center">
                    <span className="text-[10px] font-extrabold text-emerald-600">-{savingsPercent}%</span>
                    <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Saved</span>
                  </div>
                )}
              </div>

              <p className="mt-4 text-xs text-muted-foreground max-w-xs leading-relaxed">
                {wasReduced
                  ? "Your compressed document is ready for download."
                  : "No further size reduction could be achieved. Unused structural components were cleaned up successfully."
                }
              </p>

              <div className="mt-8 flex flex-wrap gap-3 justify-center">
                <button
                  onClick={handleReset}
                  className="rounded-2xl border border-border bg-card hover:bg-muted px-5 py-3 text-xs font-bold text-muted-foreground transition flex items-center gap-1.5"
                >
                  <RotateCcw className="h-4 w-4" />
                  Compress Another File
                </button>
                <button
                  onClick={handleDownload}
                  className="rounded-2xl bg-emerald-600 hover:bg-emerald-500 shadow shadow-emerald-100/50 px-6 py-3 text-xs font-bold text-white transition flex items-center gap-1.5"
                >
                  <Download className="h-4 w-4" />
                  Download Compressed PDF
                </button>
              </div>
            </motion.div>
            <ToolChaining
              currentToolId="pdf-compress"
              fileBytes={downloadBytes}
              fileName={`utool-compressed-${file.name}`}
            />
          </>
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
