export interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  lines: number;
  emptyLines: number;
  nonEmptyLines: number;
  paragraphs: number;
  sentences: number;
  spaces: number;
  tabs: number;
  bytes: number;
  tokens: number;
  readingTimeMin: number;
  speakingTimeMin: number;
  duplicateLines: number;
  longestLine: number;
  shortestLine: number;
  avgLineLength: number;
}

export function analyzeText(text: string): TextStats {
  if (!text) {
    return {
      characters: 0,
      charactersNoSpaces: 0,
      words: 0,
      lines: 0,
      emptyLines: 0,
      nonEmptyLines: 0,
      paragraphs: 0,
      sentences: 0,
      spaces: 0,
      tabs: 0,
      bytes: 0,
      tokens: 0,
      readingTimeMin: 0,
      speakingTimeMin: 0,
      duplicateLines: 0,
      longestLine: 0,
      shortestLine: 0,
      avgLineLength: 0,
    };
  }

  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, "").length;

  const wordList = text.trim().split(/\s+/).filter(Boolean);
  const words = wordList.length;

  const rawLines = text.split(/\r?\n/);
  const lines = rawLines.length;

  let emptyLines = 0;
  let nonEmptyLines = 0;
  let longestLine = 0;
  let shortestLine = Infinity;
  let totalLineLength = 0;
  const seenLines = new Set<string>();
  let duplicateCount = 0;

  rawLines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed === "") {
      emptyLines++;
    } else {
      nonEmptyLines++;
      const len = line.length;
      totalLineLength += len;
      if (len > longestLine) longestLine = len;
      if (len < shortestLine) shortestLine = len;
    }

    if (seenLines.has(line)) {
      duplicateCount++;
    } else {
      seenLines.add(line);
    }
  });

  if (shortestLine === Infinity) shortestLine = 0;
  const avgLineLength = nonEmptyLines > 0 ? Math.round((totalLineLength / nonEmptyLines) * 10) / 10 : 0;

  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;

  // Sentences count: splitting by standard sentence terminators (. ! ?)
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;

  // Spaces and tabs count
  const spaces = (text.match(/ /g) || []).length;
  const tabs = (text.match(/\t/g) || []).length;

  // Byte size estimation (UTF-8 encoding)
  let bytes = 0;
  try {
    bytes = new TextEncoder().encode(text).length;
  } catch (e) {
    bytes = text.length; // fallback
  }

  // Token estimate: 1 word = ~1.3 tokens or 4 chars = 1 token
  const tokens = Math.round(words * 1.3) || Math.round(chars / 4);

  // Reading time (200 words per minute), Speaking time (130 words per minute)
  const readingTimeMin = words / 200;
  const speakingTimeMin = words / 130;

  return {
    characters: chars,
    charactersNoSpaces: charsNoSpaces,
    words,
    lines,
    emptyLines,
    nonEmptyLines,
    paragraphs,
    sentences,
    spaces,
    tabs,
    bytes,
    tokens,
    readingTimeMin,
    speakingTimeMin,
    duplicateLines: duplicateCount,
    longestLine,
    shortestLine,
    avgLineLength,
  };
}

export interface SocialLimits {
  platform: string;
  limit: number;
  label: string;
}

export const SOCIAL_PLATFORMS: SocialLimits[] = [
  { platform: "X (Tweet)", limit: 280, label: "X / Twitter Post" },
  { platform: "X (Direct Message)", limit: 10000, label: "X DM" },
  { platform: "LinkedIn Post", limit: 3000, label: "LinkedIn Post" },
  { platform: "Instagram Caption", limit: 2200, label: "Instagram Caption" },
  { platform: "Facebook Post", limit: 63206, label: "Facebook Post" },
  { platform: "Pinterest Description", limit: 500, label: "Pinterest Pin" },
];
