// Sorters and Duplicates Removal
export interface SorterOptions {
  mode: "alpha" | "numeric" | "length" | "shuffle";
  direction: "asc" | "desc";
  ignoreCase: boolean;
  removeDuplicates: boolean;
  trimWhitespace: boolean;
}

export function sortTextLines(text: string, options: SorterOptions): { result: string; duplicateCount: number } {
  if (!text) return { result: "", duplicateCount: 0 };

  let lines = text.split(/\r?\n/);
  let duplicateCount = 0;

  // 1. Trim whitespace if requested
  if (options.trimWhitespace) {
    lines = lines.map((line) => line.trim());
  }

  // 2. Remove duplicates if requested
  if (options.removeDuplicates) {
    const seen = new Set<string>();
    const uniqueLines: string[] = [];
    lines.forEach((line) => {
      const matchKey = options.ignoreCase ? line.toLowerCase() : line;
      if (seen.has(matchKey)) {
        duplicateCount++;
      } else {
        seen.add(matchKey);
        uniqueLines.push(line);
      }
    });
    lines = uniqueLines;
  }

  // 3. Perform sorting
  if (options.mode === "shuffle") {
    // Fisher-Yates shuffle
    for (let i = lines.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = lines[i];
      lines[i] = lines[j];
      lines[j] = temp;
    }
  } else {
    lines.sort((a, b) => {
      let valA = a;
      let valB = b;

      if (options.mode === "numeric") {
        // Extract first number or fallback to 0
        const numA = parseFloat(a.match(/-?\d+(\.\d+)?/)?.[0] || "0");
        const numB = parseFloat(b.match(/-?\d+(\.\d+)?/)?.[0] || "0");
        return options.direction === "asc" ? numA - numB : numB - numA;
      }

      if (options.mode === "length") {
        return options.direction === "asc" ? a.length - b.length : b.length - a.length;
      }

      // Default alphabetical
      if (options.ignoreCase) {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return options.direction === "asc" ? -1 : 1;
      if (valA > valB) return options.direction === "asc" ? 1 : -1;
      return 0;
    });
  }

  return {
    result: lines.join("\n"),
    duplicateCount,
  };
}

// Remove Duplicate Lines Specific Utility
export interface DuplicatesOptions {
  ignoreCase: boolean;
  trimWhitespace: boolean;
  preserveOrder: boolean;
  sortBeforeRemoval: boolean;
}

export function removeDuplicateLines(text: string, options: DuplicatesOptions): { result: string; removedCount: number } {
  if (!text) return { result: "", removedCount: 0 };

  let lines = text.split(/\r?\n/);
  let removedCount = 0;

  if (options.trimWhitespace) {
    lines = lines.map((line) => line.trim());
  }

  if (options.sortBeforeRemoval) {
    lines.sort((a, b) => {
      const valA = options.ignoreCase ? a.toLowerCase() : a;
      const valB = options.ignoreCase ? b.toLowerCase() : b;
      return valA.localeCompare(valB);
    });
  }

  const seen = new Set<string>();
  const uniqueLines: string[] = [];

  lines.forEach((line) => {
    const key = options.ignoreCase ? line.toLowerCase() : line;
    if (seen.has(key)) {
      removedCount++;
    } else {
      seen.add(key);
      uniqueLines.push(line);
    }
  });

  return {
    result: uniqueLines.join("\n"),
    removedCount,
  };
}
