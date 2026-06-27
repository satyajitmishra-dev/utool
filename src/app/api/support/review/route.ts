import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { verifySessionServer } from "@/lib/auth-server";
import { adminAuth } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { toolSlug, conversionId, rating, reviewText, recommend } = body;

    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split('Bearer ')[1];
    let session: any = null;
    
    if (token) {
      try {
        session = await adminAuth.verifyIdToken(token);
      } catch (e) {
        console.warn("Invalid token for review");
      }
    }

    if (!toolSlug || !rating) {
      return NextResponse.json({ error: "Tool slug and rating are required." }, { status: 400 });
    }

    const reviewId = adminDb.collection("toolReviews").doc().id;
    const isGuest = !session?.uid;

    await adminDb.collection("toolReviews").doc(reviewId).set({
      userId: session?.uid || 'guest',
      email: session?.email || 'guest@example.com', // Guests save anonymously
      toolSlug,
      conversionId: conversionId || null,
      rating,
      reviewText: reviewText || '',
      recommend: recommend || true,
      status: isGuest ? 'internal_only' : 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      message: "Review submitted successfully"
    });
  } catch (error: any) {
    console.error("Support review creation error:", error);
    return NextResponse.json(
      { error: "Internal server error while creating review" },
      { status: 500 }
    );
  }
}
