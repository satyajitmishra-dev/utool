"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Lock,
  Sparkles,
  Merge,
  Scissors,
  Minimize2,
  QrCode,
  Link as LinkIcon,
  FileUser,
  FileText,
  Image as ImageIcon,
  Code2,
  Compass,
  Type,
  RefreshCw,
  Palette,
  Hash,
  FileJson,
  Table,
  FileCode,
  Braces,
  ScanText,
  Ruler,
  ImageDown,
  Eraser,
  ArrowLeftRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ─── Icon Map ─── */
const iconMap: Record<string, LucideIcon> = {
  merge: Merge,
  split: Scissors,
  compress: Minimize2,
  qr: QrCode,
  shortener: LinkIcon,
  url: LinkIcon,
  link: LinkIcon,
  resume: FileUser,
  builder: FileUser,
  pdf: FileText,
  image: ImageIcon,
  code: Code2,
  design: Compass,
  text: Type,
  convert: RefreshCw,
  color: Palette,
  hash: Hash,
  json: FileJson,
  csv: Table,
  html: FileCode,
  markdown: Braces,
  ocr: ScanText,
  resize: Ruler,
  "image-resize": Ruler,
  "image-download": ImageDown,
  "image-convert": RefreshCw,
  "background-remover": Eraser,
  converter: ArrowLeftRight,
  extractor: ScanText,
  palette: Palette,
  gradient: Palette,
};

function resolveIcon(tag: string): LucideIcon {
  const t = tag.toLowerCase();
  for (const [key, icon] of Object.entries(iconMap)) {
    if (t.includes(key)) return icon;
  }
  return Compass;
}

/* ─── Animation ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as const },
  }),
};

/* ─── Props ─── */
export interface ToolCardProps {
  title: string;
  description: string;
  href: string;
  tag: string;
  status: "live" | "beta" | "coming-soon" | "pro";
  isPremium?: boolean;
  index?: number;
}

/* ─── Component ─── */
export function ToolCard({
  title,
  description,
  href,
  tag,
  status,
  isPremium = false,
  index = 0,
}: ToolCardProps) {
  const isComingSoon = status === "coming-soon";
  const Icon = resolveIcon(tag);

  const statusVariant = (() => {
    switch (status) {
      case "live": return "success" as const;
      case "beta": return "beta" as const;
      case "coming-soon": return "default" as const;
      case "pro": return "pro" as const;
    }
  })();

  const Wrapper = isComingSoon ? "div" : Link;
  const wrapperProps = isComingSoon ? {} : { href };

  return (
    <motion.div variants={fadeUp} custom={index}>
      {/* @ts-expect-error — polymorphic wrapper */}
      <Wrapper
        {...wrapperProps}
        className={cn(
          "glass-card relative rounded-2xl p-6 flex flex-col justify-between h-full",
          "transition-all duration-300 ease-out group border-border bg-card/40",
          isComingSoon
            ? "cursor-not-allowed opacity-60"
            : "cursor-pointer hover:border-primary/40 hover:shadow-[0_0_30px_rgba(99,102,241,0.12)] hover:bg-card/75 hover:-translate-y-0.5"
        )}
      >
        {/* Top: Tag + Status */}
        <div>
          <div className="flex justify-between items-center mb-5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-[hsl(var(--ring)_/_0.06)] border border-[hsl(var(--ring)_/_0.12)] rounded-lg px-2.5 py-1">
              {tag}
            </span>
            <div className="flex items-center gap-1.5">
              {isPremium && (
                <Badge variant="pro" className="shadow-[0_0_10px_rgba(245,158,11,0.15)]">
                  <Sparkles className="h-2.5 w-2.5" />
                  Pro
                </Badge>
              )}
              <Badge variant={statusVariant}>
                {status === "coming-soon" ? "Soon" : status}
              </Badge>
            </div>
          </div>

          {/* Icon */}
          <div className="inline-flex rounded-2xl bg-muted border border-border p-3.5 text-muted-foreground mb-5 transition-all duration-350 ease-out group-hover:scale-110 group-hover:bg-[hsl(var(--ring)_/_0.12)] group-hover:border-primary/30 group-hover:text-primary group-hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]">
            <Icon className="h-6 w-6" />
          </div>

          {/* Title & Description */}
          <h3 className="font-bold text-foreground text-lg tracking-tight group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>
          <p className="text-body-s text-muted-foreground mt-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Bottom */}
        <div className="mt-6 pt-4 border-t border-border/80 flex justify-between items-center">
          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-1">
            {isPremium ? (
              <>
                <Lock className="h-3 w-3 text-warning" />
                Pro Feature
              </>
            ) : (
              "Free Access"
            )}
          </span>
          {!isComingSoon ? (
            <span className="inline-flex items-center text-xs font-bold text-primary group-hover:text-primary/80 transition-colors">
              Open Tool
              <ArrowRight className="ml-1.5 h-3.5 w-3.5 group-hover:translate-x-1.5 transition-transform duration-200" />
            </span>
          ) : (
            <span className="text-xs font-bold text-muted-foreground">
              Coming Soon
            </span>
          )}
        </div>
      </Wrapper>
    </motion.div>
  );
}
