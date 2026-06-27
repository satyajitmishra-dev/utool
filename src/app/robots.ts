import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    siteConfig.url && !siteConfig.url.includes("localhost")
      ? siteConfig.url
      : "https://utool.in";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/admin/",
        "/dashboard/",
        "/login/",
        "/register/",
        "/checkout/",
        "/auth/",
        "/billing/",
        "/history/",
        "/signup",
        "/forgot-password",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
