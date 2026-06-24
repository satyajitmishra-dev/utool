import React from 'react';
import Link from 'next/link';

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-neutral-950 text-neutral-50 overflow-hidden">
      {/* Left side: Brand panel */}
      <div className="hidden md:flex flex-col justify-center px-12 lg:px-20 relative border-r border-white/5">
        <div className="absolute inset-0 bg-neutral-900/50 backdrop-blur-3xl z-0" />
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-violet-600/20 blur-[120px] rounded-full mix-blend-screen" />
          <div className="absolute top-1/2 left-1/4 w-[80%] h-[80%] bg-indigo-600/10 blur-[120px] rounded-full mix-blend-screen" />
        </div>

        <div className="relative z-10 max-w-lg">
          <Link href="/" className="inline-block mb-16">
            <span className="text-3xl font-bold tracking-tighter bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">Utool</span>
          </Link>
          
          <h1 className="text-4xl lg:text-5xl font-medium tracking-tight mb-6 leading-tight">
            Every tool you need.
            <br />
            <span className="text-white/60">One beautiful workspace.</span>
          </h1>
          
          <p className="text-lg text-white/50 mb-12 leading-relaxed max-w-md">
            PDF tools, QR generation, URL shortening, resume building, and more — all in one fast, secure workspace.
          </p>
          
          <ul className="space-y-4">
            {[
              "Private & secure",
              "Fast processing",
              "Free daily access",
              "Premium tools available"
            ].map((feature, i) => (
              <li key={i} className="flex items-center text-white/70">
                <div className="mr-3 p-1 rounded-full bg-violet-500/10 text-violet-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Right side: Auth form card */}
      <div className="flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
        {/* Mobile background effect */}
        <div className="absolute md:hidden top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-1/4 -right-1/4 w-full h-full bg-violet-600/10 blur-[100px] rounded-full" />
        </div>
        <div className="w-full max-w-md relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
}
