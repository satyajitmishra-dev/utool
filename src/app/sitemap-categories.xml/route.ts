import { siteConfig } from "@/config/site";

export async function GET() {
  const baseUrl = siteConfig.url && !siteConfig.url.includes("localhost")
    ? siteConfig.url.replace(/\/$/, "")
    : "https://utool.in";

  const categories = [
    "/tools",
    "/tools/pdf-tools",
    "/tools/image-tools",
    "/tools/developer-tools",
    "/tools/resume-tools",
    "/tools/text-tools",
    "/tools/media-tools",
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${categories
  .map(
    (c) => `  <url>
    <loc>${baseUrl}${c}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
  )
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
