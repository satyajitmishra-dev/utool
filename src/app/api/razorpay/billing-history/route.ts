import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const snapshot = await adminDb
      .collection("billing_history")
      .where("uid", "==", user.uid)
      .get();

    const invoices = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: data.id,
        uid: data.uid,
        subscriptionId: data.subscriptionId,
        paymentId: data.paymentId,
        amount: data.amount,
        currency: data.currency,
        status: data.status,
        planName: data.planName,
        invoiceMonth: data.invoiceMonth,
        date: data.date,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
        rawCreatedAt: data.createdAt,
      };
    });

    // Sort in memory to avoid requiring a composite index
    invoices.sort((a, b) => {
      const aTime = a.rawCreatedAt?.toDate?.()?.getTime() || 0;
      const bTime = b.rawCreatedAt?.toDate?.()?.getTime() || 0;
      return bTime - aTime;
    });

    return NextResponse.json({ invoices });
  } catch (error: unknown) {
    console.error("Failed to fetch billing history:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch billing history";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
export const dynamic = "force-dynamic";
