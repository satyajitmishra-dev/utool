import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/section";
import { Box, Heart } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/40 py-16 bg-card/10 select-none relative z-10 mt-auto">
      <Container className="grid grid-cols-1 md:grid-cols-4 gap-12 text-left">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)]">
              <div className="absolute inset-0 rounded-xl animate-pulse bg-white/10" />
              <Box className="h-4.5 w-4.5 relative z-10" />
            </div>
            <span className="font-extrabold tracking-tight text-xl text-foreground">
              utool<span className="text-indigo-500 font-black">.</span>
            </span>
          </div>
          <p className="text-caption text-muted-foreground leading-relaxed pt-1">
            The browser-native utility operating system. Real-time client compilers, zero server logging.
          </p>
          <div className="text-[10px] text-muted-foreground/60 flex items-center gap-1">
            <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
            <span>Built for the privacy-first web</span>
          </div>
        </div>

        <div>
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-foreground mb-4">Engines</h4>
          <ul className="space-y-2.5 text-caption text-muted-foreground">
            <li><Link href="/pdf-tools" className="hover:text-foreground transition-colors">PDF Optimizer</Link></li>
            <li><Link href="/tools/qr-generator" className="hover:text-foreground transition-colors">QR Constructor</Link></li>
            <li><Link href="/tools/url-shortener" className="hover:text-foreground transition-colors">Link Shortener</Link></li>
            <li><Link href="/tools/resume-builder" className="hover:text-foreground transition-colors">Resume Creator</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-foreground mb-4">Identity</h4>
          <ul className="space-y-2.5 text-caption text-muted-foreground">
            <li><a href="#use-cases" className="hover:text-foreground transition-colors">For Developers</a></li>
            <li><a href="#use-cases" className="hover:text-foreground transition-colors">For Creators</a></li>
            <li><a href="#use-cases" className="hover:text-foreground transition-colors">For Freelancers</a></li>
            <li><a href="#use-cases" className="hover:text-foreground transition-colors">For Students</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-foreground mb-4">Legal & Privacy</h4>
          <ul className="space-y-2.5 text-caption text-muted-foreground">
            <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
            <li><Link href="/security" className="hover:text-foreground transition-colors">Security Rules</Link></li>
            <li><Link href="/contact" className="hover:text-foreground transition-colors">Get Support</Link></li>
          </ul>
        </div>
      </Container>
      
      <Container className="border-t border-border/20 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-caption text-muted-foreground/60">
        <span>© {new Date().getFullYear()} Utool Inc. All rights reserved.</span>
        <span>Hosted on Vercel Edge Server</span>
      </Container>
    </footer>
  );
}
