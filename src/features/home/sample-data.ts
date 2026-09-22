import type { IconName } from '@/components/ui/icon';
import type { CategoryColor } from '@/theme/tokens';

/**
 * DATA CONTOH untuk membangun tampilan Beranda sebelum database dipasang. Angkanya
 * diambil dari prototipe (dompet Bank, 18 September 2026) supaya bisa dibandingkan
 * langsung. Diganti query SQLite (v_wallet_balances, v_transactions) nanti.
 */

export type SampleTransaction = {
  id: string;
  title: string;
  /** Nama kategori, dengan induk untuk subkategori ("Belanja: Dapur"). */
  category: string;
  icon: IconName;
  color: CategoryColor;
  kind: 'income' | 'expense';
  amount: number;
  date: string;
};

export const sampleHome = {
  today: '2026-09-18',
  walletKey: 'BANK' as const,
  walletIcon: 'bank' as IconName,
  balance: 1_850_000,
  income: 5_200_000,
  expense: 2_840_000,
  unreadNotifications: 2,
  /** Pengeluaran kumulatif per hari: bulan ini sampai hari ini, dan bulan lalu penuh. */
  spendingThisMonth: [
    4179, 12538, 25077, 31346, 741795, 745974, 760603, 773141, 779410, 939859, 944038, 952397,
    964936, 977474, 987923, 1107103, 1327462, 1340000,
  ],
  spendingLastMonth: [
    40235, 100588, 130765, 181059, 201176, 241412, 331941, 362118, 412412, 432529, 472765, 533118,
    563294, 643765, 663882, 704118, 764471, 794647, 844941, 865059, 935471, 995824, 1026000,
    1076294, 1096412, 1136647, 1197000, 1257353, 1307647, 1327765, 1368000,
  ],
  recent: [
    {
      id: 't1',
      title: 'Proyek lepas',
      category: 'Proyek',
      icon: 'cash',
      color: 'green',
      kind: 'income',
      amount: 750_000,
      date: '2026-09-18',
    },
    {
      id: 't2',
      title: 'Belanja bulanan',
      category: 'Belanja: Dapur',
      icon: 'bag',
      color: 'purple',
      kind: 'expense',
      amount: 212_000,
      date: '2026-09-17',
    },
    {
      id: 't3',
      title: 'Makan siang kantor',
      category: 'Makan',
      icon: 'food',
      color: 'orange',
      kind: 'expense',
      amount: 28_000,
      date: '2026-09-16',
    },
    {
      id: 't4',
      title: 'Kopi susu',
      category: 'Makan: Jajan dan kopi',
      icon: 'food',
      color: 'orange',
      kind: 'expense',
      amount: 22_000,
      date: '2026-09-16',
    },
  ] satisfies SampleTransaction[],
};
