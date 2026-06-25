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
const AddPasswordTool = dynamic(
  () => import("@/components/tools/pdf/add-password-tool").then((mod) => mod.AddPasswordTool),
  { ssr: false }
);
const RemovePasswordTool = dynamic(
  () => import("@/components/tools/pdf/remove-password-tool").then((mod) => mod.RemovePasswordTool),
  { ssr: false }
);
const ImageToPdfTool = dynamic(
  () => import("@/components/tools/pdf/image-to-pdf-tool").then((mod) => mod.ImageToPdfTool),
  { ssr: false }
);
const PdfToJpgTool = dynamic(
  () => import("@/components/tools/pdf/pdf-to-jpg-tool").then((mod) => mod.PdfToJpgTool),
  { ssr: false }
);
const QRGeneratorPage = dynamic(() => import("@/app/(tools)/qr-generator/page"), { ssr: false });
const URLShortenerPage = dynamic(() => import("@/app/(tools)/url-shortener/page"), { ssr: false });
const ResumeBuilderPage = dynamic(() => import("@/app/(tools)/resume-builder/page"), { ssr: false });
const WebPConverterPage = dynamic(() => import("@/app/(tools)/image-tools/webp-converter/page"), { ssr: false });
const ToolExecutionClient = dynamic(() => import("@/components/tools/tool-execution-client"), { ssr: false });
const MetaTagGeneratorTool = dynamic(
  () => import("@/components/tools/meta-tag-generator-tool").then((mod) => mod.MetaTagGeneratorTool),
  { ssr: false }
);

export function ToolWorkspaceClient({ slug }: { slug: string }) {
  switch (slug) {
    case "merge-pdf":
      return <MergeTool />;
    case "split-pdf":
      return <SplitTool />;
    case "compress-pdf":
      return <CompressTool />;
    case "protect-pdf":
      return <AddPasswordTool />;
    case "unlock-pdf":
      return <RemovePasswordTool />;
    case "image-to-pdf":
    case "jpg-to-pdf":
      return <ImageToPdfTool />;
    case "pdf-to-jpg":
      return <PdfToJpgTool />;
    case "qr-generator":
      return <QRGeneratorPage hideHeader={true} />;
    case "url-shortener":
      return <URLShortenerPage hideHeader={true} />;
    case "resume-builder":
      return <ResumeBuilderPage hideHeader={true} />;
    case "webp-converter":
      return <WebPConverterPage hideHeader={true} />;
    case "json-formatter":
    case "css-gradient-generator":
      return <ToolExecutionClient hideHeader={true} />;
    case "meta-tag-generator":
      return <MetaTagGeneratorTool />;
    default:
      return <div className="text-center py-10 text-muted-foreground text-xs font-semibold">Workspace not configured for this slug.</div>;
  }
}
