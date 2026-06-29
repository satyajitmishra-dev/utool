"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  RotateCcw, 
  Download, 
  CheckCircle2, 
  ChevronLeft,
  Sparkles,
  Undo2, 
  Redo2, 
  Trash2, 
  Copy, 
  Grid,
  ShieldCheck,
  Plus,
  Loader2
} from "lucide-react";
import { PDFUploader } from "./uploader";
import { ToolSidebar } from "./sidebar";
import { PDFThumbnailGrid, WorkspacePageItem } from "./thumbnail-grid";
import { usePdfLoader } from "./hooks/use-pdf-loader";
import { usePdfRenderer } from "./hooks/use-pdf-renderer";
import { usePdfExporter } from "./hooks/use-pdf-exporter";
import { toast } from "sonner";

// Local translation dictionary for standard components (i18n ready)
const TRANSLATIONS = {
  en: {
    recommendedNext: "Recommended Next Actions",
    downloadReady: "Your compiled PDF is ready.",
    successTitle: "Operation Completed Successfully!",
    processingText: "Sanitizing document layout...",
    reorderLabel: "Rearrange pages sequence",
    undo: "Undo",
    redo: "Redo",
    delete: "Delete Selected",
    duplicate: "Duplicate Selected",
    rotate: "Rotate Selected",
    selectAll: "Select All",
    deselectAll: "Clear Selection",
    noPages: "No pages loaded. Please upload a PDF to begin.",
    privacyNotice: "utool operates entirely inside your local browser. Your confidential file contents never upload to any remote server.",
    proBadge: "Premium Feature",
    diagnosticsTitle: "Structure Diagnostic Audit Log",
    diagnosticsHeader: "PDF Syntax Header check:",
    diagnosticsCatalog: "PDF Stream catalog mapping:",
    diagnosticsEncrypted: "Password Encryption validation:",
  }
};

interface PdfWorkspaceProps {
  toolId: string;
  sidebarTitle: string;
  actionLabel: string;
  acceptTypes: Record<string, string[]>;
  maxSizeMB: number;
  maxFiles?: number;
  isPremium?: boolean;
  defaultOptions: any;
  renderSidebar: (options: any, setOptions: (opts: any) => void) => React.ReactNode;
  onProcess: (
    items: WorkspacePageItem[],
    options: any,
    setProgress: (val: number) => void
  ) => Promise<Uint8Array>;
  onCardClick?: (item: WorkspacePageItem) => void;
}

export function PdfWorkspace({
  toolId,
  sidebarTitle,
  actionLabel,
  acceptTypes,
  maxSizeMB,
  maxFiles = 100,
  isPremium = false,
  defaultOptions,
  renderSidebar,
  onProcess,
  onCardClick,
}: PdfWorkspaceProps) {
  const { loadPdfFile, loading: loaderLoading } = usePdfLoader();
  const { renderPageToDataUrl, clearCache } = usePdfRenderer();
  const { exportPdfFile, exporting } = usePdfExporter();

  // Core workspace state
  const [items, setItems] = useState<WorkspacePageItem[]>([]);
  const [options, setOptions] = useState<any>(defaultOptions);
  const [status, setStatus] = useState<"upload" | "configure" | "processing" | "success" | "error">("upload");
  const [progress, setProgress] = useState(0);
  const [outputBytes, setOutputBytes] = useState<Uint8Array | null>(null);
  const [outputName, setOutputName] = useState("");
  
  // Undo/Redo history stack
  const [history, setHistory] = useState<WorkspacePageItem[][]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);

  // File diagnostics
  const [diagnostics, setDiagnostics] = useState<any>(null);

  // Trigger telemetry logs
  const logTelemetry = (event: string, meta?: any) => {
    console.log(`[Telemetry - ${toolId}] Event: "${event}"`, meta || {});
  };

  // Autosave options to localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`utool-pdf-${toolId}`);
    if (saved) {
      try {
        setOptions(JSON.parse(saved));
      } catch (err) {
        console.error("Autosave load failed:", err);
      }
    }
    logTelemetry("tool opened");
  }, [toolId]);

  // Listen for external page additions (for Organize Tool)
  useEffect(() => {
    const addBlank = () => {
      const blank: WorkspacePageItem = {
        id: Math.random().toString(36).substring(2, 9),
        originalPageNumber: -1,
        tempRotation: 0,
        fileId: "blank",
        fileName: "Blank Page",
        buffer: new ArrayBuffer(0),
      };
      setItems((prev) => {
        const next = [...prev, blank];
        const updatedHistory = history.slice(0, historyIdx + 1);
        updatedHistory.push(next);
        setHistory(updatedHistory);
        setHistoryIdx(updatedHistory.length - 1);
        return next;
      });
      toast.success("Inserted a blank A4 page.");
    };

    const addPdf = (e: any) => {
      const info = e.detail;
      const newPages: WorkspacePageItem[] = [];
      for (let p = 1; p <= info.pageCount; p++) {
        newPages.push({
          id: Math.random().toString(36).substring(2, 9),
          originalPageNumber: p,
          tempRotation: 0,
          fileId: info.name,
          fileName: info.name,
          buffer: info.buffer,
        });
      }
      setItems((prev) => {
        const next = [...prev, ...newPages];
        const updatedHistory = history.slice(0, historyIdx + 1);
        updatedHistory.push(next);
        setHistory(updatedHistory);
        setHistoryIdx(updatedHistory.length - 1);
        return next;
      });
      toast.success(`Merged ${info.pageCount} pages from "${info.name}".`);
    };

    const rotatePages = (e: any) => {
      const { target, angle } = e.detail;
      setItems((prev) => {
        const next = prev.map((it, idx) => {
          let shouldRotate = false;
          if (target === "all") shouldRotate = true;
          else if (target === "selected") shouldRotate = !!it.selected;
          else if (target === "odd") shouldRotate = (idx % 2 === 0);
          else if (target === "even") shouldRotate = (idx % 2 === 1);
          
          if (shouldRotate) {
            return { ...it, tempRotation: (it.tempRotation + angle) % 360 };
          }
          return it;
        });
        const updatedHistory = history.slice(0, historyIdx + 1);
        updatedHistory.push(next);
        setHistory(updatedHistory);
        setHistoryIdx(updatedHistory.length - 1);
        return next;
      });
      toast.success(`Applied ${angle}° rotation to target pages.`);
    };

    window.addEventListener("utool-organize-add-blank", addBlank);
    window.addEventListener("utool-organize-add-pdf", addPdf);
    window.addEventListener("utool-pdf-rotate-apply", rotatePages);

    return () => {
      window.removeEventListener("utool-organize-add-blank", addBlank);
      window.removeEventListener("utool-organize-add-pdf", addPdf);
      window.removeEventListener("utool-pdf-rotate-apply", rotatePages);
    };
  }, [history, historyIdx]);

  const handleOptionsChange = (newOpts: any) => {
    setOptions(newOpts);
    localStorage.setItem(`utool-pdf-${toolId}`, JSON.stringify(newOpts));
  };

  // History stack management
  const updateItemsWithHistory = (newItems: WorkspacePageItem[]) => {
    const updatedHistory = history.slice(0, historyIdx + 1);
    updatedHistory.push(newItems);
    setHistory(updatedHistory);
    setHistoryIdx(updatedHistory.length - 1);
    setItems(newItems);
  };

  const handleUndo = () => {
    if (historyIdx > 0) {
      const idx = historyIdx - 1;
      setHistoryIdx(idx);
      setItems(history[idx]);
    }
  };

  const handleRedo = () => {
    if (historyIdx < history.length - 1) {
      const idx = historyIdx + 1;
      setHistoryIdx(idx);
      setItems(history[idx]);
    }
  };

  // Upload trigger
  const handleFilesSelected = async (files: File[]) => {
    logTelemetry("file uploaded", { count: files.length });
    
    // Reset workspace state
    clearCache();
    let currentPages: WorkspacePageItem[] = [];

    for (let fIdx = 0; fIdx < files.length; fIdx++) {
      const file = files[fIdx];
      const info = await loadPdfFile(file);
      if (!info) continue;

      setDiagnostics(info.diagnostics);

      if (info.isEncrypted) {
        toast.error(`File "${file.name}" is password encrypted. Decrypt it first.`);
        setStatus("upload");
        return;
      }

      // If it is an image to PDF workspace, treat images differently
      if (acceptTypes["image/*"] || acceptTypes["image/jpeg"]) {
        currentPages.push({
          id: Math.random().toString(36).substring(2, 9),
          originalPageNumber: 1,
          tempRotation: 0,
          fileId: info.name,
          fileName: info.name,
          buffer: info.buffer,
        });
      } else {
        // PDF parser - load page items
        for (let pIdx = 1; pIdx <= info.pageCount; pIdx++) {
          currentPages.push({
            id: Math.random().toString(36).substring(2, 9),
            originalPageNumber: pIdx,
            tempRotation: 0,
            fileId: info.name,
            fileName: info.name,
            buffer: info.buffer,
          });
        }
      }
    }

    if (currentPages.length > 0) {
      setItems(currentPages);
      setHistory([currentPages]);
      setHistoryIdx(0);
      setStatus("configure");
    }
  };

  // Reorder and selection helpers
  const handleReorder = (newItems: WorkspacePageItem[]) => {
    updateItemsWithHistory(newItems);
  };

  const handleRotate = (id: string, angleChange: number) => {
    const updated = items.map((it) => {
      if (it.id === id) {
        const nextRotation = (it.tempRotation + angleChange) % 360;
        return { ...it, tempRotation: nextRotation };
      }
      return it;
    });
    updateItemsWithHistory(updated);
  };

  const handleDelete = (id: string) => {
    const updated = items.filter((it) => it.id !== id);
    updateItemsWithHistory(updated);
  };

  const handleDuplicate = (id: string) => {
    const targetIdx = items.findIndex((it) => it.id === id);
    if (targetIdx !== -1) {
      const copy = {
        ...items[targetIdx],
        id: Math.random().toString(36).substring(2, 9),
      };
      const updated = [...items];
      updated.splice(targetIdx + 1, 0, copy);
      updateItemsWithHistory(updated);
    }
  };

  const handleToggleSelect = (id: string) => {
    const updated = items.map((it) => 
      it.id === id ? { ...it, selected: !it.selected } : it
    );
    setItems(updated);
  };

  const handleSelectAll = () => {
    setItems(items.map((it) => ({ ...it, selected: true })));
  };

  const handleDeselectAll = () => {
    setItems(items.map((it) => ({ ...it, selected: false })));
  };

  const handleDeleteSelected = () => {
    const updated = items.filter((it) => !it.selected);
    updateItemsWithHistory(updated);
  };

  const handleRotateSelected = (angle: number) => {
    const updated = items.map((it) => {
      if (it.selected) {
        return { ...it, tempRotation: (it.tempRotation + angle) % 360 };
      }
      return it;
    });
    updateItemsWithHistory(updated);
  };

  // Execute processing pipeline
  const handleExecute = async () => {
    if (items.length === 0) return;
    setStatus("processing");
    setProgress(10);
    logTelemetry("processing started");

    try {
      const resultBytes = await onProcess(items, options, setProgress);
      setOutputBytes(resultBytes);
      setOutputName(`utool-${toolId}-${Date.now()}.pdf`);
      setProgress(100);
      setStatus("success");
      logTelemetry("processing completed");
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      toast.error(err.message || "An error occurred during compilation.");
      logTelemetry("processing failed", { error: err.message });
    }
  };

  const handleDownload = async () => {
    if (!outputBytes) return;
    await exportPdfFile(outputBytes, outputName, toolId);
    logTelemetry("download completed");
  };

  const handleReset = () => {
    setItems([]);
    setHistory([]);
    setHistoryIdx(-1);
    setOutputBytes(null);
    setDiagnostics(null);
    setStatus("upload");
    setProgress(0);
  };

  return (
    <div className="w-full space-y-6">
      {/* 1. Header Information */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          {isPremium && (
            <span className="text-[10px] font-extrabold uppercase bg-amber-500 text-white px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm shadow-amber-500/20">
              <Sparkles className="h-3 w-3 fill-white" />
              {TRANSLATIONS.en.proBadge}
            </span>
          )}
          <span className="text-xs font-bold text-muted-foreground flex items-center gap-1">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            {TRANSLATIONS.en.privacyNotice}
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Upload State */}
        {status === "upload" && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="w-full"
          >
            <PDFUploader
              onFilesSelected={handleFilesSelected}
              acceptTypes={acceptTypes}
              maxSizeMB={maxSizeMB}
              maxFiles={maxFiles}
            />
          </motion.div>
        )}

        {/* Configuration State */}
        {status === "configure" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start"
          >
            {/* Main Interactive Work Area */}
            <div className="lg:col-span-3 space-y-5">
              {/* Toolbar Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/20 border border-border/40 p-3 rounded-2xl">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleUndo}
                    disabled={historyIdx <= 0}
                    className="h-9 w-9 border border-border/80 bg-white hover:bg-slate-50 text-muted-foreground hover:text-foreground rounded-xl flex items-center justify-center transition disabled:opacity-40 cursor-pointer"
                    title={TRANSLATIONS.en.undo}
                  >
                    <Undo2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleRedo}
                    disabled={historyIdx >= history.length - 1}
                    className="h-9 w-9 border border-border/80 bg-white hover:bg-slate-50 text-muted-foreground hover:text-foreground rounded-xl flex items-center justify-center transition disabled:opacity-40 cursor-pointer"
                    title={TRANSLATIONS.en.redo}
                  >
                    <Redo2 className="h-4 w-4" />
                  </button>
                  <div className="h-5 w-[1px] bg-border/80 mx-1" />
                  <button
                    onClick={handleSelectAll}
                    className="text-[10.5px] font-bold border border-border/80 bg-white hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-xl transition cursor-pointer"
                  >
                    {TRANSLATIONS.en.selectAll}
                  </button>
                  <button
                    onClick={handleDeselectAll}
                    className="text-[10.5px] font-bold border border-border/80 bg-white hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-xl transition cursor-pointer"
                  >
                    {TRANSLATIONS.en.deselectAll}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRotateSelected(90)}
                    disabled={!items.some((it) => it.selected)}
                    className="h-9 px-3 border border-border/80 bg-white hover:bg-slate-50 text-muted-foreground hover:text-foreground rounded-xl flex items-center gap-1.5 transition disabled:opacity-40 cursor-pointer text-[10.5px] font-bold"
                  >
                    <RotateCcw className="h-4 w-4" />
                    {TRANSLATIONS.en.rotate}
                  </button>
                  <button
                    onClick={handleDeleteSelected}
                    disabled={!items.some((it) => it.selected)}
                    className="h-9 px-3 border border-rose-100 hover:border-rose-300 bg-rose-50/20 hover:bg-rose-50 text-rose-500 hover:text-rose-600 rounded-xl flex items-center gap-1.5 transition disabled:opacity-40 cursor-pointer text-[10.5px] font-bold"
                  >
                    <Trash2 className="h-4 w-4" />
                    {TRANSLATIONS.en.delete}
                  </button>
                </div>
              </div>

              {/* Grid Page View */}
              <div className="border border-border/60 rounded-3xl bg-card/10 p-5 min-h-[380px] max-h-[580px] overflow-y-auto scrollbar-thin">
                {items.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-xs font-semibold py-20">
                    {TRANSLATIONS.en.noPages}
                  </div>
                ) : (
                  <PDFThumbnailGrid
                    items={items}
                    onReorder={handleReorder}
                    onRotate={handleRotate}
                    onDelete={handleDelete}
                    onDuplicate={handleDuplicate}
                    onToggleSelect={handleToggleSelect}
                    renderPageToDataUrl={renderPageToDataUrl}
                    onCardClick={onCardClick}
                  />
                )}
              </div>
            </div>

            {/* Config Sidebar Panel */}
            <div className="lg:col-span-1 h-full">
              <ToolSidebar
                title={sidebarTitle}
                actionLabel={actionLabel}
                onProcess={handleExecute}
                disabled={items.length === 0}
              >
                {renderSidebar(options, handleOptionsChange)}
              </ToolSidebar>
            </div>
          </motion.div>
        )}

        {/* Processing State */}
        {status === "processing" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 bg-card/60 border border-border/40 rounded-3xl space-y-4 shadow-sm"
          >
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <h3 className="text-sm font-bold text-foreground">
              {TRANSLATIONS.en.processingText}
            </h3>
            <div className="w-64 bg-slate-100 dark:bg-slate-800/40 h-1.5 rounded-full overflow-hidden border border-slate-200/20">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </motion.div>
        )}

        {/* Success / Complete State */}
        {status === "success" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card border border-emerald-100 bg-emerald-50/10 rounded-3xl p-8 text-center flex flex-col items-center justify-center min-h-[300px]"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 mb-5">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">
              {TRANSLATIONS.en.successTitle}
            </h3>
            <p className="mt-2 text-xs text-slate-500 max-w-sm leading-relaxed">
              {TRANSLATIONS.en.downloadReady}
            </p>

            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <button
                onClick={handleReset}
                className="rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 px-6 py-3 text-xs font-bold text-slate-600 transition flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
                Process Another File
              </button>
              <button
                onClick={handleDownload}
                className="rounded-2xl bg-emerald-600 hover:bg-emerald-500 shadow shadow-emerald-100/50 px-7 py-3 text-xs font-bold text-white transition flex items-center gap-1.5 cursor-pointer border-transparent"
              >
                <Download className="h-4 w-4" />
                Download PDF File
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Diagnostics details showing at bottom in dev for corrupt structure */}
      {diagnostics && status === "configure" && (
        <div className="p-4 rounded-2xl bg-slate-50/60 border border-slate-100 text-[10px] text-muted-foreground font-mono space-y-1">
          <p className="font-bold text-[11px] mb-1">{TRANSLATIONS.en.diagnosticsTitle}</p>
          <p>{TRANSLATIONS.en.diagnosticsHeader} {diagnostics.validHeader ? "PASS" : "FAIL"}</p>
          <p>{TRANSLATIONS.en.diagnosticsCatalog} {diagnostics.validCatalog ? "PASS" : "FAIL"}</p>
          <p>{TRANSLATIONS.en.diagnosticsEncrypted} NO</p>
        </div>
      )}
    </div>
  );
}
