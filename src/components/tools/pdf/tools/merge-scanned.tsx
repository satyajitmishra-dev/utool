"use client";

import React from "react";
import { PdfWorkspace } from "../shared/pdf-workspace";
import { WorkspacePageItem } from "../shared/thumbnail-grid";
import { toast } from "sonner";

export function MergeScannedTool() {
  const defaultOptions = {
    pagesRange: "all", // "all" | "selected"
    optimize: true,
    compression: "medium", // "none" | "low" | "medium" | "high"
    preserveSize: true,
  };

  const renderSidebar = (options: any, setOptions: (opts: any) => void) => {
    return (
      <div className="space-y-4 text-xs text-slate-700">
        <div className="space-y-1.5">
          <label className="font-bold text-foreground">Merge Target Pages</label>
          <select
            value={options.pagesRange}
            onChange={(e) => setOptions({ ...options, pagesRange: e.target.value })}
            className="w-full border border-border/80 rounded-xl px-3 py-2 bg-white"
          >
            <option value="all">Merge All Pages</option>
            <option value="selected">Merge Selected Pages Only</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-foreground">Scanned Optimization</label>
          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              id="optimize"
              checked={options.optimize}
              onChange={(e) => setOptions({ ...options, optimize: e.target.checked })}
              className="h-4 w-4 rounded border-border mt-0.5"
            />
            <label htmlFor="optimize" className="leading-tight text-slate-600 cursor-pointer">
              <strong>Optimize output</strong><br />
              Rebuild document structures and clean metadata.
            </label>
          </div>
        </div>

        {options.optimize && (
          <div className="space-y-1.5 pl-6">
            <label className="font-bold text-foreground">Image Compression Level</label>
            <select
              value={options.compression}
              onChange={(e) => setOptions({ ...options, compression: e.target.value })}
              className="w-full border border-border/80 rounded-xl px-3 py-2 bg-white"
            >
              <option value="none">Preserve Quality (No Compression)</option>
              <option value="low">Low Compression (Large File Size)</option>
              <option value="medium">Medium Compression (Balanced)</option>
              <option value="high">High Compression (Minimum File Size)</option>
            </select>
          </div>
        )}

        <div className="flex items-center gap-2 pt-2 border-t border-border/40">
          <input
            type="checkbox"
            id="preserveSize"
            checked={options.preserveSize}
            onChange={(e) => setOptions({ ...options, preserveSize: e.target.checked })}
            className="h-4 w-4 rounded border-border"
          />
          <label htmlFor="preserveSize" className="font-bold text-foreground cursor-pointer">
            Preserve Original Page Dimensions
          </label>
        </div>
      </div>
    );
  };

  const onProcess = async (
    items: WorkspacePageItem[],
    opts: any,
    setProgress: (val: number) => void
  ): Promise<Uint8Array> => {
    // Filter target pages
    const targetItems = opts.pagesRange === "selected" 
      ? items.filter((it) => it.selected) 
      : items;

    if (targetItems.length === 0) {
      throw new Error("No pages selected for merging. Please select pages first.");
    }

    const { PDFDocument } = await import("pdf-lib");
    const mergedDoc = await PDFDocument.create();

    const total = targetItems.length;

    // Detect duplicates in uploads
    const fileHashes = new Set<string>();
    targetItems.forEach((it) => fileHashes.add(`${it.fileName}-${it.originalPageNumber}`));
    if (fileHashes.size < targetItems.length) {
      toast.warning("Duplicate pages detected in merge sequence.");
    }

    for (let i = 0; i < total; i++) {
      const item = targetItems[i];
      const srcDoc = await PDFDocument.load(item.buffer, { ignoreEncryption: true });

      // If optimize compression is checked, we rasterize scanned pages to shrink sizes
      if (opts.optimize && opts.compression !== "none") {
        // Load PDF.js dynamically
        const pdfjsLib = (window as any).pdfjsLib;
        if (!pdfjsLib) throw new Error("PDF processing engine is loading. Please retry.");

        const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(item.buffer.slice(0)) });
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(item.originalPageNumber);

        // Adjust scale relative to compression level
        let scale = 1.5; // Medium
        let quality = 0.8;
        if (opts.compression === "low") {
          scale = 2.0;
          quality = 0.9;
        } else if (opts.compression === "high") {
          scale = 1.0;
          quality = 0.65;
        }

        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Could not initialize canvas.");

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: ctx,
          viewport,
        }).promise;

        const jpegUrl = canvas.toDataURL("image/jpeg", quality);
        const res = await fetch(jpegUrl);
        const jpegBytes = await res.arrayBuffer();

        const img = await mergedDoc.embedJpg(jpegBytes);
        
        let pWidth = 595.276;
        let pHeight = 841.890;

        if (opts.preserveSize) {
          pWidth = img.width / scale;
          pHeight = img.height / scale;
        }

        const newPage = mergedDoc.addPage([pWidth, pHeight]);
        newPage.drawImage(img, {
          x: 0,
          y: 0,
          width: pWidth,
          height: pHeight,
        });

        // Clean canvas
        canvas.width = 0;
        canvas.height = 0;
      } else {
        // Standard copy page
        const copied = await mergedDoc.copyPages(srcDoc, [item.originalPageNumber - 1]);
        const newPage = mergedDoc.addPage(copied[0]);
        if (item.tempRotation !== 0) {
          newPage.setRotation({ angle: (newPage.getRotation().angle + item.tempRotation) % 360 } as any);
        }
      }

      setProgress(Math.round(((i + 1) / total) * 85) + 10);
    }

    const mergedBytes = await mergedDoc.save({ useObjectStreams: !opts.optimize });
    return mergedBytes;
  };

  return (
    <PdfWorkspace
      toolId="merge-scanned-pdfs"
      sidebarTitle="Scanned PDF Merger"
      actionLabel="Compile scanned pages"
      acceptTypes={{ "application/pdf": [".pdf"] }}
      maxSizeMB={100}
      maxFiles={50}
      defaultOptions={defaultOptions}
      renderSidebar={renderSidebar}
      onProcess={onProcess}
    />
  );
}
