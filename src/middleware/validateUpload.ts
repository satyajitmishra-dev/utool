import { apiErrorResponse } from "@/utils/apiHelpers";

/**
 * Validates files uploaded via FormData on the server.
 */
export async function validateUpload(
  formData: FormData,
  fileKey: string,
  allowedMimeTypes: string[],
  maxSizeMb: number
): Promise<{ file: File; errorResponse?: null } | { file: null; errorResponse: Response }> {
  const file = formData.get(fileKey) as File | null;
  if (!file) {
    return { file: null, errorResponse: apiErrorResponse("No file was uploaded", 400) };
  }

  // Size limit validation
  const maxBytes = maxSizeMb * 1024 * 1024;
  if (file.size > maxBytes) {
    return {
      file: null,
      errorResponse: apiErrorResponse(`File size exceeds the limit of ${maxSizeMb}MB.`, 400),
    };
  }

  // MIME type format validation
  if (allowedMimeTypes.length > 0 && !allowedMimeTypes.includes(file.type)) {
    return {
      file: null,
      errorResponse: apiErrorResponse(
        `Unsupported file type. Expected one of: ${allowedMimeTypes.join(", ")}`,
        400
      ),
    };
  }

  return { file, errorResponse: null };
}
