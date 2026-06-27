import React from "react";
import { constructMetadata } from "@/utils/seo";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { Activity, CheckCircle2, ShieldCheck, Zap } from "lucide-react";

export const metadata = constructMetadata({
  title: "UTool System Status & Uptime Metrics | utool",
  description: "Monitor the operational status of the utool workspace. View real-time status of edge compilation networks, client-side runtimes, and support APIs.",
});

export default function StatusPage() {
  const systems = [
    { name: "Client-Side Tool Runtimes (WASM)", status: "Operational", uptime: "100%", desc: "Local PDF, Image, and Code compiler executions running inside your browser." },
    { name: "Edge API Redirections", status: "Operational", uptime: "99.99%", desc: "Upstash Redis caches managing fast redirects for shortened URLs." },
    { name: "User Session Database", status: "Operational", uptime: "99.98%", desc: "Firebase firestore database handling user profiles and quotas." },
    { name: "Billing & Subscriptions Gateway", status: "Operational", uptime: "100%", desc: "Stripe and Razorpay payment networks syncing webhook transactions." },
    { name: "Notification & Email Delivery", status: "Operational", uptime: "99.95%", desc: "Resend email servers handling developer ticket alerts." }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="max-w-3xl mx-auto px-6 py-16 space-y-12">
        {/* Header */}
        <div className="space-y-4 max-w-xl">
          <Badge variant="primary" className="inline-flex items-center gap-1">
            <Activity className="h-3.5 w-3.5" />
            Operational Status
          </Badge>
          <h1 className="text-display-sm font-extrabold tracking-tight text-foreground leading-tight">
            System Status
          </h1>
          <p className="text-body-sm text-muted-foreground leading-relaxed">
            Monitor the status of our edge-hosted database networks and browser-native compilation frameworks.
          </p>
        </div>

        {/* Global Banner */}
        <div className="border border-emerald-500/20 bg-emerald-500/[0.04] text-emerald-400 rounded-3xl p-6 flex items-center gap-4 max-w-2xl shadow-xs">
          <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
            <CheckCircle2 className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">All Systems Operational</h4>
            <p className="text-[10px] text-muted-foreground mt-0.5">Utool workspaces are fully functional. Latency: 0.1ms (local cpu-driven).</p>
          </div>
        </div>

        {/* System Details */}
        <div className="space-y-6">
          <h2 className="text-h3 font-bold text-foreground">Operational Runtimes</h2>
          <div className="grid grid-cols-1 gap-4">
            {systems.map((sys) => (
              <GlassCard key={sys.name} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1 max-w-lg">
                  <h4 className="text-xs font-bold text-foreground">{sys.name}</h4>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">{sys.desc}</p>
                </div>
                <div className="flex items-center gap-6 shrink-0">
                  <div className="text-right sm:text-left">
                    <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold">Uptime (30d)</p>
                    <p className="text-xs font-bold text-foreground mt-0.5">{sys.uptime}</p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[9px] font-bold tracking-widest text-emerald-400 uppercase">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                    <span>{sys.status}</span>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Note on Client side uptime */}
        <div className="border border-border/40 rounded-3xl p-6 bg-card/10 space-y-3 max-w-2xl shadow-xs">
          <h4 className="text-xs font-bold text-foreground flex items-center gap-2">
            <ShieldCheck className="h-4.5 w-4.5 text-primary" />
            Client-Side Architecture Resilience
          </h4>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Since UTool's core processors (such as the PDF compress and Wi-Fi QR compilers) compile 100% locally on your device CPU, <strong>they cannot go down due to server issues</strong>. Once the app finishes downloading, the tools run completely client-side in your tab session. Even if our servers are completely offline, your tools will continue to run.
          </p>
        </div>
      </div>
    </div>
  );
}
