import { RegistryTool } from '@/types/tool-registry';
import { generateIntentVariants } from '../intent-generator';

// ─── JSON Formatter ────────────────────────────────────────────────────────
export const jsonFormatterVariants: RegistryTool[] = generateIntentVariants(
  {
    id: 'json-formatter',
    slug: 'json-formatter',
    name: 'JSON Formatter',
    actionPhrase: 'format and beautify JSON',
    description: 'Format, beautify, and validate JSON data instantly in your browser.',
    category: 'Developer',
    primaryTag: 'Developer',
    iconTag: 'Terminal',
    relatedTools: ['json-validator', 'json-compare', 'yaml-to-json', 'json-to-yaml'],
  },
  [
    { intent: 'online' },
    { intent: 'offline' },
    { intent: 'without-uploading' },
    { intent: 'fast' },
    { intent: 'free' },
  ]
);

// ─── Base64 Encode/Decode ──────────────────────────────────────────────────
export const base64Variants: RegistryTool[] = generateIntentVariants(
  {
    id: 'base64-encoder-decoder',
    slug: 'base64-encoder-decoder',
    name: 'Base64 Encoder/Decoder',
    actionPhrase: 'encode and decode Base64',
    description: 'Encode text or files to Base64, or decode Base64 strings back to plain text.',
    category: 'Converters',
    primaryTag: 'Converter',
    iconTag: 'RefreshCw',
    relatedTools: ['url-encoder', 'url-decoder', 'hash-md5-generator'],
  },
  [
    { intent: 'online' },
    { intent: 'offline' },
    { intent: 'without-uploading' },
    { intent: 'fast' },
    { intent: 'free' },
  ]
);

// ─── URL Encoder/Decoder ───────────────────────────────────────────────────
export const urlEncoderVariants: RegistryTool[] = generateIntentVariants(
  {
    id: 'url-encoder',
    slug: 'url-encoder',
    name: 'URL Encoder',
    actionPhrase: 'encode URLs',
    description: 'Percent-encode special characters in URLs and query strings.',
    category: 'Developer',
    primaryTag: 'Developer',
    iconTag: 'Terminal',
    relatedTools: ['url-decoder', 'base64-encoder-decoder', 'json-formatter'],
  },
  [
    { intent: 'online' },
    { intent: 'offline' },
    { intent: 'without-uploading' },
    { intent: 'fast' },
    { intent: 'free' },
  ]
);

// ─── Regex Tester ──────────────────────────────────────────────────────────
export const regexTesterVariants: RegistryTool[] = generateIntentVariants(
  {
    id: 'regex-tester',
    slug: 'regex-tester',
    name: 'Regex Tester',
    actionPhrase: 'test regular expressions',
    description: 'Test and debug regex patterns with live matching and group captures.',
    category: 'Developer',
    primaryTag: 'Developer',
    iconTag: 'Terminal',
    relatedTools: ['regex-generator', 'diff-checker', 'json-validator'],
  },
  [
    { intent: 'online' },
    { intent: 'offline' },
    { intent: 'without-uploading' },
    { intent: 'fast' },
    { intent: 'free' },
  ]
);

// ─── Diff Checker ──────────────────────────────────────────────────────────
export const diffCheckerVariants: RegistryTool[] = generateIntentVariants(
  {
    id: 'diff-checker',
    slug: 'diff-checker',
    name: 'Diff Checker',
    actionPhrase: 'compare text differences',
    description: 'Compare two text snippets side-by-side and highlight every difference.',
    category: 'Developer',
    primaryTag: 'Developer',
    iconTag: 'Sliders',
    relatedTools: ['json-compare', 'text-diff', 'json-validator'],
  },
  [
    { intent: 'online' },
    { intent: 'offline' },
    { intent: 'without-uploading' },
    { intent: 'fast' },
    { intent: 'free' },
  ]
);

// ─── Password Generator ────────────────────────────────────────────────────
export const passwordGeneratorVariants: RegistryTool[] = generateIntentVariants(
  {
    id: 'password-generator',
    slug: 'password-generator',
    name: 'Password Generator',
    actionPhrase: 'generate secure passwords',
    description: 'Generate cryptographically secure random passwords instantly.',
    category: 'Security',
    primaryTag: 'Security',
    iconTag: 'Lock',
    relatedTools: ['password-strength', 'hash-sha256-generator', 'hash-md5-generator'],
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

// ─── SHA-256 Hash Generator ────────────────────────────────────────────────
export const sha256Variants: RegistryTool[] = generateIntentVariants(
  {
    id: 'hash-sha256-generator',
    slug: 'hash-sha256-generator',
    name: 'SHA-256 Hash Generator',
    actionPhrase: 'generate SHA-256 hashes',
    description: 'Calculate SHA-256 cryptographic checksums for text or files.',
    category: 'Security',
    primaryTag: 'Security',
    iconTag: 'Lock',
    relatedTools: ['hash-md5-generator', 'password-generator', 'checksum-calculator'],
  },
  [
    { intent: 'online' },
    { intent: 'offline' },
    { intent: 'without-uploading' },
    { intent: 'fast' },
    { intent: 'free' },
  ]
);

// ─── UUID Generator ────────────────────────────────────────────────────────
export const uuidGeneratorVariants: RegistryTool[] = generateIntentVariants(
  {
    id: 'uuid-generator',
    slug: 'uuid-generator',
    name: 'UUID Generator',
    actionPhrase: 'generate UUIDs',
    description: 'Generate unique UUID identifiers in bulk instantly.',
    category: 'Developer',
    primaryTag: 'Developer',
    iconTag: 'Terminal',
    relatedTools: ['uuid-v4-generator', 'hash-md5-generator', 'password-generator'],
  },
  [
    { intent: 'online' },
    { intent: 'offline' },
    { intent: 'without-uploading' },
    { intent: 'batch' },
    { intent: 'fast' },
    { intent: 'free' },
  ]
);

// ─── Markdown Preview ──────────────────────────────────────────────────────
export const markdownPreviewVariants: RegistryTool[] = generateIntentVariants(
  {
    id: 'markdown-preview',
    slug: 'markdown-preview',
    name: 'Markdown Preview',
    actionPhrase: 'preview Markdown',
    description: 'Render Markdown syntax to styled HTML in real time.',
    category: 'Developer',
    primaryTag: 'Developer',
    iconTag: 'Eye',
    relatedTools: ['diff-checker', 'html-formatter', 'json-formatter'],
  },
  [
    { intent: 'online' },
    { intent: 'offline' },
    { intent: 'without-uploading' },
    { intent: 'fast' },
    { intent: 'free' },
  ]
);

// ─── CSS Minifier ──────────────────────────────────────────────────────────
export const cssMinifierVariants: RegistryTool[] = generateIntentVariants(
  {
    id: 'css-minifier',
    slug: 'css-minifier',
    name: 'CSS Minifier',
    actionPhrase: 'minify CSS',
    description: 'Compress and minify CSS stylesheets to reduce page load times.',
    category: 'Developer',
    primaryTag: 'Developer',
    iconTag: 'Minimize2',
    relatedTools: ['js-beautifier', 'html-formatter', 'sql-minifier'],
  },
  [
    { intent: 'online' },
    { intent: 'offline' },
    { intent: 'without-uploading' },
    { intent: 'fast' },
    { intent: 'free' },
  ]
);

// ─── Export all Developer-cluster variants ─────────────────────────────────
export const DEVELOPER_CLUSTER_VARIANTS: RegistryTool[] = [
  ...jsonFormatterVariants,
  ...base64Variants,
  ...urlEncoderVariants,
  ...regexTesterVariants,
  ...diffCheckerVariants,
  ...passwordGeneratorVariants,
  ...sha256Variants,
  ...uuidGeneratorVariants,
  ...markdownPreviewVariants,
  ...cssMinifierVariants,
];
