import { NextRequest, NextResponse } from "next/server";
import { requireProServer } from "@/lib/pro-server";

export async function POST(request: NextRequest) {
  try {
    // Secure authorization assertion
    await requireProServer();

    // Core functionality goes here (mocked for demo/verification)
    return NextResponse.json({
      status: "success",
      message: "AI Image generated successfully (mock response)",
      imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60",
    });
  } catch (error: any) {
    console.error("[API Generate Image] Authorization failed:", error);
    
    // Distinguish between 401 Unauthorized and 403 Forbidden
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }
    
    return NextResponse.json(
      { error: "Pro subscription required" },
      { status: 403 }
    );
  }
}

export const dynamic = "force-dynamic";
