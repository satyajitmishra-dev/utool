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
  ArrowLeft,
  ArrowRight,
  FileText,
  Lock,
  Unlock,
  Maximize2,
  Minimize2,
  FileImage,
  Layers
} from "lucide-react";

export const metadata: Metadata = {
  title: "Free Online PDF Tools — 100% Secure & Local Browser Processing | utool",
  description: "Merge, split, compress, protect, unlock, and convert PDF documents in your browser. 100% private client-side utilities—your files never leave your computer.",
  alternates: {
    canonical: "https://utool.in/tools/pdf-tools",
  },
  openGraph: {
    title: "Free Online PDF Tools — 100% Secure & Local | utool",
    description: "Merge, split, compress, protect, unlock, and convert PDF documents in your browser. Your files never leave your computer.",
    url: "https://utool.in/tools/pdf-tools",
  }
};

const pdfTools = [
  {
    id: "pdf-merger",
    name: "PDF Compiler & Merger",
    description: "Combine multiple PDF pages into a single document structure locally.",
    tag: "merge",
    status: "live" as const,
    isPremium: false,
    href: "/tools/merge-pdf",
    icon: Layers
  },
  {
    id: "pdf-split",
    name: "PDF Splitter",
    description: "Split PDF documents by page range or extract individual pages.",
    tag: "split",
    status: "live" as const,
    isPremium: false,
    href: "/tools/split-pdf",
    icon: Maximize2
  },
  {
    id: "pdf-compress",
    name: "PDF Compressor",
    description: "Reduce PDF file sizes while maintaining document quality.",
    tag: "compress",
    status: "live" as const,
    isPremium: false,
    href: "/tools/compress-pdf",
    icon: Minimize2
  },
  {
    id: "protect-pdf",
    name: "Add Password",
    description: "Protect your PDF files with military-grade AES-256 password encryption to prevent unauthorized access.",
    tag: "pdf-add-password",
    status: "live" as const,
    isPremium: false,
    href: "/tools/protect-pdf",
    icon: Lock
  },
  {
    id: "unlock-pdf",
    name: "Remove Password",
    description: "Unlock protected PDF files. Enter the current password to decrypt and save a clean, accessible copy.",
    tag: "pdf-remove-password",
    status: "live" as const,
    isPremium: false,
    href: "/tools/unlock-pdf",
    icon: Unlock
  },
  {
    id: "image-to-pdf",
    name: "Image to PDF Converter",
    description: "Convert PNG, JPG, JPEG, and WebP images into a single clean PDF document locally.",
    tag: "image-to-pdf",
    status: "live" as const,
    isPremium: false,
    href: "/tools/image-to-pdf",
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
    id: "jpg-to-pdf",
    name: "JPG to PDF Converter",
    description: "Convert and compile JPG/JPEG photos into an aligned vector PDF.",
    tag: "jpg-to-pdf",
    status: "live" as const,
    isPremium: false,
    href: "/tools/jpg-to-pdf",
    icon: FileText
  }
];

const faqs = [
  {
    q: "Are my PDF files safe when using Utool?",
    a: "Absolutely. Utool is engineered with a strict client-side architecture using WebAssembly (WASM) and local JavaScript. This means all file parsing, merging, compression, and encryption happen entirely inside your web browser sandbox. Your files are never uploaded to a cloud server, ensuring absolute privacy, data compliance (GDPR, HIPAA), and security."
  },
  {
    q: "Do I need to pay or create an account to use these tools?",
    a: "No. All core PDF utilities on Utool are 100% free with no registration, no email signup, and no subscription caps. You can compress, merge, and protect your files instantly."
  },
  {
    q: "Is there a limit on file size or page counts?",
    a: "Unlike cloud-based competitors (like iLovePDF and Smallpdf) that impose server upload limits (e.g. 10MB or 50MB), Utool processes everything using your local computer's CPU and memory. This allows you to compile, split, or compress extremely large files offline without hitting server boundaries."
  },
  {
    q: "Can I use Utool offline?",
    a: "Yes. Once the PDF tools index page is loaded in your browser window, the underlying WebAssembly engines remain fully operational. You can disconnect from the internet and continue to merge, compress, and edit PDF documents locally."
  }
];

export default function PdfToolsCategoryPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://utool.in" },
      { "@type": "ListItem", "position": 2, "name": "Tools", "item": "https://utool.in/tools" },
      { "@type": "ListItem", "position": 3, "name": "PDF Tools", "item": "https://utool.in/tools/pdf-tools" }
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
            <span className="text-foreground font-bold">PDF Tools</span>
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
                  Free Online <span className="gradient-text bg-gradient-to-r from-primary via-secondary to-accent">PDF Tools</span>
                </h1>
                <p className="text-body-m text-muted-foreground leading-relaxed">
                  Combine, split, extract, compress, encrypt, and convert your documents in seconds. Process files locally in your browser memory for absolute data security.
                </p>
              </div>
              <div className="lg:col-span-2 border border-border rounded-2xl p-6 bg-card space-y-4 shadow-sm">
                <h3 className="text-sm font-bold text-foreground">Why Local Processing Matters</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Unlike traditional cloud software that uploads files to remote servers, Utool handles PDF structures inside your browser cache. This eliminates data leakage threats and guarantees HIPAA/GDPR regulatory safety.
                </p>
              </div>
            </div>
          </div>

          {/* Tools Grid */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Select PDF Utility Spoke</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pdfTools.map((tool, idx) => (
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
                Building an Optimized Workspace for Corporate & Private Document Streams
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed text-justify">
                Managing PDF workflows efficiently is a staple requirement in modern workspaces, career planning, and personal administration. However, standard cloud converters require you to transfer document data arrays to public cloud servers. For documents containing employee records, financial receipts, bank statements, or legal contracts, this upload represents a significant compliance breach. Utool resolves this by shifting the compilation pipeline to a decentralized local framework.
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed text-justify">
                By loading WebAssembly workers directly inside your web browser sandbox, Utool reads PDF object maps, modifies xref tables, subset fonts, and rescales embedded images locally. This means massive files (up to 1GB or more) can be processed instantly without server upload latency or subscriptions locks.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Document Assembly: Merging, Splitting, and Layout Structuring
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed text-justify">
                A primary bottleneck in office productivity is document consolidation. Utool’s PDF Compiler & Merger enables you to arrange files visually using drag-and-drop cards. The local engine compiles document streams in any sequence, saving the resulting file directly to your disk cache. Similarly, the PDF Splitter offers a visual selector that extracts specific pages, custom ranges (like page 1, 4-8), or partitions a document page by page in milliseconds.
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed text-justify">
                To prepare documents for email distribution or visa applications, our PDF Compressor strips redundant metadata, deduplicates font structures, and downsamples raster elements to A4/DPI Web standards. This reduces filesizes up to 80% without blurring text elements, making them ready for instant uploads.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Privacy Enforcement: Local Encryption and Password Removal
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed text-justify">
                Security is paramount. Utool's Protect PDF tool wraps native qpdf libraries to apply AES-256 encryption keys to your files in browser memory. You can set permissions to disable editing, copying, and printing before sharing sensitive corporate presentations. If you need to remove restrictions to merge or modify templates, the Unlock PDF tool decrypts files locally upon user authorization, stripping protection flags cleanly.
              </p>
            </div>
          </section>

          {/* FAQs Accordion */}
          <section className="border-t border-border pt-10 space-y-6 max-w-4xl">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Frequently Asked Questions (PDF Category)
            </h2>
            <FaqAccordion faqs={faqs} />
          </section>

          {/* Horizontal category navigation */}
          <section className="border-t border-border pt-10 space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Other Categories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Link href="/tools/image-tools" className="flex justify-between items-center border border-border hover:border-primary/20 rounded-xl p-4 bg-card hover:bg-muted/30 transition-all text-xs font-bold">
                Image Tools
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
