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

  const selectFile = (selectedFile: File) => {
    setFile(selectedFile);
    setStatus("idle");
    setProcessedBlob(null);
    setProcessedUrl(null);
    setErrorMessage(null);

    // Create local object URL for previewing original
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
    const toastId = toast.loading("Preparing files...");

    try {
      let res: Response;
      const threshold30Mb = 30 * 1024 * 1024;

      if (file.size > threshold30Mb) {
        // --- CLOUDFLARE R2 UPLOAD PATH ---
        toast.loading(`Uploading to private storage... 0%`, { id: toastId });

        const { fileKey } = await uploadFileToR2(file, (progress) => {
          toast.loading(`Uploading to private storage... ${progress}%`, { id: toastId });
        });

        toast.loading("Removing background via Clipdrop API...", { id: toastId });
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
        toast.loading("Uploading and removing background via Clipdrop API...", { id: toastId });

        const formData = new FormData();
        formData.append("file", file);

        res = await fetch("/api/tools/background-remover", {
          method: "POST",
          body: formData,
        });
      }

      if (!res.ok) {
        let errorMsg = "Failed to process background removal.";
        try {
          const body = await res.json();
          if (body.error) errorMsg = body.error;
        } catch {}
        throw new Error(errorMsg);
      }

      // Read response as binary blob (PNG)
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      setProcessedBlob(blob);
      setProcessedUrl(url);
      setStatus("success");
      toast.success("Background removed successfully!", { id: toastId });
    } catch (err: any) {
      console.error("[useBackgroundRemoval] Error:", err);
      const msg = err.message || "An unexpected error occurred.";
      setErrorMessage(msg);
      setStatus("error");
      toast.error(msg, { id: toastId });
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
  };

  return {
    file,
    previewUrl,
    processedUrl,
    processedBlob,
    status,
    errorMessage,
    isUploadingR2,
    uploadProgressR2,
    selectFile,
    processImage,
    downloadImage,
    reset,
  };
}
export default useBackgroundRemoval;
