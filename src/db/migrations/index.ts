import { migration0001 } from './0001_init';

export type Migration = {
  /** Nomor versi skema setelah migrasi ini, disimpan di PRAGMA user_version. */
  version: number;
  sql: string;
};

/** Urut naik. Jangan pernah mengubah migrasi yang sudah dirilis, selalu tambah yang baru. */
export const migrations: Migration[] = [{ version: 1, sql: migration0001 }];
