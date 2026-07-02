/**
 * CSV processing module using dynamic imports for papaparse.
 */

export interface CSVParseResult {
  data: any[];
  errors: any[];
  meta: {
    delimiter: string;
    linebreak: string;
    aborted: boolean;
    truncated: boolean;
    fields?: string[];
  };
}

/**
 * Parses a CSV string into structured JSON objects.
 */
export async function parseCSV(
  csvText: string,
  options: {
    delimiter?: string;
    header?: boolean;
  } = {}
): Promise<CSVParseResult> {
  const PapaModule = await import('papaparse');
  const Papa = PapaModule.default || PapaModule;
  
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: options.header !== undefined ? options.header : true,
      delimiter: options.delimiter || '', // Empty triggers autodetect in papaparse
      dynamicTyping: true,
      skipEmptyLines: 'greedy',
      complete: (results) => {
        resolve(results as CSVParseResult);
      },
      error: (err: any) => {
        reject(new Error(`CSV parsing failed: ${err.message}`));
      },
    });
  });
}

/**
 * Converts JSON array structure back into a CSV string.
 */
export async function jsonToCSV(
  jsonData: any[],
  options: {
    delimiter?: string;
  } = {}
): Promise<string> {
  const PapaModule = await import('papaparse');
  const Papa = PapaModule.default || PapaModule;
  try {
    return Papa.unparse(jsonData, {
      delimiter: options.delimiter || ',',
      newline: '\r\n',
    });
  } catch (err: any) {
    throw new Error(`Failed to generate CSV: ${err.message}`);
  }
}
