"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PricingCardProps {
  name: string;
  price: string;
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
        "relative rounded-2xl p-8 transition-all duration-300 flex flex-col",
        highlighted
          ? "bg-foreground text-background ring-1 ring-foreground shadow-2xl scale-[1.02]"
          : "glass-card hover:shadow-lg",
        className
      )}
    >
      {highlighted && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <Badge variant="primary" className="bg-[image:var(--gradient-primary)] text-white border-0 shadow-md px-4 py-1">
            <Sparkles className="h-3 w-3" />
            Most popular
          </Badge>
        </div>
      )}

      <div className="flex-1">
        <h3
          className={cn(
            "text-[15px] font-semibold",
            highlighted ? "opacity-70" : "text-muted-foreground"
          )}
        >
          {name}
        </h3>

        <div className="mt-3 flex items-baseline gap-1">
          <span
            className={cn(
              "text-[40px] font-bold tracking-tighter",
              highlighted ? "" : "text-foreground"
            )}
          >
            {price}
          </span>
          <span
            className={cn(
              "text-sm",
              highlighted ? "opacity-50" : "text-muted-foreground"
            )}
          >
            /{period}
          </span>
        </div>

        <p
          className={cn(
            "mt-3 text-body-s",
            highlighted ? "opacity-60" : "text-muted-foreground"
          )}
        >
          {description}
        </p>

        <ul className="mt-6 space-y-3">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2.5">
              <Check
                className={cn(
                  "h-4 w-4 mt-0.5 flex-shrink-0",
                  highlighted ? "text-primary" : "text-primary"
                )}
              />
              <span
                className={cn(
                  "text-body-s",
                  highlighted ? "opacity-80" : "text-muted-foreground"
                )}
              >
                {f}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <Link href={href} className="mt-8 block">
        <Button
          variant={highlighted ? "secondary" : "primary"}
          size="lg"
          className="w-full rounded-full"
        >
          {cta}
        </Button>
      </Link>
    </div>
  );
}
