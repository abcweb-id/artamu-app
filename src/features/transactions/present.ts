import type { TFunction } from 'i18next';

import type { TransactionRow } from '@/db/repo/transactions';
import { categoryColor, categoryIcon, categoryName } from '@/features/categories/present';

/**
 * Baris database ke tampilan: judul (catatan, atau nama kategori kalau kosong), label kategori
 * ("Belanja: Dapur" untuk sub), ikon dan warna (sub mewarisi induknya).
 */
export function presentTransaction(t: TFunction, row: TransactionRow) {
  const name = categoryName(t, row.category_id, row.category_name);
  const parent = row.parent_id ? categoryName(t, row.parent_id, row.parent_name ?? '', true) : null;
  return {
    id: row.id,
    date: row.date,
    title: row.note || name,
    category: parent ? `${parent}: ${name}` : name,
    categoryShort: parent
      ? `${parent}: ${name}`
      : categoryName(t, row.category_id, row.category_name, true),
    icon: categoryIcon(row.category_icon ?? row.parent_icon),
    color: categoryColor(row.category_color_bg ?? row.parent_color_bg),
    kind: row.type === 'in' ? ('income' as const) : ('expense' as const),
    amount: row.amount,
  };
}

export type PresentedTransaction = ReturnType<typeof presentTransaction>;
