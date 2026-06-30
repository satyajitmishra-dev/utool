"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ShieldCheck } from "lucide-react";

interface CalculatorHeaderProps {
  title: string;
  description: string;
}

export function CalculatorHeader({ title, description }: CalculatorHeaderProps) {
  return (
    <div className="border-b border-border pb-4 space-y-2 print:hidden">
      <div className="flex flex-wrap gap-2">
        <Badge variant="primary" className="inline-flex items-center gap-1 bg-purple-50 text-purple-600 border border-purple-100 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/30">
          <Sparkles className="h-3 w-3" /> Free Tool
        </Badge>
        <Badge variant="success" className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30">
          <ShieldCheck className="h-3 w-3" /> 100% Secure & Client-Side
        </Badge>
      </div>
      <h2 className="text-h2 font-extrabold text-foreground tracking-tight">{title}</h2>
      <p className="text-body-s text-muted-foreground mt-0.5">{description}</p>
    </div>
  );
}
export default CalculatorHeader;
