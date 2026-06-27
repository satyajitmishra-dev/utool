"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useUserProfile } from "@/hooks/useUserProfile";
import { VerificationBanner } from "@/components/dashboard/VerificationBanner";
import { AnnouncementBanner } from "@/components/dashboard/AnnouncementBanner";
import { VerificationModal } from "@/components/dashboard/VerificationModal";
import { LiveUsageCard } from "@/components/dashboard/LiveUsageCard";
import { RealtimeStats } from "@/components/dashboard/RealtimeStats";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Wrench,
  TrendingUp,
  History,
  FileCode,
  Image,
  FileText,
  ChevronRight,
  Sparkles,
  Mail,
  ShieldCheck,
  ShieldAlert,
  ArrowUpRight,
  Lock,
} from "lucide-react";

export default function DashboardPage() {
  const { profile, loading, error } = useUserProfile();
  const searchParams = useSearchParams();
  const verifyParam = searchParams?.get("verify");
  const [modalOpen, setModalOpen] = useState(false);

  // Automatically trigger the verification modal if the verify query parameter is present
  useEffect(() => {
    if (verifyParam === "true") {
      setModalOpen(true);
    }
  }, [verifyParam]);

  // Format account creation date
  const accountCreatedDate = useMemo(() => {
    if (!profile?.createdAt) return "Unknown";
    try {
      const ts = profile.createdAt;
      const date = typeof ts.toDate === "function" ? ts.toDate() : new Date(ts);
      return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Stale";
    }
  }, [profile?.createdAt]);

  const quickTools = [
    {
      id: "json-formatter",
      name: "JSON Formatter & Validator",
      description: "Format, validate, minify, and check syntax errors in JSON objects.",
      icon: FileCode,
      gradient: "from-indigo-500 to-violet-500",
      href: "/tools/json-formatter",
    },
    {
      id: "webp-converter",
      name: "Smart Image Converter",
      description: "Compress and convert PNG, JPG, WebP formats directly in the browser.",
      icon: Image,
      gradient: "from-emerald-500 to-teal-500",
      href: "/tools/image-tools/webp-converter",
    },
    {
      id: "pdf-merger",
      name: "PDF Compiler & Merger",
      description: "Combine multiple PDF files in exact order securely client-side.",
      icon: FileText,
      gradient: "from-rose-500 to-pink-500",
      href: "/tools/merge-pdf",
    },
  ];

  // Derived real-time activity from tool usage counts
  const recentActivity = useMemo(() => {
    if (!profile?.toolUsageCounts) return [];
    return Object.entries(profile.toolUsageCounts)
      .map(([toolId, count]) => {
        const friendlyName = toolId
          .split("-")
          .map((word) => (word.toLowerCase() === "pdf" ? "PDF" : word.charAt(0).toUpperCase() + word.slice(1)))
          .join(" ");
        return {
          tool: friendlyName,
          count: `${count} operations`,
          status: "Success",
        };
      })
      .slice(0, 3); // Display top 3
  }, [profile?.toolUsageCounts]);

  return (
    <div className="space-y-8">
      {/* Verification Warning Banner */}
      <VerificationBanner />

      {/* Announcement Banner */}
      <AnnouncementBanner />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-h1 text-foreground font-extrabold tracking-tight">Dashboard</h1>
          {loading ? (
            <Skeleton className="h-4 w-64 mt-2" />
          ) : (
            <p className="text-body-s text-muted-foreground mt-1">
              Welcome back, <span className="font-semibold text-foreground">{profile?.name || profile?.email || "User"}</span>! 
              Account created on {accountCreatedDate}.
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/pro">
            <Button variant="outline" className="rounded-xl border-border shadow-xs transition-transform hover:scale-[1.02]">
              <Lock className="h-4 w-4" />
              Pro Space
            </Button>
          </Link>
          <Link href="/tools">
            <Button variant="premium" className="rounded-xl shadow-md transition-transform hover:scale-[1.02]">
              <Sparkles className="h-4 w-4" />
              Launch Workspace
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Live Usage Stat Card */}
        <LiveUsageCard />

        {/* Subscription Plan Card */}
        <GlassCard hover={false} className="p-6 relative overflow-hidden flex flex-col justify-between h-full min-h-[180px]">
          <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-secondary/10 blur-2xl pointer-events-none" />
          <div className="flex justify-between items-start">
            <div className="rounded-xl bg-secondary/10 p-3 text-secondary">
              <TrendingUp className="h-6 w-6" />
            </div>
            {loading ? (
              <Skeleton className="h-5 w-12" />
            ) : (
              <Badge variant={profile?.subscriptionStatus === "active" ? "success" : "warning"}>
                {profile?.subscriptionStatus?.toUpperCase() || "INACTIVE"}
              </Badge>
            )}
          </div>
          <div className="mt-4">
            <p className="text-body-s font-medium text-muted-foreground">Subscription Plan</p>
            {loading ? (
              <Skeleton className="h-8 w-32 mt-1" />
            ) : (
              <h4 className="text-2xl font-bold text-foreground mt-1">
                {profile?.subscriptionTier === "pro"
                  ? "Pro Member"
                  : profile?.subscriptionTier === "enterprise"
                  ? "Enterprise"
                  : "Free Starter"}
              </h4>
            )}
          </div>
          <div className="mt-4 pt-3 border-t border-border flex justify-between text-caption text-muted-foreground">
            <span>Billing Status</span>
            <span className="font-semibold text-foreground">
              {profile?.planType ? `${profile.planType.toUpperCase()}` : "NONE"}
            </span>
          </div>
        </GlassCard>

        {/* Verification Status Card */}
        <GlassCard hover={false} className="p-6 relative overflow-hidden flex flex-col justify-between h-full min-h-[180px]">
          <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-accent/10 blur-2xl pointer-events-none" />
          <div className="flex justify-between items-start">
            <div className="rounded-xl bg-accent/10 p-3 text-accent">
              <Mail className="h-6 w-6" />
            </div>
            {loading ? (
              <Skeleton className="h-5 w-12" />
            ) : profile?.emailVerified ? (
              <Badge variant="success" className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                Verified
              </Badge>
            ) : (
              <Badge variant="error" className="flex items-center gap-1">
                <ShieldAlert className="h-3.5 w-3.5" />
                Unverified
              </Badge>
            )}
          </div>
          <div className="mt-4">
            <p className="text-body-s font-medium text-muted-foreground">Account Status</p>
            {loading ? (
              <Skeleton className="h-8 w-32 mt-1" />
            ) : (
              <h4 className="text-2xl font-bold text-foreground mt-1">
                {profile?.emailVerified ? "Full Security" : "Limited Access"}
              </h4>
            )}
          </div>
          <div className="mt-4 pt-3 border-t border-border flex justify-between text-caption text-muted-foreground">
            <span>Email Verified</span>
            <span className="font-semibold text-foreground">
              {profile?.emailVerified ? "YES" : "NO"}
            </span>
          </div>
        </GlassCard>
      </div>

      {/* Real-time Activity Statistics */}
      <div className="space-y-4">
        <h2 className="text-h3 text-foreground flex items-center gap-2 font-bold">
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
          Real-time Statistics
        </h2>
        <RealtimeStats />
      </div>

      {/* Quick Access and Recent Logs */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-h3 text-foreground flex items-center gap-2 font-bold">
            <Wrench className="h-5 w-5 text-primary" />
            Quick Access Tools
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {quickTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link key={tool.id} href={tool.href}>
                  <GlassCard variant="interactive" className="p-5 h-full flex flex-col justify-between">
                    <div>
                      <div className={`inline-flex rounded-xl bg-gradient-to-br ${tool.gradient} p-2.5 text-white shadow-sm mb-4`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-semibold text-foreground text-base">{tool.name}</h3>
                      <p className="text-body-s text-muted-foreground mt-2">{tool.description}</p>
                    </div>
                    <div className="mt-4 flex items-center text-caption font-semibold text-primary">
                      Launch Tool
                      <ChevronRight className="ml-1 h-3.5 w-3.5" />
                    </div>
                  </GlassCard>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-h3 text-foreground flex items-center gap-2 font-bold">
            <History className="h-5 w-5 text-primary" />
            Tool Usage Distribution
          </h2>
          <GlassCard hover={false} className="p-5 divide-y divide-border max-h-[295px] overflow-y-auto">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : recentActivity.length > 0 ? (
              recentActivity.map((activity, idx) => (
                <div
                  key={idx}
                  className={`flex justify-between items-center py-3.5 ${idx === 0 ? "pt-0" : ""} ${idx === recentActivity.length - 1 ? "pb-0" : ""}`}
                >
                  <div>
                    <p className="text-body-s font-semibold text-foreground">{activity.tool}</p>
                    <p className="text-caption text-success mt-0.5">{activity.status}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="success" className="flex items-center gap-0.5">
                      {activity.count}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Badge variant="warning" className="mb-2">No Runs</Badge>
                <p className="text-body-s text-muted-foreground">You haven't run any tools yet today.</p>
              </div>
            )}
          </GlassCard>
        </div>
      </div>

      {/* Email Verification Warn Modal */}
      <VerificationModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
