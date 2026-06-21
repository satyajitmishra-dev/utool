"use client";

import React from "react";
import { motion } from "framer-motion";
import { ToolCard } from "@/components/ui/tool-card";
import { Badge } from "@/components/ui/badge";
import { stagger } from "@/components/ui/section";
import { useToolLimit } from "@/hooks/use-tool-limit";
import { Sparkles, FileText } from "lucide-react";

export default function PDFToolsHubPage() {
  const { limitStatus, loading } = useToolLimit();

  const tools = [
    {
      title: "Merge PDF",
      description: "Combine multiple PDF files in any order. Drag, drop, rearrange, and compile into a single structured document instantly.",
      href: "/tools/merge-pdf",
      tag: "pdf-merge",
      status: "live" as const,
    },
    {
      title: "Split PDF",
      description: "Extract specific page sequences from a single document. Add custom range blocks and download a clean split output.",
      href: "/tools/split-pdf",
      tag: "pdf-split",
      status: "coming-soon" as const,
    },
    {
      title: "Compress PDF",
      description: "Shrink PDF file sizes client-side. Strips incremental edit histories, cleans structures, and encodes compact object streams.",
      href: "/tools/compress-pdf",
      tag: "pdf-compress",
      status: "coming-soon" as const,
    },
  ];

  return (
    <div className="space-y-10 flex-1 flex flex-col justify-center">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-3.5">
        <Badge variant="primary">
          <Sparkles className="h-3 w-3" />
          100% Client-Side Compiler
        </Badge>
        <h1 className="text-h1 text-foreground">
          utool PDF Workstation
        </h1>
        <p className="text-body-s text-muted-foreground leading-relaxed">
          Supercharge your PDF workflows with zero server latency. Your documents are compiled directly on your device, ensuring maximum confidentiality and speed.
        </p>
      </div>

      {/* Tool Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full mx-auto"
      >
        {tools.map((tool, i) => (
          <ToolCard key={tool.tag} index={i} {...tool} />
        ))}
      </motion.div>

      {/* Daily Limits */}
      {!loading && limitStatus.tier === "free" && (
        <div className="text-center">
          <p className="text-caption text-muted-foreground uppercase tracking-wider">
            Daily limit: {limitStatus.count} / {limitStatus.max} actions completed today.
            {limitStatus.resetAt && ` Reset at ${new Date(limitStatus.resetAt).toLocaleTimeString()}`}
          </p>
        </div>
      )}
    </div>
  );
}
