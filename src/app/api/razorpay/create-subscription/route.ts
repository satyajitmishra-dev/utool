import { NextResponse, NextRequest } from "next/server";
import { razorpay } from "@/lib/razorpay";
import { getAuthUser } from "@/lib/auth-server";
import { adminApp } from "@/lib/firebase-admin";
import { getRemoteConfig } from "firebase-admin/remote-config";

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const clientPrice = Number(body.price);

    // Dynamic price validation against Firebase Remote Config
    let verifiedPrice = 299; // Default fallback
    try {
      const rc = getRemoteConfig(adminApp);
      const template = await rc.getTemplate();
      const rcProPrice = Number((template.parameters["toolzy_pro_price"]?.defaultValue as any)?.value || 299);
      const rcProOriginalPrice = Number((template.parameters["toolzy_pro_original_price"]?.defaultValue as any)?.value || 599);

      if (clientPrice === rcProPrice || clientPrice === rcProOriginalPrice) {
        verifiedPrice = clientPrice;
      } else {
        console.warn(`Price mismatch: client sent ${clientPrice}, Remote Config pro_price is ${rcProPrice}. Using Remote Config price.`);
        verifiedPrice = rcProPrice;
      }
    } catch (rcError) {
      console.warn("Failed to fetch Remote Config on server, validating against defaults:", rcError);
      if (clientPrice === 299 || clientPrice === 599) {
        verifiedPrice = clientPrice;
      }
    }

    let planId = process.env.RAZORPAY_PRO_PLAN_ID;

    // If planId is not defined in env, search Razorpay plans or create dynamically
    if (!planId) {
      try {
        const plansResponse = await razorpay.plans.all();
        const existingPlan = plansResponse.items.find(
          (p: { id: string; item: { name: string; amount: string | number } }) =>
            p.item.name === "Pro Utility Plan" && Number(p.item.amount) === (verifiedPrice * 100)
        );

        if (existingPlan) {
          planId = existingPlan.id;
        } else {
          const newPlan = await razorpay.plans.create({
            period: "monthly",
            interval: 1,
            item: {
              name: "Pro Utility Plan",
              amount: verifiedPrice * 100, // in paise
              currency: "INR",
              description: `Unlimited access to Toolzy Pro features at ₹${verifiedPrice}/mo`,
            },
          });
          planId = newPlan.id;
        }
      } catch (planError) {
        console.error("Error managing Razorpay plans:", planError);
        return NextResponse.json(
          { error: "Failed to configure subscription plan" },
          { status: 500 }
        );
      }
    }

    // Now create the subscription
    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      total_count: 60, // 5 years subscription
      quantity: 1,
      customer_notify: 1,
      notes: {
        userId: user.uid,
      },
    });

    return NextResponse.json({
      subscriptionId: subscription.id,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error: unknown) {
    console.error("Failed to create subscription:", error);
    const message = error instanceof Error ? error.message : "Failed to create subscription";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
export const dynamic = "force-dynamic";
