"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { siteConfig } from "@/config/site";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/utils/cn";
import {
  Wrench,
  LayoutDashboard,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  History,
  ChevronLeft,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "All Tools", href: "/tools", icon: Wrench },
  { name: "Billing & Plans", href: "/billing", icon: CreditCard },
  { name: "Usage History", href: "/history", icon: History },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Logo */}
      <div className="flex items-center h-16 flex-shrink-0 px-5 border-b border-border justify-between">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2 font-bold text-lg tracking-tight text-foreground transition-all",
            collapsed && "justify-center"
          )}
        >
          <img src="/logo.png" alt="Logo" className="h-8 w-8 object-contain rounded-lg flex-shrink-0" />
          {!collapsed && <span>{siteConfig.name}</span>}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
        </button>
      </div>

      {/* Links */}
      <div className="flex flex-col flex-1 overflow-y-auto px-3 py-5">
        <nav className="flex-1 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-[hsl(var(--ring)_/_0.1)] text-primary border border-[hsl(var(--ring)_/_0.2)]"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent",
                  collapsed && "justify-center px-2"
                )}
                title={collapsed ? item.name : undefined}
              >
                <Icon
                  className={cn(
                    "h-[18px] w-[18px] flex-shrink-0",
                    !collapsed && "mr-3",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                {!collapsed && item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Block */}
      <div className="flex-shrink-0 p-3 border-t border-border">
        <div className="mb-2 px-1">
          <ThemeToggle />
        </div>
        {!collapsed && (
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted border border-border text-muted-foreground flex-shrink-0">
              <User className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {user?.displayName || "User"}
              </p>
              <p className="text-caption text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className={cn(
            "mt-1 w-full flex items-center justify-center gap-2 rounded-xl border border-border hover:border-error/30 hover:bg-error/5 px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-error transition-all",
            collapsed && "px-2"
          )}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {!collapsed && "Sign Out"}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex md:flex-col border-r border-border bg-card/50 backdrop-blur-md transition-all duration-300 flex-shrink-0 h-screen sticky top-0",
          collapsed ? "w-[68px]" : "w-64"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden flex h-16 items-center justify-between px-4 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-40">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-foreground">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[image:var(--gradient-primary)] shadow-sm">
            <Wrench className="h-4 w-4 text-white" />
          </div>
          <span>{siteConfig.name}</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 z-30 bg-background/95 backdrop-blur-lg pt-16 flex flex-col"
          >
            <nav className="flex-1 px-4 py-6 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center px-4 py-3 text-base font-semibold rounded-xl transition-colors",
                      isActive
                        ? "bg-[hsl(var(--ring)_/_0.1)] text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <div className="border-t border-border p-4 pb-8">
              <p className="text-sm font-semibold text-foreground px-4">
                {user?.email}
              </p>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-error/10 text-error py-3 text-sm font-semibold transition-colors hover:bg-error/15"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
