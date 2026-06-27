import React from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import { SiteFooter } from "@/components/layout/site-footer";
import { BannerEngine } from "@/components/banners/BannerEngine";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col relative">
      <FloatingDock />
      <main className="flex-1 pt-24 md:pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BannerEngine />
        </div>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
