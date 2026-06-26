import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const accountId = process.env.R2_ACCOUNT_ID || "";
const accessKeyId = process.env.R2_ACCESS_KEY_ID || "";
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || "";
const bucketName = process.env.R2_BUCKET_NAME || "";

// Initialize S3Client pointing to Cloudflare R2
export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  requestChecksumCalculation: "WHEN_REQUIRED",
});

/**
 * Generates a presigned PUT URL for direct browser uploads.
 */
export async function getPresignedUploadUrl(
  key: string,
  contentType: string,
  sizeBytes: number
): Promise<string> {
  if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
    throw new Error("Cloudflare R2 configuration is missing in server environment variables.");
  }

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: contentType,
  });

  // URL expires in 5 minutes (300 seconds)
  return await getSignedUrl(r2Client, command, { expiresIn: 300 });
}

/**
 * Downloads an object securely from R2 as a Buffer.
 */
export async function downloadFromR2(key: string): Promise<Buffer> {
  if (!bucketName) {
    throw new Error("Cloudflare R2 bucket name is missing in server environment variables.");
  }

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  const response = await r2Client.send(command);
  
  if (!response.Body) {
    throw new Error(`Empty file body returned for R2 object: ${key}`);
  }

  // Use the SDK's built-in helper to parse the stream into a Uint8Array
  const byteArray = await response.Body.transformToByteArray();
  return Buffer.from(byteArray);
}

/**
 * Deletes an object from R2.
 */
export async function deleteFromR2(key: string): Promise<void> {
  if (!bucketName) {
    throw new Error("Cloudflare R2 bucket name is missing in server environment variables.");
  }

  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  await r2Client.send(command);
}
