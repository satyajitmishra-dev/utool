"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

/* ─── Container ─── */
export function Container({
  children,
  className,
  wide = false,
}: {
  children: React.ReactNode;
  className?: string;
  wide?: boolean;
}) {
  return (
    <div className={cn(wide ? "mx-auto w-full max-w-[1400px] px-6 lg:px-[120px]" : "mx-auto w-full max-w-6xl px-6", className)}>
      {children}
    </div>
  );
}


/* ─── Section ─── */
interface SectionProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  container?: boolean;
}

export function Section({
  id,
  children,
  className,
  container = true,
}: SectionProps) {
  return (
    <section id={id} className={cn("py-24 sm:py-32", className)}>
      {container ? (
        <Container>{children}</Container>
      ) : (
        children
      )}
    </section>
  );
}

/* ─── Section Heading (Badge + Title + Subtitle) ─── */
const stagger = {
  visible: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as const },
  }),
};

export function SectionHeading({
  badge,
  title,
  subtitle,
  className,
}: {
  badge?: string;
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={stagger}
      className={cn("text-center max-w-2xl mx-auto mb-16", className)}
    >
      {badge && (
        <motion.div variants={fadeUp} custom={0}>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[hsl(var(--ring)_/_0.2)] bg-[hsl(var(--ring)_/_0.08)] px-3.5 py-1 text-xs font-semibold text-primary tracking-wide uppercase">
            {badge}
          </span>
        </motion.div>
      )}
      <motion.h2
        variants={fadeUp}
        custom={1}
        className="mt-5 text-h2 text-foreground"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          variants={fadeUp}
          custom={2}
          className="mt-4 text-body-m text-muted-foreground"
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}

/* ─── Shared animation variants (exported for reuse) ─── */
export { fadeUp, stagger };
