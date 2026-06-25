"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Lock,
  Crown,
  ArrowRight,
  Check,
  ScanText,
  Ruler,
  Eraser,
  Wand2,
} from "lucide-react";
import { useToolLimit } from "@/hooks/use-tool-limit";

const premiumTools = [
  {
    id: "pdf-ocr",
    name: "AI PDF OCR Extractor",
    description: "Extract text, tables, and structured data from scanned PDFs using AI-powered OCR.",
    icon: ScanText,
    gradient: "from-indigo-500 to-violet-500",
  },
  {
    id: "image-resize",
    name: "Smart Image Resizer",
    description: "Crop, resize, and optimize images with pixel-perfect presets for social media.",
    icon: Ruler,
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    id: "bg-remover",
    name: "Background Remover",
    description: "Remove image backgrounds with AI-powered edge detection in seconds.",
    icon: Eraser,
    gradient: "from-rose-500 to-pink-500",
  },
  {
    id: "ai-writer",
    name: "AI Content Writer",
    description: "Generate blog posts, summaries, and marketing copy with GPT-4 powered AI.",
    icon: Wand2,
    gradient: "from-amber-500 to-orange-500",
  },
];

export default function PremiumToolsPage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedTool, setSelectedTool] = useState<string>("");
  const { limitStatus } = useToolLimit();

  const isPro = limitStatus.tier === "pro" || limitStatus.tier === "enterprise";

  const handleToolClick = (name: string) => {
    setSelectedTool(name);
    setShowModal(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-border pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-sm">
            <Crown className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-h1 text-foreground">Premium Tools</h1>
            <p className="text-body-s text-muted-foreground mt-0.5">
              Unlock powerful AI-powered tools with a Pro subscription.
            </p>
          </div>
        </div>
      </div>

      {/* Tool Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {premiumTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <div key={tool.id} className="relative">
              {/* Blur overlay */}
              {!isPro && (
                <div className="absolute inset-0 z-10 rounded-2xl bg-background/40 backdrop-blur-[2px] flex items-center justify-center">
                  <button
                    onClick={() => handleToolClick(tool.name)}
                    className="flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-2.5 text-sm font-semibold shadow-lg hover:opacity-90 transition-opacity"
                  >
                    <Lock className="h-4 w-4" />
                    Unlock with Pro
                  </button>
                </div>
              )}

              {/* Card (blurred behind) */}
              <GlassCard hover={false} className="p-6">
                <div className={`inline-flex rounded-xl bg-gradient-to-br ${tool.gradient} p-3 text-white shadow-sm mb-4`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-h3 text-foreground">{tool.name}</h3>
                  <Badge variant="pro">
                    <Sparkles className="h-2.5 w-2.5" />
                    Pro
                  </Badge>
                </div>
                <p className="text-body-s text-muted-foreground">{tool.description}</p>
                <div className="mt-4 h-32 rounded-xl bg-muted/50 border border-border flex items-center justify-center text-muted-foreground text-caption">
                  Tool preview area
                </div>
              </GlassCard>
            </div>
          );
        })}
      </div>

      {/* Premium Lock Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        size="md"
      >
        <div className="text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg mx-auto mb-6">
            <Crown className="h-8 w-8" />
          </div>
          <h2 className="text-h2 text-foreground">
            Upgrade to Pro
          </h2>
          <p className="mt-2 text-body-m text-muted-foreground">
            Unlock <span className="font-semibold text-foreground">{selectedTool}</span> and all premium tools with a Pro subscription.
          </p>

          <div className="mt-6 space-y-2 text-left max-w-xs mx-auto">
            {[
              "Unlimited tool actions",
              "All 60+ tools unlocked",
              "Priority support",
              "API access",
            ].map((f) => (
              <div key={f} className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-success flex-shrink-0" />
                <span className="text-body-s text-muted-foreground">{f}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <Link href="/pricing">
              <Button variant="premium" size="lg" className="w-full rounded-xl">
                <Sparkles className="h-4 w-4" />
                View Plans & Pricing
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <button
              onClick={() => setShowModal(false)}
              className="text-body-s text-muted-foreground hover:text-foreground transition-colors"
            >
              Maybe later
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
