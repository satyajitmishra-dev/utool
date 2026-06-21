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
    title: "Word Counter",
    description: "Count words, characters, sentences, and paragraphs with reading time estimate.",
    tag: "text",
    status: "coming-soon" as const,
    isPremium: false,
    href: "#",
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
    id: "text-diff",
    title: "Text Diff Checker",
    description: "Compare two text blocks and highlight differences line by line.",
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
  },
  {
    id: "text-formatter",
    title: "Text Formatter",
    description: "Clean, format, and transform text — remove duplicates, sort, trim whitespace.",
    tag: "text",
    status: "coming-soon" as const,
    isPremium: false,
    href: "#",
  },
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
