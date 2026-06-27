"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { getToolBySlug } from "@/config/tool-registry";

interface ToolEmbedProps {
  slug: string;
}

export function ToolEmbed({ slug }: ToolEmbedProps) {
  const tool = getToolBySlug(slug);
  if (!tool) return null;

  return (
    <div className="my-8 p-6 rounded-3xl border border-neutral-800 bg-neutral-900/10 hover:border-violet-500/35 transition-colors group text-left">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1 text-xs font-semibold text-violet-400">
            <Sparkles className="h-3.5 w-3.5" />
            Live Utility Link
          </div>
          <h3 className="text-sm font-bold text-white group-hover:text-violet-400 transition-colors">
            Try {tool.name} Online
          </h3>
          <p className="text-xs text-neutral-400 max-w-xl leading-relaxed">
            {tool.description}
          </p>
        </div>
        <Link
          href={`/tools/${tool.slug}`}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 px-4 py-2.5 text-xs font-bold text-white transition-all whitespace-nowrap shadow-sm"
        >
          Open {tool.name}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
