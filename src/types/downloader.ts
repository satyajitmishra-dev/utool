import { SEOData, FAQItem } from './converter';

export type DownloaderCategory = 'video' | 'audio' | 'image' | 'file';

export interface DownloaderConfig {
  id: string; // e.g., 'direct-file-downloader'
  slug: string; // e.g., 'file-downloader'
  category: DownloaderCategory;
  name: string; // e.g., 'Universal File Downloader'
  description: string;
  heroContent: string;
  iconTag: string;
  
  // URL validation
  urlPattern: RegExp; // e.g., /https?:\/\/.+\.(mp4|mp3|zip|pdf|jpg|png|gif)/i
  
  // What types of files does this downloader produce?
  supportedOutputFormats: string[]; 
  
  seoMeta: SEOData;
  faqData: FAQItem[];
  relatedTools: string[];
  
  featureFlags?: {
    isPro?: boolean;
    isActive: boolean;
  };
}
