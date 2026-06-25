import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ToolCard } from "@/components/ui/tool-card";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  ShieldCheck, 
  ChevronRight, 
  Home, 
  ArrowRight,
  FileImage,
  ImageIcon,
  Crop,
  Zap,
  Image
} from "lucide-react";

export const metadata: Metadata = {
  title: "Free Online Image Tools — Web-Ready Optimization | utool",
  description: "Convert, scale, and compress images online. Process PNG, JPG, JPEG, and WebP files 100% locally in your web browser. No data uploads, fast and secure.",
  alternates: {
    canonical: "https://utool.in/tools/image-tools",
  },
  openGraph: {
    title: "Free Online Image Tools — Web-Ready Optimization | utool",
    description: "Convert, scale, and compress images online. Process PNG, JPG, JPEG, and WebP files 100% locally in your web browser.",
    url: "https://utool.in/tools/image-tools",
  }
};

const imageTools = [
  {
    id: "webp-converter",
    name: "Image WebP Converter",
    description: "Convert and optimize PNG, JPEG files into WebP format locally.",
    tag: "image-convert",
    status: "live" as const,
    isPremium: false,
    href: "/tools/webp-converter",
    icon: ImageIcon
  },
  {
    id: "jpg-to-pdf",
    name: "JPG to PDF Converter",
    description: "Convert and compile JPG/JPEG photos into an aligned vector PDF.",
    tag: "jpg-to-pdf",
    status: "live" as const,
    isPremium: false,
    href: "/tools/jpg-to-pdf",
    icon: FileImage
  },
  {
    id: "pdf-to-jpg",
    name: "PDF to JPG Extractor",
    description: "Extract page pages of any PDF document as separate high-quality JPEG images.",
    tag: "pdf-to-jpg",
    status: "live" as const,
    isPremium: false,
    href: "/tools/pdf-to-jpg",
    icon: FileImage
  },
  {
    id: "image-resize",
    name: "Smart Image Resizer",
    description: "Crop and adjust pixel resolutions of multiple photos instantly.",
    tag: "image-resize",
    status: "pro" as const,
    isPremium: true,
    href: "/premium-tools",
    icon: Crop
  }
];

const faqs = [
  {
    q: "Why convert images to WebP?",
    a: "WebP is a modern image format developed by Google that provides superior lossless and lossy compression for web images. Using WebP, webmasters can reduce file sizes by up to 80% compared to JPEG or PNG, significantly improving page loading speeds and SEO rankings."
  },
  {
    q: "Are my photos uploaded to Utool servers?",
    a: "No. Utool compiles and converts your images locally using HTML5 canvas APIs and modern browser compilation scripts. Your personal photos, screenshots, and visual designs never leave your computer."
  },
  {
    q: "Can I convert multiple images at once?",
    a: "Yes. Our WebP converter supports batch conversion, allowing you to select dozens of images and convert them simultaneously in a single pass without limits."
  }
];

export default function ImageToolsCategoryPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://utool.in" },
      { "@type": "ListItem", "position": 2, "name": "Tools", "item": "https://utool.in/tools" },
      { "@type": "ListItem", "position": 3, "name": "Image Tools", "item": "https://utool.in/tools/image-tools" }
    ]
  };

  const hubSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": { "@type": "Answer", "text": faq.a }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hubSchema) }}
      />

      <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-foreground">
        <main className="max-w-6xl w-full mx-auto px-6 py-10 space-y-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <Link href="/" className="hover:text-foreground flex items-center gap-1 transition-colors">
              <Home className="h-3.5 w-3.5" />
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/tools" className="hover:text-foreground transition-colors">
              Tools
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-bold">Image Tools</span>
          </nav>

          {/* Hero Section */}
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card/25 p-8 md:p-12 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
              <div className="lg:col-span-3 space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="primary" className="inline-flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Free Utility Hub
                  </Badge>
                  <Badge variant="success" className="inline-flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    Client-Side Processing
                  </Badge>
                </div>
                <h1 className="text-display-l font-extrabold tracking-tight text-foreground leading-tight">
                  Free Online <span className="gradient-text bg-gradient-to-r from-primary via-secondary to-accent">Image Tools</span>
                </h1>
                <p className="text-body-m text-muted-foreground leading-relaxed">
                  Convert images to WebP, resize dimensions, and compile photo formats in your browser sandbox. Achieve up to 80% size compression locally with zero loss in visual clarity.
                </p>
              </div>
              <div className="lg:col-span-2 border border-border rounded-2xl p-6 bg-card space-y-4 shadow-sm">
                <h3 className="text-sm font-bold text-foreground">Speed & SEO Advantages</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Image size is the leading cause of slow page load times. Converting standard PNG and JPEG files to WebP drastically cuts down payload delivery times, resulting in higher Core Web Vitals and organic search ranks.
                </p>
              </div>
            </div>
          </div>

          {/* Tools Grid */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Select Image Utility Spoke</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {imageTools.map((tool, idx) => (
                <ToolCard
                  key={tool.id}
                  title={tool.name}
                  description={tool.description}
                  href={tool.href}
                  tag={tool.tag}
                  status={tool.status}
                  isPremium={tool.isPremium}
                  index={idx}
                />
              ))}
            </div>
          </div>

          {/* SEO Core Long-Form Copy Block (Topical Authority Construction) */}
          <section className="border-t border-border pt-10 space-y-8 max-w-4xl">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Optimizing Visual Assets for High-Performance Websites
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed text-justify">
                Images account for the vast majority of web page weight. In the era of Core Web Vitals and mobile-first indexing, delivering uncompressed JPEG or heavy PNG graphics hurts page load latency, driving visitors away and dragging down organic search rankings. Traditional optimization platforms process images on remote cloud servers, which introduces file transfer wait times and concerns regarding copyright or copyright leakage. Utool solves this by compiling and optimizing visual assets 100% locally in your browser.
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed text-justify">
                Our image compression and packaging engine converts standard image types (including transparent PNGs, high-resolution JPGs, and WebP graphics) without uploading your files. Using browser thread canvases and modern Web APIs, files are rendered locally in milliseconds.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Decentralized WebP Conversion and Compression
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed text-justify">
                WebP is the current standard for high-performance web graphics, providing superior compression characteristics. Utool's WebP Converter enables you to load PNG and JPG files in batches, select a target quality ratio (default 80%), and export light, web-ready files directly to your device. This allows webmasters, developers, and writers to batch-process site assets without limitations or watermarks.
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed text-justify">
                Similarly, our converters handle cross-format transactions, translating document screens to high-definition JPEGs or packaging photographic portfolios into aligned vector PDF structures.
              </p>
            </div>
          </section>

          {/* FAQs Accordion */}
          <section className="border-t border-border pt-10 space-y-6 max-w-4xl">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Frequently Asked Questions (Image Category)
            </h2>
            <FaqAccordion faqs={faqs} />
          </section>

          {/* Horizontal category navigation */}
          <section className="border-t border-border pt-10 space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Other Categories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Link href="/tools/pdf-tools" className="flex justify-between items-center border border-border hover:border-primary/20 rounded-xl p-4 bg-card hover:bg-muted/30 transition-all text-xs font-bold">
                PDF Tools
                <ArrowRight className="h-4 w-4 text-primary" />
              </Link>
              <Link href="/tools/developer-tools" className="flex justify-between items-center border border-border hover:border-primary/20 rounded-xl p-4 bg-card hover:bg-muted/30 transition-all text-xs font-bold">
                Developer Tools
                <ArrowRight className="h-4 w-4 text-primary" />
              </Link>
              <Link href="/tools/resume-tools" className="flex justify-between items-center border border-border hover:border-primary/20 rounded-xl p-4 bg-card hover:bg-muted/30 transition-all text-xs font-bold">
                Resume Tools
                <ArrowRight className="h-4 w-4 text-primary" />
              </Link>
              <Link href="/tools/text-tools" className="flex justify-between items-center border border-border hover:border-primary/20 rounded-xl p-4 bg-card hover:bg-muted/30 transition-all text-xs font-bold">
                Text Tools
                <ArrowRight className="h-4 w-4 text-primary" />
              </Link>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
