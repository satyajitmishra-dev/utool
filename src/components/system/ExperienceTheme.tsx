"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/utils/cn";

export interface ExperienceThemeProps {
  variant?: "primary" | "premium" | "warning" | "error" | "purple" | "indigo" | "cool";
  children: React.ReactNode;
  className?: string;
}

export const GRADIENTS = {
  primary: "from-[hsl(var(--color-primary))] to-[hsl(var(--color-secondary))]",
  premium: "from-[hsl(var(--color-primary))] via-[hsl(var(--color-secondary))] to-[hsl(var(--color-accent))]",
  warning: "from-[hsl(var(--color-warning))] to-amber-500",
  error: "from-[hsl(var(--color-error))] to-rose-600",
  purple: "from-purple-600 via-fuchsia-500 to-pink-500",
  indigo: "from-indigo-600 via-blue-500 to-cyan-500",
  cool: "from-emerald-500 via-teal-500 to-cyan-600",
};

export const GLOW_COLORS = {
  primary: "bg-[hsl(var(--color-primary)_/_0.08)]",
  premium: "bg-[hsl(var(--color-accent)_/_0.08)]",
  warning: "bg-[hsl(var(--color-warning)_/_0.08)]",
  error: "bg-[hsl(var(--color-error)_/_0.08)]",
  purple: "bg-purple-500/10",
  indigo: "bg-indigo-500/10",
  cool: "bg-emerald-500/10",
};

export function ExperienceTheme({
  variant = "primary",
  children,
  className,
}: ExperienceThemeProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 40, stiffness: 200, mass: 0.5 };
  const trailX = useSpring(mouseX, springConfig);
  const trailY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = clientX - window.innerWidth / 2;
      const y = clientY - window.innerHeight / 2;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Floating particles
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; delay: number }[]>([]);

  useEffect(() => {
    // Generate static positions on mount to avoid hydration mismatch
    const generated = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 2,
      delay: Math.random() * 5,
    }));
    setParticles(generated);
  }, []);

  return (
    <div
      className={cn(
        "relative min-h-screen w-full overflow-hidden bg-background text-foreground transition-colors duration-300 select-none",
        className
      )}
    >
      {/* Dynamic Background Ambient Glow (Parallax tracking) */}
      <motion.div
        style={{
          x: trailX,
          y: trailY,
        }}
        className={cn(
          "absolute -top-[200px] -left-[200px] right-0 bottom-0 m-auto h-[600px] w-[600px] rounded-full blur-[120px] -z-10 pointer-events-none transition-colors duration-500",
          GLOW_COLORS[variant]
        )}
      />
      <div className="absolute top-[20%] left-[10%] h-[400px] w-[400px] rounded-full bg-[hsl(var(--color-primary)_/_0.03)] blur-3xl -z-20 pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] h-[500px] w-[500px] rounded-full bg-[hsl(var(--color-secondary)_/_0.03)] blur-3xl -z-20 pointer-events-none" />

      {/* Floating Particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ y: "100vh", opacity: 0 }}
            animate={{
              y: "-10vh",
              opacity: [0, 0.4, 0.4, 0],
              x: `${p.x}vw`,
            }}
            transition={{
              duration: 20 + Math.random() * 15,
              repeat: Infinity,
              delay: p.delay,
              ease: "linear",
            }}
            style={{
              left: 0,
              width: p.size,
              height: p.size,
            }}
            className="absolute rounded-full bg-foreground/10"
          />
        ))}
      </div>

      {/* Grid Pattern overlay */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)_/_0.15)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)_/_0.15)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none -z-10" 
      />

      {/* Main Content */}
      <div className="relative z-10 w-full min-h-screen flex flex-col">
        {children}
      </div>
    </div>
  );
}
