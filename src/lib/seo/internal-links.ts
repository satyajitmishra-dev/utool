/**
 * Internal Linking Utility
 *
 * Auto-generates a set of related tool slugs for any given tool, based on:
 *   1. parentToolSlug siblings (other intent variants of the same base)
 *   2. Reverse conversion (png-to-pdf ↔ pdf-to-png)
 *   3. Category siblings (up to 3 tools from the same category)
 *   4. Predefined complementary pairs
 */

import { RegistryTool } from '@/types/tool-registry';

// ─── Pre-defined complementary tool pairs ─────────────────────────────────────
// Both directions are registered: if A→B exists, B→A is also added.
const COMPLEMENTARY_PAIRS: [string, string][] = [
  ['merge-pdf',         'split-pdf'],
  ['merge-pdf',         'compress-pdf'],
  ['compress-pdf',      'merge-pdf'],
  ['split-pdf',         'compress-pdf'],
  ['png-to-pdf',        'jpg-to-pdf'],
  ['png-to-pdf',        'webp-to-pdf'],
  ['png-to-pdf',        'image-compressor'],
  ['png-to-pdf',        'merge-pdf'],
  ['jpg-to-pdf',        'png-to-pdf'],
  ['jpg-to-pdf',        'image-compressor'],
  ['jpg-to-pdf',        'merge-pdf'],
  ['image-compressor',  'image-resizer'],
  ['image-compressor',  'png-to-jpg'],
  ['image-compressor',  'webp-converter'],
  ['image-resizer',     'image-compressor'],
  ['png-to-jpg',        'jpg-to-png'],
  ['png-to-jpg',        'webp-converter'],
  ['jpg-to-png',        'png-to-jpg'],
  ['json-formatter',    'json-validator'],
  ['json-formatter',    'yaml-to-json'],
  ['json-validator',    'json-formatter'],
  ['regex-tester',      'regex-generator'],
  ['diff-checker',      'json-compare'],
  ['password-generator','password-strength'],
  ['hash-sha256-generator','hash-md5-generator'],
  ['video-to-gif',      'gif-to-mp4'],
  ['video-trimmer',     'audio-trimmer'],
  ['audio-converter',   'audio-trimmer'],
  ['word-counter',      'text-case-converter'],
  ['text-case-converter','word-counter'],
  ['emi-calculator',    'amortization-schedule'],
  ['gst-calculator',    'percentage-calculator'],
];

// Build a lookup map: slug → Set<related slugs>
function buildComplementaryMap(): Map<string, Set<string>> {
  const map = new Map<string, Set<string>>();
  for (const [a, b] of COMPLEMENTARY_PAIRS) {
    if (!map.has(a)) map.set(a, new Set());
    if (!map.has(b)) map.set(b, new Set());
    map.get(a)!.add(b);
    map.get(b)!.add(a);
  }
  return map;
}

const COMPLEMENTARY_MAP = buildComplementaryMap();

// ─── Reverse conversion detector ──────────────────────────────────────────────
function getReverseSlug(slug: string): string | null {
  // Matches patterns like "png-to-pdf" → "pdf-to-png"
  const match = slug.match(/^(.+)-to-(.+?)(-\w+)?$/);
  if (!match) return null;
  const [, from, to, suffix] = match;
  const reverseBase = `${to}-to-${from}`;
  return suffix ? `${reverseBase}${suffix}` : reverseBase;
}

// ─── Main export ───────────────────────────────────────────────────────────────
/**
 * Compute related tool slugs for a given tool.
 * Uses the full registry to find siblings and reverse conversions.
 *
 * @param tool     The source tool
 * @param registry The complete TOOL_REGISTRY array
 * @param limit    Maximum number of related tools to return (default 6)
 */
export function computeRelatedTools(
  tool: RegistryTool,
  registry: RegistryTool[],
  limit = 6,
): string[] {
  const results = new Set<string>();

  // 1. Predefined complementary tools
  const complements = COMPLEMENTARY_MAP.get(tool.slug);
  if (complements) {
    for (const s of complements) results.add(s);
  }

  // 2. Intent-variant siblings (other variants of the same parent tool)
  if (tool.parentToolSlug) {
    // Add the parent itself
    results.add(tool.parentToolSlug);

    // Add up to 2 sibling variants
    let siblingCount = 0;
    for (const t of registry) {
      if (
        t.parentToolSlug === tool.parentToolSlug &&
        t.slug !== tool.slug &&
        t.intentVariant !== tool.intentVariant
      ) {
        results.add(t.slug);
        if (++siblingCount >= 2) break;
      }
    }
  }

  // 3. Reverse conversion (png-to-pdf → pdf-to-png)
  const reverseSlug = getReverseSlug(tool.slug);
  if (reverseSlug) {
    const reverseExists = registry.some(t => t.slug === reverseSlug);
    if (reverseExists) results.add(reverseSlug);
  }

  // 4. Category siblings (fallback to fill remaining slots)
  if (results.size < limit) {
    for (const t of registry) {
      if (
        t.category === tool.category &&
        t.slug !== tool.slug &&
        t.parentToolSlug !== tool.slug &&  // exclude children of this tool
        !results.has(t.slug) &&
        !t.parentToolSlug                  // prefer top-level tools as related
      ) {
        results.add(t.slug);
        if (results.size >= limit) break;
      }
    }
  }

  // Remove self
  results.delete(tool.slug);

  return Array.from(results).slice(0, limit);
}
