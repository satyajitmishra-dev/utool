import { MetadataRoute } from "next";
import { TOOL_REGISTRY } from "@/config/tool-registry";
import { blogPosts } from "@/config/blog-data";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  // Ensure we use the production base URL in the crawlers' sitemap, falling back to canonical utool.com
  const baseUrl =
    siteConfig.url && !siteConfig.url.includes("localhost")
      ? siteConfig.url
      : "https://utool.in";

  // 1. Core and E-E-A-T pages
  const staticRoutes = [
    "",
    "/tools",
    "/tools/pdf-tools",
    "/tools/image-tools",
    "/tools/developer-tools",
    "/tools/resume-tools",
    "/tools/text-tools",
    "/tools/media-tools",
    "/blog",
    "/about",
    "/privacy",
    "/terms",
    "/contact",
    "/security",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // 2. Programmatic Tool pages
  const toolRoutes = TOOL_REGISTRY.map((tool) => ({
    url: `${siteConfig.url}/tools/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // 3. Blog pages
  const blogRoutes = Object.keys(blogPosts).map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...toolRoutes, ...blogRoutes];
}
