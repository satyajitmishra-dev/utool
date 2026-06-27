import React from "react";
import { Metadata } from "next";
import { WorkspaceProvider } from "@/context/WorkspaceContext";

export const metadata: Metadata = {
  title: "Media Workspace | utool",
  description: "A world-class media workspace for editing, converting, organizing, and exporting media files. Free, unlimited, and real-time.",
  openGraph: {
    title: "Media Workspace | utool",
    description: "A world-class media workspace for editing, converting, organizing, and exporting media files. Free, unlimited, and real-time.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Media Workspace | utool",
    description: "A world-class media workspace for editing, converting, organizing, and exporting media files.",
  }
};

export default function MediaWorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground selection:bg-primary/30">
      <WorkspaceProvider>
        {children}
      </WorkspaceProvider>
    </div>
  );
}
