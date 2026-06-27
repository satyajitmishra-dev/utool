import React from "react";
import { Metadata } from "next";
import { CategoryHubLayout } from "@/components/layout/category-hub-layout";

export const metadata: Metadata = {
  title: "Free Document Reader & Converters — 100% Secure | utool",
  description: "Convert Word DOCX, ODT, RTF, Excel, and CSV files in your browser. Read EPUB e-books, browse XML files, and read tables locally.",
  alternates: {
    canonical: "https://utool.in/tools/documents-tools",
  },
  openGraph: {
    title: "Free Document Reader & Converters — Local | utool",
    description: "Convert Word DOCX, ODT, RTF, Excel, and CSV files in your browser. Read EPUB e-books, browse XML files, and read tables locally.",
    url: "https://utool.in/tools/documents-tools",
  }
};

const faqs = [
  {
    q: "Can I convert large Word files securely?",
    a: "Yes. All converters operate inside the browser sandbox using local JS compilers, ensuring that bank invoices, contracts, or book draft structures never upload to a cloud server."
  },
  {
    q: "Does EPUB reader support bookmarks?",
    a: "Our local EPUB viewer saves your reader configuration indices inside your browser's LocalStorage, keeping bookmarks safe offline."
  }
];

export default function DocumentsToolsCategoryPage() {
  return (
    <CategoryHubLayout
      title="Document Readers & Converters"
      description="Process and view standard documents securely in browser. Convert DOCX to PDF, ODT, or RTF formats, read EPUB ebooks, parse XML trees, and analyze CSV tables."
      canonicalUrl="https://utool.in/tools/documents-tools"
      categoryName="Documents"
      faqs={faqs}
    />
  );
}
