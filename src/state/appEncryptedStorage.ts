import EncryptedStorage from 'react-native-encrypted-storage';

/**
 * App persistence via Keychain (iOS) / Keystore (Android).
 * Replaces MMKV for compatibility with remote debugging and encrypted at rest.
 */
export const appEncryptedStorage = {
  async getItem(key: string): Promise<string | null> {
    try {
      return await EncryptedStorage.getItem(key);
    } catch {
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      await EncryptedStorage.setItem(key, value);
    } catch {
      // ignore
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await EncryptedStorage.removeItem(key);
    } catch {
      // ignore
    }
  },
};
