"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trash2, RotateCw, Copy, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Loader2 } from "lucide-react";

export interface WorkspacePageItem {
  id: string;
  originalPageNumber: number; // 1-indexed
  tempRotation: number; // 0, 90, 180, 270
  fileId: string;
  fileName: string;
  buffer: ArrayBuffer;
  selected?: boolean;
}

interface PDFThumbnailGridProps {
  items: WorkspacePageItem[];
  onReorder: (newItems: WorkspacePageItem[]) => void;
  onRotate: (id: string, angleChange: number) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onToggleSelect: (id: string) => void;
  renderPageToDataUrl: (buffer: ArrayBuffer, fileName: string, pageNum: number) => Promise<string>;
  onCardClick?: (item: WorkspacePageItem) => void;
}

export function PDFThumbnailGrid({
  items,
  onReorder,
  onRotate,
  onDelete,
  onDuplicate,
  onToggleSelect,
  renderPageToDataUrl,
  onCardClick,
}: PDFThumbnailGridProps) {
  const handleMove = (index: number, direction: "left" | "right") => {
    if (direction === "left" && index === 0) return;
    if (direction === "right" && index === items.length - 1) return;

    const newItems = [...items];
    const targetIdx = direction === "left" ? index - 1 : index + 1;
    const temp = newItems[index];
    newItems[index] = newItems[targetIdx];
    newItems[targetIdx] = temp;
    onReorder(newItems);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 p-2">
      {items.map((item, idx) => (
        <ThumbnailCard
          key={item.id}
          item={item}
          index={idx}
          total={items.length}
          onMove={handleMove}
          onRotate={onRotate}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
          onToggleSelect={onToggleSelect}
          renderPageToDataUrl={renderPageToDataUrl}
          onCardClick={onCardClick}
        />
      ))}
    </div>
  );
}

// Sub-component for individual card lazy rendering
function ThumbnailCard({
  item,
  index,
  total,
  onMove,
  onRotate,
  onDelete,
  onDuplicate,
  onToggleSelect,
  renderPageToDataUrl,
  onCardClick,
}: {
  item: WorkspacePageItem;
  index: number;
  total: number;
  onMove: (idx: number, dir: "left" | "right") => void;
  onRotate: (id: string, angle: number) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onToggleSelect: (id: string) => void;
  renderPageToDataUrl: (buffer: ArrayBuffer, fileName: string, pageNum: number) => Promise<string>;
  onCardClick?: (item: WorkspacePageItem) => void;
}) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [rendering, setRendering] = useState(false);

  useEffect(() => {
    let active = true;
    const loadThumbnail = async () => {
      setRendering(true);
      try {
        const url = await renderPageToDataUrl(item.buffer, item.fileName, item.originalPageNumber);
        if (active) {
          setDataUrl(url);
        }
      } catch (err) {
        console.error("Failed rendering thumbnail:", err);
      } finally {
        if (active) setRendering(false);
      }
    };
    loadThumbnail();
    return () => {
      active = false;
    };
  }, [item.buffer, item.fileName, item.originalPageNumber, renderPageToDataUrl]);

  return (
    <motion.div
      layout
      className={`group relative border rounded-2xl bg-card/60 p-3 select-none flex flex-col justify-between items-center transition-all ${
        item.selected
          ? "border-primary ring-2 ring-primary/20 bg-primary/5"
          : "border-border/60 hover:border-primary/40"
      }`}
    >
      {/* Top selection checkbox & Index tag */}
      <div className="w-full flex items-center justify-between gap-2 mb-2 z-10">
        <button
          onClick={() => onToggleSelect(item.id)}
          className={`h-5 w-5 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
            item.selected
              ? "bg-primary border-primary text-white"
              : "border-border/80 bg-white hover:border-primary/50"
          }`}
        >
          {item.selected && <Check className="h-3 w-3 stroke-[3]" />}
        </button>
        <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
          Page {index + 1}
        </span>
      </div>

      {/* Render Canvas Image Preview */}
      <div 
        onClick={() => onCardClick?.(item)}
        className={`relative aspect-[3/4] w-full max-w-[120px] bg-muted/20 border border-border/40 rounded-xl overflow-hidden flex items-center justify-center shadow-inner ${onCardClick ? 'cursor-pointer hover:ring-2 hover:ring-primary/40' : ''}`}
      >
        {rendering && (
          <Loader2 className="h-5 w-5 text-primary animate-spin" />
        )}
        {dataUrl && (
          <img
            src={dataUrl}
            alt={`Page ${index + 1}`}
            style={{ transform: `rotate(${item.tempRotation}deg)` }}
            className="h-full w-full object-contain transition-transform duration-200"
          />
        )}
      </div>

      {/* Action Overlay Panel */}
      <div className="w-full flex justify-between items-center gap-1.5 mt-3 pt-2.5 border-t border-border/40">
        {/* Navigation triggers */}
        <div className="flex gap-0.5">
          <button
            onClick={() => onMove(index, "left")}
            disabled={index === 0}
            className="h-7 w-7 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition disabled:opacity-30 cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => onMove(index, "right")}
            disabled={index === total - 1}
            className="h-7 w-7 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition disabled:opacity-30 cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Editing controls */}
        <div className="flex gap-0.5">
          <button
            onClick={() => onRotate(item.id, 90)}
            className="h-7 w-7 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition cursor-pointer"
            title="Rotate Page"
          >
            <RotateCw className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDuplicate(item.id)}
            className="h-7 w-7 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition cursor-pointer"
            title="Duplicate Page"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="h-7 w-7 rounded-lg hover:bg-muted text-rose-500 hover:bg-rose-500/10 flex items-center justify-center transition cursor-pointer"
            title="Delete Page"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
