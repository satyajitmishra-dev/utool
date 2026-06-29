"use client";

import React, { useState, useEffect, useRef } from "react";
import { PdfWorkspace } from "../shared/pdf-workspace";
import { WorkspacePageItem } from "../shared/thumbnail-grid";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PenTool, Type, Calendar, Trash2, Check, X, Move } from "lucide-react";

interface SignatureStamp {
  id: string;
  x: number; // percentage of page width
  y: number; // percentage of page height
  width: number; // percentage of page width
  height: number; // percentage of page height
  dataUrl: string;
}

export function SignPdfTool() {
  const [signatures, setSignatures] = useState<Record<string, SignatureStamp[]>>({});
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [activePageNum, setActivePageNum] = useState(1);
  const [activePageBuffer, setActivePageBuffer] = useState<ArrayBuffer | null>(null);
  const [activePageName, setActivePageName] = useState("");

  const defaultOptions = {
    flatten: true,
  };

  const openEditor = (item: WorkspacePageItem) => {
    setActivePageId(item.id);
    setActivePageNum(item.originalPageNumber);
    setActivePageBuffer(item.buffer);
    setActivePageName(item.fileName);
  };

  const closeEditor = () => {
    setActivePageId(null);
    setActivePageBuffer(null);
  };

  const renderSidebar = (options: any, setOptions: (opts: any) => void) => {
    // Count total signatures
    const totalSigs = Object.values(signatures).reduce((acc, sigs) => acc + sigs.length, 0);

    return (
      <div className="space-y-4 text-xs text-slate-700">
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
          <span className="font-bold text-foreground block">Signature Status</span>
          <div className="space-y-1.5 leading-normal">
            <p className="flex items-center justify-between">
              <span>Signatures Placed:</span>
              <span className={`font-bold ${totalSigs > 0 ? "text-emerald-600" : "text-slate-500"}`}>
                {totalSigs} {totalSigs === 1 ? "stamp" : "stamps"}
              </span>
            </p>
            <p className="flex items-center justify-between">
              <span>Flatten PDF:</span>
              <span className="font-bold text-indigo-600">ENABLED</span>
            </p>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="flatten"
              checked={options.flatten}
              onChange={(e) => setOptions({ ...options, flatten: e.target.checked })}
              className="h-4 w-4 rounded border-border"
            />
            <label htmlFor="flatten" className="font-bold text-foreground cursor-pointer">
              Permanently Flatten Signature
            </label>
          </div>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Flattening compiles signature elements directly into the page stream, preventing edits or extractions.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-indigo-50/40 border border-indigo-100/30 text-[10.5px] leading-relaxed text-indigo-700 mt-4">
          <span className="font-bold block mb-1">✍️ How to sign:</span>
          Click on any page in the preview workspace to open the signature canvas creator and place your annotations.
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

      if (item.originalPageNumber === -1) {
        // Create blank A4 page
        outputDoc.addPage([595.276, 841.890]);
      } else {
        const srcDoc = await PDFDocument.load(item.buffer, { ignoreEncryption: true });
        const copied = await outputDoc.copyPages(srcDoc, [item.originalPageNumber - 1]);
        const newPage = outputDoc.addPage(copied[0]);

        // Apply rotation if any
        if (item.tempRotation !== 0) {
          newPage.setRotation({
            angle: (newPage.getRotation().angle + item.tempRotation) % 360,
          } as any);
        }

        // Apply placed signatures
        const pageSigs = signatures[item.id] || [];
        for (const sig of pageSigs) {
          try {
            const img = await outputDoc.embedPng(sig.dataUrl);
            
            // Flip Y coordinates for bottom-left origin pdf-lib
            const pdfW = (sig.width / 100) * newPage.getWidth();
            const pdfH = (sig.height / 100) * newPage.getHeight();
            const pdfX = (sig.x / 100) * newPage.getWidth();
            const pdfY = (1 - (sig.y + sig.height) / 100) * newPage.getHeight();

            newPage.drawImage(img, {
              x: pdfX,
              y: pdfY,
              width: pdfW,
              height: pdfH,
            });
          } catch (err) {
            console.error("Failed to embed signature stamp:", err);
          }
        }
      }

      setProgress(Math.round(((i + 1) / total) * 85) + 10);
    }

    const compiledBytes = await outputDoc.save();
    return compiledBytes;
  };

  return (
    <>
      <PdfWorkspace
        toolId="sign-pdf"
        sidebarTitle="Sign Config"
        actionLabel="Sign PDF document"
        acceptTypes={{ "application/pdf": [".pdf"] }}
        maxSizeMB={50}
        defaultOptions={defaultOptions}
        renderSidebar={renderSidebar}
        onProcess={onProcess}
        onCardClick={openEditor}
        isPremium={true}
      />

      {activePageId && activePageBuffer && (
        <SignatureModal
          pageNum={activePageNum}
          buffer={activePageBuffer}
          initialStamps={signatures[activePageId] || []}
          onSave={(stamps) => {
            setSignatures((prev) => ({ ...prev, [activePageId]: stamps }));
            toast.success(`Successfully saved ${stamps.length} signature elements to page ${activePageNum}.`);
            closeEditor();
          }}
          onClose={closeEditor}
        />
      )}
    </>
  );
}

// Modal component for designing and placing signatures
function SignatureModal({
  pageNum,
  buffer,
  initialStamps,
  onSave,
  onClose,
}: {
  pageNum: number;
  buffer: ArrayBuffer;
  initialStamps: SignatureStamp[];
  onSave: (stamps: SignatureStamp[]) => void;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"draw" | "type" | "date">("draw");
  const [drawColor, setDrawColor] = useState("#000000");
  const [brushWidth, setBrushWidth] = useState(3);
  const [typedName, setTypedName] = useState("");
  const [typedFont, setTypedFont] = useState("cursive");
  const [customText, setCustomText] = useState(new Date().toLocaleDateString());
  
  // Placed stamps state
  const [stamps, setStamps] = useState<SignatureStamp[]>(initialStamps);
  const [selectedStampId, setSelectedStampId] = useState<string | null>(null);
  
  // Render page preview
  const [pageDataUrl, setPageDataUrl] = useState<string | null>(null);
  const pageContainerRef = useRef<HTMLDivElement>(null);

  // Drawing Pad Canvas
  const padCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawingPad, setIsDrawingPad] = useState(false);
  const padCtxRef = useRef<CanvasRenderingContext2D | null>(null);

  // Generate page preview dataUrl
  useEffect(() => {
    const renderPage = async () => {
      const pdfjsLib = (window as any).pdfjsLib;
      if (!pdfjsLib) return;

      try {
        const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer.slice(0)) });
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(pageNum);

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

        setPageDataUrl(canvas.toDataURL());
      } catch (err) {
        console.error("PDFJS render error in modal:", err);
      }
    };
    renderPage();
  }, [buffer, pageNum]);

  // Set drawing context
  const clearPad = () => {
    const canvas = padCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  // Drawing pad events
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = padCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = drawColor;
    ctx.lineWidth = brushWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    padCtxRef.current = ctx;

    const rect = canvas.getBoundingClientRect();
    const x = ("touches" in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ("touches" in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawingPad(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingPad || !padCtxRef.current || !padCanvasRef.current) return;
    const canvas = padCanvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const x = ("touches" in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ("touches" in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    padCtxRef.current.lineTo(x, y);
    padCtxRef.current.stroke();
  };

  const stopDrawing = () => {
    setIsDrawingPad(false);
    if (padCtxRef.current) {
      padCtxRef.current.closePath();
    }
  };

  // Generate Stamp Object from configuration
  const generateStampDataUrl = (): string | null => {
    if (activeTab === "draw") {
      const canvas = padCanvasRef.current;
      if (!canvas) return null;
      // Check if canvas is empty
      const blank = document.createElement("canvas");
      blank.width = canvas.width;
      blank.height = canvas.height;
      if (canvas.toDataURL() === blank.toDataURL()) {
        toast.error("Please draw a signature first.");
        return null;
      }
      return canvas.toDataURL("image/png");
    }

    if (activeTab === "type") {
      if (!typedName.trim()) {
        toast.error("Please type your name.");
        return null;
      }
      const canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 150;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      ctx.clearRect(0, 0, 400, 150);
      ctx.fillStyle = drawColor;
      
      let fontStack = "cursive";
      if (typedFont === "cursive-eleg") fontStack = "italic 40px 'Great Vibes', 'Dancing Script', cursive";
      else if (typedFont === "cursive-bold") fontStack = "bold italic 38px 'Caveat', cursive";
      else if (typedFont === "serif-italic") fontStack = "italic 36px 'Georgia', serif";
      else fontStack = "italic 38px 'Brush Script MT', 'Apple Chancery', cursive";

      ctx.font = fontStack;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(typedName, 200, 75);
      return canvas.toDataURL("image/png");
    }

    if (activeTab === "date") {
      if (!customText.trim()) {
        toast.error("Please enter a custom date or text.");
        return null;
      }
      const canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 100;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      ctx.clearRect(0, 0, 400, 100);
      ctx.fillStyle = drawColor;
      ctx.font = "24px Arial, Helvetica, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(customText, 200, 50);
      return canvas.toDataURL("image/png");
    }

    return null;
  };

  // Place active stamp in the center of the page
  const handleAddStamp = () => {
    const dataUrl = generateStampDataUrl();
    if (!dataUrl) return;

    // Dimensions defaults: signature drawn (approx 30% width, 12% height)
    const newStamp: SignatureStamp = {
      id: Math.random().toString(36).substring(2, 9),
      x: 35, // center-ish
      y: 40,
      width: activeTab === "date" ? 25 : 30,
      height: activeTab === "date" ? 6 : 10,
      dataUrl,
    };

    setStamps((prev) => [...prev, newStamp]);
    setSelectedStampId(newStamp.id);
  };

  const deleteStamp = (id: string) => {
    setStamps((prev) => prev.filter((s) => s.id !== id));
    if (selectedStampId === id) setSelectedStampId(null);
  };

  // Handle Drag Move on PDF Page
  const handlePageClick = (e: React.MouseEvent) => {
    if (!pageContainerRef.current) return;
    const rect = pageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // If a stamp is selected, we move it to the clicked position
    if (selectedStampId) {
      setStamps((prev) =>
        prev.map((s) => {
          if (s.id === selectedStampId) {
            // center the stamp on clicked position
            return {
              ...s,
              x: Math.max(0, Math.min(100 - s.width, x - s.width / 2)),
              y: Math.max(0, Math.min(100 - s.height, y - s.height / 2)),
            };
          }
          return s;
        })
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-5xl rounded-3xl border border-border/80 overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-[80vh] shadow-2xl">
        
        {/* Left column: PDF page interactive layout */}
        <div className="flex-1 bg-slate-100 dark:bg-slate-950 p-6 flex flex-col items-center justify-center overflow-auto border-b md:border-b-0 md:border-r border-border/60">
          <div className="text-center mb-3">
            <span className="text-[10px] uppercase font-bold text-muted-foreground block">Interactive Sign Page</span>
            <span className="text-xs font-bold text-slate-800 dark:text-white">Page {pageNum} Preview</span>
          </div>

          <div
            ref={pageContainerRef}
            onClick={handlePageClick}
            className="relative bg-white border border-border/60 rounded-xl overflow-hidden shadow-md cursor-crosshair select-none max-h-[60vh] aspect-[3/4]"
          >
            {pageDataUrl && (
              <img
                src={pageDataUrl}
                alt="Page Preview"
                className="h-full w-full object-contain pointer-events-none"
              />
            )}

            {/* Placed signature stamps overlays */}
            {stamps.map((stamp) => {
              const isSelected = selectedStampId === stamp.id;
              return (
                <div
                  key={stamp.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedStampId(stamp.id);
                  }}
                  style={{
                    position: "absolute",
                    left: `${stamp.x}%`,
                    top: `${stamp.y}%`,
                    width: `${stamp.width}%`,
                    height: `${stamp.height}%`,
                    border: isSelected ? "1.5px solid #6366f1" : "1.5px dashed #94a3b8",
                    boxShadow: isSelected ? "0 0 8px rgba(99, 102, 241, 0.4)" : "none",
                    backgroundColor: isSelected ? "rgba(99,102,241,0.03)" : "transparent",
                    cursor: "move",
                  }}
                  className="group rounded-md flex items-center justify-center p-0.5"
                >
                  <img
                    src={stamp.dataUrl}
                    alt="placed stamp"
                    className="h-full w-full object-contain pointer-events-none"
                  />
                  
                  {/* Select and Delete overlay badges */}
                  <div className="absolute -top-6 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteStamp(stamp.id);
                      }}
                      className="bg-rose-500 text-white rounded p-1 hover:bg-rose-600 cursor-pointer shadow"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>

                  {isSelected && (
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow whitespace-nowrap flex items-center gap-1">
                      <Move className="h-2.5 w-2.5" /> Drag or click page to place
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column: Signature Designer */}
        <div className="w-full md:w-[360px] p-6 flex flex-col h-full bg-white dark:bg-slate-900 border-t md:border-t-0 md:border-l border-border/40">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/40 pb-3 flex-shrink-0">
            <span className="font-bold text-slate-800 dark:text-white text-sm">Designer Studio</span>
            <button
              onClick={onClose}
              className="h-7 w-7 text-muted-foreground hover:text-foreground rounded-lg border border-border/80 flex items-center justify-center transition cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Scrollable Designer Content area */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4 min-h-0 scrollbar-thin pr-1">
            {/* Design Type Tabs */}
            <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-800/40 p-1.5 rounded-xl text-xs">
              <button
                onClick={() => setActiveTab("draw")}
                className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 font-bold cursor-pointer transition ${
                  activeTab === "draw"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <PenTool className="h-3.5 w-3.5" /> Draw
              </button>
              <button
                onClick={() => setActiveTab("type")}
                className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 font-bold cursor-pointer transition ${
                  activeTab === "type"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Type className="h-3.5 w-3.5" /> Type
              </button>
              <button
                onClick={() => setActiveTab("date")}
                className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 font-bold cursor-pointer transition ${
                  activeTab === "date"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Calendar className="h-3.5 w-3.5" /> Stamp
              </button>
            </div>

            {/* Config Panels */}
            {activeTab === "draw" && (
              <div className="space-y-4">
                <div className="relative border border-dashed border-border/80 rounded-2xl bg-slate-50/50 p-2 overflow-hidden h-[180px] flex items-center justify-center">
                  <canvas
                    ref={padCanvasRef}
                    width={310}
                    height={160}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full h-full cursor-crosshair bg-transparent"
                  />
                  <button
                    onClick={clearPad}
                    className="absolute bottom-2 right-2 text-[10px] font-bold px-2 py-1 border border-border bg-white text-slate-500 hover:text-slate-700 rounded-lg shadow-sm transition cursor-pointer"
                  >
                    Clear Canvas
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Stroke Width ({brushWidth}px)</label>
                  <input
                    type="range"
                    min={1}
                    max={8}
                    step={1}
                    value={brushWidth}
                    onChange={(e) => setBrushWidth(parseInt(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>
              </div>
            )}

            {activeTab === "type" && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Signature Text</label>
                  <input
                    type="text"
                    value={typedName}
                    onChange={(e) => setTypedName(e.target.value)}
                    placeholder="e.g. Johnathan Doe"
                    maxLength={32}
                    className="w-full border border-border/80 rounded-xl px-3 py-2 text-xs bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Signature Font Style</label>
                  <select
                    value={typedFont}
                    onChange={(e) => setTypedFont(e.target.value)}
                    className="w-full border border-border/80 rounded-xl px-3 py-2 text-xs bg-white"
                  >
                    <option value="cursive">Classic Cursive</option>
                    <option value="cursive-eleg">Elegant Handwriting</option>
                    <option value="cursive-bold">Bold Signature Style</option>
                    <option value="serif-italic">Serif Academic Italic</option>
                  </select>
                </div>

                {typedName && (
                  <div className="border border-slate-100 rounded-xl p-4 bg-slate-50 text-center select-none font-mono">
                    <span className="text-[10px] text-muted-foreground uppercase block mb-1">Preview</span>
                    <span
                      style={{
                        fontFamily:
                          typedFont === "cursive-eleg"
                            ? "'Great Vibes', 'Dancing Script', cursive"
                            : typedFont === "cursive-bold"
                            ? "'Caveat', cursive"
                            : typedFont === "serif-italic"
                            ? "Georgia, serif"
                            : "'Brush Script MT', 'Apple Chancery', cursive",
                        fontSize: "26px",
                        fontStyle: "italic",
                        color: drawColor,
                      }}
                    >
                      {typedName}
                    </span>
                  </div>
                )}
              </div>
            )}

            {activeTab === "date" && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Stamp Annotation Text</label>
                  <input
                    type="text"
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="e.g. APPROVED 12/28/2026"
                    className="w-full border border-border/80 rounded-xl px-3 py-2 text-xs bg-white"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setCustomText(new Date().toLocaleDateString())}
                    className="flex-1 py-1 px-2 border border-border text-[10px] font-semibold bg-white hover:bg-slate-50 rounded-lg text-slate-600 transition cursor-pointer"
                  >
                    Insert Date Only
                  </button>
                  <button
                    onClick={() => setCustomText(`SIGNED: ${new Date().toLocaleDateString()}`)}
                    className="flex-1 py-1 px-2 border border-border text-[10px] font-semibold bg-white hover:bg-slate-50 rounded-lg text-slate-600 transition cursor-pointer"
                  >
                    Insert "SIGNED" Stamp
                  </button>
                </div>
              </div>
            )}

            {/* Ink Color Selector */}
            <div className="space-y-2 border-t border-border/40 pt-3">
              <label className="text-[10px] font-bold text-muted-foreground uppercase block">Ink Pen Color</label>
              <div className="flex items-center gap-2">
                {[
                  { label: "Black", color: "#000000" },
                  { label: "Royal Blue", color: "#1d4ed8" },
                  { label: "Crimson Red", color: "#dc2626" },
                ].map((ink) => (
                  <button
                    key={ink.color}
                    onClick={() => setDrawColor(ink.color)}
                    style={{ backgroundColor: ink.color }}
                    className={`h-7 w-7 rounded-full transition cursor-pointer relative ${
                      drawColor === ink.color ? "ring-2 ring-indigo-500 ring-offset-2 scale-105" : "hover:scale-105"
                    }`}
                    title={ink.label}
                  >
                    {drawColor === ink.color && (
                      <Check className="h-4.5 w-4.5 text-white absolute inset-0 m-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleAddStamp}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white mt-1 border-transparent cursor-pointer"
            >
              Add Annotation Stamp to Page
            </Button>
          </div>

          {/* Bottom Save & Close Triggers (Fixed Footer) */}
          <div className="border-t border-border/40 pt-4 flex gap-2 flex-shrink-0">
            <button
              onClick={onClose}
              className="flex-1 border border-border bg-white hover:bg-slate-50 font-bold px-4 py-2.5 text-xs text-slate-600 rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(stamps)}
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 font-bold px-4 py-2.5 text-xs text-white rounded-xl transition cursor-pointer shadow border-transparent"
            >
              Save Signature
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
