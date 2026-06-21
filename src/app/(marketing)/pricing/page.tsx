"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Section, SectionHeading, fadeUp, stagger } from "@/components/ui/section";
import { PricingCard } from "@/components/ui/pricing-card";
import { GlassCard } from "@/components/ui/glass-card";
import { detectCurrency, formatPrice, CurrencyCode } from "@/utils/currency";
import { Check, X as XIcon } from "lucide-react";
import { useAuth } from "@/context/auth-context";

export default function PricingPage() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const { user } = useAuth();

  useEffect(() => {
    setCurrency(detectCurrency());
  }, []);

  const getPrice = (usd: number, inr: number, eur: number, gbp: number) => {
    const amount =
      currency === "INR" ? inr : currency === "EUR" ? eur : currency === "GBP" ? gbp : usd;
    return formatPrice(amount, currency);
  };

  const tiers = [
    {
      name: "Free Starter",
      price: getPrice(0, 0, 0, 0),
      period: "forever",
      description: "Perfect for casual users testing the waters.",
      features: [
        "1 action / day (guest limit)",
        "3 actions / day (free login limit)",
        "Access to free basic tools",
        "Rate limits: 10 requests / min",
        "Standard community support",
      ],
      cta: user ? "Go to Dashboard" : "Get Started Free",
      href: user ? "/dashboard" : "/signup",
      highlighted: false,
    },
    {
      name: "Pro Utility",
      price: getPrice(9, 299, 8, 7),
      period: "per month",
      description: "Ideal for developers, creators, and power users.",
      features: [
        "Unlimited tool actions",
        "Access to all 60+ tools",
        "Rate limits: 60 requests / min",
        "10GB Firebase Storage limits",
        "Priority email support",
      ],
      cta: user ? "Upgrade in Dashboard" : "Upgrade to Pro",
      href: user ? "/billing" : "/signup?plan=pro",
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: getPrice(49, 1499, 45, 39),
      period: "per month",
      description: "Built for teams needing robust capacity and custom tooling.",
      features: [
        "Unlimited execution credits",
        "Dedicated rate limits: 300 req / min",
        "Custom domain integrations",
        "Dedicated DB storage instances",
        "24/7 dedicated Slack support",
      ],
      cta: "Contact Sales",
      href: "mailto:sales@toolzy.com?subject=Enterprise%20Plan%20Inquiry",
      highlighted: false,
    },
  ];


  const comparisonFeatures = [
    { name: "Daily actions", free: "3", pro: "Unlimited", enterprise: "Unlimited" },
    { name: "Tool access", free: "Basic only", pro: "All 60+", enterprise: "All 60+ + Custom" },
    { name: "Rate limit", free: "10 req/min", pro: "60 req/min", enterprise: "300 req/min" },
    { name: "Storage", free: "—", pro: "10 GB", enterprise: "Unlimited" },
    { name: "API access", free: false, pro: true, enterprise: true },
    { name: "Priority support", free: false, pro: true, enterprise: true },
    { name: "Custom integrations", free: false, pro: false, enterprise: true },
    { name: "SLA guarantee", free: false, pro: false, enterprise: true },
    { name: "Dedicated instance", free: false, pro: false, enterprise: true },
  ];

  return (
    <>
      <Section className="pt-16 sm:pt-24">
        <SectionHeading
          badge="Pricing Plans"
          title="Simple, honest pricing for everyone"
          subtitle="Choose the tier that matches your workflow. Upgrade or downgrade anytime. Powered by secure Razorpay billing."
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger}
          className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-start max-w-5xl mx-auto"
        >
          {tiers.map((tier, i) => (
            <motion.div key={tier.name} variants={fadeUp} custom={i}>
              <PricingCard
                name={tier.name}
                price={tier.price}
                period={tier.period}
                description={tier.description}
                features={tier.features}
                cta={tier.cta}
                href={tier.href}
                highlighted={tier.highlighted}
              />
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* Comparison Table */}
      <Section className="section-divider">
        <SectionHeading
          badge="Compare"
          title="Feature comparison"
          subtitle="See exactly what you get with each plan."
        />

        <GlassCard hover={false} className="overflow-hidden rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-4 px-6 text-body-s font-semibold text-foreground">Feature</th>
                  <th className="py-4 px-6 text-body-s font-semibold text-foreground text-center">Free</th>
                  <th className="py-4 px-6 text-body-s font-semibold text-primary text-center">Pro</th>
                  <th className="py-4 px-6 text-body-s font-semibold text-foreground text-center">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature) => (
                  <tr key={feature.name} className="border-b border-border last:border-b-0">
                    <td className="py-3.5 px-6 text-body-s text-foreground">{feature.name}</td>
                    {(["free", "pro", "enterprise"] as const).map((plan) => {
                      const value = feature[plan];
                      return (
                        <td key={plan} className="py-3.5 px-6 text-center">
                          {typeof value === "boolean" ? (
                            value ? (
                              <Check className="h-4 w-4 text-success mx-auto" />
                            ) : (
                              <XIcon className="h-4 w-4 text-muted-foreground/40 mx-auto" />
                            )
                          ) : (
                            <span className="text-body-s text-muted-foreground">{value}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </Section>
    </>
  );
}
