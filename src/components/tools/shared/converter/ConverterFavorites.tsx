import React from 'react';
import { Star, X, Bookmark } from 'lucide-react';
import { FavoriteItem } from '@/lib/converters/favorites';

interface ConverterFavoritesProps {
  favorites: FavoriteItem[];
  onSelectFavorite: (fav: FavoriteItem) => void;
  onRemoveFavorite: (fav: FavoriteItem) => void;
}

export function ConverterFavorites({
  favorites,
  onSelectFavorite,
  onRemoveFavorite,
}: ConverterFavoritesProps) {
  if (!favorites || favorites.length === 0) return null;

  return (
    <div className="space-y-3 text-left">
      <h4 className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5">
        <Bookmark className="h-3.5 w-3.5 text-primary" />
        <span>Pinned Favorites</span>
      </h4>
      
      <div className="flex flex-wrap gap-2">
        {favorites.map((fav) => (
          <div
            key={fav.id}
            className="inline-flex items-center gap-2 bg-primary/5 hover:bg-primary/10 border border-primary/20 hover:border-primary/30 rounded-xl px-3 py-1.5 text-xs transition-all shadow-xs cursor-pointer"
            onClick={() => onSelectFavorite(fav)}
          >
            <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
            <span className="font-semibold text-foreground">
              {fav.fromUnit} ⇄ {fav.toUnit}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveFavorite(fav);
              }}
              className="p-0.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground"
              title="Remove favorite"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
