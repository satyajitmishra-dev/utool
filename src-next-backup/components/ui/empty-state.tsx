"use client";

import React from "react";
import { cn } from "@/utils/cn";
import { SearchX, FolderOpen, BarChart3, Bookmark, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type EmptyPreset = "no-results" | "no-files" | "no-usage" | "no-saved";

interface EmptyStateProps {
  preset?: EmptyPreset;
  icon?: LucideIcon;
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  className?: string;
}

const presets: Record<EmptyPreset, { icon: LucideIcon; title: string; description: string }> = {
  "no-results": {
    icon: SearchX,
    title: "No results found",
    description: "Try adjusting your search or filter criteria to find what you're looking for.",
  },
  "no-files": {
    icon: FolderOpen,
    title: "No recent files",
    description: "Files you work with will appear here for quick access.",
  },
  "no-usage": {
    icon: BarChart3,
    title: "No usage data yet",
    description: "Start using tools to see your activity and statistics here.",
  },
  "no-saved": {
    icon: Bookmark,
    title: "No saved tools",
    description: "Bookmark your favorite tools for quick access from your dashboard.",
  },
};

export function EmptyState({
  preset,
  icon: CustomIcon,
  title: customTitle,
  description: customDesc,
  action,
  className,
}: EmptyStateProps) {
  const resolved = preset ? presets[preset] : null;
  const Icon = CustomIcon || resolved?.icon || SearchX;
  const title = customTitle || resolved?.title || "Nothing here yet";
  const description = customDesc || resolved?.description || "";

  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-4 text-center", className)}>
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted border border-border text-muted-foreground mb-5">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-h3 text-foreground">{title}</h3>
      <p className="mt-2 text-body-s text-muted-foreground max-w-sm">
        {description}
      </p>
      {action && (
        <div className="mt-6">
          {action.href ? (
            <a href={action.href}>
              <Button variant="outline" size="md">
                {action.label}
              </Button>
            </a>
          ) : (
            <Button variant="outline" size="md" onClick={action.onClick}>
              {action.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
