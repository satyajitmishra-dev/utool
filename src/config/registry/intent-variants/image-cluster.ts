import { RegistryTool } from '@/types/tool-registry';
import { generateIntentVariants } from '../intent-generator';

// ─── Image Compressor ──────────────────────────────────────────────────────
export const imageCompressorVariants: RegistryTool[] = generateIntentVariants(
  {
    id: 'image-compressor',
    slug: 'image-compressor',
    name: 'Image Compressor',
    actionPhrase: 'compress images',
    description: 'Reduce image file sizes without visible quality loss.',
    category: 'Image',
    primaryTag: 'Image',
    iconTag: 'Maximize2',
    relatedTools: ['image-resizer', 'png-to-jpg', 'jpg-to-png', 'webp-converter'],
  },
  [
    { intent: 'online' },
    { intent: 'offline' },
    { intent: 'without-uploading' },
    { intent: 'in-browser' },
    { intent: 'mobile' },
    { intent: 'iphone' },
    { intent: 'android' },
    { intent: 'batch' },
    { intent: 'lossless' },
    { intent: 'fast' },
    { intent: 'free' },
  ]
);

// ─── Image Resizer ─────────────────────────────────────────────────────────
export const imageResizerVariants: RegistryTool[] = generateIntentVariants(
  {
    id: 'image-resizer',
    slug: 'image-resizer',
    name: 'Image Resizer',
    actionPhrase: 'resize images',
    description: 'Resize images to exact pixel dimensions or percentage scale.',
    category: 'Image',
    primaryTag: 'Image',
    iconTag: 'Maximize2',
    relatedTools: ['image-compressor', 'image-crop', 'png-to-jpg'],
  },
  [
    { intent: 'online' },
    { intent: 'offline' },
    { intent: 'without-uploading' },
    { intent: 'mobile' },
    { intent: 'batch' },
    { intent: 'high-quality' },
    { intent: 'fast' },
    { intent: 'free' },
  ]
);

// ─── PNG to JPG ────────────────────────────────────────────────────────────
export const pngToJpgVariants: RegistryTool[] = generateIntentVariants(
  {
    id: 'png-to-jpg',
    slug: 'png-to-jpg',
    name: 'PNG to JPG',
    actionPhrase: 'convert PNG to JPG',
    description: 'Convert PNG images to JPG format with high quality.',
    category: 'Converters',
    primaryTag: 'Converter',
    iconTag: 'RefreshCw',
    isConverter: true,
    supportedInputFormats: ['.png'],
    supportedOutputFormats: ['.jpg', '.jpeg'],
    relatedTools: ['jpg-to-png', 'webp-converter', 'image-compressor', 'png-to-pdf'],
  },
  [
    { intent: 'online' },
    { intent: 'offline' },
    { intent: 'without-uploading' },
    { intent: 'mobile' },
    { intent: 'batch' },
    { intent: 'high-quality' },
    { intent: 'lossless' },
    { intent: 'fast' },
    { intent: 'free' },
  ]
);

// ─── JPG to PNG ────────────────────────────────────────────────────────────
export const jpgToPngVariants: RegistryTool[] = generateIntentVariants(
  {
    id: 'jpg-to-png',
    slug: 'jpg-to-png',
    name: 'JPG to PNG',
    actionPhrase: 'convert JPG to PNG',
    description: 'Convert JPG photos to lossless PNG format.',
    category: 'Converters',
    primaryTag: 'Converter',
    iconTag: 'RefreshCw',
    isConverter: true,
    supportedInputFormats: ['.jpg', '.jpeg'],
    supportedOutputFormats: ['.png'],
    relatedTools: ['png-to-jpg', 'webp-converter', 'image-compressor', 'jpg-to-pdf'],
  },
  [
    { intent: 'online' },
    { intent: 'offline' },
    { intent: 'without-uploading' },
    { intent: 'mobile' },
    { intent: 'batch' },
    { intent: 'lossless' },
    { intent: 'fast' },
    { intent: 'free' },
  ]
);

// ─── WebP Converter ────────────────────────────────────────────────────────
export const webpConverterVariants: RegistryTool[] = generateIntentVariants(
  {
    id: 'webp-converter',
    slug: 'webp-converter',
    name: 'WebP Converter',
    actionPhrase: 'convert images to WebP',
    description: 'Convert PNG, JPG, and GIF images to the modern WebP format.',
    category: 'Converters',
    primaryTag: 'Converter',
    iconTag: 'RefreshCw',
    supportedInputFormats: ['.png', '.jpg', '.jpeg', '.gif'],
    supportedOutputFormats: ['.webp'],
    relatedTools: ['png-to-jpg', 'jpg-to-png', 'image-compressor', 'webp-to-pdf'],
  },
  [
    { intent: 'online' },
    { intent: 'offline' },
    { intent: 'without-uploading' },
    { intent: 'mobile' },
    { intent: 'batch' },
    { intent: 'high-quality' },
    { intent: 'fast' },
    { intent: 'free' },
  ]
);

// ─── SVG to PNG ────────────────────────────────────────────────────────────
export const svgToPngVariants: RegistryTool[] = generateIntentVariants(
  {
    id: 'svg-to-png',
    slug: 'svg-to-png',
    name: 'SVG to PNG',
    actionPhrase: 'convert SVG to PNG',
    description: 'Convert SVG vector illustrations to PNG raster images.',
    category: 'Converters',
    primaryTag: 'Converter',
    iconTag: 'RefreshCw',
    supportedInputFormats: ['.svg'],
    supportedOutputFormats: ['.png'],
    relatedTools: ['png-to-jpg', 'svg-to-pdf', 'image-compressor'],
  },
  [
    { intent: 'online' },
    { intent: 'without-uploading' },
    { intent: 'mobile' },
    { intent: 'high-quality' },
    { intent: 'batch' },
    { intent: 'fast' },
    { intent: 'free' },
  ]
);

// ─── GIF to MP4 ────────────────────────────────────────────────────────────
export const gifToMp4Variants: RegistryTool[] = generateIntentVariants(
  {
    id: 'gif-to-mp4',
    slug: 'gif-to-mp4',
    name: 'GIF to MP4',
    actionPhrase: 'convert GIF to MP4',
    description: 'Convert animated GIF files to compressed MP4 video.',
    category: 'Media',
    primaryTag: 'Media',
    iconTag: 'Video',
    relatedTools: ['video-to-gif', 'video-trimmer', 'image-compressor'],
  },
  [
    { intent: 'online' },
    { intent: 'without-uploading' },
    { intent: 'mobile' },
    { intent: 'high-quality' },
    { intent: 'fast' },
    { intent: 'free' },
  ]
);

// ─── HEIC to JPG ───────────────────────────────────────────────────────────
export const heicToJpgVariants: RegistryTool[] = generateIntentVariants(
  {
    id: 'heic-to-jpg',
    slug: 'heic-to-jpg',
    name: 'HEIC to JPG',
    actionPhrase: 'convert HEIC to JPG',
    description: 'Convert iPhone HEIC photos to universal JPG format.',
    category: 'Converters',
    primaryTag: 'Converter',
    iconTag: 'RefreshCw',
    supportedInputFormats: ['.heic'],
    supportedOutputFormats: ['.jpg', '.jpeg'],
    relatedTools: ['jpg-to-png', 'heic-to-pdf', 'image-compressor'],
  },
  [
    { intent: 'online' },
    { intent: 'iphone' },
    { intent: 'without-uploading' },
    { intent: 'mobile' },
    { intent: 'batch' },
    { intent: 'high-quality' },
    { intent: 'fast' },
    { intent: 'free' },
  ]
);

// ─── Export all Image-cluster variants ─────────────────────────────────────
export const IMAGE_CLUSTER_VARIANTS: RegistryTool[] = [
  ...imageCompressorVariants,
  ...imageResizerVariants,
  ...pngToJpgVariants,
  ...jpgToPngVariants,
  ...webpConverterVariants,
  ...svgToPngVariants,
  ...gifToMp4Variants,
  ...heicToJpgVariants,
];
