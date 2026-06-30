"use client";

import React, { useState, useEffect } from "react";
import { Trash2, Calendar, FileText, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { HistoryItem } from "./types";

interface HistoryPanelProps {
  storageKey: string;
  onLoad: (inputs: Record<string, any>) => void;
}

export function HistoryPanel({ storageKey, onLoad }: HistoryPanelProps) {
  const [historyList, setHistoryList] = useState<HistoryItem[]>([]);

  const loadHistory = () => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setHistoryList(JSON.parse(stored));
      } else {
        setHistoryList([]);
      }
    } catch (e) {
      console.error("Failed to load calculation history", e);
    }
  };

  useEffect(() => {
    loadHistory();
    // Listen to custom local events for updates (in case we add a row)
    const handleUpdate = () => loadHistory();
    window.addEventListener(`history-update-${storageKey}`, handleUpdate);
    return () => window.removeEventListener(`history-update-${storageKey}`, handleUpdate);
  }, [storageKey]);

  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const updated = historyList.filter((item) => item.id !== id);
      localStorage.setItem(storageKey, JSON.stringify(updated));
      setHistoryList(updated);
      toast.success("History item deleted");
    } catch (err) {
      toast.error("Failed to delete history item");
    }
  };

  const handleClearAll = () => {
    try {
      localStorage.removeItem(storageKey);
      setHistoryList([]);
      toast.success("All calculation history cleared");
    } catch (err) {
      toast.error("Failed to clear history");
    }
  };

  if (historyList.length === 0) {
    return (
      <div className="text-center py-8 space-y-2">
        <FileText className="h-8 w-8 text-muted-foreground/45 mx-auto" />
        <h4 className="text-xs font-bold text-foreground">No History Found</h4>
        <p className="text-[10px] text-muted-foreground max-w-[200px] mx-auto leading-relaxed">
          Perform computations and hit "Save Query" to record inputs locally.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center pb-2 border-b border-border/60">
        <span className="text-xs font-bold text-foreground">Saved Calculations ({historyList.length})</span>
        <button
          onClick={handleClearAll}
          className="text-[10px] font-bold text-error hover:underline flex items-center gap-1"
        >
          <Trash2 className="h-3 w-3" /> Clear All
        </button>
      </div>

      <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
        {historyList.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              onLoad(item.inputs);
              toast.success(`Reloaded parameters: ${item.title}`);
            }}
            className="group flex items-center justify-between border border-border/40 hover:border-primary/20 rounded-xl p-3 bg-muted/5 hover:bg-primary/5 cursor-pointer transition-all duration-200"
          >
            <div className="space-y-1">
              <div className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                {item.title}
              </div>
              <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {new Date(item.timestamp).toLocaleDateString()} at{" "}
                {new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => handleDeleteItem(item.id, e)}
                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-error/10 hover:text-error rounded-lg text-muted-foreground transition"
                title="Delete item"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default HistoryPanel;
export function saveHistory(storageKey: string, title: string, inputs: Record<string, any>, results: Record<string, any>) {
  try {
    const stored = localStorage.getItem(storageKey);
    const historyList: HistoryItem[] = stored ? JSON.parse(stored) : [];
    
    const newItem: HistoryItem = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
      title,
      inputs,
      results,
    };

    const updated = [newItem, ...historyList].slice(0, 50); // limit to 50 items
    localStorage.setItem(storageKey, JSON.stringify(updated));
    
    // Dispatch event to update the UI
    window.dispatchEvent(new CustomEvent(`history-update-${storageKey}`));
    toast.success("Query saved successfully!");
  } catch (e) {
    console.error(e);
    toast.error("Failed to save query");
  }
}
