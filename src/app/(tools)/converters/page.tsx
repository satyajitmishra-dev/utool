"use client";

import React from "react";
import { motion } from "framer-motion";
import { ToolCard } from "@/components/ui/tool-card";
import { Badge } from "@/components/ui/badge";
import { stagger } from "@/components/ui/section";
import { ArrowLeftRight, Sparkles } from "lucide-react";

const converterTools = [
  {
    id: "json-csv",
    title: "JSON to CSV",
    description: "Convert JSON arrays and objects to clean, downloadable CSV spreadsheets.",
    tag: "converter",
    status: "live" as const,
    isPremium: false,
    href: "/tools/csv-to-json-converter",
  },
  {
    id: "csv-json",
    title: "CSV to JSON",
    description: "Parse CSV files into structured JSON output with type detection.",
    tag: "converter",
    status: "live" as const,
    isPremium: false,
    href: "/tools/csv-to-json-converter",
  },
  {
    id: "markdown-html",
    title: "Markdown to HTML",
    description: "Convert Markdown documents to clean, semantic HTML with syntax highlighting.",
    tag: "converter",
    status: "coming-soon" as const,
    isPremium: false,
    href: "#",
  },
  {
    id: "html-markdown",
    title: "HTML to Markdown",
    description: "Convert web pages and HTML content into clean Markdown format.",
    tag: "converter",
    status: "coming-soon" as const,
    isPremium: false,
    href: "#",
  },
  {
    id: "yaml-json",
    title: "YAML to JSON",
    description: "Convert YAML configuration files to JSON format with validation.",
    tag: "converter",
    status: "coming-soon" as const,
    isPremium: false,
    href: "#",
  },
  {
    id: "base64",
    title: "Base64 Encoder/Decoder",
    description: "Encode and decode text, files, and images to and from Base64 format.",
    tag: "converter",
    status: "coming-soon" as const,
    isPremium: false,
    href: "#",
  },
];

export default function ConvertersPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 text-white shadow-sm">
            <ArrowLeftRight className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-h1 text-foreground">Converters</h1>
            <p className="text-body-s text-muted-foreground mt-0.5">
              Transform data between formats — JSON, CSV, YAML, Markdown, HTML, and more.
            </p>
          </div>
        </div>
        <Badge variant="primary">
          <Sparkles className="h-3 w-3" />
          {converterTools.length} tools
        </Badge>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {converterTools.map((tool, i) => (
          <ToolCard key={tool.id} index={i} {...tool} />
        ))}
      </motion.div>
    </div>
  );
}
