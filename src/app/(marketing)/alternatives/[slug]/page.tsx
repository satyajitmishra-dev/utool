import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Home, ChevronRight, CheckCircle2, Shield, Lock, Award, LayoutList } from "lucide-react";
import { TOOL_REGISTRY } from "@/config/tool-registry";

interface Props {
  params: Promise<{ slug: string }>;
}

function getCompetitorData(slug: string) {
  const normSlug = slug.toLowerCase();
  let competitor = "Cloud Utility Software";
  let description = "traditional SaaS tools";
  
  if (normSlug.includes("ilovepdf")) {
    competitor = "iLovePDF";
    description = "iLovePDF's online service";
  } else if (normSlug.includes("smallpdf")) {
    competitor = "Smallpdf";
    description = "Smallpdf's compression and editing suites";
  } else if (normSlug.includes("canva")) {
    competitor = "Canva";
    description = "Canva's document design workflows";
  } else if (normSlug.includes("adobe") || normSlug.includes("acrobat")) {
    competitor = "Adobe Acrobat Online";
    description = "Adobe's premium subscription portals";
  }

  return { competitor, description };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { competitor } = getCompetitorData(slug);
  return {
    title: `Best Free ${competitor} Alternative — Privacy-First | Utool`,
    description: `Looking for a safe, free alternative to ${competitor}? Utool runs entirely on your local machine with no file uploads and 100% data security.`,
  };
}

export default async function AlternativeLandingPage({ params }: Props) {
  const { slug } = await params;
  const { competitor, description } = getCompetitorData(slug);

  // Grab active tools to suggest as replacements
  const suggestedTools = TOOL_REGISTRY.filter(t => t.isActive).slice(0, 6);

  return (
    <div className="min-h-screen bg-[#070708] text-neutral-100 font-sans selection:bg-violet-500/20 pt-28 pb-12">
      <div className="max-w-4xl mx-auto px-6 space-y-12">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          <Link href="/" className="hover:text-white flex items-center gap-1 transition-colors">
            <Home className="h-3.5 w-3.5" /> Home
          </Link>
          <ChevronRight className="h-3 w-3 text-neutral-600" />
          <span className="text-violet-400 font-bold">Best Alternatives</span>
        </nav>

        {/* Hero Section */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-semibold text-violet-400">
            <Award className="h-3.5 w-3.5" />
            Featured Alternative
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl leading-tight">
            The #1 Privacy-First Alternative to <span className="text-violet-400">{competitor}</span>
          </h1>
          <p className="max-w-2xl text-sm text-neutral-400 leading-relaxed">
            Stop uploading sensitive documents, invoices, and corporate plans to public clouds. Utool replaces {description} with secure client-side WebAssembly programs running locally in your browser.
          </p>
        </div>

        {/* Core Value Pillars */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-white tracking-tight">Why Users are Switching to Utool</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl border border-neutral-900 bg-neutral-950/40 space-y-3">
              <Shield className="h-5 w-5 text-violet-400" />
              <h4 className="font-bold text-neutral-200 text-sm">Absolute Privacy</h4>
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                Zero network uploads. All calculations run in your device's memory. Compliance standard ready.
              </p>
            </div>
            
            <div className="p-5 rounded-2xl border border-neutral-900 bg-neutral-950/40 space-y-3">
              <Lock className="h-5 w-5 text-emerald-400" />
              <h4 className="font-bold text-neutral-200 text-sm">No Forced Signups</h4>
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                Execute transactions and get download assets before creating user credentials.
              </p>
            </div>
            
            <div className="p-5 rounded-2xl border border-neutral-900 bg-neutral-950/40 space-y-3">
              <LayoutList className="h-5 w-5 text-sky-400" />
              <h4 className="font-bold text-neutral-200 text-sm">Unlimited File Sizes</h4>
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                Local resources process documents without server timeouts or payload limits.
              </p>
            </div>
          </div>
        </div>

        {/* Suggested Tools List */}
        <div className="space-y-6 pt-6 border-t border-neutral-900">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white tracking-tight">Start Using Utool Instantly</h3>
            <p className="text-xs text-neutral-500">Pick a tool below to replace your competitor workflow now:</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {suggestedTools.map((tool) => (
              <Link
                key={tool.id}
                href={`/tools/${tool.slug}`}
                className="flex items-center justify-between p-4 rounded-2xl border border-neutral-900 hover:border-violet-500/35 hover:bg-neutral-900/10 transition-all group"
              >
                <div className="space-y-1 min-w-0 pr-4">
                  <span className="font-bold text-neutral-200 text-xs truncate block group-hover:text-white transition-colors">
                    {tool.name}
                  </span>
                  <p className="text-[10px] text-neutral-500 truncate block">
                    {tool.description}
                  </p>
                </div>
                <CheckCircle2 className="h-4.5 w-4.5 text-neutral-700 group-hover:text-violet-400 transition-colors flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
