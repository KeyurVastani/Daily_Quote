import type { Quote } from '../types/quote';
import { appEncryptedStorage } from './appEncryptedStorage';

const FAVORITES_STORAGE_KEY = 'daily_quotes:favorites';

function normalizeFavorites(parsed: unknown): Quote[] {
  if (!Array.isArray(parsed)) return [];
  return parsed.filter(Boolean) as Quote[];
}

async function readFromStorage(): Promise<Quote[]> {
  const raw = await appEncryptedStorage.getItem(FAVORITES_STORAGE_KEY);
  if (!raw) return [];
  try {
    return normalizeFavorites(JSON.parse(raw));
  } catch {
    return [];
  }
}

async function writeToStorage(favorites: Quote[]): Promise<void> {
  await appEncryptedStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
}

/** Shared snapshot so Home + Favorites stay in sync (single source of truth). */
export type FavoritesSnapshot = {
  favorites: Quote[];
  hydrated: boolean;
};

let snapshot: FavoritesSnapshot = {
  favorites: [],
  hydrated: false,
};

/** Stable reference for useSyncExternalStore server snapshot (RN / tests). */
const SERVER_SNAPSHOT: FavoritesSnapshot = { favorites: [], hydrated: false };

const listeners = new Set<() => void>();
let initPromise: Promise<void> | null = null;

function emit() {
  listeners.forEach((l) => l());
}

export function subscribeFavorites(listener: () => void) {
  listeners.add(listener);
  ensureInitialized().catch(() => {});
  return () => listeners.delete(listener);
}

export function getFavoritesSnapshot(): FavoritesSnapshot {
  return snapshot;
}

export function getFavoritesServerSnapshot(): FavoritesSnapshot {
  return SERVER_SNAPSHOT;
}

async function ensureInitialized(): Promise<void> {
  if (snapshot.hydrated) return;
  if (initPromise) return initPromise;
  initPromise = (async () => {
    try {
      const data = await readFromStorage();
      snapshot = { favorites: data, hydrated: true };
    } catch {
      snapshot = { favorites: [], hydrated: true };
    }
    emit();
  })();
  return initPromise;
}

/** Replace list, persist, notify all subscribers (Home, Favorites, etc.). */
export async function replaceFavorites(favorites: Quote[]): Promise<void> {
  await ensureInitialized();
  await writeToStorage(favorites);
  snapshot = { favorites, hydrated: true };
  emit();
}

/** @deprecated Prefer replaceFavorites — kept for any direct callers */
export async function loadFavorites(): Promise<Quote[]> {
  await ensureInitialized();
  return snapshot.favorites;
}

/** @deprecated Prefer replaceFavorites — kept for any direct callers */
export async function persistFavorites(favorites: Quote[]): Promise<void> {
  await replaceFavorites(favorites);
}
