import type { SQLiteDatabase } from 'expo-sqlite';

import { migrations } from './migrations';

export const DATABASE_NAME = 'artamu.db';

/**
 * PRAGMA di berkas migrasi (journal_mode, foreign_keys, user_version) dijalankan di sini,
 * bukan di dalam transaksi: SQLite menolak mengganti journal_mode di dalam transaksi.
 */
const stripPragmas = (sql: string) =>
  sql
    .split('\n')
    .filter((line) => !/^\s*PRAGMA\b/i.test(line))
    .join('\n');

/** Dipanggil SQLiteProvider saat aplikasi dibuka. Layar menunggu sampai selesai. */
export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  await db.execAsync('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');

  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  const current = row?.user_version ?? 0;
  const pending = migrations.filter((m) => m.version > current);
  if (pending.length === 0) return;

  // withTransactionAsync, bukan withExclusiveTransactionAsync: yang eksklusif tidak ada di web.
  // Aman karena SQLiteProvider menunggu migrasi selesai sebelum layar mana pun membaca database.
  await db.withTransactionAsync(async () => {
    for (const m of pending) {
      await db.execAsync(stripPragmas(m.sql));
      await db.execAsync(`PRAGMA user_version = ${m.version}`);
    }
  });
}
