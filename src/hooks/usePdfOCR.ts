"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useR2Upload } from "@/hooks/useR2Upload";

export function usePdfOCR() {
  const { uploadFileToR2, isUploading: isUploadingR2, uploadProgress: uploadProgressR2 } = useR2Upload();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");

  const selectFile = (selectedFile: File) => {
    setFile(selectedFile);
    setStatus("idle");
    setExtractedText(null);
    setErrorMessage(null);
    setProgress(0);
    setProgressLabel("");

    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
  };

  const processFile = async () => {
    if (!file) {
      toast.error("Please upload a PDF or image file first.");
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
        setProgressLabel("Extracting text via OCR...");
        res = await fetch("/api/tools/pdf-ocr", {
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
        setProgressLabel("Uploading & extracting text...");

        const formData = new FormData();
        formData.append("file", file);

        const ticker = setInterval(() => {
          setProgress((p) => Math.min(p + 3, 85));
        }, 800);

        res = await fetch("/api/tools/pdf-ocr", {
          method: "POST",
          body: formData,
        });

        clearInterval(ticker);
      }

      setProgress(90);
      setProgressLabel("Parsing response...");

      const body = await res.json();

      if (!res.ok) {
        throw new Error(body.error || "Failed to extract text from document.");
      }

      setExtractedText(body.data.parsedText);
      setProgress(100);
      setProgressLabel("Complete!");
      setStatus("success");
      toast.success("Text extracted successfully!");
    } catch (err: any) {
      console.error("[usePdfOCR] Error:", err);
      const msg = err.message || "An unexpected error occurred.";
      setErrorMessage(msg);
      setStatus("error");
      setProgress(0);
      setProgressLabel("");
      toast.error(msg);
    }
  };

  const copyToClipboard = () => {
    if (!extractedText) return;
    navigator.clipboard.writeText(extractedText);
    toast.success("Text copied to clipboard!");
  };

  const downloadText = () => {
    if (!extractedText) return;

    const blob = new Blob([extractedText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `extracted_${file?.name.split(".")[0] || "document"}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("TXT file downloaded successfully!");
  };

  const reset = () => {
    setFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setExtractedText(null);
    setStatus("idle");
    setErrorMessage(null);
    setProgress(0);
    setProgressLabel("");
  };

  return {
    file,
    previewUrl,
    extractedText,
    status,
    errorMessage,
    progress,
    progressLabel,
    isUploadingR2,
    uploadProgressR2,
    selectFile,
    processFile,
    copyToClipboard,
    downloadText,
    reset,
  };
}
export default usePdfOCR;
