import { useState, useEffect, useCallback, useRef } from "react";

export function usePdfRenderer() {
  const [pdfjsLoaded, setPdfjsLoaded] = useState(false);
  const cacheRef = useRef<Record<string, string>>({}); // cache pages by key: `${fileName}-${pageNum}-${scale}`
  const loadingTasksRef = useRef<Record<string, boolean>>({});

  useEffect(() => {
    if ((window as any).pdfjsLib) {
      setPdfjsLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.async = true;
    script.onload = () => {
      const pdfjsLib = (window as any).pdfjsLib;
      pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      setPdfjsLoaded(true);
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const renderPageToDataUrl = useCallback(
    async (
      buffer: ArrayBuffer,
      fileName: string,
      pageNumber: number,
      scale = 1.0
    ): Promise<string> => {
      const cacheKey = `${fileName}-${pageNumber}-${scale}`;
      if (cacheRef.current[cacheKey]) {
        return cacheRef.current[cacheKey];
      }

      if (!pdfjsLoaded) {
        // Wait a tiny bit for pdfjs to load
        await new Promise((resolve) => setTimeout(resolve, 500));
        if (!(window as any).pdfjsLib) {
          throw new Error("PDF rendering dependencies are still loading.");
        }
      }

      const pdfjsLib = (window as any).pdfjsLib;
      const data = new Uint8Array(buffer.slice(0));
      
      const loadingTask = pdfjsLib.getDocument({ data });
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(pageNumber);
      
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      if (!ctx) throw new Error("Canvas context generation failed.");
      
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      
      await page.render({
        canvasContext: ctx,
        viewport,
      }).promise;
      
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
      
      // Cache the thumbnail
      cacheRef.current[cacheKey] = dataUrl;
      
      // Clean canvas
      canvas.width = 0;
      canvas.height = 0;
      
      return dataUrl;
    },
    [pdfjsLoaded]
  );

  const clearCache = useCallback(() => {
    cacheRef.current = {};
    loadingTasksRef.current = {};
  }, []);

  return {
    renderPageToDataUrl,
    pdfjsLoaded,
    clearCache,
  };
}
