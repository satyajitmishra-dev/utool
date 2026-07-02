import React from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';

export interface ExampleItem {
  title: string;
  description: string;
  input: string;
  output: string;
  fromUnit?: string;
  toUnit?: string;
}

interface ConverterExamplesProps {
  examples: ExampleItem[];
  onSelectExample?: (value: string, fromUnit?: string, toUnit?: string) => void;
}

export function ConverterExamples({ examples, onSelectExample }: ConverterExamplesProps) {
  if (!examples || examples.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-primary" />
        <span>Practical Examples</span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {examples.map((ex, idx) => (
          <div
            key={idx}
            onClick={() => onSelectExample && onSelectExample(ex.input, ex.fromUnit, ex.toUnit)}
            className={`p-5 rounded-2xl border border-border bg-card shadow-xs transition-all duration-200 text-left space-y-2
              ${onSelectExample ? 'hover:border-primary/45 hover:shadow-sm cursor-pointer hover:bg-muted/10' : ''}`}
          >
            <div className="flex justify-between items-start">
              <h4 className="text-sm font-bold text-foreground">{ex.title}</h4>
              {onSelectExample && (
                <span className="text-[10px] uppercase font-bold text-primary px-2 py-0.5 rounded-full bg-primary/10">
                  Try it
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{ex.description}</p>
            
            <div className="flex items-center gap-2.5 pt-2 text-xs font-mono font-semibold text-primary">
              <span>{ex.input} {ex.fromUnit}</span>
              <ArrowRight className="h-3 w-3" />
              <span>{ex.output} {ex.toUnit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
