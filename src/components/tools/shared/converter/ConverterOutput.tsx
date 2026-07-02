import React, { useState, useEffect } from 'react';
import { Copy, Download, Check, AlertTriangle, Eye, Table } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

interface ConverterOutputProps {
  outputMode: 'number' | 'text' | 'file';
  result: any; // String for number/text, Blob or File[] for file
  exactResult?: string;
  onCopy: () => void;
  onDownload: () => void;
  hasCopied?: boolean;
  error?: string;
  isProcessing?: boolean;
}

export function ConverterOutput({
  outputMode,
  result,
  exactResult,
  onCopy,
  onDownload,
  hasCopied = false,
  error,
  isProcessing = false,
}: ConverterOutputProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [previewRows, setPreviewRows] = useState<string[][]>([]);
  const [previewHeaders, setPreviewHeaders] = useState<string[]>([]);

  // CSV Preview parsing (first 10 lines)
  useEffect(() => {
    if (outputMode === 'text' && result && typeof result === 'string') {
      const trimmed = result.trim();
      // Simple parse to verify if it looks like CSV
      if (trimmed.startsWith('"') || trimmed.includes(',') || trimmed.includes(';')) {
        try {
          const lines = trimmed.split('\n').slice(0, 11).map(line => {
            // Basic CSV row splitter (splits by commas but ignores inside quotes)
            const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(',');
            return matches.map(cell => cell.replace(/^"|"$/g, '').trim());
          });

          if (lines.length > 0) {
            setPreviewHeaders(lines[0]);
            setPreviewRows(lines.slice(1));
            return;
          }
        } catch {
          // Fall back to no table preview if parsing fails
        }
      }
    }
    setPreviewHeaders([]);
    setPreviewRows([]);
  }, [result, outputMode]);

  // Render error card
  if (error) {
    return (
      <div className="rounded-xl border border-error/20 bg-error/5 p-5 text-left space-y-3">
        <div className="flex items-center gap-2 text-error">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <span className="text-sm font-bold">Conversion Failed</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{error}</p>
      </div>
    );
  }

  // Render Loading state
  if (isProcessing) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center flex flex-col items-center justify-center space-y-3 min-h-64">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-xs text-muted-foreground font-semibold">Processing conversion locally...</p>
      </div>
    );
  }

  // Render empty state
  if (!result && result !== 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-8 text-center flex flex-col items-center justify-center space-y-2 min-h-64 text-muted-foreground bg-card/30">
        <Table className="h-8 w-8 text-muted-foreground/45" />
        <p className="text-xs font-semibold">Awaiting conversion input...</p>
      </div>
    );
  }

  // Render Numeric Output
  if (outputMode === 'number') {
    return (
      <div className="space-y-4 text-left w-full">
        {/* Main Display */}
        <div className="space-y-1.5">
          <span className="block text-xs font-bold text-muted-foreground uppercase">Result Output</span>
          <div className="relative flex items-center bg-card border border-border rounded-xl px-4 py-3 shadow-xs font-mono font-bold text-lg text-primary overflow-x-auto min-h-[50px]">
            <span>{result}</span>
          </div>
        </div>

        {/* Exact value representation */}
        {exactResult && exactResult !== String(result) && (
          <div className="space-y-1 bg-muted/20 border border-border/50 p-3 rounded-lg text-xs font-mono">
            <span className="block font-bold text-muted-foreground uppercase text-[9px]">Exact Representation</span>
            <span className="text-foreground break-all">{exactResult}</span>
          </div>
        )}
      </div>
    );
  }

  // Render Text Output (For CSV/JSON)
  if (outputMode === 'text') {
    const textResult = String(result);
    return (
      <div className="space-y-3 text-left w-full">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-muted-foreground uppercase">Converted Output</span>
          <div className="flex gap-2">
            {previewHeaders.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="h-7 text-[10px] px-2.5 rounded-lg flex items-center gap-1"
              >
                <Eye className="h-3 w-3" />
                <span>{showPreview ? 'View Raw' : 'View Table'}</span>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={onCopy}
              className="h-7 text-[10px] px-2.5 rounded-lg flex items-center gap-1"
            >
              {hasCopied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
              <span>{hasCopied ? 'Copied' : 'Copy'}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onDownload}
              className="h-7 text-[10px] px-2.5 rounded-lg flex items-center gap-1"
            >
              <Download className="h-3 w-3" />
              <span>Download</span>
            </Button>
          </div>
        </div>

        {showPreview && previewHeaders.length > 0 ? (
          /* Table preview rendering */
          <div className="border border-border rounded-xl overflow-x-auto bg-card max-h-72">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border font-bold">
                  {previewHeaders.map((h, i) => (
                    <th key={i} className="px-3 py-2 border-r border-border/40 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewRows.map((row, rIdx) => (
                  <tr key={rIdx} className="border-b border-border/40 hover:bg-muted/10">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-3 py-2 border-r border-border/40 truncate max-w-xs">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="bg-muted/20 px-3 py-1.5 border-t border-border text-[10px] text-muted-foreground text-center">
              Displaying first 10 rows preview. Download full file to view all rows.
            </div>
          </div>
        ) : (
          /* Raw textarea rendering */
          <div className="relative rounded-xl border border-border bg-card shadow-xs overflow-hidden">
            <pre className="p-4 text-xs font-mono text-foreground overflow-auto max-h-72 select-all whitespace-pre-wrap break-all min-h-64 text-left">
              <code>{textResult}</code>
            </pre>
          </div>
        )}
      </div>
    );
  }

  // Render Image / File Output (For PNG to JPG zip packaging)
  const isBlob = result instanceof Blob;
  return (
    <div className="space-y-4 text-center w-full min-h-64 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-6">
      {isBlob ? (
        <div className="space-y-4 flex flex-col items-center">
          <div className="h-16 w-16 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 flex items-center justify-center">
            <Check className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-foreground">Conversion Successful!</p>
            <p className="text-xs text-muted-foreground">
              Processed File Size: {((result as Blob).size / 1024).toFixed(1)} KB
            </p>
          </div>
          <Button variant="primary" onClick={onDownload} className="rounded-xl flex items-center gap-2 px-6">
            <Download className="h-4.5 w-4.5" />
            <span>Download JPEG Results</span>
          </Button>
        </div>
      ) : (
        <div className="space-y-4 flex flex-col items-center">
          <div className="h-16 w-16 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 flex items-center justify-center">
            <Check className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-foreground">Batch Conversion Completed!</p>
            <p className="text-xs text-muted-foreground">
              Compiled {Array.isArray(result) ? result.length : 0} files.
            </p>
          </div>
          <Button variant="primary" onClick={onDownload} className="rounded-xl flex items-center gap-2 px-6">
            <Download className="h-4.5 w-4.5" />
            <span>Download ZIP Archive</span>
          </Button>
        </div>
      )}
    </div>
  );
}
