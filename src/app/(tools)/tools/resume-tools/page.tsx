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
  Briefcase,
  User,
  GraduationCap
} from "lucide-react";

export const metadata: Metadata = {
  title: "Free ATS Resume Builder & Career Tools | utool",
  description: "Create professional, ATS-friendly resumes online. Pick from clean single-column templates, adjust margins, and download high-quality vector PDFs locally.",
  alternates: {
    canonical: "https://utool.in/tools/resume-tools",
  },
  openGraph: {
    title: "Free ATS Resume Builder & Career Tools | utool",
    description: "Create professional, ATS-friendly resumes online. Pick from clean layouts and download PDF files locally.",
    url: "https://utool.in/tools/resume-tools",
  }
};

const resumeTools = [
  {
    id: "resume-builder",
    name: "Resume Builder",
    description: "Design and print professional resumes with clean templates.",
    tag: "resume-builder",
    status: "beta" as const,
    isPremium: false,
    href: "/tools/resume-builder",
    icon: Briefcase
  }
];

const faqs = [
  {
    q: "What is an ATS-friendly resume?",
    a: "Applicant Tracking Systems (ATS) are used by employers to parse resume content. To pass them successfully, your resume must utilize a clean single-column layout, standard headings (like 'Work Experience' and 'Education'), and web-safe fonts. Multi-column templates or complex layouts often fail to parse correctly."
  },
  {
    q: "Is my personal work history stored in a database?",
    a: "No. Utool values privacy. All inputs, descriptions, and details entered into the resume builder remain local to your browser window memory. We do not collect or store your resume content."
  },
  {
    q: "Why is the download format limited to PDF?",
    a: "PDF is the gold standard for job applications. It preserves your exact layout, margins, and typography across all devices and operating systems, unlike Word files which can shift formats depending on software versions."
  }
];

export default function ResumeToolsCategoryPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://utool.in" },
      { "@type": "ListItem", "position": 2, "name": "Tools", "item": "https://utool.in/tools" },
      { "@type": "ListItem", "position": 3, "name": "Resume Tools", "item": "https://utool.in/tools/resume-tools" }
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
            <span className="text-foreground font-bold">Resume Tools</span>
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
                    100% Client-Side
                  </Badge>
                </div>
                <h1 className="text-display-l font-extrabold tracking-tight text-foreground leading-tight">
                  Free ATS <span className="gradient-text bg-gradient-to-r from-primary via-secondary to-accent">Resume Builder</span>
                </h1>
                <p className="text-body-m text-muted-foreground leading-relaxed">
                  Design professional resumes that pass applicant tracking systems with ease. Enter details visually and download a vector PDF directly from your device.
                </p>
              </div>
              <div className="lg:col-span-2 border border-border rounded-2xl p-6 bg-card space-y-4 shadow-sm">
                <h3 className="text-sm font-bold text-foreground">ATS Compliance Checked</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Our layouts strictly avoid complex tables, graphs, and custom fonts that disrupt parser algorithms. Utool guarantees clean, parseable resume hierarchies to give you the best chance of landing interviews.
                </p>
              </div>
            </div>
          </div>

          {/* Tools Grid */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Select Career Utility Spoke</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {resumeTools.map((tool, idx) => (
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
                How to Build an ATS-Friendly Resume for Modern Job Markets
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed text-justify">
                Over 90% of Fortune 500 companies use Applicant Tracking Systems (ATS) to filter job applications before they reach human eyes. These software systems scan documents for relevant keywords, job titles, educational metrics, and employment timestamps. If your resume contains unreadable custom formatting, multi-column divisions, or graphics, the parser may fail, resulting in automatic rejection.
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed text-justify">
                Utool’s Resume Builder is structured from the ground up to prevent these errors. It guides you to write single-column contact cards, professional statements, work experience histories, and core skills lists that can be read cleanly by tracking parsers.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                100% Client-Side Privacy for Private Career Credentials
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed text-justify">
                Your resume contains sensitive data, including your phone number, home address, employment history, and graduation years. Storing this information in database tables on public websites exposes you to identity tracking or security breaches.
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed text-justify">
                Utool resolves this security concern by processing all inputs locally on your computer. Your inputs are compiled into a PDF directly within your browser cache, keeping your personal details secure.
              </p>
            </div>
          </section>

          {/* FAQs Accordion */}
          <section className="border-t border-border pt-10 space-y-6 max-w-4xl">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Frequently Asked Questions (Resume Category)
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
              <Link href="/tools/image-tools" className="flex justify-between items-center border border-border hover:border-primary/20 rounded-xl p-4 bg-card hover:bg-muted/30 transition-all text-xs font-bold">
                Image Tools
                <ArrowRight className="h-4 w-4 text-primary" />
              </Link>
              <Link href="/tools/developer-tools" className="flex justify-between items-center border border-border hover:border-primary/20 rounded-xl p-4 bg-card hover:bg-muted/30 transition-all text-xs font-bold">
                Developer Tools
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
