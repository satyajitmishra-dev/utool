export interface WorkerInput {
  text: string;
  type: string;
  options: any;
}

export interface WorkerResult {
  result: string;
  stats: any;
  error?: string;
}

// Inline Web Worker source code as a string to avoid Next.js loader issues.
const WORKER_CODE = `
  // In-worker implementations of the processing functions to run in background thread.
  
  function analyzeText(text) {
    if (!text) return null;
    const chars = text.length;
    const charsNoSpaces = text.replace(/\\s/g, "").length;
    const words = text.trim().split(/\\s+/).filter(Boolean).length;
    const rawLines = text.split(/\\r?\\n/);
    const lines = rawLines.length;

    let emptyLines = 0;
    let nonEmptyLines = 0;
    let longestLine = 0;
    let shortestLine = Infinity;
    let totalLineLength = 0;
    const seenLines = new Set();
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
    const paragraphs = text.split(/\\n\\s*\\n/).filter(p => p.trim().length > 0).length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const spaces = (text.match(/ /g) || []).length;
    const tabs = (text.match(/\\t/g) || []).length;
    
    let bytes = text.length;
    try {
      bytes = new TextEncoder().encode(text).length;
    } catch (e) {}

    const tokens = Math.round(words * 1.3) || Math.round(chars / 4);

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
      readingTimeMin: words / 200,
      speakingTimeMin: words / 130,
      duplicateLines: duplicateCount,
      longestLine,
      shortestLine,
      avgLineLength
    };
  }

  // Binary Converter
  function runBinaryConverter(text, options, onProgress) {
    const { mode, separator } = options;
    const toBinary = options.toBinary; // direction flag
    
    if (toBinary) {
      // Text -> Binary
      if (mode === "ascii") {
        const chars = Array.from(text);
        const total = chars.length;
        const bits = [];
        const chunkSize = 5000;
        
        for (let i = 0; i < total; i += chunkSize) {
          const chunk = chars.slice(i, i + chunkSize);
          chunk.forEach(char => {
            const code = char.charCodeAt(0);
            if (code > 255) {
              throw new Error("Non-ASCII character found. Switch to UTF-8 mode.");
            }
            bits.push(code.toString(2).padStart(8, "0"));
          });
          onProgress(Math.min(100, Math.round((i / total) * 100)));
        }
        return bits.join(separator === "space" ? " " : "");
      } else {
        const encoder = new TextEncoder();
        const bytes = encoder.encode(text);
        const total = bytes.length;
        const bits = [];
        const chunkSize = 10000;
        
        for (let i = 0; i < total; i += chunkSize) {
          const chunk = bytes.slice(i, i + chunkSize);
          chunk.forEach(b => {
            bits.push(b.toString(2).padStart(8, "0"));
          });
          onProgress(Math.min(100, Math.round((i / total) * 100)));
        }
        return bits.join(separator === "space" ? " " : "");
      }
    } else {
      // Binary -> Text
      let cleanBin = text.replace(/[^01]/g, "");
      if (!cleanBin) return "";
      
      const chunks = [];
      if (separator === "space") {
        const rawChunks = text.trim().split(/\\s+/);
        rawChunks.forEach(chunk => {
          if (/^[01]+$/.test(chunk)) {
            for (let i = 0; i < chunk.length; i += 8) {
              chunks.push(chunk.substring(i, i + 8));
            }
          }
        });
      } else {
        for (let i = 0; i < cleanBin.length; i += 8) {
          chunks.push(cleanBin.substring(i, i + 8));
        }
      }
      
      const total = chunks.length;
      const bytes = [];
      const chunkSize = 5000;
      
      for (let i = 0; i < total; i += chunkSize) {
        const chunk = chunks.slice(i, i + chunkSize);
        chunk.forEach(c => {
          bytes.push(parseInt(c.padEnd(8, "0"), 2));
        });
        onProgress(Math.min(50, Math.round((i / total) * 50)));
      }
      
      if (mode === "ascii") {
        let resStr = "";
        for (let i = 0; i < bytes.length; i += chunkSize) {
          const slice = bytes.slice(i, i + chunkSize);
          resStr += String.fromCharCode(...slice);
          onProgress(50 + Math.min(50, Math.round((i / bytes.length) * 50)));
        }
        return resStr;
      } else {
        try {
          const decoder = new TextDecoder("utf-8", { fatal: true });
          const resArray = new Uint8Array(bytes);
          onProgress(90);
          return decoder.decode(resArray);
        } catch (e) {
          throw new Error("Failed to decode binary as UTF-8. The input may not be valid UTF-8.");
        }
      }
    }
  }

  // Morse Code dictionaries
  const MORSE_DICT = {
    a: ".-", b: "-...", c: "-.-.", d: "-..", e: ".", f: "..-.", g: "--.", h: "....",
    i: "..", j: ".---", k: "-.-", l: ".-..", m: "--", n: "-.", o: "---", p: ".--.",
    q: "--.-", r: ".-.", s: "...", t: "-", u: "..-", v: "...-", w: ".--", x: "-..-",
    y: "-.--", z: "--..",
    "1": ".----", "2": "..---", "3": "...--", "4": "....-", "5": ".....",
    "6": "-....", "7": "--...", "8": "---..", "9": "----.", "0": "-----",
    ".": ".-.-.-", ",": "--..--", "?": "..--..", "'": ".----.", "!": "-.-.--",
    "/": "-..-.", "(": "-.--.", ")": "-.--.-", "&": ".-...", ":": "---...",
    ";": "-.-.-.", "=": "-...-", "+": ".-.-.", "-": "-....-", "_": "..--.-",
    '"': ".-..-.", "$": "...-..-", "@": ".--.-.", " ": "/"
  };
  
  const REVERSE_MORSE_DICT = {};
  Object.keys(MORSE_DICT).forEach(k => {
    REVERSE_MORSE_DICT[MORSE_DICT[k]] = k;
  });

  function runMorseEncoder(text, onProgress) {
    if (!text) return "";
    const chars = Array.from(text.toLowerCase());
    const total = chars.length;
    const morseParts = [];
    const chunkSize = 2000;
    
    for (let i = 0; i < total; i += chunkSize) {
      const slice = chars.slice(i, i + chunkSize);
      slice.forEach(char => {
        if (char === "\\n") morseParts.push("\\n");
        else morseParts.push(MORSE_DICT[char] || ("[Unknown: " + char + "]"));
      });
      onProgress(Math.min(100, Math.round((i / total) * 100)));
    }
    
    return morseParts.join(" ").replace(/\\s*\\/\\s*/g, " / ").replace(/\\s+/g, " ").trim();
  }

  function runMorseDecoder(text, onProgress) {
    if (!text) return "";
    const words = text.trim().split(/\\s*\\/\\s*|\\n/);
    const total = words.length;
    const decodedWords = [];
    const chunkSize = 500;
    
    for (let i = 0; i < total; i += chunkSize) {
      const slice = words.slice(i, i + chunkSize);
      slice.forEach(word => {
        const letters = word.trim().split(/\\s+/);
        const wStr = letters.map(letter => letter ? (REVERSE_MORSE_DICT[letter] || "[?]") : "").join("");
        decodedWords.push(wStr);
      });
      onProgress(Math.min(100, Math.round((i / total) * 100)));
    }
    return decodedWords.join(" ").toUpperCase();
  }

  // HTML tag stripper
  function runHtmlStripper(text, options, onProgress) {
    if (!text) return "";
    let res = text;
    onProgress(10);
    if (options.removeComments) {
      res = res.replace(/<!--[\\s\\S]*?-->/g, "");
    }
    onProgress(30);
    if (options.removeScriptsStyles) {
      res = res.replace(/<(script|style|iframe|noscript)[\\s\\S]*?>[\\s\\S]*?<\\/\\1>/gi, "");
    }
    onProgress(50);
    if (options.preserveLineBreaks) {
      res = res
        .replace(/<br\\s*\\/?>/gi, "\\n")
        .replace(/<\\/p>/gi, "\\n\\n")
        .replace(/<\\/div>/gi, "\\n")
        .replace(/<\\/li>/gi, "\\n")
        .replace(/<\\/h[1-6]>/gi, "\\n");
    }
    onProgress(75);
    res = res.replace(/<[^>]*>/g, "");
    
    if (options.decodeEntities) {
      const entities = {
        "&nbsp;": " ", "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&apos;": "'"
      };
      res = res.replace(/&[a-z0-9#]+;/gi, (match) => {
        const lower = match.toLowerCase();
        if (entities[lower]) return entities[lower];
        if (match.startsWith("&#")) {
          try {
            const code = match.slice(2, -1);
            if (code.startsWith("x") || code.startsWith("X")) {
              return String.fromCharCode(parseInt(code.slice(1), 16));
            } else {
              return String.fromCharCode(parseInt(code, 10));
            }
          } catch (e) {}
        }
        return match;
      });
    }
    onProgress(90);
    if (options.preserveLineBreaks) {
      res = res.split(/\\r?\\n/).map(line => line.trimEnd()).join("\\n").replace(/\\n{3,}/g, "\\n\\n");
    } else {
      res = res.replace(/\\s+/g, " ").trim();
    }
    onProgress(100);
    return res.trim();
  }

  // Text reverser
  function runTextReverser(text, options, onProgress) {
    if (!text) return "";
    const { mode, preserveSpacing, preservePunctuation } = options;
    onProgress(20);
    if (mode === "lines") {
      return text.split(/\\r?\\n/).reverse().join("\\n");
    }
    if (mode === "sentences") {
      const tokens = text.split(/([.!?]+\\s*)/);
      const pure = [];
      const terms = [];
      tokens.forEach(tok => {
        if (!tok) return;
        if (/[.!?]/.test(tok)) terms.push(tok);
        else pure.push(tok);
      });
      pure.reverse();
      let res = "";
      for (let i = 0; i < Math.max(pure.length, terms.length); i++) {
        res += (pure[i] || "") + (terms[i] || "");
      }
      onProgress(100);
      return res;
    }
    if (mode === "words") {
      const lines = text.split(/\\r?\\n/);
      const total = lines.length;
      const reversedLines = lines.map((line, idx) => {
        if (idx % 1000 === 0) onProgress(Math.min(100, Math.round((idx / total) * 100)));
        const words = line.split(/(\\s+)/);
        if (preserveSpacing) {
          const pureWords = words.filter(w => w.trim().length > 0);
          const spaces = words.filter(w => w.trim().length === 0);
          pureWords.reverse();
          let r = "";
          let wIdx = 0, sIdx = 0;
          words.forEach(t => {
            if (t.trim().length > 0) r += pureWords[wIdx++] || "";
            else r += spaces[sIdx++] || "";
          });
          return r;
        } else {
          return words.filter(w => w.trim().length > 0).reverse().join(" ");
        }
      });
      return reversedLines.join("\\n");
    }
    if (mode === "chars") {
      if (preservePunctuation) {
        const chars = Array.from(text);
        let l = 0, r = chars.length - 1;
        const isAlpha = c => /\\p{L}|\\p{N}/u.test(c);
        while (l < r) {
          if (!isAlpha(chars[l])) l++;
          else if (!isAlpha(chars[r])) r--;
          else {
            const tmp = chars[l];
            chars[l] = chars[r];
            chars[r] = tmp;
            l++; r--;
          }
        }
        onProgress(100);
        return chars.join("");
      }
      onProgress(100);
      return Array.from(text).reverse().join("");
    }
    return text;
  }

  // Text sorter
  function runTextSorter(text, options, onProgress) {
    if (!text) return "";
    let lines = text.split(/\\r?\\n/);
    let duplicateCount = 0;
    onProgress(15);
    
    if (options.trimWhitespace) {
      lines = lines.map(l => l.trim());
    }
    onProgress(30);

    if (options.removeDuplicates) {
      const seen = new Set();
      const unique = [];
      lines.forEach(l => {
        const key = options.ignoreCase ? l.toLowerCase() : l;
        if (seen.has(key)) duplicateCount++;
        else {
          seen.add(key);
          unique.push(l);
        }
      });
      lines = unique;
    }
    onProgress(50);

    if (options.mode === "shuffle") {
      for (let i = lines.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = lines[i];
        lines[i] = lines[j];
        lines[j] = tmp;
      }
    } else {
      lines.sort((a, b) => {
        if (options.mode === "numeric") {
          const numA = parseFloat(a.match(/-?\\d+(\\.\\d+)?/)?.[0] || "0");
          const numB = parseFloat(b.match(/-?\\d+(\\.\\d+)?/)?.[0] || "0");
          return options.direction === "asc" ? numA - numB : numB - numA;
        }
        if (options.mode === "length") {
          return options.direction === "asc" ? a.length - b.length : b.length - a.length;
        }
        const valA = options.ignoreCase ? a.toLowerCase() : a;
        const valB = options.ignoreCase ? b.toLowerCase() : b;
        if (valA < valB) return options.direction === "asc" ? -1 : 1;
        if (valA > valB) return options.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    onProgress(100);
    return {
      result: lines.join("\\n"),
      duplicateCount
    };
  }

  // Remove duplicate lines
  function runRemoveDuplicates(text, options, onProgress) {
    if (!text) return { result: "", removedCount: 0 };
    let lines = text.split(/\\r?\\n/);
    let removedCount = 0;
    onProgress(20);

    if (options.trimWhitespace) {
      lines = lines.map(l => l.trim());
    }
    onProgress(40);

    if (options.sortBeforeRemoval) {
      lines.sort((a, b) => {
        const valA = options.ignoreCase ? a.toLowerCase() : a;
        const valB = options.ignoreCase ? b.toLowerCase() : b;
        return valA.localeCompare(valB);
      });
    }
    onProgress(60);

    const seen = new Set();
    const unique = [];
    lines.forEach(l => {
      const key = options.ignoreCase ? l.toLowerCase() : l;
      if (seen.has(key)) removedCount++;
      else {
        seen.add(key);
        unique.push(l);
      }
    });
    onProgress(100);
    return {
      result: unique.join("\\n"),
      removedCount
    };
  }

  // Find & Replace
  function runFindAndReplace(text, options, onProgress) {
    const { findText, replaceText, caseSensitive, wholeWord, useRegex } = options;
    if (!text || !findText) return { result: text, replacementsCount: 0 };
    onProgress(30);

    let regex;
    try {
      if (useRegex) {
        const flags = caseSensitive ? "g" : "gi";
        regex = new RegExp(findText, flags);
      } else {
        let escaped = findText.replace(/[-\\/\\\\^$*+?.()|[\\]{}]/g, "\\\\$&");
        if (wholeWord) {
          escaped = "\\\\b" + escaped + "\\\\b";
        }
        const flags = caseSensitive ? "g" : "gi";
        regex = new RegExp(escaped, flags);
      }

      onProgress(60);
      const matches = text.match(regex);
      const count = matches ? matches.length : 0;
      const result = text.replace(regex, replaceText);
      onProgress(100);
      return { result, replacementsCount: count };
    } catch (e) {
      throw new Error("Find & Replace regular expression parse error: " + e.message);
    }
  }

  // Listener in Worker
  self.onmessage = function (e) {
    const { text, type, options } = e.data;
    
    function sendProgress(pct) {
      self.postMessage({ type: "progress", progress: pct });
    }

    try {
      let result = "";
      let customStats = {};

      if (type === "binary-to-text") {
        result = runBinaryConverter(text, options, sendProgress);
      } else if (type === "morse-code-encoder") {
        result = runMorseEncoder(text, sendProgress);
      } else if (type === "morse-code-decoder") {
        result = runMorseDecoder(text, sendProgress);
      } else if (type === "strip-html-tags") {
        result = runHtmlStripper(text, options, sendProgress);
      } else if (type === "text-reverser") {
        result = runTextReverser(text, options, sendProgress);
      } else if (type === "text-sorter") {
        const sortRes = runTextSorter(text, options, sendProgress);
        result = sortRes.result;
        customStats.modificationsCount = sortRes.duplicateCount;
      } else if (type === "remove-duplicate-lines") {
        const dupRes = runRemoveDuplicates(text, options, sendProgress);
        result = dupRes.result;
        customStats.modificationsCount = dupRes.removedCount;
      } else if (type === "find-and-replace") {
        const repRes = runFindAndReplace(text, options, sendProgress);
        result = repRes.result;
        customStats.modificationsCount = repRes.replacementsCount;
      } else if (type === "character-counter" || type === "line-counter") {
        // Just return same text, statistics is updated
        result = text;
        sendProgress(100);
      } else {
        // Fallback simple copy
        result = text;
        sendProgress(100);
      }

      // Analyze statistics on the output text
      const outputStats = analyzeText(result || "");
      const inputStats = analyzeText(text || "");

      self.postMessage({
        type: "success",
        result,
        stats: {
          inputStats,
          outputStats,
          ...customStats
        }
      });
    } catch (err) {
      self.postMessage({ type: "error", error: err.message });
    }
  };
`;

export class TextWorkerController {
  private worker: Worker | null = null;
  private taskResolver: ((value: WorkerResult) => void) | null = null;
  private onProgressCallback: ((pct: number) => void) | null = null;

  constructor() {}

  public runTask(
    text: string,
    type: string,
    options: any,
    onProgress: (pct: number) => void
  ): Promise<WorkerResult> {
    this.cancel(); // Terminate existing task if running

    return new Promise<WorkerResult>((resolve) => {
      this.taskResolver = resolve;
      this.onProgressCallback = onProgress;

      try {
        const blob = new Blob([WORKER_CODE], { type: "application/javascript" });
        const workerUrl = URL.createObjectURL(blob);
        this.worker = new Worker(workerUrl);

        this.worker.onmessage = (e) => {
          const msg = e.data;
          if (msg.type === "progress" && this.onProgressCallback) {
            this.onProgressCallback(msg.progress);
          } else if (msg.type === "success") {
            if (this.taskResolver) {
              this.taskResolver({ result: msg.result, stats: msg.stats });
            }
            this.terminate();
          } else if (msg.type === "error") {
            if (this.taskResolver) {
              this.taskResolver({ result: "", stats: null, error: msg.error });
            }
            this.terminate();
          }
        };

        this.worker.onerror = (err) => {
          if (this.taskResolver) {
            this.taskResolver({ result: "", stats: null, error: err.message });
          }
          this.terminate();
        };

        // Post work parameters to worker
        this.worker.postMessage({ text, type, options });
      } catch (err: any) {
        // Fallback if workers fail in browser environment
        resolve({ result: "", stats: null, error: err.message || "Failed to initialize worker thread." });
      }
    });
  }

  public cancel() {
    if (this.worker) {
      if (this.taskResolver) {
        this.taskResolver({ result: "", stats: null, error: "Processing was cancelled by user." });
      }
      this.terminate();
    }
  }

  private terminate() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.taskResolver = null;
    this.onProgressCallback = null;
  }
}
