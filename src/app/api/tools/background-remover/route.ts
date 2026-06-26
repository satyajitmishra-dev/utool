import { NextRequest, NextResponse } from "next/server";
import { requireProServer } from "@/lib/pro-server";
import { validateUpload } from "@/middleware/validateUpload";
import { removeBackground } from "@/services/ClipdropService";
import { downloadFromR2, deleteFromR2 } from "@/services/R2Service";
import { apiErrorResponse } from "@/utils/apiHelpers";

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
      fileName = body.filename || "image.png";
      mimeType = body.mimeType || "image/png";

      // Download file securely from R2 using SDK
      fileBuffer = await downloadFromR2(fileKey);
    } else {
      const formData = await request.formData();

      // Validate Uploaded File (Max size 30MB)
      const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      const validation = await validateUpload(formData, "file", allowedMimeTypes, 30);
      if (validation.errorResponse) {
        return validation.errorResponse;
      }
      const file = validation.file;
      fileName = file.name;
      mimeType = file.type;

      fileBuffer = Buffer.from(await file.arrayBuffer());
    }

    // 3. Process Background Removal via Clipdrop
    const transparentPngBuffer = await removeBackground(fileBuffer, fileName, mimeType);

    // 4. Return Binary PNG Stream directly
    return new Response(transparentPngBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error: any) {
    console.error("[API Background Remover] Failure:", error);

    if (error.message === "Unauthorized") {
      return apiErrorResponse("Unauthorized access", 401);
    }
    if (error.message === "Pro subscription required") {
      return apiErrorResponse("Pro subscription required", 403);
    }

    return apiErrorResponse(error.message || "Failed to remove image background", 500);
  } finally {
    // 5. Always clean up temporary direct R2 uploads
    if (fileKey) {
      try {
        await deleteFromR2(fileKey);
      } catch (cleanupErr) {
        console.error(`[API Background Remover] Failed to clean up R2 file: ${fileKey}`, cleanupErr);
      }
    }
  }
}

export const dynamic = "force-dynamic";
