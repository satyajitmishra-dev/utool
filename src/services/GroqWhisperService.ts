const groqApiKey = process.env.GROQ_API_KEY;

export interface WhisperSegment {
  id: number;
  start: number;
  end: number;
  text: string;
}

export interface WhisperApiResponse {
  text: string;
  segments: WhisperSegment[];
}

/**
 * Sends an audio or video file buffer to Groq's Whisper API.
 * Requests verbose_json to receive segment-level timestamps.
 */
export async function transcribeMedia(
  fileBuffer: Buffer,
  filename: string,
  mimeType: string
): Promise<WhisperApiResponse> {
  if (!groqApiKey) {
    throw new Error("Groq API key (GROQ_API_KEY) is missing in server environment variables.");
  }

  const formData = new FormData();
  const fileBlob = new Blob([new Uint8Array(fileBuffer)], { type: mimeType });
  formData.append("file", fileBlob, filename);
  formData.append("model", "whisper-large-v3");
  formData.append("response_format", "verbose_json");

  const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${groqApiKey}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[Groq Whisper Service] API failure:", errorText);
    
    let parsedError = "Groq Whisper transcription failed.";
    try {
      const errorJson = JSON.parse(errorText);
      if (errorJson.error?.message) parsedError = errorJson.error.message;
    } catch {
      if (errorText) parsedError = errorText;
    }
    
    throw new Error(parsedError);
  }

  return response.json();
}
export const dynamic = "force-dynamic";
