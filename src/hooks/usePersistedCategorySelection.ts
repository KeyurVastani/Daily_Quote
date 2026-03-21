import { useCallback, useEffect, useState } from 'react';
import { mmkv } from '../state/mmkv';

const STORAGE_KEY = 'ui:selected_quote_categories';

export function usePersistedCategorySelection() {
  const [selected, setSelected] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const raw = mmkv.getString(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as unknown;
        if (Array.isArray(parsed) && parsed.every((x) => typeof x === 'string')) {
          setSelected(parsed);
        }
      } catch {
        // ignore
      }
    }
    setHydrated(true);
  }, []);

  const persist = useCallback((next: string[]) => {
    mmkv.set(STORAGE_KEY, JSON.stringify(next));
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
