import React from "react";
import { getAuthUser } from "@/lib/auth-server";
import { isAdmin } from "@/app/actions/support";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Sliders,
  LifeBuoy,
  Shield,
  Activity,
  Users,
  Settings,
  ArrowRight,
  Database,
  Lock,
  ChevronRight,
  Sparkles,
  ArrowLeft
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

export const metadata = {
  title: "Admin Control Center | Utool Workspace",
  description: "Unified portal for UTool SaaS operations and system monitoring.",
};

export default async function AdminPortalPage() {
  // 1. Authorize: verify user is logged in and is an Admin
  const user = await getAuthUser();
  if (!user || !(await isAdmin(user.uid))) {
    redirect("/");
  }

  // Define admin operations modules
  const modules = [
    {
      title: "Tool Lifecycle Tracker",
      desc: "Manage UTool's 300+ utilities. Toggle statuses, completion progress sliders, gate checklists (FE/BE/API/tested/production), and expected feature sets.",
      link: "/admin/tools",
      icon: Sliders,
      status: "Active",
      statusColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      isPremium: true
    },
    {
      title: "Customer Support Portal",
      desc: "Track client support tickets, reviews, bug reports, and user feedback. Reply directly to tickets, manage priorities, and reassign states.",
      link: "/admin/support",
      icon: LifeBuoy,
      status: "Active",
      statusColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      isPremium: true
    },
    {
      title: "Global Audit logs",
      desc: "Inspect full history logs of all tool updates, bulk changes, previous and new values, and administrative reason trackers.",
      link: "/admin/tools",
      icon: Activity,
      status: "Integrated",
      statusColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      isPremium: false
    },
    {
      title: "User Quota Manager",
      desc: "Manage user profiles, override subscription tiers (Free, Pro, Enterprise), view daily credits usage logs, and apply manual limits.",
      link: "/admin/quota",
      icon: Users,
      status: "Active",
      statusColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    },
    {
      title: "DB & Cache Health Monitor",
      desc: "Check database integrity, Redis cache hits and rate limiting statuses, Cloudinary assets, and Resend mail pipelines.",
      link: "#",
      icon: Database,
      status: "Planned",
      statusColor: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
      isPlanned: true
    },
    {
      title: "Global System Settings",
      desc: "Configure maintenance modes, feature flags, global banner engine settings, and payment pricing tiers.",
      link: "#",
      icon: Settings,
      status: "Planned",
      statusColor: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
      isPlanned: true
    },
    {
      title: "Advertisement Control Manager",
      desc: "Configure system-wide ad settings, GDPR/CCPA consent, placement capping rules, provider selections, and review real-time revenue analytics.",
      link: "/admin/ads",
      icon: Sliders,
      status: "Active",
      statusColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans py-16 px-6 max-w-6xl mx-auto space-y-12 relative overflow-hidden">
      {/* Decorative radial glows */}
      <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-purple-500/[0.05] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[5%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/[0.04] rounded-full blur-[120px] pointer-events-none" />

      {/* Nav breadcrumb */}
      <div className="flex justify-between items-center gap-4 border-b border-border/80 pb-6">
        <div className="space-y-1">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            Return to Marketplace
          </Link>
          <h1 className="text-display-s md:text-display-md font-black tracking-tight leading-none mt-2 flex items-center gap-2">
            <Shield className="h-8 w-8 text-purple-500" />
            Admin Operations
          </h1>
          <p className="text-body-s text-muted-foreground mt-2 max-w-xl">
            Central Command Center for UTool system integrations, support ticketing, developer logs, and database metrics.
          </p>
        </div>
      </div>

      {/* Metrics breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6 border-white/[0.04] bg-card/35 space-y-2 flex flex-col justify-between" hover={false}>
          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active Operations</span>
            <h3 className="text-3xl font-black tracking-tight text-purple-400 mt-2">2 Integrated</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed mt-2">
            Tool Lifecycle and Support Tickets are fully configured and synced with database models.
          </p>
        </GlassCard>

        <GlassCard className="p-6 border-white/[0.04] bg-card/35 space-y-2 flex flex-col justify-between" hover={false}>
          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Change Trail Audit</span>
            <h3 className="text-3xl font-black tracking-tight text-emerald-500 mt-2">Fully Audited</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed mt-2">
            Every status edit, checklist modification, or bulk change registers previous vs. new values and admins.
          </p>
        </GlassCard>

        <GlassCard className="p-6 border-white/[0.04] bg-card/35 space-y-2 flex flex-col justify-between" hover={false}>
          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Security Clearance</span>
            <h3 className="text-3xl font-black tracking-tight text-blue-400 mt-2">Level 3 (Admin)</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed mt-2">
            Authorized admin user: <span className="font-bold">{user.email}</span>. Checked on both Client and Server.
          </p>
        </GlassCard>
      </div>

      {/* Main Operations Grid */}
      <div className="space-y-6">
        <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <Sparkles className="h-4.5 w-4.5 text-purple-500" />
          Management Modules
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod, index) => {
            const Icon = mod.icon;
            const Wrapper = mod.isPlanned ? "div" : Link;
            const props = mod.isPlanned ? {} : { href: mod.link };

            return (
              // @ts-expect-error — polymorphic wrapper
              <Wrapper
                key={index}
                {...props}
                className={`group glass-card border border-white/[0.06] rounded-3xl p-8 flex flex-col justify-between min-h-[220px] transition-all duration-300 ${
                  mod.isPlanned
                    ? "opacity-60 bg-muted/20"
                    : "cursor-pointer bg-card/45 hover:border-purple-500/40 hover:bg-card/75 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(99,102,241,0.04)]"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`h-10 w-10 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-primary group-hover:scale-105 transition-transform duration-300`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${mod.statusColor}`}>
                      {mod.status}
                    </span>
                  </div>
                  
                  <h3 className="text-sm font-extrabold text-foreground tracking-tight group-hover:text-purple-500 transition-colors">
                    {mod.title}
                  </h3>
                  
                  <p className="text-[11.5px] text-muted-foreground leading-relaxed font-medium line-clamp-3">
                    {mod.desc}
                  </p>
                </div>

                {!mod.isPlanned && (
                  <div className="flex items-center gap-1 text-[11px] font-bold text-purple-400 group-hover:text-purple-300 pt-6 transition-colors leading-none">
                    <span>Manage Module</span>
                    <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                )}
              </Wrapper>
            );
          })}
        </div>
      </div>
    </div>
  );
}
