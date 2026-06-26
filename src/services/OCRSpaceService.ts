const ocrSpaceApiKey = process.env.OCR_SPACE_API_KEY;

export interface OcrResult {
  parsedText: string;
}

/**
 * Sends a PDF or image file buffer to the OCR.Space API to perform text extraction.
 */
export async function performOcr(
  fileBuffer: Buffer,
  filename: string,
  mimeType: string
): Promise<OcrResult> {
  if (!ocrSpaceApiKey) {
    throw new Error("OCR.Space API key (OCR_SPACE_API_KEY) is missing in server environment variables.");
  }

  const formData = new FormData();
  const fileBlob = new Blob([new Uint8Array(fileBuffer)], { type: mimeType });
  formData.append("file", fileBlob, filename);
  formData.append("apikey", ocrSpaceApiKey);
  formData.append("isOverlayRequired", "false");
  formData.append("detectOrientation", "true");
  formData.append("scale", "true");
  
  // Use OCREngine 2 for faster multi-page processing if it's a PDF, otherwise default
  formData.append("OCREngine", "2");

  const response = await fetch("https://api.ocr.space/parse/image", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[OCRSpace Service] API failure:", errorText);
    throw new Error(`OCR.Space API call failed: ${errorText}`);
  }

  const result = await response.json();

  if (result.IsErroredOnProcessing) {
    const errMsg = Array.isArray(result.ErrorMessage)
      ? result.ErrorMessage.join(", ")
      : result.ErrorMessage || "OCR processing error occurred.";
    console.error("[OCRSpace Service] API processing error:", errMsg);
    throw new Error(errMsg);
  }

  // Aggregate text from all parsed pages/results
  const parsedResults = result.ParsedResults || [];
  const textArray = parsedResults.map((pr: any) => pr.ParsedText || "");
  const aggregatedText = textArray.join("\n").trim();

  if (!aggregatedText && parsedResults.length > 0) {
    throw new Error("No text could be identified in the uploaded document/image.");
  }

  return {
    parsedText: aggregatedText || "No readable text found.",
  };
}
export const dynamic = "force-dynamic";
