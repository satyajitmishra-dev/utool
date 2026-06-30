"use client";

import React from "react";
import { motion } from "framer-motion";
import { ToolCard } from "@/components/ui/tool-card";
import { Badge } from "@/components/ui/badge";
import { stagger } from "@/components/ui/section";
import { Type, Sparkles } from "lucide-react";

const textTools = [
  {
    id: "word-counter",
    title: "Character & Word Counter",
    description: "Count words, characters, spaces, paragraphs, and check social media limits.",
    tag: "text",
    status: "live" as const,
    isPremium: false,
    href: "/tools/character-counter",
  },
  {
    id: "binary-to-text",
    title: "Binary Converter",
    description: "Convert plain text to binary code representations and vice versa in real-time.",
    tag: "text",
    status: "live" as const,
    isPremium: false,
    href: "/tools/binary-to-text",
  },
  {
    id: "morse-code-encoder",
    title: "Morse Code Encoder",
    description: "Translate text characters into Morse code signals with audio sound player.",
    tag: "text",
    status: "live" as const,
    isPremium: false,
    href: "/tools/morse-code-encoder",
  },
  {
    id: "morse-code-decoder",
    title: "Morse Code Decoder",
    description: "Translate Morse code dots and dashes back to plain english characters.",
    tag: "text",
    status: "live" as const,
    isPremium: false,
    href: "/tools/morse-code-decoder",
  },
  {
    id: "line-counter",
    title: "Line Counter",
    description: "Calculate line metrics, empty, non-empty, duplicate lines and average length.",
    tag: "text",
    status: "live" as const,
    isPremium: false,
    href: "/tools/line-counter",
  },
  {
    id: "find-and-replace",
    title: "Find & Replace",
    description: "Search and swap matches using exact phrase, casing, whole word, or regex.",
    tag: "text",
    status: "live" as const,
    isPremium: false,
    href: "/tools/find-and-replace",
  },
  {
    id: "strip-html-tags",
    title: "HTML Tags Stripper",
    description: "Strip tags, comments, styles and scripts from code to isolate raw text.",
    tag: "text",
    status: "live" as const,
    isPremium: false,
    href: "/tools/strip-html-tags",
  },
  {
    id: "remove-duplicate-lines",
    title: "Remove Duplicate Lines",
    description: "Clean up listings by identifying and purging identical repeating lines.",
    tag: "text",
    status: "live" as const,
    isPremium: false,
    href: "/tools/remove-duplicate-lines",
  },
  {
    id: "text-reverser",
    title: "Text Reverser",
    description: "Reverse letters, words, sentences, or line sequences with spacing preservation.",
    tag: "text",
    status: "live" as const,
    isPremium: false,
    href: "/tools/text-reverser",
  },
  {
    id: "text-sorter",
    title: "Text Sorter",
    description: "Sort lines alphabetically, numerically, by length, or random shuffle.",
    tag: "text",
    status: "live" as const,
    isPremium: false,
    href: "/tools/text-sorter",
  },
  {
    id: "random-word-generator",
    title: "Random Word Generator",
    description: "Generate lists of random words based on categories, length, and starting/ending letter.",
    tag: "text",
    status: "live" as const,
    isPremium: false,
    href: "/tools/random-word-generator",
  },
  {
    id: "case-converter",
    title: "Case Converter",
    description: "Convert text between UPPERCASE, lowercase, Title Case, camelCase, and more.",
    tag: "text",
    status: "coming-soon" as const,
    isPremium: false,
    href: "#",
  },
  {
    id: "lorem-ipsum",
    title: "Lorem Ipsum Generator",
    description: "Generate placeholder text in paragraphs, sentences, or words for mockups.",
    tag: "text",
    status: "coming-soon" as const,
    isPremium: false,
    href: "#",
  },
  {
    id: "slug-generator",
    title: "URL Slug Generator",
    description: "Convert titles and text into clean, SEO-friendly URL slugs.",
    tag: "text",
    status: "coming-soon" as const,
    isPremium: false,
    href: "#",
  }
];

export default function TextToolsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 text-white shadow-sm">
            <Type className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-h1 text-foreground">Text Tools</h1>
            <p className="text-body-s text-muted-foreground mt-0.5">
              Format, transform, compare, and generate text with powerful utilities.
            </p>
          </div>
        </div>
        <Badge variant="primary">
          <Sparkles className="h-3 w-3" />
          {textTools.length} tools
        </Badge>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {textTools.map((tool, i) => (
          <ToolCard key={tool.id} index={i} {...tool} />
        ))}
      </motion.div>
    </div>
  );
}
