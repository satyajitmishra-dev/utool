"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, CornerDownLeft, Sparkles, X, History } from "lucide-react";
import { getAllTools } from "@/config/tool-registry";
import { RegistryTool } from "@/types/tool-registry";
import { cn } from "@/utils/cn";

export interface ExperienceSearchProps {
  className?: string;
}

export function ExperienceSearch({ className }: ExperienceSearchProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [filteredTools, setFilteredTools] = useState<RegistryTool[]>([]);

  // 1. Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("utool_recent_searches");
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved));
        } catch {
          // ignore
        }
      }
    }
  }, []);

  // 2. Keyboard listener for '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // 3. Filter tools when query changes
  useEffect(() => {
    if (!query.trim()) {
      setFilteredTools([]);
      setSelectedIndex(-1);
      return;
    }

    const allTools = getAllTools().filter(t => t.isActive);
    const searchLower = query.toLowerCase();
    
    const matches = allTools.filter(
      (tool) =>
        tool.name.toLowerCase().includes(searchLower) ||
        tool.description.toLowerCase().includes(searchLower) ||
        tool.category.toLowerCase().includes(searchLower) ||
        tool.primaryTag.toLowerCase().includes(searchLower)
    );

    setFilteredTools(matches.slice(0, 5));
    setSelectedIndex(-1);
  }, [query]);

  // 4. Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 5. Navigate suggestions with Keyboard (Up, Down, Enter, Escape)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredTools.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredTools.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < filteredTools.length) {
        selectTool(filteredTools[selectedIndex]);
      } else if (filteredTools.length > 0) {
        selectTool(filteredTools[0]);
      } else if (query.trim()) {
        saveSearch(query.trim());
        toastSearch(query.trim());
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const selectTool = (tool: RegistryTool) => {
    saveSearch(tool.name);
    setQuery("");
    setIsOpen(false);
    router.push(`/tools/${tool.slug}`);
  };

  const saveSearch = (searchTerm: string) => {
    const updated = [searchTerm, ...recentSearches.filter((s) => s !== searchTerm)].slice(0, 5);
    setRecentSearches(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("utool_recent_searches", JSON.stringify(updated));
    }
  };

  const clearSearchHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("utool_recent_searches");
    }
  };

  const toastSearch = (term: string) => {
    // Simulated general search trigger
    router.push(`/tools?search=${encodeURIComponent(term)}`);
    setIsOpen(false);
  };

  return (
    <div className={cn("relative w-full max-w-lg mx-auto z-30", className)}>
      {/* Search Input Box */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
          <Search size={18} />
        </div>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for a tool or action... (Press '/' to focus)"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full pl-11 pr-12 py-3.5 bg-card/60 backdrop-blur-md border border-border rounded-full text-sm placeholder-muted-foreground text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/30 focus:border-primary focus:bg-card shadow-sm transition-all"
        />
        {query ? (
          <button
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="absolute inset-y-0 right-4 flex items-center text-muted-foreground hover:text-foreground"
          >
            <X size={16} />
          </button>
        ) : (
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
            <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-0.5 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              /
            </kbd>
          </div>
        )}
      </div>

      {/* Autocomplete Dropdown List */}
      {isOpen && (query.trim() || recentSearches.length > 0) && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-2xl shadow-xl backdrop-blur-md overflow-hidden max-h-96 overflow-y-auto animate-slide-up"
        >
          {/* Autocomplete Results */}
          {filteredTools.length > 0 && (
            <div className="p-2 border-b border-border/60">
              <div className="px-3 py-1.5 text-[10px] font-bold tracking-wider text-muted-foreground uppercase flex items-center gap-1.5">
                <Sparkles size={10} className="text-primary animate-pulse" />
                Matching Utilities
              </div>
              <ul className="flex flex-col gap-0.5 mt-1">
                {filteredTools.map((tool, index) => (
                  <li key={tool.id}>
                    <button
                      onClick={() => selectTool(tool)}
                      className={cn(
                        "w-full text-left px-3 py-2.5 rounded-xl text-sm flex items-center justify-between transition-colors",
                        index === selectedIndex
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-muted/50 text-foreground"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">🔧</span>
                        <div>
                          <span className="font-semibold text-xs block">{tool.name}</span>
                          <span className="text-[10px] text-muted-foreground block truncate max-w-xs">{tool.description}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-mono bg-muted text-muted-foreground px-2 py-0.5 rounded-full uppercase">
                          {tool.category}
                        </span>
                        {index === selectedIndex && (
                          <CornerDownLeft size={10} className="text-primary/70" />
                        )}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recent Searches */}
          {recentSearches.length > 0 && !query.trim() && (
            <div className="p-2">
              <div className="px-3 py-1.5 text-[10px] font-bold tracking-wider text-muted-foreground uppercase flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <History size={10} />
                  Recent Searches
                </span>
                <button
                  onClick={clearSearchHistory}
                  className="text-[9px] text-red-500 hover:underline capitalize font-semibold"
                >
                  Clear
                </button>
              </div>
              <ul className="flex flex-col gap-0.5 mt-1">
                {recentSearches.map((term, index) => (
                  <li key={index}>
                    <button
                      onClick={() => {
                        setQuery(term);
                        inputRef.current?.focus();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 flex items-center gap-2 transition-colors"
                    >
                      <Search size={12} />
                      <span>{term}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* No results state */}
          {query.trim() && filteredTools.length === 0 && (
            <div className="p-4 text-center text-muted-foreground text-xs">
              No exact matching tools found. Press{" "}
              <kbd className="font-mono bg-muted border border-border px-1 py-0.5 rounded">Enter</kbd> to search tools index.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
export default ExperienceSearch;
