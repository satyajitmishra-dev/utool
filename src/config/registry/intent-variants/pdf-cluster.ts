import { RegistryTool } from '@/types/tool-registry';
import { generateIntentVariants } from '../intent-generator';

// ─── PNG to PDF ────────────────────────────────────────────────────────────
export const pngToPdfVariants: RegistryTool[] = generateIntentVariants(
  {
    id: 'png-to-pdf',
    slug: 'png-to-pdf',
    name: 'PNG to PDF',
    actionPhrase: 'convert PNG to PDF',
    description: 'Convert PNG images into PDF documents instantly.',
    category: 'Image',
    primaryTag: 'Image',
    iconTag: 'FileImage',
    supportedInputFormats: ['.png'],
    supportedOutputFormats: ['.pdf'],
    relatedTools: ['jpg-to-pdf', 'webp-to-pdf', 'image-compressor', 'compress-pdf', 'merge-pdf'],
  },
  [
    { intent: 'online' },
    { intent: 'offline' },
    { intent: 'without-uploading' },
    { intent: 'in-browser' },
    { intent: 'mobile' },
    { intent: 'iphone' },
    { intent: 'android' },
    { intent: 'windows' },
    { intent: 'mac' },
    { intent: 'batch' },
    { intent: 'high-quality' },
    { intent: 'lossless' },
    { intent: 'large-files' },
    { intent: 'fast' },
    { intent: 'free' },
  ]
);

// ─── JPG to PDF ────────────────────────────────────────────────────────────
export const jpgToPdfVariants: RegistryTool[] = generateIntentVariants(
  {
    id: 'jpg-to-pdf',
    slug: 'jpg-to-pdf',
    name: 'JPG to PDF',
    actionPhrase: 'convert JPG to PDF',
    description: 'Convert JPG and JPEG photos into PDF documents instantly.',
    category: 'Image',
    primaryTag: 'Image',
    iconTag: 'FileImage',
    supportedInputFormats: ['.jpg', '.jpeg'],
    supportedOutputFormats: ['.pdf'],
    relatedTools: ['png-to-pdf', 'webp-to-pdf', 'image-compressor', 'compress-pdf', 'merge-pdf'],
  },
  [
    { intent: 'online' },
    { intent: 'offline' },
    { intent: 'without-uploading' },
    { intent: 'in-browser' },
    { intent: 'mobile' },
    { intent: 'iphone' },
    { intent: 'android' },
    { intent: 'windows' },
    { intent: 'mac' },
    { intent: 'batch' },
    { intent: 'high-quality' },
    { intent: 'large-files' },
    { intent: 'fast' },
    { intent: 'free' },
  ]
);

// ─── WebP to PDF ───────────────────────────────────────────────────────────
export const webpToPdfVariants: RegistryTool[] = generateIntentVariants(
  {
    id: 'webp-to-pdf',
    slug: 'webp-to-pdf',
    name: 'WebP to PDF',
    actionPhrase: 'convert WebP to PDF',
    description: 'Convert WebP images into high-fidelity PDF documents.',
    category: 'Image',
    primaryTag: 'Image',
    iconTag: 'FileImage',
    supportedInputFormats: ['.webp'],
    supportedOutputFormats: ['.pdf'],
    relatedTools: ['png-to-pdf', 'jpg-to-pdf', 'compress-pdf', 'merge-pdf'],
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

// ─── HEIC to PDF ───────────────────────────────────────────────────────────
export const heicToPdfVariants: RegistryTool[] = generateIntentVariants(
  {
    id: 'heic-to-pdf',
    slug: 'heic-to-pdf',
    name: 'HEIC to PDF',
    actionPhrase: 'convert HEIC to PDF',
    description: 'Convert iPhone HEIC photos into standard PDF documents.',
    category: 'Image',
    primaryTag: 'Image',
    iconTag: 'FileImage',
    supportedInputFormats: ['.heic'],
    supportedOutputFormats: ['.pdf'],
    relatedTools: ['png-to-pdf', 'jpg-to-pdf', 'compress-pdf'],
  },
  [
    { intent: 'online' },
    { intent: 'iphone' },
    { intent: 'without-uploading' },
    { intent: 'mobile' },
    { intent: 'batch' },
    { intent: 'high-quality' },
    { intent: 'free' },
  ]
);

// ─── PDF to PNG ────────────────────────────────────────────────────────────
export const pdfToPngVariants: RegistryTool[] = generateIntentVariants(
  {
    id: 'pdf-to-png',
    slug: 'pdf-to-png',
    name: 'PDF to PNG',
    actionPhrase: 'convert PDF to PNG',
    description: 'Extract PDF pages as high-resolution PNG images.',
    category: 'Image',
    primaryTag: 'Image',
    iconTag: 'Image',
    relatedTools: ['png-to-pdf', 'compress-pdf', 'split-pdf'],
  },
  [
    { intent: 'online' },
    { intent: 'offline' },
    { intent: 'without-uploading' },
    { intent: 'mobile' },
    { intent: 'high-quality' },
    { intent: 'batch' },
    { intent: 'fast' },
    { intent: 'free' },
  ]
);

// ─── PDF to JPG ────────────────────────────────────────────────────────────
export const pdfToJpgVariants: RegistryTool[] = generateIntentVariants(
  {
    id: 'pdf-to-jpg',
    slug: 'pdf-to-jpg',
    name: 'PDF to JPG',
    actionPhrase: 'convert PDF to JPG',
    description: 'Convert PDF pages into JPG images online.',
    category: 'Image',
    primaryTag: 'Image',
    iconTag: 'Image',
    relatedTools: ['jpg-to-pdf', 'compress-pdf', 'split-pdf'],
  },
  [
    { intent: 'online' },
    { intent: 'offline' },
    { intent: 'without-uploading' },
    { intent: 'mobile' },
    { intent: 'high-quality' },
    { intent: 'batch' },
    { intent: 'fast' },
    { intent: 'free' },
  ]
);

// ─── Merge PDF ─────────────────────────────────────────────────────────────
export const mergePdfVariants: RegistryTool[] = generateIntentVariants(
  {
    id: 'merge-pdf',
    slug: 'merge-pdf',
    name: 'Merge PDF',
    actionPhrase: 'merge PDF files',
    description: 'Combine multiple PDF files into one document.',
    category: 'PDF',
    primaryTag: 'PDF',
    iconTag: 'FileText',
    relatedTools: ['split-pdf', 'compress-pdf', 'png-to-pdf', 'jpg-to-pdf'],
  },
  [
    { intent: 'online' },
    { intent: 'offline' },
    { intent: 'without-uploading' },
    { intent: 'in-browser' },
    { intent: 'mobile' },
    { intent: 'windows' },
    { intent: 'mac' },
    { intent: 'batch' },
    { intent: 'large-files' },
    { intent: 'fast' },
    { intent: 'free' },
  ]
);

// ─── Compress PDF ──────────────────────────────────────────────────────────
export const compressPdfVariants: RegistryTool[] = generateIntentVariants(
  {
    id: 'compress-pdf',
    slug: 'compress-pdf',
    name: 'Compress PDF',
    actionPhrase: 'compress PDF files',
    description: 'Reduce PDF file size while preserving quality.',
    category: 'PDF',
    primaryTag: 'PDF',
    iconTag: 'Maximize2',
    relatedTools: ['merge-pdf', 'split-pdf', 'png-to-pdf'],
  },
  [
    { intent: 'online' },
    { intent: 'offline' },
    { intent: 'without-uploading' },
    { intent: 'mobile' },
    { intent: 'windows' },
    { intent: 'mac' },
    { intent: 'batch' },
    { intent: 'large-files' },
    { intent: 'fast' },
    { intent: 'free' },
  ]
);

// ─── Split PDF ─────────────────────────────────────────────────────────────
export const splitPdfVariants: RegistryTool[] = generateIntentVariants(
  {
    id: 'split-pdf',
    slug: 'split-pdf',
    name: 'Split PDF',
    actionPhrase: 'split PDF documents',
    description: 'Extract pages or split ranges from any PDF document.',
    category: 'PDF',
    primaryTag: 'PDF',
    iconTag: 'Scissors',
    relatedTools: ['merge-pdf', 'compress-pdf', 'extract-pdf-pages'],
  },
  [
    { intent: 'online' },
    { intent: 'offline' },
    { intent: 'without-uploading' },
    { intent: 'mobile' },
    { intent: 'windows' },
    { intent: 'mac' },
    { intent: 'fast' },
    { intent: 'free' },
  ]
);

// ─── Export all PDF-cluster variants ──────────────────────────────────────
export const PDF_CLUSTER_VARIANTS: RegistryTool[] = [
  ...pngToPdfVariants,
  ...jpgToPdfVariants,
  ...webpToPdfVariants,
  ...heicToPdfVariants,
  ...pdfToPngVariants,
  ...pdfToJpgVariants,
  ...mergePdfVariants,
  ...compressPdfVariants,
  ...splitPdfVariants,
];
