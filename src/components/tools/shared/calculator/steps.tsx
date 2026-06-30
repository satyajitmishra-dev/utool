"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Layers } from "lucide-react";
import { cn } from "@/utils/cn";

interface CalculationStepsProps {
  steps: string[];
}

export function CalculationSteps({ steps }: CalculationStepsProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (steps.length === 0) return null;

  return (
    <div className="border border-border/60 rounded-3xl p-5 bg-card shadow-xs space-y-4 print:border-none print:shadow-none print:p-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-sm font-bold text-foreground focus:outline-none select-none print:pointer-events-none"
      >
        <div className="flex items-center gap-2">
          <Layers className="h-4.5 w-4.5 text-primary print:hidden" />
          <span>Step-by-Step Calculation</span>
        </div>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground print:hidden" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground print:hidden" />
        )}
      </button>

      {isOpen && (
        <ol className="space-y-3.5 pl-1.5 pt-1">
          {steps.map((step, idx) => (
            <li key={idx} className="flex gap-4 items-start text-xs text-muted-foreground leading-relaxed">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                {idx + 1}
              </span>
              <span className="pt-0.5 whitespace-pre-line">{step}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
export default CalculationSteps;
