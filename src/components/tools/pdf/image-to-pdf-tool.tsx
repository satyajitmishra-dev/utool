"use client";

import React, { useState, useRef } from "react";
import { useToolLimit } from "@/hooks/use-tool-limit";
import { UploadZone } from "./upload-zone";
import { ProgressBar } from "./progress-bar";
import { AlertCircle, CheckCircle2, FileImage, Download, RotateCcw, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface ImageFile {
  id: string;
  file: File;
  name: string;
  size: number;
  previewUrl: string;
}

export function ImageToPdfTool() {
  const { limitStatus, checkLimit, recordUsage } = useToolLimit();
  const [images, setImages] = useState<ImageFile[]>([]);
  const [processingState, setProcessingState] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [processingProgress, setProcessingProgress] = useState(0);
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(Array.from(e.target.files));
    }
  };

  const addFiles = (fileList: File[]) => {
    const imageFiles = fileList.filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length === 0) {
      toast.error("Please upload only valid image files (JPG, PNG, WebP).");
      return;
    }

    const newImages: ImageFile[] = imageFiles.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      name: file.name,
      size: file.size,
      previewUrl: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);
    setProcessingState("idle");
    setPdfBytes(null);
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((img) => img.id !== id);
    });
  };

  const clearImages = () => {
    images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    setImages([]);
    setProcessingState("idle");
    setPdfBytes(null);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...images];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    setImages(updated);
  };

  const moveDown = (index: number) => {
    if (index === images.length - 1) return;
    const updated = [...images];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    setImages(updated);
  };

  const generatePDF = async () => {
    if (images.length === 0) {
      toast.error("Please upload at least one image to convert.");
      return;
    }

    const isAllowed = await checkLimit();
    if (!isAllowed) {
      toast.error("You’ve reached today’s free limit.");
      return;
    }

    setGeneralError(null);
    setProcessingProgress(10);
    setProcessingState("processing");

    try {
      const { PDFDocument } = await import("pdf-lib");
      const pdfDoc = await PDFDocument.create();

      const total = images.length;
      for (let i = 0; i < total; i++) {
        const imgFile = images[i];
        
        // Convert image to JPEG bytes using canvas
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Could not create canvas 2D context.");

        const img = new Image();
        img.src = imgFile.previewUrl;
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });

        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);

        const jpegDataUrl = canvas.toDataURL("image/jpeg", 0.95);
        const res = await fetch(jpegDataUrl);
        const jpegBytes = await res.arrayBuffer();

        const embeddedImage = await pdfDoc.embedJpg(jpegBytes);
        const { width, height } = embeddedImage.scale(1.0);

        // Add a page with the exact dimensions of the image
        const page = pdfDoc.addPage([width, height]);
        page.drawImage(embeddedImage, {
          x: 0,
          y: 0,
          width,
          height,
        });

        setProcessingProgress(Math.round(((i + 1) / total) * 80) + 10);
      }

      setProcessingProgress(95);
      const generatedPdfBytes = await pdfDoc.save({ useObjectStreams: true });
      
      setPdfBytes(generatedPdfBytes);
      setProcessingProgress(100);
      setProcessingState("success");
      await recordUsage("image-to-pdf", "success");
      toast.success("PDF compilation complete!");
    } catch (err: any) {
      setProcessingState("error");
      const errMsg = err?.message || "Failed to compile PDF from images.";
      setGeneralError(errMsg);
      await recordUsage("image-to-pdf", "failed", errMsg);
      toast.error("Compilation failed.");
    }
  };

  const handleDownload = () => {
    if (!pdfBytes) return;
    const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `compiled_images_${Date.now()}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {processingState === "idle" && images.length === 0 && (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-3xl p-12 transition-all cursor-pointer ${
            isDragActive
              ? "border-primary bg-primary/5 scale-[0.99]"
              : "border-border hover:border-primary/50 hover:bg-card/50"
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInput}
            accept="image/*"
            multiple
            className="hidden"
          />
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/5 text-primary mb-4">
            <FileImage className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-foreground mb-1">Drag & drop your images here</h3>
          <p className="text-xs text-muted-foreground text-center max-w-xs">
            Supports PNG, JPG, JPEG, and WebP. Images are processed locally in your browser.
          </p>
        </div>
      )}

      {images.length > 0 && processingState !== "processing" && processingState !== "success" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center px-1">
            <h4 className="text-sm font-bold text-foreground">Uploaded Images ({images.length})</h4>
            <button
              onClick={clearImages}
              className="text-xs text-muted-foreground hover:text-rose-5050 transition-colors"
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[480px] overflow-y-auto pr-1">
            <AnimatePresence>
              {images.map((img, idx) => (
                <motion.div
                  key={img.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="border border-border rounded-2xl p-3 bg-card/40 flex flex-col justify-between space-y-3"
                >
                  <div className="aspect-video relative rounded-lg overflow-hidden border border-border bg-muted/30">
                    <img
                      src={img.previewUrl}
                      alt={img.name}
                      className="object-contain w-full h-full"
                    />
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-foreground truncate">{img.name}</p>
                      <p className="text-[10px] text-muted-foreground">{formatSize(img.size)}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveUp(idx)}
                        disabled={idx === 0}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:hover:bg-transparent"
                        title="Move Up"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => moveDown(idx)}
                        disabled={idx === images.length - 1}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:hover:bg-transparent"
                        title="Move Down"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => removeImage(img.id)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-50/50"
                        title="Remove"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 rounded-xl border border-border bg-card hover:bg-muted text-sm font-semibold py-3 flex justify-center items-center gap-2 cursor-pointer"
            >
              <FileImage className="h-4.5 w-4.5" />
              Add More Images
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInput}
              accept="image/*"
              multiple
              className="hidden"
            />
            <button
              onClick={generatePDF}
              className="flex-1 rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 text-sm font-bold py-3 flex justify-center items-center gap-2 cursor-pointer shadow-md"
            >
              Convert to PDF
            </button>
          </div>
        </div>
      )}

      {processingState === "processing" && (
        <div className="py-8 space-y-6">
          <div className="text-center space-y-2">
            <h4 className="text-sm font-bold text-foreground">Compiling PDF Document...</h4>
            <p className="text-xs text-muted-foreground">Embedding and compressing images locally.</p>
          </div>
          <ProgressBar progress={processingProgress} />
        </div>
      )}

      {processingState === "success" && (
        <div className="py-8 text-center space-y-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 mx-auto">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-foreground">PDF Compilation Successful!</h3>
            <p className="text-xs text-muted-foreground">
              Your images have been converted into a single high-quality PDF document.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
            <button
              onClick={clearImages}
              className="flex-1 rounded-xl border border-border bg-card hover:bg-muted text-xs font-bold py-3 flex justify-center items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              Convert Another
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold py-3 flex justify-center items-center gap-2 cursor-pointer shadow-md"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </button>
          </div>
        </div>
      )}

      {processingState === "error" && (
        <div className="py-8 text-center space-y-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-500 mx-auto">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-foreground">Compilation Failed</h3>
            <p className="text-xs text-muted-foreground">{generalError || "An unexpected error occurred."}</p>
          </div>
          <button
            onClick={() => setProcessingState("idle")}
            className="rounded-xl border border-border bg-card hover:bg-muted text-xs font-bold px-6 py-3 inline-flex justify-center items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
