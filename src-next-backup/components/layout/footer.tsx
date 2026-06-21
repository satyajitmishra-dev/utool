"use client";

import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { ArrowRight, Wrench } from "lucide-react";

export function Footer() {
  const footerLinks = {
    Product: [
      { label: "Features", href: "/#features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Tools", href: "/tools" },
      { label: "API", href: "#" },
      { label: "Changelog", href: "#" },
    ],
    Company: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
      { label: "Security", href: "/security" },
    ],
    Legal: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
    Connect: [
      { label: "Twitter", href: siteConfig.links.twitter },
      { label: "GitHub", href: siteConfig.links.github },
      { label: "Discord", href: "#" },
    ],
  };

  return (
    <footer className="border-t border-border bg-card">
      <Container className="py-16">
        {/* CTA Banner */}
        <div className="mb-16 rounded-2xl bg-foreground p-10 sm:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,hsl(var(--ring)_/_0.12),transparent)]" />
          <div className="relative">
            <h3 className="text-h2 text-background leading-tight">
              Ready to simplify your workflow?
            </h3>
            <p className="mt-3 text-body-s text-background/60 max-w-lg mx-auto">
              Join thousands of developers, designers, and creators who use
              utool every day.
            </p>
            <div className="mt-8">
              <Link href="/signup">
                <Button variant="secondary" size="lg" className="rounded-full">
                  Get started for free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-caption text-muted-foreground uppercase tracking-wider font-semibold">
                {category}
              </h4>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-body-s text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-body-s font-semibold text-foreground">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[image:var(--gradient-primary)] shadow-sm">
              <Wrench className="h-3.5 w-3.5 text-white" />
            </div>
            {siteConfig.name}
          </div>
          <p className="text-caption text-muted-foreground">
            &copy; {new Date().getFullYear()} {siteConfig.name}, Inc. All rights
            reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
