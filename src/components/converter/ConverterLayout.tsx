import React from 'react';
import { RegistryTool } from '@/types/tool-registry';
import { Uploader } from '@/components/upload/Uploader';
import { Section } from '@/components/ui/section';
import { FaqAccordion } from '@/components/ui/faq-accordion';
import { AdSlot } from '@/components/ads/AdSlot';

import { ToolCard } from '@/components/ui/tool-card';
import { getToolBySlug } from '@/config/tool-registry';

interface ConverterLayoutProps {
  config: RegistryTool;
}

export function ConverterLayout({ config }: ConverterLayoutProps) {
  const relatedTools = config.relatedTools
    .map(id => getToolBySlug(id))
    .filter(Boolean) as RegistryTool[];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <Section className="pt-24 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -skew-y-3 transform origin-top-left -z-10" />
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-foreground">{config.name}</h1>
          <AdSlot placement="tool-top" className="mb-6" />
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            {config.heroContent}
          </p>

          
          {/* Uploader Component */}
          <Uploader config={config} />
        </div>
      </Section>

      {/* How it Works / Features (Placeholder for now) */}
      <Section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="glass-card p-6 rounded-2xl">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold mb-4">1</div>
              <h3 className="font-bold text-lg mb-2">Upload File</h3>
              <p className="text-muted-foreground">Select or drag & drop your {(config.supportedInputFormats || []).join(', ')} file into the upload box.</p>
            </div>
            <div className="glass-card p-6 rounded-2xl">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold mb-4">2</div>
              <h3 className="font-bold text-lg mb-2">Convert</h3>
              <p className="text-muted-foreground">Our secure servers instantly convert your file to {(config.supportedOutputFormats || []).join(', ')}.</p>
            </div>
            <div className="glass-card p-6 rounded-2xl">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold mb-4">3</div>
              <h3 className="font-bold text-lg mb-2">Download</h3>
              <p className="text-muted-foreground">Download your converted file. All files are automatically deleted for your privacy.</p>
            </div>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      {(config.faqs || []).length > 0 && (
        <Section className="py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
            <FaqAccordion 
              faqs={(config.faqs || []).map((f: any) => ({
                q: f.question,
                a: f.answer
              }))} 
            />
            <AdSlot placement="faq-bottom" className="mt-8" />
          </div>
        </Section>

      )}

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <Section className="py-16 bg-muted/30">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Related Tools</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedTools.map((tool, idx) => (
                <ToolCard
                  key={tool.id}
                  title={tool.name}
                  description={tool.description}
                  href={`/tools/${tool.slug}`}
                  tag={tool.iconTag}
                  status={tool.isPremium ? 'pro' : 'live'}
                  isPremium={tool.isPremium}
                  requiresAuth={tool.requiresAuth}
                  index={idx}
                />
              ))}
            </div>
          </div>
        </Section>
      )}
    </div>
  );
}
