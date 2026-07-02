"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Wrench, FileText, Settings, WifiOff, ShieldAlert, KeyRound, 
  Hourglass, Flame, FileWarning, HelpCircle, Laptop2, Sparkles, 
  Compass, AlertTriangle
} from "lucide-react";
import { FloatItem, ParallaxItem } from "./ExperienceAnimation";

export interface ExperienceIllustrationProps {
  variant: string;
  className?: string;
}

export function ExperienceIllustration({ variant, className }: ExperienceIllustrationProps) {
  // Common robot face template for branding consistency
  const renderRobotFace = (mood: "happy" | "offline" | "confused" | "sleepy" | "cool" = "happy") => {
    return (
      <div className="relative w-40 h-40 bg-linear-to-b from-slate-800 to-slate-900 dark:from-slate-700 dark:to-slate-800 rounded-3xl border-4 border-slate-600 dark:border-slate-500 shadow-xl flex flex-col items-center justify-center p-4">
        {/* Antennas */}
        <div className="absolute -top-6 w-1 h-6 bg-slate-500">
          <motion.div 
            animate={{ scale: [1, 1.3, 1] }} 
            transition={{ duration: 1.5, repeat: Infinity }}
            className={`absolute -top-3 -left-1.5 w-4 h-4 rounded-full ${
              mood === "offline" ? "bg-red-500" : mood === "sleepy" ? "bg-amber-500" : "bg-indigo-400"
            }`} 
          />
        </div>
        {/* Ears */}
        <div className="absolute -left-3 w-3 h-10 bg-slate-600 rounded-l-lg" />
        <div className="absolute -right-3 w-3 h-10 bg-slate-600 rounded-r-lg" />

        {/* Eyes Screen */}
        <div className="w-full h-16 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-around px-4">
          {mood === "happy" && (
            <>
              <motion.div animate={{ scaleY: [1, 0.1, 1] }} transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }} className="w-4 h-4 rounded-full bg-cyan-400" />
              <motion.div animate={{ scaleY: [1, 0.1, 1] }} transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }} className="w-4 h-4 rounded-full bg-cyan-400" />
            </>
          )}
          {mood === "offline" && (
            <>
              <div className="text-red-500 font-bold text-lg select-none">X</div>
              <div className="text-red-500 font-bold text-lg select-none">X</div>
            </>
          )}
          {mood === "confused" && (
            <>
              <div className="text-cyan-400 text-lg font-bold">?</div>
              <div className="text-cyan-400 text-lg font-bold">?</div>
            </>
          )}
          {mood === "sleepy" && (
            <>
              <div className="w-4 h-1 bg-amber-400 rounded-full" />
              <div className="w-4 h-1 bg-amber-400 rounded-full" />
            </>
          )}
          {mood === "cool" && (
            <div className="flex gap-2 text-cyan-400 text-lg font-extrabold select-none">
              <span>🕶️</span>
            </div>
          )}
        </div>

        {/* Mouth */}
        <div className="mt-4 flex justify-center">
          {mood === "happy" && (
            <motion.div 
              animate={{ height: [4, 8, 4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-12 h-4 border-b-4 border-cyan-400 rounded-b-full" 
            />
          )}
          {mood === "offline" && (
            <div className="w-10 h-1 bg-red-500 rounded-full" />
          )}
          {mood === "confused" && (
            <div className="w-6 h-6 border-2 border-dashed border-cyan-400 rounded-full animate-spin" />
          )}
          {mood === "sleepy" && (
            <div className="w-3 h-3 rounded-full border border-amber-400" />
          )}
          {mood === "cool" && (
            <div className="w-10 h-1 bg-cyan-400 rounded-full" />
          )}
        </div>

        {/* LED Status Dots */}
        <div className="absolute bottom-2 flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
        </div>
      </div>
    );
  };

  switch (variant) {
    case "lost-toolbox":
      return (
        <div className={`relative flex flex-col items-center justify-center min-h-[280px] w-full ${className}`}>
          {/* Parallax Layer for floating tools */}
          <ParallaxItem offset={25} className="absolute inset-0 z-0">
            {/* Tool 1 */}
            <FloatItem speed={3} range={12} className="absolute top-[10%] left-[15%] text-primary/30">
              <FileText size={40} className="transform -rotate-12" />
            </FloatItem>
            {/* Tool 2 */}
            <FloatItem speed={5} range={18} className="absolute top-[20%] right-[15%] text-secondary/30">
              <Wrench size={36} className="transform rotate-45" />
            </FloatItem>
            {/* Tool 3 */}
            <FloatItem speed={4} range={10} className="absolute bottom-[20%] left-[20%] text-accent/30">
              <Settings size={32} className="animate-spin-slow" />
            </FloatItem>
            {/* Tool 4 */}
            <FloatItem speed={6} range={15} className="absolute bottom-[10%] right-[20%] text-emerald-500/30">
              <Sparkles size={28} />
            </FloatItem>
          </ParallaxItem>

          {/* Core Robot Illustration */}
          <div className="relative z-10">
            {renderRobotFace("confused")}
            
            {/* Flying toolbox */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -bottom-8 -right-8 bg-card border border-border/80 shadow-lg p-2 rounded-2xl flex items-center justify-center"
            >
              <div className="w-12 h-10 bg-linear-to-r from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center text-white">
                🔧
              </div>
            </motion.div>
          </div>
        </div>
      );

    case "unplugged-robot":
      return (
        <div className={`relative flex flex-col items-center justify-center min-h-[280px] w-full ${className}`}>
          <div className="relative">
            {renderRobotFace("offline")}
            
            {/* Spark plug unplugged */}
            <motion.div
              animate={{ x: [0, -5, 0], y: [0, 5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -bottom-10 -left-6 bg-slate-900 border border-slate-700 p-2.5 rounded-full text-slate-400 flex items-center shadow-lg"
            >
              <WifiOff size={24} className="text-red-500 animate-pulse" />
            </motion.div>
          </div>
          {/* Wire Socket */}
          <div className="mt-8 text-xs text-muted-foreground flex items-center gap-1.5 bg-muted/50 px-3 py-1 rounded-full border border-border">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            Status: Reconnecting local network...
          </div>
        </div>
      );

    case "slow-connection":
      return (
        <div className={`relative flex flex-col items-center justify-center min-h-[280px] w-full ${className}`}>
          <div className="relative">
            {renderRobotFace("sleepy")}
            
            {/* Speed dial */}
            <div className="absolute -bottom-8 -right-8 bg-card border border-border p-3 rounded-full shadow-lg">
              <motion.div
                animate={{ rotate: [10, 80, 10] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full flex items-center justify-center"
              >
                <div className="w-1 h-4 bg-amber-500 origin-bottom -mt-3 rounded-full" />
              </motion.div>
            </div>
          </div>
        </div>
      );

    case "loading-gears":
      return (
        <div className={`relative flex items-center justify-center min-h-[280px] w-full ${className}`}>
          <div className="relative flex items-center justify-center">
            {/* Big Gear */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="text-primary/10 dark:text-primary/20 w-44 h-44"
            >
              <Settings size={176} />
            </motion.div>
            
            {/* Medium Gear */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
              className="absolute -top-12 -right-12 text-secondary/25 w-28 h-28"
            >
              <Settings size={112} />
            </motion.div>

            {/* Small Gear */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-4 -left-12 text-accent/30 w-20 h-20"
            >
              <Settings size={80} />
            </motion.div>

            {/* Glowing core */}
            <div className="absolute w-12 h-12 rounded-full bg-linear-to-tr from-primary to-secondary blur-md opacity-70 animate-pulse" />
          </div>
        </div>
      );

    case "maintenance-robot":
      return (
        <div className={`relative flex flex-col items-center justify-center min-h-[280px] w-full ${className}`}>
          <div className="relative">
            {renderRobotFace("happy")}
            
            {/* Wrench overlay */}
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="absolute -bottom-6 -right-6 bg-amber-500 text-white p-3 rounded-full shadow-lg"
            >
              <Wrench size={24} />
            </motion.div>
          </div>
        </div>
      );

    case "broken-robot":
      return (
        <div className={`relative flex flex-col items-center justify-center min-h-[280px] w-full ${className}`}>
          <div className="relative">
            {renderRobotFace("confused")}
            
            {/* Danger indicator */}
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute -top-4 -right-4 bg-red-500 text-white p-2 rounded-full shadow-lg"
            >
              <AlertTriangle size={20} />
            </motion.div>
          </div>
        </div>
      );

    case "locked-gate":
      return (
        <div className={`relative flex flex-col items-center justify-center min-h-[280px] w-full ${className}`}>
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-36 h-36 bg-linear-to-br from-violet-600 to-indigo-700 rounded-full flex items-center justify-center shadow-xl border-4 border-card"
          >
            <KeyRound size={56} className="text-white animate-pulse" />
          </motion.div>
          
          <div className="absolute -bottom-2 bg-slate-900 border border-slate-700 text-cyan-400 font-mono text-[10px] uppercase px-3 py-1 rounded-full">
            HTTP 403 Forbidden
          </div>
        </div>
      );

    case "expired-hourglass":
      return (
        <div className={`relative flex flex-col items-center justify-center min-h-[280px] w-full ${className}`}>
          <motion.div
            animate={{ rotate: [0, 180, 180, 360] }}
            transition={{ duration: 6, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }}
            className="w-36 h-36 bg-linear-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center shadow-xl border-4 border-card"
          >
            <Hourglass size={56} className="text-white" />
          </motion.div>
        </div>
      );

    case "cool-down-robot":
      return (
        <div className={`relative flex flex-col items-center justify-center min-h-[280px] w-full ${className}`}>
          <div className="relative">
            {renderRobotFace("cool")}
            
            {/* Speed block */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="absolute -bottom-6 -right-6 bg-cyan-500 text-white p-3 rounded-2xl shadow-lg border border-cyan-300/40"
            >
              <Flame size={24} className="animate-pulse" />
            </motion.div>
          </div>
        </div>
      );

    case "upload-error":
      return (
        <div className={`relative flex flex-col items-center justify-center min-h-[280px] w-full ${className}`}>
          <div className="relative w-32 h-40 bg-card rounded-2xl border-2 border-dashed border-red-500/50 shadow-lg flex flex-col items-center justify-center p-4">
            <FileWarning size={48} className="text-red-500 mb-2" />
            <span className="text-[10px] font-mono text-red-500 uppercase tracking-widest bg-red-500/10 px-2 py-0.5 rounded">
              FAILED
            </span>
            <div className="absolute -bottom-4 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold shadow-md">
              ×
            </div>
          </div>
        </div>
      );

    case "giant-file":
      return (
        <div className={`relative flex flex-col items-center justify-center min-h-[280px] w-full ${className}`}>
          <div className="relative w-44 h-48 bg-card rounded-2xl border-4 border-red-500/80 shadow-2xl flex flex-col items-center justify-center p-6 transform -rotate-6">
            <span className="text-[40px] font-bold text-red-500/20 absolute top-2 right-4">GB</span>
            <FileText size={72} className="text-red-500 mb-4" />
            <div className="bg-red-500/15 border border-red-500/20 px-3 py-1.5 rounded-lg text-center w-full">
              <span className="text-[11px] font-semibold text-red-400 font-mono">
                &gt; Max File Limit
              </span>
            </div>
          </div>
        </div>
      );

    case "damaged-doc":
      return (
        <div className={`relative flex flex-col items-center justify-center min-h-[280px] w-full ${className}`}>
          <div className="relative w-36 h-40 bg-card rounded-2xl border border-border shadow-lg flex flex-col items-center justify-center p-4">
            {/* Torn line */}
            <div className="absolute inset-x-0 top-1/2 h-1 bg-background border-y border-dashed border-red-500/30 transform -rotate-12" />
            <FileWarning size={48} className="text-amber-500 mb-2" />
            <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest bg-amber-500/10 px-2 py-0.5 rounded">
              CORRUPTED
            </span>
          </div>
        </div>
      );

    case "old-monitor":
      return (
        <div className={`relative flex flex-col items-center justify-center min-h-[280px] w-full ${className}`}>
          <div className="relative w-48 h-36 bg-slate-800 dark:bg-slate-700 rounded-3xl border-8 border-slate-600 dark:border-slate-500 shadow-xl flex flex-col items-center justify-center p-4">
            <div className="w-full h-full bg-slate-950 rounded-xl border border-slate-900 flex items-center justify-center text-green-500 font-mono text-[11px] p-2 leading-tight">
              <div>
                <p>&gt; RUN APP_UTOOL</p>
                <p className="text-red-500">&gt; ERROR: UNSUPPORTED</p>
                <p className="text-slate-500 animate-pulse">&gt; cursor_</p>
              </div>
            </div>
            {/* Monitor Stand */}
            <div className="absolute -bottom-8 w-16 h-8 bg-slate-600 dark:bg-slate-500" />
            <div className="absolute -bottom-10 w-24 h-3 bg-slate-700 dark:bg-slate-600 rounded-t-lg" />
          </div>
        </div>
      );

    case "starry-sky":
      return (
        <div className={`relative flex flex-col items-center justify-center min-h-[280px] w-full overflow-hidden rounded-3xl bg-slate-950 p-6 ${className}`}>
          {/* Twinkling stars */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.15),transparent_60%)]" />
          <motion.div
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-1/4 left-1/3 text-white/30"
          >
            <Sparkles size={20} />
          </motion.div>
          <motion.div
            animate={{ opacity: [0.8, 0.2, 0.8] }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            className="absolute bottom-1/4 right-1/4 text-white/20"
          >
            <Sparkles size={24} />
          </motion.div>

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="z-10 w-32 h-32 bg-linear-to-tr from-indigo-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl shadow-indigo-500/20"
          >
            <Compass size={56} className="text-white animate-spin-slow" />
          </motion.div>
        </div>
      );

    default:
      return (
        <div className={`relative flex items-center justify-center min-h-[280px] w-full ${className}`}>
          <HelpCircle size={80} className="text-muted-foreground/30" />
        </div>
      );
  }
}
export default ExperienceIllustration;
