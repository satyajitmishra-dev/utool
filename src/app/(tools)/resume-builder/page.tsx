"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useToolLimit } from "@/hooks/use-tool-limit";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  FileText,
  Download,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  Plus,
  Trash2,
  User,
  LogOut,
  RefreshCw,
  Lock,
  Printer,
  ChevronRight,
  Briefcase,
  GraduationCap,
  Sparkle,
} from "lucide-react";
import { toast } from "sonner";

interface Experience {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  bullets: string;
}

interface Education {
  school: string;
  degree: string;
  gradDate: string;
  bullets: string;
}

export default function ResumeBuilderPage({ hideHeader = false }: { hideHeader?: boolean }) {
  const { user, logout } = useAuth();
  const { limitStatus, loading: limitLoading, checkLimit, recordUsage, refresh } = useToolLimit();

  // Personal Details
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [summary, setSummary] = useState("");

  // Experience and Education list
  const [experiences, setExperiences] = useState<Experience[]>([
    { company: "", role: "", startDate: "", endDate: "", bullets: "" }
  ]);
  const [educations, setEducations] = useState<Education[]>([
    { school: "", degree: "", gradDate: "", bullets: "" }
  ]);
  const [skills, setSkills] = useState("");

  const [activeTab, setActiveTab] = useState<"personal" | "experience" | "education" | "skills">("personal");

  const handleAddExperience = () => {
    setExperiences([...experiences, { company: "", role: "", startDate: "", endDate: "", bullets: "" }]);
  };

  const handleRemoveExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const handleExperienceChange = (index: number, field: keyof Experience, value: string) => {
    const updated = experiences.map((exp, i) => (i === index ? { ...exp, [field]: value } : exp));
    setExperiences(updated);
  };

  const handleAddEducation = () => {
    setEducations([...educations, { school: "", degree: "", gradDate: "", bullets: "" }]);
  };

  const handleRemoveEducation = (index: number) => {
    setEducations(educations.filter((_, i) => i !== index));
  };

  const handleEducationChange = (index: number, field: keyof Education, value: string) => {
    const updated = educations.map((edu, i) => (i === index ? { ...edu, [field]: value } : edu));
    setEducations(updated);
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setPhone("");
    setWebsite("");
    setSummary("");
    setExperiences([{ company: "", role: "", startDate: "", endDate: "", bullets: "" }]);
    setEducations([{ school: "", degree: "", gradDate: "", bullets: "" }]);
    setSkills("");
  };

  // Perform Limit Check and PDF Export (Print)
  const handleExportPDF = async () => {
    // Basic validations
    if (!name.trim() || !email.trim()) {
      toast.error("Please fill in your Name and Email under Personal Info to export your resume.");
      return;
    }

    const toastId = toast.info("Processing your request...");

    // Usage Quota Check
    const isAllowed = await checkLimit();
    if (!isAllowed) {
      toast.dismiss(toastId);
      toast.error("You’ve reached today’s free limit.");
      return;
    }

    try {
      toast.dismiss(toastId);
      toast.success("Your PDF is ready.");
      await recordUsage("resume-builder", "success");
      
      // Trigger Print flow
      window.print();
    } catch (err) {
      console.error("PDF Print failure:", err);
      toast.error("An error occurred during resume export.");
      await recordUsage("resume-builder", "failed", err instanceof Error ? err.message : String(err));
    }
  };

  const isFormEmpty = () => {
    return !name.trim() && !email.trim() && !phone.trim() && !website.trim() && !summary.trim() && !skills.trim() && 
           experiences.every(e => !e.company.trim()) && educations.every(e => !e.school.trim());
  };

  return (
    <div className={hideHeader ? "w-full" : "min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20 selection:text-foreground"}>
      {/* ── Navbar Workspace ── */}
      {!hideHeader && (
        <header className="sticky top-0 z-40 glass border-b border-border print:hidden">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="flex items-center gap-2.5 font-semibold text-[17px] tracking-tight text-foreground hover:opacity-90 transition-opacity">
                <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[image:var(--gradient-primary)] shadow-sm">
                  <FileText className="h-[18px] w-[18px] text-white" />
                </div>
                <span>
                  Toolzy{" "}
                  <Badge variant="primary" className="ml-1 align-middle text-[9px]">
                    Workspace
                  </Badge>
                </span>
              </Link>
              <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-border">
                <span className="text-caption font-bold text-foreground">Resume Builder</span>
                <Badge variant="beta">Beta</Badge>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {!limitLoading ? (
                limitStatus.tier === "pro" || limitStatus.tier === "enterprise" ? (
                  <Badge variant="pro" className="hidden sm:inline-flex">
                    <Sparkles className="h-3 w-3" />
                    Pro: Unlimited
                  </Badge>
                ) : (
                  <div className="hidden sm:flex items-center gap-2">
                    <Badge variant="default">
                      Actions: {limitStatus.count} / {limitStatus.max}
                    </Badge>
                    <button onClick={refresh} className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                      <RefreshCw className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )
              ) : (
                <div className="hidden sm:block h-6 w-24 skeleton rounded-full" />
              )}

              <ThemeToggle />

              <div className="flex items-center gap-2 pl-3 border-l border-border">
                {user ? (
                  <>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted border border-border text-muted-foreground" title={user.email || ""}>
                      <User className="h-4.5 w-4.5" />
                    </div>
                    <button onClick={logout} className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted transition-colors">
                      <LogOut className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <Link href={`/login?redirect=%2Fresume-builder`} className="inline-flex items-center justify-center rounded-xl bg-card border border-border px-3.5 py-1.5 text-caption font-bold text-foreground hover:bg-muted transition-all">
                    Log In
                  </Link>
                )}
              </div>
            </div>
          </div>
        </header>
      )}

      {/* ── Workstation Container ── */}
      <main className={hideHeader ? "w-full print:p-0" : "flex-1 max-w-6xl w-full mx-auto px-6 py-10 flex flex-col print:p-0"}>
        {!hideHeader && (
          <div className="mb-8 print:hidden">
            <Link href="/" className="inline-flex items-center gap-2 text-caption font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        )}

        {/* ── Quota Limit Banner ── */}
        {limitStatus.isLimited && !limitLoading && (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 flex gap-3 text-sm text-destructive w-full mb-6 print:hidden">
            <Lock className="h-5 w-5 text-destructive flex-shrink-0" />
            <div>
              <h4 className="font-bold">Daily Action Limit Exceeded</h4>
              <p className="mt-0.5 text-xs text-destructive/80 leading-relaxed">
                You have reached your daily free action limit. Please sign up or upgrade to Pro for unlimited exports or check back tomorrow.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start print:grid-cols-1 print:gap-0">
          {/* ── Left Editor Form ── */}
          <div className="space-y-6 print:hidden">
            <GlassCard className="p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-border pb-3">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-widest">Resume Editor</h3>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset
                </button>
              </div>

              {/* Form Navigation Tabs */}
              <div className="flex flex-wrap gap-1.5 border-b border-border pb-2">
                {[
                  { id: "personal", label: "Personal", icon: User },
                  { id: "experience", label: "Experience", icon: Briefcase },
                  { id: "education", label: "Education", icon: GraduationCap },
                  { id: "skills", label: "Skills", icon: Sparkle },
                ].map((tab) => {
                  const TabIcon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold border transition ${
                        activeTab === tab.id
                          ? "bg-primary border-primary text-white shadow-sm"
                          : "bg-muted/40 border-border text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                      }`}
                    >
                      <TabIcon className="h-3.5 w-3.5" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab Contents */}
              <div className="pt-2 min-h-[300px]">
                {activeTab === "personal" && (
                  <div className="space-y-3.5 animate-fade-in">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Full Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Jane Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="block w-full rounded-xl border border-border bg-card text-foreground px-3.5 py-2.5 text-xs font-semibold focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Email Address</label>
                        <input
                          type="email"
                          placeholder="e.g. jane@domain.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="block w-full rounded-xl border border-border bg-card text-foreground px-3.5 py-2.5 text-xs font-semibold focus:border-primary focus:outline-none transition-colors"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Phone Number</label>
                        <input
                          type="text"
                          placeholder="e.g. +1 (555) 019-2834"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="block w-full rounded-xl border border-border bg-card text-foreground px-3.5 py-2.5 text-xs font-semibold focus:border-primary focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Website / LinkedIn</label>
                      <input
                        type="text"
                        placeholder="e.g. linkedin.com/in/janedoe"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        className="block w-full rounded-xl border border-border bg-card text-foreground px-3.5 py-2.5 text-xs font-semibold focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Professional Summary</label>
                      <textarea
                        rows={4}
                        placeholder="Detail your goals, specializations, and professional qualifications..."
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        className="block w-full rounded-xl border border-border bg-card text-foreground px-3.5 py-2.5 text-xs font-semibold focus:border-primary focus:outline-none transition-colors resize-none"
                      />
                    </div>
                  </div>
                )}

                {activeTab === "experience" && (
                  <div className="space-y-4 animate-fade-in">
                    {experiences.map((exp, idx) => (
                      <div key={idx} className="p-4 bg-muted/30 border border-border rounded-2xl relative space-y-3">
                        <button
                          onClick={() => handleRemoveExperience(idx)}
                          className="absolute top-3.5 right-3.5 p-1 rounded hover:bg-muted text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <span className="inline-block text-3xs font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                          Role #{idx + 1}
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Company</label>
                            <input
                              type="text"
                              placeholder="e.g. Google"
                              value={exp.company}
                              onChange={(e) => handleExperienceChange(idx, "company", e.target.value)}
                              className="block w-full rounded-xl border border-border bg-card text-foreground px-3 py-2 text-xs font-semibold focus:border-primary focus:outline-none transition-colors"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Role Title</label>
                            <input
                              type="text"
                              placeholder="e.g. Senior Developer"
                              value={exp.role}
                              onChange={(e) => handleExperienceChange(idx, "role", e.target.value)}
                              className="block w-full rounded-xl border border-border bg-card text-foreground px-3 py-2 text-xs font-semibold focus:border-primary focus:outline-none transition-colors"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Start Date</label>
                            <input
                              type="text"
                              placeholder="e.g. Jan 2023"
                              value={exp.startDate}
                              onChange={(e) => handleExperienceChange(idx, "startDate", e.target.value)}
                              className="block w-full rounded-xl border border-border bg-card text-foreground px-3 py-2 text-xs font-semibold focus:border-primary focus:outline-none transition-colors"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">End Date</label>
                            <input
                              type="text"
                              placeholder="e.g. Present"
                              value={exp.endDate}
                              onChange={(e) => handleExperienceChange(idx, "endDate", e.target.value)}
                              className="block w-full rounded-xl border border-border bg-card text-foreground px-3 py-2 text-xs font-semibold focus:border-primary focus:outline-none transition-colors"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Key Accomplishments (One per line)</label>
                          <textarea
                            rows={3}
                            placeholder="- Spearheaded Next.js migration reducing latency by 40%&#10;- Mentored 5 junior developers..."
                            value={exp.bullets}
                            onChange={(e) => handleExperienceChange(idx, "bullets", e.target.value)}
                            className="block w-full rounded-xl border border-border bg-card text-foreground px-3 py-2 text-xs font-semibold focus:border-primary focus:outline-none transition-colors resize-none"
                          />
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={handleAddExperience}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:opacity-90 transition-opacity"
                    >
                      <Plus className="h-4 w-4" />
                      Add Professional Role
                    </button>
                  </div>
                )}

                {activeTab === "education" && (
                  <div className="space-y-4 animate-fade-in">
                    {educations.map((edu, idx) => (
                      <div key={idx} className="p-4 bg-muted/30 border border-border rounded-2xl relative space-y-3">
                        <button
                          onClick={() => handleRemoveEducation(idx)}
                          className="absolute top-3.5 right-3.5 p-1 rounded hover:bg-muted text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <span className="inline-block text-3xs font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                          Education #{idx + 1}
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">School / University</label>
                            <input
                              type="text"
                              placeholder="e.g. Stanford University"
                              value={edu.school}
                              onChange={(e) => handleEducationChange(idx, "school", e.target.value)}
                              className="block w-full rounded-xl border border-border bg-card text-foreground px-3 py-2 text-xs font-semibold focus:border-primary focus:outline-none transition-colors"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Degree / Major</label>
                            <input
                              type="text"
                              placeholder="e.g. B.S. in Computer Science"
                              value={edu.degree}
                              onChange={(e) => handleEducationChange(idx, "degree", e.target.value)}
                              className="block w-full rounded-xl border border-border bg-card text-foreground px-3 py-2 text-xs font-semibold focus:border-primary focus:outline-none transition-colors"
                            />
                          </div>
                        </div>
                        <div className="space-y-1 col-span-2">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Graduation Date</label>
                          <input
                            type="text"
                            placeholder="e.g. June 2022"
                            value={edu.gradDate}
                            onChange={(e) => handleEducationChange(idx, "gradDate", e.target.value)}
                            className="block w-full rounded-xl border border-border bg-card text-foreground px-3 py-2 text-xs font-semibold focus:border-primary focus:outline-none transition-colors"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Honors / GPA (One per line)</label>
                          <textarea
                            rows={2}
                            placeholder="- Graduated Magna Cum Laude (GPA: 3.9)&#10;- Honors Thesis in Machine Learning..."
                            value={edu.bullets}
                            onChange={(e) => handleEducationChange(idx, "bullets", e.target.value)}
                            className="block w-full rounded-xl border border-border bg-card text-foreground px-3 py-2 text-xs font-semibold focus:border-primary focus:outline-none transition-colors resize-none"
                          />
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={handleAddEducation}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:opacity-90 transition-opacity"
                    >
                      <Plus className="h-4 w-4" />
                      Add Education Node
                    </button>
                  </div>
                )}

                {activeTab === "skills" && (
                  <div className="space-y-3.5 animate-fade-in">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Skills / Technologies (Comma Separated)</label>
                      <textarea
                        rows={8}
                        placeholder="React, Next.js, TypeScript, Node.js, Tailwind CSS, PostgreSQL, AWS, Git, Figma..."
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        className="block w-full rounded-xl border border-border bg-card text-foreground px-3.5 py-2.5 text-xs font-semibold focus:border-primary focus:outline-none transition-colors resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            </GlassCard>

            {/* Export and action triggers */}
            <div className="flex justify-end gap-3 border-t border-border pt-5">
              <Button
                onClick={handleExportPDF}
                disabled={isFormEmpty() || limitStatus.isLimited}
                className="flex items-center gap-1.5"
              >
                <Printer className="h-4 w-4" />
                Compile & Print Resume
              </Button>
            </div>
          </div>

          {/* ── Right Live Preview Page ── */}
          <div className="space-y-4 print:w-full print:m-0 print:p-0">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-widest flex items-center justify-between print:hidden">
              <span className="flex items-center gap-2">
                <Printer className="h-4 w-4 text-primary" />
                Live Document Preview
              </span>
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest bg-muted/40 border border-border rounded px-2 py-0.5">
                Standard A4 / Letter
              </span>
            </h3>

            {/* Paper Container */}
            <div className="border border-border shadow-lg rounded-3xl p-8 bg-white min-h-[750px] w-full text-slate-800 font-sans print-area print:shadow-none print:border-none print:rounded-none print:p-0 print:m-0 print:bg-white flex flex-col justify-between">
              {isFormEmpty() ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 rounded-2xl min-h-[600px] print:hidden">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 mb-4 animate-pulse">
                    <FileText className="h-5 w-5" />
                  </div>
                  <h4 className="text-base font-semibold text-slate-700">Build your first resume.</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                    Fill in your details in the editor on the left to begin compiling your LaTeX-style resume preview.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Resume Header */}
                  <div className="text-center border-b-2 border-slate-800 pb-4">
                    <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 uppercase">
                      {name || "Jane Doe"}
                    </h2>
                    <div className="mt-1.5 flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-[10px] font-semibold text-slate-500 tracking-wider">
                      {email && <span>{email}</span>}
                      {phone && (
                        <>
                          <span className="h-1 w-1 rounded-full bg-slate-350" />
                          <span>{phone}</span>
                        </>
                      )}
                      {website && (
                        <>
                          <span className="h-1 w-1 rounded-full bg-slate-350" />
                          <span>{website}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Summary */}
                  {summary.trim() && (
                    <div className="space-y-1">
                      <h4 className="text-[10px] font-bold text-slate-550 uppercase tracking-widest border-b border-slate-100 pb-1">
                        Professional Summary
                      </h4>
                      <p className="text-[11px] leading-relaxed text-slate-600">
                        {summary}
                      </p>
                    </div>
                  )}

                  {/* Experience list */}
                  {experiences.some((exp) => exp.company.trim() || exp.role.trim()) && (
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-bold text-slate-550 uppercase tracking-widest border-b border-slate-100 pb-1">
                        Professional Experience
                      </h4>
                      <div className="space-y-3.5">
                        {experiences.map((exp, idx) => {
                          if (!exp.company.trim() && !exp.role.trim()) return null;
                          return (
                            <div key={idx} className="space-y-1">
                              <div className="flex justify-between items-baseline text-xs font-bold text-slate-800">
                                <span>{exp.role || "Role Title"} <span className="text-slate-500 font-medium">at</span> {exp.company || "Company"}</span>
                                <span className="text-[10px] text-slate-500 font-semibold">{exp.startDate || "Date"} &mdash; {exp.endDate || "Date"}</span>
                              </div>
                              {exp.bullets.trim() && (
                                <ul className="list-disc pl-4 text-[10px] leading-relaxed text-slate-600 space-y-0.5">
                                  {exp.bullets.split("\n").filter((l) => l.trim()).map((bullet, bIdx) => (
                                    <li key={bIdx}>{bullet.replace(/^- /, "")}</li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Education list */}
                  {educations.some((edu) => edu.school.trim() || edu.degree.trim()) && (
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-bold text-slate-550 uppercase tracking-widest border-b border-slate-100 pb-1">
                        Education & Credentials
                      </h4>
                      <div className="space-y-3.5">
                        {educations.map((edu, idx) => {
                          if (!edu.school.trim() && !edu.degree.trim()) return null;
                          return (
                            <div key={idx} className="space-y-1">
                              <div className="flex justify-between items-baseline text-xs font-bold text-slate-800">
                                <span>{edu.degree || "Degree"}</span>
                                <span className="text-[10px] text-slate-500 font-semibold">{edu.gradDate}</span>
                              </div>
                              <div className="text-[10px] text-slate-500 font-semibold">{edu.school}</div>
                              {edu.bullets.trim() && (
                                <ul className="list-disc pl-4 text-[10px] leading-relaxed text-slate-600 space-y-0.5">
                                  {edu.bullets.split("\n").filter((l) => l.trim()).map((bullet, bIdx) => (
                                    <li key={bIdx}>{bullet.replace(/^- /, "")}</li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Skills List */}
                  {skills.trim() && (
                    <div className="space-y-1">
                      <h4 className="text-[10px] font-bold text-slate-550 uppercase tracking-widest border-b border-slate-100 pb-1">
                        Technical Expertise
                      </h4>
                      <p className="text-[10px] leading-relaxed text-slate-600">
                        {skills.split(",").map((s) => s.trim()).join(" • ")}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Print Footer */}
              {!isFormEmpty() && (
                <div className="border-t border-slate-100 pt-3 text-center text-[8px] font-semibold text-slate-455 uppercase tracking-widest hidden print:block">
                  Compiled via Toolzy Workstation
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Global CSS styles to handle print isolation */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          header, main > div.print-hidden, main > div.mb-8, main div.print-hidden, form, button, h3, select, input, textarea {
            display: none !important;
            visibility: hidden !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
            width: 100% !important;
          }
          .print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: auto !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            background: white !important;
          }
        }
      `}</style>
    </div>
  );
}
