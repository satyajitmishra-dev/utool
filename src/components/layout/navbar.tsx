"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/section";
import { Menu, X, Wrench } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";

interface NavbarProps {
  /** Show auth CTA buttons */
  showAuth?: boolean;
  /** Navigation links override */
  links?: { label: string; href: string }[];
  /** Right-side slot for custom content (e.g., workspace badge) */
  rightSlot?: React.ReactNode;
}

const defaultLinks = [
  { label: "Features", href: "/#features" },
  { label: "Tools", href: "/tools" },
  { label: "Pricing", href: "/pricing" },
];

export function Navbar({
  showAuth = true,
  links = defaultLinks,
  rightSlot,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "glass border-b border-border shadow-xs"
          : "bg-transparent"
      )}
    >
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 font-semibold text-[17px] tracking-tight text-foreground hover:opacity-90 transition-opacity"
          >
            <img src="/logo.png" alt="Logo" className="h-8 w-8 object-contain rounded-[10px]" />
            {siteConfig.name}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((item) => {
              const isActive =
                item.href === pathname ||
                (item.href.startsWith("/#") && pathname === "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-[13px] font-medium transition-colors duration-200",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-3">
            {rightSlot}
            <ThemeToggle />
            {showAuth && (
              <>
                <Link
                  href="/login"
                  className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
                >
                  Sign in
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="rounded-full">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Right */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="md:hidden glass border-t border-border overflow-hidden"
          >
            <Container className="py-4 space-y-1">
              {links.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-xl px-3 py-2.5 text-[15px] font-medium text-foreground hover:bg-muted transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              {showAuth && (
                <div className="pt-3 flex flex-col gap-2 border-t border-border mt-2">
                  <Link
                    href="/login"
                    className="rounded-xl px-3 py-2.5 text-center text-[15px] font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    Sign in
                  </Link>
                  <Link href="/signup">
                    <Button size="lg" className="w-full rounded-full">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
