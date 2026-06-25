"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Globe, Eye, Copy, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";

export function MetaTagGeneratorTool() {
  const [title, setTitle] = useState("Utool - Premium Web Utility Suite");
  const [description, setDescription] = useState("Free high-speed utility tools for developers, designers, and marketers. PDF editors, converters, QR generators, and more.");
  const [keywords, setKeywords] = useState("pdf tools, developer tools, qr code, utility suite");
  const [author, setAuthor] = useState("Utool");
  const [ogImageUrl, setOgImageUrl] = useState("https://utool.in/og-image.png");
  const [copied, setCopied] = useState(false);

  const metaHtml = `<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}">
<meta name="description" content="${description}">
<meta name="keywords" content="${keywords}">
<meta name="author" content="${author}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://yourwebsite.com/">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${ogImageUrl}">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="https://yourwebsite.com/">
<meta property="twitter:title" content="${title}">
<meta property="twitter:description" content="${description}">
<meta property="twitter:image" content="${ogImageUrl}">`;

  const handleCopy = () => {
    navigator.clipboard.writeText(metaHtml);
    setCopied(true);
    toast.success("Meta tags copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Parameters Form */}
        <GlassCard className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5 border-b border-border pb-3">
            <Globe className="h-4.5 w-4.5 text-primary" />
            Meta Properties
          </h3>

          <div className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                Page Title ({title.length} / 60 chars)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value.substring(0, 70))}
                className="w-full bg-muted/40 border border-border focus:border-primary rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    title.length > 60 ? "bg-amber-400" : title.length > 30 ? "bg-emerald-400" : "bg-primary"
                  }`}
                  style={{ width: `${Math.min(100, (title.length / 60) * 100)}%` }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                Meta Description ({description.length} / 160 chars)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value.substring(0, 200))}
                className="w-full bg-muted/40 border border-border focus:border-primary rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary h-24 resize-none"
              />
              <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    description.length > 160 ? "bg-amber-400" : description.length > 100 ? "bg-emerald-400" : "bg-primary"
                  }`}
                  style={{ width: `${Math.min(100, (description.length / 160) * 100)}%` }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                Keywords (comma separated)
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="w-full bg-muted/40 border border-border focus:border-primary rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                  Author
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full bg-muted/40 border border-border focus:border-primary rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                  OG Image URL
                </label>
                <input
                  type="text"
                  value={ogImageUrl}
                  onChange={(e) => setOgImageUrl(e.target.value)}
                  className="w-full bg-muted/40 border border-border focus:border-primary rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Live Search & Social Previews */}
        <div className="space-y-6">
          {/* Google Search Preview */}
          <GlassCard className="p-5 space-y-3">
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
              <Search className="h-3.5 w-3.5" />
              Google SERP Preview
            </h4>
            <div className="bg-slate-900/5 dark:bg-slate-50/5 border border-border rounded-xl p-4.5 space-y-1 font-sans">
              <div className="flex items-center gap-1.5 text-2xs text-muted-foreground">
                <span>https://yourwebsite.com</span>
                <span>›</span>
              </div>
              <h5 className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer leading-tight truncate">
                {title || "Please enter a title..."}
              </h5>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                {description || "Please enter a description..."}
              </p>
            </div>
          </GlassCard>

          {/* Social Share Card Preview */}
          <GlassCard className="p-5 space-y-3">
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5" />
              Social Card Preview
            </h4>
            <div className="border border-border rounded-xl overflow-hidden font-sans bg-card shadow-sm">
              <div className="aspect-[1.91/1] relative bg-muted/20 border-b border-border/80 flex items-center justify-center overflow-hidden">
                {ogImageUrl.startsWith("http") ? (
                  <img
                    src={ogImageUrl}
                    alt="OG Card preview"
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="text-muted-foreground text-xs italic">No Image Provided</div>
                )}
              </div>
              <div className="p-4 space-y-1 bg-muted/10">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">YOURWEBSITE.COM</span>
                <h5 className="text-xs font-bold text-foreground line-clamp-1">{title}</h5>
                <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">{description}</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* HTML Output Card */}
      <GlassCard className="p-5 space-y-3">
        <div className="flex justify-between items-center border-b border-border pb-3">
          <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
            Generated HTML Header Tags
          </h4>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition px-2.5 py-1.5 rounded-lg hover:bg-muted/40"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                Copied HTML
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy Code
              </>
            )}
          </button>
        </div>
        <pre className="rounded-xl border border-border bg-slate-900/5 dark:bg-slate-950/20 p-4 text-2xs font-mono text-foreground overflow-x-auto leading-relaxed max-h-[300px] select-all">
          {metaHtml}
        </pre>
      </GlassCard>
    </div>
  );
}
