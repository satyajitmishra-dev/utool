import React from "react";
import { getAuthUser } from "@/lib/auth-server";
import { adminDb } from "@/lib/firebase-admin";
import { SupportDashboardClient } from "@/components/support/support-dashboard-client";
import { redirect } from "next/navigation";
import { Sparkles, LifeBuoy } from "lucide-react";

export const metadata = {
  title: "Support Tickets Dashboard | Utool",
  description: "View and manage your technical support tickets and requests.",
};

export default async function UserSupportDashboardPage() {
  const user = await getAuthUser();
  if (!user) {
    redirect("/login?redirect=/dashboard/support");
  }

  // Fetch tickets for this user
  let tickets: any[] = [];
  try {
    const snapshot = await adminDb
      .collection("support_tickets")
      .where("uid", "==", user.uid)
      .orderBy("createdAt", "desc")
      .get();

    tickets = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        uid: data.uid,
        name: data.name,
        email: data.email,
        toolSlug: data.toolSlug || null,
        issueType: data.issueType,
        subject: data.subject,
        message: data.message,
        screenshotUrl: data.screenshotUrl || null,
        priority: data.priority,
        status: data.status,
        createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
        replies: (data.replies || []).map((reply: any) => ({
          ...reply,
          createdAt: reply.createdAt || new Date().toISOString(),
        })),
      };
    });
  } catch (error) {
    console.error("Error fetching dashboard tickets from firestore:", error);
  }

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-h1 font-extrabold tracking-tight text-foreground">
              Customer Support Center
            </h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="h-2.5 w-2.5" />
              SaaS Engine v2
            </span>
          </div>
          <p className="text-body-s text-muted-foreground mt-1">
            Track, review, and reply to your active technical support requests.
          </p>
        </div>
        
        <div>
          <a
            href="/support"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 text-sm font-semibold shadow-sm transition-all active:scale-[0.98]"
          >
            <LifeBuoy className="h-4 w-4" />
            <span>Open New Ticket</span>
          </a>
        </div>
      </div>

      {/* Main client component */}
      <SupportDashboardClient
        initialTickets={tickets}
        userEmail={user.email || ""}
        userName={user.name || ""}
      />
    </div>
  );
}
