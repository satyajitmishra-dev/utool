import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2Client } from "@/services/R2Service";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bucketName = process.env.R2_BUCKET_NAME || "";
    if (!bucketName) {
      throw new Error("Cloudflare R2 bucket name is missing");
    }

    const buffer = new Uint8Array(await file.arrayBuffer());
    const ext = file.name.split('.').pop() || '';
    const key = `raw/${uuidv4()}-${Date.now()}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: file.type || "application/octet-stream",
    });

    await r2Client.send(command);

    return NextResponse.json({ success: true, key, url: `https://${bucketName}/${key}` });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload file to storage" }, { status: 500 });
  }
}
