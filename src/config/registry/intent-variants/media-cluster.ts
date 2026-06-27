import { RegistryTool } from '@/types/tool-registry';
import { generateIntentVariants } from '../intent-generator';

// ─── MP3 Converter ─────────────────────────────────────────────────────────
export const mp3ConverterVariants: RegistryTool[] = generateIntentVariants(
  {
    id: 'audio-converter',
    slug: 'audio-converter',
    name: 'MP3 Converter',
    actionPhrase: 'convert audio files',
    description: 'Convert audio files between MP3, WAV, M4A, OGG, and FLAC formats.',
    category: 'Media',
    primaryTag: 'Media',
    iconTag: 'Music',
    relatedTools: ['audio-trimmer', 'audio-joiner', 'video-to-gif'],
  },
  [
    { intent: 'online' },
    { intent: 'offline' },
    { intent: 'without-uploading' },
    { intent: 'mobile' },
    { intent: 'batch' },
    { intent: 'fast' },
    { intent: 'free' },
  ]
);

// ─── Video to GIF ──────────────────────────────────────────────────────────
export const videoToGifVariants: RegistryTool[] = generateIntentVariants(
  {
    id: 'video-to-gif',
    slug: 'video-to-gif',
    name: 'Video to GIF',
    actionPhrase: 'convert video to GIF',
    description: 'Convert MP4 and WebM video clips into looping animated GIFs.',
    category: 'Media',
    primaryTag: 'Media',
    iconTag: 'Video',
    relatedTools: ['gif-to-mp4', 'video-trimmer', 'image-compressor'],
  },
  [
    { intent: 'online' },
    { intent: 'offline' },
    { intent: 'without-uploading' },
    { intent: 'mobile' },
    { intent: 'high-quality' },
    { intent: 'fast' },
    { intent: 'free' },
  ]
);

// ─── Video Trimmer ─────────────────────────────────────────────────────────
export const videoTrimmerVariants: RegistryTool[] = generateIntentVariants(
  {
    id: 'video-trimmer',
    slug: 'video-trimmer',
    name: 'Video Trimmer',
    actionPhrase: 'trim video files',
    description: 'Cut and trim video clips directly in your browser without re-encoding.',
    category: 'Media',
    primaryTag: 'Media',
    iconTag: 'Video',
    relatedTools: ['video-to-gif', 'mute-video', 'audio-trimmer'],
  },
  [
    { intent: 'online' },
    { intent: 'offline' },
    { intent: 'without-uploading' },
    { intent: 'mobile' },
    { intent: 'fast' },
    { intent: 'free' },
  ]
);

// ─── Export all Media-cluster variants ─────────────────────────────────────
export const MEDIA_CLUSTER_VARIANTS: RegistryTool[] = [
  ...mp3ConverterVariants,
  ...videoToGifVariants,
  ...videoTrimmerVariants,
];
