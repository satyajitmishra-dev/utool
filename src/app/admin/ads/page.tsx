import React from "react";
import { getAuthUser } from "@/lib/auth-server";
import { isAdmin } from "@/app/actions/support";
import { redirect } from "next/navigation";
import { AdminAdsDashboard } from "@/components/admin/AdminAdsDashboard";

export const metadata = {
  title: "Ad Monetization Control | Utool Workspace",
  description: "Configure system-wide placements, active ad providers, privacy rules, and visual reports.",
};

export default async function AdminAdsPage() {
  // Authorize: verify user is logged in and is an Admin
  const user = await getAuthUser();
  if (!user || !(await isAdmin(user.uid))) {
    redirect("/");
  }

  return <AdminAdsDashboard />;
}
