import type { SQLiteDatabase } from 'expo-sqlite';

/** Kunci pengaturan dari data awal skema; nilainya dikembalikan ke bawaan saat hapus data. */
const SEED_SETTINGS: Record<string, string> = {
  schema_note: '"Artamu skema versi 1"',
  language: '"system"',
  theme_mode: '"system"',
  auto_lock: '60',
  daily_reminder: '{"on":true,"h":20,"m":0}',
};

/**
 * Hapus semua data pengguna dan kembalikan ke keadaan setelah migrasi: kategori bawaan
 * (ID tetap) dan pengaturan bawaan tetap ada. Ini satu-satunya DELETE di aplikasi;
 * selain ini, menghapus berarti mengisi deleted_at.
 */
export async function wipeDatabase(db: SQLiteDatabase) {
  await db.withTransactionAsync(async () => {
    for (const table of [
      'notifications',
      'debt_payments',
      'debts',
      'budget_categories',
      'budgets',
      'attachments',
      'transactions',
      'recurring_rules',
      'wallets',
    ]) {
      await db.runAsync(`DELETE FROM ${table}`);
    }
    // Kategori buatan pengguna (sub dulu, lalu induk); kategori bawaan ber-ID tetap dipertahankan.
    await db.runAsync(
      `DELETE FROM categories WHERE parent_id IS NOT NULL AND id NOT LIKE '00000000-0000-4000-8000-%'`,
    );
    await db.runAsync(`DELETE FROM categories WHERE id NOT LIKE '00000000-0000-4000-8000-%'`);
    await db.runAsync('DELETE FROM settings');
    const now = new Date().toISOString();
    for (const [key, value] of Object.entries(SEED_SETTINGS)) {
      await db.runAsync(
        'INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?)',
        key,
        value,
        now,
      );
    }
  });
}
