import { CryptoDigestAlgorithm, digestStringAsync, randomUUID } from 'expo-crypto';

import { secureDelete, secureGet, secureSet } from './secure-storage';

const KEY_HASH = 'artamu.pin.hash';
const KEY_SALT = 'artamu.pin.salt';
const KEY_LOCKED_UNTIL = 'artamu.pin.lockedUntil';

/** PIN tidak pernah disimpan apa adanya: hanya SHA-256 dari salt acak ditambah PIN. */
const hash = (pin: string, salt: string) =>
  digestStringAsync(CryptoDigestAlgorithm.SHA256, `${salt}:${pin}`);

export async function savePin(pin: string) {
  const salt = randomUUID();
  await secureSet(KEY_SALT, salt);
  await secureSet(KEY_HASH, await hash(pin, salt));
}

export async function hasPin() {
  return (await secureGet(KEY_HASH)) !== null;
}

export async function checkPin(pin: string) {
  const [saved, salt] = await Promise.all([secureGet(KEY_HASH), secureGet(KEY_SALT)]);
  if (!saved || !salt) return false;
  return (await hash(pin, salt)) === saved;
}

/** Waktu (ms) sampai PIN boleh dicoba lagi setelah terlalu banyak salah. */
export async function loadPinLockedUntil() {
  const value = await secureGet(KEY_LOCKED_UNTIL);
  return value ? Number(value) : null;
}

export async function savePinLockedUntil(until: number | null) {
  if (until === null) await secureDelete(KEY_LOCKED_UNTIL);
  else await secureSet(KEY_LOCKED_UNTIL, String(until));
}

export async function clearPin() {
  await Promise.all([
    secureDelete(KEY_HASH),
    secureDelete(KEY_SALT),
    secureDelete(KEY_LOCKED_UNTIL),
  ]);
}
