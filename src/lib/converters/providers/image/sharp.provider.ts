import sharp from 'sharp';
import { ConverterProvider, ConversionJob, ConversionResult } from '@/lib/converters/provider';
import { downloadFromR2, r2Client } from '@/services/R2Service';
import { PutObjectCommand } from '@aws-sdk/client-s3';

export class SharpProvider implements ConverterProvider {
  name = 'sharp';

  private supportedFormats = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'tiff', 'gif'];

  canHandle(inputFormat: string, outputFormat: string): boolean {
    const normalize = (ext: string) => ext.replace('.', '').toLowerCase();
    const inf = normalize(inputFormat);
    const outf = normalize(outputFormat);
    
    // Sharp can read many formats but we restrict to common ones for now
    return this.supportedFormats.includes(inf) && this.supportedFormats.includes(outf);
  }

  async convert(job: ConversionJob): Promise<ConversionResult> {
    const startTime = Date.now();
    try {
      if (!job.inputFileKey) throw new Error('inputFileKey is required for sharp provider');
      const inputBuffer = await downloadFromR2(job.inputFileKey);
      
      const outExt = job.outputFormat.replace('.', '').toLowerCase();
      let pipeline = sharp(inputBuffer);

      // Perform conversion based on output format
      switch (outExt) {
        case 'jpg':
        case 'jpeg':
          pipeline = pipeline.jpeg({ quality: job.options?.quality || 80 });
          break;
        case 'png':
          pipeline = pipeline.png({ quality: job.options?.quality || 80 });
          break;
        case 'webp':
          pipeline = pipeline.webp({ quality: job.options?.quality || 80 });
          break;
        case 'avif':
          pipeline = pipeline.avif({ quality: job.options?.quality || 80 });
          break;
        case 'tiff':
          pipeline = pipeline.tiff({ quality: job.options?.quality || 80 });
          break;
        case 'gif':
          pipeline = pipeline.gif();
          break;
        default:
          throw new Error(`Unsupported output format: ${outExt}`);
      }

      const outputBuffer = await pipeline.toBuffer();
      
      const outputKey = `converted/${job.id}/${Date.now()}.${outExt}`;
      const bucketName = process.env.R2_BUCKET_NAME || "";
      
      const uploadCommand = new PutObjectCommand({
        Bucket: bucketName,
        Key: outputKey,
        Body: outputBuffer,
        ContentType: `image/${outExt === 'jpg' ? 'jpeg' : outExt}`,
      });

      await r2Client.send(uploadCommand);

      return {
        success: true,
        outputFileKey: outputKey,
        timeTakenMs: Date.now() - startTime,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Image conversion failed',
        timeTakenMs: Date.now() - startTime,
      };
    }
  }
}

export const sharpProvider = new SharpProvider();
