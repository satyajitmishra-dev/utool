"use client";

import React from "react";
import { RemovePasswordTool } from "@/components/tools/pdf/remove-password-tool";
import { Unlock } from "lucide-react";

export default function PDFRemovePasswordPage() {
  return (
    <div className="max-w-3xl w-full mx-auto space-y-8 flex-1 flex flex-col justify-center">
      {/* Tool Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
            <span className="inline-flex rounded-xl bg-indigo-50 border border-indigo-100 p-2 text-indigo-600">
              <Unlock className="h-5 w-5" />
            </span>
            Remove PDF Password
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Unlock your PDF documents securely in your browser.
          </p>
        </div>
      </div>

      {/* Main workspace */}
      <RemovePasswordTool />
    </div>
  );
}
