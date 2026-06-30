// Find and Replace Core Helpers
export interface SearchOptions {
  findText: string;
  replaceText: string;
  caseSensitive: boolean;
  wholeWord: boolean;
  useRegex: boolean;
}

export interface MatchRange {
  start: number;
  end: number;
  text: string;
}

export function findMatches(text: string, options: SearchOptions): MatchRange[] {
  const { findText, caseSensitive, wholeWord, useRegex } = options;
  if (!text || !findText) return [];

  const ranges: MatchRange[] = [];
  let regex: RegExp;

  try {
    if (useRegex) {
      const flags = caseSensitive ? "g" : "gi";
      regex = new RegExp(findText, flags);
    } else {
      // Escape special regex characters
      let escaped = findText.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
      if (wholeWord) {
        escaped = `\\b${escaped}\\b`;
      }
      const flags = caseSensitive ? "g" : "gi";
      regex = new RegExp(escaped, flags);
    }

    let match;
    while ((match = regex.exec(text)) !== null) {
      if (match.index === regex.lastIndex && match[0].length === 0) {
        // Prevent infinite loops on zero-length matches (e.g. ^ or $)
        regex.lastIndex++;
        continue;
      }
      ranges.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[0],
      });
      if (!regex.global) break; // Safeguard if not global
    }
  } catch (e) {
    // Regex compile error
    console.error("Regex parsing error: ", e);
  }

  return ranges;
}

export function replaceAll(text: string, options: SearchOptions): { result: string; replacementsCount: number } {
  const { findText, replaceText, caseSensitive, wholeWord, useRegex } = options;
  if (!text || !findText) return { result: text, replacementsCount: 0 };

  let regex: RegExp;
  try {
    if (useRegex) {
      const flags = caseSensitive ? "g" : "gi";
      regex = new RegExp(findText, flags);
    } else {
      let escaped = findText.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
      if (wholeWord) {
        escaped = `\\b${escaped}\\b`;
      }
      const flags = caseSensitive ? "g" : "gi";
      regex = new RegExp(escaped, flags);
    }

    const matches = text.match(regex);
    const count = matches ? matches.length : 0;
    
    // Replace with support for special replacement tokens if using raw regex
    const result = text.replace(regex, replaceText);

    return {
      result,
      replacementsCount: count,
    };
  } catch (e) {
    return { result: text, replacementsCount: 0 };
  }
}
