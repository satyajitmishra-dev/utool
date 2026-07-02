import React, { useRef, useState } from 'react';
import { Upload, FileText, Image as ImageIcon, Clipboard, Trash2 } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ConverterInputProps {
  inputMode: 'number' | 'text' | 'file';
  value: any; // number string for 'number', text string for 'text', File[] or File for 'file'
  onChange: (val: any) => void;
  error?: string;
  placeholder?: string;
  supportedFormats?: string[];
  maxBytes?: number;
}

export function ConverterInput({
  inputMode,
  value,
  onChange,
  error,
  placeholder,
  supportedFormats = [],
  maxBytes = 25 * 1024 * 1024, // Default 25MB
}: ConverterInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  // 1. Textarea File Loader Helper (For CSV/JSON drag & drop / upload)
  const readTextFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onChange(String(e.target.result));
      }
    };
    reader.readAsText(file);
  };

  // 2. Drag-Drop Event Handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      if (inputMode === 'file') {
        // Feed files array directly
        onChange(files);
      } else if (inputMode === 'text') {
        // Read first file as text
        readTextFile(files[0]);
      }
    }
  };

  // 3. File Browser Selection Handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const files = Array.from(e.target.files);
      if (inputMode === 'file') {
        onChange(files);
      } else if (inputMode === 'text') {
        readTextFile(files[0]);
      }
    }
  };

  // 4. Clipboard Paste for Images/Files
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement | HTMLDivElement>) => {
    if (inputMode === 'file' && e.clipboardData.files && e.clipboardData.files.length > 0) {
      e.preventDefault();
      const files = Array.from(e.clipboardData.files);
      onChange(files);
    }
  };

  // Render Numeric Input
  if (inputMode === 'number') {
    return (
      <div className="space-y-1.5 text-left w-full">
        <label htmlFor="numeric-value-input" className="block text-xs font-bold text-muted-foreground uppercase">
          Input Value
        </label>
        <input
          id="numeric-value-input"
          type="text"
          inputMode="decimal"
          value={value}
          placeholder={placeholder || 'Enter value...'}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full rounded-xl border border-border bg-card px-4 py-3 text-base text-foreground font-semibold placeholder:text-muted-foreground shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
            error && "border-error focus:border-error focus:ring-error/20"
          )}
        />
        {error && <p className="text-xs text-error font-medium mt-1">{error}</p>}
      </div>
    );
  }

  // Render Rich Code/Textarea Input (For CSV/JSON)
  if (inputMode === 'text') {
    const textVal = String(value || '');
    return (
      <div className="space-y-2 text-left w-full">
        <div className="flex items-center justify-between">
          <label htmlFor="text-value-input" className="block text-xs font-bold text-muted-foreground uppercase">
            Input Data (CSV or JSON)
          </label>
          <span className="text-xs text-muted-foreground font-mono">
            {textVal.length} chars | {textVal.split('\n').filter(Boolean).length} lines
          </span>
        </div>
        
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={cn(
            "relative rounded-xl border border-border bg-card shadow-xs transition-all overflow-hidden flex flex-col min-h-64",
            isDragActive && "border-primary/80 ring-2 ring-primary/20 bg-muted/25",
            error && "border-error"
          )}
        >
          {/* File attachment helper inside textarea */}
          {textVal.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-muted-foreground p-6 text-center space-y-2">
              <Upload className="h-8 w-8 text-muted-foreground/60" />
              <p className="text-xs font-semibold">Paste text, type, or drag & drop file here</p>
              <p className="text-[10px] text-muted-foreground/70">Supports .csv, .json, .txt</p>
            </div>
          )}

          <textarea
            id="text-value-input"
            value={textVal}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || 'Paste or drop your data here...'}
            className="w-full flex-1 min-h-64 p-4 text-xs font-mono bg-transparent text-foreground placeholder:text-muted-foreground/55 focus:outline-none resize-y"
          />
        </div>
        {error && <p className="text-xs text-error font-medium mt-1">{error}</p>}
      </div>
    );
  }

  // Render Interactive Image/File Dropzone (For PNG to JPG batch converter)
  const fileArray = Array.isArray(value) ? value : value ? [value] : [];
  
  return (
    <div className="space-y-2 text-left w-full">
      <label className="block text-xs font-bold text-muted-foreground uppercase">
        Upload Files ({supportedFormats.join(', ')})
      </label>

      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onPaste={handlePaste}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "border-2 border-dashed border-border rounded-2xl bg-card hover:bg-muted/15 cursor-pointer p-8 transition-all flex flex-col items-center justify-center text-center space-y-4 min-h-48 relative focus-ring",
          isDragActive && "border-primary bg-primary/5",
          fileArray.length > 0 && "border-solid border-border bg-card hover:bg-card"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={supportedFormats.map(f => `.${f}`).join(',')}
          onChange={handleFileChange}
          className="hidden"
        />

        {fileArray.length === 0 ? (
          <>
            <div className="h-12 w-12 rounded-full bg-primary/5 flex items-center justify-center text-primary">
              <ImageIcon className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-foreground">Drag & drop files or click to browse</p>
              <p className="text-xs text-muted-foreground">Paste from clipboard (Ctrl+V) is supported</p>
              <p className="text-[10px] text-muted-foreground/80">Maximum size per file: {Math.round(maxBytes / 1024 / 1024)}MB</p>
            </div>
          </>
        ) : (
          <div className="w-full space-y-3 pointer-events-none" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-border pb-2 shrink-0">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-primary" />
                <span>Selected {fileArray.length} file(s)</span>
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange([]);
                }}
                className="pointer-events-auto text-xs text-error hover:opacity-80 p-1 flex items-center gap-1"
                title="Remove all files"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear</span>
              </button>
            </div>

            {/* List of files with previews */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-48 overflow-y-auto pr-1">
              {fileArray.slice(0, 6).map((file: File, idx) => {
                const isImage = file.type.startsWith('image/');
                return (
                  <div key={idx} className="flex flex-col items-center bg-muted/30 border border-border p-2 rounded-xl text-center space-y-1.5 relative overflow-hidden">
                    {isImage ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        onLoad={(e) => URL.revokeObjectURL((e.target as any).src)}
                        className="h-14 w-full object-cover rounded-lg bg-card border border-border/40"
                      />
                    ) : (
                      <div className="h-14 w-full rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                        <FileText className="h-5 w-5" />
                      </div>
                    )}
                    <span className="text-[10px] text-foreground font-semibold truncate w-full px-1">{file.name}</span>
                    <span className="text-[8px] text-muted-foreground font-mono">{(file.size / 1024).toFixed(1)} KB</span>
                  </div>
                );
              })}
              {fileArray.length > 6 && (
                <div className="flex flex-col items-center justify-center bg-muted/40 border border-border border-dashed p-2 rounded-xl text-center min-h-24">
                  <span className="text-xs font-black text-primary">+{fileArray.length - 6}</span>
                  <span className="text-[9px] text-muted-foreground font-bold">more files</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {error && <p className="text-xs text-error font-medium mt-1">{error}</p>}
    </div>
  );
}
