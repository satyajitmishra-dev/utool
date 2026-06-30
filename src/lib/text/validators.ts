// Validation helpers for text inputs
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateBinary(binaryStr: string): ValidationResult {
  const errors: string[] = [];
  if (!binaryStr || binaryStr.trim() === "") {
    return { isValid: true, errors };
  }

  // Find all characters that aren't 0, 1, space, or newline
  const invalidChars = binaryStr.replace(/[01\s\n\r]/g, "");
  if (invalidChars.length > 0) {
    // Unique invalid characters up to 5 examples
    const uniqueInvalids = Array.from(new Set(invalidChars)).slice(0, 5).join(", ");
    errors.push(`Invalid binary characters found: '${uniqueInvalids}'. Binary must contain only '0', '1', spaces, or line breaks.`);
  }

  // Check if chunks have length other than 8 (only if space separated)
  const chunks = binaryStr.trim().split(/\s+/).filter(Boolean);
  const badLengthChunks = chunks.filter((chunk) => chunk.length % 8 !== 0 && !/^[01]+$/.test(chunk));
  if (badLengthChunks.length > 0 && errors.length === 0) {
    errors.push("Some binary blocks are not in standard 8-bit octet sizes.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateMorse(morseStr: string): ValidationResult {
  const errors: string[] = [];
  if (!morseStr || morseStr.trim() === "") {
    return { isValid: true, errors };
  }

  // Valid morse chars: dots (.), dashes (-), spaces ( ), word separators (/), newlines (\n)
  const invalidChars = morseStr.replace(/[.\-\/\s\n\r]/g, "");
  if (invalidChars.length > 0) {
    const uniqueInvalids = Array.from(new Set(invalidChars)).slice(0, 5).join(", ");
    errors.push(`Invalid Morse characters found: '${uniqueInvalids}'. Morse must contain only dots '.', dashes '-', spaces, or slash '/' dividers.`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
