import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
  try {
    const { email, toolId } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    if (!toolId) {
      return NextResponse.json({ error: "Missing toolId." }, { status: 400 });
    }

    if (!adminDb) {
      // Offline fallback
      return NextResponse.json({ success: true, message: "Subscribed successfully (mock mode)" });
    }

    // Save to Firestore tool_notifications collection
    await adminDb.collection("tool_notifications").add({
      email: email.trim().toLowerCase(),
      toolId,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "You have been successfully added to the notification list!",
    });
  } catch (error: any) {
    console.error("POST /api/tools/notify error:", error);
    return NextResponse.json({ error: error.message || "Failed to subscribe" }, { status: 500 });
  }
}
