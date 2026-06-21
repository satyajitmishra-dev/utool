/**
 * Utility to detect the user's localized currency and format pricing.
 */

export type CurrencyCode = "INR" | "USD" | "EUR" | "GBP";

/**
 * Automatically detects the currency based on timezone and browser language locale.
 */
export function detectCurrency(): CurrencyCode {
  if (typeof window === "undefined") {
    return "USD";
  }

  // 1. Timezone-based detection (most reliable for region)
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz) {
      if (tz.includes("Kolkata") || tz.includes("Calcutta") || tz.startsWith("Asia/Kolkata")) {
        return "INR";
      }
      if (tz.includes("London") || tz.startsWith("Europe/London")) {
        return "GBP";
      }

      // European Union countries zones
      const eurZones = [
        "Europe/Paris", "Europe/Berlin", "Europe/Rome", "Europe/Madrid", 
        "Europe/Amsterdam", "Europe/Brussels", "Europe/Vienna", "Europe/Dublin", 
        "Europe/Lisbon", "Europe/Athens", "Europe/Helsinki", "Europe/Copenhagen",
        "Europe/Oslo", "Europe/Stockholm", "Europe/Warsaw", "Europe/Prague", 
        "Europe/Budapest", "Europe/Bucharest"
      ];
      if (eurZones.some((zone) => tz.includes(zone) || zone === tz)) {
        return "EUR";
      }
    }
  } catch (e) {
    console.warn("Timezone-based currency detection failed:", e);
  }

  // 2. Locale/Language-based detection fallback
  try {
    const locales = navigator.languages || [navigator.language];
    for (const locale of locales) {
      if (locale.endsWith("-IN") || locale.startsWith("hi") || locale.startsWith("ta") || locale.startsWith("te") || locale.startsWith("ml")) {
        return "INR";
      }
      if (locale.endsWith("-GB")) {
        return "GBP";
      }

      // European Union language prefix codes
      const eurLocales = [
        "de-", "fr-", "es-", "it-", "nl-", "pt-", "el-", "fi-", 
        "sv-", "da-", "no-", "pl-", "cs-", "hu-", "ro-", "sk-", 
        "bg-", "sl-", "et-", "lt-", "lv-", "mt-", "hr-"
      ];
      if (eurLocales.some((prefix) => locale.toLowerCase().startsWith(prefix))) {
        return "EUR";
      }
    }
  } catch (e) {
    console.warn("Locale-based currency detection failed:", e);
  }

  // Default to USD for USA and other global regions
  return "USD";
}

/**
 * Formats a given number into the currency display string.
 */
export function formatPrice(amount: number, currency: CurrencyCode): string {
  const locale = 
    currency === "INR" ? "en-IN" : 
    currency === "GBP" ? "en-GB" : 
    currency === "EUR" ? "de-DE" : "en-US";

  try {
    const formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    });
    return formatter.format(amount);
  } catch (e) {
    // Basic fallback string formatting
    const symbols = { INR: "₹", USD: "$", EUR: "€", GBP: "£" };
    return `${symbols[currency] || "$"}${amount}`;
  }
}
