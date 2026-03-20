import type { Quote } from '../types/quote';
import { mmkv } from './mmkv';

const FAVORITES_STORAGE_KEY = 'daily_quotes:favorites';

function normalizeFavorites(parsed: unknown): Quote[] {
  if (!Array.isArray(parsed)) return [];
  return parsed.filter(Boolean) as Quote[];
}

export async function loadFavorites(): Promise<Quote[]> {
  const raw = mmkv.getString(FAVORITES_STORAGE_KEY);
  if (!raw) return [];
  try {
    return normalizeFavorites(JSON.parse(raw));
  } catch {
    return [];
  }
}

export async function persistFavorites(favorites: Quote[]): Promise<void> {
  mmkv.set(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
}

