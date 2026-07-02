import React from 'react';
import { ShieldCheck, Cpu, CloudOff } from 'lucide-react';

interface ConverterHeaderProps {
  title: string;
  description: string;
  isOfflineCompatible?: boolean;
}

export function ConverterHeader({
  title,
  description,
  isOfflineCompatible = true,
}: ConverterHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Title & Desc */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
          {title}
        </h1>
        <p className="text-base text-muted-foreground max-w-2xl leading-relaxed">
          {description}
        </p>
      </div>

      {/* Trust Badges */}
      <div className="flex flex-wrap gap-3 pt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 shadow-xs">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>100% Local Processing</span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-400 border border-cyan-100 dark:border-cyan-900/30 shadow-xs">
          <Cpu className="h-3.5 w-3.5" />
          <span>No Upload Required</span>
        </div>
        {isOfflineCompatible && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border border-purple-100 dark:border-purple-900/30 shadow-xs">
            <CloudOff className="h-3.5 w-3.5" />
            <span>Works Offline</span>
          </div>
        )}
      </div>
    </div>
  );
}
