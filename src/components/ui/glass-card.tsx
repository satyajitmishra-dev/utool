"use client";

import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/utils/cn";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  variant?: "default" | "elevated" | "interactive";
  hover?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function GlassCard({
  variant = "default",
  hover = true,
  children,
  className,
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={
        hover
          ? { y: -4, transition: { type: "spring", stiffness: 400, damping: 25 } }
          : undefined
      }
      className={cn(
        "glass-card rounded-2xl",
        variant === "elevated" && "shadow-lg",
        variant === "interactive" &&
          "cursor-pointer hover:border-[hsl(var(--ring)_/_0.3)]",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
