"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/utils/cn";

interface MagneticProps {
  children: React.ReactNode;
  className?: string;
  range?: number; // How far the magnetic effect reaches
  strength?: number; // How strong the pull is
}

export function Magnetic({
  children,
  className,
  range = 60,
  strength = 0.35,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for premium physical motion feel
  const springConfig = { stiffness: 120, damping: 15, mass: 0.6 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    if (distance < range) {
      // Pull toward mouse
      x.set(distanceX * strength);
      y.set(distanceY * strength);
    } else {
      // Return to center
      x.set(0);
      y.set(0);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={cn("relative inline-block", className)}
    >
      {children}
    </motion.div>
  );
}

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  glow?: boolean;
}

export function MagneticButton({
  children,
  className,
  variant = "primary",
  glow = false,
  ...props
}: MagneticButtonProps) {
  return (
    <Magnetic>
      <button
        className={cn(
          "relative flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-body-s font-semibold tracking-wide transition-all duration-300 active:scale-95 cursor-pointer",
          variant === "primary" && 
            "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg hover:shadow-primary/30",
          variant === "secondary" && 
            "bg-card hover:bg-muted border border-border text-foreground hover:border-muted-foreground/30 shadow-sm",
          variant === "outline" && 
            "border border-primary/40 bg-transparent text-primary hover:bg-primary/5",
          variant === "ghost" && 
            "bg-transparent text-foreground hover:bg-muted/40",
          glow && "shadow-[0_0_25px_rgba(99,102,241,0.25)] hover:shadow-[0_0_35px_rgba(99,102,241,0.4)]",
          className
        )}
        {...props}
      >
        {children}
      </button>
    </Magnetic>
  );
}
