import { siteConfig } from "@/config/site";
import { blogPosts } from "@/config/blog-data";

export async function GET() {
  const baseUrl = siteConfig.url && !siteConfig.url.includes("localhost")
    ? siteConfig.url.replace(/\/$/, "")
    : "https://utool.in";

  const mainImages = `  <url>
    <loc>${baseUrl}</loc>
    <image:image>
      <image:loc>${baseUrl}/logo.png</image:loc>
      <image:title>UTool Logo</image:title>
    </image:image>
  </url>`;

  const blogImages = Object.values(blogPosts)
    .map(
      (post) => `  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <image:image>
      <image:loc>${baseUrl}/favicon.ico</image:loc>
      <image:title>${post.h1}</image:title>
    </image:image>
  </url>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${mainImages}
${blogImages}
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
