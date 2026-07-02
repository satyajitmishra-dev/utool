/**
 * PNG to JPG Suite Engine
 * Handles client-side Canvas editing, crop, resize, rotate, and batch processing.
 */

export interface ImageConversionOptions {
  quality?: number;              // 0.0 to 1.0
  backgroundColor?: string;      // Hex color for transparent PNGs (e.g. '#FFFFFF')
  resizeWidth?: number;          // Target width
  resizeHeight?: number;         // Target height
  rotateDegrees?: number;        // 0, 90, 180, 270
  cropRect?: {                   // Normalized cropping coordinates (0 to 1)
    x: number;
    y: number;
    width: number;
    height: number;
  };
  removeMetadata?: boolean;
  targetFormat?: string;         // e.g. 'image/png' or 'image/jpeg'
}

export interface ImagePreset {
  id: string;
  name: string;
  description: string;
  quality: number;
  backgroundColor: string;
  removeMetadata: boolean;
}

export const IMAGE_PRESETS: Record<string, ImagePreset> = {
  standard: {
    id: 'standard',
    name: 'Standard (Compressed)',
    description: 'Optimized file size with high visual quality.',
    quality: 0.82,
    backgroundColor: '#FFFFFF',
    removeMetadata: true,
  },
  'high-quality': {
    id: 'high-quality',
    name: 'High Quality (Print)',
    description: 'Minimal compression, best for detailed visuals.',
    quality: 0.95,
    backgroundColor: '#FFFFFF',
    removeMetadata: true,
  },
  lossless: {
    id: 'lossless',
    name: 'Lossless Preset (100% Quality)',
    description: 'No compression artifacts. Maximum file size.',
    quality: 1.0,
    backgroundColor: '#FFFFFF',
    removeMetadata: true,
  },
};

/**
 * Loads a File/Blob into an HTMLImageElement.
 */
export function loadImage(file: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      resolve(img);
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Failed to load image file. File may be corrupted.'));
    };
  });
}

/**
 * Converts a single PNG/image file into a JPG Blob using Canvas.
 */
export async function convertSingleImage(
  file: Blob,
  options: ImageConversionOptions = {}
): Promise<Blob> {
  const img = await loadImage(file);
  
  // Set defaults
  const quality = options.quality !== undefined ? options.quality : 0.85;
  const bgColor = options.backgroundColor || '#FFFFFF';
  const rotate = options.rotateDegrees || 0;
  
  // 1. Calculate dimensions
  let originalWidth = img.naturalWidth || img.width;
  let originalHeight = img.naturalHeight || img.height;

  // Swap dimensions on 90 / 270 deg rotation
  const is90or270 = rotate === 90 || rotate === 270 || rotate === -90 || rotate === -270;
  let targetWidth = is90or270 ? originalHeight : originalWidth;
  let targetHeight = is90or270 ? originalWidth : originalHeight;

  // Apply custom resize override
  if (options.resizeWidth && options.resizeHeight) {
    targetWidth = options.resizeWidth;
    targetHeight = options.resizeHeight;
  } else if (options.resizeWidth) {
    const ratio = options.resizeWidth / (is90or270 ? originalHeight : originalWidth);
    targetWidth = options.resizeWidth;
    targetHeight = Math.round((is90or270 ? originalWidth : originalHeight) * ratio);
  } else if (options.resizeHeight) {
    const ratio = options.resizeHeight / (is90or270 ? originalWidth : originalHeight);
    targetHeight = options.resizeHeight;
    targetWidth = Math.round((is90or270 ? originalHeight : originalWidth) * ratio);
  }

  // Create document Canvas
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not create 2D canvas context for processing.');
  }

  // 2. Paint Background Color (handles transparency flattening)
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, targetWidth, targetHeight);

  // 3. Apply transformations (Rotation & Translation)
  ctx.save();
  ctx.translate(targetWidth / 2, targetHeight / 2);
  ctx.rotate((rotate * Math.PI) / 180);

  // Calculate draw size and coordinate mappings
  const drawWidth = is90or270 ? targetHeight : targetWidth;
  const drawHeight = is90or270 ? targetWidth : targetHeight;

  // 4. Draw image on canvas (handles crop if specified)
  if (options.cropRect) {
    const { x, y, width, height } = options.cropRect;
    // Map normalized crop coords back to absolute pixels
    const cropX = x * originalWidth;
    const cropY = y * originalHeight;
    const cropW = width * originalWidth;
    const cropH = height * originalHeight;
    ctx.drawImage(
      img,
      cropX,
      cropY,
      cropW,
      cropH,
      -drawWidth / 2,
      -drawHeight / 2,
      drawWidth,
      drawHeight
    );
  } else {
    ctx.drawImage(
      img,
      -drawWidth / 2,
      -drawHeight / 2,
      drawWidth,
      drawHeight
    );
  }
  ctx.restore();

  // 5. Output as target format blob
  const format = options.targetFormat || 'image/jpeg';
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas compilation returned empty blob.'));
        }
      },
      format,
      quality
    );
  });
}

/**
 * Zips a collection of converted file Blobs.
 */
export async function packageBatchZip(
  files: { blob: Blob; filename: string }[]
): Promise<Blob> {
  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();

  files.forEach((f) => {
    zip.file(f.filename, f.blob);
  });

  return zip.generateAsync({ type: 'blob' });
}
