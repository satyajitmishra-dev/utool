"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ImageResizerResponse } from "@/types/api";
import { useR2Upload } from "@/hooks/useR2Upload";

export interface ResizerOptions {
  width: number;
  height: number;
  cropMode: "fill" | "fit" | "scale" | "crop" | "thumb";
  quality: number;
  format: "jpg" | "png" | "webp" | "gif";
}

export function useImageResizer() {
  const { uploadFileToR2, isUploading: isUploadingR2, uploadProgress: uploadProgressR2 } = useR2Upload();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [options, setOptions] = useState<ResizerOptions>({
    width: 800,
    height: 600,
    cropMode: "fill",
    quality: 80,
    format: "webp",
  });
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [result, setResult] = useState<ImageResizerResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");

  const selectFile = (selectedFile: File) => {
    setFile(selectedFile);
    setStatus("idle");
    setResult(null);
    setErrorMessage(null);
    setProgress(0);
    setProgressLabel("");

    // Create preview
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);

    // Try to extract original dimensions
    const img = new Image();
    img.onload = () => {
      setOptions((prev) => ({
        ...prev,
        width: img.width,
        height: img.height,
      }));
    };
    img.src = url;
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
        setProgressLabel("Resizing image...");
        res = await fetch("/api/tools/image-resizer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileKey,
            filename: file.name,
            mimeType: file.type,
            width: options.width,
            height: options.height,
            cropMode: options.cropMode,
            quality: options.quality,
            format: options.format,
          }),
        });
      } else {
        // --- STANDARD DIRECT MULTIPART FLOW ---
        setProgress(15);
        setProgressLabel("Resizing image...");

        const formData = new FormData();
        formData.append("file", file);
        formData.append("width", options.width.toString());
        formData.append("height", options.height.toString());
        formData.append("cropMode", options.cropMode);
        formData.append("quality", options.quality.toString());
        formData.append("format", options.format);

        const ticker = setInterval(() => {
          setProgress((p) => Math.min(p + 3, 85));
        }, 800);

        res = await fetch("/api/tools/image-resizer", {
          method: "POST",
          body: formData,
        });

        clearInterval(ticker);
      }

      setProgress(90);
      setProgressLabel("Parsing response...");

      const body = await res.json();

      if (!res.ok) {
        throw new Error(body.error || "Failed to process image resizing.");
      }

      setResult(body.data);
      setProgress(100);
      setProgressLabel("Complete!");
      setStatus("success");
      toast.success("Image transformed successfully!");
    } catch (err: any) {
      console.error("[useImageResizer] Error:", err);
      const msg = err.message || "An unexpected error occurred.";
      setErrorMessage(msg);
      setStatus("error");
      setProgress(0);
      setProgressLabel("");
      toast.error(msg);
    }
  };

  const downloadImage = async () => {
    if (!result?.transformedUrl) return;
    
    try {
      const toastId = toast.loading("Initiating download...");
      const response = await fetch(result.transformedUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `resized_${file?.name.split(".")[0] || "image"}.${result.format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Image downloaded successfully!", { id: toastId });
    } catch (error) {
      console.error("[useImageResizer] Download failed:", error);
      toast.error("Failed to download image. Try right-clicking the preview to save.");
    }
  };

  const reset = () => {
    setFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setOptions({
      width: 800,
      height: 600,
      cropMode: "fill",
      quality: 80,
      format: "webp",
    });
    setStatus("idle");
    setResult(null);
    setErrorMessage(null);
    setProgress(0);
    setProgressLabel("");
  };

  return {
    file,
    previewUrl,
    options,
    status,
    result,
    errorMessage,
    progress,
    progressLabel,
    isUploadingR2,
    uploadProgressR2,
    setOptions,
    selectFile,
    processImage,
    downloadImage,
    reset,
  };
}
