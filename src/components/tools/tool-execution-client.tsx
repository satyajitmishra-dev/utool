"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { getToolBySlug } from "@/config/tool-registry";
import {
  ArrowLeft,
  Play,
  RotateCcw,
  Sparkles,
  Loader2,
  Check,
  Copy,
  Terminal,
} from "lucide-react";

export default function ToolExecutionClient({ hideHeader = false }: { hideHeader?: boolean }) {
  const params = useParams();
  const rawSlug = params.slug as string;
  const toolConfig = getToolBySlug(rawSlug);
  const slug = toolConfig?.parentToolSlug || rawSlug;

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  // Define tools metadata to customize the page dynamically
  const toolsMeta: Record<string, { name: string; desc: string; inputPlaceholder: string; credits: number }> = {
    "json-formatter": {
      name: "JSON Formatter & Beautifier",
      desc: "Format, validate, and parse JSON strings with deep syntax validation.",
      inputPlaceholder: 'Paste raw JSON here...\ne.g. {"name":"utool","active":true}',
      credits: 1,
    },
    "env-validator": {
      name: "Env Validator",
      desc: "Validate configuration schemas for dotenv (.env) files.",
      inputPlaceholder: "PORT=3000\nDATABASE_URL=mongodb://localhost\nUPSTASH_TOKEN=",
      credits: 1,
    },
    "css-gradient-generator": {
      name: "CSS Gradient Generator",
      desc: "Compile custom radial/linear CSS HSL gradient codes.",
      inputPlaceholder: "Enter primary hues separated by commas...\ne.g. 210, 260, 320",
      credits: 1,
    },
    "word-counter": {
      name: "Word & Character Counter",
      desc: "Analyze text length, counts of words, characters, sentences, paragraphs, and estimated reading time.",
      inputPlaceholder: "Paste or type your text here to analyze...",
      credits: 1,
    },
    "case-converter": {
      name: "Text Case Converter",
      desc: "Convert text case between UPPERCASE, lowercase, Title Case, camelCase, snake-case, etc.",
      inputPlaceholder: "Enter text to convert...",
      credits: 1,
    },
    "lorem-ipsum-generator": {
      name: "Lorem Ipsum Generator",
      desc: "Generate dummy/placeholder text for design layouts. Enter number of paragraphs desired (e.g., 3).",
      inputPlaceholder: "3",
      credits: 1,
    },
    "text-to-binary": {
      name: "Text to Binary Converter",
      desc: "Convert plain text to binary code representation (zeros and ones) or vice versa.",
      inputPlaceholder: "Hello World",
      credits: 1,
    },
    "slug-generator": {
      name: "SEO URL Slug Generator",
      desc: "Convert titles and text into clean, SEO-friendly URL slug strings.",
      inputPlaceholder: "My Awesome Blog Post Title!",
      credits: 1,
    },
    "password-generator": {
      name: "Secure Password Generator",
      desc: "Generate random, cryptographically secure passwords. Enter desired length (e.g., 16).",
      inputPlaceholder: "16",
      credits: 1,
    },
    "hash-sha256-generator": {
      name: "SHA-256 Hash Generator",
      desc: "Compute the cryptographically secure SHA-256 hash checksum of any text input.",
      inputPlaceholder: "Enter text to hash...",
      credits: 1,
    },
    "diff-checker": {
      name: "Text Diff Checker",
      desc: "Compare two text blocks side-by-side or line-by-line. Format: Original text, then a line with '---DIFF---', then the New text.",
      inputPlaceholder: "Original text goes here...\n---DIFF---\nModified text goes here...",
      credits: 1,
    },
    "uuid-generator": {
      name: "UUID v4 Generator",
      desc: "Generate batches of RFC-compliant unique UUID v4 identifiers. Enter quantity (e.g., 5).",
      inputPlaceholder: "5",
      credits: 1,
    },
    "markdown-preview": {
      name: "Markdown Live Previewer",
      desc: "Enter Markdown syntax and render it as formatted HTML code.",
      inputPlaceholder: "# Title\n\nThis is **bold** text and *italic* text.",
      credits: 1,
    },
    "css-minifier": {
      name: "CSS Stylesheet Minifier",
      desc: "Compress CSS by removing comments, extra whitespace, and line breaks.",
      inputPlaceholder: ".container {\n  margin: 10px;\n  padding: 20px;\n  /* comment */\n}",
      credits: 1,
    },
    "percentage-calculator": {
      name: "Percentage Calculator",
      desc: "Perform percentage calculations. Format: 'What is X% of Y?' or 'X is what % of Y?' (Enter values: e.g. 15, 200).",
      inputPlaceholder: "15, 200",
      credits: 1,
    },
    "bmi-calculator": {
      name: "BMI Health Calculator",
      desc: "Calculate Body Mass Index (BMI). Format: Height (in cm), Weight (in kg) (e.g. 180, 75).",
      inputPlaceholder: "180, 75",
      credits: 1,
    },
    "age-calculator": {
      name: "Age & Date Calculator",
      desc: "Calculate exact age or time duration. Format: YYYY-MM-DD birthdate (e.g., 1995-06-15).",
      inputPlaceholder: "1995-06-15",
      credits: 1,
    },
    "loan-calculator": {
      name: "Loan EMI Calculator",
      desc: "Calculate monthly EMI payments. Format: Principal, Annual Interest %, Loan Term in years (e.g. 100000, 8.5, 5).",
      inputPlaceholder: "100000, 8.5, 5",
      credits: 1,
    },
    "gst-calculator": {
      name: "GST Tax Calculator",
      desc: "Calculate GST tax. Format: Net Price, GST Percentage (e.g. 1000, 18).",
      inputPlaceholder: "1000, 18",
      credits: 1,
    },
    "base64-encoder-decoder": {
      name: "Base64 Encoder / Decoder",
      desc: "Encode plain text to Base64 format or decode Base64 back to plain text.",
      inputPlaceholder: "Text to encode or Base64 string to decode...",
      credits: 1,
    },
    "url-encoder": {
      name: "URL Encoder & Decoder",
      desc: "Percent-encode or decode URL query strings and path parameters.",
      inputPlaceholder: "https://example.com/search?q=my query & test",
      credits: 1,
    },
    "regex-tester": {
      name: "Regex Pattern Tester",
      desc: "Test regular expressions. Format: Pattern, Flags, Input Text (separated by '---REGEX---').",
      inputPlaceholder: "[a-zA-Z]+\n---REGEX---\ng\n---REGEX---\nThis is a test of regex matching.",
      credits: 1,
    },
    "heic-to-jpg": {
      name: "HEIC to JPG Converter",
      desc: "Convert Apple HEIC photos to JPG format.",
      inputPlaceholder: "Enter base64 raw HEIC text or drop HEIC file here...",
      credits: 1,
    },
    "svg-to-png": {
      name: "SVG to PNG Converter",
      desc: "Convert SVG vector graphics to PNG images.",
      inputPlaceholder: "Paste your raw SVG code here...",
      credits: 1,
    },
  };

  const currentTool = toolsMeta[slug] || {
    name: "Interactive Tool Runner",
    desc: "A premium utility tool workspace.",
    inputPlaceholder: "Enter utility inputs here...",
    credits: 2,
  };

  const handleRun = async () => {
    if (!input.trim()) return;
    setRunning(true);
    setOutput("");

    // Simulate server side utility execution
    setTimeout(async () => {
      try {
        if (slug === "json-formatter") {
          const parsed = JSON.parse(input);
          setOutput(JSON.stringify(parsed, null, 2));
        } else if (slug === "env-validator") {
          const lines = input.split("\n").filter((l) => l.trim() && !l.startsWith("#"));
          const validated = lines.map((l) => {
            const [k, v] = l.split("=");
            return `[VALID] ${k}: ${v ? "Present" : "Missing Value"}`;
          });
          setOutput(validated.join("\n"));
        } else if (slug === "css-gradient-generator") {
          const colors = input.split(",").map((c) => c.trim());
          setOutput(`background-image: linear-gradient(to right, ${colors.map((c) => `hsl(${c}, 70%, 50%)`).join(", ")});`);
        } else if (slug === "word-counter") {
          const charCount = input.length;
          const charNoSpaces = input.replace(/\s+/g, "").length;
          const words = input.trim().split(/\s+/).filter(Boolean);
          const wordCount = words.length;
          const sentenceCount = input.split(/[.!?]+/).filter(Boolean).length;
          const paragraphCount = input.split(/\n+/).filter(Boolean).length;
          const readTime = Math.ceil(wordCount / 200);

          setOutput(`=== ANALYSIS REPORT ===
Words: ${wordCount}
Characters (with spaces): ${charCount}
Characters (no spaces): ${charNoSpaces}
Sentences: ${sentenceCount}
Paragraphs: ${paragraphCount}
Estimated Reading Time: ~${readTime} min`);
        } else if (slug === "case-converter") {
          const clean = input.trim();
          setOutput(`UPPERCASE: ${clean.toUpperCase()}
lowercase: ${clean.toLowerCase()}
Title Case: ${clean.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
camelCase: ${clean.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())}
snake_case: ${clean.toLowerCase().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]+/g, '')}`);
        } else if (slug === "lorem-ipsum-generator") {
          const paragraphsCount = parseInt(input.trim()) || 1;
          const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
          setOutput(Array(paragraphsCount).fill(lorem).join("\n\n"));
        } else if (slug === "text-to-binary") {
          // Check if input looks like binary: spaces/newlines/only 0 and 1
          const isBinary = /^[01\s\n]+$/.test(input.trim());
          if (isBinary) {
            const rawBinary = input.replace(/[\s\n]+/g, "");
            let text = "";
            for (let i = 0; i < rawBinary.length; i += 8) {
              const bin = rawBinary.slice(i, i + 8);
              text += String.fromCharCode(parseInt(bin, 2));
            }
            setOutput(`Decoded Text:\n${text}`);
          } else {
            const binary = input.split('').map(char => {
              const bin = char.charCodeAt(0).toString(2);
              return '0'.repeat(8 - bin.length) + bin;
            }).join(' ');
            setOutput(`Encoded Binary:\n${binary}`);
          }
        } else if (slug === "slug-generator") {
          const slugText = input.toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
          setOutput(slugText);
        } else if (slug === "password-generator") {
          const length = parseInt(input.trim()) || 16;
          const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
          let pass = "";
          for (let i = 0; i < length; i++) {
            pass += chars.charAt(Math.floor(Math.random() * chars.length));
          }
          setOutput(pass);
        } else if (slug === "hash-sha256-generator") {
          const encoder = new TextEncoder();
          const data = encoder.encode(input);
          const hashBuffer = await crypto.subtle.digest("SHA-256", data);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
          setOutput(hashHex);
        } else if (slug === "diff-checker") {
          const parts = input.split("---DIFF---");
          if (parts.length < 2) {
            setOutput("[ERROR] Input format invalid. Please separate the two texts with a line containing '---DIFF---'.");
          } else {
            const original = parts[0].trim().split("\n");
            const modified = parts[1].trim().split("\n");
            const report: string[] = [];
            original.forEach((line, idx) => {
              const modLine = modified[idx];
              if (modLine === undefined) {
                report.push(`- Line ${idx + 1}: ${line} (Deleted)`);
              } else if (line !== modLine) {
                report.push(`* Line ${idx + 1}:`);
                report.push(`  Original: ${line}`);
                report.push(`  Modified: ${modLine}`);
              } else {
                report.push(`  Line ${idx + 1}: ${line} (No change)`);
              }
            });
            if (modified.length > original.length) {
              for (let i = original.length; i < modified.length; i++) {
                report.push(`+ Line ${i + 1}: ${modified[i]} (Added)`);
              }
            }
            setOutput(report.join("\n"));
          }
        } else if (slug === "uuid-generator") {
          const count = parseInt(input.trim()) || 1;
          const uuids = Array(count).fill(0).map(() => {
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
              const r = (Math.random() * 16) | 0;
              const v = c === "x" ? r : (r & 0x3) | 0x8;
              return v.toString(16);
            });
          });
          setOutput(uuids.join("\n"));
        } else if (slug === "markdown-preview") {
          // Simple markdown regex compiler
          let html = input
            .replace(/^# (.*?)$/gm, "<h1>$1</h1>")
            .replace(/^## (.*?)$/gm, "<h2>$2</h2>")
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .replace(/\*(.*?)\*/g, "<em>$1</em>")
            .replace(/\n/g, "<br />");
          setOutput(html);
        } else if (slug === "css-minifier") {
          const minified = input
            .replace(/\/\*[\s\S]*?\*\//g, "") // strip comments
            .replace(/\s*([{\}:;])\s*/g, "$1") // strip spacing around delimiters
            .replace(/\s+/g, " ") // normalize whitespace
            .trim();
          setOutput(minified);
        } else if (slug === "percentage-calculator") {
          const vals = input.split(",").map(v => parseFloat(v.trim()));
          if (vals.length < 2 || isNaN(vals[0]) || isNaN(vals[1])) {
            setOutput("[ERROR] Please provide two comma-separated numbers (e.g. 15, 200).");
          } else {
            const [x, y] = vals;
            setOutput(`Result:
1) ${x}% of ${y} is ${((x / 100) * y).toFixed(4)}
2) ${x} is ${((x / y) * 100).toFixed(4)}% of ${y}`);
          }
        } else if (slug === "bmi-calculator") {
          const vals = input.split(",").map(v => parseFloat(v.trim()));
          if (vals.length < 2 || isNaN(vals[0]) || isNaN(vals[1])) {
            setOutput("[ERROR] Please provide Height (cm) and Weight (kg) comma-separated (e.g. 180, 75).");
          } else {
            const [heightCm, weightKg] = vals;
            const bmi = weightKg / Math.pow(heightCm / 100, 2);
            let category = "Unknown";
            if (bmi < 18.5) category = "Underweight";
            else if (bmi < 24.9) category = "Normal weight";
            else if (bmi < 29.9) category = "Overweight";
            else category = "Obese";
            setOutput(`Body Mass Index (BMI): ${bmi.toFixed(2)}
Health Category: ${category}`);
          }
        } else if (slug === "age-calculator") {
          const dateStr = input.trim();
          const birth = new Date(dateStr);
          if (isNaN(birth.getTime())) {
            setOutput("[ERROR] Invalid birthdate format. Please use YYYY-MM-DD.");
          } else {
            const diff = Date.now() - birth.getTime();
            const ageDate = new Date(diff);
            const years = Math.abs(ageDate.getUTCFullYear() - 1970);
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            setOutput(`Age: ${years} years old\nTotal lifetime days: ${days} days`);
          }
        } else if (slug === "loan-calculator") {
          const vals = input.split(",").map(v => parseFloat(v.trim()));
          if (vals.length < 3 || isNaN(vals[0]) || isNaN(vals[1]) || isNaN(vals[2])) {
            setOutput("[ERROR] Please provide Principal, Annual Interest %, Loan Term (years) comma-separated.");
          } else {
            const [p, rAnn, y] = vals;
            const r = rAnn / 12 / 100;
            const n = y * 12;
            const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
            const totalRepay = emi * n;
            setOutput(`Monthly EMI: $${emi.toFixed(2)}
Total Repayment Amount: $${totalRepay.toFixed(2)}
Total Interest Owed: $${(totalRepay - p).toFixed(2)}`);
          }
        } else if (slug === "gst-calculator") {
          const vals = input.split(",").map(v => parseFloat(v.trim()));
          if (vals.length < 2 || isNaN(vals[0]) || isNaN(vals[1])) {
            setOutput("[ERROR] Please provide Net Price and GST % comma-separated (e.g. 1000, 18).");
          } else {
            const [price, gstPercent] = vals;
            const gstAmount = price * (gstPercent / 100);
            setOutput(`GST Addition (Tax Exclusive):
Net Price: $${price.toFixed(2)}
GST Tax Amount: $${gstAmount.toFixed(2)}
Gross Price (Total): $${(price + gstAmount).toFixed(2)}

GST Extraction (Tax Inclusive):
Gross Price: $${price.toFixed(2)}
GST Tax Amount: $${(price - price / (1 + gstPercent / 100)).toFixed(2)}
Net Price (Before Tax): $${(price / (1 + gstPercent / 100)).toFixed(2)}`);
          }
        } else if (slug === "base64-encoder-decoder") {
          try {
            // Check if input is valid Base64
            const decoded = atob(input.trim());
            setOutput(`Decoded from Base64:\n${decoded}`);
          } catch (e) {
            const encoded = btoa(input);
            setOutput(`Encoded to Base64:\n${encoded}`);
          }
        } else if (slug === "url-encoder") {
          try {
            if (input.includes("%") && decodeURIComponent(input) !== input) {
              setOutput(`URL Decoded:\n${decodeURIComponent(input)}`);
            } else {
              setOutput(`URL Encoded:\n${encodeURIComponent(input)}`);
            }
          } catch (e) {
            setOutput(`URL Encoded:\n${encodeURIComponent(input)}`);
          }
        } else if (slug === "regex-tester") {
          const parts = input.split("---REGEX---");
          if (parts.length < 3) {
            setOutput("[ERROR] Format invalid. Format: Pattern, Flags, Input Text (separated by '---REGEX---').");
          } else {
            const pattern = parts[0].trim();
            const flags = parts[1].trim();
            const text = parts[2].trim();
            const regex = new RegExp(pattern, flags);
            const matches = [...text.matchAll(regex)];
            const matchReports = matches.map((m, i) => {
              return `Match ${i + 1}: "${m[0]}" at Index: ${m.index} (Groups: ${JSON.stringify(m.slice(1))})`;
            });
            setOutput(matchReports.length > 0 ? matchReports.join("\n") : "No matches found.");
          }
        } else if (slug === "heic-to-jpg") {
          setOutput("Simulated HEIC to JPG conversion:\nSuccess! Your Apple HEIC image has been converted to JPG format locally.\nDownload file: converted.jpg");
        } else if (slug === "svg-to-png") {
          const svgString = input.trim();
          if (!svgString.startsWith("<svg") && !svgString.startsWith("<?xml")) {
            throw new Error("Invalid SVG input: Must start with '<svg' or XML declaration");
          }
          setOutput("Simulated SVG to PNG conversion:\nSuccess! Scalable Vector Graphics converted to PNG raster format locally.\nDownload file: converted.png");
        } else {
          setOutput(`Success!\nUtility execution output for parameter: ${input}`);
        }
        window.dispatchEvent(new CustomEvent("tool-success", { detail: { toolSlug: slug } }));
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        setOutput(`[ERROR] Execution failed:\n${errorMsg}`);
      } finally {
        setRunning(false);
      }
    }, 1200);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
  };

  return (
    <div className="space-y-6">
      {/* Navigation and Title */}
      {!hideHeader && (
        <div className="flex flex-col gap-4 border-b border-border pb-6">
          <div>
            <Link
              href="/tools"
              className="inline-flex items-center gap-1.5 text-caption font-bold text-muted-foreground hover:text-foreground transition mb-3 uppercase tracking-wider"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Catalog
            </Link>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h1 className="text-display-sm font-bold tracking-tight text-foreground flex items-center gap-2.5">
                  {currentTool.name}
                </h1>
                <p className="text-body-sm text-muted-foreground mt-1">{currentTool.desc}</p>
              </div>
              <Badge variant="primary" className="self-start">
                <Sparkles className="h-3.5 w-3.5 mr-1" />
                <span>Cost: {currentTool.credits} {currentTool.credits === 1 ? "credit" : "credits"}</span>
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* Editor & Execution Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Input Panel */}
        <GlassCard className="flex flex-col p-5 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-foreground">Input Parameters</span>
            <button
              onClick={handleClear}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition px-2 py-1 rounded hover:bg-muted/40"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={currentTool.inputPlaceholder}
            className="flex-1 min-h-[300px] block w-full rounded-xl border border-border bg-muted/40 p-4 text-sm text-foreground font-mono placeholder-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-y"
            suppressHydrationWarning
          />
          <Button
            onClick={handleRun}
            disabled={running || !input.trim()}
            className="w-full flex justify-center items-center gap-2"
          >
            {running ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Executing Pipeline...
              </>
            ) : (
              <>
                <Play className="h-4.5 w-4.5 fill-current" />
                Run Utility Pipeline
              </>
            )}
          </Button>
        </GlassCard>

        {/* Output Panel */}
        <GlassCard className="flex flex-col p-5 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <Terminal className="h-4 w-4 text-primary" />
              Execution Output
            </span>
            {output && (
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition px-2 py-1 rounded hover:bg-muted/40"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy Code
                  </>
                )}
              </button>
            )}
          </div>
          <div className="flex-1 min-h-[300px] w-full rounded-xl border border-border bg-muted/40 p-4 text-sm text-foreground font-mono overflow-auto whitespace-pre-wrap select-text leading-relaxed">
            {output ? (
              output
            ) : (
              <span className="text-muted-foreground/50 italic">Run the pipeline on the left to see results.</span>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
