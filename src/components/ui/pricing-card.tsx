"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { Check, Sparkles, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PricingCardProps {
  name: string;
  price: string;
  originalPrice?: string;
  discountPercentage?: number;
  launchOffer?: string;
  timerText?: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  highlighted?: boolean;
  className?: string;
}

export function PricingCard({
  name,
  price,
  originalPrice,
  discountPercentage,
  launchOffer,
  timerText,
  period,
  description,
  features,
  cta,
  href,
  highlighted = false,
  className,
}: PricingCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-3xl p-8 transition-all duration-300 flex flex-col h-full border",
        highlighted
          ? "border-primary/45 bg-card/65 shadow-[0_0_40px_rgba(99,102,241,0.15)] scale-[1.02] ring-1 ring-primary/20"
          : "glass-card hover:shadow-lg border-border bg-card/45 hover:border-primary/20",
        className
      )}
    >
      {highlighted && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <Badge variant="primary" className="bg-gradient-to-r from-primary to-secondary text-white border-0 shadow-md px-4 py-1">
            <Sparkles className="h-3 w-3" />
            Most popular
          </Badge>
        </div>
      )}

      <div className="flex-1 space-y-5">
        <div className="flex justify-between items-start">
          <h3
            className={cn(
              "text-sm font-bold uppercase tracking-wider",
              highlighted ? "text-primary" : "text-muted-foreground"
            )}
          >
            {name}
          </h3>
          {launchOffer && (
            <span className="inline-flex rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 shadow-sm">
              {launchOffer}
            </span>
          )}
        </div>

        <div className="space-y-1.5">
          {originalPrice && (
            <div className="flex items-center gap-2">
              <span className="text-sm line-through text-muted-foreground font-medium">
                {originalPrice}
              </span>
              {discountPercentage && (
                <span className="inline-flex rounded bg-rose-500/10 px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-rose-500 tracking-widest border border-rose-500/25">
                  {discountPercentage}% OFF
                </span>
              )}
            </div>
          )}
          <div className="flex items-baseline gap-1">
            <span
              className="text-[40px] font-extrabold tracking-tighter text-foreground leading-none"
            >
              {price}
            </span>
            <span
              className="text-sm font-semibold text-muted-foreground"
            >
              /{period}
            </span>
          </div>
        </div>

        <p
          className="text-body-s text-muted-foreground leading-relaxed"
        >
          {description}
        </p>

        {timerText && (
          <div className={cn(
            "flex items-center gap-2 text-xs font-semibold rounded-2xl px-3.5 py-2.5 border transition-all duration-200",
            highlighted 
              ? "bg-primary/5 border-primary/20 text-foreground"
              : "bg-muted/40 border-border text-muted-foreground"
          )}>
            <Clock className="h-3.5 w-3.5 text-primary animate-pulse" />
            <span>Offer ends in: <span className="text-primary font-bold font-mono">{timerText}</span></span>
          </div>
        )}

        <ul className="space-y-3.5 text-sm text-muted-foreground border-t border-border/60 pt-5">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2.5">
              <div className="rounded-full bg-primary/10 p-0.5 mt-0.5">
                <Check className="h-3.5 w-3.5 text-primary" />
              </div>
              <span
                className="text-foreground/90 font-medium text-body-s"
              >
                {f}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <Link href={href} className="mt-8 block">
        <Button
          variant={highlighted ? "primary" : "outline"}
          size="lg"
          className={cn(
            "w-full rounded-2xl py-3 font-semibold",
            highlighted && "bg-gradient-to-r from-primary to-secondary text-primary-foreground border-0 hover:from-primary-hover hover:to-secondary hover:shadow-[0_4px_20px_rgba(99,102,241,0.2)]"
          )}
        >
          {cta}
        </Button>
      </Link>
    </div>
  );
}
