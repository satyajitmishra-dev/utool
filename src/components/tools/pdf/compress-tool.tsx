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
    a.download = `toolzy-compressed-${file.name.replace(".pdf", "")}-${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
      {/* Coming Soon Glassmorphism Overlay */}
      <div className="absolute inset-0 z-10 backdrop-blur-[6px] bg-slate-50/10 rounded-3xl flex flex-col items-center justify-center p-8 text-center min-h-[380px] pointer-events-none">
        <div className="glass-card max-w-sm p-8 rounded-3xl border border-slate-200/80 bg-white/90 shadow-lg flex flex-col items-center gap-4 animate-scale-in pointer-events-auto">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-650 shadow-sm">
            <Minimize2 className="h-5.5 w-5.5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-md font-extrabold text-slate-800 tracking-tight">Compress PDF is Coming Soon</h3>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              We are calibrating the client-side parser to compress files, discard revisions, and strip metadata with zero server latency.
            </p>
          </div>
          <Link
            href="/pdf-tools"
            className="mt-2 inline-flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 text-xs font-bold text-white shadow shadow-indigo-100/50 hover:shadow-indigo-200/60 transition-all duration-200 hover:-translate-y-0.5"
          >
            Explore Active Tools
          </Link>
        </div>
      </div>

      {/* Underlying Tool UI (Blurred and Inert) */}
      <div className="opacity-40 pointer-events-none select-none filter blur-[1.5px] space-y-6">
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
                <div className="glass-card rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                  <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
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
                        className={`text-left p-4 rounded-2xl border transition-all ${
                          level === levelItem.id
                            ? "border-indigo-500 bg-indigo-50/10 text-indigo-900 shadow-sm"
                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 text-slate-700"
                        }`}
                      >
                        <span className="block text-xs font-bold">{levelItem.label}</span>
                        <span className="block text-4xs text-slate-500 mt-1 font-semibold leading-relaxed">
                          {levelItem.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Trigger Block */}
                <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                  <button
                    onClick={handleReset}
                    className="rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 px-5 py-3 text-xs font-bold text-slate-600 transition"
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

            <h3 className="text-lg font-bold text-slate-800">
              {wasReduced ? "Compression Successful!" : "Optimization Completed!"}
            </h3>

            {/* Size Comparison Card */}
            <div className="mt-6 glass-card px-6 py-4 rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-center gap-6 max-w-sm">
              <div className="text-left">
                <span className="block text-4xs text-slate-400 font-bold uppercase tracking-wider">Before</span>
                <span className="text-xs font-bold text-slate-500 font-mono">{formatSize(originalSize)}</span>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400" />
              <div className="text-left">
                <span className="block text-4xs text-indigo-400 font-bold uppercase tracking-wider">After</span>
                <span className="text-xs font-bold text-indigo-600 font-mono">{formatSize(compressedSize)}</span>
              </div>
              {wasReduced && (
                <div className="border-l border-slate-100 pl-4 py-1 flex flex-col items-center">
                  <span className="text-[10px] font-extrabold text-emerald-600">-{savingsPercent}%</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Saved</span>
                </div>
              )}
            </div>

            <p className="mt-4 text-xs text-slate-500 max-w-xs leading-relaxed">
              {wasReduced 
                ? "Your compressed document is ready for download."
                : "No further size reduction could be achieved. Unused structural components were cleaned up successfully."
              }
            </p>

            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <button
                onClick={handleReset}
                className="rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 px-5 py-3 text-xs font-bold text-slate-600 transition flex items-center gap-1.5"
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
        )}

        {/* 6. Processing Failed State (can reset) */}
        {processingState === "error" && (
          <div className="flex justify-center mt-4">
            <button
              onClick={handleReset}
              className="rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 px-5 py-3 text-xs font-bold text-slate-600 transition flex items-center gap-1.5"
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
