"use client";

import React from "react";
import { cn } from "@/utils/cn";
import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "premium" | "destructive";
type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:opacity-90 shadow-sm",
  secondary:
    "bg-muted text-foreground hover:bg-muted/80 border border-border",
  ghost:
    "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
  outline:
    "bg-transparent text-foreground border border-border hover:bg-muted",
  premium:
    "bg-[image:var(--gradient-primary)] text-white hover:opacity-90 shadow-lg shadow-primary/20",
  destructive:
    "bg-error text-white hover:opacity-90 shadow-sm",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-lg",
  md: "h-10 px-5 text-sm gap-2 rounded-xl",
  lg: "h-12 px-7 text-[15px] gap-2.5 rounded-xl",
  icon: "h-10 w-10 rounded-xl",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-semibold transition-all duration-200 focus-ring",
        "active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled || loading}
      suppressHydrationWarning
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
