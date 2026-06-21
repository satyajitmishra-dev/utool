import { CompressionLevel, PageRange } from "@/types/pdf";

/**
 * Merges multiple PDF files into a single PDF document client-side.
 * @param files Array of PDF Files
 * @param onProgress Optional progress callback
 */
export async function mergePDFs(
  files: File[],
  onProgress?: (progress: number) => void
): Promise<Uint8Array> {
  if (files.length === 0) {
    throw new Error("No files selected for merging.");
  }

  const { PDFDocument } = await import("pdf-lib");
  const mergedDoc = await PDFDocument.create();
  
  const totalFiles = files.length;
  
  for (let i = 0; i < totalFiles; i++) {
    const file = files[i];
    const arrayBuffer = await file.arrayBuffer();
    const srcDoc = await PDFDocument.load(arrayBuffer);
    
    const pageCount = srcDoc.getPageCount();
    const pageIndices = Array.from({ length: pageCount }, (_, idx) => idx);
    
    const copiedPages = await mergedDoc.copyPages(srcDoc, pageIndices);
    copiedPages.forEach((page) => mergedDoc.addPage(page));
    
    if (onProgress) {
      onProgress(Math.round(((i + 1) / totalFiles) * 80)); // 0-80% progress for copy phase
    }
  }
  
  if (onProgress) onProgress(90);
  const mergedPdfBytes = await mergedDoc.save({ useObjectStreams: true });
  if (onProgress) onProgress(100);
  
  return mergedPdfBytes;
}

/**
 * Splits a PDF document by extracting specific page ranges.
 * @param file PDF File to split
 * @param ranges Array of start/end page ranges (1-indexed)
 * @param onProgress Optional progress callback
 */
export async function splitPDF(
  file: File,
  ranges: PageRange[],
  onProgress?: (progress: number) => void
): Promise<Uint8Array> {
  const { PDFDocument } = await import("pdf-lib");
  
  if (onProgress) onProgress(15);
  const arrayBuffer = await file.arrayBuffer();
  const srcDoc = await PDFDocument.load(arrayBuffer);
  const totalPages = srcDoc.getPageCount();
  
  if (onProgress) onProgress(40);
  const newDoc = await PDFDocument.create();
  
  const indicesToCopy: number[] = [];
  
  for (const range of ranges) {
    const start = Math.max(1, range.start);
    const end = Math.min(totalPages, range.end);
    for (let p = start; p <= end; p++) {
      indicesToCopy.push(p - 1); // convert to 0-indexed
    }
  }
  
  // Deduplicate and keep page order
  const uniqueIndices = Array.from(new Set(indicesToCopy)).sort((a, b) => a - b);
  
  if (uniqueIndices.length === 0) {
    throw new Error("Please specify at least one valid page to split.");
  }
  
  if (onProgress) onProgress(65);
  const copiedPages = await newDoc.copyPages(srcDoc, uniqueIndices);
  copiedPages.forEach((page) => newDoc.addPage(page));
  
  if (onProgress) onProgress(85);
  const splitPdfBytes = await newDoc.save({ useObjectStreams: true });
  if (onProgress) onProgress(100);
  
  return splitPdfBytes;
}

/**
 * Compresses a PDF document client-side by rebuilding it and stripping metadata.
 * @param file PDF File to compress
 * @param level Compression Level: low, medium, or high
 * @param onProgress Optional progress callback
 */
export async function compressPDF(
  file: File,
  level: CompressionLevel,
  onProgress?: (progress: number) => void
): Promise<Uint8Array> {
  const { PDFDocument } = await import("pdf-lib");
  
  if (onProgress) onProgress(20);
  const arrayBuffer = await file.arrayBuffer();
  const srcDoc = await PDFDocument.load(arrayBuffer);
  
  if (onProgress) onProgress(50);
  // Re-saving into a clean, empty document discards incremental revision data and unused assets.
  const newDoc = await PDFDocument.create();
  const pageCount = srcDoc.getPageCount();
  const pageIndices = Array.from({ length: pageCount }, (_, idx) => idx);
  
  const copiedPages = await newDoc.copyPages(srcDoc, pageIndices);
  copiedPages.forEach((page) => newDoc.addPage(page));
  
  if (onProgress) onProgress(75);
  // Strip metadata to recover space
  newDoc.setTitle("");
  newDoc.setAuthor("");
  newDoc.setSubject("");
  newDoc.setCreator("");
  newDoc.setProducer("");
  
  // Optimize save based on Compression level
  const saveOptions = {
    useObjectStreams: true,
    updateFieldAppearances: level !== "high",
  };
  
  const compressedBytes = await newDoc.save(saveOptions);
  if (onProgress) onProgress(100);
  
  return compressedBytes;
}
