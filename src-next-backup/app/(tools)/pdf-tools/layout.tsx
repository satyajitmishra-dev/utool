"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useToolLimit } from "@/hooks/use-tool-limit";
import { siteConfig } from "@/config/site";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/section";
import { User, LogOut, ArrowLeft, Sparkles, RefreshCw, Wrench } from "lucide-react";

export default function PDFToolsLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { limitStatus, loading: limitLoading, refresh } = useToolLimit();
  const pathname = usePathname();
  const isHubPage = pathname === "/pdf-tools";

  const currentTool = (() => {
    if (pathname === "/pdf-tools/merge") return { name: "Merge PDF", status: "live" };
    if (pathname === "/pdf-tools/split") return { name: "Split PDF", status: "coming-soon" };
    if (pathname === "/pdf-tools/compress") return { name: "Compress PDF", status: "coming-soon" };
    return null;
  })();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border">
        <Container>
          <div className="flex h-16 items-center justify-between">
            {/* Logo and Active Tool Badge */}
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-2.5 font-semibold text-[17px] tracking-tight text-foreground hover:opacity-90 transition-opacity"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[image:var(--gradient-primary)] shadow-sm">
                  <Wrench className="h-[18px] w-[18px] text-white" />
                </div>
                <span>
                  {siteConfig.name}{" "}
                  <Badge variant="primary" className="ml-1 align-middle text-[9px]">
                    Workspace
                  </Badge>
                </span>
              </Link>

              {currentTool && (
                <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-border">
                  <span className="text-caption font-bold text-foreground">{currentTool.name}</span>
                  <Badge variant={currentTool.status === "live" ? "success" : "default"}>
                    {currentTool.status === "live" ? "Live" : "Coming Soon"}
                  </Badge>
                </div>
              )}
            </div>

            {/* Right Status */}
            <div className="flex items-center gap-3">
              {!limitLoading ? (
                limitStatus.tier === "pro" || limitStatus.tier === "enterprise" ? (
                  <Badge variant="pro" className="hidden sm:inline-flex">
                    <Sparkles className="h-3 w-3" />
                    Pro: Unlimited
                  </Badge>
                ) : (
                  <div className="hidden sm:flex items-center gap-2">
                    <Badge variant="default">
                      Actions: {limitStatus.count} / {limitStatus.max}
                    </Badge>
                    <button
                      onClick={refresh}
                      className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      title="Refresh limits"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )
              ) : (
                <div className="hidden sm:block h-6 w-24 skeleton rounded-full" />
              )}

              <ThemeToggle />

              <div className="flex items-center gap-2 pl-3 border-l border-border">
                {user ? (
                  <>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted border border-border text-muted-foreground" title={user?.email || "User"}>
                      <User className="h-4 w-4" />
                    </div>
                    <button
                      onClick={logout}
                      className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted transition-colors"
                      title="Log Out"
                    >
                      <LogOut className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <Link
                    href={`/login?redirect=${encodeURIComponent(pathname)}`}
                    className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-3.5 py-1.5 text-caption font-bold text-foreground hover:bg-muted transition-all"
                  >
                    Log In
                  </Link>
                )}
              </div>
            </div>
          </div>
        </Container>
      </header>

      {/* Body */}
      <main className="flex-1">
        <Container className="py-10 flex flex-col">
          {!isHubPage && (
            <div className="mb-8">
              <Link
                href="/pdf-tools"
                className="inline-flex items-center gap-2 text-caption font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to PDF Catalog
              </Link>
            </div>
          )}
          <div className="flex-1 flex flex-col">{children}</div>
        </Container>
      </main>
    </div>
  );
}
