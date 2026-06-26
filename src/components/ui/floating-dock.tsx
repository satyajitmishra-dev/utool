"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import { ThemeToggle } from "./theme-toggle";
import { Menu, X, ArrowRight } from "lucide-react";

export function FloatingDock() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Workspace", href: "#tools" },
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 flex justify-center px-4 py-4 transition-all duration-500",
          scrolled ? "top-2" : "top-0"
        )}
      >
        <div
          className={cn(
            "flex w-full max-w-5xl items-center justify-between transition-all duration-500",
            scrolled
              ? "rounded-full border border-white/[0.06] bg-card/65 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.2)] px-6 py-2.5"
              : "border-b border-transparent bg-transparent px-6 py-4"
          )}
        >
          {/* Logo — Premium branding with logo.png */}
          <Link href="/" className="flex items-center gap-2 group select-none pl-0">
            <div className="relative flex h-8 w-8 items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_12px_rgba(99,102,241,0.5)]">
              <Image
                src="/logo.png"
                alt="utool logo"
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
                priority
              />
            </div>
            <span className="font-extrabold tracking-[-0.03em] text-[20px] leading-none text-foreground">
              utool<span className="text-indigo-500 font-black">.</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-body-s font-medium text-muted-foreground hover:text-foreground transition-colors relative py-1.5 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-primary -translate-x-1/2 rounded-full transition-all group-hover:w-1/2" />
              </a>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <Link href="/signup">
              <button className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-card/40 hover:bg-white/[0.06] text-body-s font-semibold px-5 py-2 transition-all active:scale-95 cursor-pointer hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]">
                Open workspace
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] bg-card/40 text-foreground hover:bg-white/[0.06] active:scale-95 transition-all"
            >
              {mobileMenuOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Fullscreen Navigation Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 flex flex-col bg-background/95 backdrop-blur-xl pt-28 px-8 md:hidden"
          >
            <nav className="flex flex-col gap-6 text-[22px] font-semibold tracking-tight">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors border-b border-border/50 pb-4"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="mt-12 flex flex-col gap-4">
              <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground py-4 font-bold shadow-lg shadow-primary/20">
                  Open workspace
                  <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
