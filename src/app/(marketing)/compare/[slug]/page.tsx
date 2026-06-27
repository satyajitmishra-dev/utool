import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Home, ChevronRight, Check, X, Shield, Zap, Sparkles, Scale } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

function getComparisonData(slug: string) {
  const normSlug = slug.toLowerCase();
  
  // Resolve competitor name from slug
  let competitor = "Cloud PDF Converters";
  let competitorKey = "cloud-tools";
  
  if (normSlug.includes("ilovepdf")) {
    competitor = "iLovePDF";
    competitorKey = "ilovepdf";
  } else if (normSlug.includes("smallpdf")) {
    competitor = "Smallpdf";
    competitorKey = "smallpdf";
  } else if (normSlug.includes("canva")) {
    competitor = "Canva";
    competitorKey = "canva";
  } else if (normSlug.includes("adobe") || normSlug.includes("acrobat")) {
    competitor = "Adobe Acrobat";
    competitorKey = "adobe";
  }

  // Resolve tool if any (e.g. merge-pdf-vs-ilovepdf)
  let specificTool = "";
  if (normSlug.includes("merge")) specificTool = "Merge PDF";
  else if (normSlug.includes("compress")) specificTool = "Compress PDF";
  else if (normSlug.includes("split")) specificTool = "Split PDF";
  else if (normSlug.includes("protect")) specificTool = "Protect PDF";
  else if (normSlug.includes("unlock")) specificTool = "Unlock PDF";

  return {
    competitor,
    competitorKey,
    specificTool,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { competitor, specificTool } = getComparisonData(slug);
  
  const title = specificTool 
    ? `Utool vs ${competitor} for ${specificTool} — Secure Local Alternative`
    : `Utool vs ${competitor} — Best Privacy-First Utility Alternative`;

  const description = `Compare features, pricing, and document security protocols between Utool and ${competitor}. See why local browser-side execution is faster and safer.`;

  return { title, description };
}

export default async function ComparisonPage({ params }: Props) {
  const { slug } = await params;
  const { competitor, specificTool } = getComparisonData(slug);

  return (
    <div className="min-h-screen bg-[#070708] text-neutral-100 font-sans selection:bg-violet-500/20 pt-28 pb-12">
      <div className="max-w-4xl mx-auto px-6 space-y-12">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          <Link href="/" className="hover:text-white flex items-center gap-1 transition-colors">
            <Home className="h-3.5 w-3.5" /> Home
          </Link>
          <ChevronRight className="h-3 w-3 text-neutral-600" />
          <span className="text-violet-400 font-bold">Compare Alternatives</span>
        </nav>

        {/* Hero Section */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-semibold text-violet-400">
            <Scale className="h-3.5 w-3.5" />
            Platform Comparison
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl leading-tight">
            Compare Utool vs <span className="text-violet-400">{competitor}</span>
            {specificTool && ` for ${specificTool}`}
          </h1>
          <p className="max-w-2xl text-sm text-neutral-400 leading-relaxed">
            Unpack the critical differences in speed, cost, and data compliance policies. Traditional utilities upload your files to remote cloud storage, while Utool operates 100% locally in your browser.
          </p>
        </div>

        {/* Highlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl border border-neutral-800 bg-neutral-900/10 space-y-4">
            <div className="h-10 w-10 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-white text-base">Local Processing Sandbox</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              With Utool, your files are read as memory streams locally on your device. They never transit the network, ensuring absolute immunity to servers-side document leaks, complying with strict corporate security policies.
            </p>
          </div>
          
          <div className="p-6 rounded-3xl border border-neutral-800 bg-neutral-900/10 space-y-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-white text-base">Instant Startup Execution</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              No uploading wait times means your workspace is ready immediately. Skip the heavy network upload cycles and get outputs generated at raw device CPU compilation rates.
            </p>
          </div>
        </div>

        {/* Matrix Table */}
        <div className="border border-neutral-800 rounded-3xl overflow-hidden bg-neutral-950/20">
          <div className="p-6 border-b border-neutral-800 bg-neutral-900/15">
            <h3 className="font-bold text-white text-sm tracking-tight">Feature & Security Matrix</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 font-bold bg-neutral-950/40">
                  <th className="p-4">Criteria</th>
                  <th className="p-4 text-violet-400">Utool (Local-First)</th>
                  <th className="p-4">{competitor}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900">
                <tr>
                  <td className="p-4 font-bold text-neutral-300">File Processing Location</td>
                  <td className="p-4 text-violet-400 font-semibold">Local Browser Sandbox</td>
                  <td className="p-4 text-neutral-500">Cloud Servers</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-neutral-300">Data Transmission Leak Risk</td>
                  <td className="p-4 text-emerald-400 font-semibold flex items-center gap-1.5">
                    <Check className="h-4 w-4" /> None (0% Network Transit)
                  </td>
                  <td className="p-4 text-rose-400 flex items-center gap-1.5">
                    <X className="h-4 w-4" /> High (Requires Upload)
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-neutral-300">Daily Upload Bandwidth Required</td>
                  <td className="p-4 text-neutral-300">None (Offline Capable)</td>
                  <td className="p-4 text-neutral-500">Highly Dependent on File Size</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-neutral-300">File Size Paywalls</td>
                  <td className="p-4 text-emerald-400 font-semibold flex items-center gap-1.5">
                    <Check className="h-4 w-4" /> Free 50MB / Pro 200MB
                  </td>
                  <td className="p-4 text-rose-400 flex items-center gap-1.5">
                    <X className="h-4 w-4" /> Strict Limits (Typically 10-15MB)
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-neutral-300">Corporate Compliance</td>
                  <td className="p-4 text-emerald-400 font-semibold flex items-center gap-1.5">
                    <Check className="h-4 w-4" /> HIPAA, GDPR Compliant by Design
                  </td>
                  <td className="p-4 text-neutral-500">Requires Enterprise Agreements</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-violet-950/20 to-neutral-900 border border-violet-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <h4 className="font-bold text-white text-base">Ready to test local-first speeds?</h4>
            <p className="text-xs text-neutral-400">
              Run your first file operation without generating accounts or sending credit details.
            </p>
          </div>
          <Link
            href="/tools"
            className="px-6 py-3 rounded-2xl bg-violet-600 hover:bg-violet-500 text-xs font-bold text-white transition-all text-center"
          >
            Browse Free Tools
          </Link>
        </div>

      </div>
    </div>
  );
}
