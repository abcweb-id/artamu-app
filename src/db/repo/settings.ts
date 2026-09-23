import type { SQLiteDatabase } from 'expo-sqlite';

import { nowISO } from '@/lib/date';

/** Semua baris tabel settings, nilainya sudah di-parse dari JSON. */
export async function loadSettings(db: SQLiteDatabase) {
  const rows = await db.getAllAsync<{ key: string; value: string }>(
    'SELECT key, value FROM settings',
  );
  return Object.fromEntries(rows.map((r) => [r.key, JSON.parse(r.value) as unknown]));
}

export async function saveSettings(db: SQLiteDatabase, values: Record<string, unknown>) {
  const now = nowISO();
  for (const [key, value] of Object.entries(values)) {
    await db.runAsync(
      `INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
      key,
      JSON.stringify(value),
      now,
    );
  }
}
