import type { IconName } from '@/components/ui/icon';
import type { StarterWallet } from '@/stores/onboarding-store';
import type { CategoryColor } from '@/theme/tokens';

/**
 * DATA CONTOH per dompet, September 2026, diambil dari prototipe supaya tampilan bisa
 * dibandingkan langsung. Diganti query SQLite (v_wallet_balances, v_transactions) nanti.
 * Judul dan nama kategori adalah data pengguna, jadi tidak diterjemahkan.
 */

export type SampleTransaction = {
  id: string;
  title: string;
  /** Nama kategori lengkap untuk Daftar transaksi ("Proyek lepas", "Belanja: Dapur"). */
  category: string;
  /** Nama kategori pendek untuk Beranda ("Proyek", "Transfer"). */
  categoryShort: string;
  icon: IconName;
  color: CategoryColor;
  kind: 'income' | 'expense';
  amount: number;
  date: string;
};

export type SampleWallet = {
  icon: IconName;
  balance: number;
  /** Total bulan ini, termasuk transaksi yang tidak ada di daftar contoh. */
  income: number;
  expense: number;
  /** Pengeluaran kumulatif per hari: bulan ini sampai hari ini, dan bulan lalu penuh. */
  spendingThisMonth: number[];
  spendingLastMonth: number[];
  /** Urut dari yang terbaru. Transfer memakai lingkaran netral (kategori sistem). */
  transactions: SampleTransaction[];
};

export const SAMPLE_TODAY = '2026-09-18';

const tx = (
  id: string,
  date: string,
  kind: SampleTransaction['kind'],
  amount: number,
  title: string,
  category: string,
  icon: IconName,
  color: CategoryColor,
  categoryShort = category,
): SampleTransaction => ({ id, date, kind, amount, title, category, categoryShort, icon, color });

export const sampleWallets: Record<StarterWallet, SampleWallet> = {
  CASH: {
    icon: 'cash',
    balance: 350_000,
    income: 1_000_000,
    expense: 1_058_000,
    spendingThisMonth: [
      36316, 96842, 121053, 169474, 242105, 278421, 375263, 399474, 447895, 520526, 556842, 702368,
      726579, 811316, 883947, 920263, 980789, 1058000,
    ],
    spendingLastMonth: [
      41058, 57482, 90328, 139599, 164234, 205292, 246350, 279197, 328467, 353102, 394161, 410584,
      443431, 517336, 541971, 583029, 599453, 632299, 681569, 706204, 771898, 788321, 821168,
      870438, 895073, 936131, 952555, 1010036, 1059307, 1113942, 1177000,
    ],
    transactions: [
      tx('t1', '2026-09-18', 'expense', 18_000, 'Makan siang', 'Makan', 'food', 'orange'),
      tx('t2', '2026-09-18', 'expense', 35_000, 'Bensin', 'Transport', 'moto', 'blue'),
      tx('t3', '2026-09-12', 'expense', 85_000, 'Servis motor', 'Transport', 'moto', 'blue'),
      tx(
        't4',
        '2026-09-02',
        'income',
        1_000_000,
        'Tarik tunai',
        'Transfer antar dompet',
        'swap',
        'neutral',
        'Transfer',
      ),
    ],
  },
  BANK: {
    icon: 'bank',
    balance: 1_850_000,
    income: 5_200_000,
    expense: 2_840_000,
    spendingThisMonth: [
      4179, 12538, 25077, 31346, 741795, 745974, 760603, 773141, 779410, 939859, 944038, 952397,
      964936, 977474, 987923, 1107103, 1327462, 1340000,
    ],
    spendingLastMonth: [
      40235, 100588, 130765, 181059, 201176, 241412, 331941, 362118, 412412, 432529, 472765, 533118,
      563294, 643765, 663882, 704118, 764471, 794647, 844941, 865059, 935471, 995824, 1026000,
      1076294, 1096412, 1136647, 1197000, 1257353, 1307647, 1327765, 1368000,
    ],
    transactions: [
      tx(
        't5',
        '2026-09-18',
        'income',
        750_000,
        'Proyek lepas',
        'Proyek lepas',
        'cash',
        'green',
        'Proyek',
      ),
      tx(
        't6',
        '2026-09-17',
        'expense',
        212_000,
        'Belanja bulanan',
        'Belanja: Dapur',
        'bag',
        'purple',
      ),
      tx('t7', '2026-09-16', 'expense', 28_000, 'Makan siang kantor', 'Makan', 'food', 'orange'),
      tx(
        't8',
        '2026-09-16',
        'expense',
        22_000,
        'Kopi susu',
        'Makan: Jajan dan kopi',
        'food',
        'orange',
      ),
      tx(
        't9',
        '2026-09-16',
        'expense',
        47_000,
        'Sabun dan sampo',
        'Belanja: Barang rumah',
        'bag',
        'purple',
      ),
      tx('t10', '2026-09-16', 'expense', 18_000, 'Camilan minimarket', 'Belanja', 'bag', 'purple'),
      tx(
        't11',
        '2026-09-10',
        'expense',
        150_000,
        'Internet',
        'Tagihan: Internet',
        'receipt',
        'yellow',
      ),
      tx('t12', '2026-09-05', 'expense', 700_000, 'Kos', 'Tagihan: Kos', 'receipt', 'yellow'),
      tx(
        't13',
        '2026-09-02',
        'expense',
        1_000_000,
        'Tarik tunai',
        'Transfer antar dompet',
        'swap',
        'neutral',
        'Transfer',
      ),
      tx(
        't14',
        '2026-09-02',
        'expense',
        500_000,
        'Isi saldo e-wallet',
        'Transfer antar dompet',
        'swap',
        'neutral',
        'Transfer',
      ),
      tx('t15', '2026-09-01', 'income', 4_450_000, 'Gaji', 'Gaji', 'wallet', 'green'),
    ],
  },
  EWALLET: {
    icon: 'phone',
    balance: 150_000,
    income: 500_000,
    expense: 452_000,
    spendingThisMonth: [
      8205, 24615, 49231, 61538, 82051, 90256, 118974, 143590, 155897, 176410, 184615, 201026,
      225641, 250256, 302769, 310974, 427385, 452000,
    ],
    spendingLastMonth: [
      15294, 38235, 49706, 68824, 76471, 91765, 126176, 137647, 156765, 164412, 179706, 202647,
      214118, 244706, 252353, 267647, 290588, 302059, 321176, 328824, 355588, 378529, 390000,
      409118, 416765, 432059, 455000, 532941, 552059, 559706, 575000,
    ],
    transactions: [
      tx(
        't16',
        '2026-09-17',
        'expense',
        100_000,
        'Token listrik',
        'Tagihan: Listrik',
        'receipt',
        'yellow',
      ),
      tx(
        't17',
        '2026-09-15',
        'expense',
        32_000,
        'Kopi dan roti',
        'Makan: Jajan dan kopi',
        'food',
        'orange',
      ),
      tx(
        't18',
        '2026-09-02',
        'income',
        500_000,
        'Isi saldo e-wallet',
        'Transfer antar dompet',
        'swap',
        'neutral',
        'Transfer',
      ),
    ],
  },
};
