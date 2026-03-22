import { useCallback, useEffect, useState } from 'react';
import { appEncryptedStorage } from '../state/appEncryptedStorage';

export const SELECTED_QUOTE_CATEGORIES_STORAGE_KEY = 'ui:selected_quote_categories';

/** Read persisted categories (e.g. before a fetch) so Home always matches the drawer. */
export async function readSelectedCategoriesFromStorage(): Promise<string[]> {
  try {
    const raw = await appEncryptedStorage.getItem(SELECTED_QUOTE_CATEGORIES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed) && parsed.every((x) => typeof x === 'string')) {
      return parsed;
    }
  } catch {
    // ignore
  }
  return [];
}

export function usePersistedCategorySelection() {
  const [selected, setSelected] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const raw = await appEncryptedStorage.getItem(SELECTED_QUOTE_CATEGORIES_STORAGE_KEY);
        if (cancelled || !raw) return;
        const parsed = JSON.parse(raw) as unknown;
        if (Array.isArray(parsed) && parsed.every((x) => typeof x === 'string')) {
          setSelected(parsed);
        }
      } catch {
        // ignore
      } finally {
        if (!cancelled) setHydrated(true);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback((next: string[]) => {
    appEncryptedStorage.setItem(SELECTED_QUOTE_CATEGORIES_STORAGE_KEY, JSON.stringify(next)).catch(() => {});
  }, []);

  const toggle = useCallback(
    (category: string) => {
      setSelected((prev) => {
        const next = prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category];
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const clear = useCallback(() => {
    setSelected([]);
    persist([]);
  }, [persist]);

  return { selected, toggle, clear, hydrated };
}
