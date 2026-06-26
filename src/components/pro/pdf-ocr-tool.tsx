"use client";

import React, { useState } from "react";
import { usePdfOCR } from "@/hooks/usePdfOCR";
import { usePro } from "@/hooks/use-pro";
import { UploadZone } from "@/components/tools/pdf/upload-zone";
import { UpgradeBanner } from "@/components/pro/upgrade-banner";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import {
  FileCheck,
  Lock,
  Sparkles,
  RefreshCw,
  Copy,
  Download,
  CheckCircle,
  FileText,
  FileSearch,
} from "lucide-react";
import { formatBytes } from "@/utils/fileHelpers";

export function PdfOcrTool() {
  const { isPro, showUpgrade } = usePro();
  const {
    file,
    previewUrl,
    extractedText,
    status,
    errorMessage,
    selectFile,
    processFile,
    copyToClipboard,
    downloadText,
    reset,
  } = usePdfOCR();

  const [isDragActive, setIsDragActive] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      const validTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
      if (validTypes.includes(droppedFile.type) || droppedFile.name.endsWith(".pdf")) {
        selectFile(droppedFile);
      }
    }
  };

  const onFileSelect = (files: File[]) => {
    if (files.length > 0) {
      selectFile(files[0]);
    }
  };

  const handleProcessClick = () => {
    if (!isPro) {
      showUpgrade();
      return;
    }
    processFile();
  };

  const isPDF = file?.type === "application/pdf" || file?.name.endsWith(".pdf");

  return (
    <div className="w-full space-y-6">
      {/* Premium Banner for Free Users */}
      <UpgradeBanner />

      {!file ? (
        <UploadZone
          isDragActive={isDragActive}
          isParsing={status === "processing"}
          dragHandlers={{
            onDragOver: handleDragOver,
            onDragLeave: handleDragLeave,
            onDrop: handleDrop,
          }}
          onFileSelect={onFileSelect}
          maxSizeLabel={isPro ? "2GB" : "30MB"}
          allowMultiple={false}
          accept="application/pdf,image/jpeg,image/png,image/jpg"
          title="Upload your scanned PDF or photo."
          description="Drag & drop or browse from your device. Supports PDF, JPG, PNG."
          fileTypeLabel="PDF or Image Files"
          icon={<FileCheck className="h-7 w-7 text-primary" />}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Settings panel */}
          <div className="lg:col-span-4 space-y-6">
            <GlassCard className="p-6 border-border space-y-5">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <FileCheck className="h-4.5 w-4.5 text-primary" />
                <h3 className="text-sm font-bold text-foreground">AI OCR Settings</h3>
              </div>

              {/* File Info Card */}
              <div className="bg-muted/30 border border-border p-3.5 rounded-xl space-y-2 text-2xs leading-relaxed text-muted-foreground">
                <div className="flex justify-between">
                  <span className="font-bold text-foreground">Filename:</span>
                  <span className="truncate max-w-[150px]" title={file.name}>
                    {file.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-foreground">Size:</span>
                  <span>{formatBytes(file.size)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-foreground">Format:</span>
                  <span className="uppercase">{isPDF ? "PDF Document" : file.type.split("/")[1]}</span>
                </div>
              </div>

              {/* Action Button */}
              {isPro ? (
                <Button
                  variant="premium"
                  className="w-full h-11 rounded-xl font-bold shadow-md shadow-primary/10 flex items-center justify-center gap-2"
                  onClick={processFile}
                  loading={status === "processing"}
                >
                  <Sparkles className="h-4 w-4" />
                  Extract Text
                </Button>
              ) : (
                <Button
                  variant="premium"
                  className="w-full h-11 rounded-xl font-bold shadow-md flex items-center justify-center gap-2 filter blur-[0.3px] opacity-75"
                  onClick={handleProcessClick}
                >
                  <Lock className="h-4 w-4" />
                  Extract Text
                  <span className="text-[8px] bg-amber-500 text-white font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                    PRO
                  </span>
                </Button>
              )}

              {/* Reset */}
              <Button
                variant="outline"
                className="w-full h-10 border-border rounded-xl text-xs text-muted-foreground hover:text-foreground hover:bg-muted/40"
                onClick={reset}
                disabled={status === "processing"}
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Upload Different File
              </Button>
            </GlassCard>

            {errorMessage && (
              <div className="p-4 rounded-xl border border-error/20 bg-error/5 text-xs text-error font-medium">
                {errorMessage}
              </div>
            )}
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-8 space-y-6">
            <GlassCard className="p-6 border-border flex flex-col justify-between h-full min-h-[400px]">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <span className="text-xs font-bold text-foreground">Extracted Text Canvas</span>
                <span className="text-3xs text-muted-foreground uppercase font-bold tracking-wider">
                  Source Preview
                </span>
              </div>

              {/* File visual preview */}
              <div className="my-6 flex flex-col items-center justify-center bg-muted/20 border border-border/85 rounded-2xl p-4 min-h-[140px] overflow-hidden relative shrink-0">
                {isPDF ? (
                  <div className="flex items-center gap-3 py-3 px-6 bg-card border border-border rounded-xl shadow-xs">
                    <FileSearch className="h-7 w-7 text-primary shrink-0" />
                    <div className="text-left">
                      <span className="text-xs font-bold text-foreground truncate max-w-[200px] block">{file.name}</span>
                      <span className="text-4xs text-muted-foreground uppercase font-bold tracking-wider">PDF Document</span>
                    </div>
                  </div>
                ) : (
                  <img src={previewUrl!} alt="Uploaded preview" className="max-h-[140px] max-w-full object-contain rounded-lg shadow-xs" />
                )}
              </div>

              {/* Extracted text text-area console */}
              <div className="flex-1 border border-border/80 rounded-2xl bg-card/65 p-4 min-h-[220px] max-h-[300px] overflow-y-auto font-mono text-2xs relative">
                {status === "processing" && (
                  <div className="absolute inset-0 bg-background/55 backdrop-blur-xs flex flex-col items-center justify-center z-10 gap-3">
                    <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                    <span className="text-xs font-bold text-foreground">OCR reading text nodes...</span>
                  </div>
                )}

                {extractedText ? (
                  <textarea
                    readOnly
                    value={extractedText}
                    className="w-full h-full bg-transparent resize-none border-0 p-0 text-foreground/90 font-sans text-xs focus:ring-0 leading-relaxed outline-hidden"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-3xs uppercase tracking-wider font-bold">
                    Extracted text output will display here.
                  </div>
                )}
              </div>

              {/* Action operations */}
              {extractedText && (
                <div className="pt-4 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-center sm:text-left">
                    <h4 className="text-xs font-bold text-foreground flex items-center gap-1 justify-center sm:justify-start">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      Text Parsed
                    </h4>
                    <p className="text-3xs text-muted-foreground mt-0.5">
                      Completed character identification and spelling alignment.
                    </p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      className="rounded-xl flex-1 sm:flex-none px-4 py-2 text-2xs font-bold border-border flex items-center gap-1.5"
                      onClick={copyToClipboard}
                    >
                      <Copy className="h-3.5 w-3.5" />
                      Copy Text
                    </Button>
                    <Button
                      variant="premium"
                      className="rounded-xl flex-1 sm:flex-none px-5 py-2 text-2xs font-bold shadow-md flex items-center gap-1.5"
                      onClick={downloadText}
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download TXT File
                    </Button>
                  </div>
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      )}
    </div>
  );
}
export default PdfOcrTool;
