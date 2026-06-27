export type ToolCategory = 'Converters' | 'Downloader' | 'Editor' | 'PDF' | 'Image' | 'Video' | 'Audio' | 'OCR' | 'AI' | 'Utilities' | 'Data' | 'Media';

export interface ToolSEOData {
  title: string;
  description: string;
  keywords: string[];
  h1?: string;
}

export interface ToolFAQ {
  question: string;
  answer: string;
}

export interface ToolBenefit {
  title: string;
  desc: string;
}

export interface ToolLongFormSection {
  sectionTitle: string;
  paragraphs: string[];
}

export interface RegistryTool {
  // Base Identifiers
  id: string;
  slug: string;
  name: string;
  description: string; // One-line description for cards
  
  // Tagging & Categorization
  primaryTag: string; // Only ONE primary tag allowed (e.g. 'Converter', 'PDF')
  category: ToolCategory;
  
  // UI Assets
  iconTag: string; // Lucide icon name mapping (e.g., 'FileText', 'Image')
  
  // Status
  isPremium?: boolean;
  requiresAuth?: boolean;
  freeLimit?: number;
  isActive: boolean; // Determines if it's shown in the marketplace

  // Converter-Specific Configurations
  isConverter?: boolean;
  supportedInputFormats?: string[];
  supportedOutputFormats?: string[];
  
  // SEO & Extended Content
  seoMeta: ToolSEOData;
  heroContent?: string;
  intro?: string;
  howItWorks?: string[];
  benefits?: ToolBenefit[];
  faqs?: ToolFAQ[];
  longFormContent?: ToolLongFormSection[];
  
  // Relationships
  relatedTools: string[];
}
