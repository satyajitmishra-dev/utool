import { NextRequest, NextResponse } from "next/server";

import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2Client } from "@/services/R2Service";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');
    const format = searchParams.get('format');

    if (!key) {
      return NextResponse.json({ error: "Missing key parameter" }, { status: 400 });
    }

    const bucketName = process.env.R2_BUCKET_NAME || "";
    if (!bucketName) {
      throw new Error("Cloudflare R2 bucket name is missing");
    }

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const url = await getSignedUrl(r2Client, command, { expiresIn: 3600 });
    
    const isImage = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'tiff', 'gif'].includes(format?.toLowerCase() || '');
    if (format && isImage) {
      // Cloudflare Image Resizing intercepts /cdn-cgi/image/... on the edge.
      return NextResponse.redirect(new URL(`/cdn-cgi/image/format=${format}/${encodeURIComponent(url)}`, req.url));
    }

    return NextResponse.redirect(url);
  } catch (error: any) {
    console.error("Download error:", error);
    return NextResponse.json({ error: "Failed to generate download link" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const urlObj = new URL(url);
    const originalName = urlObj.pathname.split('/').pop() || 'downloaded-file';
    const mimeType = response.headers.get('content-type') || 'application/octet-stream';
    const size = buffer.length;

    const key = `workspace-tmp/${uuidv4()}-${originalName}`;
    const bucketName = process.env.R2_BUCKET_NAME || "";

    const uploadCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
    });

    await r2Client.send(uploadCommand);

    return NextResponse.json({
      success: true,
      key,
      originalName,
      mimeType,
      size
    });
  } catch (error: any) {
    console.error("Fetch URL error:", error);
    return NextResponse.json({ error: "Failed to download file from URL" }, { status: 500 });
  }
}
