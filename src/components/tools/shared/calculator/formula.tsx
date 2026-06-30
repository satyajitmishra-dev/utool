"use client";

import React, { useState } from "react";
import { HelpCircle, Info, ChevronDown, ChevronUp } from "lucide-react";

interface VariableExplanation {
  variable: string;
  name: string;
  desc: string;
}

interface FormulaCardProps {
  formula: string;
  variables: VariableExplanation[];
  workedExample: {
    expression: string;
    result: string;
    explanation: string;
  };
}

export function FormulaCard({ formula, variables, workedExample }: FormulaCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-border/60 rounded-3xl p-5 bg-card shadow-xs space-y-4 print:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-sm font-bold text-foreground focus:outline-none select-none"
      >
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4.5 w-4.5 text-primary" />
          <span>Formula Transparency</span>
        </div>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {isOpen && (
        <div className="space-y-4 pt-1 border-t border-border/50 mt-2">
          {/* Formula Display Box */}
          <div className="flex flex-col items-center justify-center p-4 bg-muted/20 border border-border/50 rounded-2xl text-center">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
              Mathematical Formula
            </span>
            <div className="text-sm font-black text-foreground font-mono bg-card px-4 py-2 rounded-xl border border-border/40 select-all">
              {formula}
            </div>
          </div>

          {/* Variables Explanatory List */}
          {variables.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-foreground">Variable Breakdown</span>
              <div className="grid grid-cols-1 gap-2.5">
                {variables.map((v, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs leading-relaxed">
                    <span className="font-mono font-bold text-primary bg-primary/5 border border-primary/10 px-2 py-0.5 rounded-lg shrink-0">
                      {v.variable}
                    </span>
                    <div>
                      <span className="font-bold text-foreground">{v.name}: </span>
                      <span className="text-muted-foreground">{v.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Worked Example */}
          <div className="space-y-2 border-t border-border/50 pt-3.5">
            <span className="text-xs font-bold text-foreground">Worked Example</span>
            <div className="p-3.5 bg-primary/5 border border-primary/10 rounded-2xl space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-primary">Calculation:</span>
                <span className="font-mono font-bold text-foreground">{workedExample.expression}</span>
              </div>
              <div className="flex justify-between items-center text-xs border-t border-primary/10 pt-2">
                <span className="font-semibold text-primary">Result:</span>
                <span className="font-bold text-foreground">{workedExample.result}</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed pt-1 border-t border-primary/10">
                {workedExample.explanation}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default FormulaCard;
