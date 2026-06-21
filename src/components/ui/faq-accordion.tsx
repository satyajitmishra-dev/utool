"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
}

export function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <div className="space-y-4">
      {faqs.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className="border border-border rounded-2xl bg-card overflow-hidden transition-all duration-200 shadow-sm"
          >
            <button
              onClick={() => toggle(i)}
              className="flex justify-between items-center w-full px-6 py-4.5 text-left font-bold text-sm text-foreground hover:bg-muted/40 transition-colors"
            >
              <span>{faq.q}</span>
              <ChevronDown
                className={`h-4.5 w-4.5 text-muted-foreground transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`transition-all duration-200 ease-in-out ${
                isOpen ? "max-h-[500px] border-t border-border" : "max-h-0 overflow-hidden"
              }`}
            >
              <div className="px-6 py-4.5 text-xs text-muted-foreground leading-relaxed">
                {faq.a}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
