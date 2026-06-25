export function safeRedirect(path: string | null | undefined, fallback = "/dashboard"): string {
  if (!path || typeof path !== "string") {
    return fallback;
  }

  // Ensure path starts with a single slash to prevent open redirects (e.g. //evil.com)
  if (path.startsWith("/") && !path.startsWith("//")) {
    return path;
  }

  return fallback;
}
