import React from 'react';
import { FaqAccordion } from '@/components/ui/faq-accordion';
import { MessageSquare } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface ConverterFAQProps {
  faqs: FAQItem[];
}

export function ConverterFAQ({ faqs }: ConverterFAQProps) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-primary" />
        <span>Frequently Asked Questions</span>
      </h3>
      <div className="border border-border rounded-2xl bg-card p-5 shadow-xs">
        <FaqAccordion
          faqs={faqs.map((f) => ({
            q: f.question,
            a: f.answer,
          }))}
        />
      </div>
    </div>
  );
}
