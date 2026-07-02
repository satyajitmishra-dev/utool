export interface HistoryItem {
  id: string;
  timestamp: number;
  inputValue: string;
  outputValue: string;
  fromUnit: string;
  toUnit: string;
  fromSymbol?: string;
  toSymbol?: string;
}

const HISTORY_KEY_PREFIX = 'utool_conv_hist_';

export function getHistory(slug: string): HistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`${HISTORY_KEY_PREFIX}${slug}`);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error(`Failed to read history for ${slug}:`, err);
    return [];
  }
}

export function saveHistory(slug: string, items: HistoryItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${HISTORY_KEY_PREFIX}${slug}`, JSON.stringify(items));
  } catch (err) {
    console.error(`Failed to save history for ${slug}:`, err);
  }
}

export function addHistoryItem(slug: string, item: Omit<HistoryItem, 'id' | 'timestamp'>): HistoryItem[] {
  const history = getHistory(slug);
  const newItem: HistoryItem = {
    ...item,
    id: `hist-${Math.random().toString(36).substring(2, 11)}-${Date.now()}`,
    timestamp: Date.now(),
  };

  // Prepend and cap at 50 items
  const updated = [newItem, ...history].slice(0, 50);
  saveHistory(slug, updated);
  return updated;
}

export function deleteHistoryItem(slug: string, id: string): HistoryItem[] {
  const history = getHistory(slug);
  const updated = history.filter((item) => item.id !== id);
  saveHistory(slug, updated);
  return updated;
}

export function clearHistory(slug: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(`${HISTORY_KEY_PREFIX}${slug}`);
  } catch (err) {
    console.error(`Failed to clear history for ${slug}:`, err);
  }
}
