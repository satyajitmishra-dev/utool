import React from "react";
import { getAuthUser } from "@/lib/auth-server";
import { isAdmin } from "@/app/actions/support";
import { adminDb } from "@/lib/firebase-admin";
import { SupportAdminClient } from "@/components/support/support-admin-client";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Terminal } from "lucide-react";

export const metadata = {
  title: "Support Administration | Utool Workspace",
  description: "Manage technical support requests, bug reports, and features.",
};

export default async function AdminSupportPage() {
  const user = await getAuthUser();
  
  // 1. Authorize: verify user is logged in and is an Admin
  if (!user || !(await isAdmin(user.uid))) {
    redirect("/");
  }

  // 2. Query all support tickets across the system
  let tickets: any[] = [];
  try {
    const snapshot = await adminDb
      .collection("support_tickets")
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
        timeline: (data.timeline || []).map((evt: any) => ({
          ...evt,
          createdAt: evt.createdAt || new Date().toISOString(),
        })),
      };
    });
  } catch (error) {
    console.error("Error fetching support tickets for admin:", error);
  }

  // 3. Query all user reviews across the system
  let reviews: any[] = [];
  try {
    const snapshot = await adminDb
      .collection("reviews")
      .orderBy("createdAt", "desc")
      .get();

    reviews = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        uid: data.uid || null,
        name: data.name,
        email: data.email,
        rating: data.rating,
        message: data.message,
        toolSlug: data.toolSlug,
        screenshotUrl: data.screenshotUrl || null,
        createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
      };
    });
  } catch (error) {
    console.error("Error fetching reviews for admin:", error);
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans py-10 px-6 max-w-7xl mx-auto space-y-8 relative overflow-hidden">
      {/* Decorative glows */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Breadcrumb / Nav */}
      <div className="flex justify-between items-center gap-4 border-b border-border/80 pb-5">
        <div className="space-y-1">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            Exit Administration
          </Link>
          
          <div className="flex items-center gap-2 mt-2">
            <ShieldAlert className="h-5 w-5 text-purple-400" />
            <h1 className="text-xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              Support & Reviews Administration
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono bg-muted/40 border border-border px-3 py-1.5 rounded-lg">
          <Terminal className="h-3.5 w-3.5" />
          <span>Operator: {user.name || user.email}</span>
        </div>
      </div>

      {/* Main Admin Client Interface */}
      <SupportAdminClient
        initialTickets={tickets}
        initialReviews={reviews}
        adminName={user.name || "Support Lead"}
        adminEmail={user.email || ""}
      />
    </div>
  );
}
