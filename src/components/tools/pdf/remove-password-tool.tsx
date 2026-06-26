"use client";

import React, { useState } from "react";
import { usePDFUpload } from "@/hooks/use-pdf-upload";
import { useToolLimit } from "@/hooks/use-tool-limit";
import { removePasswordFromPDF } from "@/services/pdf.service";
import { UploadZone } from "./upload-zone";
import { PDFPreview } from "./pdf-preview";
import { ProgressBar } from "./progress-bar";
import { CheckCircle2, FileText, Download, RotateCcw, Lock, Unlock } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export function RemovePasswordTool() {
  const { limitStatus, loading: limitLoading, checkLimit, recordUsage } = useToolLimit();
  const {
    files,
    error: uploadError,
    isDragActive,
    isParsing,
    addFiles,
    clearFiles,
    dragHandlers,
  } = usePDFUpload({ tier: limitStatus.tier, allowMultiple: false, requiresEncryption: true });

  const [password, setPassword] = useState("");
  const [processingState, setProcessingState] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [processingProgress, setProcessingProgress] = useState(0);
  const [downloadBytes, setDownloadBytes] = useState<Uint8Array | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const file = files[0];

  const handleUnlock = async () => {
    if (!file) return;

    if (!password) {
      toast.error("Please enter a password to unlock.");
      return;
    }

    setGeneralError(null);
    setProcessingProgress(0);

    const isAllowed = await checkLimit();
    if (!isAllowed) {
      toast.error("You’ve reached today’s free limit.");
      return;
    }

    setProcessingState("processing");
    const toastId = toast.info("Removing password...");

    try {
      const unlockedPdfBytes = await removePasswordFromPDF(
        file.file,
        password,
        (progress) => setProcessingProgress(progress)
      );

      setDownloadBytes(unlockedPdfBytes);
      setProcessingState("success");

      toast.dismiss(toastId);
      toast.success("PDF unlocked successfully.");

      await recordUsage("pdf-remove-password", "success");
    } catch (err) {
      console.error("PDF Unlock failure:", err);
      const errMsg = err instanceof Error ? err.message : "An error occurred during unlocking.";
      setGeneralError(errMsg);
      setProcessingState("error");

      toast.dismiss(toastId);
      toast.error(errMsg);

      await recordUsage("pdf-remove-password", "failed", errMsg);
    }
  };

  const handleDownload = () => {
    if (!downloadBytes || !file) return;
    toast.success("Your file is ready to download.");
    const blob = new Blob([downloadBytes as unknown as BlobPart], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `utool-unlocked-${file.name.replace(".pdf", "")}-${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    window.dispatchEvent(new CustomEvent("tool-success", { detail: { toolSlug: "unlock-pdf" } }));
  };

  const handleReset = () => {
    clearFiles();
    setPassword("");
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
        {/* Daily Quota Warning Alert */}
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

        {/* Main Workstation Panel */}
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

                {/* Password Configuration Card */}
                <div className="glass-card rounded-3xl p-6 border border-border shadow-sm space-y-4">
                  <h4 className="text-sm font-bold text-foreground uppercase tracking-wider border-b border-border pb-3">
                    Unlock PDF
                  </h4>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        placeholder="Enter the document password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full max-w-sm rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold focus:border-indigo-500 focus:outline-none transition"
                      />
                    </div>
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
                    onClick={handleUnlock}
                    disabled={limitStatus.isLimited || !password}
                    className="rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 shadow shadow-indigo-200/50 px-6 py-3 text-xs font-bold text-white transition flex items-center gap-2"
                  >
                    <Unlock className="h-4.5 w-4.5" />
                    Unlock PDF
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Processing State */}
        {processingState === "processing" && (
          <ProgressBar progress={processingProgress} statusMessage="Decrypting and removing protection..." />
        )}

        {/* Success State */}
        {processingState === "success" && file && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card border border-emerald-100 bg-emerald-50/10 rounded-3xl p-8 text-center flex flex-col items-center justify-center min-h-[280px]"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 mb-5">
              <Unlock className="h-6 w-6" />
            </div>

            <h3 className="text-lg font-bold text-foreground">
              PDF Unlocked Successfully!
            </h3>

            <p className="mt-4 text-xs text-muted-foreground max-w-xs leading-relaxed">
              The password protection has been removed. Your clean, unlocked document is ready for download.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <button
                onClick={handleReset}
                className="rounded-2xl border border-border bg-card hover:bg-muted px-5 py-3 text-xs font-bold text-muted-foreground transition flex items-center gap-1.5"
              >
                <RotateCcw className="h-4 w-4" />
                Unlock Another File
              </button>
              <button
                onClick={handleDownload}
                className="rounded-2xl bg-emerald-600 hover:bg-emerald-500 shadow shadow-emerald-100/50 px-6 py-3 text-xs font-bold text-white transition flex items-center gap-1.5"
              >
                <Download className="h-4 w-4" />
                Download Unlocked PDF
              </button>
            </div>
          </motion.div>
        )}

        {/* Processing Failed State */}
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
