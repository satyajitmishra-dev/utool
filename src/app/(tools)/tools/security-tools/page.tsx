import React from "react";
import { Metadata } from "next";
import { CategoryHubLayout } from "@/components/layout/category-hub-layout";

export const metadata: Metadata = {
  title: "Free Cryptographic & Security Tools — 100% Secure | utool",
  description: "Generate secure passwords, evaluate credentials strength, parse JWT claims, and encode HTML strings client-side. Zero server logging.",
  alternates: {
    canonical: "https://utool.in/tools/security-tools",
  },
  openGraph: {
    title: "Free Cryptographic & Security Tools — Local | utool",
    description: "Generate secure passwords, evaluate credentials strength, parse JWT claims, and encode HTML strings client-side.",
    url: "https://utool.in/tools/security-tools",
  }
};

const faqs = [
  {
    q: "Are generated passwords safe from interception?",
    a: "Yes. All security algorithms execute in local browser memory using browser crypto APIs. No passwords, bcrypt salts, or hash signatures are sent across the network."
  },
  {
    q: "How does the password strength estimator work?",
    a: "It measures the entropy (randomness) of your password characters, calculating how long it would take a hacker to crack via brute-force."
  }
];

export default function SecurityToolsCategoryPage() {
  return (
    <CategoryHubLayout
      title="Security & Hashing Tools"
      description="Protect credentials and sanitize data strings locally. Generate passwords, check strength, compile SHA hashes, parse tokens, and escape HTML entities."
      canonicalUrl="https://utool.in/tools/security-tools"
      categoryName="Security"
      faqs={faqs}
    />
  );
}
