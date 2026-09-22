import { useColorScheme } from 'nativewind';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { Icon, type IconName } from '@/components/ui/icon';
import { formatRp } from '@/lib/money';
import { useAppStore } from '@/stores/app-store';
import { balanceCard as card } from '@/theme/tokens';
import { usePalette } from '@/theme/use-palette';

type BalanceCardProps = {
  walletName: string;
  walletIcon: IconName;
  balance: number;
  income: number;
  expense: number;
  onSwitchWallet?: () => void;
};

const MASK = '•••••••';

/** Kartu saldo hijau dengan kartu Pemasukan dan Pengeluaran yang menjorok ke bawah. */
export function BalanceCard({
  walletName,
  walletIcon,
  balance,
  income,
  expense,
  onSwitchWallet,
}: BalanceCardProps) {
  const { t } = useTranslation();
  const hide = useAppStore((s) => s.hideBalance);
  const toggleHide = useAppStore((s) => s.toggleHideBalance);

  return (
    <View>
      <View
        className="overflow-hidden rounded-card px-4 pb-[52px] pt-4"
        style={{ backgroundColor: card.bg }}
      >
        {/* Hiasan: lingkaran terang di kanan atas, cincin kuning di kiri bawah, ikon dompet samar. */}
        <View
          className="absolute h-[200px] w-[200px] rounded-full"
          style={{ right: -60, top: -70, backgroundColor: 'rgba(255,255,255,0.07)' }}
        />
        <View
          className="absolute h-[150px] w-[150px] rounded-full"
          style={{ left: -50, bottom: -70, borderWidth: 1.5, borderColor: card.ornament }}
        />
        <View className="absolute" style={{ right: -8, top: 50, opacity: 0.1 }}>
          <Icon name={walletIcon} color={card.text} size={104} weight="light" />
        </View>

        <View className="flex-row items-center justify-between">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('HOME.SWITCH_WALLET', { wallet: walletName })}
            onPress={onSwitchWallet}
            className="flex-row items-center gap-1.5 rounded-pill py-1.5 pl-2.5 pr-[9px] active:opacity-80"
            style={{ backgroundColor: card.inner }}
          >
            <Icon name={walletIcon} color={card.text} size={16} />
            <Text className="text-[13px] font-medium" style={{ color: card.text }}>
              {walletName}
            </Text>
            <Icon name="chevD" color={card.text} size={15} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t(hide ? 'HOME.SHOW_BALANCE' : 'HOME.HIDE_BALANCE')}
            onPress={toggleHide}
            className="h-8 w-9 items-center justify-center rounded-[10px] active:opacity-60"
          >
            <Icon name={hide ? 'eyeoff' : 'eye'} color={card.muted} size={21} />
          </Pressable>
        </View>

        <Text className="mt-3 px-1 text-[12.5px]" style={{ color: card.muted }}>
          {t('HOME.TOTAL_BALANCE')}
        </Text>
        <Text
          className="mt-0.5 px-1 font-display text-[31px] leading-[38px]"
          style={{ color: card.text, fontVariant: ['tabular-nums'] }}
        >
          {hide ? `Rp ${MASK}` : formatRp(balance)}
        </Text>
      </View>

      <View className="mx-3 -mt-[34px] flex-row gap-2.5">
        <FlowTile
          kind="income"
          label={t('HOME.INCOME')}
          value={hide ? `Rp ${MASK.slice(2)}` : formatRp(income)}
        />
        <FlowTile
          kind="expense"
          label={t('HOME.EXPENSE')}
          value={hide ? `Rp ${MASK.slice(2)}` : formatRp(expense)}
        />
      </View>
    </View>
  );
}

function FlowTile({
  kind,
  label,
  value,
}: {
  kind: 'income' | 'expense';
  label: string;
  value: string;
}) {
  const c = usePalette();
  const dark = useColorScheme().colorScheme === 'dark';
  const color = kind === 'income' ? c.income : c.expense;
  return (
    <View
      className="min-w-0 flex-1 flex-row items-center gap-2 rounded-2xl border border-line bg-surface px-2.5 py-3"
      // Bayangan tipis mengikuti wireframe, supaya kartu terlihat terpisah dari kartu hijau.
      style={{ boxShadow: `0 10px 20px -12px ${dark ? 'rgba(0,0,0,0.6)' : 'rgba(20,22,35,0.28)'}` }}
    >
      <View
        className="h-[30px] w-[30px] items-center justify-center rounded-[9px]"
        style={{ backgroundColor: `${color}26` }}
      >
        <Icon name={kind === 'income' ? 'up' : 'down'} color={color} size={17} />
      </View>
      <View className="min-w-0 flex-1">
        <Text className="text-[11.5px] leading-[15px] text-muted">{label}</Text>
        <Text
          numberOfLines={1}
          className="font-display text-[12.5px] text-text"
          style={{ fontVariant: ['tabular-nums'] }}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}
