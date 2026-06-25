import { NextResponse, NextRequest } from "next/server";
import { razorpay } from "@/lib/razorpay";
import { getAuthUser } from "@/lib/auth-server";

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!user.email_verified) {
      return NextResponse.json({ error: "Email verification required" }, { status: 403 });
    }

    // Secure backend price validation
    const verifiedPrice = Number(process.env.RAZORPAY_LIFETIME_PRICE) || 299;

    // Create standard Razorpay Order for one-time payment
    const order = await razorpay.orders.create({
      amount: verifiedPrice * 100, // in paise
      currency: "INR",
      receipt: `receipt_lifetime_${user.uid.slice(0, 10)}_${Date.now()}`,
      notes: {
        userId: user.uid,
        planType: "lifetime",
      },
    });

    return NextResponse.json({
      orderId: order.id,
      keyId: process.env.RAZORPAY_KEY_ID,
      amount: order.amount,
    });
  } catch (error: unknown) {
    console.error("Failed to create Razorpay order:", error);
    const message = error instanceof Error ? error.message : "Failed to create order";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
export const dynamic = "force-dynamic";
