import React from "react";
import { Metadata } from "next";
import { CategoryHubLayout } from "@/components/layout/category-hub-layout";

export const metadata: Metadata = {
  title: "Free AI Productivity Tools — Secure & Client-Side | utool",
  description: "Generate resumes, cover letters, subtitles, and perform OCR text extraction in your browser. 100% private client-side utilities.",
  alternates: {
    canonical: "https://utool.in/tools/ai-tools",
  },
  openGraph: {
    title: "Free AI Productivity Tools — Secure & Local | utool",
    description: "Generate resumes, cover letters, subtitles, and perform OCR text extraction in your browser.",
    url: "https://utool.in/tools/ai-tools",
  }
};

const faqs = [
  {
    q: "Is my personal data sent to AI servers?",
    a: "No. The AI interfaces on UTool are built using client-side libraries. For heavy tasks, processing is run locally on your own CPU in sandboxed memory. We do not store or transmit your documents to external servers."
  },
  {
    q: "Do I need to sign up to use UTool AI tools?",
    a: "All core tools are available without registration. You can generate files, crop documents, or parse transcripts instantly."
  }
];

export default function AIToolsCategoryPage() {
  return (
    <CategoryHubLayout
      title="AI Productivity Tools"
      description="Accelerate your work with secure, local AI-assisted tools. Generate text, transcribe audio, structure meetings, and extract OCR content without sharing your records."
      canonicalUrl="https://utool.in/tools/ai-tools"
      categoryName="AI"
      faqs={faqs}
    />
  );
}
