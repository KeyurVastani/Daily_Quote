import { QUOTES } from '../constants/quotes';
import type { Quote } from '../types/quote';
import { dateToKey } from '../utils/date';
import { fetchQuoteOfTheDayFromApi } from '../api/quotesApi';
import { mmkv } from '../state/mmkv';

const DAILY_QUOTE_STORAGE_KEY_PREFIX = 'daily_quotes:quote_of_the_day:';

function hashString(input: string): number {
  // Simple deterministic hash for stable "daily quote" selection.
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const charCode = input.charCodeAt(i);
    // Avoid bitwise operators to keep ESLint happy.
    hash = (hash * 31 + charCode) % 2147483647;
  }
  return hash;
}

function getFallbackDailyQuote(date: Date): Quote {
  const key = dateToKey(date);
  const idx = Math.abs(hashString(key)) % QUOTES.length;
  const base = QUOTES[idx];
  return { ...base, id: `daily:${key}` };
}

export async function getDailyQuote(date: Date = new Date()): Promise<Quote> {
  const key = dateToKey(date);
  const storageKey = `${DAILY_QUOTE_STORAGE_KEY_PREFIX}${key}`;

  const cached = mmkv.getString(storageKey);
  if (cached) {
    try {
      return JSON.parse(cached) as Quote;
    } catch {
      // Fall through to refetch.
    }
  }

  try {
    const apiQuote = await fetchQuoteOfTheDayFromApi();
    const quote: Quote = {
      id: `daily:${key}`,
      text: apiQuote.quote,
      author: apiQuote.author,
      work: apiQuote.work,
      categories: apiQuote.categories,
    };

    mmkv.set(storageKey, JSON.stringify(quote));
    return quote;
  } catch {
    const fallback = getFallbackDailyQuote(date);
    mmkv.set(storageKey, JSON.stringify(fallback));
    return fallback;
  }
}

