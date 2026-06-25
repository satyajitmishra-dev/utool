"use client";

import React from "react";
import { AddPasswordTool } from "@/components/tools/pdf/add-password-tool";
import { Lock } from "lucide-react";

export default function PDFAddPasswordPage() {
  return (
    <div className="max-w-3xl w-full mx-auto space-y-8 flex-1 flex flex-col justify-center">
      {/* Tool Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
            <span className="inline-flex rounded-xl bg-indigo-50 border border-indigo-100 p-2 text-indigo-600">
              <Lock className="h-5 w-5" />
            </span>
            Add Password to PDF
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Secure your PDF document with strong password protection.
          </p>
        </div>
      </div>

      {/* Main workspace */}
      <AddPasswordTool />
    </div>
  );
}
