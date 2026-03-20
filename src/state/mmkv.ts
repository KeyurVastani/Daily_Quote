import { MMKV } from 'react-native-mmkv';

type MMKVLike = {
  getString: (key: string) => string | undefined;
  set: (key: string, value: string) => void;
};

// Keep a single MMKV instance for the whole app.
// If the native module isn't ready (first build / not linked yet),
// avoid crashing the app and fall back to in-memory storage.
let native: MMKV | null = null;
const memory = new Map<string, string>();

function getNative(): MMKV | null {
  if (native) return native;
  try {
    native = new MMKV({ id: 'daily_quotes' });
    return native;
  } catch (e) {
    console.warn('[mmkv] init failed; using memory fallback', e);
    native = null;
    return null;
  }
}

export const mmkv: MMKVLike = {
  getString(key) {
    const inst = getNative();
    return inst ? inst.getString(key) : memory.get(key);
  },
  set(key, value) {
    const inst = getNative();
    if (inst) inst.set(key, value);
    memory.set(key, value);
  },
};

