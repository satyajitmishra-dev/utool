import { siteConfig } from "@/config/site";

export async function GET() {
  const baseUrl = siteConfig.url && !siteConfig.url.includes("localhost")
    ? siteConfig.url.replace(/\/$/, "")
    : "https://utool.in";

  const pages = [
    "",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/security",
    "/why-local-processing",
    "/editorial-policy",
    "/cookies",
    "/changelog",
    "/status",
    "/careers",
    "/authors",
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (p) => `  <url>
    <loc>${baseUrl}${p}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${p === "" ? "1.0" : "0.7"}</priority>
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
