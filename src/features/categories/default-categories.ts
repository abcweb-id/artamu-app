import type { IconName } from '@/components/ui/icon';
import type { CategoryColor } from '@/theme/tokens';

/**
 * Kategori bawaan dari prototipe. Nama tampil lewat i18n (CATEGORIES.<KEY>.NAME/SHORT).
 * Nanti menjadi data awal tabel categories dengan ID tetap (sama di semua ponsel).
 */
export type Category = {
  id: string;
  /** Kunci terjemahan di CATEGORIES. */
  key: string;
  kind: 'income' | 'expense';
  icon: IconName;
  color: CategoryColor;
  /** Subkategori menunjuk induknya dan mewarisi ikon dan warnanya. */
  parent?: string;
};

export const categories: Category[] = [
  { id: 'makan', key: 'MAKAN', kind: 'expense', icon: 'food', color: 'orange' },
  { id: 'transport', key: 'TRANSPORT', kind: 'expense', icon: 'moto', color: 'blue' },
  { id: 'belanja', key: 'BELANJA', kind: 'expense', icon: 'bag', color: 'purple' },
  { id: 'tagihan', key: 'TAGIHAN', kind: 'expense', icon: 'receipt', color: 'yellow' },
  { id: 'sehat', key: 'SEHAT', kind: 'expense', icon: 'plus', color: 'pink' },
  { id: 'hibur', key: 'HIBUR', kind: 'expense', icon: 'music', color: 'purple' },
  { id: 'didik', key: 'DIDIK', kind: 'expense', icon: 'pencil', color: 'blue' },
  { id: 'sedekah', key: 'SEDEKAH', kind: 'expense', icon: 'gift', color: 'green' },
  { id: 'rumah', key: 'RUMAH', kind: 'expense', icon: 'home', color: 'yellow' },
  { id: 'pulsa', key: 'PULSA', kind: 'expense', icon: 'phone', color: 'indigo' },
  { id: 'lain', key: 'LAIN', kind: 'expense', icon: 'dots', color: 'neutral' },
  { id: 'gaji', key: 'GAJI', kind: 'income', icon: 'wallet', color: 'green' },
  { id: 'proyek', key: 'PROYEK', kind: 'income', icon: 'cash', color: 'green' },
  { id: 'bonus', key: 'BONUS', kind: 'income', icon: 'gift', color: 'yellow' },
  { id: 'invest', key: 'INVEST', kind: 'income', icon: 'chart', color: 'blue' },
  { id: 'jual', key: 'JUAL', kind: 'income', icon: 'tag', color: 'purple' },
  { id: 'cashback', key: 'CASHBACK', kind: 'income', icon: 'receipt', color: 'orange' },
  { id: 'kiriman', key: 'KIRIMAN', kind: 'income', icon: 'home', color: 'indigo' },
  { id: 'hadiah', key: 'HADIAH', kind: 'income', icon: 'gift', color: 'pink' },
  { id: 'lainin', key: 'LAININ', kind: 'income', icon: 'dots', color: 'neutral' },
  {
    id: 'belanja_dapur',
    key: 'BELANJA_DAPUR',
    kind: 'expense',
    icon: 'bag',
    color: 'purple',
    parent: 'belanja',
  },
  {
    id: 'belanja_pakaian',
    key: 'BELANJA_PAKAIAN',
    kind: 'expense',
    icon: 'bag',
    color: 'purple',
    parent: 'belanja',
  },
  {
    id: 'belanja_barang',
    key: 'BELANJA_BARANG',
    kind: 'expense',
    icon: 'bag',
    color: 'purple',
    parent: 'belanja',
  },
  {
    id: 'tagihan_kos',
    key: 'TAGIHAN_KOS',
    kind: 'expense',
    icon: 'receipt',
    color: 'yellow',
    parent: 'tagihan',
  },
  {
    id: 'tagihan_listrik',
    key: 'TAGIHAN_LISTRIK',
    kind: 'expense',
    icon: 'receipt',
    color: 'yellow',
    parent: 'tagihan',
  },
  {
    id: 'tagihan_internet',
    key: 'TAGIHAN_INTERNET',
    kind: 'expense',
    icon: 'receipt',
    color: 'yellow',
    parent: 'tagihan',
  },
  {
    id: 'makan_jajan',
    key: 'MAKAN_JAJAN',
    kind: 'expense',
    icon: 'food',
    color: 'orange',
    parent: 'makan',
  },
  {
    id: 'proyek_web',
    key: 'PROYEK_WEB',
    kind: 'income',
    icon: 'cash',
    color: 'green',
    parent: 'proyek',
  },
  {
    id: 'proyek_desain',
    key: 'PROYEK_DESAIN',
    kind: 'income',
    icon: 'cash',
    color: 'green',
    parent: 'proyek',
  },
  {
    id: 'invest_reksa',
    key: 'INVEST_REKSA',
    kind: 'income',
    icon: 'chart',
    color: 'blue',
    parent: 'invest',
  },
  {
    id: 'invest_bunga',
    key: 'INVEST_BUNGA',
    kind: 'income',
    icon: 'chart',
    color: 'blue',
    parent: 'invest',
  },
];

export const categoryById = Object.fromEntries(categories.map((c) => [c.id, c])) as Record<
  string,
  Category
>;

/** Urutan kategori yang paling sering dipakai. Nanti dihitung dari riwayat transaksi. */
export const frequentCategories: Record<Category['kind'], string[]> = {
  expense: [
    'makan',
    'transport',
    'tagihan',
    'belanja',
    'sehat',
    'hibur',
    'didik',
    'sedekah',
    'rumah',
    'pulsa',
    'lain',
  ],
  income: ['gaji', 'proyek', 'bonus', 'invest', 'jual', 'cashback', 'kiriman', 'hadiah', 'lainin'],
};

export const subcategoriesOf = (id: string) => categories.filter((c) => c.parent === id);
