"use client";

import React from "react";
import { MergeTool } from "@/components/tools/pdf/merge-tool";
import { Merge } from "lucide-react";

export default function PDFMergePage() {
  return (
    <div className="max-w-3xl w-full mx-auto space-y-8 flex-1 flex flex-col justify-center">
      {/* Tool Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <span className="inline-flex rounded-xl bg-[hsl(var(--ring)_/_0.08)] border border-[hsl(var(--ring)_/_0.15)] p-2 text-primary">
              <Merge className="h-5 w-5" />
            </span>
            Merge PDF Documents
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Combine multiple files in any sequence and compile them into a single PDF.
          </p>
        </div>
      </div>

      {/* Main compiler workspace */}
      <MergeTool />
    </div>
  );
}
