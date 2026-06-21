"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ToolCard } from "@/components/ui/tool-card";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { stagger } from "@/components/ui/section";
import { cn } from "@/utils/cn";
import { Search, Sparkles, TrendingUp, ArrowRight } from "lucide-react";

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
    href: "/tools/merge-pdf",
  },
  {
    id: "pdf-split",
    name: "PDF Splitter",
    description: "Split PDF documents by page range or extract individual pages.",
    category: "PDF",
    tag: "split",
    status: "live" as const,
    isPremium: false,
    href: "/tools/split-pdf",
  },
  {
    id: "pdf-compress",
    name: "PDF Compressor",
    description: "Reduce PDF file sizes while maintaining document quality.",
    category: "PDF",
    tag: "compress",
    status: "live" as const,
    isPremium: false,
    href: "/tools/compress-pdf",
  },
  {
    id: "qr-generator",
    name: "QR Code Generator",
    description: "Generate customized QR codes for URLs, text, email, and Wi-Fi.",
    category: "Developer",
    tag: "qr",
    status: "live" as const,
    isPremium: false,
    href: "/tools/qr-generator",
  },
  {
    id: "url-shortener",
    name: "Short Link Creator",
    description: "Create, track, and manage clean short links with analytics.",
    category: "Developer",
    tag: "url-shortener",
    status: "live" as const,
    isPremium: false,
    href: "/tools/url-shortener",
  },
  {
    id: "resume-builder",
    name: "Resume Builder",
    description: "Design and print professional resumes with clean templates.",
    category: "Design",
    tag: "resume-builder",
    status: "beta" as const,
    isPremium: false,
    href: "/tools/resume-builder",
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
    <div className="space-y-10 pb-16">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card/25 p-8 md:p-12 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        {/* Decorative background gradients */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-80 w-80 rounded-full bg-secondary/5 blur-3xl" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
          {/* Left: Text Content */}
          <div className="lg:col-span-3 space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs font-semibold text-primary uppercase tracking-wide">
              <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
              {tools.length} Tools Available
            </div>
            <h1 className="text-display-l font-extrabold tracking-tight text-foreground leading-tight">
              Explore <span className="gradient-text bg-gradient-to-r from-primary via-secondary to-accent">Powerful Tools</span>
            </h1>
            <p className="text-body-m text-muted-foreground max-w-lg leading-relaxed">
              Everything you need to build, convert, create, and optimize — in one premium, high-speed workspace.
            </p>
          </div>

          {/* Right: Quick Stats Card */}
          <div className="lg:col-span-2">
            <div className="glass-card rounded-2xl border border-border/80 p-6 bg-card/60 shadow-[0_4px_30px_rgba(0,0,0,0.03)] backdrop-blur-xl space-y-4 hover:border-primary/20 transition-all duration-300">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Workspace Overview</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <span className="text-2xs text-muted-foreground block font-medium">Active Tools</span>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                    <span className="text-xl font-extrabold text-foreground">
                      {tools.filter(t => t.status === "live" || t.status === "beta" || t.status === "pro").length}
                    </span>
                  </div>
                </div>
                <div className="space-y-1 border-l border-border pl-4">
                  <span className="text-2xs text-muted-foreground block font-medium">Free Uses</span>
                  <span className="text-xl font-extrabold text-foreground">3 / Day</span>
                </div>
                <div className="space-y-1 border-l border-border pl-4">
                  <span className="text-2xs text-muted-foreground block font-medium">Pro Access</span>
                  <span className="text-xl font-extrabold text-primary">60+ Perks</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Category Filter - Command Bar Styled */}
      <div className="sticky top-16 z-20 -mx-4 px-4 py-4 backdrop-blur-md bg-background/80 border-b border-border/40 transition-all duration-300">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
            <input
              type="text"
              placeholder="Type to search all utility tools..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-card/40 border border-border focus:border-primary/50 rounded-2xl py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all duration-200 shadow-sm"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground hover:text-foreground bg-muted px-2 py-1 rounded-lg transition-colors cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "rounded-full px-4 py-2.5 text-xs font-semibold border transition-all duration-250 cursor-pointer whitespace-nowrap",
                  activeCategory === cat
                    ? "bg-primary border-primary text-primary-foreground shadow-[0_2px_12px_rgba(99,102,241,0.2)]"
                    : "bg-card/50 border-border text-muted-foreground hover:text-foreground hover:bg-muted/70 hover:border-border-subtle"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Trending Section */}
      {search === "" && activeCategory === "All" && (
        <div className="space-y-4 p-6 rounded-3xl border border-border bg-card/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-primary/2 blur-2xl" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary animate-pulse" />
            Trending this week
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {trendingTools.map((tool) => (
              <a
                key={tool.id}
                href={tool.href}
                className="group relative flex flex-col justify-between rounded-2xl border border-border/60 bg-card/40 p-4.5 hover:border-primary/30 hover:bg-card/85 hover:shadow-[0_4px_20px_rgba(99,102,241,0.05)] transition-all duration-250"
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-primary bg-primary/5 border border-primary/10 rounded-md px-1.5 py-0.5">
                      {tool.category}
                    </span>
                    <Sparkles className="h-3.5 w-3.5 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                  <h3 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors duration-200">
                    {tool.name}
                  </h3>
                  <p className="text-body-s text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                    {tool.description}
                  </p>
                </div>
                <div className="mt-3 flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-primary">
                  <span>Open Tool</span>
                  <ArrowRight className="h-3 w-3 transform group-hover:translate-x-1 transition-transform" />
                </div>
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
