export interface ApiResponse<T = any> {
  status: "success" | "error";
  message?: string;
  data?: T;
  error?: string;
}

export interface ImageResizerRequest {
  width: number;
  height: number;
  cropMode: "fill" | "fit" | "scale" | "crop" | "thumb";
  quality: number;
  format: "jpg" | "png" | "webp" | "gif";
}

export interface ImageResizerResponse {
  originalUrl: string;
  transformedUrl: string;
  publicId: string;
  format: string;
  width: number;
  height: number;
  sizeBytes: number;
}
