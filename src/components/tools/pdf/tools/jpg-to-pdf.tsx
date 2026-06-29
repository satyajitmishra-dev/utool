"use client";

import React from "react";
import { PdfWorkspace } from "../shared/pdf-workspace";
import { WorkspacePageItem } from "../shared/thumbnail-grid";

export function JpgToPdfTool() {
  const defaultOptions = {
    pageSize: "A4",
    orientation: "portrait",
    margin: "none",
    fit: "fit",
    bgColor: "#ffffff",
    pageNumbers: false,
    title: "",
    author: "",
    subject: "",
  };

  const renderSidebar = (options: any, setOptions: (opts: any) => void) => {
    return (
      <div className="space-y-4 text-xs text-slate-700">
        {/* Page settings */}
        <div className="space-y-1.5">
          <label className="font-bold text-foreground">Page Size</label>
          <select
            value={options.pageSize}
            onChange={(e) => setOptions({ ...options, pageSize: e.target.value })}
            className="w-full border border-border/80 rounded-xl px-3 py-2 bg-white"
          >
            <option value="A4">A4 (210 x 297 mm)</option>
            <option value="letter">Letter (8.5 x 11 in)</option>
            <option value="legal">Legal (8.5 x 14 in)</option>
            <option value="original">Original Image Dimensions</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-foreground">Orientation</label>
          <select
            value={options.orientation}
            onChange={(e) => setOptions({ ...options, orientation: e.target.value })}
            className="w-full border border-border/80 rounded-xl px-3 py-2 bg-white"
          >
            <option value="portrait">Portrait</option>
            <option value="landscape">Landscape</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-foreground">Margins</label>
          <select
            value={options.margin}
            onChange={(e) => setOptions({ ...options, margin: e.target.value })}
            className="w-full border border-border/80 rounded-xl px-3 py-2 bg-white"
          >
            <option value="none">None (0mm)</option>
            <option value="small">Small (5mm)</option>
            <option value="normal">Normal (12mm)</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-foreground">Image Layout</label>
          <select
            value={options.fit}
            onChange={(e) => setOptions({ ...options, fit: e.target.value })}
            className="w-full border border-border/80 rounded-xl px-3 py-2 bg-white"
          >
            <option value="fit">Fit (Best Ratio)</option>
            <option value="fill">Fill Entire Page</option>
          </select>
        </div>

        {/* Background color */}
        <div className="space-y-1.5">
          <label className="font-bold text-foreground">Background Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={options.bgColor}
              onChange={(e) => setOptions({ ...options, bgColor: e.target.value })}
              className="h-8 w-12 border border-border/80 rounded-lg p-0.5 cursor-pointer"
            />
            <input
              type="text"
              value={options.bgColor}
              onChange={(e) => setOptions({ ...options, bgColor: e.target.value })}
              className="flex-1 border border-border/80 rounded-xl px-3 py-1.5 bg-white uppercase font-mono text-[11px]"
            />
          </div>
        </div>

        {/* Options */}
        <div className="flex items-center gap-2 pt-2 border-t border-border/40">
          <input
            type="checkbox"
            id="pageNumbers"
            checked={options.pageNumbers}
            onChange={(e) => setOptions({ ...options, pageNumbers: e.target.checked })}
            className="h-4 w-4 rounded border-border"
          />
          <label htmlFor="pageNumbers" className="font-bold text-foreground cursor-pointer">
            Add Auto Page Numbers
          </label>
        </div>

        {/* Metadata section */}
        <div className="space-y-3 pt-3 border-t border-border/40">
          <span className="font-bold text-foreground block">PDF Document Metadata</span>
          
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase">Document Title</label>
            <input
              type="text"
              value={options.title}
              onChange={(e) => setOptions({ ...options, title: e.target.value })}
              placeholder="e.g. Invoices Summary"
              className="w-full border border-border/80 rounded-xl px-3 py-1.5 bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase">Author</label>
            <input
              type="text"
              value={options.author}
              onChange={(e) => setOptions({ ...options, author: e.target.value })}
              placeholder="e.g. John Doe"
              className="w-full border border-border/80 rounded-xl px-3 py-1.5 bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase">Subject</label>
            <input
              type="text"
              value={options.subject}
              onChange={(e) => setOptions({ ...options, subject: e.target.value })}
              placeholder="e.g. Accounting Records"
              className="w-full border border-border/80 rounded-xl px-3 py-1.5 bg-white"
            />
          </div>
        </div>
      </div>
    );
  };

  const onProcess = async (
    items: WorkspacePageItem[],
    opts: any,
    setProgress: (val: number) => void
  ): Promise<Uint8Array> => {
    const { PDFDocument, rgb } = await import("pdf-lib");
    const pdfDoc = await PDFDocument.create();

    // Set metadata tags
    if (opts.title) pdfDoc.setTitle(opts.title);
    if (opts.author) pdfDoc.setAuthor(opts.author);
    if (opts.subject) pdfDoc.setSubject(opts.subject);

    // Convert hex color to rgb
    const hexToRgb = (hex: string) => {
      const r = parseInt(hex.substring(1, 3), 16) / 255;
      const g = parseInt(hex.substring(3, 5), 16) / 255;
      const b = parseInt(hex.substring(5, 7), 16) / 255;
      return rgb(r, g, b);
    };
    const bgColor = hexToRgb(opts.bgColor || "#ffffff");

    const total = items.length;
    for (let i = 0; i < total; i++) {
      const item = items[i];

      // Convert image source buffer to JPEG
      const blob = new Blob([item.buffer]);
      const imgUrl = URL.createObjectURL(blob);
      
      const img = new Image();
      img.src = imgUrl;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      URL.revokeObjectURL(imgUrl);

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context initialization failed.");

      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);

      const jpegDataUrl = canvas.toDataURL("image/jpeg", 0.9);
      const res = await fetch(jpegDataUrl);
      const jpegBytes = await res.arrayBuffer();

      const embeddedImage = await pdfDoc.embedJpg(jpegBytes);
      const imgWidth = embeddedImage.width;
      const imgHeight = embeddedImage.height;

      // Determine page dimensions
      let pageWidth = 595.276; // A4 default
      let pageHeight = 841.890;
      
      if (opts.pageSize === "letter") {
        pageWidth = 612;
        pageHeight = 792;
      } else if (opts.pageSize === "legal") {
        pageWidth = 612;
        pageHeight = 1008;
      } else if (opts.pageSize === "original") {
        pageWidth = imgWidth;
        pageHeight = imgHeight;
      }

      if (opts.orientation === "landscape" && opts.pageSize !== "original") {
        const temp = pageWidth;
        pageWidth = pageHeight;
        pageHeight = temp;
      }

      const page = pdfDoc.addPage([pageWidth, pageHeight]);

      // Fill background
      page.drawRectangle({
        x: 0,
        y: 0,
        width: pageWidth,
        height: pageHeight,
        color: bgColor,
      });

      // Margins
      let marginOffset = 0;
      if (opts.margin === "small") marginOffset = 15;
      if (opts.margin === "normal") marginOffset = 34;

      const availWidth = pageWidth - (marginOffset * 2);
      const availHeight = pageHeight - (marginOffset * 2);

      let drawWidth = availWidth;
      let drawHeight = availHeight;
      let x = marginOffset;
      let y = marginOffset;

      if (opts.fit === "fit") {
        const ratio = Math.min(availWidth / imgWidth, availHeight / imgHeight);
        drawWidth = imgWidth * ratio;
        drawHeight = imgHeight * ratio;
        x = marginOffset + (availWidth - drawWidth) / 2;
        y = marginOffset + (availHeight - drawHeight) / 2;
      }

      page.drawImage(embeddedImage, {
        x,
        y,
        width: drawWidth,
        height: drawHeight,
      });

      // Auto page number
      if (opts.pageNumbers) {
        page.drawText(`${i + 1}`, {
          x: pageWidth / 2 - 5,
          y: 20,
          size: 9,
          color: rgb(0.5, 0.5, 0.5),
        });
      }

      setProgress(Math.round(((i + 1) / total) * 80) + 10);
    }

    const compiledBytes = await pdfDoc.save();
    return compiledBytes;
  };

  return (
    <PdfWorkspace
      toolId="jpg-to-pdf"
      sidebarTitle="Image Configurator"
      actionLabel="Compile images to PDF"
      acceptTypes={{ "image/*": [".jpg", ".jpeg", ".png", ".webp"] }}
      maxSizeMB={50}
      defaultOptions={defaultOptions}
      renderSidebar={renderSidebar}
      onProcess={onProcess}
    />
  );
}
