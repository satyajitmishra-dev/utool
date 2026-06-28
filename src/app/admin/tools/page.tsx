import React from "react";
import { getAuthUser } from "@/lib/auth-server";
import { isAdmin } from "@/app/actions/support";
import { getMergedToolRegistry } from "@/services/tool-lifecycle.service";
import { redirect } from "next/navigation";
import { AdminToolsDashboardClient } from "@/components/admin/AdminToolsDashboardClient";

export const metadata = {
  title: "Tool Lifecycle Management | Utool Workspace",
  description: "Track development, test completeness, and publish status of all tools.",
};

export default async function AdminToolsPage() {
  // 1. Authorize: verify user is logged in and is an Admin
  const user = await getAuthUser();
  if (!user || !(await isAdmin(user.uid))) {
    redirect("/");
  }

  // 2. Fetch all merged tools from registry + database
  const tools = await getMergedToolRegistry();

  return (
    <AdminToolsDashboardClient initialTools={JSON.parse(JSON.stringify(tools))} />
  );
}
