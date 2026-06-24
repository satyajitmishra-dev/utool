import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { redis, getRateLimiter } from "./lib/redis";
import { SubscriptionTier } from "./types/schema";

// Decode Firebase session cookie (JWT) payload in edge-compatible way
function decodeSessionCookie(cookieValue: string) {
  try {
    const parts = cookieValue.split(".");
    if (parts.length !== 3) return null;
    
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode session cookie", error);
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retrieve Firebase session cookie (default named '__session' for Firebase Hosting routing)
  const sessionCookie = request.cookies.get("__session")?.value;

  // Define route classifications
  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/signup") || pathname.startsWith("/forgot-password");
  const isProtectedRoute = 
    pathname.startsWith("/dashboard") || 
    pathname.startsWith("/billing") || 
    pathname.startsWith("/history");
  const isApiRoute = pathname.startsWith("/api");
  const isApiToolRoute = pathname.startsWith("/api/tools");


  // Decode user identity if cookie is present
  const tokenPayload = sessionCookie ? decodeSessionCookie(sessionCookie) : null;
  const userId = tokenPayload?.user_id || tokenPayload?.sub;
  const isSessionValid = !!userId && (tokenPayload.exp * 1000 > Date.now());

  // 1. Route Protection for Authenticated Views
  if (isProtectedRoute && !isSessionValid) {
    const currentPath = request.nextUrl.pathname + request.nextUrl.search;
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", currentPath);
    const response = NextResponse.redirect(loginUrl);
    if (sessionCookie) {
      response.cookies.delete("__session");
    }
    return response;
  }

  // 2. Prevent logged in users from hitting auth routes
  if (isAuthRoute && isSessionValid) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 3. API Protection & Rate Limiting
  if (isApiRoute) {
    // Session Cookie check for Tool API routes
    if (isApiToolRoute && !isSessionValid) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized. Please log in." }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Apply Rate Limiting to Tool APIs using Upstash Redis
    if (isApiToolRoute && userId) {
      try {
        // Query Redis for cached user subscription tier (sync'd upon login/purchase)
        // Default to 'free' if not found
        const tier = (await redis.get<SubscriptionTier>(`user:tier:${userId}`)) || "free";
        
        const limiter = getRateLimiter(tier);
        const { success, limit, reset, remaining } = await limiter.limit(`rate:${userId}`);

        const headers = {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        };

        if (!success) {
          return new NextResponse(
            JSON.stringify({
              error: "Too Many Requests",
              message: `Rate limit exceeded. Your tier (${tier}) allows ${limit} requests per minute.`,
            }),
            { status: 429, headers: { ...headers, "Content-Type": "application/json" } }
          );
        }

        // Proceed and forward the headers to the dynamic endpoint
        const response = NextResponse.next();
        response.headers.set("X-RateLimit-Limit", limit.toString());
        response.headers.set("X-RateLimit-Remaining", remaining.toString());
        response.headers.set("X-RateLimit-Reset", reset.toString());
        return response;
      } catch (error) {
        console.error("Proxy rate limiter exception", error);
        // Fail-safe: allow request in case Redis is down
        return NextResponse.next();
      }
    }
  }

  return NextResponse.next();
}

// Route match configuration
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/billing/:path*",
    "/history/:path*",
    "/premium-tools/:path*",
    "/tools/:path*",
    "/pdf-tools/:path*",
    "/qr-generator/:path*",
    "/url-shortener/:path*",
    "/resume-builder/:path*",
    "/login",
    "/signup",
    "/forgot-password",
    "/api/tools/:path*",
  ],
};
