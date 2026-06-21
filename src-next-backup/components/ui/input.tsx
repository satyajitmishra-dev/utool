"use client";

import React from "react";
import { cn } from "@/utils/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export function Input({
  label,
  error,
  icon,
  className,
  id,
  ...props
}: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={id}
          className="block text-body-s font-medium text-foreground"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground">
            {icon}
          </div>
        )}
        <input
          id={id}
          className={cn(
            "block w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground shadow-sm",
            "transition-all duration-200",
            "focus:border-primary focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring)_/_0.2)]",
            icon && "pl-11",
            error && "border-error focus:border-error focus:ring-error/20",
            className
          )}
          suppressHydrationWarning
          {...props}
        />
      </div>
      {error && (
        <p className="text-caption text-error">{error}</p>
      )}
    </div>
  );
}
