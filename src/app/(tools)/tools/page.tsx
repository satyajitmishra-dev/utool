"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/cn";
import {
  Search,
  Sparkles,
  TrendingUp,
  ArrowRight,
  FileText,
  Scissors,
  Maximize2,
  Lock,
  LockOpen,
  Image as ImageIcon,
  Camera,
  QrCode,
  Link as LinkIcon,
  User,
  FileCode,
  Video,
  Sliders,
  FileCheck,
  RefreshCw,
  Star,
  Activity,
  Zap,
  Globe,
  Plus
} from "lucide-react";

const categories = ["All", "PDF", "Images", "Developer", "Design", "Converters", "Media"];

const categoryIcons: Record<string, string> = {
  All: "🌐",
  PDF: "📄",
  Images: "🖼",
  Media: "🎬",
  Developer: "💻",
  Design: "🎨",
  Converters: "🔄"
};

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
    id: "protect-pdf",
    name: "Add Password",
    description: "Protect your PDF files with military-grade AES-256 password encryption to prevent unauthorized access.",
    category: "PDF",
    tag: "pdf-add-password",
    status: "live" as const,
    isPremium: false,
    href: "/tools/protect-pdf",
  },
  {
    id: "unlock-pdf",
    name: "Remove Password",
    description: "Unlock protected PDF files. Enter the current password to decrypt and save a clean, accessible copy.",
    category: "PDF",
    tag: "pdf-remove-password",
    status: "live" as const,
    isPremium: false,
    href: "/tools/unlock-pdf",
  },
  {
    id: "image-to-pdf",
    name: "Image to PDF Converter",
    description: "Convert PNG, JPG, JPEG, and WebP images into a single clean PDF document locally.",
    category: "PDF",
    tag: "image-to-pdf",
    status: "live" as const,
    isPremium: false,
    href: "/tools/image-to-pdf",
  },
  {
    id: "pdf-to-jpg",
    name: "PDF to JPG Extractor",
    description: "Extract page pages of any PDF document as separate high-quality JPEG images.",
    category: "PDF",
    tag: "pdf-to-jpg",
    status: "live" as const,
    isPremium: false,
    href: "/tools/pdf-to-jpg",
  },
  {
    id: "jpg-to-pdf",
    name: "JPG to PDF Converter",
    description: "Convert and compile JPG/JPEG photos into an aligned vector PDF.",
    category: "PDF",
    tag: "jpg-to-pdf",
    status: "live" as const,
    isPremium: false,
    href: "/tools/jpg-to-pdf",
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
    id: "webp-converter",
    name: "Image WebP Converter",
    description: "Convert and optimize PNG, JPEG files into WebP format.",
    category: "Images",
    tag: "image-convert",
    status: "live" as const,
    isPremium: false,
    href: "/tools/webp-converter",
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
    id: "css-gradient-generator",
    name: "CSS Gradient Generator",
    description: "Build, preview, and export premium HSL radial CSS gradients.",
    category: "Design",
    tag: "gradient",
    status: "live" as const,
    isPremium: false,
    href: "/tools/css-gradient-generator",
  },
  {
    id: "meta-tag-generator",
    name: "Meta Tag Generator",
    description: "Generate and preview Google Search and social media card meta tags.",
    category: "Developer",
    tag: "meta",
    status: "live" as const,
    isPremium: false,
    href: "/tools/meta-tag-generator",
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
  {
    id: "media-workspace",
    name: "Media Workspace",
    description: "Download, convert, compress, edit, and enhance video and audio files in your browser locally.",
    category: "Media",
    tag: "media",
    status: "live" as const,
    isPremium: false,
    href: "/tools/media-workspace",
  },
];

// Helper to match icons to tools
function getToolIcon(id: string) {
  switch (id) {
    case "pdf-merger":
      return FileText;
    case "pdf-split":
      return Scissors;
    case "pdf-compress":
      return Maximize2;
    case "protect-pdf":
      return Lock;
    case "unlock-pdf":
      return LockOpen;
    case "image-to-pdf":
    case "jpg-to-pdf":
      return ImageIcon;
    case "pdf-to-jpg":
      return Camera;
    case "qr-generator":
      return QrCode;
    case "url-shortener":
      return LinkIcon;
    case "resume-builder":
      return User;
    case "json-formatter":
      return FileCode;
    case "webp-converter":
      return RefreshCw;
    case "image-resize":
      return Sliders;
    case "pdf-extractor":
      return FileCheck;
    case "css-gradient-generator":
      return ImageIcon;
    case "meta-tag-generator":
      return FileCode;
    case "media-workspace":
      return Video;
    default:
      return Sparkles;
  }
}

// Sub-component: LocalToolCard
function LocalToolCard({ tool, idx }: { tool: typeof tools[0]; idx: number }) {
  let gradientClass = "from-indigo-500 to-blue-500";
  let catBadgeColor = "bg-indigo-500/10 text-indigo-600 border-indigo-500/20";
  
  if (tool.category === "PDF") {
    gradientClass = "from-red-500 to-rose-600";
    catBadgeColor = "bg-red-500/10 text-red-600 border-red-500/20";
  } else if (tool.category === "Images") {
    gradientClass = "from-blue-500 to-sky-600";
    catBadgeColor = "bg-blue-500/10 text-blue-600 border-blue-500/20";
  } else if (tool.category === "Media") {
    gradientClass = "from-pink-500 to-rose-500";
    catBadgeColor = "bg-pink-500/10 text-pink-600 border-pink-500/20";
  } else if (tool.category === "Developer") {
    gradientClass = "from-emerald-500 to-teal-600";
    catBadgeColor = "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
  } else if (tool.category === "Design") {
    gradientClass = "from-purple-500 to-indigo-500";
    catBadgeColor = "bg-purple-500/10 text-purple-600 border-purple-500/20";
  } else if (tool.category === "Converters") {
    gradientClass = "from-violet-500 to-fuchsia-600";
    catBadgeColor = "bg-violet-500/10 text-violet-600 border-violet-500/20";
  }

  const IconComponent = getToolIcon(tool.id);

  return (
    <motion.a
      href={tool.href}
      variants={{
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0 }
      }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group relative flex flex-col justify-between h-[260px] rounded-[20px] bg-white border border-[#ECECEC] p-5 hover:border-purple-500 hover:shadow-[0_16px_32px_rgba(99,102,241,0.06)] transition-all select-none overflow-hidden"
    >
      {/* Top Row: Category Badge & Status Badge */}
      <div className="flex justify-between items-center">
        <span className={cn("text-[9px] font-extrabold uppercase tracking-widest border rounded-md px-2.5 py-0.5", catBadgeColor)}>
          {tool.category}
        </span>
        <span className={cn(
          "text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md border",
          tool.status === "live" && "bg-emerald-50 text-emerald-600 border-emerald-200",
          tool.status === "beta" && "bg-amber-50 text-amber-600 border-amber-200",
          tool.status === "pro" && "bg-purple-50 text-purple-600 border-purple-200",
          tool.status === "coming-soon" && "bg-slate-50 text-slate-500 border-slate-200"
        )}>
          {tool.status}
        </span>
      </div>

      {/* Center: Large Icon, Name & Description */}
      <div className="flex flex-col flex-1 justify-center pt-2 pb-2">
        <div className="flex items-center gap-3 mb-2">
          <div className={cn("h-11 w-11 rounded-xl bg-gradient-to-tr flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform duration-300", gradientClass)}>
            <IconComponent className="h-5.5 w-5.5" />
          </div>
          <h3 className="font-extrabold text-[16px] text-[#1A1A1A] leading-tight group-hover:text-purple-600 transition-colors">
            {tool.name}
          </h3>
        </div>
        <p className="text-[13px] text-[#71717A] leading-relaxed line-clamp-2">
          {tool.description}
        </p>
      </div>

      {/* Bottom Row: Local Badge, time & Open link */}
      <div className="flex items-center justify-between border-t border-[#F4F4F5] pt-3.5 mt-auto text-[11px] font-bold text-[#71717A]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md text-[10px]">
            ⚡ Local
          </span>
          <span>&lt;1 sec</span>
        </div>
        <span className="flex items-center gap-1 text-purple-600 group-hover:translate-x-0.5 transition-transform duration-200">
          Open <span className="transform group-hover:rotate-45 transition-transform duration-300">→</span>
        </span>
      </div>
    </motion.a>
  );
}

export default function ToolsCatalogPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter tools based on search and category
  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(search.toLowerCase()) ||
      tool.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || tool.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Focus search input on Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Sections
  const trendingTools = tools.filter((t) => t.id === "media-workspace" || t.id === "pdf-merger" || t.id === "qr-generator");
  const staffPicks = tools.filter((t) => t.id === "webp-converter" || t.id === "url-shortener" || t.id === "css-gradient-generator");
  const newTools = tools.filter((t) => t.id === "resume-builder" || t.id === "meta-tag-generator" || t.id === "pdf-split");

  return (
    <div className="relative min-h-screen bg-[#FAFAFC] text-[#1A1A1A] pb-24 overflow-x-hidden">
      
      {/* Subtle Noise Texture & Gradients */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-indigo-500/[0.03] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] rounded-full bg-purple-500/[0.02] blur-[100px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-8 pt-28 pb-8 space-y-8">
        
        {/* COMPACT PAGE HEADER */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#ECECEC] pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1 bg-purple-50 text-purple-600 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md border border-purple-100">
              <Sparkles className="h-3.5 w-3.5" />
              {tools.length} Available Tools
            </div>
            <h1 className="text-[32px] md:text-[38px] font-black tracking-tight text-[#1A1A1A] leading-none">
              Explore Tools
            </h1>
            <p className="text-[14px] text-[#71717A] font-medium leading-relaxed">
              Everything you need to build, convert, edit and optimize.
            </p>
          </div>

          {/* SEARCH BAR */}
          <div className="relative w-full max-w-[520px] h-[52px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#A1A1AA] transition-colors" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search 200+ tools..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-full bg-white border border-[#ECECEC] rounded-full pl-12 pr-16 text-sm text-[#1A1A1A] placeholder:text-[#A1A1AA] focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5 shadow-xs transition-all"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 select-none pointer-events-none">
              <kbd className="bg-slate-50 border border-slate-200 text-[#71717A] text-[9.5px] font-bold px-1.5 py-0.5 rounded-md shadow-xs">
                ⌘K
              </kbd>
            </div>
          </div>
        </header>

        {/* QUICK STATS INDICATORS */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Active Modules", val: "200+", desc: "compiled WASM segments", icon: Activity, color: "text-purple-600 bg-purple-50" },
            { label: "Online Sync", val: "100%", desc: "available locally offline", icon: Globe, color: "text-indigo-600 bg-indigo-50" },
            { label: "Browser Privacy", val: "0 Uploads", desc: "zero server storage leaks", icon: Lock, color: "text-rose-600 bg-rose-50" },
            { label: "Fast Rendering", val: "<1 sec", desc: "rendered in milliseconds", icon: Zap, color: "text-amber-600 bg-amber-50" }
          ].map((stat, idx) => {
            const StatIcon = stat.icon;
            return (
              <div key={idx} className="bg-white border border-[#ECECEC] rounded-2xl p-4 flex items-center gap-4 hover:shadow-sm transition-all shadow-xs">
                <div className={cn("p-2.5 rounded-xl", stat.color)}>
                  <StatIcon className="h-4.5 w-4.5" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-extrabold text-[#71717A] tracking-wider block">{stat.label}</span>
                  <p className="text-base font-black text-[#1A1A1A] leading-none">{stat.val}</p>
                  <span className="text-[9.5px] text-[#A1A1AA] block">{stat.desc}</span>
                </div>
              </div>
            );
          })}
        </section>

        {/* CATEGORY INTERACTIVE FILTERS */}
        <nav className="flex flex-wrap gap-2 pt-2 border-b border-[#ECECEC] pb-4">
          {categories.map((cat) => {
            const count = cat === "All" ? tools.length : tools.filter(t => t.category === cat).length;
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "flex items-center gap-2 rounded-full px-4.5 py-2.5 text-xs font-bold border transition-all duration-300 cursor-pointer shadow-xs hover:-translate-y-0.5",
                  isSelected
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 border-transparent text-white shadow-md shadow-purple-500/20"
                    : "bg-white border-[#ECECEC] text-[#71717A] hover:text-[#1A1A1A] hover:bg-slate-50 hover:shadow-sm"
                )}
              >
                <span>{categoryIcons[cat] || "🔧"}</span>
                <span>{cat}</span>
                <span className={cn("text-[10px] font-semibold", isSelected ? "text-white opacity-90" : "text-[#A1A1AA]")}>
                  ({count})
                </span>
              </button>
            );
          })}
        </nav>

        {/* HIGHLIGHTED ROWS (Only shown when not searching & All categories selected) */}
        {search === "" && activeCategory === "All" && (
          <div className="space-y-8 pt-2">
            
            {/* ROW 1: TRENDING */}
            <div className="space-y-4">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#71717A] flex items-center gap-2">
                <TrendingUp className="h-4.5 w-4.5 text-purple-600" />
                🔥 Trending Utility Core
              </h2>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.05 }
                  }
                }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {trendingTools.map((tool, idx) => (
                  <LocalToolCard key={tool.id} tool={tool} idx={idx} />
                ))}
              </motion.div>
            </div>

            {/* ROW 2: STAFF PICKS */}
            <div className="space-y-4">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#71717A] flex items-center gap-2">
                <Star className="h-4.5 w-4.5 text-indigo-600 fill-current" />
                ⭐ Editor Staff Picks
              </h2>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.05 }
                  }
                }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {staffPicks.map((tool, idx) => (
                  <LocalToolCard key={tool.id} tool={tool} idx={idx} />
                ))}
              </motion.div>
            </div>

            {/* ROW 3: NEW MODULES */}
            <div className="space-y-4">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#71717A] flex items-center gap-2">
                <Sparkles className="h-4.5 w-4.5 text-rose-600" />
                🆕 Newly Added Engines
              </h2>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.05 }
                  }
                }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {newTools.map((tool, idx) => (
                  <LocalToolCard key={tool.id} tool={tool} idx={idx} />
                ))}
              </motion.div>
            </div>

          </div>
        )}

        {/* FULL TOOL GRID LISTING */}
        <section className="space-y-6 pt-4">
          <div className="flex justify-between items-center border-b border-[#ECECEC] pb-3.5">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#71717A] flex items-center gap-2">
              <Sliders className="h-4.5 w-4.5 text-purple-600" />
              All Marketplace Items ({filteredTools.length})
            </h2>
            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All");
                }}
                className="text-[11px] font-bold text-purple-600 hover:underline"
              >
                Reset Search Filters
              </button>
            )}
          </div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.04
                }
              }
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {filteredTools.length > 0 ? (
              filteredTools.map((tool, idx) => (
                <LocalToolCard key={tool.id} tool={tool} idx={idx} />
              ))
            ) : (
              <div className="col-span-full py-16 text-center">
                <p className="text-sm font-semibold text-[#71717A]">No tools matched your active search query.</p>
                <button
                  onClick={() => {
                    setSearch("");
                    setActiveCategory("All");
                  }}
                  className="mt-3.5 inline-flex items-center justify-center rounded-xl bg-purple-600 text-white font-bold px-4 py-2 text-xs shadow-xs"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Clear All Filters
                </button>
              </div>
            )}
          </motion.div>
        </section>
      </div>
    </div>
  );
}
