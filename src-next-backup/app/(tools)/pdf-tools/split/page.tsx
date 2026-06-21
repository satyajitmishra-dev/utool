"use client";

import React from "react";
import { SplitTool } from "@/components/tools/pdf/split-tool";
import { Scissors } from "lucide-react";

export default function PDFSplitPage() {
  return (
    <div className="max-w-3xl w-full mx-auto space-y-8 flex-1 flex flex-col justify-center">
      {/* Tool Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
            <span className="inline-flex rounded-xl bg-indigo-50 border border-indigo-100 p-2 text-indigo-600">
              <Scissors className="h-5 w-5" />
            </span>
            Split PDF Document
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Extract custom page sequences from a PDF file using customizable ranges.
          </p>
        </div>
      </div>

      {/* Main extractor workspace */}
      <SplitTool />
    </div>
  );
}
