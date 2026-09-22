import { Pressable, Text, View } from 'react-native';

import { CategoryIcon } from '@/components/ui/category-icon';
import type { IconName } from '@/components/ui/icon';
import { formatAmount } from '@/lib/money';
import type { CategoryColor } from '@/theme/tokens';

type TransactionRowProps = {
  title: string;
  /** Baris kedua, misalnya "Hari ini, Proyek" atau "Belanja: Dapur". */
  subtitle: string;
  icon: IconName;
  color: CategoryColor;
  kind: 'income' | 'expense';
  amount: number;
  /**
   * plain: selebar layar, seperti di Beranda.
   * boxed: di dalam kotak per hari di Daftar transaksi, lebih ringkas, garis pemisah di atas.
   */
  variant?: 'plain' | 'boxed';
  /** Baris pertama di kotak tidak memakai garis pemisah. */
  first?: boolean;
  onPress?: () => void;
};

/** Baris transaksi: ikon kategori, judul dan keterangan, nominal bertanda + atau −. */
export function TransactionRow({
  title,
  subtitle,
  icon,
  color,
  kind,
  amount,
  variant = 'plain',
  first,
  onPress,
}: TransactionRowProps) {
  const income = kind === 'income';
  const boxed = variant === 'boxed';
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className={`flex-row items-center active:bg-key ${
        boxed
          ? `gap-2.5 px-3 py-[9px] ${first ? '' : 'border-t border-line/70'}`
          : '-mx-5 gap-3 px-5 py-[11px]'
      }`}
    >
      <CategoryIcon name={icon} color={color} variant={boxed ? 'compact' : 'list'} />
      <View className="min-w-0 flex-1">
        <Text numberOfLines={1} className="text-sm font-medium leading-5 text-text">
          {title}
        </Text>
        <Text
          numberOfLines={1}
          className={`${boxed ? 'text-xs leading-[17px]' : 'text-[12.5px] leading-[18px]'} text-muted`}
        >
          {subtitle}
        </Text>
      </View>
      <Text
        className={`font-display-sb ${boxed ? 'text-sm' : 'text-[14.5px]'} ${income ? 'text-income' : 'text-expense'}`}
        style={{ fontVariant: ['tabular-nums'] }}
      >
        {`${income ? '+' : '−'} ${formatAmount(amount)}`}
      </Text>
    </Pressable>
  );
}
