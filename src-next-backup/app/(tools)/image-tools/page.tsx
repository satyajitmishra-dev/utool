"use client";

import React from "react";
import { motion } from "framer-motion";
import { ToolCard } from "@/components/ui/tool-card";
import { Badge } from "@/components/ui/badge";
import { stagger } from "@/components/ui/section";
import { ImageIcon, Sparkles } from "lucide-react";

const imageTools = [
  {
    id: "image-converter",
    title: "Image WebP Converter",
    description: "Convert and optimize PNG, JPEG files into WebP format with quality control.",
    tag: "image-convert",
    status: "live" as const,
    isPremium: false,
    href: "/image-tools",
  },
  {
    id: "image-resize",
    title: "Smart Image Resizer",
    description: "Crop, resize, and optimize multiple images with pixel-perfect resolution grids.",
    tag: "image-resize",
    status: "pro" as const,
    isPremium: true,
    href: "/premium-tools",
  },
  {
    id: "bg-remover",
    title: "Background Remover",
    description: "Remove image backgrounds with AI-powered edge detection in seconds.",
    tag: "background-remover",
    status: "coming-soon" as const,
    isPremium: true,
    href: "#",
  },
  {
    id: "image-compress",
    title: "Image Compressor",
    description: "Reduce image file sizes by up to 80% while maintaining visual quality.",
    tag: "compress",
    status: "coming-soon" as const,
    isPremium: false,
    href: "#",
  },
];

export default function ImageToolsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-sm">
            <ImageIcon className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-h1 text-foreground">Image Tools</h1>
            <p className="text-body-s text-muted-foreground mt-0.5">
              Convert, resize, compress, and optimize images in any format.
            </p>
          </div>
        </div>
        <Badge variant="primary">
          <Sparkles className="h-3 w-3" />
          {imageTools.length} tools
        </Badge>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {imageTools.map((tool, i) => (
          <ToolCard key={tool.id} index={i} {...tool} />
        ))}
      </motion.div>
    </div>
  );
}
