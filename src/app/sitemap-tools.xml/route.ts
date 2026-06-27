import { siteConfig } from "@/config/site";
import { TOOL_REGISTRY } from "@/config/tool-registry";

export async function GET() {
  const baseUrl = siteConfig.url && !siteConfig.url.includes("localhost")
    ? siteConfig.url.replace(/\/$/, "")
    : "https://utool.in";

  // Exclude noIndex tools; include all others
  const indexableTools = TOOL_REGISTRY.filter((t) => t.isActive && !t.noIndex);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexableTools
  .map((t) => {
    // Intent-variant pages get slightly lower priority than base tools
    const priority = t.intentVariant ? "0.7" : "0.9";
    // Variants change less frequently
    const changefreq = t.intentVariant ? "monthly" : "weekly";
    return `  <url>
    <loc>${baseUrl}/tools/${t.slug}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  })
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
export const dynamic = 'force-dynamic';
export const revalidate = 86400;

