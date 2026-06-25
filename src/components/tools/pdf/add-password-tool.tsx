"use client";

import React, { useState } from "react";
import { usePDFUpload } from "@/hooks/use-pdf-upload";
import { useToolLimit } from "@/hooks/use-tool-limit";
import { UploadZone } from "./upload-zone";
import { PDFPreview } from "./pdf-preview";
import { CheckCircle2, RotateCcw, Lock, ShieldCheck, Eye, EyeOff, Download } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { addPasswordToPDF } from "@/services/pdf.service";
import { ProgressBar } from "./progress-bar";
import { motion } from "framer-motion";

export function AddPasswordTool() {
  const { limitStatus, loading: limitLoading, checkLimit, recordUsage } = useToolLimit();
  const {
    files,
    error: uploadError,
    isDragActive,
    isParsing,
    addFiles,
    clearFiles,
    dragHandlers,
  } = usePDFUpload({ tier: limitStatus.tier, allowMultiple: false, rejectEncrypted: true });

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [processingState, setProcessingState] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [processingProgress, setProcessingProgress] = useState(0);
  const [downloadBytes, setDownloadBytes] = useState<Uint8Array | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const file = files[0];

  const handleProtect = async () => {
    if (!file) return;

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
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
    const toastId = toast.info("Encrypting your PDF...");

    try {
      const encryptedPdfBytes = await addPasswordToPDF(
        file.file,
        password,
        (progress) => setProcessingProgress(progress)
      );

      setDownloadBytes(encryptedPdfBytes);
      setProcessingState("success");

      toast.dismiss(toastId);
      toast.success("Your PDF has been secured.");

      await recordUsage("pdf-add-password", "success");
    } catch (err) {
      console.error("PDF Encryption failure:", err);
      const errMsg = err instanceof Error ? err.message : "An error occurred during encryption.";
      setGeneralError(errMsg);
      setProcessingState("error");

      toast.dismiss(toastId);
      toast.error(errMsg);

      await recordUsage("pdf-add-password", "failed", errMsg);
    }
  };

  const handleDownload = () => {
    if (!downloadBytes || !file) return;
    toast.success("Your secured file is ready to download.");
    const blob = new Blob([downloadBytes as unknown as BlobPart], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `utool-protected-${file.name.replace(".pdf", "")}-${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    clearFiles();
    setPassword("");
    setConfirmPassword("");
    setProcessingState("idle");
    setProcessingProgress(0);
    setDownloadBytes(null);
    setGeneralError(null);
  };

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
                  <div className="flex justify-between items-center border-b border-border pb-3">
                    <h4 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                      <ShieldCheck className="h-4.5 w-4.5 text-indigo-500" />
                      Secure Document
                    </h4>
                    <Badge variant="pro" className="flex items-center gap-1 bg-emerald-50 text-emerald-600 border border-emerald-200">
                      <Lock className="h-3 w-3" />
                      AES-256 Ready
                    </Badge>
                  </div>

                  <div className="space-y-4 max-w-sm">
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter a strong password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="block w-full rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold focus:border-indigo-500 focus:outline-none transition pr-10"
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                        </button>
                      </div>
                      <p className="text-4xs text-muted-foreground mt-1 font-semibold">Minimum 6 characters</p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                        Confirm Password
                      </label>
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Repeat password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="block w-full rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold focus:border-indigo-500 focus:outline-none transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Trigger Block */}
                <div className="flex justify-end gap-3 border-t border-border pt-5">
                  <button
                    onClick={handleReset}
                    className="rounded-2xl border border-border bg-card hover:bg-muted px-5 py-3 text-xs font-bold text-foreground transition"
                  >
                    Clear File
                  </button>
                  <button
                    onClick={handleProtect}
                    disabled={limitStatus.isLimited || !password || !confirmPassword}
                    className="rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 shadow shadow-indigo-200/50 px-6 py-3 text-xs font-bold text-white transition flex items-center gap-2"
                  >
                    <Lock className="h-4.5 w-4.5" />
                    Protect PDF
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Processing State */}
        {processingState === "processing" && (
          <ProgressBar progress={processingProgress} statusMessage="Encrypting document with AES-256..." />
        )}

        {/* Success State */}
        {processingState === "success" && file && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card border border-emerald-100 bg-emerald-50/10 rounded-3xl p-8 text-center flex flex-col items-center justify-center min-h-[280px]"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 mb-5">
              <ShieldCheck className="h-6 w-6" />
            </div>

            <h3 className="text-lg font-bold text-foreground">
              Document Secured Successfully!
            </h3>

            <p className="mt-4 text-xs text-muted-foreground max-w-xs leading-relaxed">
              Your PDF has been encrypted with military-grade AES-256 protection. The password will be required to open it.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <button
                onClick={handleReset}
                className="rounded-2xl border border-border bg-card hover:bg-muted px-5 py-3 text-xs font-bold text-foreground transition flex items-center gap-1.5"
              >
                <RotateCcw className="h-4 w-4" />
                Protect Another File
              </button>
              <button
                onClick={handleDownload}
                className="rounded-2xl bg-emerald-600 hover:bg-emerald-500 shadow shadow-emerald-100/50 px-6 py-3 text-xs font-bold text-white transition flex items-center gap-1.5"
              >
                <Download className="h-4 w-4" />
                Download Secured PDF
              </button>
            </div>
          </motion.div>
        )}

        {/* Processing Failed State */}
        {processingState === "error" && (
          <div className="flex justify-center mt-4">
            <button
              onClick={handleReset}
              className="rounded-2xl border border-border bg-card hover:bg-muted px-5 py-3 text-xs font-bold text-foreground transition flex items-center gap-1.5"
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
