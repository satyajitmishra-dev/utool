/**
 * Utility functions to format conversion output values.
 */

interface FormatOptions {
  precision?: number;         // Decimal points (0 - 12)
  useScientific?: boolean;    // Force scientific notation
  locale?: string;            // Locale configuration (defaults to user browser locale)
}

/**
 * Formats a raw number into a highly-readable localized string.
 */
export function formatValue(value: number, options: FormatOptions = {}): string {
  if (value === 0) return '0';

  const precision = options.precision !== undefined ? options.precision : 6;
  const locale = options.locale || 'en-US';

  // 1. Force scientific notation if requested, or if number is extremely large/small
  const absVal = Math.abs(value);
  if (options.useScientific || absVal >= 1e12 || (absVal < 1e-4 && absVal > 0)) {
    return value.toExponential(Math.min(precision, 8));
  }

  // 2. Round according to specified decimal points
  const rounded = Number(value.toFixed(precision));

  // 3. Format with locale thousands separator
  try {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: precision,
    }).format(rounded);
  } catch {
    return rounded.toString();
  }
}

/**
 * Returns the exact string representation of a value without rounding.
 */
export function formatExact(value: number): string {
  // If scientific notation is present in the standard string representation, display it, otherwise return standard string
  const str = value.toString();
  if (str.includes('e') || str.includes('E')) {
    // Convert to long float representation if safe
    return value.toFixed(20).replace(/\.?0+$/, '');
  }
  return str;
}
