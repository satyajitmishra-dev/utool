import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/section";
import { Box, Heart } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/40 py-16 bg-card/10 select-none relative z-10 mt-auto">
      <Container className="grid grid-cols-2 md:grid-cols-5 gap-12 text-left">
        <div className="space-y-4 col-span-2 md:col-span-1">
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
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-foreground mb-4">Company</h4>
          <ul className="space-y-2.5 text-caption text-muted-foreground">
            <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
            <li><Link href="/careers" className="hover:text-foreground transition-colors">Careers</Link></li>
            <li><Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
            <li><Link href="/editorial-policy" className="hover:text-foreground transition-colors">Editorial Policy</Link></li>
            <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-foreground mb-4">Resources</h4>
          <ul className="space-y-2.5 text-caption text-muted-foreground">
            <li><Link href="/support" className="hover:text-foreground transition-colors">Help Center</Link></li>
            <li><Link href="/why-local-processing" className="hover:text-foreground transition-colors">API & Specs</Link></li>
            <li><Link href="/tools/developer-tools" className="hover:text-foreground transition-colors">Developers</Link></li>
            <li><Link href="/changelog" className="hover:text-foreground transition-colors">Roadmap</Link></li>
            <li><Link href="/changelog" className="hover:text-foreground transition-colors">Changelog</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-foreground mb-4">Legal</h4>
          <ul className="space-y-2.5 text-caption text-muted-foreground">
            <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link></li>
            <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link></li>
            <li><Link href="/security" className="hover:text-foreground transition-colors">Security</Link></li>
            <li><Link href="/cookies" className="hover:text-foreground transition-colors">Cookies</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-foreground mb-4">Tools</h4>
          <ul className="space-y-2.5 text-caption text-muted-foreground">
            <li><Link href="/tools/pdf-tools" className="hover:text-foreground transition-colors">PDF</Link></li>
            <li><Link href="/tools/image-tools" className="hover:text-foreground transition-colors">Image</Link></li>
            <li><Link href="/tools/developer-tools" className="hover:text-foreground transition-colors">Developer</Link></li>
            <li><Link href="/tools/resume-tools" className="hover:text-foreground transition-colors">Resume</Link></li>
            <li><Link href="/tools/media-tools" className="hover:text-foreground transition-colors">Media</Link></li>
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
