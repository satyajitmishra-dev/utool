import React from "react";
import { constructMetadata } from "@/utils/seo";
import { Badge } from "@/components/ui/badge";
import { Scale, FileText } from "lucide-react";

export const metadata = constructMetadata({
  title: "Terms of Service — utool Utility Agreement",
  description: "Read the utool Terms of Service. Understand subscription plans, usage quotas, local client-side performance conditions, and user legal obligations.",
});

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="max-w-3xl mx-auto px-6 py-16 space-y-10">
        {/* Header */}
        <div className="space-y-3">
          <Badge variant="primary" className="inline-flex items-center gap-1">
            <Scale className="h-3.5 w-3.5" />
            Legal Agreement
          </Badge>
          <h1 className="text-display-sm font-extrabold tracking-tight text-foreground">
            Terms of Service
          </h1>
          <p className="text-xs text-muted-foreground">
            Last Updated: June 21, 2026. Effective Immediately.
          </p>
        </div>

        {/* Content sections */}
        <div className="space-y-8 text-xs text-muted-foreground leading-relaxed text-justify">
          <section className="space-y-3">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <FileText className="h-4.5 w-4.5 text-primary" />
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using utool, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, you may not use our services or catalog.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-bold text-foreground">2. Usage Licenses & Local Scope</h2>
            <p>
              utool grants you a personal, non-exclusive, non-transferable, and revocable license to utilize our client-side developer, PDF, and design utilities for both personal and commercial operations. Because processing happens locally on your computer, you retain full ownership, responsibility, and copyright of all input parameters, data, and files processed.
            </p>
            <p>
              You represent and warrant that you own or have the necessary legal authorization to edit, compile, compress, or restructure any files loaded into our workstation.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-bold text-foreground">3. Subscription Tiers & Billing</h2>
            <p>
              Access to some utilities or elevated rate limits requires a paid subscription. All transactions, pricing structures, and payments are handled securely by Razorpay.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Billing Cycle:</strong> Subscriptions are billed on a recurring monthly or annual basis. You agree to pay the fees displayed during checkout.
              </li>
              <li>
                <strong>Cancellations:</strong> You can cancel your subscription at any time from your Billing Dashboard. Upon cancellation, your access remains active until the end of the current billing cycle, and no further charges will occur.
              </li>
              <li>
                <strong>Refunds:</strong> Payments are non-refundable except as required by law or as explicitly stated in our pricing policy.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-bold text-foreground">4. Prohibited Behaviors</h2>
            <p>
              You agree not to bypass, hack, or exploit our daily rate limit counters, subscription gates, or server APIs. Creation of short redirection links containing malicious scripts, phishing attacks, malware distribution, or spam campaigns is strictly prohibited. utool reserves the right to deactivate any short link and terminate accounts violating these terms without notice.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-bold text-foreground">5. Disclaimer of Warranties & Limitation of Liability</h2>
            <p>
              utool and all its utilities are provided "as is" and "as available" without any warranty, express or implied. Since documents are processed locally, utool does not warrant that files will convert without structural error or that execution will be uninterrupted. Under no circumstances shall utool be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our tools.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-bold text-foreground">6. Contact Us</h2>
            <p>
              If you have any questions or require legal clarifications, please email us at <span className="text-primary font-semibold">legal@utool.com</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
