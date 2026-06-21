"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/config/firebase";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { Loader2, AlertCircle, Wrench } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ShortIdRedirectPage() {
  const params = useParams();
  const shortId = params.shortId as string;

  const [status, setStatus] = useState<"fetching" | "redirecting" | "error">("fetching");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!shortId) return;

    const performRedirect = async () => {
      let documentData: any = null;
      let existsInDb = false;
      const docRef = doc(db, "url_shortener", shortId);

      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          existsInDb = true;
          documentData = docSnap.data();
        }
      } catch (err: any) {
        console.warn("Failed to fetch from Firestore, falling back to local storage.", err.message);
      }

      try {
        if (existsInDb) {
          const longUrl = documentData.longUrl;

          // 1. Increment click count in background (fire and forget)
          updateDoc(docRef, {
            clicks: increment(1),
          }).catch((err) => console.error("Failed to increment click count:", err));

          // 2. Set status and redirect
          setStatus("redirecting");
          window.location.href = longUrl;
        } else {
          // Check local storage for local redirects fallback
          let localRedirected = false;
          try {
            const keys = Object.keys(localStorage);
            const userUrlKey = keys.find(k => k.startsWith("toolzy_local_urls_"));
            if (userUrlKey) {
              const localUrls = JSON.parse(localStorage.getItem(userUrlKey) || "[]");
              const matching = localUrls.find((l: any) => l.id === shortId);
              if (matching) {
                setStatus("redirecting");
                window.location.href = matching.longUrl;
                localRedirected = true;
              }
            }
          } catch (e) {}

          if (!localRedirected) {
            setStatus("error");
            setErrorMsg("This short link does not exist in our database or has been deleted.");
          }
        }
      } catch (err) {
        console.error("Redirect router error:", err);
        setStatus("error");
        setErrorMsg("Failed to resolve link routing due to an error.");
      }
    };

    performRedirect();
  }, [shortId]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="glass-card max-w-sm w-full p-8 rounded-3xl border border-border flex flex-col items-center gap-6">
        {status === "fetching" && (
          <>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary">
              <Loader2 className="h-5.5 w-5.5 animate-spin" />
            </div>
            <div>
              <h3 className="text-md font-extrabold text-foreground tracking-tight">Resolving Short Link</h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Looking up redirection parameters from the database. One moment...
              </p>
            </div>
          </>
        )}

        {status === "redirecting" && (
          <>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
              <Loader2 className="h-5.5 w-5.5 animate-spin" />
            </div>
            <div>
              <h3 className="text-md font-extrabold text-foreground tracking-tight">Redirecting</h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Preparing to forward your browser to the destination URL.
              </p>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10 border border-destructive/20 text-destructive">
              <AlertCircle className="h-5.5 w-5.5" />
            </div>
            <div>
              <h3 className="text-md font-extrabold text-foreground tracking-tight">Link Redirection Failed</h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                {errorMsg}
              </p>
            </div>
            <Link href="/" className="w-full">
              <Button className="w-full">
                Back to Toolzy Home
              </Button>
            </Link>
          </>
        )}

        <div className="border-t border-border pt-4 w-full flex items-center justify-center gap-1.5 text-3xs font-semibold text-muted-foreground tracking-wide uppercase">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-[image:var(--gradient-primary)]">
            <Wrench className="h-2.5 w-2.5 text-white" />
          </div>
          <span>Toolzy Link Router</span>
        </div>
      </div>
    </div>
  );
}
