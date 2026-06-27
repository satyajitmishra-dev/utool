import { useState, useCallback, useEffect } from "react";
import { PDFFile } from "@/types/pdf";
import { toast } from "sonner";
import { getHandoffFile, clearHandoffFile } from "@/utils/file-handoff";

interface UsePDFUploadProps {
  tier?: "free" | "pro" | "enterprise";
  allowMultiple?: boolean;
  requiresEncryption?: boolean;
  rejectEncrypted?: boolean;
}

export function usePDFUpload({
  tier = "free",
  allowMultiple = true,
  requiresEncryption = false,
  rejectEncrypted = false,
}: UsePDFUploadProps = {}) {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isParsing, setIsParsing] = useState(false);

  // Free users: 50MB, Pro/Enterprise: 200MB
  const maxSizeBytes = (tier === "pro" || tier === "enterprise" ? 200 : 50) * 1024 * 1024;
  const maxSizeLabel = tier === "pro" || tier === "enterprise" ? "200MB" : "50MB";

  const addFiles = useCallback(
    async (newFiles: FileList | File[]) => {
      setError(null);
      setIsParsing(true);
      const filesArray = Array.from(newFiles);

      if (!allowMultiple && filesArray.length > 1) {
        toast.error("Only single file upload is allowed for this tool.");
        setIsParsing(false);
        return;
      }

      const validatedFiles: PDFFile[] = [];

      for (const file of filesArray) {
        // Validate type
        if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
          toast.error("Only PDF files are allowed.");
          continue;
        }

        // Validate size
        if (file.size > maxSizeBytes) {
          toast.error("This file exceeds the size limit.");
          continue;
        }

        try {
          // Parse page count dynamically
          const { PDFDocument } = await import("pdf-lib");
          const arrayBuffer = await file.arrayBuffer();
          // ignoreEncryption allows us to load the document metadata without throwing an error
          const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
          const pageCount = pdfDoc.getPageCount();
          const isEncrypted = pdfDoc.isEncrypted;

          // Check encryption requirements
          if (requiresEncryption && !isEncrypted) {
            toast.error(`"${file.name}" is not password protected.`);
            continue;
          }
          if (rejectEncrypted && isEncrypted) {
            toast.error(`"${file.name}" is already encrypted.`);
            continue;
          }

          // Generate preview URL if browser supports it
          let previewUrl: string | undefined;
          if (typeof window !== "undefined") {
            previewUrl = URL.createObjectURL(file);
          }

          validatedFiles.push({
            id: Math.random().toString(36).substring(2, 9),
            name: file.name,
            size: file.size,
            pageCount,
            file,
            previewUrl,
            isEncrypted,
          });
        } catch (err) {
          console.error(`Failed to parse PDF metadata for ${file.name}:`, err);
          toast.error(`Corrupted PDF structure: "${file.name}" could not be parsed.`);
        }
      }

      if (validatedFiles.length > 0) {
        setFiles((prev) => (allowMultiple ? [...prev, ...validatedFiles] : validatedFiles));
      }
      setIsParsing(false);
    },
    [allowMultiple, maxSizeBytes, maxSizeLabel]
  );

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target?.previewUrl && typeof window !== "undefined") {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const clearFiles = useCallback(() => {
    files.forEach((f) => {
      if (f.previewUrl && typeof window !== "undefined") {
        URL.revokeObjectURL(f.previewUrl);
      }
    });
    setFiles([]);
    setError(null);
  }, [files]);

  // Drag and drop handlers
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  }, []);

  const onDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        await addFiles(e.dataTransfer.files);
      }
    },
    [addFiles]
  );

  useEffect(() => {
    async function loadHandoff() {
      const file = await getHandoffFile();
      if (file) {
        await addFiles([file]);
        await clearHandoffFile();
      }
    }
    loadHandoff();
  }, [addFiles]);

  return {
    files,
    setFiles,
    error,
    setError,
    isDragActive,
    isParsing,
    addFiles,
    removeFile,
    clearFiles,
    dragHandlers: {
      onDragOver,
      onDragLeave,
      onDrop,
    },
  };
}
