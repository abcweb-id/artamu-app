import { randomUUID } from 'expo-crypto';

/** Kunci utama semua tabel: UUID yang dibuat di ponsel. */
export function newId() {
  return randomUUID();
}
