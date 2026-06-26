"use client";

import React, { useState } from "react";
import { usePDFUpload } from "@/hooks/use-pdf-upload";
import { useToolLimit } from "@/hooks/use-tool-limit";
import { mergePDFs } from "@/services/pdf.service";
import { UploadZone } from "./upload-zone";
import { PDFPreview } from "./pdf-preview";
import { ProgressBar } from "./progress-bar";
import { AlertCircle, CheckCircle2, FileText, Download, RotateCcw, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export function MergeTool() {
  const { limitStatus, loading: limitLoading, checkLimit, recordUsage } = useToolLimit();
  const {
    files,
    setFiles,
    error: uploadError,
    setError,
    isDragActive,
    isParsing,
    addFiles,
    removeFile,
    clearFiles,
    dragHandlers,
  } = usePDFUpload({ tier: limitStatus.tier, allowMultiple: true });

  const [processingState, setProcessingState] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [processingProgress, setProcessingProgress] = useState(0);
  const [downloadBytes, setDownloadBytes] = useState<Uint8Array | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleMerge = async () => {
    if (files.length < 2) {
      toast.error("Please upload at least 2 PDF documents to merge.");
      return;
    }

    setGeneralError(null);
    setProcessingProgress(0);

    // Double-check limit before starting action
    const isAllowed = await checkLimit();
    if (!isAllowed) {
      toast.error("You’ve reached today’s free limit.");
      return;
    }

    setProcessingState("processing");
    const toastId = toast.info("Merging your files...");

    try {
      const mergedPdfBytes = await mergePDFs(
        files.map((f) => f.file),
        (progress) => {
          setProcessingProgress(progress);
        }
      );

      setDownloadBytes(mergedPdfBytes);
      setProcessingState("success");

      toast.dismiss(toastId);
      toast.success("Your PDF is ready.");

      // Log successful transaction
      await recordUsage("pdf-merge", "success");
    } catch (err) {
      console.error("PDF Merge failure:", err);
      const errMsg = err instanceof Error ? err.message : "An error occurred during file merging.";
      setGeneralError(errMsg);
      setProcessingState("error");

      toast.dismiss(toastId);
      toast.error(errMsg);

      // Log failure
      await recordUsage("pdf-merge", "failed", errMsg);
    }
  };

  const handleDownload = () => {
    if (!downloadBytes) return;
    toast.success("Your file is ready to download.");
    const blob = new Blob([downloadBytes as unknown as BlobPart], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `utool-merged-${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    window.dispatchEvent(new CustomEvent("tool-success", { detail: { toolSlug: "merge-pdf" } }));
  };

  const handleReset = () => {
    clearFiles();
    setProcessingState("idle");
    setProcessingProgress(0);
    setDownloadBytes(null);
    setGeneralError(null);
  };

  const activeError = uploadError || generalError;

  return (
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
          <UploadZone
            isDragActive={isDragActive}
            isParsing={isParsing}
            dragHandlers={dragHandlers}
            onFileSelect={addFiles}
            maxSizeLabel={limitStatus.tier === "pro" || limitStatus.tier === "enterprise" ? "200MB" : "50MB"}
            allowMultiple={true}
          />

          {/* Active upload list */}
          {files.length > 0 && (
            <div className="space-y-6">
              <PDFPreview files={files} onRemove={removeFile} onReorder={setFiles} />

              {/* Action trigger button */}
              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  onClick={clearFiles}
                  className="rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 px-5 py-3 text-xs font-bold text-slate-600 transition"
                >
                  Clear All
                </button>
                <button
                  onClick={handleMerge}
                  disabled={files.length < 2 || limitStatus.isLimited}
                  className="rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 shadow shadow-indigo-200/50 px-6 py-3 text-xs font-bold text-white transition flex items-center gap-2"
                >
                  <FileText className="h-4.5 w-4.5" />
                  Merge PDF Documents
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Processing State */}
      {processingState === "processing" && (
        <ProgressBar progress={processingProgress} statusMessage="Assembling document catalog pages..." />
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
          <h3 className="text-lg font-bold text-slate-800">Merge Completed!</h3>
          <p className="mt-2 text-xs text-slate-500 max-w-sm leading-relaxed">
            Your files were successfully compiled into a single document entirely within your browser.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <button
              onClick={handleReset}
              className="rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 px-5 py-3 text-xs font-bold text-slate-600 transition flex items-center gap-1.5"
            >
              <RotateCcw className="h-4 w-4" />
              Merge More Files
            </button>
            <button
              onClick={handleDownload}
              className="rounded-2xl bg-emerald-600 hover:bg-emerald-500 shadow shadow-emerald-100/50 px-6 py-3 text-xs font-bold text-white transition flex items-center gap-1.5"
            >
              <Download className="h-4 w-4" />
              Download Merged PDF
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
  );
}
