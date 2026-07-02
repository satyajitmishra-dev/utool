import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConverterErrorProps {
  message: string;
  onRetry?: () => void;
  title?: string;
}

export function ConverterError({
  message,
  onRetry,
  title = 'Something went wrong',
}: ConverterErrorProps) {
  return (
    <div className="rounded-2xl border border-error/20 bg-error/5 p-6 text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex gap-3 items-start">
        <AlertCircle className="h-5 w-5 text-error shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-error">{title}</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">{message}</p>
        </div>
      </div>

      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="text-xs font-bold border-error/20 text-error hover:bg-error/5 flex items-center gap-1.5 self-start sm:self-center shrink-0"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Try Again</span>
        </Button>
      )}
    </div>
  );
}
