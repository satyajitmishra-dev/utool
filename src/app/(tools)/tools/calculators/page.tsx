import React from "react";
import { Metadata } from "next";
import { CategoryHubLayout } from "@/components/layout/category-hub-layout";

export const metadata: Metadata = {
  title: "Free Online Calculators — Math, Health, Finance & Tax | utool",
  description: "Use scientific calculators, GPA calculators, compound interest calculators, and loan estimators inside your browser without page reloads.",
  alternates: {
    canonical: "https://utool.in/tools/calculators",
  },
  openGraph: {
    title: "Free Online Calculators — Instant & Secure | utool",
    description: "Use scientific calculators, GPA calculators, compound interest calculators, and loan estimators inside your browser.",
    url: "https://utool.in/tools/calculators",
  }
};

const faqs = [
  {
    q: "How accurate are the UTool calculators?",
    a: "Every calculator is built using standard mathematical equations verified by engineers. All equations execute instantly in JavaScript, ensuring precise, real-time calculations."
  },
  {
    q: "Are my calculations logged on the server?",
    a: "No. UTool operates completely client-side. We have no databases recording your inputs, ensuring total privacy for health, tax, or mortgage calculations."
  }
];

export default function CalculatorsCategoryPage() {
  return (
    <CategoryHubLayout
      title="Calculators"
      description="Resolve calculations instantly with our browser-native calculators. Covers trigonometry, scientific equations, date intervals, GPA indexes, and tax estimations."
      canonicalUrl="https://utool.in/tools/calculators"
      categoryName="Calculators"
      faqs={faqs}
    />
  );
}
