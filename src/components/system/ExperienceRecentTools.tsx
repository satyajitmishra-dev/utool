"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { History, ArrowRight } from "lucide-react";
import { getToolBySlug } from "@/config/tool-registry";
import { RegistryTool } from "@/types/tool-registry";
import { cn } from "@/utils/cn";

export interface ExperienceRecentToolsProps {
  className?: string;
  limit?: number;
}

export function ExperienceRecentTools({ className, limit = 3 }: ExperienceRecentToolsProps) {
  const [recents, setRecents] = useState<RegistryTool[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      // Fetch user's local tool history
      const historyJson = localStorage.getItem("utool_recent_tools");
      if (historyJson) {
        const slugs: string[] = JSON.parse(historyJson);
        const tools = slugs
          .map((slug) => getToolBySlug(slug))
          .filter((t): t is RegistryTool => !!t && t.isActive);
        setRecents(tools.slice(0, limit));
      } else {
        // Mock fallback if user is new/empty history to make it look full and beautiful
        const fallbackSlugs = ["merge-pdf", "image-compressor", "password-generator"];
        const fallbacks = fallbackSlugs
          .map((slug) => getToolBySlug(slug))
          .filter((t): t is RegistryTool => !!t && t.isActive);
        setRecents(fallbacks.slice(0, limit));
      }
    } catch {
      // ignore
    }
  }, [limit]);

  if (recents.length === 0) return null;

  return (
    <div className={cn("w-full flex flex-col gap-3 text-left", className)}>
      <h4 className="text-xs font-bold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
        <History size={12} />
        Recently Used Tools
      </h4>
      <div className="flex flex-col gap-2">
        {recents.map((tool) => (
          <Link
            key={tool.id}
            href={`/tools/${tool.slug}`}
            className="group flex items-center justify-between p-3 rounded-xl border border-border/80 bg-card/20 hover:bg-card/50 backdrop-blur-xs transition-all duration-300"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-sm">🔧</span>
              <div className="min-w-0">
                <span className="text-xs font-semibold text-foreground block truncate">
                  {tool.name}
                </span>
                <span className="text-[10px] text-muted-foreground block truncate max-w-[200px]">
                  {tool.description}
                </span>
              </div>
            </div>
            <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
          </Link>
        ))}
      </div>
    </div>
  );
}
export default ExperienceRecentTools;
