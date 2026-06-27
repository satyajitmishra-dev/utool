import { DownloaderConfig } from '@/types/downloader';
import { ConverterConfig } from '@/types/converter';

export const DOWNLOADER_REGISTRY: DownloaderConfig[] = [
  {
    id: 'direct-image',
    slug: 'image-downloader',
    category: 'image',
    name: 'Direct Image Downloader',
    description: 'Download images directly from any public URL.',
    heroContent: 'Paste any public image URL and download it directly to your workspace for editing or format conversion.',
    iconTag: 'image',
    urlPattern: /^https?:\/\/.+\.(png|jpe?g|webp|gif|svg)$/i,
    supportedOutputFormats: ['.png', '.jpg', '.webp', '.gif', '.svg'],
    seoMeta: {
      title: 'Download Images via URL - UTool',
      description: 'Fetch and download any public image URL instantly.',
      keywords: ['image downloader', 'download image from url'],
    },
    faqData: [
      { question: 'What formats are supported?', answer: 'PNG, JPG, WEBP, GIF, and SVG are supported.' }
    ],
    relatedTools: ['png-to-jpg', 'jpg-to-png'],
  },
  {
    id: 'direct-video',
    slug: 'video-downloader',
    category: 'video',
    name: 'Direct Video Downloader',
    description: 'Download MP4, WEBM, and MOV videos from direct links.',
    heroContent: 'Instantly fetch videos from direct HTTP sources. Note: Specialized platform downloads are restricted by Terms of Service.',
    iconTag: 'video',
    urlPattern: /^https?:\/\/.+\.(mp4|webm|mov|avi|mkv)$/i,
    supportedOutputFormats: ['.mp4', '.webm', '.mov', '.avi', '.mkv'],
    seoMeta: {
      title: 'Download Video via URL - UTool',
      description: 'Fetch and download any public video URL instantly.',
      keywords: ['video downloader', 'download video from url'],
    },
    faqData: [],
    relatedTools: ['mp4-to-mp3'],
  },
  {
    id: 'direct-file',
    slug: 'file-downloader',
    category: 'file',
    name: 'Universal File Downloader',
    description: 'Download PDFs, ZIPs, and Documents.',
    heroContent: 'Download standard files from any direct link.',
    iconTag: 'file',
    urlPattern: /^https?:\/\/.+\.(pdf|zip|docx|xlsx|txt)$/i,
    supportedOutputFormats: ['.pdf', '.zip', '.docx', '.xlsx', '.txt'],
    seoMeta: {
      title: 'Download Files via URL - UTool',
      description: 'Download standard documents and archives from URLs.',
      keywords: ['file downloader', 'download pdf from url'],
    },
    faqData: [],
    relatedTools: [],
  }
];

export const CONVERTER_REGISTRY: ConverterConfig[] = [
  {
    id: 'png-to-jpg',
    slug: 'png-to-jpg',
    category: 'image',
    name: 'PNG to JPG',
    description: 'Convert PNG images to JPG format.',
    heroContent: 'Convert PNG files with transparency to highly compressed JPG files instantly.',
    iconTag: 'image',
    supportedInputFormats: ['.png'],
    supportedOutputFormats: ['.jpg'],
    runOn: 'server',
    optionsSchema: {
      quality: { type: 'number', min: 1, max: 100, default: 80 }
    },
    seoMeta: {
      title: 'Convert PNG to JPG - UTool',
      description: 'Fast, free PNG to JPG converter.',
      keywords: ['png to jpg', 'convert image'],
    },
    faqData: [],
    relatedTools: ['jpg-to-png']
  },
  {
    id: 'mp4-to-mp3',
    slug: 'mp4-to-mp3',
    category: 'video',
    name: 'MP4 to MP3',
    description: 'Extract audio from MP4 videos.',
    heroContent: 'Extract high-quality MP3 audio from any MP4 video file.',
    iconTag: 'music',
    supportedInputFormats: ['.mp4'],
    supportedOutputFormats: ['.mp3'],
    runOn: 'server',
    seoMeta: {
      title: 'Convert MP4 to MP3 - UTool',
      description: 'Extract audio from video files online.',
      keywords: ['mp4 to mp3', 'video to audio'],
    },
    faqData: [],
    relatedTools: []
  },
  {
    id: 'pdf-to-image',
    slug: 'pdf-to-image',
    category: 'pdf',
    name: 'PDF to Image',
    description: 'Convert PDF pages to images.',
    heroContent: 'Extract pages from your PDF as high-quality JPG or PNG images.',
    iconTag: 'file-text',
    supportedInputFormats: ['.pdf'],
    supportedOutputFormats: ['.jpg', '.png'],
    runOn: 'server',
    seoMeta: {
      title: 'Convert PDF to Image - UTool',
      description: 'Turn your PDF documents into images easily.',
      keywords: ['pdf to jpg', 'pdf to image'],
    },
    faqData: [],
    relatedTools: []
  }
];

export class RegistryService {
  static getDownloaderForUrl(url: string): DownloaderConfig | null {
    return DOWNLOADER_REGISTRY.find(d => d.urlPattern.test(url)) || null;
  }

  static getConvertersForInput(extension: string): ConverterConfig[] {
    const ext = extension.toLowerCase();
    return CONVERTER_REGISTRY.filter(c => c.supportedInputFormats.includes(ext));
  }

  static getConverterBySlug(slug: string): ConverterConfig | null {
    return CONVERTER_REGISTRY.find(c => c.slug === slug) || null;
  }

  static getDownloaderBySlug(slug: string): DownloaderConfig | null {
    return DOWNLOADER_REGISTRY.find(d => d.slug === slug) || null;
  }
}
