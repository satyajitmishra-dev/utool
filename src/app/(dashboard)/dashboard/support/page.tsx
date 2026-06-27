import React from "react";
import { getAuthUser } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { SupportCenterClient } from "@/modules/support/components/support-center-client";

export const metadata = {
  title: "Support Center | Utool",
  description: "Get real-time help, report bugs, and request features directly from the support center.",
};

export default async function UserSupportDashboardPage() {
  const user = await getAuthUser();
  if (!user) {
    redirect("/login?redirect=/dashboard/support");
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Support Center
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Chat with our team, report issues, or request new features.
        </p>
      </div>

      <SupportCenterClient />
    </div>
  );
}
