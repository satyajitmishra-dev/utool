import React from "react";
import { constructMetadata } from "@/utils/seo";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, EyeOff, Lock } from "lucide-react";

export const metadata = constructMetadata({
  title: "Privacy Policy — Zero-Data Retention Guarantee | utool",
  description: "Read utool's privacy policy. We process all document modifications locally inside your web browser. Zero server uploads, zero logs, complete privacy.",
});

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="max-w-3xl mx-auto px-6 py-16 space-y-10">
        {/* Header */}
        <div className="space-y-3">
          <Badge variant="primary" className="inline-flex items-center gap-1">
            <EyeOff className="h-3 w-3" />
            Privacy First
          </Badge>
          <h1 className="text-display-sm font-extrabold tracking-tight text-foreground">
            Privacy Policy
          </h1>
          <p className="text-xs text-muted-foreground">
            Last Updated: June 21, 2026. Effective Immediately.
          </p>
        </div>

        {/* Content sections */}
        <div className="space-y-8 text-xs text-muted-foreground leading-relaxed text-justify">
          <section className="space-y-3">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <ShieldCheck className="h-4.5 w-4.5 text-primary" />
              1. Zero-Data Retention (Our Core Promise)
            </h2>
            <p>
              utool does not upload, save, or transmit your utility inputs, files, documents, or data to any server. When you merge, split, or compress PDF files, all processing is performed locally inside your web browser sandbox using JavaScript and WebAssembly compiled binaries.
            </p>
            <p>
              Your financial sheets, agreements, images, and text variables never leave your computer. Once you close your browser tab, all active states are completely erased from your system's volatile memory.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Lock className="h-4.5 w-4.5 text-primary" />
              2. Information We Collect
            </h2>
            <p>
              While document modification is entirely local, we do collect limited account-level metadata to provide membership services, premium tiers, rate limiting, and tracking logs:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Account Data:</strong> If you sign up or log in, we collect your email address and UID via Firebase Authentication to manage your workspace and quota limits.
              </li>
              <li>
                <strong>Billing Records:</strong> Subscriptions are processed through Razorpay. We do not store credit card or payment credential details on our servers. Razorpay processes all transactions securely, sending confirmation webhooks to sync your subscription status.
              </li>
              <li>
                <strong>Link Shortener Data:</strong> Short links created using our redirection engine require database mapping. We store the original destination URL, the shortened code, the creator's UID, click counts, and basic execution timestamps on our serverless database (Upstash Redis & Firestore) to perform redirection.
              </li>
              <li>
                <strong>Usage Metrics:</strong> We log aggregated telemetry data (e.g. number of daily compression calls, tool errors) to monitor server performance and enforce API rate limits.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-bold text-foreground">3. Browser Storage & Cookies</h2>
            <p>
              We use local browser storage (such as LocalStorage and session cookies) to store basic configuration parameters, user theme settings (light/dark mode), and session authentication states. These files do not track your browsing behavior across other websites.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-bold text-foreground">4. Compliance & Security Standards</h2>
            <p>
              Because utool operates client-side, we bypass the compliance bottlenecks typical of cloud-based document platforms. We do not act as a data processor or data controller for your uploaded documents, ensuring compliance with the General Data Protection Regulation (GDPR), Health Insurance Portability and Accountability Act (HIPAA), and California Consumer Privacy Act (CCPA).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-bold text-foreground">5. Contact Our Privacy Officer</h2>
            <p>
              If you have any questions, suggestions, or concerns regarding our privacy configurations, please contact us directly at <span className="text-primary font-semibold">privacy@utool.in</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
