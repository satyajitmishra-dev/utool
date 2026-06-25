export interface PDFFile {
  id: string;
  name: string;
  size: number;
  pageCount: number;
  file: File;
  previewUrl?: string;
  isEncrypted?: boolean;
}

export type CompressionLevel = "low" | "medium" | "high";

export interface PageRange {
  start: number;
  end: number;
}

export type PDFProcessingState = "idle" | "processing" | "success" | "error";

export interface ToolLimitStatus {
  count: number;
  max: number;
  isLimited: boolean;
  loading: boolean;
  tier: "free" | "pro" | "enterprise";
  resetAt?: Date | null;
}
