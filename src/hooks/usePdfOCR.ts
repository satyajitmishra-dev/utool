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

  const selectFile = (selectedFile: File) => {
    setFile(selectedFile);
    setStatus("idle");
    setExtractedText(null);
    setErrorMessage(null);

    // Create local preview object URL (images can render directly, PDFs can display in iframe/pdfpreview)
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

        toast.loading("Extracting text using OCR.Space API...", { id: toastId });
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
        toast.loading("Uploading and extracting text using OCR.Space API...", { id: toastId });

        const formData = new FormData();
        formData.append("file", file);

        res = await fetch("/api/tools/pdf-ocr", {
          method: "POST",
          body: formData,
        });
      }

      const body = await res.json();

      if (!res.ok) {
        throw new Error(body.error || "Failed to extract text from document.");
      }

      setExtractedText(body.data.parsedText);
      setStatus("success");
      toast.success("Text extracted successfully!", { id: toastId });
    } catch (err: any) {
      console.error("[usePdfOCR] Error:", err);
      const msg = err.message || "An unexpected error occurred.";
      setErrorMessage(msg);
      setStatus("error");
      toast.error(msg, { id: toastId });
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
  };

  return {
    file,
    previewUrl,
    extractedText,
    status,
    errorMessage,
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
