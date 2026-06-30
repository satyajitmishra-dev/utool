"use client";

import React, { useState, useEffect } from "react";
import { History, Trash2, ArrowUpRight, FolderOpen } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";

export interface HistoryItem {
  id: string;
  toolId: string;
  toolName: string;
  timestamp: string;
  input: string;
  output: string;
  options: any;
}

interface HistoryPanelProps {
  toolId: string;
  onRestore: (item: HistoryItem) => void;
}

export function HistoryPanel({ toolId, onRestore }: HistoryPanelProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    loadHistory();
  }, [toolId]);

  const loadHistory = () => {
    try {
      const stored = localStorage.getItem(`utool_text_history_${toolId}`);
      if (stored) {
        setHistory(JSON.parse(stored));
      } else {
        setHistory([]);
      }
    } catch (e) {
      console.error("Failed to load history: ", e);
    }
  };

  const handleClear = () => {
    try {
      localStorage.removeItem(`utool_text_history_${toolId}`);
      setHistory([]);
    } catch (e) {}
  };

  const handleRemoveItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const filtered = history.filter((item) => item.id !== id);
      localStorage.setItem(`utool_text_history_${toolId}`, JSON.stringify(filtered));
      setHistory(filtered);
    } catch (err) {}
  };

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border border-dashed border-border rounded-2xl bg-muted/5 text-center select-none">
        <History className="h-6 w-6 text-muted-foreground/50 mb-1.5" />
        <h4 className="text-xs font-bold text-foreground">No Session History</h4>
        <p className="text-[10px] text-muted-foreground mt-0.5 max-w-[160px] leading-normal">
          Your processed texts will be saved locally here for quick reload.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center select-none">
        <span className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
          <History className="h-3.5 w-3.5 text-primary" />
          Recent Sessions
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClear}
          className="h-6 w-6 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-lg"
          title="Clear all history"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
        {history.map((item) => (
          <GlassCard
            key={item.id}
            onClick={() => onRestore(item)}
            className="p-3 border border-border/60 bg-card hover:bg-muted/10 transition text-left cursor-pointer flex justify-between items-start gap-2 group relative"
            hover={false}
          >
            <div className="space-y-1 flex-1 overflow-hidden">
              <div className="flex justify-between text-[9px] text-muted-foreground font-semibold">
                <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <span className="opacity-0 group-hover:opacity-100 text-primary transition flex items-center gap-0.5 font-bold">
                  Restore <ArrowUpRight className="h-2.5 w-2.5" />
                </span>
              </div>
              <p className="font-mono text-[10px] text-foreground truncate max-w-full">
                {item.input.slice(0, 80) || "(Empty input)"}
              </p>
            </div>
            <button
              onClick={(e) => handleRemoveItem(item.id, e)}
              className="opacity-0 group-hover:opacity-100 hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 rounded p-1 transition shrink-0 self-center"
              title="Remove session"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

// Global utility helper to add item to local storage history
export function saveSessionToHistory(toolId: string, toolName: string, input: string, output: string, options: any) {
  if (!input) return;
  try {
    const key = `utool_text_history_${toolId}`;
    const stored = localStorage.getItem(key);
    const list: HistoryItem[] = stored ? JSON.parse(stored) : [];
    
    // Check if input is identical to the last item
    if (list.length > 0 && list[0].input === input && JSON.stringify(list[0].options) === JSON.stringify(options)) {
      return; // Skip duplicate saves
    }

    const newItem: HistoryItem = {
      id: Math.random().toString(36).substring(2, 9),
      toolId,
      toolName,
      timestamp: new Date().toISOString(),
      input,
      output,
      options,
    };

    // Keep max 20 items in history
    const updated = [newItem, ...list.slice(0, 19)];
    localStorage.setItem(key, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to save session history: ", e);
  }
}
