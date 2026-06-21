import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    siteConfig.url && !siteConfig.url.includes("localhost")
      ? siteConfig.url
      : "https://toolzy.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard/",
        "/api/",
        "/auth/",
        "/billing/",
        "/history/",
        "/login",
        "/signup",
        "/forgot-password",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
