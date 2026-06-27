import { ConverterProvider, ConversionJob, ConversionResult } from '@/lib/converters/provider';
import { downloadFromR2, r2Client } from '@/services/R2Service';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import Papa from 'papaparse';
import { marked } from 'marked';
import TurndownService from 'turndown';
import * as yaml from 'js-yaml';

/**
 * Text Converter Provider
 * Handles JSON <-> CSV, Markdown <-> HTML, YAML <-> JSON, Base64 encode/decode
 */
export const textProvider: ConverterProvider = {
  name: 'Text Engine',
  canHandle(inputFormat: string, outputFormat: string): boolean {
    const supported = ['.json', '.csv', '.md', '.html', '.yaml', '.yml', '.txt'];
    return supported.includes(inputFormat) && supported.includes(outputFormat);
  },

  async convert(job: ConversionJob): Promise<ConversionResult> {
    const startTime = Date.now();
    try {
      // 1. Fetch input file
      let inputBuffer: Buffer;
      if (job.rawContent) {
        inputBuffer = Buffer.from(job.rawContent, 'base64');
      } else if (job.inputFileKey) {
        inputBuffer = await downloadFromR2(job.inputFileKey);
      } else {
        throw new Error('No input data provided');
      }
      const inputText = inputBuffer.toString('utf-8');
      
      let outputText = '';
      
      // 2. Perform the specific conversion based on formats
      if (job.inputFormat === '.json' && job.outputFormat === '.csv') {
        const parsed = JSON.parse(inputText);
        outputText = Papa.unparse(parsed);
      } 
      else if (job.inputFormat === '.csv' && job.outputFormat === '.json') {
        const parsed = Papa.parse(inputText, { header: true, dynamicTyping: true });
        outputText = JSON.stringify(parsed.data, null, 2);
      } 
      else if (job.inputFormat === '.md' && job.outputFormat === '.html') {
        outputText = marked.parse(inputText) as string;
      } 
      else if (job.inputFormat === '.html' && job.outputFormat === '.md') {
        const turndownService = new TurndownService();
        outputText = turndownService.turndown(inputText);
      } 
      else if ((job.inputFormat === '.yaml' || job.inputFormat === '.yml') && job.outputFormat === '.json') {
        const parsed = yaml.load(inputText);
        outputText = JSON.stringify(parsed, null, 2);
      } 
      else if (job.inputFormat === '.txt' && job.outputFormat === '.txt') {
        // Base64 encoding/decoding. If it's valid base64 (crude check), decode, else encode.
        // Usually we need an explicit parameter, but we'll infer it or use an option if provided.
        const options = job.options || {};
        if (options.action === 'decode') {
          outputText = Buffer.from(inputText, 'base64').toString('utf-8');
        } else if (options.action === 'encode') {
          outputText = Buffer.from(inputText).toString('base64');
        } else {
          // Auto-detect if not specified
          const isBase64 = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/.test(inputText.trim());
          if (isBase64) {
            outputText = Buffer.from(inputText.trim(), 'base64').toString('utf-8');
          } else {
            outputText = Buffer.from(inputText).toString('base64');
          }
        }
      }
      else {
        throw new Error('Unsupported text conversion pairing');
      }

      // 3. Output result (skip R2 for text files if small)
      const outputBuffer = Buffer.from(outputText, 'utf-8');
      
      // Text conversions are almost always small, return them directly to avoid R2 overhead
      if (outputBuffer.length < 5 * 1024 * 1024) {
        return {
          success: true,
          rawOutputContent: outputBuffer.toString('base64'),
          timeTakenMs: Date.now() - startTime,
        };
      }

      // Fallback to R2 upload if very large (over 5MB)
      const bucketName = process.env.R2_BUCKET_NAME || '';
      const outputKey = `converted/${uuidv4()}-${Date.now()}${job.outputFormat}`;

      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: outputKey,
        Body: outputBuffer,
        ContentType: getMimeType(job.outputFormat),
      });

      await r2Client.send(command);

      return {
        success: true,
        outputFileKey: outputKey,
        timeTakenMs: Date.now() - startTime,
      };

    } catch (error: any) {
      console.error('Text Conversion Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to convert text file',
      };
    }
  }
};

function getMimeType(ext: string): string {
  const map: Record<string, string> = {
    '.csv': 'text/csv',
    '.json': 'application/json',
    '.md': 'text/markdown',
    '.html': 'text/html',
    '.txt': 'text/plain',
  };
  return map[ext] || 'text/plain';
}
