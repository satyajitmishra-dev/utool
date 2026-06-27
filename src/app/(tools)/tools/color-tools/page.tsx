import React from "react";
import { Metadata } from "next";
import { CategoryHubLayout } from "@/components/layout/category-hub-layout";

export const metadata: Metadata = {
  title: "Free CSS & Color Tools — Hex, RGB, HSL & WCAG Contrast | utool",
  description: "Convert hex codes, RGB, HSL, and CMYK color spaces. Check WCAG contrast ratios, generate shades, and simulate color blindness locally.",
  alternates: {
    canonical: "https://utool.in/tools/color-tools",
  },
  openGraph: {
    title: "Free CSS & Color Tools — Hex, RGB, HSL & Contrast | utool",
    description: "Convert hex codes, RGB, HSL, and CMYK color spaces. Check WCAG contrast ratios, generate shades, and simulate color blindness locally.",
    url: "https://utool.in/tools/color-tools",
  }
};

const faqs = [
  {
    q: "What is WCAG Contrast Check?",
    a: "It verifies that text is readable against a background color, helping your web design pass accessibility guidelines (AA or AAA ratings)."
  },
  {
    q: "Does this page support color-blind simulations?",
    a: "Yes. Our tool allows designers to preview how colors appear to individuals with deuteranopia or protanopia."
  }
];

export default function ColorToolsCategoryPage() {
  return (
    <CategoryHubLayout
      title="Color & CSS Design Tools"
      description="Simplify color coordination for your websites and graphic designs. Convert color coordinates, build palettes, check contrast, and preview shades."
      canonicalUrl="https://utool.in/tools/color-tools"
      categoryName="Color"
      faqs={faqs}
    />
  );
}
