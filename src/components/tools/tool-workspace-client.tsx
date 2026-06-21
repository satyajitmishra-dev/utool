"use client";

import React from "react";
import dynamic from "next/dynamic";

// Client-side tools loaded dynamically (ssr: false) to prevent hydration mismatches
const MergeTool = dynamic(
  () => import("@/components/tools/pdf/merge-tool").then((mod) => mod.MergeTool),
  { ssr: false }
);
const SplitTool = dynamic(
  () => import("@/components/tools/pdf/split-tool").then((mod) => mod.SplitTool),
  { ssr: false }
);
const CompressTool = dynamic(
  () => import("@/components/tools/pdf/compress-tool").then((mod) => mod.CompressTool),
  { ssr: false }
);
const QRGeneratorPage = dynamic(() => import("@/app/(tools)/qr-generator/page"), { ssr: false });
const URLShortenerPage = dynamic(() => import("@/app/(tools)/url-shortener/page"), { ssr: false });
const ResumeBuilderPage = dynamic(() => import("@/app/(tools)/resume-builder/page"), { ssr: false });

export function ToolWorkspaceClient({ slug }: { slug: string }) {
  switch (slug) {
    case "merge-pdf":
      return <MergeTool />;
    case "split-pdf":
      return <SplitTool />;
    case "compress-pdf":
      return <CompressTool />;
    case "qr-generator":
      return <QRGeneratorPage hideHeader={true} />;
    case "url-shortener":
      return <URLShortenerPage hideHeader={true} />;
    case "resume-builder":
      return <ResumeBuilderPage hideHeader={true} />;
    default:
      return <div className="text-center py-10 text-muted-foreground text-xs font-semibold">Workspace not configured for this slug.</div>;
  }
}
