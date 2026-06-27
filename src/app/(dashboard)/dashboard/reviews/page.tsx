import React from "react";
import { getAuthUser } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { ReviewsClient } from "@/modules/support/components/reviews-client";

export const metadata = {
  title: "My Reviews | Utool",
  description: "View and manage your submitted tool reviews.",
};

export default async function UserReviewsDashboardPage() {
  const user = await getAuthUser();
  if (!user) {
    redirect("/login?redirect=/dashboard/reviews");
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          My Reviews
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage the feedback and reviews you have provided for UTool services.
        </p>
      </div>

      <ReviewsClient />
    </div>
  );
}
