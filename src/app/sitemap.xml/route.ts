import { siteConfig } from "@/config/site";

export async function GET() {
  const baseUrl = siteConfig.url && !siteConfig.url.includes("localhost")
    ? siteConfig.url.replace(/\/$/, "")
    : "https://utool.in";

  const sitemaps = [
    "sitemap-pages.xml",
    "sitemap-categories.xml",
    "sitemap-tools.xml",
    "sitemap-blog.xml",
    "sitemap-images.xml",
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps
  .map(
    (s) => `  <sitemap>
    <loc>${baseUrl}/${s}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`
  )
  .join("\n")}
</sitemapindex>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
export const dynamic = 'force-dynamic';
export const revalidate = 86400; // Cache sitemap for 24 hours
