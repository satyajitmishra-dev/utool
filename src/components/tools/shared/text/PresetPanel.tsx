"use client";

import React from "react";
import { Sparkles, FileText } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

interface PresetItem {
  name: string;
  description: string;
  value: string;
}

interface PresetPanelProps {
  toolId: string;
  onSelectPreset: (value: string) => void;
}

export function PresetPanel({ toolId, onSelectPreset }: PresetPanelProps) {
  const getPresets = (): PresetItem[] => {
    switch (toolId) {
      case "binary-to-text":
      case "text-to-binary":
        return [
          {
            name: "Hello World ASCII",
            description: "Standard 8-bit space-separated binary text.",
            value: "01001000 01100101 01101100 01101100 01101111 00100000 01010111 01101111 01110010 01101100 01100100",
          },
          {
            name: "UTF-8 Multi-byte Emoji",
            description: "UTF-8 binary sequence representing 'Hi 👋'.",
            value: "01001000 01101001 00100000 11110000 10011111 10010001 10001011",
          },
        ];
      case "morse-code-encoder":
        return [
          {
            name: "Emergency Signal",
            description: "Standard SOS emergency call text.",
            value: "SOS distress call active",
          },
          {
            name: "Quick Pangram",
            description: "Contains every alphabet letter.",
            value: "The quick brown fox jumps over the lazy dog.",
          },
        ];
      case "morse-code-decoder":
        return [
          {
            name: "SOS Signal Code",
            description: "SOS dots and dashes.",
            value: "... --- ...",
          },
          {
            name: "Greeting Message",
            description: "Morse signal representing 'HELLO WORLD'.",
            value: ".... . .-.. .-.. --- / .-- --- .-. .-.. -..",
          },
        ];
      case "strip-html-tags":
        return [
          {
            name: "HTML Email Template",
            description: "Snippet with script, comments, and block tags.",
            value: `<!-- Weekly Newsletter -->
<div class="header">
  <script>console.log("Analytics loading...");</script>
  <h1>Welcome to UTool!</h1>
  <p>Your <strong>all-in-one</strong> development suite.</p>
  <style>body { font-size: 16px; }</style>
</div>
<ul>
  <li>Fast</li>
  <li>Client-side</li>
  <li>100% Private</li>
</ul>`,
          },
        ];
      case "text-sorter":
      case "remove-duplicate-lines":
        return [
          {
            name: "Unsorted Names List",
            description: "List of names containing duplicates and empty lines.",
            value: `Alice Smith
Bob Jones
Charlie Miller
Alice Smith
David Clark

Charlie Miller
Bob Jones
Zack Wilson`,
          },
          {
            name: "Numeric Entries",
            description: "Log line codes to sort numerically.",
            value: `Item 12
Item 3
Item 45
Item 1
Item 8`,
          },
        ];
      case "text-reverser":
        return [
          {
            name: "Standard Sentence",
            description: "Palindrome testing sentence.",
            value: "A man, a plan, a canal: Panama!",
          },
        ];
      case "find-and-replace":
        return [
          {
            name: "Lorem Ipsum Block",
            description: "Placeholder text for testing search terms.",
            value: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          },
        ];
      default:
        return [
          {
            name: "UTool Sample Text",
            description: "Default placeholder string.",
            value: "Welcome to UTool Text Workspace! Paste your text files here to begin processing.",
          },
        ];
    }
  };

  const presets = getPresets();

  if (presets.length === 0) return null;

  return (
    <GlassCard className="p-4 border border-border/40 space-y-3 bg-muted/5" hover={false}>
      <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wider select-none">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
        Sample Presets
      </h4>
      <div className="space-y-2">
        {presets.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => onSelectPreset(preset.value)}
            className="w-full text-left p-2.5 rounded-xl border border-border bg-card hover:bg-muted/40 transition group cursor-pointer"
          >
            <div className="flex items-center gap-1.5 font-bold text-xs text-foreground group-hover:text-primary transition">
              <FileText className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary shrink-0" />
              <span>{preset.name}</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5 leading-normal">
              {preset.description}
            </p>
          </button>
        ))}
      </div>
    </GlassCard>
  );
}
