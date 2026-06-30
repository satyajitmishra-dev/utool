"use client";

import React, { useState } from "react";
import {
  Undo,
  Redo,
  Clipboard,
  Copy,
  Trash2,
  RefreshCw,
  FolderDown,
  FolderUp,
  HelpCircle,
  X,
  Keyboard,
  WrapText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface TextToolbarProps {
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onPaste?: () => void;
  onCopy?: () => void;
  onClear?: () => void;
  onSwap?: () => void;
  showSwap?: boolean;
  wordWrap?: boolean;
  onToggleWrap?: () => void;
  onExportSession?: () => void;
  onImportSession?: (file: File) => void;
}

export function TextToolbar({
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  onPaste,
  onCopy,
  onClear,
  onSwap,
  showSwap = false,
  wordWrap = true,
  onToggleWrap,
  onExportSession,
  onImportSession,
}: TextToolbarProps) {
  const [showShortcuts, setShowShortcuts] = useState(false);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onImportSession) {
      onImportSession(e.target.files[0]);
    }
  };

  const shortcutsList = [
    { keys: ["Ctrl", "Z"], desc: "Undo last edit" },
    { keys: ["Ctrl", "Y"], desc: "Redo undone edit" },
    { keys: ["Ctrl", "V"], desc: "Paste text from clipboard" },
    { keys: ["Ctrl", "C"], desc: "Copy text to clipboard" },
    { keys: ["Ctrl", "Enter"], desc: "Trigger processing / conversion" },
    { keys: ["Ctrl", "F"], desc: "Open Find & Replace bar" },
    { keys: ["Ctrl", "K"], desc: "Clear workspace editor" },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 bg-muted/20 border border-border/80 rounded-2xl select-none">
      {/* Left side actions: Undo/Redo & Clipboard */}
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="icon"
          onClick={onUndo}
          disabled={!canUndo}
          className="h-9 w-9 rounded-xl transition"
          title="Undo (Ctrl+Z)"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onRedo}
          disabled={!canRedo}
          className="h-9 w-9 rounded-xl transition"
          title="Redo (Ctrl+Y)"
        >
          <Redo className="h-4 w-4" />
        </Button>

        <div className="w-[1px] h-6 bg-border mx-1.5" />

        {onPaste && (
          <Button
            variant="outline"
            onClick={onPaste}
            className="h-9 px-3 text-xs font-bold gap-1.5 rounded-xl transition hover:bg-muted"
            title="Paste from clipboard"
          >
            <Clipboard className="h-4 w-4 text-muted-foreground" />
            Paste
          </Button>
        )}

        {onCopy && (
          <Button
            variant="outline"
            onClick={onCopy}
            className="h-9 px-3 text-xs font-bold gap-1.5 rounded-xl transition hover:bg-muted"
            title="Copy all output"
          >
            <Copy className="h-4 w-4 text-muted-foreground" />
            Copy
          </Button>
        )}

        {onClear && (
          <Button
            variant="outline"
            onClick={onClear}
            className="h-9 px-3 text-xs font-bold gap-1.5 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 border-rose-200 hover:border-rose-300 rounded-xl transition"
            title="Clear all text"
          >
            <Trash2 className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Right side actions: Swap, wrap, session IO, Help */}
      <div className="flex items-center gap-2">
        {showSwap && onSwap && (
          <Button
            variant="outline"
            onClick={onSwap}
            className="h-9 px-3 text-xs font-bold gap-1.5 rounded-xl border border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition text-primary"
            title="Swap input & output"
          >
            <RefreshCw className="h-4 w-4 shrink-0" />
            Swap Mode
          </Button>
        )}

        {onToggleWrap && (
          <Button
            variant="outline"
            onClick={onToggleWrap}
            className={`h-9 px-3 text-xs font-bold gap-1.5 rounded-xl transition ${
              wordWrap ? "bg-primary/5 text-primary border-primary/20" : "hover:bg-muted"
            }`}
            title="Toggle word wrapping"
          >
            <WrapText className="h-4 w-4" />
            Wrap
          </Button>
        )}

        <div className="w-[1px] h-6 bg-border mx-1" />

        {/* Session Import/Export */}
        {onExportSession && (
          <Button
            variant="outline"
            size="icon"
            onClick={onExportSession}
            className="h-9 w-9 rounded-xl hover:bg-muted transition"
            title="Export session config JSON"
          >
            <FolderDown className="h-4 w-4 text-muted-foreground" />
          </Button>
        )}

        {onImportSession && (
          <label className="flex items-center justify-center h-9 w-9 border border-border bg-card hover:bg-muted rounded-xl cursor-pointer transition select-none">
            <FolderUp className="h-4 w-4 text-muted-foreground" />
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        )}

        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowShortcuts(true)}
          className="h-9 w-9 rounded-xl hover:bg-muted transition"
          title="Keyboard shortcuts Help"
        >
          <HelpCircle className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>

      {/* Keyboard Shortcuts Dialog Backdrop */}
      {showShortcuts && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs animate-fade-in">
          <div className="bg-card border border-border rounded-2xl w-full max-w-sm shadow-xl p-5 relative">
            <button
              onClick={() => setShowShortcuts(false)}
              className="absolute top-4 right-4 p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2 mb-4 text-foreground select-none">
              <Keyboard className="h-5 w-5 text-primary" />
              <h3 className="text-sm font-black uppercase tracking-wider">Keyboard Shortcuts</h3>
            </div>
            <div className="space-y-3">
              {shortcutsList.map((sc, i) => (
                <div key={i} className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">{sc.desc}</span>
                  <div className="flex gap-1">
                    {sc.keys.map((key, kIdx) => (
                      <kbd
                        key={kIdx}
                        className="bg-muted border border-border px-1.5 py-0.5 rounded font-mono text-[9px] font-bold text-foreground"
                      >
                        {key}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
