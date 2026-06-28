"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { cn } from "@/utils/cn";
import { TOOL_REGISTRY, FUNCTIONAL_SLUGS } from "@/config/tool-registry";
import { RegistryTool, ToolCategory } from "@/types/tool-registry";
import {
  Search,
  Sparkles,
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
  Activity,
  Zap,
  Globe,
  Plus,
  Crop,
  Scale,
  Music,
  RotateCcw,
  Trash2,
  PenTool,
  EyeOff,
  FileImage,
  Gauge,
  Cpu,
  Layers,
  Shield,
  Laptop
} from "lucide-react";

// Get unique categories from registry, plus "All", "PRO", and "Upcoming"
const categories = ["All", "PRO", "Upcoming", ...Array.from(new Set(TOOL_REGISTRY.map(t => t.category)))];

const categoryIcons: Record<string, string> = {
  All: "🌐",
  PRO: "👑",
  Upcoming: "⏳",
  PDF: "📄",
  Image: "🖼️",
  Media: "🎬",
  Developer: "💻",
  AI: "🤖",
  Text: "📝",
  Documents: "📁",
  Calculators: "🧮",
  Converters: "🔄",
  Color: "🎨",
  SEO: "🔍",
  Security: "🛡️",
  Finance: "💵",
  Utilities: "🛠️"
};

// Helper to match icons to tools based on iconTag string in registry
function getToolIcon(iconTag: string) {
  switch (iconTag) {
    case "FileText": return FileText;
    case "Scissors": return Scissors;
    case "Maximize2": return Maximize2;
    case "Lock": return Lock;
    case "LockOpen": return LockOpen;
    case "ImageIcon": return ImageIcon;
    case "Camera": return Camera;
    case "QrCode": return QrCode;
    case "LinkIcon": return LinkIcon;
    case "User": return User;
    case "FileCode": return FileCode;
    case "RefreshCw": return RefreshCw;
    case "Sliders": return Sliders;
    case "Video": return Video;
    case "FileCheck": return FileCheck;
    case "Crop": return Crop;
    case "Scale": return Scale;
    case "Music": return Music;
    case "RotateCcw": return RotateCcw;
    case "Trash2": return Trash2;
    case "PenTool": return PenTool;
    case "EyeOff": return EyeOff;
    case "FileImage": return FileImage;
    case "Gauge": return Gauge;
    case "Cpu": return Cpu;
    case "Layers": return Layers;
    case "Shield": return Shield;
    case "Laptop": return Laptop;
    default: return Sparkles;
  }
}

function LocalToolCard({ tool, idx }: { tool: RegistryTool; idx: number }) {
  const categoryGradients: Record<string, string> = {
    PDF: "from-red-500 to-rose-600",
    Image: "from-blue-500 to-sky-600",
    Media: "from-pink-500 to-rose-500",
    Developer: "from-indigo-500 to-blue-500",
    AI: "from-purple-500 to-indigo-600",
    Text: "from-amber-500 to-orange-600",
    Documents: "from-emerald-500 to-teal-600",
    Calculators: "from-cyan-500 to-blue-600",
    Converters: "from-violet-500 to-fuchsia-600",
    Color: "from-teal-500 to-emerald-600",
    SEO: "from-orange-500 to-amber-600",
    Security: "from-zinc-700 to-slate-800",
    Finance: "from-green-500 to-emerald-600",
    Utilities: "from-emerald-500 to-teal-600",
  };

  const categoryBadgeColors: Record<string, string> = {
    PDF: "bg-red-500/10 text-red-600 border-red-500/20",
    Image: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    Media: "bg-pink-500/10 text-pink-600 border-pink-500/20",
    Developer: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
    AI: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    Text: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    Documents: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    Calculators: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
    Converters: "bg-violet-500/10 text-violet-600 border-violet-500/20",
    Color: "bg-teal-500/10 text-teal-600 border-teal-500/20",
    SEO: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    Security: "bg-zinc-700/10 text-zinc-600 border-zinc-700/20",
    Finance: "bg-green-500/10 text-green-600 border-green-500/20",
    Utilities: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  };

  const gradientClass = categoryGradients[tool.category] || "from-indigo-500 to-blue-500";
  const catBadgeColor = categoryBadgeColors[tool.category] || "bg-indigo-500/10 text-indigo-600 border-indigo-500/20";

  const IconComponent = getToolIcon(tool.iconTag);
  const isPremium = tool.isPremium;
  const isLive = tool.status === "Live";

  const getLifecycleBadge = (lifecycle: string) => {
    switch (lifecycle) {
      case "Live":
        return <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded-md">🟢 Live</span>;
      case "Testing":
        return <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded-md">🔵 Testing</span>;
      case "In Progress":
        return <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase bg-orange-50 text-orange-600 border border-orange-200 px-2 py-0.5 rounded-md">🟠 Progress</span>;
      case "Planned":
        return <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase bg-purple-50 text-purple-600 border border-purple-200 px-2 py-0.5 rounded-md">🟣 Planned</span>;
      case "Beta":
        return <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase bg-cyan-50 text-cyan-600 border border-cyan-200 px-2 py-0.5 rounded-md">👑 Beta</span>;
      case "Deprecated":
        return <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase bg-zinc-50 text-zinc-600 border border-zinc-200 px-2 py-0.5 rounded-md">⚠️ Depr</span>;
      case "Broken":
        return <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-md">🔴 Broken</span>;
      default:
        return <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase bg-zinc-50 text-zinc-600 border border-zinc-200 px-2 py-0.5 rounded-md">⚫ Hidden</span>;
    }
  };

  return (
    <motion.a
      href={`/tools/${tool.slug}`}
      variants={{
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0 }
      }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group relative flex flex-col justify-between h-[270px] rounded-[20px] bg-white border border-[#ECECEC] p-5 hover:border-purple-500 hover:shadow-[0_16px_32px_rgba(99,102,241,0.06)] transition-all select-none overflow-hidden"
    >
      <div className="flex justify-between items-center">
        <span className={cn("text-[9px] font-extrabold uppercase tracking-widest border rounded-md px-2.5 py-0.5", catBadgeColor)}>
          {tool.primaryTag}
        </span>
        <div className="flex items-center gap-1">
          {isPremium && (
            <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md border bg-purple-50 text-purple-600 border-purple-200">
              Pro
            </span>
          )}
          {getLifecycleBadge(tool.status || "Planned")}
        </div>
      </div>

      <div className="flex flex-col flex-1 justify-center pt-2 pb-2">
        <div className="flex items-center gap-3 mb-1">
          <div className={cn("h-11 w-11 rounded-xl bg-gradient-to-tr flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform duration-300", gradientClass)}>
            <IconComponent className="h-5.5 w-5.5" />
          </div>
          <div className="flex flex-col">
            <h3 className="font-extrabold text-[15px] text-[#1A1A1A] leading-tight group-hover:text-purple-600 transition-colors">
              {tool.name}
            </h3>
          </div>
        </div>

        {tool.completion !== undefined && tool.completion < 100 && (
          <div className="w-full mt-1.5 mb-2 select-none">
            <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground mb-0.5">
              <span>{tool.completion}% Complete</span>
            </div>
            <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden border border-slate-200/50">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
                style={{ width: `${tool.completion}%` }}
              />
            </div>
          </div>
        )}

        <p className="text-[12px] text-[#71717A] leading-relaxed line-clamp-2 mt-1">
          {tool.description}
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-[#F4F4F5] pt-3 mt-auto text-[11px] font-bold text-[#71717A]">
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

function ToolsGrid() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filterParam = searchParams?.get("filter");
  
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [toolOverrides, setToolOverrides] = useState<Record<string, any>>({});
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Initialize filter from URL
  useEffect(() => {
    if (filterParam) {
      // Find case-insensitive match for category
      const match = categories.find(c => c.toLowerCase() === filterParam.toLowerCase());
      if (match) setActiveCategory(match);
    }
  }, [filterParam]);

  useEffect(() => {
    // Fetch live statuses from API
    fetch("/api/tools?limit=500")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.tools) {
          const map: Record<string, any> = {};
          data.tools.forEach((t: any) => {
            map[t.slug] = t;
          });
          setToolOverrides(map);
        }
      })
      .catch((err) => console.error("Error fetching tool statuses for marketplace:", err));
  }, []);

  const setCategoryFilter = (cat: string) => {
    setActiveCategory(cat);
    if (cat === "All") {
      router.push("/tools", { scroll: false });
    } else {
      router.push(`/tools?filter=${cat.toLowerCase()}`, { scroll: false });
    }
  };

  const filteredTools = TOOL_REGISTRY.map(tool => {
    const override = toolOverrides[tool.slug] || {};
    const status = override.status || (FUNCTIONAL_SLUGS.has(tool.slug) ? "Live" : "Planned");
    const completion = override.completion !== undefined ? override.completion : (FUNCTIONAL_SLUGS.has(tool.slug) ? 100 : 0);

    return {
      ...tool,
      status,
      completion,
      isPremium: override.isPremium !== undefined ? override.isPremium : tool.isPremium,
    };
  }).filter((tool) => {
    // Hide intent variants from the main catalog list to avoid repetition
    if (tool.intentVariant || tool.parentToolSlug) return false;

    // Completely hide Hidden status tools from public view
    if (tool.status === "Hidden") return false;

    const matchesSearch =
      tool.name.toLowerCase().includes(search.toLowerCase()) ||
      tool.description.toLowerCase().includes(search.toLowerCase());
      
    const isFunctional = tool.status === "Live" || tool.status === "Beta";

    if (activeCategory === "Upcoming") {
      return !isFunctional && matchesSearch;
    }

    // Hide upcoming tools from all other views (unless they are Beta/Live)
    if (!isFunctional && activeCategory !== "All") {
      return false;
    }

    const matchesCategory =
      activeCategory === "All" ||
      (activeCategory === "PRO" && tool.isPremium) ||
      tool.category === activeCategory;
    
    return tool.isActive && matchesSearch && matchesCategory;
  });

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

  return (
    <>
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#ECECEC] pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1 bg-purple-50 text-purple-600 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md border border-purple-100">
            <Sparkles className="h-3.5 w-3.5" />
            {TOOL_REGISTRY.length} Available Tools
          </div>
          <h1 className="text-[32px] md:text-[38px] font-black tracking-tight text-[#1A1A1A] leading-none">
            Explore Tools
          </h1>
          <p className="text-[14px] text-[#71717A] font-medium leading-relaxed">
            Everything you need to build, convert, edit and optimize.
          </p>
        </div>

        <div className="relative w-full max-w-[520px] h-[52px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#A1A1AA] transition-colors" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search all tools..."
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

      <nav className="flex flex-wrap gap-2 pt-8 pb-4">
        {categories.map((cat) => {
          const count = cat === "All" 
            ? TOOL_REGISTRY.length 
            : cat === "PRO"
              ? TOOL_REGISTRY.filter(t => t.isPremium).length
              : TOOL_REGISTRY.filter(t => t.category === cat).length;
          const isSelected = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
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
                setCategoryFilter("All");
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
            visible: { opacity: 1, transition: { staggerChildren: 0.04 } }
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
                  setCategoryFilter("All");
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
    </>
  );
}

export default function ToolsCatalogPage() {
  return (
    <div className="relative min-h-screen bg-[#FAFAFC] text-[#1A1A1A] pb-24 overflow-x-hidden">
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-indigo-500/[0.03] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] rounded-full bg-purple-500/[0.02] blur-[100px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-8 pt-28 pb-8 space-y-8">
        <Suspense fallback={<div className="min-h-screen" />}>
          <ToolsGrid />
        </Suspense>
      </div>
    </div>
  );
}
