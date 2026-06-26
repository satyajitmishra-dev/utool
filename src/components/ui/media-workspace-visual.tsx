"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Download,
  Video,
  Music,
  FileText,
  Sparkles,
  Maximize2,
  FileVideo,
  Image as ImageIcon,
  Film,
  Camera,
} from "lucide-react";
import { cn } from "@/utils/cn";

interface MediaCard {
  label: string;
  icon: React.ComponentType<any>;
  color: string;
  borderColor: string;
  bgColor: string;
  textColor: string;
  glowColor: string;
  initialX: number;
  initialY: number;
  scale: number;
}

const mediaCards: MediaCard[] = [
  {
    label: "Media Downloader",
    icon: Download,
    color: "indigo",
    borderColor: "border-indigo-500/20 hover:border-indigo-500/50",
    bgColor: "bg-indigo-500/10",
    textColor: "text-indigo-400",
    glowColor: "rgba(99, 102, 241, 0.2)",
    initialX: -160,
    initialY: -140,
    scale: 1,
  },
  {
    label: "Video Converter",
    icon: FileVideo,
    color: "purple",
    borderColor: "border-purple-500/20 hover:border-purple-500/50",
    bgColor: "bg-purple-500/10",
    textColor: "text-purple-400",
    glowColor: "rgba(168, 85, 247, 0.2)",
    initialX: 80,
    initialY: -170,
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
    initialX: -80,
    initialY: -70,
    scale: 0.9,
  },
  {
    label: "Audio Extractor",
    icon: Music,
    color: "emerald",
    borderColor: "border-emerald-500/20 hover:border-emerald-500/50",
    bgColor: "bg-emerald-500/10",
    textColor: "text-emerald-400",
    glowColor: "rgba(16, 185, 129, 0.2)",
    initialX: 140,
    initialY: -80,
    scale: 1,
  },
  {
    label: "Subtitle Generator",
    icon: FileText,
    color: "cyan",
    borderColor: "border-cyan-500/20 hover:border-cyan-500/50",
    bgColor: "bg-cyan-500/10",
    textColor: "text-cyan-400",
    glowColor: "rgba(6, 182, 212, 0.2)",
    initialX: -180,
    initialY: 20,
    scale: 0.95,
  },
  {
    label: "AI Enhancer",
    icon: Sparkles,
    color: "amber",
    borderColor: "border-amber-500/20 hover:border-amber-500/50",
    bgColor: "bg-amber-500/10",
    textColor: "text-amber-400",
    glowColor: "rgba(245, 158, 11, 0.2)",
    initialX: 180,
    initialY: 30,
    scale: 1.05,
  },
  {
    label: "Video Compressor",
    icon: Video,
    color: "blue",
    borderColor: "border-blue-500/20 hover:border-blue-500/50",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-400",
    glowColor: "rgba(59, 130, 246, 0.2)",
    initialX: -100,
    initialY: 110,
    scale: 1,
  },
  {
    label: "Thumbnail Generator",
    icon: Camera,
    color: "rose",
    borderColor: "border-rose-500/20 hover:border-rose-500/50",
    bgColor: "bg-rose-500/10",
    textColor: "text-rose-400",
    glowColor: "rgba(244, 63, 94, 0.2)",
    initialX: 100,
    initialY: 120,
    scale: 0.9,
  },
  {
    label: "Frame Extractor",
    icon: Film,
    color: "teal",
    borderColor: "border-teal-500/20 hover:border-teal-500/50",
    bgColor: "bg-teal-500/10",
    textColor: "text-teal-400",
    glowColor: "rgba(20, 184, 166, 0.2)",
    initialX: -160,
    initialY: 200,
    scale: 0.95,
  },
  {
    label: "Image Upscaler",
    icon: Maximize2,
    color: "violet",
    borderColor: "border-violet-500/20 hover:border-violet-500/50",
    bgColor: "bg-violet-500/10",
    textColor: "text-violet-400",
    glowColor: "rgba(139, 92, 246, 0.2)",
    initialX: 60,
    initialY: 210,
    scale: 1,
  },
];

export function MediaWorkspaceVisual() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse tilt tracking
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const tiltX = useSpring(y, { stiffness: 80, damping: 20 });
  const tiltY = useSpring(x, { stiffness: 80, damping: 20 });

  const rotateX = useTransform(tiltX, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(tiltY, [-0.5, 0.5], [-15, 15]);

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

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex flex-col items-center justify-center w-full min-h-[580px] select-none"
      style={{ perspective: 1200 }}
    >
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full bg-primary/10 blur-[180px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full bg-purple-500/12 blur-[130px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] rounded-full bg-indigo-500/15 blur-[90px] pointer-events-none" />

      {/* Main 3D Canvas */}
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative w-[500px] h-[500px] flex items-center justify-center"
      >
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 border border-white/[0.02] rounded-full pointer-events-none scale-90" />
        <div className="absolute inset-0 border border-indigo-500/[0.04] border-dashed rounded-full pointer-events-none scale-75" />
        <div className="absolute inset-0 border border-purple-500/[0.03] border-dashed rounded-full pointer-events-none scale-50" />

        {/* Floating Tool Cards */}
        {mediaCards.map((card, i) => {
          const Icon = card.icon;
          const floatDuration = 4.2 + (i % 3) * 0.6;
          const floatDelay = i * 0.35;

          return (
            <div
              key={card.label}
              className="absolute z-20"
              style={{
                left: "50%",
                top: "50%",
                transform: `translate(-50%, -50%) translate3d(${card.initialX}px, ${card.initialY}px, ${30 + (i % 3) * 15}px) scale(${card.scale})`,
                transformStyle: "preserve-3d",
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: [0, i % 2 === 0 ? -15 : 15, 0],
                  rotateZ: [0, i % 2 === 0 ? 1 : -1, 0],
                }}
                transition={{
                  opacity: { duration: 0.6, delay: 0.2 + i * 0.08 },
                  scale: { duration: 0.6, delay: 0.2 + i * 0.08 },
                  y: { duration: floatDuration, repeat: Infinity, ease: "easeInOut", delay: floatDelay },
                  rotateZ: { duration: floatDuration * 1.2, repeat: Infinity, ease: "easeInOut", delay: floatDelay },
                }}
                whileHover={{
                  y: -10,
                  scale: 1.05,
                  z: 80,
                  transition: { type: "spring", stiffness: 350, damping: 18 },
                }}
                className={cn(
                  "flex items-center gap-3",
                  "rounded-2xl border bg-card/65 backdrop-blur-xl",
                  "px-4 py-3 cursor-pointer select-none",
                  "shadow-[0_8px_32px_rgba(0,0,0,0.35)]",
                  card.borderColor,
                  "transition-all duration-300 relative group"
                )}
                style={{
                  boxShadow: `0 8px 32px rgba(0,0,0,0.35), 0 0 16px ${card.glowColor}`,
                }}
              >
                {/* Border glow shine */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                {/* Icon wrapper */}
                <div className={cn("flex h-8 w-8 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105", card.bgColor, card.textColor)}>
                  <Icon className="h-4.5 w-4.5" />
                </div>
                
                {/* Text Label */}
                <span className="text-xs font-bold text-foreground tracking-tight whitespace-nowrap">{card.label}</span>
              </motion.div>
            </div>
          );
        })}

        {/* Center element - Workspace Core Hub */}
        <div
          className="absolute z-30"
          style={{
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%) translateZ(60px)",
          }}
        >
          <div className="absolute inset-0 rounded-full bg-purple-600/25 blur-3xl animate-pulse" />
          <div className="relative flex flex-col items-center justify-center h-32 w-32 rounded-full border border-white/10 bg-card/75 backdrop-blur-2xl shadow-[0_0_60px_rgba(139,92,246,0.35)] overflow-hidden group">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500/10 via-transparent to-pink-500/10" />
            <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 shadow-lg group-hover:scale-105 transition-transform duration-500">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <div className="absolute bottom-3 text-[9px] font-black text-muted-foreground/80 tracking-widest uppercase">
              Media Hub
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
