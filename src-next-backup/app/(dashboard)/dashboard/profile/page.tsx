"use client";

import React from "react";
import { useAuth } from "@/context/auth-context";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  User,
  Mail,
  Calendar,
  CreditCard,
  Shield,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user } = useAuth();

  const subscription = {
    plan: "Free Starter",
    status: "Active",
    credits: 100,
    nextBilling: "N/A",
  };

  const usageHistory = [
    { tool: "PDF Merger", date: "Jun 18, 2026", credits: 3 },
    { tool: "QR Generator", date: "Jun 17, 2026", credits: 1 },
    { tool: "Image Converter", date: "Jun 15, 2026", credits: 2 },
    { tool: "JSON Formatter", date: "Jun 14, 2026", credits: 1 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-border pb-6">
        <h1 className="text-h1 text-foreground">Profile</h1>
        <p className="text-body-s text-muted-foreground mt-1">
          Manage your account details, subscription, and preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* User Details */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard hover={false} className="p-6">
            <h2 className="text-h3 text-foreground mb-6">Account Details</h2>
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted border border-border text-muted-foreground">
                  <User className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-body-m font-semibold text-foreground">
                    {user?.displayName || "User"}
                  </p>
                  <p className="text-body-s text-muted-foreground flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" />
                    {user?.email || "No email"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-caption text-muted-foreground uppercase tracking-wider">Member since</p>
                  <p className="text-body-s text-foreground font-medium mt-1 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    {user?.metadata?.creationTime
                      ? new Date(user.metadata.creationTime).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-caption text-muted-foreground uppercase tracking-wider">Email verified</p>
                  <p className="text-body-s text-foreground font-medium mt-1 flex items-center gap-1.5">
                    <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                    {user?.emailVerified ? "Verified" : "Not verified"}
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Usage History */}
          <GlassCard hover={false} className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-h3 text-foreground">Recent Usage</h2>
              <Link href="/history">
                <Button variant="ghost" size="sm">
                  View all
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
            <div className="divide-y divide-border">
              {usageHistory.map((item, i) => (
                <div key={i} className="flex justify-between items-center py-3">
                  <div>
                    <p className="text-body-s font-medium text-foreground">{item.tool}</p>
                    <p className="text-caption text-muted-foreground">{item.date}</p>
                  </div>
                  <Badge variant="default">
                    {item.credits} {item.credits === 1 ? "credit" : "credits"}
                  </Badge>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Sidebar: Subscription */}
        <div className="space-y-6">
          <GlassCard hover={false} className="p-6">
            <h2 className="text-h3 text-foreground mb-4">Subscription</h2>
            <div className="space-y-4">
              <div>
                <p className="text-caption text-muted-foreground uppercase tracking-wider">Current plan</p>
                <p className="text-body-m font-bold text-foreground mt-1">{subscription.plan}</p>
              </div>
              <div>
                <p className="text-caption text-muted-foreground uppercase tracking-wider">Status</p>
                <Badge variant="success" className="mt-1">{subscription.status}</Badge>
              </div>
              <div>
                <p className="text-caption text-muted-foreground uppercase tracking-wider">Credits remaining</p>
                <p className="text-body-m font-bold text-foreground mt-1">{subscription.credits}</p>
              </div>
              <div>
                <p className="text-caption text-muted-foreground uppercase tracking-wider">Next billing</p>
                <p className="text-body-s text-foreground mt-1">{subscription.nextBilling}</p>
              </div>

              <Link href="/billing" className="block pt-2">
                <Button variant="premium" size="md" className="w-full rounded-xl">
                  <CreditCard className="h-4 w-4" />
                  Upgrade Plan
                </Button>
              </Link>
            </div>
          </GlassCard>

          <GlassCard hover={false} className="p-6">
            <h2 className="text-h3 text-foreground mb-4">Settings</h2>
            <div className="space-y-3">
              <Link href="/dashboard/settings" className="block">
                <Button variant="outline" size="md" className="w-full rounded-xl">
                  Account Settings
                </Button>
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
