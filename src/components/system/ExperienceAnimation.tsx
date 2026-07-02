"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Spring presets
export const SPRING_TRANSITION = {
  type: "spring" as const,
  stiffness: 300,
  damping: 25,
  mass: 0.5,
};


// Slide Up Fade In Container
export function SlideUp({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ...SPRING_TRANSITION, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Fade In Scale Container
export function ScaleIn({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ ...SPRING_TRANSITION, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Hover Spring Magnet effect
export function FloatItem({ children, speed = 4, range = 10, className }: { children: React.ReactNode; speed?: number; range?: number; className?: string }) {
  return (
    <motion.div
      animate={{
        y: [range, -range, range],
      }}
      transition={{
        duration: speed,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Parallax tracking hook & component
export function ParallaxItem({
  children,
  offset = 20,
  className,
}: {
  children: React.ReactNode;
  offset?: number;
  className?: string;
}) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const x = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const y = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      setCoords({ x: x * offset, y: y * offset });
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [offset]);

  return (
    <motion.div
      animate={{ x: coords.x, y: coords.y }}
      transition={{ type: "spring", stiffness: 150, damping: 20 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Konami Code detector hook
export function useKonamiCode(onUnlock: () => void) {
  const codeRef = useRef<string[]>([]);
  const targetCode = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      codeRef.current.push(e.key);
      // Keep only matching length
      codeRef.current = codeRef.current.slice(-targetCode.length);
      
      const isMatch = codeRef.current.every((key, idx) => key.toLowerCase() === targetCode[idx].toLowerCase());
      if (isMatch) {
        onUnlock();
        codeRef.current = []; // Clear key history
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onUnlock]);
}

// Self-contained Canvas Confetti Emitter
interface ConfettiParticle {
  x: number;
  y: number;
  radius: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  velocityX: number;
  velocityY: number;
}

export function CanvasConfetti({ active, duration = 3000 }: { active: boolean; duration?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showCanvas, setShowCanvas] = useState(false);

  useEffect(() => {
    if (!active) return;
    setShowCanvas(true);
    const timeout = setTimeout(() => setShowCanvas(false), duration);
    return () => clearTimeout(timeout);
  }, [active, duration]);

  useEffect(() => {
    if (!showCanvas || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const colors = ["#6366f1", "#a855f7", "#ec4899", "#ef4444", "#10b981", "#f59e0b", "#3b82f6"];
    const particles: ConfettiParticle[] = [];

    // Create particles from bottom corners upwards
    for (let i = 0; i < 150; i++) {
      const fromLeft = Math.random() > 0.5;
      particles.push({
        x: fromLeft ? 0 : width,
        y: height,
        radius: Math.random() * 5 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 8 - 4,
        velocityX: (fromLeft ? 1 : -1) * (Math.random() * 12 + 6),
        velocityY: -(Math.random() * 15 + 10),
      });
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      let alive = false;
      particles.forEach((p) => {
        // Gravity
        p.velocityY += 0.35;
        p.velocityX *= 0.98; // Air resistance
        p.x += p.velocityX;
        p.y += p.velocityY;
        p.rotation += p.rotationSpeed;

        if (p.y < height + 50 && p.x > -50 && p.x < width + 50) {
          alive = true;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        // Draw confetti rectangle
        ctx.fillRect(-p.radius, -p.radius / 1.5, p.radius * 2, p.radius * 1.3);
        ctx.restore();
      });

      if (alive) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        setShowCanvas(false);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [showCanvas]);

  return (
    <AnimatePresence>
      {showCanvas && (
        <motion.canvas
          ref={canvasRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 pointer-events-none w-screen h-screen"
        />
      )}
    </AnimatePresence>
  );
}
