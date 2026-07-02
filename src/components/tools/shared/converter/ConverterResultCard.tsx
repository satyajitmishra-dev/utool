import React from 'react';
import { FileText, CheckCircle } from 'lucide-react';

interface ConverterResultCardProps {
  filename: string;
  sizeString: string;
  onRemove?: () => void;
  status?: 'pending' | 'success' | 'error';
}

export function ConverterResultCard({
  filename,
  sizeString,
  status = 'success',
}: ConverterResultCardProps) {
  return (
    <div className="flex items-center justify-between border border-border bg-card p-3 rounded-xl shadow-xs text-left gap-3">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="h-8 w-8 rounded-lg bg-primary/5 text-primary flex items-center justify-center shrink-0">
          <FileText className="h-4.5 w-4.5" />
        </div>
        <div className="min-w-0 space-y-0.5">
          <p className="text-xs font-bold text-foreground truncate max-w-[180px] sm:max-w-[240px]">
            {filename}
          </p>
          <p className="text-[10px] text-muted-foreground font-mono">{sizeString}</p>
        </div>
      </div>

      <div className="shrink-0 flex items-center gap-2">
        {status === 'success' && (
          <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-900/30">
            <CheckCircle className="h-3 w-3" />
            <span>Ready</span>
          </div>
        )}
      </div>
    </div>
  );
}
