import type { SQLiteDatabase } from 'expo-sqlite';

import { nowISO, toDateString } from '@/lib/date';
import { newId } from '@/lib/id';

/** Baris transaksi untuk ditampilkan, lengkap dengan kategori dan induknya. */
export type TransactionRow = {
  id: string;
  wallet_id: string;
  category_id: string;
  type: 'in' | 'out';
  amount: number;
  note: string;
  date: string;
  created_at: string;
  system_key: string | null;
  category_name: string;
  category_icon: string | null;
  category_color_bg: string | null;
  parent_id: string | null;
  parent_name: string | null;
  parent_icon: string | null;
  parent_color_bg: string | null;
};

const SELECT_ROWS = `
  SELECT v.id, v.wallet_id, v.category_id, v.type, v.amount, v.note, v.date, v.created_at, v.system_key,
         c.name AS category_name, c.icon AS category_icon, c.color_bg AS category_color_bg,
         c.parent_id, p.name AS parent_name, p.icon AS parent_icon, p.color_bg AS parent_color_bg
    FROM v_transactions v
    JOIN categories c ON c.id = v.category_id
    LEFT JOIN categories p ON p.id = c.parent_id`;

/** Transaksi satu dompet dalam rentang tanggal, terbaru dulu (contoh query C). */
export function listTransactions(db: SQLiteDatabase, walletId: string, from: string, to: string) {
  return db.getAllAsync<TransactionRow>(
    `${SELECT_ROWS}
      WHERE v.wallet_id = ? AND v.date BETWEEN ? AND ?
      ORDER BY v.date DESC, v.created_at DESC`,
    walletId,
    from,
    to,
  );
}

/** Transaksi terbaru satu dompet, lintas bulan. */
export function recentTransactions(db: SQLiteDatabase, walletId: string, limit: number) {
  return db.getAllAsync<TransactionRow>(
    `${SELECT_ROWS}
      WHERE v.wallet_id = ?
      ORDER BY v.date DESC, v.created_at DESC LIMIT ?`,
    walletId,
    limit,
  );
}

/**
 * Pemasukan dan pengeluaran satu dompet dalam rentang tanggal (contoh query B). Transaksi
 * sistem (saldo awal, transfer, penyesuaian, hutang) tidak dihitung, seperti di laporan.
 */
export async function periodTotals(db: SQLiteDatabase, walletId: string, from: string, to: string) {
  const row = await db.getFirstAsync<{ income: number | null; expense: number | null }>(
    `SELECT SUM(CASE WHEN type = 'in' THEN amount ELSE 0 END) AS income,
            SUM(CASE WHEN type = 'out' THEN amount ELSE 0 END) AS expense
       FROM v_transactions
      WHERE wallet_id = ? AND system_key IS NULL AND date BETWEEN ? AND ?`,
    walletId,
    from,
    to,
  );
  return { income: row?.income ?? 0, expense: row?.expense ?? 0 };
}

/** Pengeluaran per tanggal (tanpa transaksi sistem), untuk grafik kumulatif. */
export async function dailySpending(
  db: SQLiteDatabase,
  walletId: string,
  from: string,
  to: string,
) {
  const rows = await db.getAllAsync<{ date: string; total: number }>(
    `SELECT date, SUM(amount) AS total
       FROM v_transactions
      WHERE wallet_id = ? AND type = 'out' AND system_key IS NULL AND date BETWEEN ? AND ?
      GROUP BY date`,
    walletId,
    from,
    to,
  );
  return Object.fromEntries(rows.map((r) => [r.date, r.total])) as Record<string, number>;
}

export type NewTransaction = {
  walletId: string;
  categoryId: string;
  type: 'in' | 'out';
  amount: number;
  note: string;
  date: string;
};

export async function insertTransaction(db: SQLiteDatabase, tx: NewTransaction) {
  const now = nowISO();
  await db.runAsync(
    `INSERT INTO transactions (id, wallet_id, category_id, type, amount, note, date, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    newId(),
    tx.walletId,
    tx.categoryId,
    tx.type,
    tx.amount,
    tx.note,
    tx.date,
    now,
    now,
  );
}

/** Angka di layar Akun. */
export async function profileStats(db: SQLiteDatabase) {
  const [counts, days, recurring, debts] = await Promise.all([
    db.getFirstAsync<{ n: number; months: number; first: string | null }>(
      `SELECT COUNT(CASE WHEN system_key IS NULL THEN 1 END) AS n,
              COUNT(DISTINCT CASE WHEN system_key IS NULL THEN substr(date, 1, 7) END) AS months,
              MIN(date) AS first
         FROM v_transactions`,
    ),
    db.getAllAsync<{ date: string }>(
      `SELECT DISTINCT date FROM v_transactions WHERE system_key IS NULL ORDER BY date DESC LIMIT 400`,
    ),
    db.getFirstAsync<{ n: number }>(
      `SELECT COUNT(*) AS n FROM recurring_rules
        WHERE is_active = 1 AND deleted_at IS NULL AND next_run_date IS NOT NULL`,
    ),
    db.getFirstAsync<{ n: number }>(
      `SELECT COUNT(*) AS n FROM v_debt_status WHERE settled_at IS NULL AND remaining > 0`,
    ),
  ]);
  return {
    transactions: counts?.n ?? 0,
    months: counts?.months ?? 0,
    since: counts?.first ?? null,
    streakDays: streak(days.map((d) => d.date)),
    activeRecurring: recurring?.n ?? 0,
    openDebts: debts?.n ?? 0,
  };
}

/** Hari berturut-turut ada catatan, berakhir hari ini atau kemarin. dates urut terbaru dulu. */
function streak(dates: string[]) {
  const day = (d: string) => Math.round(new Date(`${d}T00:00:00`).getTime() / 86_400_000);
  const today = day(toDateString());
  let expected = dates.length && day(dates[0]) >= today - 1 ? day(dates[0]) : null;
  let count = 0;
  for (const d of dates) {
    if (expected === null || day(d) !== expected) break;
    count++;
    expected--;
  }
  return count;
}

export async function unreadNotificationCount(db: SQLiteDatabase) {
  const row = await db.getFirstAsync<{ n: number }>(
    'SELECT COUNT(*) AS n FROM notifications WHERE read_at IS NULL',
  );
  return row?.n ?? 0;
}
