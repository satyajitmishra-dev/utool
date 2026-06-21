"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ToolCard } from "@/components/ui/tool-card";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { stagger } from "@/components/ui/section";
import { cn } from "@/utils/cn";
import { Search, Sparkles, TrendingUp } from "lucide-react";

const categories = ["All", "PDF", "Images", "Developer", "Design", "Text", "Converters"];

const tools = [
  {
    id: "pdf-merger",
    name: "PDF Compiler & Merger",
    description: "Combine multiple PDF pages into a single document structure.",
    category: "PDF",
    tag: "merge",
    status: "live" as const,
    isPremium: false,
    href: "/pdf-tools/merge",
  },
  {
    id: "pdf-split",
    name: "PDF Splitter",
    description: "Split PDF documents by page range or extract individual pages.",
    category: "PDF",
    tag: "split",
    status: "live" as const,
    isPremium: false,
    href: "/pdf-tools/split",
  },
  {
    id: "pdf-compress",
    name: "PDF Compressor",
    description: "Reduce PDF file sizes while maintaining document quality.",
    category: "PDF",
    tag: "compress",
    status: "live" as const,
    isPremium: false,
    href: "/pdf-tools/compress",
  },
  {
    id: "qr-generator",
    name: "QR Code Generator",
    description: "Generate customized QR codes for URLs, text, email, and Wi-Fi.",
    category: "Developer",
    tag: "qr",
    status: "live" as const,
    isPremium: false,
    href: "/qr-generator",
  },
  {
    id: "url-shortener",
    name: "Short Link Creator",
    description: "Create, track, and manage clean short links with analytics.",
    category: "Developer",
    tag: "url-shortener",
    status: "live" as const,
    isPremium: false,
    href: "/url-shortener",
  },
  {
    id: "resume-builder",
    name: "Resume Builder",
    description: "Design and print professional resumes with clean templates.",
    category: "Design",
    tag: "resume-builder",
    status: "beta" as const,
    isPremium: false,
    href: "/resume-builder",
  },
  {
    id: "json-formatter",
    name: "JSON Formatter",
    description: "Format, validate, and beautify raw JSON with syntax checks.",
    category: "Developer",
    tag: "json",
    status: "live" as const,
    isPremium: false,
    href: "/tools/json-formatter",
  },
  {
    id: "image-converter",
    name: "Image WebP Converter",
    description: "Convert and optimize PNG, JPEG files into WebP format.",
    category: "Images",
    tag: "image-convert",
    status: "live" as const,
    isPremium: false,
    href: "/image-tools",
  },
  {
    id: "image-resize",
    name: "Smart Image Resizer",
    description: "Crop and adjust pixel resolutions of multiple photos instantly.",
    category: "Images",
    tag: "image-resize",
    status: "pro" as const,
    isPremium: true,
    href: "/premium-tools",
  },
  {
    id: "pdf-extractor",
    name: "PDF Text Extractor",
    description: "Extract text elements and layout fields using server OCR.",
    category: "PDF",
    tag: "extractor",
    status: "pro" as const,
    isPremium: true,
    href: "/premium-tools",
  },
  {
    id: "gradient-maker",
    name: "CSS Gradient Generator",
    description: "Build, preview, and export premium HSL radial CSS gradients.",
    category: "Design",
    tag: "gradient",
    status: "live" as const,
    isPremium: false,
    href: "/tools/gradient-maker",
  },
  {
    id: "markdown-html",
    name: "Markdown to HTML",
    description: "Convert markdown documents to clean, semantic HTML output.",
    category: "Converters",
    tag: "converter",
    status: "coming-soon" as const,
    isPremium: false,
    href: "/converters",
  },
];

export default function ToolsCatalogPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(search.toLowerCase()) ||
      tool.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || tool.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const trendingTools = tools.filter((t) => t.status === "live").slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-h1 text-foreground">Explore Tools</h1>
          <p className="text-body-s text-muted-foreground mt-1">
            Discover, search, and launch dozens of productivity tools in one workspace.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="primary">
            <Sparkles className="h-3 w-3" />
            {tools.length} tools available
          </Badge>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Input
            placeholder="Search tools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="h-4 w-4" />}
          />
        </div>

        <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "rounded-xl px-4 py-2 text-xs font-semibold border transition-all duration-200",
                activeCategory === cat
                  ? "bg-primary border-primary text-primary-foreground shadow-sm"
                  : "bg-card border-border text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Trending */}
      {search === "" && activeCategory === "All" && (
        <div className="space-y-3">
          <h2 className="text-body-s font-semibold text-muted-foreground flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Trending this week
          </h2>
          <div className="flex flex-wrap gap-2">
            {trendingTools.map((tool) => (
              <a
                key={tool.id}
                href={tool.href}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted hover:border-primary/20 transition-all"
              >
                {tool.name}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Tool Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {filteredTools.length > 0 ? (
          filteredTools.map((tool, i) => (
            <ToolCard
              key={tool.id}
              title={tool.name}
              description={tool.description}
              href={tool.href}
              tag={tool.tag}
              status={tool.status}
              isPremium={tool.isPremium}
              index={i}
            />
          ))
        ) : (
          <div className="col-span-full">
            <EmptyState
              preset="no-results"
              action={{
                label: "Clear filters",
                onClick: () => {
                  setSearch("");
                  setActiveCategory("All");
                },
              }}
            />
          </div>
        )}
      </motion.div>
    </div>
  );
}
