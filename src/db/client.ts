import type { SQLiteDatabase } from 'expo-sqlite';

import { migrations } from './migrations';

export const DATABASE_NAME = 'artamu.db';

/** Dipanggil SQLiteProvider saat aplikasi dibuka. */
export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  await db.execAsync('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');

  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  const current = row?.user_version ?? 0;
  const pending = migrations.filter((m) => m.version > current);
  if (pending.length === 0) return;

  await db.withExclusiveTransactionAsync(async (tx) => {
    for (const m of pending) {
      await tx.execAsync(m.sql);
      await tx.execAsync(`PRAGMA user_version = ${m.version}`);
    }
  });
}
