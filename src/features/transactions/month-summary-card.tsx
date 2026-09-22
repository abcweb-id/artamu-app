import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { Icon, type IconName } from '@/components/ui/icon';
import { formatRp } from '@/lib/money';
import { usePalette } from '@/theme/use-palette';

type MonthSummaryCardProps = {
  /** "September 2026" */
  monthLabel: string;
  income: number;
  expense: number;
  canGoPrev: boolean;
  canGoNext: boolean;
  onPrev?: () => void;
  onNext?: () => void;
  onOpenReport?: () => void;
};

/**
 * Kartu hijau lembut: navigasi bulan, Pemasukan dan Pengeluaran dengan bilah, dan Sisa.
 * Bilah pemasukan menunjukkan yang tersisa setelah pengeluaran, bilah pengeluaran
 * menunjukkan porsi yang sudah keluar, keduanya dibanding yang terbesar.
 */
export function MonthSummaryCard({
  monthLabel,
  income,
  expense,
  canGoPrev,
  canGoNext,
  onPrev,
  onNext,
  onOpenReport,
}: MonthSummaryCardProps) {
  const { t } = useTranslation();
  const c = usePalette();
  const ink = c['primary-ink'];
  const max = Math.max(income, expense, 1);
  const remaining = income - expense;
  const navButton = (icon: IconName, label: string, enabled: boolean, onPress?: () => void) => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={!enabled}
      onPress={onPress}
      className={`h-9 w-[34px] items-center justify-center rounded-[10px] active:opacity-60 ${
        enabled ? '' : 'opacity-30'
      }`}
    >
      <Icon name={icon} color={ink} size={20} />
    </Pressable>
  );

  return (
    <View
      className="mt-3 overflow-hidden rounded-[18px] border bg-primary-soft pb-1.5 pl-3 pr-2.5 pt-1"
      style={{ borderColor: `${c.primary}33` }}
    >
      {/* Hiasan: bercak di kiri atas dan cincin di kanan bawah. */}
      <View
        className="absolute rounded-full"
        style={{ left: -50, top: -60, width: 132, height: 112, backgroundColor: `${c.primary}1F` }}
      />
      <View
        className="absolute rounded-full"
        style={{
          right: -46,
          bottom: -54,
          width: 120,
          height: 120,
          borderWidth: 1.5,
          borderColor: `${c.primary}42`,
        }}
      />

      <View className="-ml-2 flex-row items-center gap-0.5">
        {navButton('chevL', t('LIST.PREV_MONTH'), canGoPrev, onPrev)}
        <Text className="font-display text-[14.5px]" style={{ color: ink }}>
          {monthLabel}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('LIST.OPEN_REPORT')}
          onPress={onOpenReport}
          className="ml-auto h-9 w-[34px] items-center justify-center rounded-[10px] active:opacity-60"
        >
          <Icon name="chart" color={c.income} size={20} />
        </Pressable>
        {navButton('chevR', t('LIST.NEXT_MONTH'), canGoNext, onNext)}
      </View>

      <SummaryRow
        kind="income"
        label={t('HOME.INCOME')}
        amount={income}
        part={Math.max(0, remaining) / max}
      />
      <SummaryRow kind="expense" label={t('HOME.EXPENSE')} amount={expense} part={expense / max} />

      <View
        className="mt-0.5 flex-row items-center gap-2.5 border-t pb-1.5 pt-2"
        style={{ borderTopColor: `${c.primary}38` }}
      >
        <View
          className="h-7 w-7 items-center justify-center rounded-[9px]"
          style={{ backgroundColor: `${ink}8C` }}
        >
          <Icon name="wallet" color="#FFFFFF" size={16} />
        </View>
        <Text className="flex-1 text-[13.5px]" style={{ color: ink }}>
          {t('LIST.REMAINING')}
        </Text>
        <Text
          className="mr-[18px] font-display text-[15px]"
          style={{ color: ink, fontVariant: ['tabular-nums'] }}
        >
          {`${remaining < 0 ? '−' : ''}${formatRp(Math.abs(remaining))}`}
        </Text>
      </View>
    </View>
  );
}

function SummaryRow({
  kind,
  label,
  amount,
  part,
}: {
  kind: 'income' | 'expense';
  label: string;
  amount: number;
  /** 0 sampai 1. */
  part: number;
}) {
  const { t } = useTranslation();
  const c = usePalette();
  const income = kind === 'income';
  const color = income ? c.income : c.expense;
  const fill = income ? c.secondary : c.expense;
  const width = `${Math.max(amount ? 3 : 0, Math.round(part * 100))}%` as const;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('LIST.ROW_LABEL', { label, amount: formatRp(amount) })}
      className="flex-row items-center gap-2.5 rounded-xl py-[5px] active:opacity-70"
    >
      {/* Filter per jenis belum dibuat. */}
      <View
        className="h-7 w-7 items-center justify-center rounded-full"
        style={{ backgroundColor: fill }}
      >
        <Icon name={income ? 'up' : 'down'} color="#FFFFFF" size={16} />
      </View>
      <View className="min-w-0 flex-1">
        <View className="flex-row items-baseline justify-between gap-2">
          <Text className="text-[13.5px]" style={{ color: c['primary-ink'] }}>
            {label}
          </Text>
          <Text className="font-display text-sm" style={{ color, fontVariant: ['tabular-nums'] }}>
            {formatRp(amount)}
          </Text>
        </View>
        <View
          className="mt-[5px] h-1 overflow-hidden rounded-[3px]"
          style={{ backgroundColor: `${color}33` }}
        >
          <View className="h-full rounded-[3px]" style={{ width, backgroundColor: fill }} />
        </View>
      </View>
      <View className="w-[18px]">
        <Icon name="chevR" color={`${c['primary-ink']}80`} size={17} />
      </View>
    </Pressable>
  );
}
