export interface FavoriteItem {
  id: string;
  fromUnit: string;
  toUnit: string;
  fromSymbol?: string;
  toSymbol?: string;
}

const FAVORITES_KEY_PREFIX = 'utool_conv_favs_';

export function getFavorites(slug: string): FavoriteItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`${FAVORITES_KEY_PREFIX}${slug}`);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error(`Failed to read favorites for ${slug}:`, err);
    return [];
  }
}

export function saveFavorites(slug: string, items: FavoriteItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${FAVORITES_KEY_PREFIX}${slug}`, JSON.stringify(items));
  } catch (err) {
    console.error(`Failed to save favorites for ${slug}:`, err);
  }
}

export function toggleFavoriteItem(slug: string, item: Omit<FavoriteItem, 'id'>): { items: FavoriteItem[]; isFav: boolean } {
  const favorites = getFavorites(slug);
  const existingIdx = favorites.findIndex(
    (f) => f.fromUnit === item.fromUnit && f.toUnit === item.toUnit
  );

  let updated: FavoriteItem[];
  let isFav = false;

  if (existingIdx > -1) {
    // Remove
    updated = favorites.filter((_, idx) => idx !== existingIdx);
  } else {
    // Add
    const newItem: FavoriteItem = {
      ...item,
      id: `fav-${Math.random().toString(36).substring(2, 11)}-${Date.now()}`,
    };
    updated = [newItem, ...favorites];
    isFav = true;
  }

  saveFavorites(slug, updated);
  return { items: updated, isFav };
}

export function isFavorite(slug: string, fromUnit: string, toUnit: string): boolean {
  const favorites = getFavorites(slug);
  return favorites.some((f) => f.fromUnit === fromUnit && f.toUnit === toUnit);
}
