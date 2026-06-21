/**
 * Utilities to manage unique anonymous user tracking.
 * Handled fallback-safely for Next.js SSR and client execution.
 */

export function generateAnonymousId(): string {
  if (typeof window === "undefined") {
    return "";
  }
  const array = new Uint8Array(16);
  if (typeof window.crypto !== "undefined" && typeof window.crypto.getRandomValues === "function") {
    window.crypto.getRandomValues(array);
  } else {
    // Fallback if crypto is not available
    for (let i = 0; i < 16; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  
  // Format as hex string with "anon_" prefix
  const hex = Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
  const id = `anon_${hex}`;
  
  try {
    localStorage.setItem("toolzy_anonymous_id", id);
  } catch (e) {
    console.warn("localStorage not available for saving anonymous ID", e);
  }
  
  return id;
}

export function getAnonymousId(): string {
  if (typeof window === "undefined") {
    return "";
  }
  
  try {
    const existingId = localStorage.getItem("toolzy_anonymous_id");
    if (existingId && existingId.startsWith("anon_")) {
      return existingId;
    }
  } catch (e) {
    console.warn("localStorage read failed", e);
  }
  
  return generateAnonymousId();
}
