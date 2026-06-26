const clipdropApiKey = process.env.CLIPDROP_API_KEY;

/**
 * Sends an image buffer to Clipdrop's Background Removal API.
 * Returns the transparent PNG binary as an ArrayBuffer.
 */
export async function removeBackground(
  fileBuffer: Buffer,
  filename: string,
  mimeType: string
): Promise<ArrayBuffer> {
  if (!clipdropApiKey) {
    throw new Error("Clipdrop API key (CLIPDROP_API_KEY) is missing in server environment variables.");
  }

  const formData = new FormData();
  const fileBlob = new Blob([new Uint8Array(fileBuffer)], { type: mimeType });
  formData.append("image_file", fileBlob, filename);

  const response = await fetch("https://clipdrop-api.co/remove-background/v1", {
    method: "POST",
    headers: {
      "x-api-key": clipdropApiKey,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[Clipdrop Service] API failure:", errorText);
    
    let parsedError = "Clipdrop API processing failed.";
    try {
      const errorJson = JSON.parse(errorText);
      if (errorJson.error) parsedError = errorJson.error;
    } catch {
      if (errorText) parsedError = errorText;
    }
    
    throw new Error(parsedError);
  }

  return response.arrayBuffer();
}
