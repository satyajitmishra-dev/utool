"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wrench, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { validateEmail } from "@/utils/validation";
import { mapFirebaseError } from "@/utils/firebase-error-map";

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    if (emailError) { toast.error(emailError); return; }

    setLoading(true);
    const toastId = toast.loading("Sending reset link...");

    try {
      await resetPassword(email);
      toast.dismiss(toastId);
      toast.success("Check your inbox for further instructions to reset your password.");
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(mapFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 -z-10 h-96 w-96 rounded-full bg-[hsl(var(--ring)_/_0.06)] blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-96 w-96 rounded-full bg-[hsl(var(--color-secondary)_/_0.06)] blur-3xl" />

      <div className="w-full max-w-md space-y-8 rounded-2xl border border-border bg-card p-8 shadow-xl animate-scale-in">
        <div className="flex flex-col items-center">
          <Link href="/" className="flex items-center gap-2 font-bold text-2xl tracking-tight text-foreground mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[image:var(--gradient-primary)] shadow-md">
              <Wrench className="h-5 w-5 text-white" />
            </div>
            <span>Toolzy</span>
          </Link>
          <h2 className="text-center text-h2 text-foreground">Reset Password</h2>
          <p className="mt-2 text-center text-body-s text-muted-foreground">
            Enter the email address associated with your account, and we will send you a reset link.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <Input
            id="email-address"
            label="Email address"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />

          <Button type="submit" loading={loading} variant="premium" size="lg" className="w-full rounded-xl">
            Send Reset Link
          </Button>
        </form>

        <div className="text-center mt-6">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-body-s font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
