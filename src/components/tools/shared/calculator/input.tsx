"use client";

import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

interface CalculatorInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label: string;
  helperText?: string;
  exampleValue?: string | number;
  onExampleClick?: (val: any) => void;
  prefixText?: string;
  suffixText?: string;
  error?: string;
  onChange?: (val: number | string) => void;
}

export const CalculatorInput = forwardRef<HTMLInputElement, CalculatorInputProps>(
  (
    {
      label,
      helperText,
      exampleValue,
      onExampleClick,
      prefixText,
      suffixText,
      error,
      className,
      onChange,
      id,
      type = "text",
      ...props
    },
    ref
  ) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (type === "number") {
        const parsed = parseFloat(val);
        onChange?.(isNaN(parsed) ? "" : parsed);
      } else {
        onChange?.(val);
      }
    };

    return (
      <div className="space-y-1.5 w-full print:hidden">
        <div className="flex justify-between items-center">
          <label htmlFor={id} className="block text-xs font-bold text-foreground">
            {label}
          </label>
          {exampleValue !== undefined && onExampleClick && (
            <button
              type="button"
              onClick={() => onExampleClick(exampleValue)}
              className="text-[10px] font-bold text-primary hover:underline"
            >
              Example: {exampleValue}
            </button>
          )}
        </div>

        <div className="relative rounded-xl shadow-xs">
          {prefixText && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-xs font-bold text-muted-foreground">
              {prefixText}
            </div>
          )}
          <input
            id={id}
            type={type}
            ref={ref}
            onChange={handleInputChange}
            className={cn(
              "block w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
              prefixText && "pl-10",
              suffixText && "pr-14",
              error && "border-error focus:border-error focus:ring-error/20",
              className
            )}
            {...props}
          />
          {suffixText && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-xs font-bold text-muted-foreground bg-muted/30 border-l border-border px-3 rounded-r-xl">
              {suffixText}
            </div>
          )}
        </div>

        {helperText && !error && (
          <p className="text-[10px] text-muted-foreground">{helperText}</p>
        )}
        {error && <p className="text-[10px] font-semibold text-error">{error}</p>}
      </div>
    );
  }
);

CalculatorInput.displayName = "CalculatorInput";
export default CalculatorInput;
