// HTML Tags Stripper
export interface HtmlStripperOptions {
  preserveLineBreaks: boolean;
  decodeEntities: boolean;
  removeScriptsStyles: boolean;
  removeComments: boolean;
}

export function stripHtml(htmlText: string, options: HtmlStripperOptions): string {
  if (!htmlText) return "";

  let result = htmlText;

  // 1. Remove comments
  if (options.removeComments) {
    result = result.replace(/<!--[\s\S]*?-->/g, "");
  }

  // 2. Remove scripts and styles
  if (options.removeScriptsStyles) {
    result = result.replace(/<(script|style|iframe|noscript)[\s\S]*?>[\s\S]*?<\/\1>/gi, "");
  }

  // 3. Preserve line breaks (convert block tags to newlines before stripping)
  if (options.preserveLineBreaks) {
    // Replace divs, paragraphs, list items, headings, breaks with line breaks
    result = result
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n\n")
      .replace(/<\/div>/gi, "\n")
      .replace(/<\/li>/gi, "\n")
      .replace(/<\/h[1-6]>/gi, "\n");
  }

  // 4. Strip remaining HTML tags
  result = result.replace(/<[^>]*>/g, "");

  // 5. Decode HTML entities
  if (options.decodeEntities) {
    const entities: Record<string, string> = {
      "&nbsp;": " ",
      "&amp;": "&",
      "&lt;": "<",
      "&gt;": ">",
      "&quot;": '"',
      "&apos;": "'",
      "&cent;": "¢",
      "&pound;": "£",
      "&yen;": "¥",
      "&euro;": "€",
      "&copy;": "©",
      "&reg;": "®",
    };
    // Decode named entities
    result = result.replace(/&[a-z0-9#]+;/gi, (match) => {
      if (entities[match.toLowerCase()]) {
        return entities[match.toLowerCase()];
      }
      // Check for numeric decimal entities &#000;
      if (match.startsWith("&#")) {
        try {
          const code = match.slice(2, -1);
          if (code.startsWith("x") || code.startsWith("X")) {
            return String.fromCharCode(parseInt(code.slice(1), 16));
          } else {
            return String.fromCharCode(parseInt(code, 10));
          }
        } catch (e) {
          return match;
        }
      }
      return match;
    });
  }

  // Clean up excessive whitespace/newlines if preserve line breaks is enabled
  if (options.preserveLineBreaks) {
    result = result
      .split(/\r?\n/)
      .map((line) => line.trimEnd())
      .join("\n")
      .replace(/\n{3,}/g, "\n\n"); // Collapse consecutive empty lines
  } else {
    // Flatten to a single line and clean up spacing
    result = result.replace(/\s+/g, " ").trim();
  }

  return result.trim();
}

// Text Reverser
export interface ReverserOptions {
  mode: "chars" | "words" | "lines" | "sentences";
  preserveSpacing: boolean;
  preservePunctuation: boolean;
}

export function reverseText(text: string, options: ReverserOptions): string {
  if (!text) return "";
  const { mode, preserveSpacing, preservePunctuation } = options;

  switch (mode) {
    case "chars":
      if (preservePunctuation) {
        return reverseCharsPreservePunctuation(text);
      }
      return Array.from(text).reverse().join("");

    case "words":
      return text
        .split(/\r?\n/)
        .map((line) => {
          // split by spaces, reverse, rejoin
          const words = line.split(/(\s+)/); // Keep separator spaces
          if (preserveSpacing) {
            // Reverse only the words, leaving spacers in place
            const wordTokens = words.filter((w) => w.trim().length > 0);
            const spaces = words.filter((w) => w.trim().length === 0);
            wordTokens.reverse();
            let result = "";
            let wIdx = 0;
            let sIdx = 0;
            words.forEach((token) => {
              if (token.trim().length > 0) {
                result += wordTokens[wIdx++] || "";
              } else {
                result += spaces[sIdx++] || "";
              }
            });
            return result;
          } else {
            // Simple word reverse
            const pureWords = line.split(/\s+/).filter(Boolean);
            return pureWords.reverse().join(" ");
          }
        })
        .join("\n");

    case "sentences":
      // Split by sentence terminators but keep them
      const sentenceTokens = text.split(/([.!?]+\s*)/);
      const pureSentences: string[] = [];
      const terminators: string[] = [];
      
      for (let i = 0; i < sentenceTokens.length; i++) {
        const token = sentenceTokens[i];
        if (!token) continue;
        if (/[.!?]/.test(token)) {
          terminators.push(token);
        } else {
          pureSentences.push(token);
        }
      }

      pureSentences.reverse();
      
      let res = "";
      for (let i = 0; i < Math.max(pureSentences.length, terminators.length); i++) {
        res += (pureSentences[i] || "") + (terminators[i] || "");
      }
      return res;

    case "lines":
      return text.split(/\r?\n/).reverse().join("\n");

    default:
      return text;
  }
}

// Complex helper: reverse letters in words but keep punctuation marks in their original relative position
function reverseCharsPreservePunctuation(str: string): string {
  const chars = Array.from(str);
  let left = 0;
  let right = chars.length - 1;

  const isAlphaNumeric = (char: string) => {
    return /\p{L}|\p{N}/u.test(char);
  };

  while (left < right) {
    if (!isAlphaNumeric(chars[left])) {
      left++;
    } else if (!isAlphaNumeric(chars[right])) {
      right--;
    } else {
      const temp = chars[left];
      chars[left] = chars[right];
      chars[right] = temp;
      left++;
      right--;
    }
  }

  return chars.join("");
}
