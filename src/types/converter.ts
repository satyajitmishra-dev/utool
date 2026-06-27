export type ConverterCategory = 'image' | 'pdf' | 'html' | 'data' | 'audio' | 'video' | 'ocr';

export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ConverterConfig {
  id: string; // e.g., 'png-to-jpg'
  slug: string; // e.g., 'png-to-jpg'
  category: ConverterCategory;
  name: string; // e.g., 'PNG to JPG'
  description: string; // Brief description for cards
  heroContent: string; // Longer description for the hero section
  iconTag: string; // Tag to map to Lucide icon in ToolCard
  supportedInputFormats: string[]; // e.g., ['.png']
  supportedOutputFormats: string[]; // e.g., ['.jpg']
  seoMeta: SEOData;
  faqData: FAQItem[];
  relatedTools: string[]; // Array of converter IDs
  
  // Execution Strategy
  runOn?: 'client' | 'server';
  
  // Dynamic Configuration UI
  optionsSchema?: Record<string, any>; // Used to dynamically generate tool options in the right sidebar
  
  featureFlags?: {
    isPro?: boolean;
    isActive: boolean;
  };
}
