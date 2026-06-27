"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useR2Upload } from "@/hooks/useR2Upload";

export function useBackgroundRemoval() {
  const { uploadFileToR2, isUploading: isUploadingR2, uploadProgress: uploadProgressR2 } = useR2Upload();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");

  const selectFile = (selectedFile: File) => {
    setFile(selectedFile);
    setStatus("idle");
    setProcessedBlob(null);
    setProcessedUrl(null);
    setErrorMessage(null);
    setProgress(0);
    setProgressLabel("");

    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
  };

  const processImage = async () => {
    if (!file) {
      toast.error("Please upload an image first.");
      return;
    }

    setStatus("processing");
    setErrorMessage(null);
    setProgress(0);
    setProgressLabel("Preparing files...");

    try {
      let res: Response;
      const threshold30Mb = 30 * 1024 * 1024;

      if (file.size > threshold30Mb) {
        // --- CLOUDFLARE R2 UPLOAD PATH ---
        setProgressLabel("Uploading to storage...");

        const { fileKey } = await uploadFileToR2(file, (uploadProgress) => {
          setProgress(Math.round(uploadProgress * 0.7));
          setProgressLabel("Uploading to storage...");
        });

        setProgress(75);
        setProgressLabel("Removing background...");
        res = await fetch("/api/tools/background-remover", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileKey,
            filename: file.name,
            mimeType: file.type,
          }),
        });
      } else {
        // --- STANDARD DIRECT MULTIPART FLOW ---
        setProgress(15);
        setProgressLabel("Removing background...");

        const formData = new FormData();
        formData.append("file", file);

        const ticker = setInterval(() => {
          setProgress((p) => Math.min(p + 3, 85));
        }, 800);

        res = await fetch("/api/tools/background-remover", {
          method: "POST",
          body: formData,
        });

        clearInterval(ticker);
      }

      setProgress(90);
      setProgressLabel("Rendering result...");

      if (!res.ok) {
        let errorMsg = "Failed to process background removal.";
        try {
          const body = await res.json();
          if (body.error) errorMsg = body.error;
        } catch {}
        throw new Error(errorMsg);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      setProcessedBlob(blob);
      setProcessedUrl(url);
      setProgress(100);
      setProgressLabel("Complete!");
      setStatus("success");
      toast.success("Background removed successfully!");
    } catch (err: any) {
      console.error("[useBackgroundRemoval] Error:", err);
      const msg = err.message || "An unexpected error occurred.";
      setErrorMessage(msg);
      setStatus("error");
      setProgress(0);
      setProgressLabel("");
      toast.error(msg);
    }
  };

  const downloadImage = () => {
    if (!processedUrl) return;

    const link = document.createElement("a");
    link.href = processedUrl;
    link.download = `no-bg_${file?.name.split(".")[0] || "image"}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Transparent PNG downloaded successfully!");
  };

  const reset = () => {
    setFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (processedUrl) {
      URL.revokeObjectURL(processedUrl);
      setProcessedUrl(null);
    }
    setProcessedBlob(null);
    setStatus("idle");
    setErrorMessage(null);
    setProgress(0);
    setProgressLabel("");
  };

  return {
    file,
    previewUrl,
    processedUrl,
    processedBlob,
    status,
    errorMessage,
    progress,
    progressLabel,
    isUploadingR2,
    uploadProgressR2,
    selectFile,
    processImage,
    downloadImage,
    reset,
  };
}
export default useBackgroundRemoval;
