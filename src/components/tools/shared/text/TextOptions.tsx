"use client";

import React from "react";
import { Sliders, RotateCcw, ShieldAlert, Sparkles, Play, Square } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";

interface TextOptionsProps {
  toolId: string;
  options: any;
  setOptions: (newOpts: any) => void;
  onExecute?: () => void;
  isPlayingMorse?: boolean;
  onPlayMorseAudio?: () => void;
  onStopMorseAudio?: () => void;
}

export function TextOptions({
  toolId,
  options,
  setOptions,
  onExecute,
  isPlayingMorse = false,
  onPlayMorseAudio,
  onStopMorseAudio,
}: TextOptionsProps) {
  const updateOption = (key: string, value: any) => {
    setOptions({
      ...options,
      [key]: value,
    });
  };

  const renderOptionsContent = () => {
    switch (toolId) {
      case "binary-to-text":
      case "text-to-binary": {
        const toBinary = options.toBinary ?? true;
        return (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Conversion Direction</span>
              <div className="grid grid-cols-2 gap-2 border border-border p-1 bg-muted/10 rounded-xl">
                <button
                  onClick={() => updateOption("toBinary", true)}
                  className={`py-2 text-xs font-bold rounded-lg transition ${
                    toBinary ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Text → Binary
                </button>
                <button
                  onClick={() => updateOption("toBinary", false)}
                  className={`py-2 text-xs font-bold rounded-lg transition ${
                    !toBinary ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Binary → Text
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Character Encoding</span>
              <select
                value={options.mode || "utf8"}
                onChange={(e) => updateOption("mode", e.target.value)}
                className="w-full rounded-xl border border-border bg-card p-2.5 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="utf8">UTF-8 Mode (Support Emojis & Symbols)</option>
                <option value="ascii">ASCII Mode (Basic English Only)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Output Separator</span>
              <select
                value={options.separator || "space"}
                onChange={(e) => updateOption("separator", e.target.value)}
                className="w-full rounded-xl border border-border bg-card p-2.5 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="space">Space-Separated (01001000 01101001)</option>
                <option value="none">Continuous (0100100001101001)</option>
              </select>
            </div>
          </div>
        );
      }

      case "morse-code-encoder":
      case "morse-code-decoder": {
        const isEncoder = toolId === "morse-code-encoder";
        return (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Audio Settings (Playback)</span>
              
              <div className="space-y-2 pt-1">
                <div className="flex justify-between items-center text-[10px] font-semibold text-muted-foreground">
                  <span>Speed (Words Per Minute)</span>
                  <span className="font-mono text-xs font-black text-foreground">{options.wpm || 20} WPM</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={options.wpm || 20}
                  onChange={(e) => updateOption("wpm", Number(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center text-[10px] font-semibold text-muted-foreground">
                  <span>Pitch Frequency</span>
                  <span className="font-mono text-xs font-black text-foreground">{options.frequency || 600} Hz</span>
                </div>
                <input
                  type="range"
                  min="400"
                  max="1000"
                  step="50"
                  value={options.frequency || 600}
                  onChange={(e) => updateOption("frequency", Number(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>

            {isEncoder && onPlayMorseAudio && (
              <div className="pt-2">
                {isPlayingMorse ? (
                  <Button
                    variant="outline"
                    onClick={onStopMorseAudio}
                    className="w-full text-xs font-bold gap-2 text-rose-500 border-rose-200 hover:bg-rose-50 rounded-xl"
                  >
                    <Square className="h-3.5 w-3.5 fill-rose-500" /> Stop Morse Code Audio
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={onPlayMorseAudio}
                    className="w-full text-xs font-bold gap-2 text-primary border-primary/20 hover:bg-primary/5 rounded-xl"
                  >
                    <Play className="h-3.5 w-3.5 fill-primary" /> Play Morse Code Audio
                  </Button>
                )}
              </div>
            )}
          </div>
        );
      }

      case "strip-html-tags":
        return (
          <div className="space-y-3">
            {[
              { key: "preserveLineBreaks", label: "Preserve line breaks" },
              { key: "decodeEntities", label: "Decode HTML entities (e.g. &amp; → &)" },
              { key: "removeScriptsStyles", label: "Remove scripts, styles & tags content" },
              { key: "removeComments", label: "Remove HTML comments (<!-- -->)" },
            ].map((opt) => (
              <label
                key={opt.key}
                className="flex items-center gap-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={options[opt.key] ?? true}
                  onChange={(e) => updateOption(opt.key, e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        );

      case "remove-duplicate-lines":
        return (
          <div className="space-y-3">
            {[
              { key: "ignoreCase", label: "Ignore character case" },
              { key: "trimWhitespace", label: "Trim leading/trailing whitespace" },
              { key: "sortBeforeRemoval", label: "Sort lines alphabetically before removing" },
            ].map((opt) => (
              <label
                key={opt.key}
                className="flex items-center gap-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={options[opt.key] ?? false}
                  onChange={(e) => updateOption(opt.key, e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        );

      case "text-reverser":
        return (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Reversal Scope</span>
              <select
                value={options.mode || "chars"}
                onChange={(e) => updateOption("mode", e.target.value)}
                className="w-full rounded-xl border border-border bg-card p-2.5 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="chars">Reverse Characters (e.g. abc → cba)</option>
                <option value="words">Reverse Words (e.g. hello world → world hello)</option>
                <option value="sentences">Reverse Sentences (e.g. Hi. Ok. → Ok. Hi.)</option>
                <option value="lines">Reverse Lines (Order of rows reversed)</option>
              </select>
            </div>

            {options.mode !== "lines" && (
              <div className="space-y-3 pt-1">
                <label className="flex items-center gap-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={options.preserveSpacing ?? false}
                    onChange={(e) => updateOption("preserveSpacing", e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                  />
                  <span>Preserve original spacing positions</span>
                </label>
                
                {options.mode === "chars" && (
                  <label className="flex items-center gap-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={options.preservePunctuation ?? false}
                      onChange={(e) => updateOption("preservePunctuation", e.target.checked)}
                      className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                    />
                    <span>Keep punctuation marks in position</span>
                  </label>
                )}
              </div>
            )}
          </div>
        );

      case "text-sorter":
        return (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Sorting Method</span>
              <select
                value={options.mode || "alpha"}
                onChange={(e) => updateOption("mode", e.target.value)}
                className="w-full rounded-xl border border-border bg-card p-2.5 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="alpha">Alphabetical (A → Z)</option>
                <option value="numeric">Numerical (First number on line)</option>
                <option value="length">Line Length (Shortest → Longest)</option>
                <option value="shuffle">Random Shuffle (Randomize order)</option>
              </select>
            </div>

            {options.mode !== "shuffle" && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Sort Direction</span>
                <select
                  value={options.direction || "asc"}
                  onChange={(e) => updateOption("direction", e.target.value)}
                  className="w-full rounded-xl border border-border bg-card p-2.5 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="asc">Ascending (A-Z, 0-9, Short-Long)</option>
                  <option value="desc">Descending (Z-A, 9-0, Long-Short)</option>
                </select>
              </div>
            )}

            <div className="space-y-3 pt-1">
              <label className="flex items-center gap-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={options.ignoreCase ?? true}
                  onChange={(e) => updateOption("ignoreCase", e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                />
                <span>Ignore character casing</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={options.removeDuplicates ?? false}
                  onChange={(e) => updateOption("removeDuplicates", e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                />
                <span>Remove duplicate lines while sorting</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={options.trimWhitespace ?? true}
                  onChange={(e) => updateOption("trimWhitespace", e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                />
                <span>Trim leading/trailing line spacing</span>
              </label>
            </div>
          </div>
        );

      case "random-word-generator":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-semibold text-muted-foreground">
                <span>Number of Words</span>
                <span className="font-mono text-xs font-black text-foreground">{options.count || 10} words</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={options.count || 10}
                onChange={(e) => updateOption("count", Number(e.target.value))}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Min Length</span>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={options.minLength || ""}
                  onChange={(e) => updateOption("minLength", e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="Any"
                  className="w-full rounded-xl border border-border bg-card p-2 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Max Length</span>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={options.maxLength || ""}
                  onChange={(e) => updateOption("maxLength", e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="Any"
                  className="w-full rounded-xl border border-border bg-card p-2 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Word Category</span>
              <select
                value={options.category || "general"}
                onChange={(e) => updateOption("category", e.target.value)}
                className="w-full rounded-xl border border-border bg-card p-2.5 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="general">General (All words)</option>
                <option value="technology">Technology & Dev</option>
                <option value="nature">Nature & Animals</option>
                <option value="business">Business & Corporate</option>
                <option value="education">Education & School</option>
                <option value="science">Science & Space</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Starts With</span>
                <input
                  type="text"
                  maxLength={1}
                  value={options.startsWith || ""}
                  onChange={(e) => updateOption("startsWith", e.target.value.toLowerCase())}
                  placeholder="e.g. a"
                  className="w-full rounded-xl border border-border bg-card p-2 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary text-center"
                />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Ends With</span>
                <input
                  type="text"
                  maxLength={1}
                  value={options.endsWith || ""}
                  onChange={(e) => updateOption("endsWith", e.target.value.toLowerCase())}
                  placeholder="e.g. s"
                  className="w-full rounded-xl border border-border bg-card p-2 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary text-center"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                onClick={onExecute}
                className="w-full text-xs font-bold gap-1.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/95"
              >
                <Sparkles className="h-4 w-4" /> Generate Words
              </Button>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-4 text-xs text-muted-foreground select-none">
            No dynamic settings required. Ready to process.
          </div>
        );
    }
  };

  return (
    <GlassCard className="p-4 border border-border/60 space-y-4" hover={false}>
      <div className="flex items-center gap-1.5 select-none border-b border-border/40 pb-2.5">
        <Sliders className="h-4 w-4 text-primary" />
        <h4 className="text-xs font-black text-foreground uppercase tracking-widest">Configuration</h4>
      </div>

      {renderOptionsContent()}
    </GlassCard>
  );
}
