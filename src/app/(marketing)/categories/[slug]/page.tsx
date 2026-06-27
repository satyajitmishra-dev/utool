import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { TOOL_REGISTRY } from "@/config/tool-registry";
import { ArrowLeft, Home, Sparkles, Zap, ChevronRight, LayoutGrid } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const categorySlug = slug.toLowerCase().replace("-tools", "");
  const category = Array.from(new Set(TOOL_REGISTRY.map(t => t.category)))
    .find(cat => cat.toLowerCase() === categorySlug || cat.toLowerCase() === slug.toLowerCase());

  if (!category) {
    return { title: "Category Not Found | Utool" };
  }

  return {
    title: `Best Free ${category} Utilities Online — Privacy-First | Utool`,
    description: `Access premium free ${category.toLowerCase()} tools that run entirely in your local browser sandbox. No uploads, no paywalls, zero limits.`,
  };
}

export default async function CategoryHubPage({ params }: Props) {
  const { slug } = await params;
  const categorySlug = slug.toLowerCase().replace("-tools", "");
  const category = Array.from(new Set(TOOL_REGISTRY.map(t => t.category)))
    .find(cat => cat.toLowerCase() === categorySlug || cat.toLowerCase() === slug.toLowerCase());

  if (!category) {
    notFound();
  }

  // Filter tools belonging to this category
  const categoryTools = TOOL_REGISTRY.filter(t => t.category === category);

  // Group by active vs coming soon
  const activeTools = categoryTools.filter(t => t.isActive);
  const inactiveTools = categoryTools.filter(t => !t.isActive);

  return (
    <div className="min-h-screen bg-[#070708] text-neutral-100 font-sans selection:bg-violet-500/20 selection:text-white pt-28 pb-12">
      <div className="max-w-6xl mx-auto px-6 space-y-12">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          <Link href="/" className="hover:text-white flex items-center gap-1 transition-colors">
            <Home className="h-3.5 w-3.5" /> Home
          </Link>
          <ChevronRight className="h-3 w-3 text-neutral-600" />
          <Link href="/tools" className="hover:text-white transition-colors">
            Tools
          </Link>
          <ChevronRight className="h-3 w-3 text-neutral-600" />
          <span className="text-violet-400 font-bold">{category} Tools</span>
        </nav>

        {/* Hero Section */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-semibold text-violet-400">
            <LayoutGrid className="h-3.5 w-3.5" />
            Category Hub
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Premium Free <span className="text-violet-400">{category}</span> Tools
          </h1>
          <p className="max-w-2xl text-base text-neutral-400 leading-relaxed">
            Boost your productivity with premium, local-first utility tools. Our {category.toLowerCase()} engines process files directly on your CPU inside your browser sandbox—guaranteeing 100% data confidentiality and zero upload latency.
          </p>
        </div>

        {/* Active Tools Grid */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Zap className="h-4.5 w-4.5 text-violet-400 animate-pulse" />
            <h2 className="text-lg font-bold text-white tracking-tight">Available Utilities ({activeTools.length})</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeTools.map((tool) => (
              <Link
                key={tool.id}
                href={`/tools/${tool.slug}`}
                className="group relative flex flex-col justify-between p-6 rounded-3xl border border-neutral-800/60 bg-neutral-900/20 hover:bg-neutral-900/40 hover:border-violet-500/30 transition-all duration-200"
              >
                <div className="space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-neutral-900 border border-neutral-800 group-hover:border-violet-500/20 flex items-center justify-center text-lg transition-colors">
                    ✨
                  </div>
                  <h3 className="font-bold text-white group-hover:text-violet-400 transition-colors text-base">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed line-clamp-3">
                    {tool.description}
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-neutral-900 flex items-center justify-between text-4xs font-bold uppercase tracking-widest text-neutral-500 group-hover:text-violet-400 transition-colors">
                  <span>Open Tool</span>
                  <ChevronRight className="h-3.5 w-3.5 translate-x-0 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Inactive / Coming Soon Tools */}
        {inactiveTools.length > 0 && (
          <div className="space-y-6 pt-6 border-t border-neutral-900">
            <h2 className="text-lg font-bold text-neutral-400 tracking-tight">Upcoming Utilities ({inactiveTools.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60">
              {inactiveTools.map((tool) => (
                <div
                  key={tool.id}
                  className="flex flex-col justify-between p-6 rounded-3xl border border-neutral-900 bg-neutral-950/25"
                >
                  <div className="space-y-3">
                    <span className="text-xs px-2 py-0.5 rounded bg-neutral-800 text-neutral-500 font-semibold w-max block">
                      Coming Soon
                    </span>
                    <h3 className="font-bold text-neutral-300 text-base">
                      {tool.name}
                    </h3>
                    <p className="text-xs text-neutral-500 leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
