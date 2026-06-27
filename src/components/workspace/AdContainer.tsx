"use client";

import React, { useEffect, useState } from 'react';
import { cn } from '@/utils/cn';

interface AdContainerProps {
  slot: string;
  width: number;
  height: number;
  className?: string;
  format?: 'auto' | 'fluid' | 'rectangle';
}

export function AdContainer({ slot, width, height, className, format = 'auto' }: AdContainerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasAdBlocker, setHasAdBlocker] = useState(false);

  useEffect(() => {
    // Simulate detecting an ad blocker or failing to load an ad
    const timer = setTimeout(() => {
      // In production, this would integrate with Google AdSense or another provider
      // e.g., (window.adsbygoogle = window.adsbygoogle || []).push({});
      setIsLoaded(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, [slot]);

  return (
    <div 
      className={cn(
        "bg-muted/30 border border-border/50 rounded-xl flex items-center justify-center overflow-hidden transition-all duration-300 relative",
        className
      )}
      style={{ 
        width: format === 'fluid' ? '100%' : width, 
        minHeight: height,
      }}
    >
      {!isLoaded && !hasAdBlocker && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 animate-pulse">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Advertisement</span>
        </div>
      )}
      {isLoaded && !hasAdBlocker && (
        <div className="text-center p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Advertisement</p>
          {/* AdSense ins element would go here */}
          <div className="w-full h-full bg-primary/5 rounded border border-primary/10 flex items-center justify-center">
            <span className="text-sm text-primary/50">Placeholder {width}x{height}</span>
          </div>
        </div>
      )}
    </div>
  );
}
