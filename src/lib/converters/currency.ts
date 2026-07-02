/**
 * Currency Exchange Rates Module
 * Powered by Frankfurter API (free, open, no-key rate engine)
 */

export interface CurrencyDetails {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

export interface ExchangeRatesData {
  timestamp: number;
  date: string;
  base: string;
  rates: Record<string, number>;
}

// 30 Supported currencies by Frankfurter API with flags and symbols
export const CURRENCY_CATALOG: Record<string, CurrencyDetails> = {
  EUR: { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  USD: { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  JPY: { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  GBP: { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  AUD: { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  CAD: { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
  CHF: { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭' },
  CNY: { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
  HKD: { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰' },
  NZD: { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿' },
  SEK: { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪' },
  INR: { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  KRW: { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷' },
  MXN: { code: 'MXN', name: 'Mexican Peso', symbol: '$', flag: '🇲🇽' },
  SGD: { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
  BRL: { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' },
  NOK: { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴' },
  TRY: { code: 'TRY', name: 'Turkish Lira', symbol: '₺', flag: '🇹🇷' },
  ZAR: { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦' },
  IDR: { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', flag: '🇮🇩' },
  MYR: { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', flag: '🇲🇾' },
  PHP: { code: 'PHP', name: 'Philippine Peso', symbol: '₱', flag: '🇵🇭' },
  THB: { code: 'THB', name: 'Thai Baht', symbol: '฿', flag: '🇹🇭' },
  ILS: { code: 'ILS', name: 'Israeli New Shekel', symbol: '₪', flag: '🇮🇱' },
  DKK: { code: 'DKK', name: 'Danish Krone', symbol: 'kr', flag: '🇩🇰' },
  PLN: { code: 'PLN', name: 'Polish Zloty', symbol: 'zł', flag: '🇵🇱' },
  CZK: { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč', flag: '🇨🇿' },
  HUF: { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft', flag: '🇭🇺' },
  RON: { code: 'RON', name: 'Romanian Leu', symbol: 'lei', flag: '🇷🇴' },
  ISK: { code: 'ISK', name: 'Icelandic Króna', symbol: 'kr', flag: '🇮🇸' }
};

const RATES_CACHE_KEY = 'utool_cached_currency_rates';
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours cache lifetime

// Fallback rates relative to EUR if API is completely unavailable and no cache is present
const DEFAULT_FALLBACK_RATES: Record<string, number> = {
  EUR: 1.0,
  USD: 1.085,
  JPY: 172.50,
  GBP: 0.852,
  AUD: 1.631,
  CAD: 1.481,
  CHF: 0.975,
  CNY: 7.875,
  HKD: 8.472,
  NZD: 1.775,
  SEK: 11.450,
  INR: 90.520,
  KRW: 1495.0,
  MXN: 19.550,
  SGD: 1.465,
  BRL: 5.920,
  NOK: 11.550,
  TRY: 35.500,
  ZAR: 19.850,
  IDR: 17750.0,
  MYR: 5.120,
  PHP: 63.850,
  THB: 39.850,
  ILS: 4.020,
  DKK: 7.460,
  PLN: 4.310,
  CZK: 24.850,
  HUF: 390.50,
  RON: 4.970,
  ISK: 151.20
};

/**
 * Loads rates from local cache if present, otherwise returns empty or fallbacks.
 */
export function getCachedRates(): ExchangeRatesData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(RATES_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Saves fetched rates into local storage cache.
 */
function cacheRates(rates: Record<string, number>, date: string): ExchangeRatesData {
  const cacheData: ExchangeRatesData = {
    timestamp: Date.now(),
    date,
    base: 'EUR',
    rates: {
      ...rates,
      EUR: 1.0, // Force base rate
    },
  };
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(RATES_CACHE_KEY, JSON.stringify(cacheData));
    } catch (err) {
      console.warn('Failed to cache exchange rates locally:', err);
    }
  }
  return cacheData;
}

/**
 * Fetches latest exchange rates from API. Falls back to cache or default rates.
 * Returns rates and a boolean indicating if it uses cached values.
 */
export async function fetchExchangeRates(forceRefresh = false): Promise<{
  data: ExchangeRatesData;
  isCached: boolean;
  error?: string;
}> {
  const cache = getCachedRates();
  const now = Date.now();

  // Return cache if it is still fresh and refresh not forced
  if (cache && !forceRefresh && now - cache.timestamp < CACHE_TTL_MS) {
    return { data: cache, isCached: true };
  }

  try {
    // Frankfurter API allows fetching all rates with EUR base
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8-second timeout

    const res = await fetch('https://api.frankfurter.app/latest', {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Server returned status code ${res.status}`);
    }

    const json = await res.json();
    if (!json.rates) {
      throw new Error('API response does not contain exchange rates.');
    }

    const updatedData = cacheRates(json.rates, json.date);
    return { data: updatedData, isCached: false };
  } catch (err: any) {
    console.warn('Currency API fetch failed, falling back to local cache:', err.message);
    
    if (cache) {
      return {
        data: cache,
        isCached: true,
        error: `Could not fetch updated rates (${err.message}). Using last updated rate.`,
      };
    }

    // If no cache, use static defaults
    const fallbackData: ExchangeRatesData = {
      timestamp: Date.now(),
      date: new Date().toISOString().split('T')[0],
      base: 'EUR',
      rates: DEFAULT_FALLBACK_RATES,
    };
    return {
      data: fallbackData,
      isCached: true,
      error: `Network offline and no cache found. Using default standard rates.`,
    };
  }
}

/**
 * Converts a value between two currencies using EUR as a baseline.
 */
export function convertCurrency(
  value: number,
  fromCode: string,
  toCode: string,
  rates: Record<string, number>
): number {
  if (fromCode === toCode) return value;
  
  const fromRate = rates[fromCode];
  const toRate = rates[toCode];

  if (!fromRate || !toRate) {
    throw new Error(`Unsupported currency code pairing: ${fromCode} ⇄ ${toCode}`);
  }

  // Convert A -> EUR -> B
  const valueInEUR = value / fromRate;
  return valueInEUR * toRate;
}
