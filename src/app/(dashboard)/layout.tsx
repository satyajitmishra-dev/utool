import React from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { verifySessionCookie } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifySessionCookie();
  
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground">
      <Sidebar />

      {/* Content */}
      <main className="flex-1 overflow-y-auto focus:outline-none">
        <div className="py-6 px-4 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
