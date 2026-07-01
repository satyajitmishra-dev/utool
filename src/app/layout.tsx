import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import { ProProvider } from "@/context/pro-context";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AdProvider } from "@/components/ads/AdProvider";
import { AdSlot } from "@/components/ads/AdSlot";

import { Toaster } from "sonner";
import Script from "next/script";
import { FloatingSupport } from "@/components/support/floating-support";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "utool — Every Tool You Need, One Beautiful Workspace",
  description:
    "100+ premium developer, design, and productivity tools. 100% browser-based. Zero file uploads. No tracking. Just tools that work.",
  manifest: "/manifest.json",
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
    other: {
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || "",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;

  return (
    <html lang="en" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans antialiased bg-background text-foreground" suppressHydrationWarning>
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}', {
                    page_path: window.location.pathname,
                  });
                `
              }}
            />
          </>
        )}
        {clarityId && (
          <Script
            id="microsoft-clarity"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(c,l,a,r,i,t,y){
                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window,document,"clarity","script","${clarityId}");
              `
            }}
          />
        )}
        <ThemeProvider>
          <AuthProvider>
            <ProProvider>
              <AdProvider>
                {children}
                <AdSlot placement="bottom-mobile" />
              </AdProvider>
              <FloatingSupport />
              <Toaster
                position="top-center"
                richColors
                closeButton
                expand
                toastOptions={{
                  className: "!bg-card !text-card-foreground !border-border",
                }}
              />
            </ProProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
