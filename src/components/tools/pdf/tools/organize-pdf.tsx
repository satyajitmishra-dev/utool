"use client";

import React, { useRef, useState, useEffect } from "react";
import { PdfWorkspace } from "../shared/pdf-workspace";
import { WorkspacePageItem } from "../shared/thumbnail-grid";
import { usePdfLoader } from "../shared/hooks/use-pdf-loader";
import { toast } from "sonner";
import { Plus, UploadCloud } from "lucide-react";

export function OrganizePdfTool() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { loadPdfFile } = usePdfLoader();

  const defaultOptions = {
    mode: "save-all", // "save-all" | "extract-selected"
  };

  const renderSidebar = (options: any, setOptions: (opts: any) => void) => {
    return (
      <div className="space-y-4 text-xs text-slate-700">
        <div className="space-y-1.5">
          <label className="font-bold text-foreground">Save Configuration</label>
          <select
            value={options.mode}
            onChange={(e) => setOptions({ ...options, mode: e.target.value })}
            className="w-full border border-border/80 rounded-xl px-3 py-2 bg-white"
          >
            <option value="save-all">Save All Reorganized Pages</option>
            <option value="extract-selected">Extract Selected Pages Only</option>
          </select>
        </div>

        {/* Append Page Actions */}
        <div className="space-y-2 pt-3 border-t border-border/40">
          <span className="font-bold text-foreground block">Organize Actions</span>
          
          <button
            onClick={() => {
              // Trigger blank page insertion by raising a custom event to the workspace
              window.dispatchEvent(
                new CustomEvent("utool-organize-add-blank")
              );
            }}
            className="w-full border border-border/80 hover:border-primary/50 bg-white hover:bg-slate-50 font-bold px-3 py-2 rounded-xl text-slate-700 flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Insert Blank Page
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full border border-border/80 hover:border-primary/50 bg-white hover:bg-slate-50 font-bold px-3 py-2 rounded-xl text-slate-700 flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <UploadCloud className="h-4 w-4" /> Merge Another PDF
          </button>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={async (e) => {
              if (e.target.files && e.target.files.length > 0) {
                const info = await loadPdfFile(e.target.files[0]);
                if (info) {
                  window.dispatchEvent(
                    new CustomEvent("utool-organize-add-pdf", { detail: info })
                  );
                }
              }
            }}
            accept=".pdf"
            className="hidden"
          />
        </div>
      </div>
    );
  };

  const onProcess = async (
    items: WorkspacePageItem[],
    opts: any,
    setProgress: (val: number) => void
  ): Promise<Uint8Array> => {
    const targetItems = opts.mode === "extract-selected" 
      ? items.filter((it) => it.selected) 
      : items;

    if (targetItems.length === 0) {
      throw new Error("No pages selected for export.");
    }

    const { PDFDocument } = await import("pdf-lib");
    const outputDoc = await PDFDocument.create();

    const total = targetItems.length;
    for (let i = 0; i < total; i++) {
      const item = targetItems[i];

      if (item.originalPageNumber === -1) {
        // Create a blank A4 page
        const blank = outputDoc.addPage([595.276, 841.890]);
      } else {
        // Copy original page
        const srcDoc = await PDFDocument.load(item.buffer, { ignoreEncryption: true });
        const copied = await outputDoc.copyPages(srcDoc, [item.originalPageNumber - 1]);
        const newPage = outputDoc.addPage(copied[0]);
        if (item.tempRotation !== 0) {
          newPage.setRotation({ angle: (newPage.getRotation().angle + item.tempRotation) % 360 } as any);
        }
      }

      setProgress(Math.round(((i + 1) / total) * 85) + 10);
    }

    const compiledBytes = await outputDoc.save();
    return compiledBytes;
  };

  // Setup listeners inside a custom wrapper around workspace to handle custom insert actions
  return (
    <OrganizeWrapper
      renderSidebar={renderSidebar}
      onProcess={onProcess}
      defaultOptions={defaultOptions}
    />
  );
}

// Wrapper component to subscribe to custom events and update page items
function OrganizeWrapper({ renderSidebar, onProcess, defaultOptions }: any) {
  const [items, setItems] = useState<WorkspacePageItem[]>([]);

  useEffect(() => {
    const addBlank = () => {
      const blank: WorkspacePageItem = {
        id: Math.random().toString(36).substring(2, 9),
        originalPageNumber: -1, // Blank indicator
        tempRotation: 0,
        fileId: "blank",
        fileName: "Blank Page",
        buffer: new ArrayBuffer(0),
      };
      setItems((prev: WorkspacePageItem[]) => [...prev, blank]);
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
      setItems((prev: WorkspacePageItem[]) => [...prev, ...newPages]);
      toast.success(`Merged ${info.pageCount} pages from "${info.name}".`);
    };

    window.addEventListener("utool-organize-add-blank", addBlank);
    window.addEventListener("utool-organize-add-pdf", addPdf);

    return () => {
      window.removeEventListener("utool-organize-add-blank", addBlank);
      window.removeEventListener("utool-organize-add-pdf", addPdf);
    };
  }, []);

  return (
    <PdfWorkspace
      toolId="organize-pdf"
      sidebarTitle="Page Organizer"
      actionLabel="Save Organized PDF"
      acceptTypes={{ "application/pdf": [".pdf"] }}
      maxSizeMB={100}
      defaultOptions={defaultOptions}
      renderSidebar={renderSidebar}
      onProcess={onProcess}
    />
  );
}
