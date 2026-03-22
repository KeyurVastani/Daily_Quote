import { useCallback, useMemo, useSyncExternalStore } from 'react';
import type { Quote } from '../types/quote';
import {
  getFavoritesServerSnapshot,
  getFavoritesSnapshot,
  replaceFavorites,
  subscribeFavorites,
} from '../state/favoritesStore';

export function useFavorites() {
  const { favorites, hydrated } = useSyncExternalStore(
    subscribeFavorites,
    getFavoritesSnapshot,
    getFavoritesServerSnapshot,
  );

  const favoriteIds = useMemo(() => new Set(favorites.map((f) => f.id)), [favorites]);

  const isFavorited = useCallback(
    (quote: Quote) => {
      return favoriteIds.has(quote.id);
    },
    [favoriteIds],
  );

  const toggleFavorite = useCallback(
    async (quote: Quote) => {
      const existsIndex = favorites.findIndex((q) => q.id === quote.id);
      let next: Quote[];
      if (existsIndex >= 0) {
        next = favorites.filter((q) => q.id !== quote.id);
      } else {
        next = [...favorites, { ...quote, favoritedAt: Date.now() }];
      }

      await replaceFavorites(next);
      return { isFavorited: next.some((q) => q.id === quote.id), favorites: next };
    },
    [favorites],
  );

  const removeFavorite = useCallback(
    async (quoteId: string) => {
      const next = favorites.filter((q) => q.id !== quoteId);
      await replaceFavorites(next);
    },
    [favorites],
  );

  return {
    favorites,
    loading: !hydrated,
    isFavorited,
    toggleFavorite,
    removeFavorite,
  };
}
