"use client";

import React, { useState, useEffect, useTransition } from "react";
import { LifeBuoy, AlertCircle, Sparkles, UploadCloud, X, HelpCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { submitTicketAction } from "@/app/actions/support";
import { cn } from "@/utils/cn";
import { toolsSeoData } from "@/config/tools-seo-data";

interface SupportFormProps {
  defaultToolSlug?: string;
  onSuccess?: (ticketId: string) => void;
  className?: string;
}

export function SupportForm({ defaultToolSlug, onSuccess, className }: SupportFormProps) {
  const { user } = useAuth();
  const [isPending, startTransition] = useTransition();

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [toolSlug, setToolSlug] = useState(defaultToolSlug || "");
  const [issueType, setIssueType] = useState("general");
  const [priority, setPriority] = useState("medium");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);

  // Autofill name/email when logged in
  useEffect(() => {
    if (user) {
      setName(user.displayName || "");
      setEmail(user.email || "");
    } else {
      setName("");
      setEmail("");
    }
  }, [user]);

  // Synchronize defaultToolSlug updates
  useEffect(() => {
    if (defaultToolSlug) {
      setToolSlug(defaultToolSlug);
    }
  }, [defaultToolSlug]);

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        toast.error("File size exceeds 8MB limit");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("File must be an image format");
        return;
      }
      setScreenshot(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeScreenshot = () => {
    setScreenshot(null);
    setScreenshotPreview(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return toast.error("Please enter your name");
    if (!email.trim()) return toast.error("Please enter your email");
    if (!subject.trim()) return toast.error("Subject is required");
    if (!message.trim() || message.length < 10) {
      return toast.error("Please explain your issue in at least 10 characters");
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("toolSlug", toolSlug);
    formData.append("issueType", issueType);
    formData.append("priority", priority);
    formData.append("subject", subject);
    formData.append("message", message);
    if (screenshot) {
      formData.append("screenshot", screenshot);
    }

    startTransition(async () => {
      try {
        const result = await submitTicketAction(null, formData);
        if (result.success) {
          toast.success("Support ticket submitted! Check your email for receipt.");
          setSubject("");
          setMessage("");
          removeScreenshot();
          if (onSuccess && result.ticketId) {
            onSuccess(result.ticketId);
          }
        } else {
          toast.error(result.error || "Failed to submit ticket");
        }
      } catch (err) {
        console.error("Support submission error:", err);
        toast.error("An unexpected error occurred. Please try again.");
      }
    });
  };

  // Compile list of available tools for select dropdown
  const tools = Object.keys(toolsSeoData).map((key) => ({
    slug: key,
    name: toolsSeoData[key].name,
  }));

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "space-y-4 sm:space-y-5 rounded-3xl border border-border bg-card/40 p-4 sm:p-6 md:p-8 shadow-sm backdrop-blur-sm relative overflow-hidden",
        className
      )}
    >
      <div className="absolute top-0 left-0 w-full h-[3px] bg-primary" />
      
      <div className="flex items-center gap-2.5 mb-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <LifeBuoy className="h-5 w-5 animate-pulse" />
        </div>
        <div>
          <h2 className="text-h3 font-bold text-foreground">Need Technical Help?</h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Submit a support ticket and our engineering team will get back to you shortly.
          </p>
        </div>
      </div>

      {/* User meta pre-fill */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Your Name"
          id="ticket-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={!!(user && user.displayName) || isPending}
          placeholder="Enter name"
          required
        />
        <Input
          label="Email Address"
          id="ticket-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={!!(user && user.email) || isPending}
          placeholder="your@email.com"
          required
        />
      </div>

      {/* Dropdown selectors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tool context select */}
        <div className="space-y-1.5">
          <label className="block text-body-s font-medium text-foreground">
            Related Workspace Tool
          </label>
          <select
            suppressHydrationWarning
            value={toolSlug}
            onChange={(e) => setToolSlug(e.target.value)}
            disabled={!!defaultToolSlug || isPending}
            className="block w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground shadow-sm transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring)_/_0.2)] disabled:opacity-70"
          >
            <option value="">General Support (No Tool)</option>
            {tools.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Issue Type select */}
        <div className="space-y-1.5">
          <label className="block text-body-s font-medium text-foreground">
            Category
          </label>
          <select
            suppressHydrationWarning
            value={issueType}
            onChange={(e) => setIssueType(e.target.value)}
            disabled={isPending}
            className="block w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground shadow-sm transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring)_/_0.2)]"
          >
            <option value="general">General Support</option>
            <option value="bug_report">Bug Report</option>
            <option value="billing">Billing Issue</option>
            <option value="feature_request">Feature Request</option>
            <option value="tool_error">Tool Error / Crash</option>
          </select>
        </div>

        {/* Priority select */}
        <div className="space-y-1.5">
          <label className="block text-body-s font-medium text-foreground">
            Severity / Priority
          </label>
          <select
            suppressHydrationWarning
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            disabled={isPending}
            className="block w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground shadow-sm transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring)_/_0.2)]"
          >
            <option value="low">Low (Standard Question)</option>
            <option value="medium">Medium (Impaired Usage)</option>
            <option value="high">High (Tool Broken / Account Locked)</option>
          </select>
        </div>
      </div>

      {/* Subject Line */}
      <Input
        label="Subject Line"
        id="ticket-subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        disabled={isPending}
        placeholder="Brief description of the problem"
        required
      />

      {/* Detailed message */}
      <div className="space-y-1.5">
        <label
          htmlFor="ticket-message"
          className="block text-body-s font-medium text-foreground"
        >
          Detailed Description
        </label>
        <textarea
          id="ticket-message"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isPending}
          placeholder="Please describe what you were doing, what error occurred, and how we can reproduce it. Provide as much context as possible."
          className="block w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground shadow-sm transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring)_/_0.2)] disabled:opacity-50"
          required
        />
      </div>

      {/* Screenshot Dropzone */}
      <div className="space-y-2">
        <label className="block text-body-s font-medium text-foreground">
          Attach Screenshots or Errors
        </label>
        <div className="flex flex-col items-stretch">
          {!screenshotPreview ? (
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-border hover:border-primary/50 bg-card/20 hover:bg-card/40 rounded-2xl p-6 cursor-pointer transition-all duration-200 text-center select-none group">
              <UploadCloud className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors mb-2" />
              <span className="text-xs font-semibold text-foreground">Click to upload screenshot</span>
              <span className="text-[10px] text-muted-foreground/80 mt-1">PNG, JPG, WEBP up to 8MB</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleScreenshotChange}
                disabled={isPending}
                className="hidden"
              />
            </label>
          ) : (
            <div className="relative inline-flex self-start rounded-2xl overflow-hidden border border-border bg-muted shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={screenshotPreview}
                alt="Upload preview"
                className="h-28 w-44 object-cover"
              />
              <button
                type="button"
                onClick={removeScreenshot}
                className="absolute top-2 right-2 h-6 w-6 flex items-center justify-center rounded-full bg-black/70 hover:bg-red-500 text-white transition-all shadow-md"
                disabled={isPending}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Submit Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        {user ? (
          <p className="text-[11px] text-muted-foreground font-semibold flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Authenticated user. Track status inside your Dashboard.
          </p>
        ) : (
          <p className="text-[11px] text-amber-500/90 font-semibold flex items-center gap-1">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            Guest mode. We will send ticket replies to your email.
          </p>
        )}

        <Button
          type="submit"
          variant="premium"
          className="w-full sm:w-auto"
          loading={isPending}
        >
          Submit Support Ticket
        </Button>
      </div>
    </form>
  );
}
