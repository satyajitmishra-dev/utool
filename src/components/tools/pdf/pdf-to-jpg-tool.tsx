"use client";

import React, { useState, useEffect, useRef } from "react";
import { useToolLimit } from "@/hooks/use-tool-limit";
import { ProgressBar } from "./progress-bar";
import { AlertCircle, CheckCircle2, FileText, Download, RotateCcw, FileImage } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface RenderedPage {
  pageNumber: number;
  dataUrl: string;
}

export function PdfToJpgTool() {
  const { limitStatus, checkLimit, recordUsage } = useToolLimit();
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<RenderedPage[]>([]);
  const [processingState, setProcessingState] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [processingProgress, setProcessingProgress] = useState(0);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [pdfjsLoaded, setPdfjsLoaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load PDF.js from CDN dynamically to prevent Next.js bundle errors
  useEffect(() => {
    if ((window as any).pdfjsLib) {
      setPdfjsLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.async = true;
    script.onload = () => {
      const pdfjsLib = (window as any).pdfjsLib;
      pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      setPdfjsLoaded(true);
    };
    script.onerror = () => {
      setGeneralError("Failed to load PDF processing dependencies. Please check your internet connection.");
      setProcessingState("error");
    };
    document.body.appendChild(script);

    return () => {
      // clean up script if unmounted before loading
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

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
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf" || droppedFile.name.endsWith(".pdf")) {
        setFile(droppedFile);
        setProcessingState("idle");
        setPages([]);
      } else {
        toast.error("Please upload a valid PDF document.");
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setProcessingState("idle");
      setPages([]);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPages([]);
    setProcessingState("idle");
  };

  const convertPdfToJpg = async () => {
    if (!file) return;
    if (!pdfjsLoaded) {
      toast.error("Still loading PDF.js dependencies. Please wait a moment.");
      return;
    }

    const isAllowed = await checkLimit();
    if (!isAllowed) {
      toast.error("You’ve reached today’s free limit.");
      return;
    }

    setGeneralError(null);
    setProcessingProgress(5);
    setProcessingState("processing");

    try {
      const pdfjsLib = (window as any).pdfjsLib;
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      
      const numPages = pdf.numPages;
      const renderedPages: RenderedPage[] = [];

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        // Render at 2.0 scale for crisp JPEG output
        const viewport = page.getViewport({ scale: 2.0 });
        
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Could not create canvas context.");

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: ctx,
          viewport: viewport,
        }).promise;

        const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
        renderedPages.push({
          pageNumber: pageNum,
          dataUrl,
        });

        setProcessingProgress(Math.round((pageNum / numPages) * 90) + 5);
      }

      setPages(renderedPages);
      setProcessingProgress(100);
      setProcessingState("success");
      await recordUsage("pdf-to-jpg", "success");
      toast.success(`Successfully rendered ${numPages} PDF pages to images!`);
    } catch (err: any) {
      setProcessingState("error");
      const errMsg = err?.message || "Failed to render PDF to JPEG images.";
      setGeneralError(errMsg);
      await recordUsage("pdf-to-jpg", "failed", errMsg);
      toast.error("Conversion failed.");
    }
  };

  const downloadAll = () => {
    if (pages.length === 0) return;
    
    pages.forEach((page, idx) => {
      // Stagger downloads to prevent browser blocking multiple downloads
      setTimeout(() => {
        const link = document.createElement("a");
        link.href = page.dataUrl;
        link.download = `${file?.name.replace(".pdf", "")}_page_${page.pageNumber}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, idx * 300);
    });
  };

  const downloadPage = (dataUrl: string, num: number) => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${file?.name.replace(".pdf", "")}_page_${num}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {processingState === "idle" && !file && (
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
            accept=".pdf"
            className="hidden"
          />
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/5 text-primary mb-4">
            <FileText className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-foreground mb-1">Drag & drop your PDF here</h3>
          <p className="text-xs text-muted-foreground text-center max-w-xs">
            Upload the PDF document you want to extract as JPEG images.
          </p>
        </div>
      )}

      {file && processingState !== "processing" && processingState !== "success" && (
        <div className="border border-border rounded-2xl p-5 bg-card/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/5 text-primary flex-shrink-0">
              <FileText className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate max-w-[200px] sm:max-w-md">
                {file.name}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={clearFile}
              className="flex-1 sm:flex-initial rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold px-4 py-2.5 cursor-pointer"
            >
              Remove
            </button>
            <button
              onClick={convertPdfToJpg}
              className="flex-1 sm:flex-initial rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold px-5 py-2.5 cursor-pointer shadow-sm"
            >
              Extract Images
            </button>
          </div>
        </div>
      )}

      {processingState === "processing" && (
        <div className="py-8 space-y-6">
          <div className="text-center space-y-2">
            <h4 className="text-sm font-bold text-foreground">Rendering PDF Pages...</h4>
            <p className="text-xs text-muted-foreground">Converting document objects into rasterized JPEGs.</p>
          </div>
          <ProgressBar progress={processingProgress} />
        </div>
      )}

      {processingState === "success" && pages.length > 0 && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 px-1">
            <div>
              <h4 className="text-sm font-bold text-foreground">Rendered JPEG Pages ({pages.length})</h4>
              <p className="text-xs text-muted-foreground">Click individual pages to download, or save all pages at once.</p>
            </div>
            <div className="flex gap-2.5">
              <button
                onClick={clearFile}
                className="rounded-xl border border-border bg-card hover:bg-muted text-xs font-bold px-4 py-2.5 cursor-pointer"
              >
                Convert Another
              </button>
              <button
                onClick={downloadAll}
                className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold px-4 py-2.5 flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Download className="h-4 w-4" />
                Download All JPEGs
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[500px] overflow-y-auto pr-1">
            {pages.map((page) => (
              <div
                key={page.pageNumber}
                className="border border-border rounded-xl p-2.5 bg-card/40 flex flex-col justify-between space-y-3 group hover:border-primary/30 transition-all duration-200"
              >
                <div className="aspect-[3/4] relative rounded-lg overflow-hidden border border-border/80 bg-muted/20">
                  <img
                    src={page.dataUrl}
                    alt={`Page ${page.pageNumber}`}
                    className="object-contain w-full h-full"
                  />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => downloadPage(page.dataUrl, page.pageNumber)}
                      className="h-9 w-9 rounded-full bg-white text-slate-800 flex items-center justify-center shadow-md hover:scale-105 transition-transform cursor-pointer"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground">
                  <span>Page {page.pageNumber}</span>
                  <button
                    onClick={() => downloadPage(page.dataUrl, page.pageNumber)}
                    className="text-primary hover:underline cursor-pointer"
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {processingState === "error" && (
        <div className="py-8 text-center space-y-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-500 mx-auto">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-foreground">Conversion Failed</h3>
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
