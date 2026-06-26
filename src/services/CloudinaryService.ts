import crypto from "crypto";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

/**
 * Uploads a raw image buffer to Cloudinary using secure signed requests.
 */
export async function uploadToCloudinary(
  fileBuffer: Buffer,
  filename: string,
  mimeType: string
): Promise<{
  publicId: string;
  secureUrl: string;
  format: string;
  width: number;
  height: number;
  sizeBytes: number;
}> {
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary configuration missing in server environment variables.");
  }

  const timestamp = Math.round(new Date().getTime() / 1000).toString();
  // Generate sha1 signature of params sorted alphabetically
  const signatureString = `timestamp=${timestamp}${apiSecret}`;
  const signature = crypto
    .createHash("sha1")
    .update(signatureString)
    .digest("hex");

  const formData = new FormData();
  const fileBlob = new Blob([new Uint8Array(fileBuffer)], { type: mimeType });
  formData.append("file", fileBlob, filename);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);

  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const response = await fetch(uploadUrl, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[Cloudinary Service] Upload error response:", errorText);
    throw new Error(`Cloudinary upload HTTP failed: ${errorText}`);
  }

  const result = await response.json();
  return {
    publicId: result.public_id,
    secureUrl: result.secure_url,
    format: result.format || "png",
    width: result.width,
    height: result.height,
    sizeBytes: result.bytes,
  };
}

/**
 * Builds a transformed Cloudinary delivery URL dynamically based on resize configurations.
 */
export function getTransformedUrl(
  publicId: string,
  format: string,
  options: {
    width?: number;
    height?: number;
    cropMode?: "fill" | "fit" | "scale" | "crop" | "thumb";
    quality?: number;
  }
): string {
  if (!cloudName) return "";

  const transforms: string[] = [];
  
  if (options.cropMode) {
    transforms.push(`c_${options.cropMode}`);
  }
  if (options.width && options.width > 0) {
    transforms.push(`w_${options.width}`);
  }
  if (options.height && options.height > 0) {
    transforms.push(`h_${options.height}`);
  }
  if (options.quality && options.quality > 0) {
    transforms.push(`q_${options.quality}`);
  } else {
    transforms.push("q_auto");
  }

  const transformPath = transforms.length > 0 ? `${transforms.join(",")}/` : "";
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformPath}${publicId}.${format}`;
}
export const dynamic = "force-dynamic";
