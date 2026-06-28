export type ToolCategory = 'PDF' | 'Image' | 'Developer' | 'Media' | 'AI' | 'Text' | 'Documents' | 'Calculators' | 'Converters' | 'Color' | 'SEO' | 'Security' | 'Finance' | 'Utilities';

/** Intent variant type — classifies what unique angle a pSEO landing page covers */
export type IntentVariantType =
  | 'online'
  | 'offline'
  | 'mobile'
  | 'windows'
  | 'mac'
  | 'iphone'
  | 'android'
  | 'batch'
  | 'high-quality'
  | 'without-uploading'
  | 'in-browser'
  | 'large-files'
  | 'lossless'
  | 'free'
  | 'fast';

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

/** A usage example shown on the tool landing page */
export interface ToolExample {
  title: string;
  description: string;
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

  // Rich landing page content
  commonMistakes?: string[];            // Bullet-list of common pitfalls shown on page
  examples?: ToolExample[];             // Usage examples shown on page
  privacyExplanation?: string;          // Explicit privacy note for this tool

  // Programmatic SEO — Intent Variant Fields (all optional; only set on pSEO variant pages)
  intentVariant?: IntentVariantType;    // e.g. 'online' | 'offline' | 'mobile' | 'batch'
  parentToolSlug?: string;              // Base tool slug, e.g. 'png-to-pdf'
  intentContext?: string;               // Short badge text: "Works Offline", "Mobile-Friendly"
  noIndex?: boolean;                    // If true: page is live but excluded from sitemap

  // Relationships
  relatedTools: string[];

  // Dynamic Lifecycle Fields (stored in DB, merged at runtime)
  status?: "Live" | "In Progress" | "Testing" | "Planned" | "Beta" | "Deprecated" | "Broken" | "Hidden";
  priority?: "Critical" | "High" | "Medium" | "Low";
  completion?: number; // 0-100
  frontend?: boolean;
  backend?: boolean;
  api?: boolean;
  mobile?: boolean;
  seo?: boolean;
  tested?: boolean;
  productionReady?: boolean;
  lastUpdated?: string;
  estimatedCompletion?: string;
  developerNotes?: string;
  version?: string;
  expectedFeatures?: { name: string; completed: boolean }[];
  ext?: Record<string, any>;

  // Additional Metadata
  featured?: boolean;
  popular?: boolean;
  new?: boolean;
  route?: string;
  icon?: string;
}

