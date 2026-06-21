import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      {/* Gradient accent */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -z-10 h-[400px] w-[400px] rounded-full bg-[hsl(var(--ring)_/_0.06)] blur-3xl" />

      <div className="animate-slide-up">
        <p className="text-[120px] sm:text-[160px] font-extrabold tracking-tighter text-foreground/5 leading-none select-none">
          404
        </p>
        <h1 className="text-h1 text-foreground -mt-8 sm:-mt-12">
          Page not found
        </h1>
        <p className="mt-4 text-body-m text-muted-foreground max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-[image:var(--gradient-primary)] px-7 py-3 text-[15px] font-semibold text-white shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity"
          >
            Go home
          </Link>
          <Link
            href="/tools"
            className="inline-flex items-center justify-center rounded-full border border-border bg-card px-6 py-3 text-[15px] font-medium text-foreground hover:bg-muted transition-colors"
          >
            Browse tools
          </Link>
        </div>
      </div>
    </div>
  );
}
