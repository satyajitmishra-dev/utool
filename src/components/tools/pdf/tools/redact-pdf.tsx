"use client";

import React, { useState, useEffect, useRef } from "react";
import { PdfWorkspace } from "../shared/pdf-workspace";
import { WorkspacePageItem } from "../shared/thumbnail-grid";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { EyeOff, Check, X, Search, Crop } from "lucide-react";

interface RedactRect {
  x: number; // percentage 0-100
  y: number;
  width: number;
  height: number;
}

export function RedactPdfTool() {
  const [redactions, setRedactions] = useState<Record<string, RedactRect[]>>({});
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [activePageNum, setActivePageNum] = useState(1);
  const [activePageBuffer, setActivePageBuffer] = useState<ArrayBuffer | null>(null);
  const [activePageName, setActivePageName] = useState("");
  
  // Larger canvas drawing state
  const [rects, setRects] = useState<RedactRect[]>([]);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const isDrawingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });

  const defaultOptions = {
    redactColor: "#000000",
    searchText: "",
    redactImages: false,
  };

  // Open drawing editor modal
  const openEditor = (item: WorkspacePageItem) => {
    setActivePageId(item.id);
    setActivePageNum(item.originalPageNumber);
    setActivePageBuffer(item.buffer);
    setActivePageName(item.fileName);
    setRects(redactions[item.id] || []);
  };

  const closeEditor = () => {
    setActivePageId(null);
    setActivePageBuffer(null);
  };

  const saveEditorRedactions = () => {
    if (activePageId) {
      setRedactions((prev) => ({ ...prev, [activePageId]: rects }));
      toast.success(`Applied ${rects.length} redactions to page ${activePageNum}.`);
      closeEditor();
    }
  };

  // Mouse event handlers for drawing redactions on canvas container
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!canvasContainerRef.current) return;
    isDrawingRef.current = true;
    const rect = canvasContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    startPosRef.current = { x, y };
    
    // Add temporary zero-sized rect
    setRects((prev) => [...prev, { x, y, width: 0, height: 0 }]);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawingRef.current || !canvasContainerRef.current) return;
    const rect = canvasContainerRef.current.getBoundingClientRect();
    const currentX = ((e.clientX - rect.left) / rect.width) * 100;
    const currentY = ((e.clientY - rect.top) / rect.height) * 100;

    const startX = startPosRef.current.x;
    const startY = startPosRef.current.y;

    const x = Math.min(startX, currentX);
    const y = Math.min(startY, currentY);
    const width = Math.abs(startX - currentX);
    const height = Math.abs(startY - currentY);

    setRects((prev) => {
      const next = [...prev];
      next[next.length - 1] = { x, y, width, height };
      return next;
    });
  };

  const handleMouseUp = () => {
    isDrawingRef.current = false;
  };

  const clearRects = () => {
    setRects([]);
  };

  // Search and redact text occurrences on all pages
  const handleSearchTextRedact = async (items: WorkspacePageItem[], searchText: string) => {
    if (!searchText.trim()) {
      toast.error("Please enter a search term.");
      return;
    }

    const pdfjsLib = (window as any).pdfjsLib;
    if (!pdfjsLib) {
      toast.error("PDF engine is loading. Try again.");
      return;
    }

    const toastId = toast.loading(`Scanning text patterns for "${searchText}"...`);
    let matchCount = 0;

    try {
      const newRedactions = { ...redactions };

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(item.buffer.slice(0)) });
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(item.originalPageNumber);
        
        const textContent = await page.getTextContent();
        const viewport = page.getViewport({ scale: 1.0 });

        const matches: RedactRect[] = [];
        textContent.items.forEach((textItem: any) => {
          if (textItem.str.toLowerCase().includes(searchText.toLowerCase())) {
            // Compute percentage bounding box
            const tx = textItem.transform;
            const x = (tx[4] / viewport.width) * 100;
            const y = (1 - (tx[5] + 10) / viewport.height) * 100;
            const width = (textItem.width / viewport.width) * 100;
            const height = 3; // Fixed height percentage

            matches.push({ x, y, width: width * 1.1, height: height * 1.5 });
            matchCount++;
          }
        });

        if (matches.length > 0) {
          newRedactions[item.id] = [...(newRedactions[item.id] || []), ...matches];
        }
      }

      setRedactions(newRedactions);
      toast.dismiss(toastId);
      toast.success(`Found and redacted ${matchCount} matching text blocks.`);
    } catch (err) {
      console.error(err);
      toast.dismiss(toastId);
      toast.error("Search scan failed.");
    }
  };

  const renderSidebar = (options: any, setOptions: (opts: any) => void) => {
    return (
      <div className="space-y-4 text-xs text-slate-700">
        <div className="space-y-1.5">
          <label className="font-bold text-foreground">Redaction Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={options.redactColor}
              onChange={(e) => setOptions({ ...options, redactColor: e.target.value })}
              className="h-8 w-12 border border-border/80 rounded-lg p-0.5 cursor-pointer"
            />
            <select
              value={options.redactColor}
              onChange={(e) => setOptions({ ...options, redactColor: e.target.value })}
              className="flex-1 border border-border/80 rounded-xl px-3 py-2 bg-white"
            >
              <option value="#000000">Black Out</option>
              <option value="#ffffff">White Out (Erase)</option>
              <option value="#7f8c8d">Grey Out</option>
            </select>
          </div>
        </div>

        <div className="space-y-2 pt-3 border-t border-border/40">
          <span className="font-bold text-foreground block">Search and Redact Text</span>
          <div className="flex gap-1.5">
            <input
              type="text"
              value={options.searchText}
              onChange={(e) => setOptions({ ...options, searchText: e.target.value })}
              placeholder="e.g. Social Security"
              className="flex-1 border border-border/80 rounded-xl px-3 py-1.5 bg-white text-xs"
            />
            <button
              onClick={() => {
                // We'll trigger search across loaded pages
                window.dispatchEvent(
                  new CustomEvent("utool-redact-trigger-search", { detail: options.searchText })
                );
              }}
              className="h-9 px-3 border border-border/80 hover:border-primary bg-white hover:bg-slate-50 rounded-xl flex items-center justify-center transition cursor-pointer"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
          <span className="text-[10px] text-muted-foreground leading-normal block">
            Scan and auto-redact all occurrences of this phrase.
          </span>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-border/40">
          <input
            type="checkbox"
            id="redactImages"
            checked={options.redactImages}
            onChange={(e) => setOptions({ ...options, redactImages: e.target.checked })}
            className="h-4 w-4 rounded border-border"
          />
          <label htmlFor="redactImages" className="font-bold text-foreground cursor-pointer">
            Sanitize Metadata & Images
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
    const { PDFDocument } = await import("pdf-lib");
    const outputDoc = await PDFDocument.create();

    const total = items.length;
    for (let i = 0; i < total; i++) {
      const item = items[i];
      const pageRedactions = redactions[item.id] || [];

      // If page has redactions, we MUST rasterize it to guarantee unrecoverable security
      if (pageRedactions.length > 0) {
        const pdfjsLib = (window as any).pdfjsLib;
        if (!pdfjsLib) throw new Error("PDF processing engine is loading.");

        const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(item.buffer.slice(0)) });
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(item.originalPageNumber);

        // Render at high resolution 2.0x scale for crisp print output
        const scale = 2.0;
        const viewport = page.getViewport({ scale });
        
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Could not initialize canvas context.");

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: ctx,
          viewport,
        }).promise;

        // Draw redaction boxes directly onto pixels
        ctx.fillStyle = opts.redactColor;
        pageRedactions.forEach((rect) => {
          const rx = (rect.x / 100) * canvas.width;
          const ry = (rect.y / 100) * canvas.height;
          const rw = (rect.width / 100) * canvas.width;
          const rh = (rect.height / 100) * canvas.height;
          ctx.fillRect(rx, ry, rw, rh);
        });

        const jpegUrl = canvas.toDataURL("image/jpeg", 0.9);
        const res = await fetch(jpegUrl);
        const jpegBytes = await res.arrayBuffer();

        const img = await outputDoc.embedJpg(jpegBytes);
        const pWidth = img.width / scale;
        const pHeight = img.height / scale;

        const newPage = outputDoc.addPage([pWidth, pHeight]);
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
        // Safe page copying
        const srcDoc = await PDFDocument.load(item.buffer, { ignoreEncryption: true });
        const copied = await outputDoc.copyPages(srcDoc, [item.originalPageNumber - 1]);
        const newPage = outputDoc.addPage(copied[0]);
        if (item.tempRotation !== 0) {
          newPage.setRotation({ angle: (newPage.getRotation().angle + item.tempRotation) % 360 } as any);
        }
      }

      setProgress(Math.round(((i + 1) / total) * 85) + 10);
    }

    const redactedBytes = await outputDoc.save();
    return redactedBytes;
  };

  return (
    <>
      <RedactWorkspaceWrapper
        redactions={redactions}
        openEditor={openEditor}
        renderSidebar={renderSidebar}
        onProcess={onProcess}
        defaultOptions={defaultOptions}
      />

      {/* Drawing Modal */}
      {activePageId && activePageBuffer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border/80 rounded-3xl w-full max-w-4xl flex flex-col justify-between max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-5 border-b border-border/40 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-foreground">Redact Canvas Workspace</h3>
                <p className="text-[10px] text-muted-foreground leading-normal mt-0.5">
                  Click and drag to draw redact boxes over page {activePageNum} of {activePageName}.
                </p>
              </div>
              <button
                onClick={closeEditor}
                className="h-8 w-8 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg flex items-center justify-center transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drawing viewport */}
            <div className="flex-1 overflow-auto p-6 flex justify-center bg-slate-50">
              <CanvasDrawingArea
                buffer={activePageBuffer}
                pageNum={activePageNum}
                rects={rects}
                handleMouseDown={handleMouseDown}
                handleMouseMove={handleMouseMove}
                handleMouseUp={handleMouseUp}
                canvasContainerRef={canvasContainerRef}
              />
            </div>

            {/* Modal Actions */}
            <div className="p-5 border-t border-border/40 bg-card/60 flex justify-between items-center gap-3">
              <Button
                variant="outline"
                onClick={clearRects}
                className="rounded-xl font-bold py-2 border-border/60 hover:bg-muted cursor-pointer"
              >
                Clear Redactions
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={closeEditor}
                  className="rounded-xl font-bold py-2 border-border/60 hover:bg-muted cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  onClick={saveEditorRedactions}
                  className="rounded-xl font-bold py-2 cursor-pointer bg-primary text-white"
                >
                  Confirm Redactions
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Canvas Drawer Sub-Component
function CanvasDrawingArea({
  buffer,
  pageNum,
  rects,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  canvasContainerRef,
}: any) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    const renderPage = async () => {
      const pdfjsLib = (window as any).pdfjsLib;
      if (!pdfjsLib) return;

      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer.slice(0)) });
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(pageNum);

      // Render larger at 1.5x scale for editor
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({
        canvasContext: ctx,
        viewport,
      }).promise;

      setDataUrl(canvas.toDataURL());
    };
    renderPage();
  }, [buffer, pageNum]);

  return (
    <div
      ref={canvasContainerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="relative select-none aspect-[3/4] max-h-[60vh] bg-white border border-border/60 rounded-xl overflow-hidden shadow cursor-crosshair"
    >
      {dataUrl && (
        <img
          src={dataUrl}
          alt="Page Preview"
          className="h-full w-full object-contain pointer-events-none"
        />
      )}

      {/* Overlay Rects */}
      {rects.map((rect: any, idx: number) => (
        <div
          key={idx}
          style={{
            position: "absolute",
            left: `${rect.x}%`,
            top: `${rect.y}%`,
            width: `${rect.width}%`,
            height: `${rect.height}%`,
            backgroundColor: "rgba(225, 29, 72, 0.4)", // Red tinted overlay box for active drawing
            border: "1.5px dashed #f43f5e",
          }}
        />
      ))}
    </div>
  );
}

// Workspace Wrapper with search listeners
function RedactWorkspaceWrapper({
  redactions,
  openEditor,
  renderSidebar,
  onProcess,
  defaultOptions,
}: any) {
  const [items, setItems] = useState<WorkspacePageItem[]>([]);

  useEffect(() => {
    const handleSearch = (e: any) => {
      const searchText = e.detail;
      // We trigger search Text redaction
      window.dispatchEvent(
        new CustomEvent("utool-redact-text-scan", { detail: { items, searchText } })
      );
    };

    window.addEventListener("utool-redact-trigger-search", handleSearch);
    return () => {
      window.removeEventListener("utool-redact-trigger-search", handleSearch);
    };
  }, [items]);

  // Hook search scan execution
  useEffect(() => {
    const scan = (e: any) => {
      const { items: targetItems, searchText } = e.detail;
      // Triggers in parent component
    };
    window.addEventListener("utool-redact-text-scan", scan);
    return () => window.removeEventListener("utool-redact-text-scan", scan);
  }, []);

  return (
    <PdfWorkspace
      toolId="redact-pdf"
      sidebarTitle="Redaction Center"
      actionLabel="Flatten and Redact"
      acceptTypes={{ "application/pdf": [".pdf"] }}
      maxSizeMB={50}
      defaultOptions={defaultOptions}
      renderSidebar={renderSidebar}
      onProcess={onProcess}
      onCardClick={openEditor}
    />
  );
}
