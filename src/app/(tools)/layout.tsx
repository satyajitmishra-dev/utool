"use client";

import React from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import { SiteFooter } from "@/components/layout/site-footer";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col relative">
      <FloatingDock />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
