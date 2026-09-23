import type { TFunction } from 'i18next';

import type { IconName } from '@/components/ui/icon';
import type { CategoryColor } from '@/theme/tokens';

/**
 * Kategori bawaan punya ID tetap (data awal skema), jadi namanya bisa diterjemahkan.
 * Kategori buatan pengguna memakai nama dari database apa adanya.
 */
const SEEDED_KEYS: Record<string, string> = {
  '00000000-0000-4000-8000-000000000101': 'MAKAN',
  '00000000-0000-4000-8000-000000000102': 'TRANSPORT',
  '00000000-0000-4000-8000-000000000103': 'BELANJA',
  '00000000-0000-4000-8000-000000000104': 'TAGIHAN',
  '00000000-0000-4000-8000-000000000105': 'SEHAT',
  '00000000-0000-4000-8000-000000000106': 'HIBUR',
  '00000000-0000-4000-8000-000000000107': 'DIDIK',
  '00000000-0000-4000-8000-000000000108': 'SEDEKAH',
  '00000000-0000-4000-8000-000000000109': 'RUMAH',
  '00000000-0000-4000-8000-00000000010a': 'PULSA',
  '00000000-0000-4000-8000-00000000010b': 'LAIN',
  '00000000-0000-4000-8000-000000000201': 'GAJI',
  '00000000-0000-4000-8000-000000000202': 'PROYEK',
  '00000000-0000-4000-8000-000000000203': 'BONUS',
  '00000000-0000-4000-8000-000000000204': 'INVEST',
  '00000000-0000-4000-8000-000000000205': 'JUAL',
  '00000000-0000-4000-8000-000000000206': 'HADIAH',
  '00000000-0000-4000-8000-000000000207': 'LAININ',
  '00000000-0000-4000-8000-0000000000a1': 'SYS_TRANSFER',
  '00000000-0000-4000-8000-0000000000a2': 'SYS_ADJUSTMENT',
  '00000000-0000-4000-8000-0000000000a3': 'SYS_DEBT',
  '00000000-0000-4000-8000-0000000000a4': 'SYS_OPENING',
};

/** Warna latar dari database ke delapan pasangan warna kategori (pedoman ikon). */
const COLOR_BY_BG: Record<string, CategoryColor> = {
  '#FCE8D5': 'orange',
  '#DCEBFA': 'blue',
  '#F3E1F0': 'purple',
  '#FBF0CF': 'yellow',
  '#FBE0E6': 'pink',
  '#DDF2E6': 'green',
  '#DDF3E9': 'green',
  '#E2E6F5': 'indigo',
  '#ECE8E2': 'neutral',
  '#E6E7EA': 'neutral',
};

export const categoryColor = (bg: string | null | undefined): CategoryColor =>
  (bg && COLOR_BY_BG[bg.toUpperCase()]) || 'neutral';

export const categoryIcon = (icon: string | null | undefined) => (icon ?? 'dots') as IconName;

/** Nama kategori: terjemahan untuk kategori bawaan, nama dari database untuk buatan pengguna. */
export function categoryName(t: TFunction, id: string, name: string, short = false) {
  const key = SEEDED_KEYS[id];
  if (!key) return name;
  return t(`CATEGORIES.${key}.${short ? 'SHORT' : 'NAME'}` as 'CATEGORIES.MAKAN.NAME');
}
