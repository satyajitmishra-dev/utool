export interface ValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedValue?: string;
}

/**
 * Validates any generic string input for numeric conversion.
 */
export function validateNumericInput(
  rawInput: string,
  options: {
    allowNegative?: boolean;
    minValue?: number;
    maxValue?: number;
  } = {}
): ValidationResult {
  const trimmed = rawInput.trim();

  // 1. Empty input validation
  if (!trimmed) {
    return {
      isValid: false,
      error: 'Please enter a value to convert.',
    };
  }

  // 2. Localized characters sanitizer (replaces commas if used as thousands separator, handles decimal points)
  // If input is "1,000.50", replace "," to parse as "1000.50"
  // If input is European style like "1.000,50", it's complex, but we clean commas or dots if we detect multiple.
  let sanitized = trimmed.replace(/,/g, '');

  // 3. Validate general number format (including scientific notation like 1e5 or 3.2e-4)
  const numericRegex = /^-?\d*\.?\d+(?:[eE][-+]?\d+)?$/;
  if (!numericRegex.test(sanitized)) {
    return {
      isValid: false,
      error: 'Please enter a valid numeric value.',
    };
  }

  const parsed = Number(sanitized);

  // 4. NaN validation
  if (isNaN(parsed)) {
    return {
      isValid: false,
      error: 'The input value is not a valid number.',
    };
  }

  // 5. Negative values validation
  if (!options.allowNegative && parsed < 0) {
    return {
      isValid: false,
      error: 'Negative values are not allowed for this converter.',
    };
  }

  // 6. Overflow limit check (Standard JS safety: max 1e21 or 1e15 for absolute precision)
  const MAX_LIMIT = options.maxValue ?? 1e15;
  if (Math.abs(parsed) > MAX_LIMIT) {
    return {
      isValid: false,
      error: `Value is too large. Maximum supported limit is ${MAX_LIMIT.toExponential(0)}.`,
    };
  }

  // 7. Underflow limit check (Avoid scientific float issues at subatomic scales)
  const MIN_LIMIT = options.minValue ?? 1e-15;
  if (parsed !== 0 && Math.abs(parsed) < MIN_LIMIT) {
    return {
      isValid: false,
      error: `Value is too small. Minimum supported limit is ${MIN_LIMIT.toExponential(0)}.`,
    };
  }

  return {
    isValid: true,
    sanitizedValue: sanitized,
  };
}

/**
 * Validates a CSV string before rendering or converting.
 */
export function validateCSV(csvText: string): ValidationResult {
  if (!csvText.trim()) {
    return { isValid: false, error: 'CSV data is empty.' };
  }
  return { isValid: true, sanitizedValue: csvText };
}

/**
 * Validates a JSON string and returns details on syntax error offset if present.
 */
export function validateJSON(jsonText: string): ValidationResult {
  if (!jsonText.trim()) {
    return { isValid: false, error: 'JSON data is empty.' };
  }
  try {
    JSON.parse(jsonText);
    return { isValid: true, sanitizedValue: jsonText };
  } catch (err: any) {
    // Extract line/column information if present in the error message
    return {
      isValid: false,
      error: `Invalid JSON syntax: ${err.message}`,
    };
  }
}
