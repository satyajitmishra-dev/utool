"use client";

import React from "react";
import { PdfWorkspace } from "../shared/pdf-workspace";
import { WorkspacePageItem } from "../shared/thumbnail-grid";
import { RefreshCw, RotateCw } from "lucide-react";

export function RotatePdfTool() {
  const defaultOptions = {
    angle: 90,
    target: "all",
  };

  const renderSidebar = (options: any, setOptions: (opts: any) => void) => {
    const handleApply = () => {
      window.dispatchEvent(
        new CustomEvent("utool-pdf-rotate-apply", {
          detail: {
            target: options.target,
            angle: options.angle,
          },
        })
      );
    };

    return (
      <div className="space-y-4 text-xs text-slate-700">
        <div className="space-y-1.5">
          <label className="font-bold text-foreground">Rotate Angle</label>
          <select
            value={options.angle}
            onChange={(e) => setOptions({ ...options, angle: parseInt(e.target.value) })}
            className="w-full border border-border/80 rounded-xl px-3 py-2 bg-white"
          >
            <option value={90}>90° Clockwise</option>
            <option value={180}>180°</option>
            <option value={270}>90° Counter-Clockwise</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-foreground">Page Range Selection</label>
          <select
            value={options.target}
            onChange={(e) => setOptions({ ...options, target: e.target.value })}
            className="w-full border border-border/80 rounded-xl px-3 py-2 bg-white"
          >
            <option value="all">All Pages</option>
            <option value="selected">Selected Pages Only</option>
            <option value="odd">Odd Pages Only (1, 3, 5...)</option>
            <option value="even">Even Pages Only (2, 4, 6...)</option>
          </select>
        </div>

        <button
          onClick={handleApply}
          className="w-full mt-2 border border-border/80 hover:border-primary/50 bg-white hover:bg-slate-50 font-bold px-3 py-2.5 rounded-xl text-slate-700 flex items-center justify-center gap-1.5 transition cursor-pointer"
        >
          <RotateCw className="h-4 w-4" /> Apply Rotation to Preview
        </button>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-[10.5px] leading-relaxed text-muted-foreground mt-4">
          <span className="font-bold text-slate-700 block mb-1">💡 Interactive Rotation</span>
          You can also rotate individual pages by hovering over any page card in the preview grid and clicking the rotate icon (<RefreshCw className="h-3 w-3 inline" />).
        </div>
      </div>
    );
  };

  const onProcess = async (
    items: WorkspacePageItem[],
    opts: any,
    setProgress: (val: number) => void
  ): Promise<Uint8Array> => {
    if (items.length === 0) throw new Error("No PDF loaded for rotation.");

    const { PDFDocument } = await import("pdf-lib");
    const outputDoc = await PDFDocument.create();
    const total = items.length;

    for (let i = 0; i < total; i++) {
      const item = items[i];

      if (item.originalPageNumber === -1) {
        // Blank page (shouldn't really exist in rotate tool, but support it)
        outputDoc.addPage([595.276, 841.890]);
      } else {
        const srcDoc = await PDFDocument.load(item.buffer, { ignoreEncryption: true });
        const copied = await outputDoc.copyPages(srcDoc, [item.originalPageNumber - 1]);
        const newPage = outputDoc.addPage(copied[0]);
        
        if (item.tempRotation !== 0) {
          newPage.setRotation({
            angle: (newPage.getRotation().angle + item.tempRotation) % 360,
          } as any);
        }
      }

      setProgress(Math.round(((i + 1) / total) * 85) + 10);
    }

    const compiledBytes = await outputDoc.save();
    return compiledBytes;
  };

  return (
    <PdfWorkspace
      toolId="rotate-pdf"
      sidebarTitle="Rotation Options"
      actionLabel="Rotate PDF document"
      acceptTypes={{ "application/pdf": [".pdf"] }}
      maxSizeMB={100}
      defaultOptions={defaultOptions}
      renderSidebar={renderSidebar}
      onProcess={onProcess}
    />
  );
}
