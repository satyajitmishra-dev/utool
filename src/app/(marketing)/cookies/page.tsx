import React from "react";
import { constructMetadata } from "@/utils/seo";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { Cookie, ShieldAlert, CheckCircle2, Lock } from "lucide-react";

export const metadata = constructMetadata({
  title: "Cookies Policy — Zero-Tracking Guarantee | utool",
  description: "Read the utool Cookies Policy. We only use essential session cookies for accounts and theme settings. Zero advertising trackers, zero ad network pixels.",
});

export default function CookiesPage() {
  const cookieTypes = [
    {
      icon: Lock,
      title: "Strictly Necessary / Authentication",
      desc: "If you register or sign in, we use Firebase Authentication cookies to remember your login session across tabs. These are essential for account billing and daily quotas."
    },
    {
      icon: CheckCircle2,
      title: "User Settings & Preferences",
      desc: "We store user preferences like your light/dark mode preference and dashboard layouts locally in your browser storage. These are never uploaded to our servers."
    },
    {
      icon: ShieldAlert,
      title: "No Advertising / Marketing Trackers",
      desc: "utool does not use ad network tracking scripts, Facebook Pixels, or cross-site marketing cookies. We respect your browser's Do-Not-Track configuration."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="max-w-3xl mx-auto px-6 py-16 space-y-12">
        {/* Header */}
        <div className="space-y-4 max-w-xl">
          <Badge variant="primary" className="inline-flex items-center gap-1">
            <Cookie className="h-3.5 w-3.5" />
            Cookie Settings
          </Badge>
          <h1 className="text-display-sm font-extrabold tracking-tight text-foreground leading-tight">
            Cookies Policy
          </h1>
          <p className="text-body-sm text-muted-foreground leading-relaxed">
            Last Updated: June 21, 2026. Effective Immediately.
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-6">
          <h2 className="text-h3 font-bold text-foreground">How We Use Cookies</h2>
          <div className="grid grid-cols-1 gap-6">
            {cookieTypes.map((type) => {
              const Icon = type.icon;
              return (
                <GlassCard key={type.title} className="p-6 flex gap-4 items-start">
                  <div className="h-9 w-9 rounded-xl bg-primary/5 text-primary flex items-center justify-center shrink-0">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-foreground">{type.title}</h3>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {type.desc}
                    </p>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>

        {/* More details */}
        <div className="space-y-6 text-xs text-muted-foreground leading-relaxed text-justify">
          <h2 className="text-sm font-bold text-foreground">Managing Cookie Preferences</h2>
          <p>
            You can configure your browser to reject all cookies or notify you when a cookie is being saved. Please consult your browser's Help menu for details (Chrome, Firefox, Safari, Edge). Note that if you disable essential cookies, account functions (such as logging in or checking billing status) will not operate correctly.
          </p>
          <h2 className="text-sm font-bold text-foreground">Third-Party Analytics</h2>
          <p>
            We use privacy-centric telemetry trackers (such as Google Analytics and Microsoft Clarity) that do not collect personally identifiable coordinates or link browser tracks to user identities. They simply help us evaluate website performance, click rates, and tool errors so we can fix bugs.
          </p>
          <p>
            If you have questions regarding our cookie utilization, please reach out to us at <span className="text-primary font-semibold">privacy@utool.in</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
