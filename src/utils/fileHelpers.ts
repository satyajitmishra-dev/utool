/**
 * Helper utilities for validating and formatting files on client and server.
 */

export function getFileExtension(filename: string): string {
  const parts = filename.split(".");
  return parts.length > 1 ? parts.pop()?.toLowerCase() || "" : "";
}

export function validateFileSize(file: File | Blob, maxSizeBytes: number): boolean {
  return file.size <= maxSizeBytes;
}

export function validateFileType(file: File | Blob, allowedMimeTypes: string[]): boolean {
  if (file instanceof File) {
    return allowedMimeTypes.includes(file.type);
  }
  return true; // If blob, skip mime check or inspect blob type
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
