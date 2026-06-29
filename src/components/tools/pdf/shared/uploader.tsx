"use client";

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, File as FileIcon, X } from "lucide-react";

interface PDFUploaderProps {
  onFilesSelected: (files: File[]) => void;
  acceptTypes: Record<string, string[]>;
  maxSizeMB: number;
  maxFiles?: number;
  helperText?: string;
}

export function PDFUploader({
  onFilesSelected,
  acceptTypes,
  maxSizeMB,
  maxFiles = 100,
  helperText = "Supports PDF documents",
}: PDFUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const validFiles = acceptedFiles.filter((file) => {
        const sizeValid = file.size <= maxSizeMB * 1024 * 1024;
        if (!sizeValid) {
          alert(`File "${file.name}" exceeds the ${maxSizeMB}MB limit.`);
        }
        return sizeValid;
      });

      if (validFiles.length > 0) {
        onFilesSelected(validFiles.slice(0, maxFiles));
      }
    },
    [onFilesSelected, maxSizeMB, maxFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    accept: acceptTypes as any,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[220px] ${
        isDragActive
          ? "border-primary bg-primary/5 scale-[0.99]"
          : "border-border/60 hover:border-primary/50 hover:bg-muted/10"
      }`}
    >
      <input {...getInputProps()} />
      <div className="h-14 w-14 rounded-2xl bg-muted/60 text-muted-foreground flex items-center justify-center mb-4">
        <UploadCloud className="h-7 w-7" />
      </div>
      <h3 className="text-sm font-bold text-foreground mb-1">
        {isDragActive ? "Drop files here" : "Drag & drop files here"}
      </h3>
      <p className="text-xs text-muted-foreground max-w-xs leading-normal">
        or click to browse from your device. {helperText} (Max {maxSizeMB}MB)
      </p>
    </div>
  );
}
