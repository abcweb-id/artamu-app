import type { SQLiteDatabase } from 'expo-sqlite';

/** ID tetap kategori sistem dari data awal skema. */
export const SYSTEM_CATEGORY = {
  transfer: '00000000-0000-4000-8000-0000000000a1',
  adjustment: '00000000-0000-4000-8000-0000000000a2',
  debt: '00000000-0000-4000-8000-0000000000a3',
  opening: '00000000-0000-4000-8000-0000000000a4',
} as const;

export type CategoryRow = {
  id: string;
  parent_id: string | null;
  type: 'in' | 'out' | 'both';
  name: string;
  icon: string | null;
  color_bg: string | null;
  system_key: string | null;
};

/** Kategori yang bisa dipilih pengguna untuk satu jenis transaksi, urut sort_order. */
export function listCategories(db: SQLiteDatabase, type: 'in' | 'out') {
  return db.getAllAsync<CategoryRow>(
    `SELECT id, parent_id, type, name, icon, color_bg, system_key
       FROM categories
      WHERE deleted_at IS NULL AND archived_at IS NULL AND system_key IS NULL
        AND type IN (?, 'both')
      ORDER BY sort_order, name`,
    type,
  );
}

/** Kategori utama tersering 60 hari terakhir (contoh query E di skema). */
export async function frequentCategoryIds(db: SQLiteDatabase, type: 'in' | 'out') {
  const rows = await db.getAllAsync<{ main_category_id: string }>(
    `SELECT main_category_id, COUNT(*) AS n
       FROM v_transactions
      WHERE type = ? AND system_key IS NULL AND date >= date('now', '-60 days')
      GROUP BY main_category_id ORDER BY n DESC LIMIT 5`,
    type,
  );
  return rows.map((r) => r.main_category_id);
}

/** Jumlah kategori utama yang bisa dipilih (tanpa kategori sistem), untuk Pengaturan. */
export async function countMainCategories(db: SQLiteDatabase) {
  const row = await db.getFirstAsync<{ n: number }>(
    `SELECT COUNT(*) AS n FROM categories
      WHERE deleted_at IS NULL AND archived_at IS NULL AND system_key IS NULL AND parent_id IS NULL`,
  );
  return row?.n ?? 0;
}
