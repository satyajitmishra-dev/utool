"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, FileText, Image, Link, Minimize2, Lock, Sparkles, Loader2 } from "lucide-react";
import { setHandoffFile } from "@/utils/file-handoff";
import { toast } from "sonner";

interface Recommendation {
  id: string;
  name: string;
  description: string;
  route: string;
  icon: React.ReactNode;
}

interface ToolChainingProps {
  currentToolId: string;
  fileBytes: Uint8Array | ArrayBuffer | null;
  fileName: string;
  fileType?: string;
}

export function ToolChaining({
  currentToolId,
  fileBytes,
  fileName,
  fileType = "application/pdf",
}: ToolChainingProps) {
  const router = useRouter();
  const [loadingToolId, setLoadingToolId] = useState<string | null>(null);

  // Recommendations configuration lookup
  const recommendationsMap: Record<string, Recommendation[]> = {
    "pdf-merge": [
      {
        id: "pdf-compress",
        name: "Compress PDF",
        description: "Reduce file size while keeping visual quality.",
        route: "/pdf-tools/compress",
        icon: <Minimize2 className="h-5 w-5 text-indigo-400" />,
      },
      {
        id: "pdf-to-jpg",
        name: "PDF to JPG",
        description: "Convert PDF document pages into clean JPG images.",
        route: "/pdf-tools/pdf-to-jpg",
        icon: <Image className="h-5 w-5 text-sky-400" />,
      },
    ],
    "pdf-compress": [
      {
        id: "pdf-merge",
        name: "Merge PDF",
        description: "Combine multiple PDF documents into one.",
        route: "/pdf-tools/merge",
        icon: <FileText className="h-5 w-5 text-indigo-400" />,
      },
      {
        id: "pdf-to-jpg",
        name: "PDF to JPG",
        description: "Convert PDF document pages into clean JPG images.",
        route: "/pdf-tools/pdf-to-jpg",
        icon: <Image className="h-5 w-5 text-sky-400" />,
      },
    ],
    "pdf-to-jpg": [
      {
        id: "pdf-compress",
        name: "Compress PDF",
        description: "Reduce document size for faster email sharing.",
        route: "/pdf-tools/compress",
        icon: <Minimize2 className="h-5 w-5 text-indigo-400" />,
      },
    ],
    "webp-converter": [
      {
        id: "image-compressor",
        name: "Image Compressor",
        description: "Shrink image file capacity on the fly.",
        route: "/image-tools/compress",
        icon: <Minimize2 className="h-5 w-5 text-violet-400" />,
      },
    ],
  };

  const recommendations = recommendationsMap[currentToolId] || [];

  if (recommendations.length === 0 || !fileBytes) {
    return null;
  }

  const handleHandoff = async (rec: Recommendation) => {
    setLoadingToolId(rec.id);
    const toastId = toast.loading(`Preparing file for ${rec.name}...`);
    try {
      // 1. Write current file output to IndexedDB handoff store
      await setHandoffFile(fileName, fileType, fileBytes as ArrayBuffer);
      toast.dismiss(toastId);
      toast.success(`File handed off! Redirecting to ${rec.name}.`);
      
      // 2. Route to target tool (which preloads automatically via usePDFUpload)
      router.push(rec.route);
    } catch (error) {
      console.error("Handoff failed", error);
      toast.dismiss(toastId);
      toast.error("Failed to chain file to next tool.");
      setLoadingToolId(null);
    }
  };

  return (
    <div className="w-full mt-10 text-left border-t border-neutral-800 pt-8">
      <h4 className="text-sm font-semibold tracking-tight text-neutral-300 flex items-center gap-2 mb-4">
        <Sparkles className="h-4.5 w-4.5 text-violet-400" />
        Recommended Next Actions
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec) => {
          const isLoading = loadingToolId === rec.id;
          return (
            <button
              key={rec.id}
              onClick={() => handleHandoff(rec)}
              disabled={loadingToolId !== null}
              className="flex items-start text-left p-4 rounded-2xl border border-neutral-800/60 bg-neutral-900/30 hover:bg-neutral-900/60 hover:border-violet-500/35 transition-all group disabled:opacity-50"
            >
              <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 group-hover:border-violet-500/25 mr-4 transition-colors">
                {rec.icon}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-neutral-200 text-sm group-hover:text-white transition-colors">
                    {rec.name}
                  </span>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 text-violet-400 animate-spin" />
                  ) : (
                    <ArrowRight className="h-4 w-4 text-neutral-500 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all" />
                  )}
                </div>
                <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                  {rec.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
