"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Wrench,
  Coins,
  History,
  FileCode,
  Image,
  FileText,
  ChevronRight,
  TrendingUp,
  Activity,
  Sparkles,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();

  const credits = 100;
  const tier = "Free Starter";
  const status = "Active";

  const quickTools = [
    {
      id: "json-formatter",
      name: "JSON Formatter & Validator",
      description: "Format, validate, minify, and check syntax errors in JSON objects.",
      icon: FileCode,
      gradient: "from-indigo-500 to-violet-500",
    },
    {
      id: "image-converter",
      name: "Smart Image Converter",
      description: "Compress and convert PNG, JPG, WebP formats directly in the browser.",
      icon: Image,
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      id: "pdf-merger",
      name: "PDF Compiler & Merger",
      description: "Combine multiple PDF files in exact order securely server-side.",
      icon: FileText,
      gradient: "from-rose-500 to-pink-500",
    },
  ];

  const recentLogs = [
    { tool: "JSON Formatter", time: "2 hours ago", status: "Success", cost: "1 credit" },
    { tool: "Smart Image Converter", time: "1 day ago", status: "Success", cost: "2 credits" },
    { tool: "PDF Compiler", time: "3 days ago", status: "Failed", cost: "0 credits" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-h1 text-foreground">Dashboard</h1>
          <p className="text-body-s text-muted-foreground mt-1">
            Welcome back, {user?.displayName || user?.email || "User"}! Here is an overview of your workspace.
          </p>
        </div>
        <Link href="/tools">
          <Button variant="premium" className="rounded-xl">
            <Sparkles className="h-4 w-4" />
            Launch Workspace
          </Button>
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <GlassCard hover={false} className="p-6 flex items-start gap-4">
          <div className="rounded-xl bg-warning/10 p-3 text-warning">
            <Coins className="h-6 w-6" />
          </div>
          <div>
            <p className="text-body-s font-medium text-muted-foreground">Available Credits</p>
            <h4 className="text-2xl font-bold text-foreground mt-1">{credits}</h4>
            <span className="text-caption text-muted-foreground block mt-1">Resets next billing cycle</span>
          </div>
        </GlassCard>

        <GlassCard hover={false} className="p-6 flex items-start gap-4">
          <div className="rounded-xl bg-primary/10 p-3 text-primary">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-body-s font-medium text-muted-foreground">Subscription Plan</p>
            <h4 className="text-2xl font-bold text-foreground mt-1">{tier}</h4>
            <Badge variant="success" className="mt-1">{status}</Badge>
          </div>
        </GlassCard>

        <GlassCard hover={false} className="p-6 flex items-start gap-4 sm:col-span-2 lg:col-span-1">
          <div className="rounded-xl bg-secondary/10 p-3 text-secondary">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <p className="text-body-s font-medium text-muted-foreground">Rate Limit Status</p>
            <h4 className="text-2xl font-bold text-foreground mt-1">Healthy</h4>
            <span className="text-caption text-muted-foreground block mt-1">10 requests / min maximum</span>
          </div>
        </GlassCard>
      </div>

      {/* Quick Access and Recent Logs */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-h3 text-foreground flex items-center gap-2">
            <Wrench className="h-5 w-5 text-primary" />
            Quick Access Tools
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {quickTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link key={tool.id} href={`/tools/${tool.id}`}>
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
          <h2 className="text-h3 text-foreground flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Recent Activity
          </h2>
          <GlassCard hover={false} className="p-5 divide-y divide-border">
            {recentLogs.map((log, idx) => (
              <div
                key={idx}
                className={`flex justify-between items-center py-3.5 ${idx === 0 ? "pt-0" : ""} ${idx === recentLogs.length - 1 ? "pb-0" : ""}`}
              >
                <div>
                  <p className="text-body-s font-semibold text-foreground">{log.tool}</p>
                  <p className="text-caption text-muted-foreground mt-0.5">{log.time}</p>
                </div>
                <div className="text-right">
                  <Badge variant={log.status === "Success" ? "success" : "error"}>
                    {log.status}
                  </Badge>
                  <p className="text-caption text-muted-foreground mt-1">{log.cost}</p>
                </div>
              </div>
            ))}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
