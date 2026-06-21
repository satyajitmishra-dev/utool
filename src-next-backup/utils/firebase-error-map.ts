/**
 * Helper to map Firebase Auth error codes/messages to human-friendly, clean error messages.
 * Never exposes raw technical Firebase strings (e.g. auth/wrong-password) to users.
 */
export function mapFirebaseError(error: any): string {
  if (!error) return "Something went wrong. Please try again.";

  // Always log the raw error in development so devtools shows the real cause
  if (process.env.NODE_ENV !== "production") {
    console.error("[Firebase Auth Error]", error);
  }

  // Extract Firebase error code
  let code = "";
  if (typeof error === "string") {
    code = error;
  } else if (error.code && typeof error.code === "string") {
    code = error.code;
  } else if (error.message && typeof error.message === "string") {
    // Check if the error code is inside the error message string (e.g. FirebaseError: Firebase: Error (auth/wrong-password).)
    const match = error.message.match(/\((auth\/[a-z0-9-]+)\)/i);
    if (match && match[1]) {
      code = match[1];
    } else {
      code = error.message;
    }
  }

  // Normalize code
  const normalizedCode = code.toLowerCase().trim();

  switch (normalizedCode) {
    case "auth/wrong-password":
    case "auth/invalid-credential": // Modern Firebase SDK (v10+) error for wrong email/password
      return "Incorrect email or password. Please try again.";
    case "auth/user-not-found":
      return "No account found with this email.";
    case "auth/email-already-in-use":
      return "This email is already registered.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Your password is too weak. Use at least 6 characters.";
    case "auth/network-request-failed":
      return "Check your internet connection and try again.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please wait a moment and try again.";
    case "auth/user-disabled":
      return "This account has been disabled. Please contact support.";
    case "auth/operation-not-allowed":
      return "Email/password sign-in is not enabled. Please contact support.";
    case "auth/configuration-not-found":
    case "auth/invalid-api-key":
    case "auth/app-not-authorized":
      return "Authentication configuration error. Please contact support.";
    case "auth/popup-blocked":
      return "The sign-in popup was blocked. Please allow popups for this site.";
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
      return "Sign-in was cancelled. Please try again.";
    case "auth/invalid-continue-uri":
    case "auth/unauthorized-continue-uri":
      return "Google sign-in is not configured for this domain. Please contact support.";
    case "auth/account-exists-with-different-credential":
      return "An account already exists with this email using a different sign-in method.";
    case "auth/requires-recent-login":
      return "Please sign in again to continue.";
    case "auth/expired-action-code":
    case "auth/invalid-action-code":
      return "This link has expired or is invalid. Please request a new one.";
    default:
      // Handle raw Firebase REST API error messages (e.g. INVALID_LOGIN_CREDENTIALS)
      if (normalizedCode.includes("invalid_login_credentials") || normalizedCode.includes("invalid_password")) {
        return "Incorrect email or password. Please try again.";
      }
      if (normalizedCode.includes("email_not_found") || normalizedCode.includes("user_not_found")) {
        return "No account found with this email.";
      }
      if (normalizedCode.includes("too_many_attempts_try_later") || normalizedCode.includes("too_many_requests")) {
        return "Too many failed attempts. Please wait a moment and try again.";
      }
      if (normalizedCode.includes("operation_not_allowed")) {
        return "Email/password sign-in is not enabled. Please contact support.";
      }
      // Generic partial matches
      if (normalizedCode.includes("network") || normalizedCode.includes("offline")) {
        return "Check your internet connection and try again.";
      }
      if (normalizedCode.includes("password") && normalizedCode.includes("incorrect")) {
        return "Incorrect email or password. Please try again.";
      }
      if (normalizedCode.includes("credential") || normalizedCode.includes("invalid")) {
        return "Incorrect email or password. Please try again.";
      }
      return "Something went wrong. Please try again.";
  }
}
