import { Pressable, Text, View } from 'react-native';

import { CategoryIcon } from '@/components/ui/category-icon';
import type { IconName } from '@/components/ui/icon';
import { formatAmount } from '@/lib/money';
import type { CategoryColor } from '@/theme/tokens';

type TransactionRowProps = {
  title: string;
  /** Baris kedua, misalnya "Hari ini, Proyek". */
  subtitle: string;
  icon: IconName;
  color: CategoryColor;
  kind: 'income' | 'expense';
  amount: number;
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
  onPress,
}: TransactionRowProps) {
  const income = kind === 'income';
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="-mx-5 flex-row items-center gap-3 px-5 py-[11px] active:bg-key"
    >
      <CategoryIcon name={icon} color={color} />
      <View className="min-w-0 flex-1">
        <Text numberOfLines={1} className="text-sm font-medium leading-5 text-text">
          {title}
        </Text>
        <Text numberOfLines={1} className="text-[12.5px] leading-[18px] text-muted">
          {subtitle}
        </Text>
      </View>
      <Text
        className={`font-display-sb text-[14.5px] ${income ? 'text-income' : 'text-expense'}`}
        style={{ fontVariant: ['tabular-nums'] }}
      >
        {`${income ? '+' : '−'} ${formatAmount(amount)}`}
      </Text>
    </Pressable>
  );
}
