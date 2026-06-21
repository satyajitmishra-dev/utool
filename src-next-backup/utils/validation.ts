/**
 * Client-side credential validation helpers.
 * Returns a human-friendly string describing the error if invalid, or null if valid.
 */

export function validateEmail(email: string): string | null {
  if (!email || email.trim() === "") {
    return "Please enter your email.";
  }

  // Standard email validation pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address.";
  }

  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) {
    return "Please enter your password.";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters.";
  }

  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return "Add at least one uppercase letter.";
  }

  // Check for at least one number
  if (!/[0-9]/.test(password)) {
    return "Add at least one number.";
  }

  // Check for at least one special character
  const specialCharRegex = /[^a-zA-Z0-9]/;
  if (!specialCharRegex.test(password)) {
    return "Add at least one special character.";
  }

  return null;
}

/**
 * Lightweight password validation for login only.
 * Only checks required + minimum length.
 * Does NOT enforce uppercase, number, or special character
 * because users may have older passwords.
 */
export function validateLoginPassword(password: string): string | null {
  if (!password) {
    return "Please enter your password.";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters.";
  }

  return null;
}
