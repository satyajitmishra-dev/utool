"use client";

import React, { useState } from "react";
import { useBackgroundRemoval } from "@/hooks/useBackgroundRemoval";
import { usePro } from "@/hooks/use-pro";
import { UploadZone } from "@/components/tools/pdf/upload-zone";
import { UpgradeBanner } from "@/components/pro/upgrade-banner";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import {
  Sparkles,
  Lock,
  Download,
  RefreshCw,
  ImageIcon,
  CheckCircle,
  Wrench,
  Info,
} from "lucide-react";
import { formatBytes } from "@/utils/fileHelpers";

export function BackgroundRemoverTool() {
  const { isPro, showUpgrade } = usePro();
  const {
    file,
    previewUrl,
    processedUrl,
    processedBlob,
    status,
    errorMessage,
    selectFile,
    processImage,
    downloadImage,
    reset,
  } = useBackgroundRemoval();

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
      if (droppedFile.type.startsWith("image/")) {
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
    processImage();
  };

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
          accept="image/jpeg,image/png,image/webp"
          title="Upload your photo to remove background."
          description="Drag & drop or browse from your device. Compatible with JPG, PNG, WebP."
          fileTypeLabel="Image File Only"
          icon={<ImageIcon className="h-7 w-7 text-primary" />}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Settings panel */}
          <div className="lg:col-span-4 space-y-6">
            <GlassCard className="p-6 border-border space-y-5">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <Wrench className="h-4.5 w-4.5 text-primary" />
                <h3 className="text-sm font-bold text-foreground">AI Background Removal</h3>
              </div>

              <div className="flex gap-2.5 items-start bg-muted/30 border border-border p-3.5 rounded-xl text-3xs leading-relaxed text-muted-foreground">
                <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>
                  Our AI system automatically identifies the main subject (person, product, or animal) and removes the background cleanly in seconds, delivering a transparent PNG file.
                </span>
              </div>

              {/* Action Button */}
              {isPro ? (
                <Button
                  variant="premium"
                  className="w-full h-11 rounded-xl font-bold shadow-md shadow-primary/10 flex items-center justify-center gap-2"
                  onClick={processImage}
                  loading={status === "processing"}
                >
                  <Sparkles className="h-4 w-4" />
                  Remove Background
                </Button>
              ) : (
                <Button
                  variant="premium"
                  className="w-full h-11 rounded-xl font-bold shadow-md flex items-center justify-center gap-2 filter blur-[0.3px] opacity-75"
                  onClick={handleProcessClick}
                >
                  <Lock className="h-4 w-4" />
                  Remove Background
                  <span className="text-[8px] bg-amber-500 text-white font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                    PRO
                  </span>
                </Button>
              )}

              {/* Reset / Upload Different */}
              <Button
                variant="outline"
                className="w-full h-10 border-border rounded-xl text-xs text-muted-foreground hover:text-foreground hover:bg-muted/40"
                onClick={reset}
                disabled={status === "processing"}
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Upload Different Image
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
                <span className="text-xs font-bold text-foreground">Workspace Canvas</span>
                <span className="text-3xs text-muted-foreground uppercase font-bold tracking-wider">
                  Original Size: {formatBytes(file.size)}
                </span>
              </div>

              <div className="my-6 flex-1 flex flex-col items-center justify-center bg-muted/20 border border-dashed border-border/80 rounded-2xl p-4 min-h-[300px] overflow-hidden relative">
                {status === "processing" && (
                  <div className="absolute inset-0 bg-background/55 backdrop-blur-xs flex flex-col items-center justify-center z-10 gap-3">
                    <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                    <span className="text-xs font-bold text-foreground">AI is isolating subjects...</span>
                  </div>
                )}

                {processedUrl ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full h-full items-center">
                    {/* Left: Original */}
                    <div className="space-y-2 text-center">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Original Preview</p>
                      <div className="border border-border/80 rounded-xl overflow-hidden bg-card/50 aspect-video flex items-center justify-center relative max-h-[220px]">
                        <img src={previewUrl!} alt="Original" className="max-w-full max-h-full object-contain" />
                      </div>
                    </div>

                    {/* Right: Transparent checkerboard preview */}
                    <div className="space-y-2 text-center">
                      <p className="text-[10px] font-bold text-primary uppercase flex items-center gap-1 justify-center">
                        <CheckCircle className="h-3 w-3 text-emerald-500" />
                        Background Removed
                      </p>
                      <div
                        className="border border-primary/20 rounded-xl overflow-hidden aspect-video flex items-center justify-center relative max-h-[220px]"
                        style={{
                          backgroundImage: `
                            linear-gradient(45deg, #e2e8f0 25%, transparent 25%),
                            linear-gradient(-45deg, #e2e8f0 25%, transparent 25%),
                            linear-gradient(45deg, transparent 75%, #e2e8f0 75%),
                            linear-gradient(-45deg, transparent 75%, #e2e8f0 75%)
                          `,
                          backgroundSize: "16px 16px",
                          backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0",
                          backgroundColor: "#f8fafc",
                        }}
                      >
                        <img src={processedUrl} alt="Transformed transparent" className="max-w-full max-h-full object-contain" />
                      </div>
                    </div>
                  </div>
                ) : (
                  // Before processing
                  <div className="max-w-full max-h-[350px] flex items-center justify-center rounded-xl overflow-hidden border border-border/60 bg-card">
                    <img src={previewUrl!} alt="Preview" className="max-w-full max-h-[320px] object-contain" />
                  </div>
                )}
              </div>

              {/* Actions */}
              {processedUrl && (
                <div className="pt-4 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-center sm:text-left">
                    <h4 className="text-xs font-bold text-foreground">Transformation Complete</h4>
                    <p className="text-3xs text-muted-foreground mt-0.5">
                      Output Format: PNG | Size: {processedBlob ? formatBytes(processedBlob.size) : "Calculating"}
                    </p>
                  </div>
                  <Button
                    variant="premium"
                    className="rounded-xl px-6 py-2.5 text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer hover:scale-[1.01]"
                    onClick={downloadImage}
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download transparent PNG
                  </Button>
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      )}
    </div>
  );
}
export default BackgroundRemoverTool;
