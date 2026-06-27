import { NextRequest, NextResponse } from "next/server";
import { getPresignedUploadUrl } from "@/services/R2Service";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const { filename, contentType, size } = await req.json();

    if (!filename || !contentType || !size) {
      return NextResponse.json(
        { error: "Missing required fields: filename, contentType, size" },
        { status: 400 }
      );
    }

    // Size limit check (e.g., 500MB)
    const MAX_SIZE = 500 * 1024 * 1024;
    if (size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File exceeds maximum size of 500MB" },
        { status: 400 }
      );
    }

    const fileId = uuidv4();
    const ext = filename.split(".").pop();
    const key = `uploads/${fileId}.${ext}`;

    const url = await getPresignedUploadUrl(key, contentType, size);

    return NextResponse.json({ url, key });
  } catch (error: any) {
    console.error("Presign error:", error);
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}
