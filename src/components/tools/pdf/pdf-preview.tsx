"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { PDFFile } from "@/types/pdf";

interface PDFPreviewProps {
  files: PDFFile[];
  onRemove: (id: string) => void;
  onReorder?: (newFiles: PDFFile[]) => void;
}

export function PDFPreview({ files, onRemove, onReorder }: PDFPreviewProps) {
  const formatSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const moveUp = (index: number) => {
    if (index === 0 || !onReorder) return;
    const updated = [...files];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    onReorder(updated);
  };

  const moveDown = (index: number) => {
    if (index === files.length - 1 || !onReorder) return;
    const updated = [...files];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    onReorder(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-1">
        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
          Uploaded Documents ({files.length})
        </h4>
        {onReorder && files.length > 1 && (
          <span className="text-3xs font-semibold text-slate-400 uppercase tracking-wide">
            Use arrows to re-order compile sequence
          </span>
        )}
      </div>

      <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {files.map((pdfFile, idx) => (
            <motion.div
              key={pdfFile.id}
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="glass-card flex items-center justify-between p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex-shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate pr-4 max-w-[200px] sm:max-w-[320px] md:max-w-[450px]">
                    {pdfFile.name}
                  </p>
                  <p className="text-3xs text-slate-400 mt-0.5 font-semibold uppercase tracking-wider flex items-center gap-2">
                    <span>{formatSize(pdfFile.size)}</span>
                    <span className="h-1 w-1 rounded-full bg-slate-200" />
                    <span>{pdfFile.pageCount} {pdfFile.pageCount === 1 ? "page" : "pages"}</span>
                  </p>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {onReorder && (
                  <>
                    <button
                      onClick={() => moveUp(idx)}
                      disabled={idx === 0}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                      title="Move Up"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => moveDown(idx)}
                      disabled={idx === files.length - 1}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                      title="Move Down"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                  </>
                )}
                
                <button
                  onClick={() => onRemove(pdfFile.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50/50 transition-all ml-1"
                  title="Remove Document"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
