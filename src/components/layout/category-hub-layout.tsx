import React from "react";
import Link from "next/link";
import { ToolCard } from "@/components/ui/tool-card";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { Badge } from "@/components/ui/badge";
import { TOOL_REGISTRY } from "@/config/tool-registry";
import { 
  Sparkles, 
  ShieldCheck, 
  ChevronRight, 
  Home, 
  ArrowLeft,
  ArrowRight,
  FileText,
  Scissors,
  Maximize2,
  Lock,
  LockOpen,
  Image as ImageIcon,
  Camera,
  QrCode,
  Link as LinkIcon,
  User,
  FileCode,
  Video,
  Sliders,
  FileCheck,
  RefreshCw,
  Activity,
  Zap,
  Globe,
  Plus,
  Crop,
  Scale,
  Music,
  RotateCcw,
  Trash2,
  PenTool,
  EyeOff,
  FileImage,
  Gauge,
  Cpu,
  Layers,
  Shield,
  Laptop
} from "lucide-react";

// Icon resolution helper matching the explorer page mapping
function getToolIcon(iconTag: string) {
  switch (iconTag) {
    case "FileText": return FileText;
    case "Scissors": return Scissors;
    case "Maximize2": return Maximize2;
    case "Lock": return Lock;
    case "LockOpen": return LockOpen;
    case "ImageIcon": return ImageIcon;
    case "Camera": return Camera;
    case "QrCode": return QrCode;
    case "LinkIcon": return LinkIcon;
    case "User": return User;
    case "FileCode": return FileCode;
    case "RefreshCw": return RefreshCw;
    case "Sliders": return Sliders;
    case "Video": return Video;
    case "FileCheck": return FileCheck;
    case "Crop": return Crop;
    case "Scale": return Scale;
    case "Music": return Music;
    case "RotateCcw": return RotateCcw;
    case "Trash2": return Trash2;
    case "PenTool": return PenTool;
    case "EyeOff": return EyeOff;
    case "FileImage": return FileImage;
    case "Gauge": return Gauge;
    case "Cpu": return Cpu;
    case "Layers": return Layers;
    case "Shield": return Shield;
    case "Laptop": return Laptop;
    default: return Sparkles;
  }
}

interface CategoryHubLayoutProps {
  title: string;
  description: string;
  canonicalUrl: string;
  categoryName: string;
  faqs: Array<{ q: string; a: string }>;
}

export function CategoryHubLayout({
  title,
  description,
  canonicalUrl,
  categoryName,
  faqs
}: CategoryHubLayoutProps) {
  // Query all tools belonging to this category from the unified registry
  const filteredTools = TOOL_REGISTRY.filter(
    (t) => t.category === categoryName && t.isActive
  );

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://utool.in" },
      { "@type": "ListItem", "position": 2, "name": "Tools", "item": "https://utool.in/tools" },
      { "@type": "ListItem", "position": 3, "name": title, "item": canonicalUrl }
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
            <span className="text-foreground font-bold">{title}</span>
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
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground leading-tight">
                  {title}
                </h1>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </div>

              <div className="lg:col-span-2 rounded-2xl border border-border bg-card/45 p-6 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Security Guarantee
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Every tool in this category processes data inside your local browser tab. No uploads are triggered, keeping your data confidential.
                </p>
              </div>
            </div>
          </div>

          {/* Tools Grid */}
          <section className="space-y-6">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Available Utilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool, idx) => (
                <ToolCard
                  key={tool.id}
                  title={tool.name}
                  description={tool.description}
                  href={`/tools/${tool.slug}`}
                  tag={tool.iconTag}
                  status={tool.isPremium ? "pro" : "live"}
                  isPremium={tool.isPremium}
                  requiresAuth={tool.requiresAuth}
                  index={idx}
                />
              ))}
            </div>
          </section>

          {/* FAQs Accordion */}
          {faqs.length > 0 && (
            <section className="border-t border-border pt-12 space-y-6 max-w-4xl">
              <h2 className="text-2xl font-bold tracking-tight text-foreground text-left">
                Frequently Asked Questions
              </h2>
              <FaqAccordion faqs={faqs} />
            </section>
          )}

          {/* Quick Category Navigation */}
          <section className="border-t border-border pt-12 flex justify-between items-center">
            <Link href="/tools">
              <ButtonWithArrow text="Back to Explorer" direction="left" />
            </Link>
          </section>
        </main>
      </div>
    </>
  );
}

// Simple button visual helper
function ButtonWithArrow({ text, direction = "right" }: { text: string; direction?: "left" | "right" }) {
  return (
    <button className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-xs font-bold text-foreground hover:bg-muted/50 transition cursor-pointer">
      {direction === "left" && <ArrowLeft className="h-3.5 w-3.5" />}
      {text}
      {direction === "right" && <ArrowRight className="h-3.5 w-3.5" />}
    </button>
  );
}
