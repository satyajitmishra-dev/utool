"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { FileText, FileArchive, Code, Image as ImageIcon, Cpu, Sparkles } from "lucide-react";
import { cn } from "@/utils/cn";

// Interface for live feed events
interface LiveEvent {
  id: string;
  tool: string;
  time: string;
  color: string;
}

// Orbital card configuration
const orbitalCards = [
  {
    label: "Convert",
    icon: FileText,
    color: "red",
    borderColor: "border-red-500/20",
    bgColor: "bg-red-500/10",
    textColor: "text-red-400",
    glowColor: "rgba(239, 68, 68, 0.3)",
    angle: 315, // Top Left
  },
  {
    label: "Compress",
    icon: FileArchive,
    color: "emerald",
    borderColor: "border-emerald-500/20",
    bgColor: "bg-emerald-500/10",
    textColor: "text-emerald-400",
    glowColor: "rgba(16, 185, 129, 0.3)",
    angle: 45, // Top Right
  },
  {
    label: "Format",
    icon: Code,
    color: "blue",
    borderColor: "border-blue-500/20",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-400",
    glowColor: "rgba(59, 130, 246, 0.3)",
    angle: 225, // Bottom Left
  },
  {
    label: "Build",
    icon: ImageIcon,
    color: "amber",
    borderColor: "border-amber-500/20",
    bgColor: "bg-amber-500/10",
    textColor: "text-amber-400",
    glowColor: "rgba(245, 158, 11, 0.3)",
    angle: 135, // Bottom Right
  },
];

export function WorkspaceCoreVisual() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse tilt tracking
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const tiltX = useSpring(y, { stiffness: 80, damping: 20 });
  const tiltY = useSpring(x, { stiffness: 80, damping: 20 });

  // Map tilt values to 3D rotation degrees
  const rotateX = useTransform(tiltX, [-0.5, 0.5], [18, -18]);
  const rotateY = useTransform(tiltY, [-0.5, 0.5], [-18, 18]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relativeX = (e.clientX - rect.left) / rect.width - 0.5;
    const relativeY = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(relativeX);
    y.set(relativeY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Orbital radius
  const ORBIT_RADIUS = 150;

  // Recent simulated events feed
  const [feed, setFeed] = useState<LiveEvent[]>([
    { id: "1", tool: "PDF Compressed locally", time: "2s ago", color: "text-red-400" },
    { id: "2", tool: "QR Code Customizer built", time: "4s ago", color: "text-emerald-400" },
    { id: "3", tool: "Image resized in client", time: "7s ago", color: "text-amber-400" },
    { id: "4", tool: "JS formatted via WASM", time: "11s ago", color: "text-blue-400" },
  ]);

  useEffect(() => {
    const feedsList = [
      { tool: "PDF Merge completed", color: "text-red-400" },
      { tool: "Short Link activated", color: "text-purple-400" },
      { tool: "WebP conversion done", color: "text-amber-400" },
      { tool: "JSON verified & cleaned", color: "text-blue-400" },
      { tool: "SVG optimized locally", color: "text-cyan-400" },
      { tool: "PNG converted to WebP", color: "text-orange-400" },
      { tool: "Markdown exported to PDF", color: "text-red-400" },
    ];

    const interval = setInterval(() => {
      const randomFeedItem = feedsList[Math.floor(Math.random() * feedsList.length)];
      setFeed((prev) => [
        {
          id: Date.now().toString(),
          tool: randomFeedItem.tool,
          time: "Just now",
          color: randomFeedItem.color,
        },
        ...prev.slice(0, 3).map((item) => {
          if (item.time === "Just now") return { ...item, time: "2s ago" };
          if (item.time === "2s ago") return { ...item, time: "5s ago" };
          return { ...item, time: "10s ago" };
        }),
      ]);
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex flex-col items-center justify-center w-full min-h-[520px] select-none"
      style={{ perspective: 1200 }}
    >
      {/* Background Radial Glow — Larger and more prominent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/12 blur-[160px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-purple-500/15 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full bg-indigo-500/20 blur-[80px] pointer-events-none" />

      {/* Main 3D Canvas Container */}
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative w-[480px] h-[480px] flex items-center justify-center"
      >
        {/* Core SVG Glow Tracks (Orbit paths + connecting lines) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 480 480">
          {/* Outer orbit */}
          <circle cx="240" cy="240" r={ORBIT_RADIUS} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          {/* Inner orbit */}
          <circle cx="240" cy="240" r={ORBIT_RADIUS * 0.65} fill="none" stroke="rgba(139,92,246,0.06)" strokeWidth="1" strokeDasharray="4 6" />

          {/* Glowing connection lines from center to each card */}
          {orbitalCards.map((card, i) => {
            const rad = (card.angle * Math.PI) / 180;
            const endX = 240 + Math.cos(rad) * ORBIT_RADIUS;
            const endY = 240 + Math.sin(rad) * ORBIT_RADIUS;
            return (
              <path
                key={`line-${i}`}
                d={`M 240 240 L ${endX} ${endY}`}
                stroke={`url(#orbital-gradient-${i})`}
                strokeWidth="1.5"
                strokeDasharray="3 4"
                opacity="0.6"
              />
            );
          })}

          <defs>
            <linearGradient id="orbital-gradient-0" x1="50%" y1="50%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--color-primary))" stopOpacity="0.6" />
              <stop offset="100%" stopColor="rgba(239,68,68,0.4)" />
            </linearGradient>
            <linearGradient id="orbital-gradient-1" x1="50%" y1="50%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--color-primary))" stopOpacity="0.6" />
              <stop offset="100%" stopColor="rgba(16,185,129,0.4)" />
            </linearGradient>
            <linearGradient id="orbital-gradient-2" x1="50%" y1="50%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--color-primary))" stopOpacity="0.6" />
              <stop offset="100%" stopColor="rgba(59,130,246,0.4)" />
            </linearGradient>
            <linearGradient id="orbital-gradient-3" x1="50%" y1="50%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--color-primary))" stopOpacity="0.6" />
              <stop offset="100%" stopColor="rgba(245,158,11,0.4)" />
            </linearGradient>
          </defs>
        </svg>

        {/* Orbiting Particles */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            animate={{ rotateZ: [0, 360] }}
            transition={{
              duration: 18 + i * 3,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div
              style={{
                transform: `translateX(${120 + (i % 4) * 20}px)`,
                opacity: 0.25 + (i % 4) * 0.08,
              }}
              className="h-1 w-1 rounded-full bg-purple-400 blur-[0.5px] shadow-[0_0_8px_rgba(139,92,246,0.8)]"
            />
          </motion.div>
        ))}

        {/* Orbiting Floating Tool Cards */}
        {orbitalCards.map((card, i) => {
          const Icon = card.icon;
          const rad = (card.angle * Math.PI) / 180;
          const posX = Math.cos(rad) * ORBIT_RADIUS;
          const posY = Math.sin(rad) * ORBIT_RADIUS;
          const floatDuration = 3.8 + i * 0.5;
          const floatDelay = i * 0.4;

          return (
            // Wrapper div handles orbital positioning — Framer Motion must not touch this transform
            <div
              key={card.label}
              className="absolute z-20"
              style={{
                left: "50%",
                top: "50%",
                transform: `translate(-50%, -50%) translate3d(${posX}px, ${posY}px, 40px)`,
              }}
            >
              {/* Inner motion.div handles float animation + hover only */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: [0, i % 2 === 0 ? -12 : 12, 0],
                }}
                transition={{
                  opacity: { duration: 0.6, delay: 0.5 + i * 0.15 },
                  scale: { duration: 0.6, delay: 0.5 + i * 0.15 },
                  y: { duration: floatDuration, repeat: Infinity, ease: "easeInOut", delay: floatDelay },
                }}
                whileHover={{
                  y: -8,
                  scale: 1.04,
                  transition: { type: "spring", stiffness: 300, damping: 20 },
                }}
                className={cn(
                  "flex items-center gap-2.5",
                  "rounded-2xl border bg-card/60 backdrop-blur-xl",
                  "px-4 py-3 cursor-pointer",
                  "shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
                  "hover:shadow-[0_12px_40px_rgba(139,92,246,0.25)]",
                  "transition-shadow duration-300",
                  card.borderColor
                )}
              >
                <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", card.bgColor, card.textColor)}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-xs font-bold text-foreground tracking-tight">{card.label}</span>
              </motion.div>
            </div>
          );
        })}


        {/* The Core Machine Element */}
        <div
          className="absolute z-30"
          style={{
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%) translateZ(80px)",
          }}
        >
          {/* Multi-layer glow */}
          <div className="absolute inset-0 rounded-3xl bg-purple-500/30 blur-[50px] animate-pulse" />
          <div className="absolute -inset-4 rounded-3xl bg-indigo-500/15 blur-[30px]" />

          <div className="relative flex flex-col items-center justify-center h-40 w-40 rounded-3xl border border-white/10 bg-card/80 backdrop-blur-2xl shadow-[0_0_80px_rgba(139,92,246,0.4),inset_0_1px_0_rgba(255,255,255,0.05)] overflow-hidden group">
            {/* Gradient border effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 pointer-events-none" />

            {/* Status Dots */}
            <div className="absolute top-3 left-4 right-4 flex justify-between items-center z-10">
              <div className="h-2 w-2 rounded-full bg-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
              <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse" />
            </div>

            {/* Core Icon */}
            <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_8px_32px_rgba(99,102,241,0.5)] group-hover:scale-105 transition-transform duration-500">
              <Cpu className="h-8 w-8 text-white" />
            </div>

            {/* Label */}
            <div className="absolute bottom-4 z-10 text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-background/50 px-2.5 py-0.5 rounded-full border border-white/5">
              WASM Engine
            </div>
          </div>
        </div>
      </motion.div>

      {/* Active Conversion Live Feed Layer */}
      <div className="w-full max-w-sm mt-6 p-4 rounded-2xl border border-white/5 bg-card/40 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.2)] relative overflow-hidden">
        {/* Floating background gradient light */}
        <div className="absolute top-0 right-0 h-16 w-16 bg-purple-500/5 blur-xl" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2.5">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Engine Activity</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Sparkles className="h-3 w-3 text-amber-400" />
            <span>Client Execution Only</span>
          </div>
        </div>

        {/* Live List Items */}
        <div className="space-y-2 h-[104px] overflow-hidden relative">
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-card/85 to-transparent pointer-events-none z-10" />
          {feed.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center justify-between text-body-s"
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground text-[12px]">{item.tool}</span>
              </div>
              <span className="text-[10px] text-muted-foreground/80">{item.time}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
