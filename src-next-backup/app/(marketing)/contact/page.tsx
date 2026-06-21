import React from "react";
import { constructMetadata } from "@/utils/seo";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { Mail, Clock, HelpCircle, Bug } from "lucide-react";

export const metadata = constructMetadata({
  title: "Contact utool — Support & Business Inquiries",
  description: "Get in touch with the utool support team. Contact details for API partnerships, custom enterprise requests, and billing assistance.",
});

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
        {/* Header */}
        <div className="space-y-4 max-w-xl">
          <Badge variant="primary" className="inline-flex items-center gap-1">
            <HelpCircle className="h-3 w-3" />
            Support Desk
          </Badge>
          <h1 className="text-display-sm font-extrabold tracking-tight text-foreground leading-tight">
            How can we help you?
          </h1>
          <p className="text-body-sm text-muted-foreground leading-relaxed">
            Have a question about subscriptions, a feature request, or spotted a bug in our client-side compiler engines? Drop us a line.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="p-6 space-y-4">
            <div className="h-8 w-8 items-center justify-center rounded-xl bg-primary/5 text-primary flex">
              <Mail className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">General Support</h4>
              <p className="text-xs text-primary font-bold mt-1.5">support@utool.in</p>
              <p className="text-4xs text-muted-foreground mt-1">For account help, billing, and cancellations.</p>
            </div>
          </GlassCard>

          <GlassCard className="p-6 space-y-4">
            <div className="h-8 w-8 items-center justify-center rounded-xl bg-primary/5 text-primary flex">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Typical Response Time</h4>
              <p className="text-xs text-foreground font-bold mt-1.5">Under 24 Hours</p>
              <p className="text-4xs text-muted-foreground mt-1"> We answer all developer and user support requests promptly.</p>
            </div>
          </GlassCard>

          <GlassCard className="p-6 space-y-4">
            <div className="h-8 w-8 items-center justify-center rounded-xl bg-primary/5 text-primary flex">
              <Bug className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Enterprise & Dev</h4>
              <p className="text-xs text-primary font-bold mt-1.5">partners@utool.in</p>
              <p className="text-4xs text-muted-foreground mt-1">For custom features or local deployment licenses.</p>
            </div>
          </GlassCard>
        </div>

        {/* Business entity information for E-E-A-T */}
        <div className="border border-border rounded-3xl p-6 bg-card space-y-4 max-w-xl shadow-xs">
          <h3 className="text-sm font-bold text-foreground">utool HQ & Entity Details</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            utool is owned and operated by Satyajitmishra Dev Technologies. We develop serverless infrastructure, browser-only compilers, and utility engines designed to respect user privacy and eliminate cloud data risk.
          </p>
          <div className="text-[10px] text-muted-foreground/80 font-mono space-y-1">
            <p><strong>Address:</strong> Technology Incubator Sector, DLF Cyber City, Bhubaneswar, India</p>
            <p><strong>Business Registration:</strong> IN-OR2026DEVSM12</p>
          </div>
        </div>
      </div>
    </div>
  );
}
