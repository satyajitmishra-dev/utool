import React from 'react';

export function ConverterSkeleton() {
  return (
    <div className="space-y-8 animate-pulse text-left">
      {/* Header Skeleton */}
      <div className="space-y-3">
        <div className="h-9 w-64 bg-muted rounded-xl" />
        <div className="h-5 w-full max-w-xl bg-muted rounded-lg" />
        <div className="flex gap-2">
          <div className="h-6 w-32 bg-muted rounded-full" />
          <div className="h-6 w-32 bg-muted rounded-full" />
        </div>
      </div>

      {/* Main Workspace Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 border border-border rounded-3xl p-6 bg-card/40">
        <div className="space-y-4">
          <div className="h-5 w-24 bg-muted rounded-lg" />
          <div className="h-12 w-full bg-muted rounded-xl" />
          <div className="h-12 w-full bg-muted rounded-xl" />
        </div>
        <div className="space-y-4">
          <div className="h-5 w-24 bg-muted rounded-lg" />
          <div className="h-12 w-full bg-muted rounded-xl" />
          <div className="h-12 w-full bg-muted rounded-xl" />
        </div>
      </div>

      {/* Metadata Accordion Skeleton */}
      <div className="space-y-3">
        <div className="h-6 w-40 bg-muted rounded-lg" />
        <div className="h-16 w-full bg-muted rounded-xl" />
      </div>
    </div>
  );
}
