"use client";

import React, { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { cn } from "@/utils/cn";

interface BentoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glowColor?: string; // e.g. "rgba(99, 102, 241, 0.15)"
}

export function BentoCard({
  children,
  className,
  glowColor = "rgba(99, 102, 241, 0.12)",
  ...props
}: BentoCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const { left, top } = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  // Create radial gradient masks mapped to cursor position
  const background = useMotionTemplate`
    radial-gradient(
      450px circle at ${mouseX}px ${mouseY}px,
      ${glowColor},
      transparent 80%
    )
  `;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "group relative overflow-hidden rounded-[2rem] border border-border/40 bg-card/45 backdrop-blur-md p-8 transition-shadow duration-500 hover:shadow-xl",
        className
      )}
      {...props}
    >
      {/* Spotlight light mask overlay */}
      <motion.div
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background }}
      />

      {/* Spotlight border overlay */}
      <motion.div
        className="pointer-events-none absolute -inset-[1px] -z-20 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              250px circle at ${mouseX}px ${mouseY}px,
              rgba(255, 255, 255, 0.08),
              transparent 70%
            )
          `,
          border: "1px solid transparent",
        }}
      />

      {/* Main card contents */}
      <div className="relative z-10 flex h-full flex-col justify-between">
        {children}
      </div>
    </div>
  );
}
