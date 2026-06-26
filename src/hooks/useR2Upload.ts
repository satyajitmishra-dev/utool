import { useState } from "react";
import { toast } from "sonner";

export function useR2Upload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadFileToR2 = async (
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<{ fileKey: string }> => {
    setIsUploading(true);
    setUploadProgress(0);
    if (onProgress) onProgress(0);

    try {
      // 1. Get presigned upload URL from our backend signature endpoint
      const response = await fetch("/api/tools/upload-signature", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          fileSize: file.size,
        }),
      });

      const body = await response.json();
      if (!response.ok) {
        throw new Error(body.error || "Failed to generate R2 upload credentials.");
      }

      const { uploadUrl, fileKey } = body.data;

      // 2. Upload file directly to Cloudflare R2 using XMLHttpRequest (for progress tracking)
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", uploadUrl, true);
        xhr.setRequestHeader("Content-Type", file.type);

        // Upload progress listener
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(percent);
            if (onProgress) onProgress(percent);
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200 || xhr.status === 201) {
            resolve();
          } else {
            reject(new Error(`Cloudflare R2 returned status: ${xhr.status}`));
          }
        };

        xhr.onerror = () => {
          reject(new Error("Network connection lost during file upload."));
        };

        xhr.send(file);
      });

      setIsUploading(false);
      return { fileKey };

    } catch (err: any) {
      setIsUploading(false);
      setUploadProgress(0);
      console.error("[useR2Upload] Error:", err);
      toast.error(err.message || "File upload to storage failed.");
      throw err;
    }
  };

  return {
    uploadFileToR2,
    isUploading,
    uploadProgress,
  };
}
export default useR2Upload;
