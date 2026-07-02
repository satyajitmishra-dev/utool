"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  FileText, Scissors, FileCode, QrCode, Key, Eye, Palette, 
  Ruler, LayoutGrid, Sparkles, TrendingUp, ShieldCheck
} from "lucide-react";
import { getAllTools } from "@/config/tool-registry";
import { RegistryTool } from "@/types/tool-registry";
import { cn } from "@/utils/cn";

// Static mapping of registry icon tags to Lucide components for SSR-safety
const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  FileText: FileText,
  Scissors: Scissors,
  FileCode: FileCode,
  QrCode: QrCode,
  Key: Key,
  Eye: Eye,
  Palette: Palette,
  Ruler: Ruler,
};

export interface ExperienceRecommendationsProps {
  className?: string;
  limit?: number;
}

export function ExperienceRecommendations({ className, limit = 4 }: ExperienceRecommendationsProps) {
  const [activeTab, setActiveTab] = useState<"popular" | "trending" | "privacy">("popular");

  // Fetch all active tools
  const allTools = getAllTools().filter((t) => t.isActive);

  // Group or filter tools based on criteria
  const getToolsByTab = () => {
    switch (activeTab) {
      case "trending":
        // Simulated trending list
        const trendingSlugs = ["pdf-ocr", "url-shortener", "password-generator", "qr-generator"];
        return allTools.filter((t) => trendingSlugs.includes(t.slug));
      case "privacy":
        // Client-side execution
        return allTools.filter((t) => !t.requiresAuth).slice(0, 4);
      case "popular":
      default:
        const popularSlugs = ["merge-pdf", "split-pdf", "image-compressor", "password-generator"];
        const matched = allTools.filter((t) => popularSlugs.includes(t.slug));
        // Fallback to first few if registry slugs don't match
        return matched.length > 0 ? matched : allTools.slice(0, 4);
    }
  };

  const toolsToRender = getToolsByTab().slice(0, limit);

  const renderIcon = (iconName: string) => {
    const IconComponent = ICON_MAP[iconName] || LayoutGrid;
    return <IconComponent size={20} className="text-primary group-hover:scale-110 transition-transform duration-300" />;
  };

  return (
    <div className={cn("w-full flex flex-col gap-4", className)}>
      {/* Category Tabs */}
      <div className="flex border-b border-border/40 p-0.5 max-w-sm mx-auto bg-muted/30 rounded-full gap-0.5 sm:gap-1">
        <button
          onClick={() => setActiveTab("popular")}
          className={cn(
            "flex-1 px-2 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer",
            activeTab === "popular"
              ? "bg-card text-foreground shadow-xs border border-border/40"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Sparkles size={11} className="sm:w-3 sm:h-3" />
          Popular
        </button>
        <button
          onClick={() => setActiveTab("trending")}
          className={cn(
            "flex-1 px-2 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer",
            activeTab === "trending"
              ? "bg-card text-foreground shadow-xs border border-border/40"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <TrendingUp size={11} className="sm:w-3 sm:h-3" />
          Trending
        </button>
        <button
          onClick={() => setActiveTab("privacy")}
          className={cn(
            "flex-1 px-2 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer",
            activeTab === "privacy"
              ? "bg-card text-foreground shadow-xs border border-border/40"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <ShieldCheck size={11} className="sm:w-3 sm:h-3" />
          100% Safe
        </button>
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {toolsToRender.map((tool) => (
          <Link
            key={tool.id}
            href={`/tools/${tool.slug}`}
            className="group glass-card p-4 rounded-2xl border border-border/80 bg-card/30 hover:bg-card/60 hover:border-primary/20 backdrop-blur-xs flex flex-col gap-2 hover:-translate-y-0.5 transition-all duration-300 shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                {renderIcon(tool.iconTag)}
              </div>
              <div className="text-left flex-1 min-w-0">
                <h4 className="font-semibold text-xs text-foreground truncate">{tool.name}</h4>
                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                  {tool.category}
                </span>
              </div>
            </div>
            <p className="text-left text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
              {tool.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
export default ExperienceRecommendations;
