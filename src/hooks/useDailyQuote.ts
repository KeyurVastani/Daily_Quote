import { useEffect, useState } from 'react';
import type { Quote } from '../types/quote';
import { getDailyQuote } from '../services/quoteService';

export function useDailyQuote() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        const q = await getDailyQuote(new Date());
        if (mounted) {
          setQuote(q);
          setError(null);
        }
      } catch {
        if (mounted) setError('Failed to load today’s quote.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  return { quote, loading, error };
}

