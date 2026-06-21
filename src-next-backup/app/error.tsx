"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -z-10 h-[400px] w-[400px] rounded-full bg-[hsl(var(--color-error)_/_0.06)] blur-3xl" />

      <div className="animate-slide-up">
        <p className="text-[120px] sm:text-[160px] font-extrabold tracking-tighter text-foreground/5 leading-none select-none">
          500
        </p>
        <h1 className="text-h1 text-foreground -mt-8 sm:-mt-12">
          Something went wrong
        </h1>
        <p className="mt-4 text-body-m text-muted-foreground max-w-md mx-auto">
          An unexpected error occurred. Our team has been notified and is working on a fix.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center rounded-full bg-[image:var(--gradient-primary)] px-7 py-3 text-[15px] font-semibold text-white shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-border bg-card px-6 py-3 text-[15px] font-medium text-foreground hover:bg-muted transition-colors"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}
