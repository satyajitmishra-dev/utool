import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * POST /api/auth/logout
 * Destroys session cookie on logout.
 */
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("__session");
    return NextResponse.json({ status: "success" });
  } catch (error: unknown) {
    console.error("Session destruction endpoint error", error);
    return NextResponse.json({ error: "Failed to destroy session" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
