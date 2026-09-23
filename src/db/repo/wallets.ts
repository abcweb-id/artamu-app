import type { SQLiteDatabase } from 'expo-sqlite';

import { nowISO, toDateString } from '@/lib/date';
import { newId } from '@/lib/id';

import { SYSTEM_CATEGORY } from './categories';

export type WalletRow = { id: string; name: string; icon: string; balance: number };

/** Dompet aktif (tidak diarsipkan) dengan saldonya dari v_wallet_balances. */
export function listWallets(db: SQLiteDatabase) {
  return db.getAllAsync<WalletRow>(
    `SELECT w.id, w.name, w.icon, COALESCE(b.balance, 0) AS balance
       FROM wallets w
       LEFT JOIN v_wallet_balances b ON b.wallet_id = w.id
      WHERE w.deleted_at IS NULL AND w.archived_at IS NULL
      ORDER BY w.sort_order, w.created_at`,
  );
}

export type NewWallet = { name: string; icon: string; openingBalance: number };

/**
 * Buat dompet saat onboarding. Saldo awal dicatat sebagai transaksi berkategori sistem
 * "Saldo awal" (opening), karena saldo tidak pernah disimpan. Mengembalikan ID dompet.
 */
export async function createWallets(db: SQLiteDatabase, wallets: NewWallet[]) {
  const ids: string[] = [];
  const now = nowISO();
  const today = toDateString();
  await db.withTransactionAsync(async () => {
    for (const [i, w] of wallets.entries()) {
      const id = newId();
      ids.push(id);
      await db.runAsync(
        `INSERT INTO wallets (id, name, icon, sort_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)`,
        id,
        w.name,
        w.icon,
        i,
        now,
        now,
      );
      if (w.openingBalance > 0) {
        await db.runAsync(
          `INSERT INTO transactions (id, wallet_id, category_id, type, amount, date, source, created_at, updated_at)
           VALUES (?, ?, ?, 'in', ?, ?, 'system', ?, ?)`,
          newId(),
          id,
          SYSTEM_CATEGORY.opening,
          w.openingBalance,
          today,
          now,
          now,
        );
      }
    }
  });
  return ids;
}
