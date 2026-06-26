import { NextRequest } from "next/server";
import { requireProServer } from "@/lib/pro-server";
import { validateUpload } from "@/middleware/validateUpload";
import { uploadToCloudinary, getTransformedUrl } from "@/services/CloudinaryService";
import { downloadFromR2, deleteFromR2 } from "@/services/R2Service";
import { apiSuccessResponse, apiErrorResponse } from "@/utils/apiHelpers";

export async function POST(request: NextRequest) {
  let fileKey: string | null = null;
  try {
    // 1. Enforce Server Authorization Check
    await requireProServer();

    const contentType = request.headers.get("content-type") || "";
    let fileBuffer: Buffer;
    let fileName: string;
    let mimeType: string;

    let width: number | undefined;
    let height: number | undefined;
    let cropMode: any = "fill";
    let quality: number | undefined;
    let format: string = "png";

    // 2. Extract input either from JSON (R2 upload) or FormData (Direct upload)
    if (contentType.includes("application/json")) {
      const body = await request.json();
      fileKey = body.fileKey;
      if (!fileKey) {
        return apiErrorResponse("Missing fileKey in JSON payload", 400);
      }
      fileName = body.filename || "file.png";
      mimeType = body.mimeType || "image/png";

      width = body.width ? Number(body.width) : undefined;
      height = body.height ? Number(body.height) : undefined;
      cropMode = body.cropMode || "fill";
      quality = body.quality ? Number(body.quality) : undefined;
      format = body.format || mimeType.split("/")[1] || "png";

      // Download file securely from private R2 bucket using SDK
      fileBuffer = await downloadFromR2(fileKey);
    } else {
      const formData = await request.formData();

      // Validate Uploaded File (Max size 30MB)
      const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
      const validation = await validateUpload(formData, "file", allowedMimeTypes, 30);
      if (validation.errorResponse) {
        return validation.errorResponse;
      }
      const file = validation.file;
      fileName = file.name;
      mimeType = file.type;

      width = formData.get("width") ? Number(formData.get("width")) : undefined;
      height = formData.get("height") ? Number(formData.get("height")) : undefined;
      cropMode = (formData.get("cropMode") as any) || "fill";
      quality = formData.get("quality") ? Number(formData.get("quality")) : undefined;
      format = (formData.get("format") as any) || file.type.split("/")[1] || "png";

      fileBuffer = Buffer.from(await file.arrayBuffer());
    }

    // 3. Upload File to Cloudinary & Generate Transformation URL
    const uploadResult = await uploadToCloudinary(fileBuffer, fileName, mimeType);
    const transformedUrl = getTransformedUrl(uploadResult.publicId, format, {
      width,
      height,
      cropMode,
      quality,
    });

    return apiSuccessResponse({
      originalUrl: uploadResult.secureUrl,
      transformedUrl,
      publicId: uploadResult.publicId,
      format,
      width: width || uploadResult.width,
      height: height || uploadResult.height,
      sizeBytes: uploadResult.sizeBytes,
    }, "Image resized and transformed successfully.");

  } catch (error: any) {
    console.error("[API Image Resizer] Processing failure:", error);
    
    if (error.message === "Unauthorized") {
      return apiErrorResponse("Unauthorized access", 401);
    }
    if (error.message === "Pro subscription required") {
      return apiErrorResponse("Pro subscription required", 403);
    }
    
    return apiErrorResponse(error.message || "Failed to process image resize transformation", 500);
  } finally {
    // 4. Always clean up temporary direct R2 uploads
    if (fileKey) {
      try {
        await deleteFromR2(fileKey);
      } catch (cleanupErr) {
        console.error(`[API Image Resizer] Failed to clean up R2 file: ${fileKey}`, cleanupErr);
      }
    }
  }
}

export const dynamic = "force-dynamic";
