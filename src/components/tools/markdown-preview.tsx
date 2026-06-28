"use client";

import React, { useState, useEffect, useRef } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { marked } from "marked";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Link as LinkIcon,
  Code,
  List,
  ListOrdered,
  Quote,
  Table as TableIcon,
  Copy,
  Check,
  Download,
  Eye,
  Edit3,
  Columns
} from "lucide-react";
import { toast } from "sonner";

export function MarkdownPreview() {
  const [input, setInput] = useState(`# Markdown Live Previewer

Welcome to utool's **Markdown Live Previewer**! Type some markdown syntax on the left and see it formatted on the right.

## Visual Formatting Features
- **Bold text** and *italic text*
- [Clickable links](https://utool.in)
- Inline \`code blocks\`

### Standard Code Snippet
\`\`\`javascript
function greet(user) {
  return \`Hello, \${user}! Welcome to utool.\`;
}
console.log(greet("Developer"));
\`\`\`

> Blockquotes are styled with a clean accent line on the side.

| Feature | Support | Efficiency |
| :--- | :---: | ---: |
| Local Parsing | Yes | 100% |
| Styling Sheets | Live | High |
| Export HTML | Yes | Fast |
`);
  const [html, setHtml] = useState("");
  const [viewMode, setViewMode] = useState<"split" | "editor" | "preview">("split");
  
  const [copiedHtml, setCopiedHtml] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    try {
      // Synchronous parse using marked
      const parsed = marked.parse(input);
      setHtml(parsed as string);
    } catch (err) {
      console.error(err);
      setHtml("<p class='text-red-500'>Error parsing markdown content.</p>");
    }
  }, [input]);

  const insertMarkdown = (syntaxBefore: string, syntaxAfter = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selection = textarea.value.substring(start, end);
    const replacement = syntaxBefore + (selection || "text") + syntaxAfter;

    const newVal = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
    setInput(newVal);

    // Re-focus and re-select
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + syntaxBefore.length;
      textarea.selectionEnd = start + syntaxBefore.length + (selection || "text").length;
    }, 0);
  };

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(html);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
    toast.success("Parsed HTML code copied!");
  };

  const handleDownloadHtml = () => {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "markdown-export.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Downloaded markdown-export.html file!");
  };

  return (
    <div className="space-y-6">
      <style dangerouslySetInnerHTML={{ __html: `
        .markdown-body h1 { font-size: 1.8em; font-weight: 800; margin-top: 1.2em; margin-bottom: 0.6em; border-bottom: 1px solid var(--border); padding-bottom: 0.3em; color: var(--foreground); }
        .markdown-body h2 { font-size: 1.4em; font-weight: 700; margin-top: 1.2em; margin-bottom: 0.6em; border-bottom: 1px solid rgba(120,120,120,0.1); padding-bottom: 0.2em; color: var(--foreground); }
        .markdown-body h3 { font-size: 1.2em; font-weight: 700; margin-top: 1.2em; margin-bottom: 0.6em; color: var(--foreground); }
        .markdown-body p { margin-top: 0; margin-bottom: 1em; line-height: 1.6; color: var(--foreground); }
        .markdown-body ul { list-style-type: disc; padding-left: 1.5em; margin-bottom: 1em; color: var(--foreground); }
        .markdown-body ol { list-style-type: decimal; padding-left: 1.5em; margin-bottom: 1em; color: var(--foreground); }
        .markdown-body li { margin-bottom: 0.3em; }
        .markdown-body code { font-family: monospace; background-color: rgba(120, 120, 120, 0.12); padding: 0.2em 0.4em; border-radius: 0.25rem; font-size: 85%; color: var(--foreground); }
        .markdown-body pre { background-color: rgba(120, 120, 120, 0.08); padding: 1rem; border-radius: 0.75rem; border: 1px solid rgba(120, 120, 120, 0.15); overflow-x: auto; margin-bottom: 1em; }
        .markdown-body pre code { background-color: transparent; padding: 0; border-radius: 0; font-size: 90%; color: var(--foreground); }
        .markdown-body blockquote { border-left: 4px solid var(--primary); padding-left: 1rem; color: var(--muted-foreground); margin-bottom: 1em; font-style: italic; }
        .markdown-body a { color: var(--primary); text-decoration: underline; }
        .markdown-body table { width: 100%; border-collapse: collapse; margin-bottom: 1em; font-size: 90%; }
        .markdown-body th, .markdown-body td { border: 1px solid var(--border); padding: 0.5rem 0.75rem; }
        .markdown-body th { background-color: rgba(120, 120, 120, 0.06); font-weight: 700; }
        .markdown-body hr { border: 0; border-top: 1px solid var(--border); margin: 1.5em 0; }
      ` }} />

      <div className="border-b border-border pb-4 flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-h2 font-extrabold text-foreground tracking-tight">Markdown Live Previewer</h2>
          <p className="text-body-s text-muted-foreground mt-0.5">
            Write markdown content and see it rendered as beautifully styled HTML in real-time.
          </p>
        </div>

        {/* View Toggles */}
        <div className="flex rounded-lg overflow-hidden border border-border bg-muted/30 p-0.5 w-fit">
          <button
            onClick={() => setViewMode("split")}
            className={`flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-md transition ${
              viewMode === "split" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Columns className="h-3 w-3" /> Split View
          </button>
          <button
            onClick={() => setViewMode("editor")}
            className={`flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-md transition ${
              viewMode === "editor" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Edit3 className="h-3 w-3" /> Editor Only
          </button>
          <button
            onClick={() => setViewMode("preview")}
            className={`flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-md transition ${
              viewMode === "preview" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Eye className="h-3 w-3" /> Preview Only
          </button>
        </div>
      </div>

      {/* Editor & Preview containers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Editor Pane */}
        {(viewMode === "split" || viewMode === "editor") && (
          <GlassCard className="flex flex-col p-5 space-y-4">
            <div className="flex flex-wrap gap-1 items-center pb-2 border-b border-border/40">
              <button
                onClick={() => insertMarkdown("**", "**")}
                className="p-2 rounded hover:bg-muted/60 text-muted-foreground hover:text-foreground transition"
                title="Bold"
              >
                <Bold className="h-4 w-4" />
              </button>
              <button
                onClick={() => insertMarkdown("*", "*")}
                className="p-2 rounded hover:bg-muted/60 text-muted-foreground hover:text-foreground transition"
                title="Italic"
              >
                <Italic className="h-4 w-4" />
              </button>
              <button
                onClick={() => insertMarkdown("# ")}
                className="p-2 rounded hover:bg-muted/60 text-muted-foreground hover:text-foreground transition"
                title="Heading 1"
              >
                <Heading1 className="h-4 w-4" />
              </button>
              <button
                onClick={() => insertMarkdown("## ")}
                className="p-2 rounded hover:bg-muted/60 text-muted-foreground hover:text-foreground transition"
                title="Heading 2"
              >
                <Heading2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => insertMarkdown("[", "](https://)")}
                className="p-2 rounded hover:bg-muted/60 text-muted-foreground hover:text-foreground transition"
                title="Link"
              >
                <LinkIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => insertMarkdown("`", "`")}
                className="p-2 rounded hover:bg-muted/60 text-muted-foreground hover:text-foreground transition"
                title="Inline Code"
              >
                <Code className="h-4 w-4" />
              </button>
              <button
                onClick={() => insertMarkdown("- ")}
                className="p-2 rounded hover:bg-muted/60 text-muted-foreground hover:text-foreground transition"
                title="Bullet List"
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => insertMarkdown("1. ")}
                className="p-2 rounded hover:bg-muted/60 text-muted-foreground hover:text-foreground transition"
                title="Numbered List"
              >
                <ListOrdered className="h-4 w-4" />
              </button>
              <button
                onClick={() => insertMarkdown("> ")}
                className="p-2 rounded hover:bg-muted/60 text-muted-foreground hover:text-foreground transition"
                title="Quote"
              >
                <Quote className="h-4 w-4" />
              </button>
              <button
                onClick={() => insertMarkdown("| Header 1 | Header 2 |\n| :--- | :---: |\n| Cell 1 | Cell 2 |")}
                className="p-2 rounded hover:bg-muted/60 text-muted-foreground hover:text-foreground transition"
                title="Table"
              >
                <TableIcon className="h-4 w-4" />
              </button>
            </div>

            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Write your markdown content here..."
              className="flex-1 min-h-[400px] w-full rounded-xl border border-border bg-muted/20 p-4 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-y leading-relaxed"
            />
          </GlassCard>
        )}

        {/* Preview Pane */}
        {(viewMode === "split" || viewMode === "preview") && (
          <GlassCard className="flex flex-col p-5 space-y-4 lg:col-span-1">
            <div className="flex justify-between items-center pb-2 border-b border-border/40">
              <span className="text-xs font-bold text-foreground">Live HTML Preview</span>
              <div className="flex gap-2">
                <button
                  onClick={handleCopyHtml}
                  className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition px-2 py-1 rounded bg-muted/40"
                >
                  {copiedHtml ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" /> Copied HTML
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" /> Copy HTML
                    </>
                  )}
                </button>
                <button
                  onClick={handleDownloadHtml}
                  className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition px-2 py-1 rounded bg-muted/40"
                >
                  <Download className="h-3.5 w-3.5" /> Export HTML
                </button>
              </div>
            </div>

            <div
              className="markdown-body flex-1 min-h-[400px] max-h-[600px] w-full overflow-auto rounded-xl border border-border bg-muted/20 p-6 select-text"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </GlassCard>
        )}
      </div>
    </div>
  );
}
