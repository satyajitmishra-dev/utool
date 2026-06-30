"use client";

import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

interface SelectOption {
  label: string;
  value: string;
}

interface CalculatorSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  label: string;
  options: SelectOption[];
  helperText?: string;
  error?: string;
  onChange?: (val: string) => void;
}

export const CalculatorSelect = forwardRef<HTMLSelectElement, CalculatorSelectProps>(
  ({ label, options, helperText, error, className, onChange, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5 w-full print:hidden">
        <label htmlFor={id} className="block text-xs font-bold text-foreground">
          {label}
        </label>

        <div className="relative">
          <select
            id={id}
            ref={ref}
            onChange={(e) => onChange?.(e.target.value)}
            className={cn(
              "block w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer",
              error && "border-error focus:border-error focus:ring-error/20",
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground">
            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {helperText && !error && (
          <p className="text-[10px] text-muted-foreground">{helperText}</p>
        )}
        {error && <p className="text-[10px] font-semibold text-error">{error}</p>}
      </div>
    );
  }
);

CalculatorSelect.displayName = "CalculatorSelect";
export default CalculatorSelect;
