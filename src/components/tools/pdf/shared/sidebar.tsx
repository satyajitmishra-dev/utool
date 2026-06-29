"use client";

import React from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";

interface ToolSidebarProps {
  title: string;
  actionLabel: string;
  onProcess: () => void;
  disabled?: boolean;
  processing?: boolean;
  children?: React.ReactNode;
}

export function ToolSidebar({
  title,
  actionLabel,
  onProcess,
  disabled = false,
  processing = false,
  children,
}: ToolSidebarProps) {
  return (
    <GlassCard className="p-6 flex flex-col justify-between h-full min-h-[420px]">
      <div className="space-y-6">
        <div>
          <h3 className="text-xs font-bold text-foreground uppercase tracking-widest leading-none">
            {title}
          </h3>
          <div className="h-0.5 w-8 bg-primary rounded-full mt-2" />
        </div>
        
        <div className="space-y-5">
          {children}
        </div>
      </div>

      <div className="pt-6 border-t border-border/40 mt-6">
        <Button
          onClick={onProcess}
          disabled={disabled || processing}
          className="w-full rounded-2xl font-bold py-5 flex items-center justify-center gap-2 shadow-lg shadow-primary/10 cursor-pointer"
        >
          {processing ? (
            <>
              <Loader2 className="h-4.5 w-4.5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Sparkles className="h-4.5 w-4.5" />
              {actionLabel}
            </>
          )}
        </Button>
      </div>
    </GlassCard>
  );
}
