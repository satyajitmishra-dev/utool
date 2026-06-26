"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import {
  Download,
  Video,
  Music,
  FileText,
  Sparkles,
  Maximize2,
  FileVideo,
  Image as ImageIcon,
  Camera,
  Cpu,
  User,
  FileCode,
  Type,
  Sliders,
  Play,
  Volume2,
  Sparkle
} from "lucide-react";
import { cn } from "@/utils/cn";
import { GlassCard } from "./glass-card";
import { Badge } from "./badge";

interface OrbitCard {
  label: string;
  icon: React.ComponentType<any>;
  color: string;
  borderColor: string;
  bgColor: string;
  textColor: string;
  glowColor: string;
  x: number; // orbital coordinates
  y: number;
  scale: number;
}

// 4 cards for Engine Hero
const engineCards: OrbitCard[] = [
  {
    label: "PDF Merge",
    icon: FileText,
    color: "purple",
    borderColor: "border-purple-500/20 hover:border-purple-500/50",
    bgColor: "bg-purple-500/10",
    textColor: "text-purple-400",
    glowColor: "rgba(168, 85, 247, 0.2)",
    x: -160,
    y: -120,
    scale: 1,
  },
  {
    label: "PDF Compress",
    icon: Maximize2,
    color: "indigo",
    borderColor: "border-indigo-500/20 hover:border-indigo-500/50",
    bgColor: "bg-indigo-500/10",
    textColor: "text-indigo-400",
    glowColor: "rgba(99, 102, 241, 0.2)",
    x: 160,
    y: -120,
    scale: 0.95,
  },
  {
    label: "Resume Builder",
    icon: User,
    color: "blue",
    borderColor: "border-blue-500/20 hover:border-blue-500/50",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-400",
    glowColor: "rgba(59, 130, 246, 0.2)",
    x: -150,
    y: 120,
    scale: 1.05,
  },
  {
    label: "JSON Formatter",
    icon: FileCode,
    color: "emerald",
    borderColor: "border-emerald-500/20 hover:border-emerald-500/50",
    bgColor: "bg-emerald-500/10",
    textColor: "text-emerald-400",
    glowColor: "rgba(16, 185, 129, 0.2)",
    x: 150,
    y: 120,
    scale: 0.95,
  },
];

// 6 cards for Media Hub Hero
const mediaCards: OrbitCard[] = [
  {
    label: "Downloader",
    icon: Download,
    color: "indigo",
    borderColor: "border-indigo-500/20 hover:border-indigo-500/50",
    bgColor: "bg-indigo-500/10",
    textColor: "text-indigo-400",
    glowColor: "rgba(99, 102, 241, 0.2)",
    x: -180,
    y: -140,
    scale: 1,
  },
  {
    label: "Audio Extractor",
    icon: Music,
    color: "emerald",
    borderColor: "border-emerald-500/20 hover:border-emerald-500/50",
    bgColor: "bg-emerald-500/10",
    textColor: "text-emerald-400",
    glowColor: "rgba(16, 185, 129, 0.2)",
    x: 180,
    y: -140,
    scale: 0.95,
  },
  {
    label: "GIF Creator",
    icon: ImageIcon,
    color: "pink",
    borderColor: "border-pink-500/20 hover:border-pink-500/50",
    bgColor: "bg-pink-500/10",
    textColor: "text-pink-400",
    glowColor: "rgba(236, 72, 153, 0.2)",
    x: -210,
    y: 20,
    scale: 1.05,
  },
  {
    label: "Video Converter",
    icon: FileVideo,
    color: "purple",
    borderColor: "border-purple-500/20 hover:border-purple-500/50",
    bgColor: "bg-purple-500/10",
    textColor: "text-purple-400",
    glowColor: "rgba(168, 85, 247, 0.2)",
    x: 210,
    y: 20,
    scale: 1.0,
  },
  {
    label: "Thumbnail Grabber",
    icon: Camera,
    color: "rose",
    borderColor: "border-rose-500/20 hover:border-rose-500/50",
    bgColor: "bg-rose-500/10",
    textColor: "text-rose-400",
    glowColor: "rgba(244, 63, 94, 0.2)",
    x: -160,
    y: 160,
    scale: 0.95,
  },
  {
    label: "Video Compressor",
    icon: Video,
    color: "blue",
    borderColor: "border-blue-500/20 hover:border-blue-500/50",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-400",
    glowColor: "rgba(59, 130, 246, 0.2)",
    x: 160,
    y: 160,
    scale: 1.02,
  },
];

interface ModularHeroVisualProps {
  variant: "wasm" | "media" | "ai";
}

export function ModularHeroVisual({ variant }: ModularHeroVisualProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // 3D Parallax Mouse movement
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 60, damping: 22 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 22 });

  const rotateX = useTransform(springY, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-12, 12]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex flex-col items-center justify-center w-full min-h-[580px] select-none"
      style={{ perspective: 1200 }}
    >
      {/* Background Glow Ring, animated according to theme variant */}
      <div className={cn(
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full w-[650px] h-[650px] blur-[180px] pointer-events-none transition-all duration-1000",
        variant === "wasm" && "bg-purple-500/8",
        variant === "media" && "bg-indigo-500/8",
        variant === "ai" && "bg-rose-500/8"
      )} />
      <div className={cn(
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full w-[350px] h-[350px] blur-[100px] pointer-events-none transition-all duration-1000",
        variant === "wasm" && "bg-indigo-500/10",
        variant === "media" && "bg-emerald-500/10",
        variant === "ai" && "bg-purple-500/10"
      )} />

      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative w-[500px] h-[500px] flex items-center justify-center"
      >
        <AnimatePresence mode="wait">
          {variant === "wasm" && (
            <EngineVisual key="engine" />
          )}
          {variant === "media" && (
            <MediaHubVisual key="media" />
          )}
          {variant === "ai" && (
            <AIWorkspaceVisual key="ai" springX={springX} springY={springY} />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// (1) ENGINE HERO VISUAL (Resume/PDF/Utilities)
// ═══════════════════════════════════════════════════════
function EngineVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0 flex items-center justify-center"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Central Rotating Engine Core */}
      <div className="absolute w-48 h-48 rounded-full border border-white/[0.03] flex items-center justify-center bg-card/25 backdrop-blur-xl shadow-2xl">
        {/* Animated Spin Rings */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 rounded-full border border-dashed border-indigo-500/30"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute inset-5 rounded-full border border-dotted border-purple-500/30"
        />
        <div className="absolute inset-10 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-600/20 blur-md" />
        
        {/* Central Core Emblem */}
        <div className="relative flex flex-col items-center justify-center z-10 text-center">
          <Cpu className="h-10 w-10 text-indigo-400 animate-pulse" />
          <span className="text-[10px] font-extrabold tracking-widest text-muted-foreground mt-2 uppercase">WASM core</span>
        </div>
      </div>

      {/* Orbiting Glass Cards */}
      {engineCards.map((card, idx) => {
        const CardIcon = card.icon;
        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, x: 0, y: 0 }}
            animate={{
              opacity: 1,
              x: card.x,
              y: card.y,
            }}
            transition={{
              type: "spring",
              stiffness: 80,
              damping: 15,
              delay: idx * 0.08,
            }}
            style={{
              position: "absolute",
              transformStyle: "preserve-3d",
              translateZ: 30 + idx * 10,
            }}
          >
            {/* Soft Floating Loop */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 4 + idx,
                repeat: Infinity,
                ease: "easeInOut",
                delay: idx * 0.5,
              }}
            >
              <GlassCard
                hover={true}
                className={cn(
                  "p-4 flex items-center gap-3 w-44 border bg-card/60 backdrop-blur-md transition-all shadow-[0_8px_24px_rgba(0,0,0,0.3)]",
                  card.borderColor
                )}
              >
                <div className={cn("p-2 rounded-xl shrink-0", card.bgColor, card.textColor)}>
                  <CardIcon className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-[11px] text-foreground tracking-tight whitespace-nowrap">{card.label}</h4>
                  <span className="text-[9px] text-muted-foreground/80 font-medium">Local Engine</span>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════
// (2) MEDIA HUB HERO VISUAL (Media Tools)
// ═══════════════════════════════════════════════════════
function MediaHubVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0 flex items-center justify-center"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Central Circular Media Hub */}
      <div className="absolute w-52 h-52 rounded-full border border-white/[0.03] flex items-center justify-center bg-card/25 backdrop-blur-xl shadow-2xl">
        {/* Visualizer Discs */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          className="absolute inset-1 rounded-full border border-indigo-500/20 bg-black/40"
        />
        <div className="absolute inset-4 rounded-full border border-white/5 bg-gradient-to-tr from-purple-500/10 to-indigo-500/10" />
        
        {/* Core Media Interface */}
        <div className="relative flex flex-col items-center justify-center z-10 space-y-2">
          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 shadow-glow text-primary cursor-pointer active:scale-95 transition">
            <Play className="h-4.5 w-4.5 fill-current ml-0.5" />
          </div>
          <span className="text-[9px] font-extrabold tracking-widest text-muted-foreground uppercase">Streaming Hub</span>
          {/* Animated waveform visualizer bars */}
          <div className="flex gap-0.5 items-end h-3 pt-1">
            {[3, 7, 5, 8, 4, 9, 6].map((h, i) => (
              <motion.div
                key={i}
                animate={{ height: [4, h * 2, 4] }}
                transition={{
                  duration: 0.8 + i * 0.15,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-1 bg-primary rounded-full"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Orbiting Media Cards */}
      {mediaCards.map((card, idx) => {
        const CardIcon = card.icon;
        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, x: 0, y: 0 }}
            animate={{
              opacity: 1,
              x: card.x,
              y: card.y,
            }}
            transition={{
              type: "spring",
              stiffness: 85,
              damping: 16,
              delay: idx * 0.05,
            }}
            style={{
              position: "absolute",
              transformStyle: "preserve-3d",
              translateZ: 25 + idx * 5,
            }}
          >
            {/* Slow float animation */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 3.5 + idx * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: idx * 0.4,
              }}
            >
              <GlassCard
                hover={true}
                className={cn(
                  "p-3.5 flex items-center gap-2.5 w-40 border bg-card/65 backdrop-blur-md transition-all shadow-[0_8px_24px_rgba(0,0,0,0.35)]",
                  card.borderColor
                )}
              >
                <div className={cn("p-1.5 rounded-xl shrink-0", card.bgColor, card.textColor)}>
                  <CardIcon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-extrabold text-[10.5px] text-foreground tracking-tight truncate">{card.label}</h4>
                  <span className="text-[8.5px] text-muted-foreground/80 font-medium">100% Free</span>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════
// (3) AI WORKSPACE HERO VISUAL (AI & Image Tools)
// ═══════════════════════════════════════════════════════
interface AIWorkspaceVisualProps {
  springX: any;
  springY: any;
}

function AIWorkspaceVisual({ springX, springY }: AIWorkspaceVisualProps) {
  // Translate calculations for depth parallax
  const x1 = useTransform(springX, [-0.5, 0.5], [-12, 12]);
  const y1 = useTransform(springY, [-0.5, 0.5], [-12, 12]);

  const x2 = useTransform(springX, [-0.5, 0.5], [-25, 25]);
  const y2 = useTransform(springY, [-0.5, 0.5], [-25, 25]);

  const x3 = useTransform(springX, [-0.5, 0.5], [-40, 40]);
  const y3 = useTransform(springY, [-0.5, 0.5], [-40, 40]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0 flex items-center justify-center"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* 3D Stack of Floating Application Windows */}

      {/* Layer 1: AI Subtitle Editor (Back Layer, Z-Depth: -30px) */}
      <motion.div
        style={{
          x: x1,
          y: y1,
          translateZ: -40,
        }}
        className="absolute top-12 left-6 w-[270px] h-[160px] rounded-2xl border border-white/[0.04] bg-card/40 backdrop-blur-xl shadow-2xl p-3.5 select-none opacity-60"
      >
        <div className="flex items-center justify-between border-b border-white/[0.04] pb-2 mb-3">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-red-500/20" />
            <div className="h-2 w-2 rounded-full bg-yellow-500/20" />
            <div className="h-2 w-2 rounded-full bg-green-500/20" />
          </div>
          <span className="text-[8px] font-extrabold tracking-widest text-muted-foreground uppercase flex items-center gap-1">
            <Type className="h-2.5 w-2.5 text-rose-400" />
            Subtitle-AI
          </span>
        </div>
        <div className="space-y-2 font-mono text-[9px] text-muted-foreground/80 leading-relaxed">
          <p className="text-rose-400/90 font-bold">[00:02.1] <span className="text-foreground">"Transcribing speech logs..."</span></p>
          <p className="opacity-80">[00:05.4] "Cleaning vocal background sound."</p>
          <p className="opacity-50">[00:09.8] "Generating smart captions."</p>
        </div>
      </motion.div>

      {/* Layer 2: AI Image Upscaler (Middle Layer, Z-Depth: 20px) */}
      <motion.div
        style={{
          x: x2,
          y: y2,
          translateZ: 10,
        }}
        className="absolute bottom-16 right-6 w-[290px] h-[190px] rounded-2xl border border-white/[0.06] bg-card/55 backdrop-blur-xl shadow-2xl p-4 select-none opacity-80"
      >
        <div className="flex items-center justify-between border-b border-white/[0.04] pb-2 mb-3">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-red-500/30" />
            <div className="h-2 w-2 rounded-full bg-yellow-500/30" />
            <div className="h-2 w-2 rounded-full bg-green-500/30" />
          </div>
          <span className="text-[8px] font-extrabold tracking-widest text-muted-foreground uppercase flex items-center gap-1">
            <Sparkles className="h-2.5 w-2.5 text-purple-400" />
            Upscale-Core
          </span>
        </div>
        
        {/* Split Screen Image Upscale Mock */}
        <div className="relative h-28 w-full rounded-lg overflow-hidden border border-white/5 bg-black/40">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/30 via-slate-900/40 to-black/60 flex items-center justify-center">
            {/* Split Screen Line */}
            <div className="absolute top-0 bottom-0 left-[55%] w-[1.5px] bg-purple-500/80 z-20 shadow-glow" />
            <span className="absolute top-2 left-2 text-[7px] bg-black/60 border border-white/10 px-1 rounded text-muted-foreground font-bold">480p</span>
            <span className="absolute top-2 right-2 text-[7px] bg-purple-500/20 border border-purple-500/30 px-1 rounded text-purple-300 font-bold">4K Upscaled</span>
            
            {/* Graphic lines representation */}
            <Sparkle className="h-7 w-7 text-purple-400 opacity-60 animate-pulse" />
          </div>
        </div>
      </motion.div>

      {/* Layer 3: AI Speech-to-Text (Front Layer, Z-Depth: 70px) */}
      <motion.div
        style={{
          x: x3,
          y: y3,
          translateZ: 70,
        }}
        className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[310px] h-[190px] rounded-3xl border border-primary/20 bg-card/65 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-4.5 select-none"
      >
        <div className="flex items-center justify-between border-b border-border/80 pb-2.5 mb-3.5">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
          </div>
          <span className="text-[8.5px] font-extrabold tracking-widest text-primary uppercase flex items-center gap-1 animate-pulse">
            <Volume2 className="h-3 w-3 text-primary" />
            AI Audio Transcribe
          </span>
        </div>

        {/* Waves and controls */}
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-black/35 rounded-xl p-3 border border-white/5">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <Play className="h-3 w-3 fill-current ml-0.5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-foreground">Lecture_recording.wav</p>
                <p className="text-[8px] text-muted-foreground">02:14 / 14:32</p>
              </div>
            </div>
            <Badge variant="success" className="text-[7.5px] px-1 py-0.5">Active</Badge>
          </div>

          {/* Graphical Waveform representation */}
          <div className="flex justify-between items-center h-8 gap-0.5 px-1 pt-1.5">
            {[14, 28, 12, 34, 18, 48, 22, 10, 42, 36, 14, 28, 48, 34, 16, 24, 8, 42, 28, 12].map((h, i) => (
              <motion.div
                key={i}
                animate={{ scaleY: [1, h / 20, 1] }}
                transition={{
                  duration: 1.2 + i * 0.08,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className={cn(
                  "w-1 h-full rounded-full origin-center",
                  i < 12 ? "bg-primary" : "bg-muted-foreground/30"
                )}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
