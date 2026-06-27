export interface ConversionJob {
  id: string;
  inputFileKey?: string;
  rawContent?: string;
  inputFormat: string;
  outputFormat: string;
  options?: any;
}

export interface ConversionResult {
  success: boolean;
  outputFileKey?: string;
  rawOutputContent?: string;
  downloadUrl?: string;
  error?: string;
  timeTakenMs?: number;
}

export interface ConverterProvider {
  /**
   * Identifies the provider engine (e.g., 'sharp', 'turndown', 'pdf-lib', 'ocrspace')
   */
  name: string;

  /**
   * Checks if this provider can handle the requested conversion.
   */
  canHandle(inputFormat: string, outputFormat: string): boolean;

  /**
   * Executes the conversion.
   * Note: In Phase 1, most of these will be synchronous (blocking until done).
   * For async background jobs later, this might return a job ID.
   */
  convert(job: ConversionJob): Promise<ConversionResult>;
}
