import { Metadata } from "next";
import { siteConfig } from "@/config/site";

interface ConstructMetadataProps {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
}

export function constructMetadata({
  title,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  icons = "/favicon.ico",
  noIndex = false,
}: ConstructMetadataProps = {}): Metadata {
  const fullTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;

  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      url: siteConfig.url,
      siteName: siteConfig.name,
      images: [
        {
          url: image,
          alt: fullTitle,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
      creator: "@utool",
    },
    icons: {
      icon: icons,
      shortcut: "/favicon-16x16.png",
      apple: "/apple-touch-icon.png",
    },
    metadataBase: new URL(siteConfig.url),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}

import { toolsSeoData } from "@/config/tools-seo-data";
import { blogPosts } from "@/config/blog-data";

/**
 * Generates search-optimized metadata for programmatic tool pages.
 */
export function generateToolMetadata(slug: string): Metadata {
  const tool = toolsSeoData[slug];
  if (!tool) {
    return constructMetadata({
      title: "Developer & PDF Utilities",
      description: "Access 60+ free developer and productivity tools online.",
    });
  }

  return constructMetadata({
    title: tool.title,
    description: tool.description,
  });
}

/**
 * Generates metadata for blog article posts.
 */
export function generateBlogMetadata(slug: string): Metadata {
  const post = blogPosts[slug];
  if (!post) {
    return constructMetadata({
      title: "utool Blog",
      description: "Read helpful guides about PDF workflows, resume building, and developer productivity.",
    });
  }

  return constructMetadata({
    title: post.title,
    description: post.description,
  });
}

/**
 * Generates metadata for specific article clusters.
 */
export function generateCategoryMetadata(category: string): Metadata {
  const categories: Record<string, { title: string; desc: string }> = {
    "pdf-tools": {
      title: "Free PDF Utilities — Merge, Split, Compress PDFs | utool",
      desc: "Merge PDF files, extract ranges, and compress document sizes online. All tools process files locally in your browser for absolute privacy.",
    },
    "qr-guides": {
      title: "QR Code Guides & WiFi Generator Tutorials | utool Blog",
      desc: "Learn how to generate Wi-Fi auto-login codes, optimize print contrast, and design static QR codes for marketing.",
    },
    "resume-guides": {
      title: "ATS Resume Writing Guides & Career Advice | utool Blog",
      desc: "Pass applicant tracking systems with expert resume formatting, single-column structures, and job description keyword targeting.",
    },
  };

  const data = categories[category] || {
    title: "utool Blog & Guides",
    desc: "Read the latest tips on developer workflows, link shortening, and marketing utilities.",
  };

  return constructMetadata({
    title: data.title,
    description: data.desc,
  });
}

