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
const MediaWorkspaceClient = dynamic(
  () => import("@/components/tools/media/media-workspace-client").then((mod) => mod.MediaWorkspaceClient),
  { ssr: false }
);
const AgeCalculator = dynamic(
  () => import("@/components/tools/age-calculator").then((mod) => mod.AgeCalculator),
  { ssr: false }
);
const DiffChecker = dynamic(
  () => import("@/components/tools/diff-checker").then((mod) => mod.DiffChecker),
  { ssr: false }
);
const EmiCalculator = dynamic(
  () => import("@/components/tools/emi-calculator").then((mod) => mod.EmiCalculator),
  { ssr: false }
);
const GstCalculator = dynamic(
  () => import("@/components/tools/gst-calculator").then((mod) => mod.GstCalculator),
  { ssr: false }
);
const MarkdownPreview = dynamic(
  () => import("@/components/tools/markdown-preview").then((mod) => mod.MarkdownPreview),
  { ssr: false }
);
const PasswordGenerator = dynamic(
  () => import("@/components/tools/password-generator").then((mod) => mod.PasswordGenerator),
  { ssr: false }
);
const PercentageCalculator = dynamic(
  () => import("@/components/tools/percentage-calculator").then((mod) => mod.PercentageCalculator),
  { ssr: false }
);
const CalorieCalculator = dynamic(
  () => import("@/components/tools/calorie-calculator").then((mod) => mod.CalorieCalculator),
  { ssr: false }
);
const CompoundInterestCalculator = dynamic(
  () => import("@/components/tools/compound-interest-calculator").then((mod) => mod.CompoundInterestCalculator),
  { ssr: false }
);
const DateCalculator = dynamic(
  () => import("@/components/tools/date-calculator").then((mod) => mod.DateCalculator),
  { ssr: false }
);
const DiscountCalculator = dynamic(
  () => import("@/components/tools/discount-calculator").then((mod) => mod.DiscountCalculator),
  { ssr: false }
);
const FractionCalculator = dynamic(
  () => import("@/components/tools/fraction-calculator").then((mod) => mod.FractionCalculator),
  { ssr: false }
);
const GpaCalculator = dynamic(
  () => import("@/components/tools/gpa-calculator").then((mod) => mod.GpaCalculator),
  { ssr: false }
);
const IncomeTaxCalculator = dynamic(
  () => import("@/components/tools/income-tax-calculator").then((mod) => mod.IncomeTaxCalculator),
  { ssr: false }
);
const MatrixCalculator = dynamic(
  () => import("@/components/tools/matrix-calculator").then((mod) => mod.MatrixCalculator),
  { ssr: false }
);
const MortgageCalculator = dynamic(
  () => import("@/components/tools/mortgage-calculator").then((mod) => mod.MortgageCalculator),
  { ssr: false }
);
const ScientificCalculator = dynamic(
  () => import("@/components/tools/scientific-calculator").then((mod) => mod.ScientificCalculator),
  { ssr: false }
);
const TipCalculator = dynamic(
  () => import("@/components/tools/tip-calculator").then((mod) => mod.TipCalculator),
  { ssr: false }
);
const ImageResizerTool = dynamic(
  () => import("@/components/pro/image-resizer-tool").then((mod) => mod.ImageResizerTool),
  { ssr: false }
);
const BackgroundRemoverTool = dynamic(
  () => import("@/components/pro/background-remover-tool").then((mod) => mod.BackgroundRemoverTool),
  { ssr: false }
);
const SubtitleGeneratorTool = dynamic(
  () => import("@/components/pro/subtitle-generator-tool").then((mod) => mod.SubtitleGeneratorTool),
  { ssr: false }
);
const PdfOcrTool = dynamic(
  () => import("@/components/pro/pdf-ocr-tool").then((mod) => mod.PdfOcrTool),
  { ssr: false }
);
const DocumentConverterTool = dynamic(
  () => import("@/components/tools/pdf/document-converter-tool").then((mod) => mod.DocumentConverterTool),
  { ssr: false }
);

const JpgToPdfTool = dynamic(
  () => import("@/components/tools/pdf/tools/jpg-to-pdf").then((mod) => mod.JpgToPdfTool),
  { ssr: false }
);
const MergeScannedTool = dynamic(
  () => import("@/components/tools/pdf/tools/merge-scanned").then((mod) => mod.MergeScannedTool),
  { ssr: false }
);
const OrganizePdfTool = dynamic(
  () => import("@/components/tools/pdf/tools/organize-pdf").then((mod) => mod.OrganizePdfTool),
  { ssr: false }
);
const RedactPdfTool = dynamic(
  () => import("@/components/tools/pdf/tools/redact-pdf").then((mod) => mod.RedactPdfTool),
  { ssr: false }
);
const RepairPdfTool = dynamic(
  () => import("@/components/tools/pdf/tools/repair-pdf").then((mod) => mod.RepairPdfTool),
  { ssr: false }
);
const RotatePdfTool = dynamic(
  () => import("@/components/tools/pdf/tools/rotate-pdf").then((mod) => mod.RotatePdfTool),
  { ssr: false }
);
const SignPdfTool = dynamic(
  () => import("@/components/tools/pdf/tools/sign-pdf").then((mod) => mod.SignPdfTool),
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
    case "png-to-pdf":
    case "webp-to-pdf":
    case "heic-to-pdf":
      return <ImageToPdfTool />;
    case "jpg-to-pdf":
      return <JpgToPdfTool />;
    case "merge-scanned-pdfs":
      return <MergeScannedTool />;
    case "organize-pdf":
      return <OrganizePdfTool />;
    case "redact-pdf":
      return <RedactPdfTool />;
    case "repair-pdf":
      return <RepairPdfTool />;
    case "rotate-pdf":
      return <RotatePdfTool />;
    case "sign-pdf":
      return <SignPdfTool />;
    case "pdf-to-jpg":
    case "pdf-to-png":
      return <PdfToJpgTool />;
    case "qr-generator":
      return <QRGeneratorPage hideHeader={true} />;
    case "url-shortener":
      return <URLShortenerPage hideHeader={true} />;
    case "resume-builder":
      return <ResumeBuilderPage hideHeader={true} />;
    case "webp-converter":
      return <WebPConverterPage hideHeader={true} />;
    case "age-calculator":
      return <AgeCalculator />;
    case "diff-checker":
      return <DiffChecker />;
    case "loan-calculator":
      return <EmiCalculator />;
    case "gst-calculator":
      return <GstCalculator />;
    case "markdown-preview":
      return <MarkdownPreview />;
    case "password-generator":
      return <PasswordGenerator />;
    case "percentage-calculator":
      return <PercentageCalculator />;
    case "calorie-calculator":
      return <CalorieCalculator />;
    case "compound-interest":
      return <CompoundInterestCalculator />;
    case "date-calculator":
      return <DateCalculator />;
    case "discount-calculator":
      return <DiscountCalculator />;
    case "fraction-calculator":
      return <FractionCalculator />;
    case "gpa-calculator":
      return <GpaCalculator />;
    case "tax-calculator":
      return <IncomeTaxCalculator />;
    case "matrix-calculator":
      return <MatrixCalculator />;
    case "mortgage-calculator":
      return <MortgageCalculator />;
    case "scientific-calculator":
      return <ScientificCalculator />;
    case "tip-calculator":
      return <TipCalculator />;
    case "json-formatter":
    case "css-gradient-generator":
    case "env-validator":
    case "word-counter":
    case "case-converter":
    case "lorem-ipsum-generator":
    case "text-to-binary":
    case "slug-generator":
    case "hash-sha256-generator":
    case "uuid-generator":
    case "css-minifier":
    case "bmi-calculator":
    case "base64-encoder-decoder":
    case "url-encoder":
    case "regex-tester":
    case "heic-to-jpg":
    case "svg-to-png":
      return <ToolExecutionClient hideHeader={true} />;
    case "meta-tag-generator":
      return <MetaTagGeneratorTool />;
    case "media-workspace":
      return <MediaWorkspaceClient />;
    case "audio-converter":
      return <MediaWorkspaceClient initialToolId="audio-converter" />;
    case "video-trimmer":
      return <MediaWorkspaceClient initialToolId="trim-video" />;
    case "image-compressor":
      return <MediaWorkspaceClient initialToolId="image-compressor" />;
    case "gif-to-mp4":
      return <MediaWorkspaceClient initialToolId="downloader" />;
    case "image-resizer":
      return <ImageResizerTool />;
    case "background-remover":
      return <BackgroundRemoverTool />;
    case "subtitle-generator":
      return <SubtitleGeneratorTool />;
    case "pdf-ocr":
      return <PdfOcrTool />;
    case "docx-to-pdf":
    case "pdf-to-docx":
    case "xlsx-to-pdf":
    case "pdf-to-xlsx":
    case "pptx-to-pdf":
    case "pdf-to-pptx":
      return <DocumentConverterTool initialTool={slug} />;
    default:
      return <div className="text-center py-10 text-muted-foreground text-xs font-semibold">Workspace not configured for this slug.</div>;
  }
}
