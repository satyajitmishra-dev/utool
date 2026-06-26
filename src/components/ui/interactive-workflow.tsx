"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileUp, 
  Settings, 
  ArrowRight, 
  CheckCircle2, 
  FileText, 
  Download, 
  RefreshCw, 
  Sparkles, 
  Lock
} from "lucide-react";
import { cn } from "@/utils/cn";

type Step = "idle" | "selected" | "processing" | "completed";
type FlowType = "pdf" | "image" | "json";

export function InteractiveWorkflow() {
  const [step, setStep] = useState<Step>("idle");
  const [flow, setFlow] = useState<FlowType>("pdf");
  const [progress, setProgress] = useState(0);

  const startSimulation = () => {
    setStep("processing");
    setProgress(0);
    
    // Simulate real-time client-side compiling steps
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setStep("completed");
          return 100;
        }
        // Snappy irregular step speed for realism
        const increment = Math.floor(Math.random() * 20) + 10;
        return Math.min(prev + increment, 100);
      });
    }, 180);
  };

  const resetSimulation = () => {
    setStep("idle");
    setProgress(0);
  };

  const getFlowDetails = () => {
    switch (flow) {
      case "pdf":
        return {
          inputName: "Q4_financial_statement.pdf",
          inputSize: "18.4 MB",
          outputName: "Q4_financial_statement_compressed.pdf",
          outputSize: "1.6 MB",
          reduction: "91% smaller",
          badgeColor: "bg-red-500/10 text-red-400 border-red-500/20",
          iconColor: "text-red-400",
        };
      case "image":
        return {
          inputName: "hero_background_raw.png",
          inputSize: "8.2 MB",
          outputName: "hero_background.webp",
          outputSize: "680 KB",
          reduction: "92% smaller",
          badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
          iconColor: "text-amber-400",
        };
      case "json":
        return {
          inputName: "payload_raw.json",
          inputSize: "1,240 KB",
          outputName: "payload_formatted.min.json",
          outputSize: "310 KB",
          reduction: "75% smaller",
          badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
          iconColor: "text-blue-400",
        };
    }
  };

  const details = getFlowDetails();

  return (
    <div className="mx-auto max-w-4xl px-4 mt-16">
      {/* Sandbox Container */}
      <div className="relative overflow-hidden rounded-[2rem] border border-border/40 bg-card/45 backdrop-blur-xl p-8 shadow-xl">
        <div className="absolute top-0 right-0 h-40 w-40 bg-gradient-to-br from-primary/10 to-transparent blur-2xl" />

        {/* Top bar with identity filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border/30 pb-6 mb-8">
          <div>
            <h3 className="text-[17px] font-bold tracking-tight text-foreground flex items-center gap-1.5">
              <Sparkles className="h-4.5 w-4.5 text-amber-400" />
              Live Workspace Sandbox
            </h3>
            <p className="text-caption text-muted-foreground mt-0.5">
              Interact with the local browser compiler below.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-muted/60 p-1 rounded-full border border-border/40">
            {(["pdf", "image", "json"] as FlowType[]).map((type) => (
              <button
                key={type}
                onClick={() => {
                  setFlow(type);
                  resetSimulation();
                }}
                disabled={step === "processing"}
                className={cn(
                  "px-4 py-1.5 rounded-full text-caption font-semibold uppercase tracking-wider transition-all cursor-pointer",
                  flow === type
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {type === "pdf" && "PDF Comp"}
                {type === "image" && "WebP Convert"}
                {type === "json" && "Minifier"}
              </button>
            ))}
          </div>
        </div>

        {/* Sandbox Content Screen */}
        <div className="min-h-[220px] flex items-center justify-center relative">
          <AnimatePresence mode="wait">
            {/* Step 1: Idle - Dropzone invitation */}
            {step === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
                onClick={() => setStep("selected")}
                className="w-full border-2 border-dashed border-border/40 hover:border-primary/45 rounded-2xl flex flex-col items-center justify-center py-10 px-6 cursor-pointer bg-muted/20 hover:bg-muted/30 transition-all group"
              >
                <div className="h-12 w-12 rounded-2xl bg-muted border border-border/50 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors mb-4 group-hover:scale-105 transform-gpu duration-350">
                  <FileUp className="h-5 w-5" />
                </div>
                <p className="text-body-s font-semibold text-foreground">
                  Click to drop your test file
                </p>
                <p className="text-caption text-muted-foreground mt-1 text-center">
                  Or select a presets folder. Files are compiled client-side only.
                </p>
              </motion.div>
            )}

            {/* Step 2: Selected - File Loaded */}
            {step === "selected" && (
              <motion.div
                key="selected"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="w-full flex flex-col items-center justify-center text-center"
              >
                <div className="flex items-center gap-3 bg-muted/50 border border-border/60 rounded-2xl px-6 py-4 mb-6">
                  <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center bg-card shadow-sm", details.iconColor)}>
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-body-s font-semibold text-foreground">{details.inputName}</p>
                    <p className="text-[11px] text-muted-foreground">{details.inputSize}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={resetSimulation}
                    className="px-5 py-2.5 rounded-full border border-border text-body-s font-semibold hover:bg-muted active:scale-95 transition-all cursor-pointer"
                  >
                    Clear
                  </button>
                  <button
                    onClick={startSimulation}
                    className="px-7 py-2.5 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground text-body-s font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 group"
                  >
                    Run Transformation
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Processing - Animate Loader */}
            {step === "processing" && (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center text-center"
              >
                <div className="relative flex items-center justify-center h-20 w-20 mb-6">
                  <div className="absolute inset-0 rounded-full border-4 border-border/20" />
                  <svg className="absolute inset-0 h-full w-full -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      fill="none"
                      stroke="url(#progress-gradient)"
                      strokeWidth="4"
                      strokeDasharray={2 * Math.PI * 36}
                      strokeDashoffset={2 * Math.PI * 36 * (1 - progress / 100)}
                      className="transition-all duration-150 ease-out"
                    />
                    <defs>
                      <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="hsl(var(--color-primary))" />
                        <stop offset="100%" stopColor="hsl(var(--color-secondary))" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute text-caption font-bold text-foreground">
                    {progress}%
                  </div>
                </div>

                <p className="text-body-s font-semibold text-foreground animate-pulse">
                  {progress < 40 && "Loading WebAssembly environment..."}
                  {progress >= 40 && progress < 80 && "Executing client computation modules..."}
                  {progress >= 80 && "Assembling output file details..."}
                </p>
                <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                  <Lock className="h-3 w-3 text-emerald-500" />
                  Data stays completely secure on your machine
                </p>
              </motion.div>
            )}

            {/* Step 4: Completed - Show Success Badge & Output */}
            {step === "completed" && (
              <motion.div
                key="completed"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="w-full flex flex-col items-center justify-center text-center"
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="mb-4 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-full"
                >
                  <CheckCircle2 className="h-8 w-8" />
                </motion.div>

                <h4 className="text-body-l font-bold text-foreground mb-1">
                  Transformation Completed!
                </h4>
                <p className="text-caption text-muted-foreground mb-6">
                  Successfully converted in <span className="text-foreground font-semibold">42ms</span>
                </p>

                {/* Output Card */}
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-muted/30 border border-border/40 rounded-2xl p-4 mb-6 w-full max-w-lg">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center bg-card shadow-sm border border-border/30", details.iconColor)}>
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-body-s font-semibold text-foreground truncate max-w-[200px] sm:max-w-[280px]">
                        {details.outputName}
                      </p>
                      <p className="text-[11px] text-muted-foreground flex items-center gap-2">
                        <span>{details.outputSize}</span>
                        <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                        <span className="text-emerald-400 font-semibold">{details.reduction}</span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      alert("Simulated local file download triggered!");
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-card border border-border text-body-s font-semibold hover:bg-muted active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    <Download className="h-4 w-4 text-primary" />
                    Download File
                  </button>
                </div>

                <button
                  onClick={resetSimulation}
                  className="text-caption font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                >
                  <RefreshCw className="h-3 w-3" />
                  Try another file
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
