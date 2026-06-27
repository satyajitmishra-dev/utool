import React from "react";
import { constructMetadata } from "@/utils/seo";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { Briefcase, ArrowRight, Laptop, Heart, Code } from "lucide-react";
import Link from "next/link";

export const metadata = constructMetadata({
  title: "Careers — Build the Local-First Browser Operating System | utool",
  description: "Join the utool team. Work on next-generation WebAssembly applications, browser compilers, and local-first private architectures. Remote opportunities.",
});

export default function CareersPage() {
  const values = [
    {
      icon: Code,
      title: "Local-First Architecture",
      desc: "We build application flows that run entirely on the user's hardware. We believe client browsers are the future of secure cloud computing."
    },
    {
      icon: Laptop,
      title: "100% Remote-First",
      desc: "Our engineering and writing contributors work from across the globe. We prioritize async workflows, clean documentation, and flexibility."
    },
    {
      icon: Heart,
      title: "Privacy as a Standard",
      desc: "We don't collect user details to sell ads. We build software where user trust, data compliance, and security are fundamental principles."
    }
  ];

  const jobs = [
    { title: "WebAssembly (WASM) Engineer", department: "Engineering", location: "Remote", type: "Full-Time" },
    { title: "Senior Full Stack Dev (Next.js)", department: "Engineering", location: "Remote", type: "Full-Time" },
    { title: "Technical Writer & Content Marketer", department: "Marketing", location: "Remote", type: "Part-Time / Contract" }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
        {/* Header */}
        <div className="space-y-4 max-w-xl">
          <Badge variant="primary" className="inline-flex items-center gap-1">
            <Briefcase className="h-3.5 w-3.5" />
            Join Our Team
          </Badge>
          <h1 className="text-display-sm font-extrabold tracking-tight text-foreground leading-tight">
            Build the privacy-first web workspace
          </h1>
          <p className="text-body-sm text-muted-foreground leading-relaxed">
            Help us build next-generation WebAssembly engines that process data locally, giving power back to the user's browser.
          </p>
        </div>

        {/* Values */}
        <div className="space-y-6">
          <h2 className="text-h3 font-bold text-foreground">Our Core Beliefs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <GlassCard key={v.title} className="p-6 space-y-3 flex flex-col justify-between" hover={false}>
                  <div className="space-y-3">
                    <div className="h-9 w-9 rounded-xl bg-primary/5 text-primary flex items-center justify-center">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <h3 className="text-xs font-bold text-foreground">{v.title}</h3>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {v.desc}
                    </p>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>

        {/* Open Roles */}
        <div className="space-y-6">
          <h2 className="text-h3 font-bold text-foreground">Open Opportunities</h2>
          <div className="grid grid-cols-1 gap-4">
            {jobs.map((job) => (
              <GlassCard key={job.title} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-foreground">{job.title}</h4>
                  <div className="flex gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    <span>{job.department}</span>
                    <span>•</span>
                    <span>{job.location}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="inline-flex items-center rounded-lg border border-white/[0.06] bg-card/60 px-2.5 py-1 text-[10px] font-bold uppercase text-muted-foreground tracking-wider">
                    {job.type}
                  </span>
                  <Link href="/contact" className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:scale-105 transition-transform">
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        <div className="border border-border/40 rounded-[2rem] p-8 bg-card/10 text-center max-w-xl mx-auto space-y-4 shadow-xs">
          <h4 className="text-xs font-bold text-foreground">Don't see your profile?</h4>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            We are always looking for passionate builders, open-source engineers, and tech writers. Drop us your portfolio and resume history.
          </p>
          <p className="text-xs text-primary font-bold">careers@utool.in</p>
        </div>
      </div>
    </div>
  );
}
