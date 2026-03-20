import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Quote } from '../types/quote';
import { loadFavorites, persistFavorites } from '../state/favoritesStore';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        const data = await loadFavorites();
        if (mounted) setFavorites(data);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const favoriteIds = useMemo(() => new Set(favorites.map((f) => f.id)), [favorites]);

  const isFavorited = useCallback(
    (quote: Quote) => {
      return favoriteIds.has(quote.id);
    },
    [favoriteIds]
  );

  const toggleFavorite = useCallback(
    async (quote: Quote) => {
      const current = favorites;
      const existsIndex = current.findIndex((q) => q.id === quote.id);

      let next: Quote[];
      if (existsIndex >= 0) {
        next = current.filter((q) => q.id !== quote.id);
      } else {
        next = [...current, { ...quote, favoritedAt: Date.now() }];
      }

      setFavorites(next);
      await persistFavorites(next);
      return { isFavorited: next.some((q) => q.id === quote.id), favorites: next };
    },
    [favorites]
  );

  const removeFavorite = useCallback(
    async (quoteId: string) => {
      const next = favorites.filter((q) => q.id !== quoteId);
      setFavorites(next);
      await persistFavorites(next);
    },
    [favorites]
  );

  return {
    favorites,
    loading,
    isFavorited,
    toggleFavorite,
    removeFavorite,
  };
}

