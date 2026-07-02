import React from 'react';
import { HelpCircle, RefreshCw } from 'lucide-react';

interface ConverterFormulaProps {
  formula?: string;
  fromUnit?: string;
  toUnit?: string;
}

export function ConverterFormula({ formula, fromUnit, toUnit }: ConverterFormulaProps) {
  if (!formula) return null;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-3 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10" />
      
      <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
        <HelpCircle className="h-4.5 w-4.5 text-primary" />
        <span>Conversion Formula</span>
      </h3>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/30 p-4 rounded-xl border border-border/50">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Active Formula</p>
          <p className="text-sm font-semibold text-foreground">
            Multiply the value in <span className="text-primary font-bold">{fromUnit}</span> by the conversion factor.
          </p>
        </div>
        
        <div className="flex items-center gap-3 bg-card px-4 py-2.5 rounded-lg border border-border shadow-xs shrink-0 self-start sm:self-center">
          <RefreshCw className="h-4 w-4 text-primary animate-pulse" />
          <span className="text-sm font-mono font-bold text-foreground">{formula}</span>
        </div>
      </div>
    </div>
  );
}
