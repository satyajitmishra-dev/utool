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

/**
 * Mappings to convert dynamic INR prices configured from Remote Config to standard equivalents.
 * US: $19 -> $9, India: ₹599 -> ₹299, EU: €18 -> €8, UK: £15 -> £7
 * Enterprise: ₹2999 -> ₹1499, US: $99 -> $49, EU: €89 -> €45, UK: £79 -> £39
 */
export function convertInrToCurrency(inrAmount: number, currency: CurrencyCode): number {
  if (currency === "INR") return inrAmount;

  if (currency === "USD") {
    if (inrAmount <= 350) return 9;     // Pro Discounted (299)
    if (inrAmount <= 700) return 19;    // Pro Original (599)
    if (inrAmount <= 1800) return 49;   // Enterprise Discounted (1499)
    if (inrAmount <= 3500) return 99;   // Enterprise Original (2999)
    return Math.round(inrAmount / 30);  // Dynamic fallback scaling
  }
  if (currency === "EUR") {
    if (inrAmount <= 350) return 8;     // Pro Discounted (299)
    if (inrAmount <= 700) return 18;    // Pro Original (599)
    if (inrAmount <= 1800) return 45;   // Enterprise Discounted (1499)
    if (inrAmount <= 3500) return 89;   // Enterprise Original (2999)
    return Math.round(inrAmount / 33);  // Dynamic fallback scaling
  }
  if (currency === "GBP") {
    if (inrAmount <= 350) return 7;     // Pro Discounted (299)
    if (inrAmount <= 700) return 15;    // Pro Original (599)
    if (inrAmount <= 1800) return 39;   // Enterprise Discounted (1499)
    if (inrAmount <= 3500) return 79;   // Enterprise Original (2999)
    return Math.round(inrAmount / 38);  // Dynamic fallback scaling
  }

  return inrAmount;
}
