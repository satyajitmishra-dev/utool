"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { mapFirebaseError } from "@/utils/firebase-error-map";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthHeader } from "@/components/auth/auth-header";
import { AuthInput } from "@/components/auth/auth-input";
import { PasswordToggle } from "@/components/auth/password-toggle";
import { AuthFooter } from "@/components/auth/auth-footer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginFormContent() {
  const { login, loginWithGoogle, authInitializing } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  let redirectUrl = searchParams.get("redirect") || "/dashboard";
  if (!redirectUrl.startsWith("/")) {
    redirectUrl = "/dashboard";
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      toast.success("Welcome back to Utool.");
      router.push(redirectUrl);
    } catch (err) {
      toast.error(mapFirebaseError(err));
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle();
      toast.success("Welcome back to Utool.");
    } catch (err) {
      toast.error(mapFirebaseError(err));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  if (authInitializing) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <Loader2 className="animate-spin text-violet-500 h-8 w-8" />
      </div>
    );
  }

  return (
    <AuthShell>
      <AuthCard>
        <AuthHeader 
          title="Welcome back" 
          description="Log in to your account to continue" 
        />
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <AuthInput
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register("email")}
          />
          
          <div className="space-y-1">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-white/70">
                Password
              </label>
              <Link href="/forgot-password" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
                Forgot password?
              </Link>
            </div>
            <PasswordToggle
              label="" // empty label since we have custom one above
              placeholder="••••••••"
              error={errors.password?.message}
              {...register("password")}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-white text-black font-medium py-3 rounded-xl hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-6"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="my-6 flex items-center before:flex-1 before:border-t before:border-white/10 after:flex-1 after:border-t after:border-white/10">
          <span className="px-4 text-xs text-white/40 uppercase tracking-wider">Or</span>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading}
          className="w-full bg-white/5 border border-white/10 text-white font-medium py-3 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center disabled:opacity-50"
        >
          {isGoogleLoading ? (
            <Loader2 className="animate-spin h-5 w-5" />
          ) : (
            <>
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              Continue with Google
            </>
          )}
        </button>

        <div className="mt-4">
          <button
            onClick={() => router.push(searchParams.get("redirect") || "/tools")}
            className="w-full text-center text-sm text-white/50 hover:text-white transition-colors py-2"
          >
            Continue as Guest &rarr;
          </button>
        </div>

        <AuthFooter 
          text="Don't have an account?" 
          linkText="Sign up" 
          href="/signup" 
        />
      </AuthCard>
    </AuthShell>
  );
}

export function LoginForm() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <Loader2 className="animate-spin text-violet-500 h-8 w-8" />
      </div>
    }>
      <LoginFormContent />
    </Suspense>
  );
}
