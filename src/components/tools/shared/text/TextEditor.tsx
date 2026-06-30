"use client";

import React, { useRef, useEffect, useState } from "react";
import { Upload, Maximize2, Minimize2, AlignLeft } from "lucide-react";
import { cn } from "@/utils/cn";
import { toast } from "sonner";

interface TextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  wordWrap?: boolean;
  fullscreen?: boolean;
  onToggleFullscreen?: () => void;
  id?: string;
}

export function TextEditor({
  value,
  onChange,
  placeholder = "Type or paste your text here...",
  readOnly = false,
  wordWrap = true,
  fullscreen = false,
  onToggleFullscreen,
  id = "text-editor",
}: TextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const [dragActive, setDragActive] = useState(false);

  // Sync scrolling of textarea and line numbers gutter
  const handleScroll = () => {
    if (textareaRef.current && gutterRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  useEffect(() => {
    // Sync scroll when value changes (e.g. keypresses at the bottom)
    handleScroll();
  }, [value]);

  const lineCount = value.split("\n").length;
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  // Auto-focus on load
  useEffect(() => {
    if (!readOnly && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [readOnly]);

  // File Drag and Drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (readOnly) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      await loadFile(file);
    }
  };

  const loadFile = (file: File): Promise<void> => {
    return new Promise((resolve) => {
      const validExtensions = ["txt", "csv", "log", "json", "xml", "html", "md"];
      const fileExt = file.name.split(".").pop()?.toLowerCase() || "";

      if (!validExtensions.includes(fileExt) && !file.type.startsWith("text/")) {
        toast.error("Unsupported file format. Please upload text, CSV, log, JSON, XML, HTML or Markdown files.");
        resolve();
        return;
      }

      const reader = new FileReader();
      
      // Auto detect encoding: we read as UTF-8 by default.
      reader.onload = (e) => {
        const text = e.target?.result as string;
        onChange(text);
        toast.success(`Loaded file: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
        resolve();
      };

      reader.onerror = () => {
        toast.error("Failed to read file.");
        resolve();
      };

      reader.readAsText(file, "UTF-8");
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await loadFile(e.target.files[0]);
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      className={cn(
        "relative border rounded-2xl bg-card transition-all flex flex-col flex-1 min-h-[350px]",
        dragActive ? "border-primary ring-2 ring-primary/20 bg-primary/5" : "border-border/80",
        fullscreen && "fixed inset-4 z-50 shadow-2xl h-[calc(100vh-32px)]"
      )}
    >
      {/* Editor Header / Controls */}
      <div className="relative z-10 flex justify-between items-center px-4 py-2 border-b border-border/60 bg-muted text-xs select-none">
        <div className="flex items-center gap-2 text-muted-foreground font-semibold">
          <AlignLeft className="h-3.5 w-3.5" />
          <span>{readOnly ? "OUTPUT RESULT" : "INPUT EDITOR"}</span>
          <span className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded border border-border">
            {lineCount} {lineCount === 1 ? "line" : "lines"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {!readOnly && (
            <label className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-lg border border-border bg-card hover:bg-muted cursor-pointer transition">
              <Upload className="h-3 w-3 text-muted-foreground" />
              Upload File
              <input
                type="file"
                accept=".txt,.csv,.log,.json,.xml,.html,.md,text/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}
          {onToggleFullscreen && (
            <button
              onClick={onToggleFullscreen}
              className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition"
              title={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {fullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Editor Main Text Area */}
      <div className="flex flex-1 relative overflow-hidden font-mono text-sm py-4">
        {/* Line Numbers Gutter */}
        <div
          ref={gutterRef}
          className="absolute left-0 top-0 bottom-0 w-11 bg-muted/30 border-r border-border/50 text-right pr-2.5 pt-4 text-[10px] text-muted-foreground/60 select-none overflow-hidden font-mono leading-6"
        >
          {lineNumbers.map((num) => (
            <div key={num} className="h-6">
              {num}
            </div>
          ))}
        </div>

        {/* Text Area */}
        <textarea
          id={id}
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          readOnly={readOnly}
          placeholder={placeholder}
          className={cn(
            "w-full h-full pl-14 pr-4 py-0 bg-transparent outline-none resize-none leading-6 text-foreground font-mono placeholder:text-muted-foreground/50",
            wordWrap ? "whitespace-pre-wrap break-all" : "whitespace-pre overflow-x-auto",
            readOnly && "bg-muted/5 cursor-text selection:bg-primary/10"
          )}
        />

        {/* Drag & Drop Overlay */}
        {dragActive && !readOnly && (
          <div className="absolute inset-0 bg-primary/5 backdrop-blur-[1px] flex flex-col items-center justify-center border-2 border-dashed border-primary rounded-b-2xl animate-fade-in">
            <Upload className="h-10 w-10 text-primary animate-bounce" />
            <h4 className="text-sm font-black text-foreground mt-2">Drop file to load contents</h4>
            <p className="text-xs text-muted-foreground mt-1">Supports TXT, CSV, LOG, XML, HTML, MD</p>
          </div>
        )}
      </div>
    </div>
  );
}
