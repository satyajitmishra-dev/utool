import { RegistryTool } from '@/types/tool-registry';
import { generateIntentVariants } from '../intent-generator';

// ─── Word Counter ──────────────────────────────────────────────────────────
export const wordCounterVariants: RegistryTool[] = generateIntentVariants(
  {
    id: 'word-counter',
    slug: 'word-counter',
    name: 'Word Counter',
    actionPhrase: 'count words and characters',
    description: 'Count words, characters, sentences, and paragraphs in any text.',
    category: 'Text',
    primaryTag: 'Text',
    iconTag: 'Type',
    relatedTools: ['case-converter', 'character-counter', 'text-to-speech'],
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

// ─── Text Case Converter ───────────────────────────────────────────────────
export const textCaseConverterVariants: RegistryTool[] = generateIntentVariants(
  {
    id: 'case-converter',
    slug: 'case-converter',
    name: 'Text Case Converter',
    actionPhrase: 'convert text case',
    description: 'Convert text between UPPER CASE, lower case, Title Case, and camelCase.',
    category: 'Text',
    primaryTag: 'Text',
    iconTag: 'Type',
    relatedTools: ['word-counter', 'text-reverser', 'duplicate-line-remover'],
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

// ─── Lorem Ipsum Generator ─────────────────────────────────────────────────
export const loremIpsumVariants: RegistryTool[] = generateIntentVariants(
  {
    id: 'lorem-ipsum-generator',
    slug: 'lorem-ipsum-generator',
    name: 'Lorem Ipsum Generator',
    actionPhrase: 'generate Lorem Ipsum placeholder text',
    description: 'Generate Lorem Ipsum placeholder text for design mockups and prototypes.',
    category: 'Text',
    primaryTag: 'Text',
    iconTag: 'Type',
    relatedTools: ['word-counter', 'case-converter'],
  },
  [
    { intent: 'online' },
    { intent: 'offline' },
    { intent: 'fast' },
    { intent: 'free' },
  ]
);

// ─── Text to Binary ────────────────────────────────────────────────────────
export const textToBinaryVariants: RegistryTool[] = generateIntentVariants(
  {
    id: 'text-to-binary',
    slug: 'text-to-binary',
    name: 'Text to Binary',
    actionPhrase: 'convert text to binary code',
    description: 'Convert plain text into binary (0 and 1) representation instantly.',
    category: 'Converters',
    primaryTag: 'Converter',
    iconTag: 'RefreshCw',
    isConverter: true,
    relatedTools: ['base64-encoder-decoder', 'case-converter'],
  },
  [
    { intent: 'online' },
    { intent: 'offline' },
    { intent: 'without-uploading' },
    { intent: 'fast' },
    { intent: 'free' },
  ]
);

// ─── Slug Generator ────────────────────────────────────────────────────────
export const slugGeneratorVariants: RegistryTool[] = generateIntentVariants(
  {
    id: 'slug-generator',
    slug: 'slug-generator',
    name: 'Slug Generator',
    actionPhrase: 'generate URL slugs',
    description: 'Convert titles and text into SEO-friendly URL slugs instantly.',
    category: 'Text',
    primaryTag: 'Text',
    iconTag: 'Globe',
    relatedTools: ['case-converter', 'url-encoder', 'keyword-density'],
  },
  [
    { intent: 'online' },
    { intent: 'offline' },
    { intent: 'without-uploading' },
    { intent: 'fast' },
    { intent: 'free' },
  ]
);

// ─── Export all Text-cluster variants ──────────────────────────────────────
export const TEXT_CLUSTER_VARIANTS: RegistryTool[] = [
  ...wordCounterVariants,
  ...textCaseConverterVariants,
  ...loremIpsumVariants,
  ...textToBinaryVariants,
  ...slugGeneratorVariants,
];
