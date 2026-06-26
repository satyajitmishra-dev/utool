"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { UploadCloud, Loader2, FileText } from "lucide-react";

interface UploadZoneProps {
  isDragActive: boolean;
  isParsing: boolean;
  dragHandlers: {
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
  };
  onFileSelect: (files: File[]) => void;
  maxSizeLabel?: string;
  allowMultiple?: boolean;
  accept?: string;
  title?: string;
  description?: string;
  fileTypeLabel?: string;
  icon?: React.ReactNode;
}

export function UploadZone({
  isDragActive,
  isParsing,
  dragHandlers,
  onFileSelect,
  maxSizeLabel = "50MB",
  allowMultiple = true,
  accept = ".pdf,application/pdf",
  title = "Upload your first PDF to get started.",
  description,
  fileTypeLabel = "PDF Document Only",
  icon,
}: UploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(Array.from(e.target.files));
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.002 }}
      whileTap={{ scale: 0.998 }}
      onClick={isParsing ? undefined : handleClick}
      className={`glass-card relative border-2 border-dashed rounded-3xl p-10 md:p-14 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[280px] ${
        isDragActive
          ? "border-primary bg-primary/5 shadow-inner"
          : "border-border hover:border-primary/50 hover:bg-muted/30"
      } ${isParsing ? "opacity-70 pointer-events-none" : ""}`}
      {...dragHandlers}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        multiple={allowMultiple}
        className="hidden"
        disabled={isParsing}
      />

      <div className="flex flex-col items-center max-w-sm">
        {/* Upload Icon */}
        <motion.div
          animate={isDragActive ? { y: -8, scale: 1.1 } : { y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={`flex h-16 w-16 items-center justify-center rounded-2xl mb-6 border transition-colors ${
            isDragActive
              ? "bg-primary/10 border-primary/20 text-primary"
              : "bg-card border-border text-muted-foreground"
          }`}
        >
          {isParsing ? (
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
          ) : (
            icon || <UploadCloud className="h-7 w-7 text-primary" />
          )}
        </motion.div>

        {isParsing ? (
          <>
            <h3 className="text-base font-semibold text-foreground tracking-tight">
              Analyzing file structure
            </h3>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Verifying security parameters and parsing file header. This will only take a moment...
            </p>
          </>
        ) : (
          <>
            <h3 className="text-base font-semibold text-foreground tracking-tight">
              {title}
            </h3>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              {description || (
                <>
                  Or <span className="text-primary font-semibold hover:opacity-90">browse file directory</span> to select from your device.
                </>
              )}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-3xs font-semibold text-muted-foreground tracking-wide uppercase">
              <span className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                {fileTypeLabel}
              </span>
              <span className="h-1 w-1 rounded-full bg-border hidden sm:inline" />
              <span>Max size: {maxSizeLabel}</span>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
