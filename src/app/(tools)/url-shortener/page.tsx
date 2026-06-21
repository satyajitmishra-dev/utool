"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useToolLimit } from "@/hooks/use-tool-limit";
import { useAuth } from "@/context/auth-context";
import { db } from "@/config/firebase";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import {
  Link as LinkIcon,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  ArrowRight,
  User,
  LogOut,
  RefreshCw,
  Lock,
  ArrowLeft,
  Terminal,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { getAnonymousId } from "@/utils/anonymous-id";

interface ShortLink {
  id: string; // The short code
  longUrl: string;
  clicks: number;
  createdAt: any;
}

export default function URLShortenerPage({ hideHeader = false }: { hideHeader?: boolean }) {
  const { user, logout } = useAuth();
  const { limitStatus, loading: limitLoading, checkLimit, recordUsage, refresh } = useToolLimit();

  const [longUrl, setLongUrl] = useState("");
  const [shortening, setShortening] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [myLinks, setMyLinks] = useState<ShortLink[]>([]);
  const [loadingLinks, setLoadingLinks] = useState(true);

  // Generate a random 6-character short code
  const generateShortCode = (): string => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const getBaseUrl = (): string => {
    if (typeof window !== "undefined") {
      return `${window.location.protocol}//${window.location.host}`;
    }
    return "https://utool.in";
  };

  // Load user's links
  const fetchLinks = async () => {
    setLoadingLinks(true);
    const identifier = user ? user.uid : getAnonymousId();
    if (!identifier) {
      setLoadingLinks(false);
      return;
    }

    try {
      const q = query(
        collection(db, "url_shortener"),
        where("userId", "==", identifier),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const links: ShortLink[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        links.push({
          id: docSnap.id,
          longUrl: data.longUrl,
          clicks: data.clicks || 0,
          createdAt: data.createdAt,
        });
      });
      setMyLinks(links);
    } catch (e) {
      console.warn("Failed to fetch links from Firestore, trying local storage:", e);
      // Local storage fallback
      try {
        const stored = localStorage.getItem(`utool_local_urls_${identifier}`);
        if (stored) {
          setMyLinks(JSON.parse(stored) as ShortLink[]);
        }
      } catch (err) { }
    } finally {
      setLoadingLinks(false);
    }
  };

  useEffect(() => {
    if (!limitLoading) {
      fetchLinks();
    }
  }, [user, limitLoading]);

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!longUrl.trim()) return;

    // Basic URL validation
    let targetUrl = longUrl.trim();
    if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
      targetUrl = `https://${targetUrl}`;
    }

    try {
      new URL(targetUrl);
    } catch (err) {
      toast.error("Please enter a valid URL.");
      return;
    }

    setShortening(true);
    const toastId = toast.info("Processing your request...");

    // Check usage limits
    const isAllowed = await checkLimit();
    if (!isAllowed) {
      toast.dismiss(toastId);
      toast.error("You’ve reached today’s free limit.");
      setShortening(false);
      return;
    }

    const shortCode = generateShortCode();
    const identifier = user ? user.uid : getAnonymousId();

    const linkDoc = {
      longUrl: targetUrl,
      clicks: 0,
      userId: identifier,
      createdAt: new Date(),
    };

    try {
      // Save to Firestore
      await setDoc(doc(db, "url_shortener", shortCode), {
        ...linkDoc,
        createdAt: serverTimestamp(),
      });

      toast.dismiss(toastId);
      toast.success("Link created successfully.");
      await recordUsage("url-shortener", "success");

      // Reload
      setLongUrl("");
      fetchLinks();
    } catch (error) {
      console.error("Firestore save failed, falling back to local storage:", error);
      // Local Storage Fallback
      try {
        const localList = [...myLinks];
        const newLinkObj: ShortLink = {
          id: shortCode,
          longUrl: targetUrl,
          clicks: 0,
          createdAt: new Date().toISOString(),
        };
        localList.unshift(newLinkObj);
        localStorage.setItem(`utool_local_urls_${identifier}`, JSON.stringify(localList));
        setMyLinks(localList);

        toast.dismiss(toastId);
        toast.success("Link created successfully.");
        await recordUsage("url-shortener", "success");
        setLongUrl("");
      } catch (err) {
        toast.dismiss(toastId);
        toast.error("An error occurred. Please try again.");
      }
    } finally {
      setShortening(false);
    }
  };

  const handleCopy = (code: string) => {
    const fullUrl = `${getBaseUrl()}/s/${code}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(code);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className={hideHeader ? "w-full" : "min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20 selection:text-foreground"}>
      {/* Navbar Workspace */}
      {!hideHeader && (
        <header className="sticky top-0 z-40 glass border-b border-border">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="flex items-center gap-2.5 font-semibold text-[17px] tracking-tight text-foreground hover:opacity-90 transition-opacity">
                <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[image:var(--gradient-primary)] shadow-sm">
                  <LinkIcon className="h-[18px] w-[18px] text-white" />
                </div>
                <span>
                  utool{" "}
                  <Badge variant="primary" className="ml-1 align-middle text-[9px]">
                    Workspace
                  </Badge>
                </span>
              </Link>
              <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-border">
                <span className="text-caption font-bold text-foreground">URL Shortener</span>
                <Badge variant="success">Live</Badge>
              </div>
            </div>

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
                    <button onClick={refresh} className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
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
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted border border-border text-muted-foreground" title={user.email || ""}>
                      <User className="h-4.5 w-4.5" />
                    </div>
                    <button onClick={logout} className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted transition-colors">
                      <LogOut className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <Link href={`/login?redirect=%2Furl-shortener`} className="inline-flex items-center justify-center rounded-xl bg-card border border-border px-3.5 py-1.5 text-caption font-bold text-foreground hover:bg-muted transition-all">
                    Log In
                  </Link>
                )}
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Body */}
      <main className={hideHeader ? "w-full" : "flex-1 max-w-4xl w-full mx-auto px-6 py-10 flex flex-col"}>
        {!hideHeader && (
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-caption font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        )}

        <div className="space-y-10 flex-1 flex flex-col justify-center">
          {/* Header */}
          {!hideHeader && (
            <div className="text-center max-w-xl mx-auto space-y-3">
              <Badge variant="primary" className="mx-auto">
                <Sparkles className="h-3.5 w-3.5 mr-1" />
                Edge Link Compiler
              </Badge>
              <h1 className="text-display-md font-extrabold tracking-tight text-foreground">
                Short Link Creator
              </h1>
              <p className="text-body-sm text-muted-foreground leading-relaxed">
                Compile long destination URLs into clean, shortened redirection strings. Copy, share, and track click analytics in real-time.
              </p>
            </div>
          )}

          {/* Quota limit warning */}
          {limitStatus.isLimited && !limitLoading && (
            <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 flex gap-3 text-sm text-destructive w-full">
              <Lock className="h-5 w-5 text-destructive flex-shrink-0" />
              <div>
                <h4 className="font-bold">Daily Action Limit Exceeded</h4>
                <p className="mt-0.5 text-xs text-destructive/80 leading-relaxed">
                  You have hit your daily limit. Please sign up or upgrade to Pro for unlimited operations or check back tomorrow.
                </p>
              </div>
            </div>
          )}

          {/* Creator panel */}
          <GlassCard className="p-6">
            <form onSubmit={handleShorten} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Paste a long URL here (e.g., https://my-very-long-project-page.com/sub/dir/doc)"
                  value={longUrl}
                  onChange={(e) => setLongUrl(e.target.value)}
                  className="block w-full rounded-2xl border border-border bg-card text-foreground pl-11 pr-4 py-3.5 text-xs font-semibold placeholder-muted-foreground/60 focus:border-primary focus:outline-none transition-colors"
                  disabled={shortening || limitStatus.isLimited}
                  suppressHydrationWarning
                />
              </div>
              <Button
                type="submit"
                disabled={shortening || !longUrl.trim() || limitStatus.isLimited}
                className="flex items-center justify-center gap-1.5 shrink-0"
              >
                Shorten Link
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </form>
          </GlassCard>

          {/* User links list */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-widest flex items-center gap-2">
              <Terminal className="h-4 w-4 text-primary" />
              Your Compiled Short Links
            </h3>

            {loadingLinks ? (
              <GlassCard className="p-12 text-center flex flex-col items-center justify-center">
                <RefreshCw className="h-6 w-6 text-muted-foreground animate-spin mb-3" />
                <span className="text-xs text-muted-foreground font-semibold">Retrieving your link catalog...</span>
              </GlassCard>
            ) : myLinks.length > 0 ? (
              <GlassCard className="overflow-hidden p-0 border border-border">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border bg-muted/30 text-muted-foreground text-3xs font-bold uppercase tracking-wider">
                        <th className="p-4 pl-6">Short Link</th>
                        <th className="p-4">Original URL</th>
                        <th className="p-4 text-center">Clicks</th>
                        <th className="p-4 pr-6 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-xs font-semibold text-foreground">
                      {myLinks.map((link) => {
                        const shortUrl = `${getBaseUrl()}/s/${link.id}`;
                        return (
                          <tr key={link.id} className="hover:bg-muted/10 transition-colors">
                            <td className="p-4 pl-6 font-mono text-primary">
                              <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                                {link.id}
                                <ExternalLink className="h-3 w-3 opacity-60" />
                              </a>
                            </td>
                            <td className="p-4 max-w-xs truncate text-muted-foreground" title={link.longUrl}>
                              {link.longUrl}
                            </td>
                            <td className="p-4 text-center text-foreground font-mono font-bold">
                              {link.clicks}
                            </td>
                            <td className="p-4 pr-6 text-right">
                              <button
                                onClick={() => handleCopy(link.id)}
                                className="inline-flex items-center gap-1 text-4xs font-extrabold uppercase tracking-wider text-muted-foreground hover:text-primary bg-muted/40 hover:bg-primary/10 border border-border hover:border-primary/20 rounded-lg px-2.5 py-1.5 transition-colors"
                              >
                                {copiedId === link.id ? (
                                  <>
                                    <Check className="h-3 w-3 text-emerald-500" />
                                    Copied
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3 w-3" />
                                    Copy
                                  </>
                                )}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            ) : (
              <GlassCard className="p-12 text-center flex flex-col items-center justify-center min-h-[220px]">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted border border-border text-muted-foreground mb-4">
                  <LinkIcon className="h-5 w-5" />
                </div>
                <h4 className="text-base font-semibold text-foreground">
                  Create your first short link.
                </h4>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs leading-relaxed">
                  Enter a long destination URL above to compile it into a trackable, short link.
                </p>
              </GlassCard>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
