"use client";

import React from "react";
import { Search, ChevronDown, ChevronUp, X, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchPanelProps {
  findText: string;
  setFindText: (val: string) => void;
  replaceText: string;
  setReplaceText: (val: string) => void;
  caseSensitive: boolean;
  setCaseSensitive: (val: boolean) => void;
  wholeWord: boolean;
  setWholeWord: (val: boolean) => void;
  useRegex: boolean;
  setUseRegex: (val: boolean) => void;
  matchCount: number;
  currentMatchIndex: number;
  onNextMatch: () => void;
  onPrevMatch: () => void;
  onReplace: (all: boolean) => void;
  onClose: () => void;
}

export function SearchPanel({
  findText,
  setFindText,
  replaceText,
  setReplaceText,
  caseSensitive,
  setCaseSensitive,
  wholeWord,
  setWholeWord,
  useRegex,
  setUseRegex,
  matchCount,
  currentMatchIndex,
  onNextMatch,
  onPrevMatch,
  onReplace,
  onClose,
}: SearchPanelProps) {
  return (
    <div className="flex flex-col gap-2 p-3 bg-muted/40 border border-border rounded-xl mb-4 text-xs">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 bg-card border border-border rounded-lg px-2 py-1 flex-1 min-w-[200px]">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Find text..."
            value={findText}
            onChange={(e) => setFindText(e.target.value)}
            className="bg-transparent border-none outline-none text-xs w-full text-foreground placeholder:text-muted-foreground"
          />
          {findText && (
            <span className="text-[10px] font-bold text-muted-foreground whitespace-nowrap">
              {matchCount > 0 ? `${currentMatchIndex + 1} of ${matchCount}` : "no matches"}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={onPrevMatch}
            disabled={matchCount === 0}
            className="h-7 w-7"
            title="Previous match"
          >
            <ChevronUp className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onNextMatch}
            disabled={matchCount === 0}
            className="h-7 w-7"
            title="Next match"
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="flex items-center gap-1 border-l border-border pl-2 select-none">
          <button
            onClick={() => setCaseSensitive(!caseSensitive)}
            className={`px-1.5 py-0.5 rounded font-mono text-[9px] font-bold border transition ${
              caseSensitive
                ? "bg-primary/10 text-primary border-primary/30"
                : "text-muted-foreground border-transparent hover:bg-muted"
            }`}
            title="Match Case"
          >
            Aa
          </button>
          <button
            onClick={() => setWholeWord(!wholeWord)}
            className={`px-1.5 py-0.5 rounded font-mono text-[9px] font-bold border transition ${
              wholeWord
                ? "bg-primary/10 text-primary border-primary/30"
                : "text-muted-foreground border-transparent hover:bg-muted"
            }`}
            title="Whole Word Only"
          >
            " "
          </button>
          <button
            onClick={() => setUseRegex(!useRegex)}
            className={`px-1.5 py-0.5 rounded font-mono text-[9px] font-bold border transition ${
              useRegex
                ? "bg-primary/10 text-primary border-primary/30"
                : "text-muted-foreground border-transparent hover:bg-muted"
            }`}
            title="Use Regular Expression"
          >
            .*
          </button>
        </div>

        <div className="ml-auto">
          <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6 text-muted-foreground">
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border/40">
        <div className="flex items-center gap-1.5 bg-card border border-border rounded-lg px-2 py-1 flex-1 min-w-[200px]">
          <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Replace with..."
            value={replaceText}
            onChange={(e) => setReplaceText(e.target.value)}
            className="bg-transparent border-none outline-none text-xs w-full text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            onClick={() => onReplace(false)}
            disabled={matchCount === 0}
            className="h-7 px-2.5 text-[10px] font-bold"
          >
            Replace
          </Button>
          <Button
            variant="primary"
            onClick={() => onReplace(true)}
            disabled={matchCount === 0}
            className="h-7 px-2.5 text-[10px] font-bold bg-primary text-primary-foreground hover:bg-primary/95"
          >
            Replace All
          </Button>
        </div>
      </div>
    </div>
  );
}
