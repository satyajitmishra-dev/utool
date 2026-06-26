import React from "react";
import Link from "next/link";
import { getAuthUser } from "@/lib/auth-server";
import { SupportForm } from "@/components/support/support-form";
import { ArrowLeft, MessageSquare, Compass, Shield, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Help & Support Center | Utool",
  description: "Get assistance with your Utool account, report bugs, ask billing questions, or request new features.",
};

export default async function SupportPage() {
  const user = await getAuthUser();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans py-14 px-6 relative overflow-hidden">
      {/* Background radial glowing effects */}
      <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <main className="max-w-4xl mx-auto space-y-10 relative z-10">
        {/* Navigation */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="h-4.5 w-4.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to Workspace
          </Link>
        </div>

        {/* Hero Header */}
        <div className="text-center space-y-3">
          <h1 className="text-display-sm font-extrabold tracking-tight text-foreground">
            Utool Support Center
          </h1>
          <p className="text-body-m text-muted-foreground max-w-xl mx-auto">
            Got a question, bug report, or billing inquiry? Submit a ticket and our team will get back to you within 24 hours.
          </p>
        </div>

        {/* Dashboard Link for logged in users */}
        {user ? (
          <div className="border border-primary/25 rounded-2xl p-4 bg-primary/5 backdrop-blur-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xs select-none">
                {user.name ? user.name[0].toUpperCase() : user.email ? user.email[0].toUpperCase() : "U"}
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">
                  Hello, {user.name || user.email}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  You are signed in. You can track your open tickets and conversation history.
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/support"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:opacity-90 text-xs font-semibold shadow-sm transition-all"
            >
              <span>Support Dashboard</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          <div className="border border-border rounded-2xl p-4 bg-card/45 backdrop-blur-xs flex items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              Are you an active Utool member? <Link href="/login?redirect=/support" className="text-primary hover:underline font-bold">Sign in</Link> to view and track your support history.
            </p>
          </div>
        )}

        {/* Core Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Quick Info Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
              Troubleshooting
            </h3>

            <div className="space-y-4">
              {/* Card 1 */}
              <div className="border border-border rounded-2xl p-5 bg-card/60 space-y-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                  <Shield className="h-4 w-4" />
                </div>
                <h4 className="text-xs font-bold text-foreground">Privacy Guaranteed</h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  All our tools operate entirely on the client-side. Files are processed in your browser memory and never uploaded to our servers.
                </p>
              </div>

              {/* Card 2 */}
              <div className="border border-border rounded-2xl p-5 bg-card/60 space-y-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Compass className="h-4 w-4" />
                </div>
                <h4 className="text-xs font-bold text-foreground">Self-Service Help</h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Stuck? Try checking the FAQs at the bottom of the tool page, or look through our active documentation.
                </p>
              </div>

              {/* Card 3 */}
              <div className="border border-border rounded-2xl p-5 bg-card/60 space-y-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <h4 className="text-xs font-bold text-foreground">Feature Requests</h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Want a new tool or customization? Please submit a request in the Feature Request section on the tool page, or open a ticket.
                </p>
              </div>
            </div>
          </div>

          {/* Ticket Form */}
          <div className="lg:col-span-2">
            <SupportForm />
          </div>
        </div>
      </main>
    </div>
  );
}
