"use client";

import React from 'react';
import { Construction, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function MediaWorkspacePage() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[40%] left-[40%] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="z-10 flex flex-col items-center text-center max-w-2xl px-6">
        <div className="w-20 h-20 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-primary/10 border border-primary/20">
          <Construction className="w-10 h-10" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 flex items-center gap-3">
          Media Workspace
          <Sparkles className="w-6 h-6 text-yellow-500" />
        </h1>
        
        <div className="space-y-4 text-muted-foreground text-lg mb-10">
          <p>
            We're building something amazing! The new browser-native Media Workspace is currently under development.
          </p>
          <p>
            Get ready for advanced video editing, audio extraction, fast media compression, and much more right in your browser.
          </p>
        </div>

        <div className="flex gap-4">
          <Link href="/">
            <Button size="lg" className="rounded-full shadow-lg shadow-primary/20 transition-all hover:scale-105">
              Go back home
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
