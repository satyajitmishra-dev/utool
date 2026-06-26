import { NextRequest } from "next/server";
import { requireProServer } from "@/lib/pro-server";
import { validateUpload } from "@/middleware/validateUpload";
import { transcribeMedia } from "@/services/GroqWhisperService";
import { downloadFromR2, deleteFromR2 } from "@/services/R2Service";
import { apiSuccessResponse, apiErrorResponse } from "@/utils/apiHelpers";

export async function POST(request: NextRequest) {
  let fileKey: string | null = null;
  try {
    // 1. Enforce Server Authorization
    await requireProServer();

    const contentType = request.headers.get("content-type") || "";
    let fileBuffer: Buffer;
    let fileName: string;
    let mimeType: string;

    // 2. Extract input either from JSON (R2 upload) or FormData (Direct upload)
    if (contentType.includes("application/json")) {
      const body = await request.json();
      fileKey = body.fileKey;
      if (!fileKey) {
        return apiErrorResponse("Missing fileKey in JSON payload", 400);
      }
      fileName = body.filename || "audio.mp3";
      mimeType = body.mimeType || "audio/mpeg";

      // Download file securely from R2 using SDK
      fileBuffer = await downloadFromR2(fileKey);
    } else {
      const formData = await request.formData();

      // Validate Uploaded Media File (Max size 30MB)
      const allowedMimeTypes = [
        "audio/mpeg",
        "audio/mp3",
        "audio/wav",
        "audio/x-wav",
        "audio/x-m4a",
        "audio/m4a",
        "video/mp4",
        "video/quicktime",
        "video/webm",
      ];
      const validation = await validateUpload(formData, "file", allowedMimeTypes, 30);
      if (validation.errorResponse) {
        return validation.errorResponse;
      }
      const file = validation.file;
      fileName = file.name;
      mimeType = file.type;

      fileBuffer = Buffer.from(await file.arrayBuffer());
    }

    // 3. Transcribe File via Groq Whisper API
    const transcriptionResult = await transcribeMedia(fileBuffer, fileName, mimeType);

    return apiSuccessResponse(transcriptionResult, "Media file transcribed successfully.");
  } catch (error: any) {
    console.error("[API Subtitle Generator] Failure:", error);

    if (error.message === "Unauthorized") {
      return apiErrorResponse("Unauthorized access", 401);
    }
    if (error.message === "Pro subscription required") {
      return apiErrorResponse("Pro subscription required", 403);
    }

    return apiErrorResponse(error.message || "Failed to generate timed subtitles", 500);
  } finally {
    // 4. Always clean up temporary direct R2 uploads
    if (fileKey) {
      try {
        await deleteFromR2(fileKey);
      } catch (cleanupErr) {
        console.error(`[API Subtitle Generator] Failed to clean up R2 file: ${fileKey}`, cleanupErr);
      }
    }
  }
}

export const dynamic = "force-dynamic";
