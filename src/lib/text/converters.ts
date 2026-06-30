// Binary to Text & Text to Binary
export interface BinaryOptions {
  mode: "utf8" | "ascii";
  separator: "space" | "none";
}

export function textToBinary(text: string, options: BinaryOptions): string {
  const { mode, separator } = options;
  if (!text) return "";

  if (mode === "ascii") {
    const chars = Array.from(text);
    const bits = chars.map((char) => {
      const code = char.charCodeAt(0);
      if (code > 255) {
        throw new Error(`Non-ASCII character found: '${char}'. Switch to UTF-8 mode.`);
      }
      return code.toString(2).padStart(8, "0");
    });
    return bits.join(separator === "space" ? " " : "");
  } else {
    // UTF-8 mode
    const encoder = new TextEncoder();
    const bytes = encoder.encode(text);
    const bits = Array.from(bytes).map((b) => b.toString(2).padStart(8, "0"));
    return bits.join(separator === "space" ? " " : "");
  }
}

export function binaryToText(binaryStr: string, options: BinaryOptions): string {
  const { mode, separator } = options;
  // Clean up binary string: remove spaces and newlines if separator is "none" or split if "space"
  let cleanBin = binaryStr.replace(/[^01]/g, "");
  if (!cleanBin) return "";

  const chunks: string[] = [];
  if (separator === "space") {
    // Split by spaces, filter out non-binary
    const rawChunks = binaryStr.trim().split(/\s+/);
    for (const chunk of rawChunks) {
      if (/^[01]+$/.test(chunk)) {
        // If chunk is longer than 8 bits, split it into 8-bit pieces
        for (let i = 0; i < chunk.length; i += 8) {
          chunks.push(chunk.substring(i, i + 8));
        }
      }
    }
  } else {
    // Separator is none: chunk into 8-bit blocks
    for (let i = 0; i < cleanBin.length; i += 8) {
      chunks.push(cleanBin.substring(i, i + 8));
    }
  }

  const bytes = chunks.map((chunk) => {
    // Pad to 8 bits if needed
    const padded = chunk.padEnd(8, "0");
    return parseInt(padded, 2);
  });

  if (mode === "ascii") {
    return String.fromCharCode(...bytes);
  } else {
    // UTF-8
    try {
      const decoder = new TextDecoder("utf-8", { fatal: true });
      return decoder.decode(new Uint8Array(bytes));
    } catch (e) {
      throw new Error("Failed to decode binary as UTF-8. The input may not be valid UTF-8 binary sequences.");
    }
  }
}

// Morse Code Dictionary
export const MORSE_DICT: Record<string, string> = {
  a: ".-", b: "-...", c: "-.-.", d: "-..", e: ".", f: "..-.", g: "--.", h: "....",
  i: "..", j: ".---", k: "-.-", l: ".-..", m: "--", n: "-.", o: "---", p: ".--.",
  q: "--.-", r: ".-.", s: "...", t: "-", u: "..-", v: "...-", w: ".--", x: "-..-",
  y: "-.--", z: "--..",
  "1": ".----", "2": "..---", "3": "...--", "4": "....-", "5": ".....",
  "6": "-....", "7": "--...", "8": "---..", "9": "----.", "0": "-----",
  ".": ".-.-.-", ",": "--..--", "?": "..--..", "'": ".----.", "!": "-.-.--",
  "/": "-..-.", "(": "-.--.", ")": "-.--.-", "&": ".-...", ":": "---...",
  ";": "-.-.-.", "=": "-...-", "+": ".-.-.", "-": "-....-", "_": "..--.-",
  '"': ".-..-.", "$": "...-..-", "@": ".--.-.",
  " ": "/" // Word separator
};

export const REVERSE_MORSE_DICT: Record<string, string> = Object.entries(MORSE_DICT).reduce(
  (acc, [char, code]) => {
    acc[code] = char;
    return acc;
  },
  {} as Record<string, string>
);

export interface MorseOptions {
  wpm: number; // Words per minute for audio playback speed
  frequency: number; // Playback pitch frequency in Hz
}

export function textToMorse(text: string): string {
  if (!text) return "";
  return Array.from(text.toLowerCase())
    .map((char) => {
      if (char === "\n") return "\n";
      return MORSE_DICT[char] || `[Unknown: ${char}]`;
    })
    .join(" ")
    .replace(/\s*\/s*/g, " / ") // clean word spacing
    .replace(/\s+/g, " ")
    .trim();
}

export function morseToText(morse: string): string {
  if (!morse) return "";
  // Morse words are separated by '/' or newlines
  const words = morse.trim().split(/\s*\/\s*|\n/);
  const decodedWords = words.map((word) => {
    const letters = word.trim().split(/\s+/);
    return letters
      .map((letter) => {
        if (letter === "") return "";
        return REVERSE_MORSE_DICT[letter] || `[?]`;
      })
      .join("");
  });
  
  // Re-assemble words with spaces
  return decodedWords.join(" ").toUpperCase();
}

// Client-side Morse audio sound generator using AudioContext
export class MorseAudioPlayer {
  private audioCtx: AudioContext | null = null;
  private currentOscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying = false;
  private timeouts: number[] = [];

  constructor() {}

  private initAudio() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  public play(morseStr: string, options: MorseOptions, onFinished?: () => void) {
    this.stop();
    this.initAudio();
    if (!this.audioCtx) return;

    this.isPlaying = true;
    const { wpm, frequency } = options;

    // Standard timing formula:
    // Dot length = 1.2 / WPM seconds (standard PARIS standard word calculation)
    const dotDuration = 1.2 / wpm; 
    const dashDuration = dotDuration * 3;
    const intraCharacterSpace = dotDuration;
    const interCharacterSpace = dotDuration * 3;
    const interWordSpace = dotDuration * 7;

    let timeOffset = this.audioCtx.currentTime;

    const morseSymbols = Array.from(morseStr);

    morseSymbols.forEach((symbol, index) => {
      if (!this.isPlaying) return;

      if (symbol === ".") {
        this.scheduleBeep(timeOffset, dotDuration, frequency);
        timeOffset += dotDuration + intraCharacterSpace;
      } else if (symbol === "-") {
        this.scheduleBeep(timeOffset, dashDuration, frequency);
        timeOffset += dashDuration + intraCharacterSpace;
      } else if (symbol === " ") {
        // Character boundary
        timeOffset += interCharacterSpace - intraCharacterSpace; // adjust for character spacer
      } else if (symbol === "/") {
        // Word boundary
        timeOffset += interWordSpace - interCharacterSpace;
      } else if (symbol === "\n") {
        timeOffset += interWordSpace;
      }
    });

    const totalDurationMs = (timeOffset - this.audioCtx.currentTime) * 1000;
    const timeoutId = window.setTimeout(() => {
      this.isPlaying = false;
      if (onFinished) onFinished();
    }, totalDurationMs + 100);
    this.timeouts.push(timeoutId);
  }

  private scheduleBeep(startTime: number, duration: number, frequency: number) {
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gainNode = this.audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(frequency, startTime);

    gainNode.gain.setValueAtTime(0, startTime);
    // Smooth transitions to prevent clicking sounds
    gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.005);
    gainNode.gain.setValueAtTime(0.3, startTime + duration - 0.005);
    gainNode.gain.linearRampToValueAtTime(0, startTime + duration);

    osc.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  public stop() {
    this.isPlaying = false;
    this.timeouts.forEach((t) => clearTimeout(t));
    this.timeouts = [];
  }
}
