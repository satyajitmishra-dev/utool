import { NextRequest, NextResponse } from "next/server";
import { requireProServer } from "@/lib/pro-server";
import { getAuthUser } from "@/lib/auth-server";
import { getPresignedUploadUrl } from "@/services/R2Service";
import { apiErrorResponse, apiSuccessResponse } from "@/utils/apiHelpers";
import crypto from "crypto";

const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2 GB in bytes

const ALLOWED_MIME_TYPES = new Set([
  // Images
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  // PDFs
  "application/pdf",
  // Audio
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-wav",
  "audio/x-m4a",
  "audio/m4a",
  // Video
  "video/mp4",
  "video/quicktime",
  "video/webm",
]);

export async function POST(request: NextRequest) {
  try {
    // 1. Enforce Server-Side Auth Check for Pro Status
    await requireProServer();
    const user = await getAuthUser();
    const userId = user?.uid || "anonymous";

    // 2. Parse Request Body
    const body = await request.json();
    const { filename, contentType, fileSize } = body;

    if (!filename || !contentType || typeof fileSize !== "number") {
      return apiErrorResponse("Missing required parameters: filename, contentType, or fileSize.", 400);
    }

    // 3. Validation: File Size (up to 1GB)
    if (fileSize <= 0) {
      return apiErrorResponse("Invalid file size. Size must be greater than 0.", 400);
    }
    if (fileSize > MAX_FILE_SIZE) {
      return apiErrorResponse("File size exceeds the limit of 2 GB.", 400);
    }

    // 4. Validation: MIME Type
    if (!ALLOWED_MIME_TYPES.has(contentType)) {
      return apiErrorResponse(`Unsupported file type: ${contentType}`, 400);
    }

    // 5. Generate unique file key under the user's namespace
    const uniqueId = crypto.randomUUID();
    // Clean filename of unsafe characters
    const cleanFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileKey = `uploads/${userId}/${uniqueId}-${cleanFilename}`;

    // 6. Generate presigned URL
    const uploadUrl = await getPresignedUploadUrl(fileKey, contentType, fileSize);

    return apiSuccessResponse({
      uploadUrl,
      fileKey,
    }, "Presigned upload URL generated successfully.");

  } catch (error: any) {
    console.error("[API Upload Signature] Error:", error);
    
    if (error.message === "Unauthorized") {
      return apiErrorResponse("Unauthorized access", 401);
    }
    if (error.message === "Pro subscription required") {
      return apiErrorResponse("Pro subscription required", 403);
    }

    return apiErrorResponse(error.message || "Failed to generate presigned upload signature", 500);
  }
}

export const dynamic = "force-dynamic";
