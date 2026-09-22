export type Migration = {
  /** Nomor versi skema setelah migrasi ini, disimpan di PRAGMA user_version. */
  version: number;
  sql: string;
};

/**
 * Urut naik. Jangan pernah mengubah migrasi yang sudah dirilis, selalu tambah yang baru.
 * Skema versi 1 masih di docs/database/0001_init.sql dan belum dipindahkan ke sini.
 */
export const migrations: Migration[] = [];
