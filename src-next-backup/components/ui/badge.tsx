"use client";

import React from "react";
import { cn } from "@/utils/cn";

type BadgeVariant = "default" | "primary" | "success" | "warning" | "error" | "pro" | "beta" | "outline";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    "bg-muted text-muted-foreground border-border",
  primary:
    "bg-[hsl(var(--ring)_/_0.1)] text-primary border-[hsl(var(--ring)_/_0.2)]",
  success:
    "bg-[hsl(var(--color-success)_/_0.1)] text-success border-[hsl(var(--color-success)_/_0.2)]",
  warning:
    "bg-[hsl(var(--color-warning)_/_0.1)] text-warning border-[hsl(var(--color-warning)_/_0.2)]",
  error:
    "bg-[hsl(var(--color-error)_/_0.1)] text-error border-[hsl(var(--color-error)_/_0.2)]",
  pro:
    "bg-[hsl(var(--color-warning)_/_0.1)] text-warning border-[hsl(var(--color-warning)_/_0.2)]",
  beta:
    "bg-[hsl(var(--color-secondary)_/_0.1)] text-secondary border-[hsl(var(--color-secondary)_/_0.2)]",
  outline:
    "bg-transparent text-muted-foreground border-border",
};

export function Badge({ variant = "default", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
