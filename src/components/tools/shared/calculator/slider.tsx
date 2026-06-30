"use client";

import React from "react";
import { cn } from "@/utils/cn";

interface CalculatorSliderProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min: number;
  max: number;
  step?: number;
  suffixText?: string;
  prefixText?: string;
  helperText?: string;
}

export function CalculatorSlider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  suffixText = "",
  prefixText = "",
  helperText,
}: CalculatorSliderProps) {
  return (
    <div className="space-y-2 w-full print:hidden">
      <div className="flex justify-between items-center">
        <label className="text-xs font-bold text-foreground">{label}</label>
        <span className="text-xs font-bold text-primary bg-primary/5 px-2.5 py-0.5 rounded-full border border-primary/10">
          {prefixText}
          {value.toLocaleString()}
          {suffixText}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {helperText && <p className="text-[10px] text-muted-foreground">{helperText}</p>}
    </div>
  );
}
export default CalculatorSlider;
