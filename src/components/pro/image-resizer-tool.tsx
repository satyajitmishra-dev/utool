"use client";

import React, { useState } from "react";
import { useImageResizer } from "@/hooks/useImageResizer";
import { usePro } from "@/hooks/use-pro";
import { UploadZone } from "@/components/tools/pdf/upload-zone";
import { UpgradeBanner } from "@/components/pro/upgrade-banner";
import { ProFeature } from "@/components/pro/pro-feature";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import {
  ImageIcon,
  Lock,
  Sparkles,
  Download,
  RefreshCw,
  Sliders,
  Crop,
  ArrowRight,
  Maximize,
  CheckCircle,
} from "lucide-react";
import { formatBytes } from "@/utils/fileHelpers";

export function ImageResizerTool() {
  const { isPro, showUpgrade } = usePro();
  const {
    file,
    previewUrl,
    options,
    status,
    result,
    errorMessage,
    setOptions,
    selectFile,
    processImage,
    downloadImage,
    reset,
  } = useImageResizer();

  const [isDragActive, setIsDragActive] = useState(false);

  // Drag and drop handlers
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
          accept="image/jpeg,image/png,image/webp,image/gif"
          title="Upload your photo to resize."
          description="Drag & drop or browse from your local device. Compatible with JPG, PNG, WebP, GIF."
          fileTypeLabel="Image File Only"
          icon={<ImageIcon className="h-7 w-7 text-primary" />}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Settings / Configuration Panel */}
          <div className="lg:col-span-4 space-y-6">
            <GlassCard className="p-6 border-border space-y-5">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <Sliders className="h-4.5 w-4.5 text-primary" />
                <h3 className="text-sm font-bold text-foreground">Transformation Options</h3>
              </div>

              {/* Width & Height Inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-3xs font-extrabold text-muted-foreground uppercase tracking-wider">Width (px)</label>
                  <input
                    type="number"
                    value={options.width}
                    onChange={(e) => setOptions((prev) => ({ ...prev, width: Number(e.target.value) || 0 }))}
                    className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus-ring"
                    disabled={status === "processing"}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-3xs font-extrabold text-muted-foreground uppercase tracking-wider">Height (px)</label>
                  <input
                    type="number"
                    value={options.height}
                    onChange={(e) => setOptions((prev) => ({ ...prev, height: Number(e.target.value) || 0 }))}
                    className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus-ring"
                    disabled={status === "processing"}
                  />
                </div>
              </div>

              {/* Crop Mode Selection */}
              <div className="space-y-1.5">
                <label className="text-3xs font-extrabold text-muted-foreground uppercase tracking-wider">Fit / Crop Mode</label>
                <select
                  value={options.cropMode}
                  onChange={(e) => setOptions((prev) => ({ ...prev, cropMode: e.target.value as any }))}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus-ring"
                  disabled={status === "processing"}
                >
                  <option value="fill">Fill (Resize & Crop to Aspect Ratio)</option>
                  <option value="fit">Fit (Fit completely inside box)</option>
                  <option value="scale">Scale (Stretch to exact size)</option>
                  <option value="crop">Crop (Cut center block)</option>
                  <option value="thumb">Thumbnail (AI face-aware zoom)</option>
                </select>
              </div>

              {/* Format Selection */}
              <div className="space-y-1.5">
                <label className="text-3xs font-extrabold text-muted-foreground uppercase tracking-wider">Output Format</label>
                <select
                  value={options.format}
                  onChange={(e) => setOptions((prev) => ({ ...prev, format: e.target.value as any }))}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus-ring"
                  disabled={status === "processing"}
                >
                  <option value="webp">WebP (Optimized & Next-Gen)</option>
                  <option value="jpg">JPEG (Highly Compatible)</option>
                  <option value="png">PNG (Lossless Transparency)</option>
                  <option value="gif">GIF (Animated/Legacy)</option>
                </select>
              </div>

              {/* Quality Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <label className="text-3xs font-extrabold text-muted-foreground uppercase tracking-wider">Quality</label>
                  <span className="text-xs font-semibold text-foreground">{options.quality}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={options.quality}
                  onChange={(e) => setOptions((prev) => ({ ...prev, quality: Number(e.target.value) }))}
                  className="w-full accent-primary bg-muted rounded-lg h-2 cursor-pointer"
                  disabled={status === "processing"}
                />
              </div>

              {/* Process Button */}
              {isPro ? (
                <Button
                  variant="premium"
                  className="w-full h-11 rounded-xl font-bold shadow-md shadow-primary/10 flex items-center justify-center gap-2"
                  onClick={processImage}
                  loading={status === "processing"}
                >
                  <Sparkles className="h-4 w-4" />
                  Process & Resize
                </Button>
              ) : (
                <Button
                  variant="premium"
                  className="w-full h-11 rounded-xl font-bold shadow-md flex items-center justify-center gap-2 filter blur-[0.3px] opacity-75"
                  onClick={handleProcessClick}
                >
                  <Lock className="h-4 w-4" />
                  Process & Resize
                  <span className="text-[8px] bg-amber-500 text-white font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                    PRO
                  </span>
                </Button>
              )}

              {/* Reset Button */}
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
                  Original: {formatBytes(file.size)}
                </span>
              </div>

              <div className="my-6 flex-1 flex flex-col items-center justify-center bg-muted/20 border border-dashed border-border/80 rounded-2xl p-4 min-h-[300px] overflow-hidden relative">
                {status === "processing" && (
                  <div className="absolute inset-0 bg-background/55 backdrop-blur-xs flex flex-col items-center justify-center z-10 gap-3">
                    <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                    <span className="text-xs font-bold text-foreground">Processing transformations...</span>
                  </div>
                )}

                {result ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full h-full items-center">
                    {/* Left: Original */}
                    <div className="space-y-2 text-center">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Original Preview</p>
                      <div className="border border-border/80 rounded-xl overflow-hidden bg-card/50 aspect-video flex items-center justify-center relative max-h-[220px]">
                        <img src={previewUrl!} alt="Original" className="max-w-full max-h-full object-contain" />
                      </div>
                    </div>

                    {/* Right: Resized */}
                    <div className="space-y-2 text-center">
                      <p className="text-[10px] font-bold text-primary uppercase flex items-center gap-1 justify-center">
                        <CheckCircle className="h-3 w-3 text-emerald-500" />
                        Transformed Preview
                      </p>
                      <div className="border border-primary/20 rounded-xl overflow-hidden bg-card/50 aspect-video flex items-center justify-center relative max-h-[220px]">
                        <img src={result.transformedUrl} alt="Resized" className="max-w-full max-h-full object-contain" />
                      </div>
                    </div>
                  </div>
                ) : (
                  // Before processing preview
                  <div className="max-w-full max-h-[350px] flex items-center justify-center rounded-xl overflow-hidden border border-border/60 bg-card">
                    <img src={previewUrl!} alt="Preview" className="max-w-full max-h-[320px] object-contain" />
                  </div>
                )}
              </div>

              {/* Processed Details and Actions */}
              {result && (
                <div className="pt-4 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-center sm:text-left">
                    <h4 className="text-xs font-bold text-foreground">Resize Details</h4>
                    <p className="text-3xs text-muted-foreground mt-0.5">
                      Dimensions: {result.width}x{result.height}px | Format: {result.format.toUpperCase()}
                    </p>
                  </div>
                  <Button
                    variant="premium"
                    className="rounded-xl px-6 py-2.5 text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer hover:scale-[1.01]"
                    onClick={downloadImage}
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download Transformed Image
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
export default ImageResizerTool;
