/**
 * DATA CONTOH Beranda dan Akun yang tidak per dompet, dari prototipe. Data per dompet ada di
 * src/features/transactions/sample-data.ts. Diganti query database nanti.
 */
export const sampleHome = {
  unreadNotifications: 2,
};

export const sampleProfile = {
  /** Tanggal transaksi pertama. */
  since: '2026-03-01',
  /** Jumlah transaksi sebelum sesi ini (riwayat prototipe). */
  transactionCount: 214,
  streakDays: 12,
  months: 7,
  activeRecurring: 6,
  openDebts: 4,
};
