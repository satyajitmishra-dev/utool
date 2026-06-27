import React from "react";
import { Metadata } from "next";
import { CategoryHubLayout } from "@/components/layout/category-hub-layout";

export const metadata: Metadata = {
  title: "Free Investment & Finance Calculators — Secure & Local | utool",
  description: "Calculate simple interest, compound growth, future asset values, investment ROIs, and compound CAGR figures without cloud uploads.",
  alternates: {
    canonical: "https://utool.in/tools/finance-tools",
  },
  openGraph: {
    title: "Free Investment & Finance Calculators — Local | utool",
    description: "Calculate simple interest, compound growth, future asset values, investment ROIs, and compound CAGR figures without cloud uploads.",
    url: "https://utool.in/tools/finance-tools",
  }
};

const faqs = [
  {
    q: "Why are my financial calculations safe on UTool?",
    a: "All financial, compound growth, and amortization schedule calculations execute completely inside your local browser tab. No values are logged on our servers, ensuring your business accounting remains private."
  },
  {
    q: "Can I print my amortization schedule?",
    a: "Yes. Once generated, schedules can be saved directly as aligned PDFs using UTool's client print layouts."
  }
];

export default function FinanceToolsCategoryPage() {
  return (
    <CategoryHubLayout
      title="Investment & Finance Tools"
      description="Track and plan financial growth with secure accounting estimators. Check simple interest, compound growth, investment ROIs, CAGR values, and break-even points."
      canonicalUrl="https://utool.in/tools/finance-tools"
      categoryName="Finance"
      faqs={faqs}
    />
  );
}
