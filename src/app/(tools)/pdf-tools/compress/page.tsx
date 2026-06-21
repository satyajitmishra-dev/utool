"use client";

import React from "react";
import { CompressTool } from "@/components/tools/pdf/compress-tool";
import { Minimize2 } from "lucide-react";

export default function PDFCompressPage() {
  return (
    <div className="max-w-3xl w-full mx-auto space-y-8 flex-1 flex flex-col justify-center">
      {/* Tool Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
            <span className="inline-flex rounded-xl bg-indigo-50 border border-indigo-100 p-2 text-indigo-600">
              <Minimize2 className="h-5 w-5" />
            </span>
            Compress PDF Document
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Reduce PDF file sizes safely client-side by optimizing object streams.
          </p>
        </div>
      </div>

      {/* Main compression workspace */}
      <CompressTool />
    </div>
  );
}
