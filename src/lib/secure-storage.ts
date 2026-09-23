import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * Penyimpanan aman untuk hash PIN dan waktu kunci PIN. Di ponsel memakai expo-secure-store
 * (Keystore Android). expo-secure-store tidak ada di web, jadi versi web (hanya untuk
 * pengembangan) memakai localStorage.
 */
const web = Platform.OS === 'web';

export async function secureGet(key: string): Promise<string | null> {
  if (web) return globalThis.localStorage?.getItem(key) ?? null;
  return SecureStore.getItemAsync(key);
}

export async function secureSet(key: string, value: string) {
  if (web) return globalThis.localStorage?.setItem(key, value);
  await SecureStore.setItemAsync(key, value);
}

export async function secureDelete(key: string) {
  if (web) return globalThis.localStorage?.removeItem(key);
  await SecureStore.deleteItemAsync(key);
}
