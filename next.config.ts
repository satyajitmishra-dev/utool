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
  async headers() {
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.clarity.ms https://*.clarity.ms https://checkout.razorpay.com https://apis.google.com https://cdnjs.cloudflare.com;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      img-src 'self' data: blob: https://api.dicebear.com https://www.clarity.ms https://*.clarity.ms https://*.google-analytics.com;
      font-src 'self' https://fonts.gstatic.com;
      connect-src 'self' blob: https://*.google-analytics.com https://www.google.com https://apis.google.com https://cdn.jsdelivr.net https://*.clarity.ms https://*.firebaseio.com wss://*.firebaseio.com https://*.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://api.razorpay.com;
      frame-src 'self' https://api.razorpay.com https://*.firebaseapp.com;
      media-src 'self' blob: data:;
      worker-src 'self' blob: https://cdnjs.cloudflare.com;
      child-src 'self' blob: https://cdnjs.cloudflare.com;
      object-src 'none';
    `.replace(/\s{2,}/g, ' ').trim();

    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader,
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
