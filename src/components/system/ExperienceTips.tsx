"use client";

import React from "react";
import { Keyboard, Lock, Zap } from "lucide-react";
import { cn } from "@/utils/cn";

export interface ExperienceTipsProps {
  className?: string;
}

export function ExperienceTips({ className }: ExperienceTipsProps) {
  const keyboardShortcuts = [
    { keys: ["/"], action: "Focus search bar" },
    { keys: ["Esc"], action: "Close modals / drop down" },
    { keys: ["Space"], action: "Play / Pause runner game" },
    { keys: ["↑", "↓"], action: "Navigate suggestions" },
    { keys: ["Enter"], action: "Select highlighted item" },
  ];

  return (
    <div className={cn("w-full flex flex-col gap-4 text-left animate-fade-in", className)}>
      {/* Keyboard Shortcuts List */}
      <div className="glass-card p-4 rounded-2xl border border-border bg-card/20 backdrop-blur-xs flex flex-col gap-3">
        <h4 className="text-xs font-bold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
          <Keyboard size={12} />
          Workspace Hotkeys
        </h4>
        <div className="flex flex-col gap-2">
          {keyboardShortcuts.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">{item.action}</span>
              <div className="flex gap-1">
                {item.keys.map((k, kIdx) => (
                  <kbd
                    key={kIdx}
                    className="h-5 select-none inline-flex items-center justify-center rounded border border-border bg-muted/60 px-1.5 font-mono text-[9px] font-bold text-foreground"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Tip Card */}
      <div className="p-4 rounded-2xl border border-primary/10 bg-primary/5 flex gap-3 items-start">
        <Lock className="text-primary shrink-0 mt-0.5" size={14} />
        <div className="flex flex-col gap-1">
          <h5 className="text-[11px] font-bold text-primary uppercase tracking-wider">
            100% Client-Side Privacy
          </h5>
          <p className="text-[11px] text-muted-foreground leading-normal">
            UTool uses local JavaScript and WebAssembly sandboxing. Your files never touch our servers, protecting financial logs and private records.
          </p>
        </div>
      </div>

      {/* Speed Tip Card */}
      <div className="p-4 rounded-2xl border border-emerald-500/10 bg-emerald-500/5 flex gap-3 items-start">
        <Zap className="text-emerald-500 shrink-0 mt-0.5" size={14} />
        <div className="flex flex-col gap-1">
          <h5 className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider">
            Fast Local Speeds
          </h5>
          <p className="text-[11px] text-muted-foreground leading-normal">
            Processing happens directly on your device CPU. There are no queue wait times, no upload overhead, and no bandwidth throttles.
          </p>
        </div>
      </div>
    </div>
  );
}
export default ExperienceTips;
