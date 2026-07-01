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

// Fallback user fetch from Firestore REST API (Edge-compatible)
async function fetchUserFromFirestore(userId: string) {
  try {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!projectId || !apiKey) {
      console.warn("Missing Firebase env variables for Edge REST API fallback.");
      return null;
    }
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${userId}?key=${apiKey}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(3000) }); // 3s timeout
    if (res.ok) {
      const data = await res.json();
      const fields = data.fields || {};
      const subscriptionTier = fields.subscriptionTier?.stringValue || "free";
      const emailVerified = fields.emailVerified?.booleanValue || false;
      return { subscriptionTier, emailVerified };
    }
  } catch (error) {
    console.error("Firestore REST API fallback error:", error);
  }
  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // Handle media workspace subdomains
  const isMediaWorkspace = 
    hostname === 'mediawork.utool.in' || 
    hostname === 'media.utool.in' || 
    hostname.startsWith('mediawork.') || 
    hostname.startsWith('media.');

  if (isMediaWorkspace && pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/media';
    return NextResponse.rewrite(url);
  }

  // Retrieve Firebase session cookie
  const sessionCookie = request.cookies.get("__session")?.value;

  // Route classifications
  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/signup") || pathname.startsWith("/forgot-password");
  const isProtectedRoute = 
    pathname.startsWith("/dashboard") || 
    pathname.startsWith("/billing") || 
    pathname.startsWith("/history");
  
  // Premium tools routes
  const isPremiumToolRoute = 
    pathname.startsWith("/premium-tools") ||
    pathname.startsWith("/tools/pdf-ocr") ||
    pathname.startsWith("/tools/image-resize") ||
    pathname.startsWith("/tools/bg-remover") ||
    pathname.startsWith("/tools/ai-writer") ||
    pathname.startsWith("/tools/sign-pdf");

  const isApiRoute = pathname.startsWith("/api");
  const isApiToolRoute = pathname.startsWith("/api/tools");

  // Decode user identity if cookie is present
  const tokenPayload = sessionCookie ? decodeSessionCookie(sessionCookie) : null;
  const userId = tokenPayload?.user_id || tokenPayload?.sub;
  const isSessionValid = !!userId && (tokenPayload.exp * 1000 > Date.now());

  // Redirect authenticated users trying to access the landing page to the dashboard
  if (pathname === "/" && isSessionValid) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 1. Route Protection for Authenticated Views & Premium Tools
  if ((isProtectedRoute || isPremiumToolRoute) && !isSessionValid) {
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

  // 3. Subscription & Verification Checks (only for logged in users)
  if (isSessionValid && userId) {
    // Determine email verified status from JWT token claim first
    let emailVerified = tokenPayload.email_verified === true;

    // Fetch subscription tier from Upstash Redis (with Firestore fallback)
    let tier: SubscriptionTier = "free";
    try {
      const cachedTier = await redis.get<SubscriptionTier>(`user:tier:${userId}`);
      if (cachedTier) {
        tier = cachedTier;
      } else {
        // Fallback to Firestore check
        const dbUser = await fetchUserFromFirestore(userId);
        if (dbUser) {
          tier = dbUser.subscriptionTier as SubscriptionTier;
          emailVerified = emailVerified || dbUser.emailVerified;
          
          // Cache in Redis
          await redis.set(`user:tier:${userId}`, tier, { ex: 60 * 60 * 24 });
        }
      }
    } catch (redisError) {
      console.warn("Redis lookup failed in proxy, falling back to Firestore REST:", redisError);
      const dbUser = await fetchUserFromFirestore(userId);
      if (dbUser) {
        tier = dbUser.subscriptionTier as SubscriptionTier;
        emailVerified = emailVerified || dbUser.emailVerified;
      }
    }

    // A. Verify email verification status for premium tools or actions
    if (isPremiumToolRoute && !emailVerified) {
      console.log("[Analytics] premium_access_blocked (unverified email)", { userId, pathname });
      return NextResponse.redirect(new URL("/dashboard?verify=true", request.url));
    }

    // B. Check subscription tier for premium tools
    if (isPremiumToolRoute) {
      const isPro = tier === "pro" || tier === "enterprise";
      if (!isPro) {
        console.log("[Analytics] premium_access_blocked (non-pro user)", { userId, pathname });
        return NextResponse.redirect(new URL("/pricing?source=middleware", request.url));
      }
    }

    // C. API route verification for premium tools
    if (isApiToolRoute) {
      if (!emailVerified) {
        return new NextResponse(
          JSON.stringify({ error: "Email verification required." }),
          { status: 403, headers: { "Content-Type": "application/json" } }
        );
      }

      const isPremiumApi = pathname.startsWith("/api/tools/ocr") ||
                           pathname.startsWith("/api/tools/bg-remover") ||
                           pathname.startsWith("/api/tools/ai-writer");
      if (isPremiumApi && tier === "free") {
        return new NextResponse(
          JSON.stringify({ error: "Pro subscription required." }),
          { status: 403, headers: { "Content-Type": "application/json" } }
        );
      }

      try {
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

        const response = NextResponse.next();
        response.headers.set("X-RateLimit-Limit", limit.toString());
        response.headers.set("X-RateLimit-Remaining", remaining.toString());
        response.headers.set("X-RateLimit-Reset", reset.toString());
        return response;
      } catch (error) {
        console.error("Proxy rate limiter exception", error);
        return NextResponse.next();
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
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
