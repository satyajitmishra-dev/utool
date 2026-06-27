import React from "react";
import { Metadata } from "next";
import { CategoryHubLayout } from "@/components/layout/category-hub-layout";

export const metadata: Metadata = {
  title: "Free Online Unit Converters — Quick & Secure | utool",
  description: "Convert length, weight, temperature, area, volume, speed, time, and digital storage formats instantly in your browser.",
  alternates: {
    canonical: "https://utool.in/tools/converters",
  },
  openGraph: {
    title: "Free Online Unit Converters — Instant | utool",
    description: "Convert length, weight, temperature, area, volume, speed, time, and digital storage formats instantly.",
    url: "https://utool.in/tools/converters",
  }
};

const faqs = [
  {
    q: "Can I convert units offline?",
    a: "Yes. Once the converter page loads, all conversion logic is fully cached. You can disconnect from the internet and continue to use the tools."
  },
  {
    q: "Are there limits on conversions?",
    a: "No. Unlike other converters that cap your usage per day, UTool lets you convert values as many times as you need."
  }
];

export default function ConvertersCategoryPage() {
  return (
    <CategoryHubLayout
      title="Unit Converters"
      description="Convert measurements across global unit scales instantly. Supports lengths, weights, temperature conversions, volume limits, and digital storage metrics."
      canonicalUrl="https://utool.in/tools/converters"
      categoryName="Converters"
      faqs={faqs}
    />
  );
}
