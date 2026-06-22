"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useToolLimit } from "@/hooks/use-tool-limit";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  FileImage,
  Upload,
  Download,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  User,
  LogOut,
  RefreshCw,
  Lock,
  CheckCircle2,
  Trash2,
  Sliders,
  Percent,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface ConversionItem {
  id: string;
  file: File;
  name: string;
  originalSize: number;
  previewUrl: string;
  status: "idle" | "converting" | "success" | "failed";
  convertedUrl?: string;
  convertedSize?: number;
  error?: string;
}

export default function WebPConverterPage() {
  const { user, logout } = useAuth();
  const { limitStatus, loading: limitLoading, checkLimit, recordUsage, refresh } = useToolLimit();

  const [files, setFiles] = useState<ConversionItem[]>([]);
  const [quality, setQuality] = useState<number>(80); // 10-100%
  const [converting, setConverting] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFriendlySize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(Array.from(e.target.files));
    }
  };

  const addFiles = (selectedFiles: File[]) => {
    const validFiles = selectedFiles.filter(
      (f) => f.type === "image/png" || f.type === "image/jpeg" || f.type === "image/webp"
    );

    if (validFiles.length === 0) {
      toast.error("Please upload valid PNG or JPEG image files.");
      return;
    }

    const newItems: ConversionItem[] = validFiles.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      file,
      name: file.name,
      originalSize: file.size,
      previewUrl: URL.createObjectURL(file),
      status: "idle",
    }));

    setFiles((prev) => [...prev, ...newItems]);
    toast.success(`Added ${validFiles.length} file(s) to the conversion catalog.`);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) {
        URL.revokeObjectURL(item.previewUrl);
        if (item.convertedUrl) URL.revokeObjectURL(item.convertedUrl);
      }
      return prev.filter((i) => i.id !== id);
    });
  };

  const handleReset = () => {
    files.forEach((item) => {
      URL.revokeObjectURL(item.previewUrl);
      if (item.convertedUrl) URL.revokeObjectURL(item.convertedUrl);
    });
    setFiles([]);
    setConverting(false);
  };

  const convertImageToWebP = (item: ConversionItem, q: number): Promise<{ url: string; size: number }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Canvas render context initialization failed"));
            return;
          }
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Failed to compile WebP blob stream"));
                return;
              }
              const url = URL.createObjectURL(blob);
              resolve({ url, size: blob.size });
            },
            "image/webp",
            q / 100
          );
        };
        img.onerror = () => reject(new Error("Failed to decode image buffer source"));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error("FileReader buffer error"));
      reader.readAsDataURL(item.file);
    });
  };

  const handleConvertAll = async () => {
    if (files.length === 0) return;

    setConverting(true);
    const toastId = toast.loading("Converting your images to WebP format...");

    // Double check tool limits
    const isAllowed = await checkLimit();
    if (!isAllowed) {
      toast.dismiss(toastId);
      toast.error("You’ve reached today’s free limit.");
      setConverting(false);
      return;
    }

    let successCount = 0;
    const updatedFiles = [...files];

    for (let i = 0; i < updatedFiles.length; i++) {
      const item = updatedFiles[i];
      if (item.status === "success") continue; // Skip already converted

      updatedFiles[i] = { ...item, status: "converting" };
      setFiles([...updatedFiles]);

      try {
        const result = await convertImageToWebP(item, quality);
        updatedFiles[i] = {
          ...item,
          status: "success",
          convertedUrl: result.url,
          convertedSize: result.size,
        };
        successCount++;
      } catch (err: any) {
        console.error("Conversion failed:", err);
        updatedFiles[i] = {
          ...item,
          status: "failed",
          error: err.message || "Conversion failed",
        };
      }
      setFiles([...updatedFiles]);
    }

    toast.dismiss(toastId);
    if (successCount > 0) {
      toast.success(`Successfully converted ${successCount} image(s) to WebP.`);
      await recordUsage("image-convert", "success");
    } else {
      toast.error("All conversion tasks in this batch failed.");
      await recordUsage("image-convert", "failed", "Batch conversion failure");
    }
    setConverting(false);
  };

  const handleDownload = (item: ConversionItem) => {
    if (!item.convertedUrl) return;
    const a = document.createElement("a");
    a.href = item.convertedUrl;
    // Replace extension with webp
    const originalName = item.name;
    const lastDotIndex = originalName.lastIndexOf(".");
    const baseName = lastDotIndex !== -1 ? originalName.substring(0, lastDotIndex) : originalName;
    a.download = `${baseName}.webp`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success(`Downloaded ${baseName}.webp successfully.`);
  };

  // Clean up Object URLs when unmounting
  useEffect(() => {
    return () => {
      files.forEach((item) => {
        URL.revokeObjectURL(item.previewUrl);
        if (item.convertedUrl) URL.revokeObjectURL(item.convertedUrl);
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20 selection:text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2.5 font-semibold text-[17px] tracking-tight text-foreground hover:opacity-90 transition-opacity"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[image:var(--gradient-primary)] shadow-sm">
                <FileImage className="h-[18px] w-[18px] text-white" />
              </div>
              <span>
                utool{" "}
                <Badge variant="primary" className="ml-1 align-middle text-[9px]">
                  Workspace
                </Badge>
              </span>
            </Link>
            <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-border">
              <span className="text-caption font-bold text-foreground">WebP Converter</span>
              <Badge variant="success">Live</Badge>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!limitLoading ? (
              limitStatus.tier === "pro" ? (
                <Badge variant="pro" className="hidden sm:inline-flex">
                  <Sparkles className="h-3 w-3" />
                  Pro: Unlimited
                </Badge>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Badge variant="default">
                    Actions: {limitStatus.count} / {limitStatus.max}
                  </Badge>
                  <button
                    onClick={refresh}
                    className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                  </button>
                </div>
              )
            ) : (
              <div className="hidden sm:block h-6 w-24 skeleton rounded-full" />
            )}

            <ThemeToggle />

            <div className="flex items-center gap-2 pl-3 border-l border-border">
              {user ? (
                <>
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-muted border border-border text-muted-foreground"
                    title={user.email || ""}
                  >
                    <User className="h-4.5 w-4.5" />
                  </div>
                  <button
                    onClick={logout}
                    className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <Link
                  href="/login?redirect=/image-tools/webp-converter"
                  className="inline-flex items-center justify-center rounded-xl bg-card border border-border px-3.5 py-1.5 text-caption font-bold text-foreground hover:bg-muted transition-all"
                >
                  Log In
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-10 flex flex-col justify-center">
        <div className="mb-8">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 text-caption font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Catalog
          </Link>
        </div>

        <div className="space-y-10">
          {/* Headline */}
          <div className="text-center max-w-xl mx-auto space-y-3">
            <Badge variant="primary" className="mx-auto">
              <Sparkles className="h-3.5 w-3.5 mr-1" />
              100% Client-Side Engine
            </Badge>
            <h1 className="text-display-md font-extrabold tracking-tight text-foreground">
              Image WebP Converter
            </h1>
            <p className="text-body-sm text-muted-foreground leading-relaxed">
              Convert PNG, JPEG, and WebP images to highly compressed WebP files directly in your browser. Complete privacy with zero server uploads.
            </p>
          </div>

          {/* Daily Quota Alert */}
          {limitStatus.isLimited && !limitLoading && (
            <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 flex gap-3 text-sm text-destructive w-full max-w-3xl mx-auto">
              <Lock className="h-5 w-5 text-destructive flex-shrink-0" />
              <div>
                <h4 className="font-bold">Daily Action Limit Exceeded</h4>
                <p className="mt-0.5 text-xs text-destructive/80 leading-relaxed">
                  You have hit your daily action limit. Please upgrade to Pro for unlimited operations or check back tomorrow.
                </p>
              </div>
            </div>
          )}

          {/* Workspace Wrapper */}
          <div className="space-y-6 max-w-3xl mx-auto w-full">
            {/* 1. Drag & Drop Zone */}
            {files.length === 0 && (
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[260px]",
                  isDragActive
                    ? "border-primary bg-primary/5 scale-[0.99]"
                    : "border-border bg-card/20 hover:border-foreground/30 hover:bg-card/45"
                )}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  multiple
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                />
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted border border-border text-muted-foreground mb-4">
                  <Upload className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-foreground">Drag & drop your images here</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs leading-relaxed">
                  Supports PNG, JPEG, and WebP formats. Files are optimized directly inside your browser.
                </p>
                <Button variant="secondary" className="mt-6 pointer-events-none">
                  Select Files
                </Button>
              </div>
            )}

            {/* 2. File list and Config Options */}
            {files.length > 0 && (
              <div className="space-y-6">
                {/* Options Panel */}
                <GlassCard className="p-6 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-foreground uppercase tracking-widest border-b border-border pb-3">
                    <Sliders className="h-4 w-4 text-primary" />
                    <span>Conversion Controls</span>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6">
                    <div className="flex-1 space-y-1.5">
                      <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        <span>WebP Quality Level</span>
                        <span className="text-foreground font-mono font-bold">{quality}%</span>
                      </div>
                      <input
                        type="range"
                        min={10}
                        max={100}
                        step={5}
                        value={quality}
                        onChange={(e) => setQuality(parseInt(e.target.value))}
                        className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        disabled={converting}
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <Button variant="secondary" onClick={handleReset} disabled={converting}>
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Clear Workspace
                      </Button>
                      <Button
                        variant="primary"
                        onClick={handleConvertAll}
                        disabled={converting || limitStatus.isLimited}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white"
                      >
                        {converting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-1" />
                            Converting...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-1" />
                            Convert all to WebP
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </GlassCard>

                {/* Queue list */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-widest flex items-center gap-1.5">
                    <FileImage className="h-4 w-4 text-primary" />
                    <span>Selected Images ({files.length})</span>
                  </h3>

                  <div className="space-y-3">
                    {files.map((item) => {
                      const savingsPercentage =
                        item.convertedSize && item.originalSize
                          ? Math.round(((item.originalSize - item.convertedSize) / item.originalSize) * 100)
                          : 0;

                      return (
                        <GlassCard key={item.id} className="p-4 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.previewUrl}
                              alt="Upload preview"
                              className="h-14 w-14 rounded-xl object-cover bg-muted border border-border flex-shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <h4 className="text-xs font-bold text-foreground truncate" title={item.name}>
                                {item.name}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] text-muted-foreground font-semibold">
                                  Original: {getFriendlySize(item.originalSize)}
                                </span>
                                {item.convertedSize && (
                                  <>
                                    <span className="text-[10px] text-muted-foreground">•</span>
                                    <span className="text-[10px] text-emerald-500 font-bold">
                                      WebP: {getFriendlySize(item.convertedSize)}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Action state */}
                          <div className="flex items-center gap-3">
                            {item.status === "idle" && (
                              <button
                                onClick={() => removeFile(item.id)}
                                className="p-2 text-muted-foreground hover:text-rose-500 rounded-xl hover:bg-rose-500/5 border border-transparent hover:border-rose-500/10 transition-all cursor-pointer"
                                title="Remove File"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}

                            {item.status === "converting" && (
                              <div className="flex items-center gap-1.5 text-xs text-primary font-semibold">
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                <span>Processing...</span>
                              </div>
                            )}

                            {item.status === "success" && item.convertedUrl && (
                              <div className="flex items-center gap-3">
                                {savingsPercentage > 0 && (
                                  <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/15 px-2 py-0.5 text-[9px] font-extrabold uppercase text-emerald-500 tracking-wider">
                                    <Percent className="h-2.5 w-2.5" />
                                    {savingsPercentage}% smaller
                                  </span>
                                )}
                                <Button
                                  variant="secondary"
                                  onClick={() => handleDownload(item)}
                                  className="h-8 py-1 px-3 text-[11px] bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-600 border border-emerald-500/20 rounded-xl"
                                >
                                  <Download className="h-3 w-3 mr-1" />
                                  Download
                                </Button>
                              </div>
                            )}

                            {item.status === "failed" && (
                              <span className="text-[10px] font-bold text-rose-500 uppercase">
                                Failed
                              </span>
                            )}
                          </div>
                        </GlassCard>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// Helper to conditional resolve cn utility if not locally present
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
