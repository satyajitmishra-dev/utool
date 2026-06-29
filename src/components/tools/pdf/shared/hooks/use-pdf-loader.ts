import { useState } from "react";
import { toast } from "sonner";

export interface PDFFileInfo {
  name: string;
  size: number;
  pageCount: number;
  isEncrypted: boolean;
  isCorrupt: boolean;
  diagnostics: {
    validHeader: boolean;
    validCatalog: boolean;
    recoverable: boolean;
  };
  buffer: ArrayBuffer;
}

export function usePdfLoader() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPdfFile = async (file: File): Promise<PDFFileInfo | null> => {
    setLoading(true);
    setError(null);
    try {
      const buffer = await file.arrayBuffer();
      
      // Simple binary diagnostics
      const headerBytes = new Uint8Array(buffer.slice(0, 1056));
      const headerStr = new TextDecoder().decode(headerBytes);
      const validHeader = headerStr.includes("%PDF-");
      
      let isEncrypted = false;
      let isCorrupt = false;
      let validCatalog = false;

      // Load using pdf-lib to extract accurate data
      const { PDFDocument } = await import("pdf-lib");
      let pageCount = 0;
      let loadedDoc = null;

      try {
        loadedDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
        pageCount = loadedDoc.getPageCount();
        validCatalog = !!loadedDoc.catalog;
        
        // Accurate encryption check from parsed catalog
        if (loadedDoc.isEncrypted) {
          isEncrypted = true;
        }
      } catch (err: any) {
        isCorrupt = true;
        const msg = err?.message || "";
        if (msg.toLowerCase().includes("encrypted") || msg.toLowerCase().includes("password")) {
          isEncrypted = true;
        }
      }

      const info: PDFFileInfo = {
        name: file.name,
        size: file.size,
        pageCount,
        isEncrypted,
        isCorrupt,
        diagnostics: {
          validHeader,
          validCatalog,
          recoverable: !isEncrypted && (validHeader || validCatalog),
        },
        buffer,
      };

      setLoading(false);
      return info;
    } catch (err: any) {
      console.error("PDF Loader error:", err);
      const errMsg = err?.message || "Failed to parse PDF document structure.";
      setError(errMsg);
      setLoading(false);
      toast.error(errMsg);
      return null;
    }
  };

  return {
    loadPdfFile,
    loading,
    error,
  };
}
