import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["firebase-admin"],
  experimental: {
    proxyClientMaxBodySize: "30mb",
  },
  async redirects() {
    return [
      {
        source: "/support/admin",
        destination: "/admin/support",
        permanent: true,
      },
      {
        source: "/qr-generator",
        destination: "/tools/qr-generator",
        permanent: true,
      },
      {
        source: "/url-shortener",
        destination: "/tools/url-shortener",
        permanent: true,
      },
      {
        source: "/resume-builder",
        destination: "/tools/resume-builder",
        permanent: true,
      },
      {
        source: "/pdf-tools/merge",
        destination: "/tools/merge-pdf",
        permanent: true,
      },
      {
        source: "/pdf-tools/split",
        destination: "/tools/split-pdf",
        permanent: true,
      },
      {
        source: "/pdf-tools/compress",
        destination: "/tools/compress-pdf",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
