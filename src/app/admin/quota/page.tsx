import React from "react";
import { getAuthUser } from "@/lib/auth-server";
import { isAdmin } from "@/app/actions/support";
import { redirect } from "next/navigation";
import { UserQuotaDashboardClient } from "@/components/admin/quota/UserQuotaDashboardClient";
import Link from "next/link";
import { Shield, ArrowLeft, Terminal } from "lucide-react";

export const metadata = {
  title: "Enterprise User Quota & Administration Control Center | Utool Workspace",
  description: "Operational console for user profile management, credit allocation, tool permissions, and B2B organizations.",
};

export default async function AdminQuotaPage() {
  // 1. Authorize: verify user is logged in and is an Admin
  const user = await getAuthUser();
  if (!user || !(await isAdmin(user.uid))) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans py-10 px-6 max-w-7xl mx-auto space-y-8 relative overflow-hidden">
      {/* Radial decorative glows */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Nav breadcrumbs and status indicators */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-border/80 pb-5">
        <div className="space-y-1">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Admin Operations
          </Link>
          
          <div className="flex items-center gap-2 mt-2">
            <Shield className="h-5 w-5 text-purple-400" />
            <h1 className="text-xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              User Quota Manager & SaaS Administration
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono bg-muted/40 border border-border px-3 py-1.5 rounded-lg w-fit">
          <Terminal className="h-3.5 w-3.5" />
          <span>Operator: {user.name || user.email}</span>
        </div>
      </div>

      {/* Renders the dashboard client component */}
      <UserQuotaDashboardClient />
    </div>
  );
}
