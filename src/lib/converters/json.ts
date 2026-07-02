/**
 * JSON formatting, validation, and error detection module.
 */

export interface JSONDiagnostic {
  isValid: boolean;
  parsedData?: any;
  error?: string;
  line?: number;
  column?: number;
  position?: number;
}

/**
 * Parses and validates JSON, providing precise line/column locations on error.
 */
export function analyzeJSON(jsonText: string): JSONDiagnostic {
  const trimmed = jsonText.trim();
  if (!trimmed) {
    return { isValid: false, error: 'JSON content is empty.' };
  }

  try {
    const parsed = JSON.parse(trimmed);
    return { isValid: true, parsedData: parsed };
  } catch (err: any) {
    const errMsg = err.message || '';
    
    // Attempt to extract position from V8 SyntaxError message e.g. "Unexpected token } in JSON at position 145"
    // or Firefox format "JSON.parse: unexpected non-whitespace character after JSON data at line 4 column 5 of the JSON data"
    let position = -1;
    let line = 1;
    let column = 1;

    // Match V8 position
    const posMatch = errMsg.match(/position (\d+)/);
    if (posMatch) {
      position = parseInt(posMatch[1], 10);
    }

    // Match Firefox/Standard line/column details
    const lineColMatch = errMsg.match(/line (\d+) column (\d+)/);
    if (lineColMatch) {
      line = parseInt(lineColMatch[1], 10);
      column = parseInt(lineColMatch[2], 10);
    } else if (position !== -1) {
      // Calculate line and column from character position
      const lines = jsonText.substring(0, position).split('\n');
      line = lines.length;
      column = (lines[lines.length - 1] || '').length + 1;
    }

    return {
      isValid: false,
      error: `Syntax error: ${err.message}`,
      line,
      column,
      position: position !== -1 ? position : undefined,
    };
  }
}

/**
 * Converts JSON objects to a pretty formatted string or minified string.
 */
export function formatJSON(data: any, options: { minify?: boolean; indent?: number } = {}): string {
  if (options.minify) {
    return JSON.stringify(data);
  }
  return JSON.stringify(data, null, options.indent || 2);
}
