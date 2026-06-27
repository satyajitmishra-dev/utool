import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const cookieStore = await cookies();
  cookieStore.set("utool_referred_by", code, {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return NextResponse.redirect(new URL("/", request.url));
}
