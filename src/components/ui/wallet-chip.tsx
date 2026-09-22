import { useTranslation } from 'react-i18next';
import { Pressable, Text } from 'react-native';

import { balanceCard } from '@/theme/tokens';
import { usePalette } from '@/theme/use-palette';

import { Icon, type IconName } from './icon';

type WalletChipProps = {
  name: string;
  icon: IconName;
  /** onCard: di atas kartu saldo hijau. outline: bergaris tipis di latar layar. */
  variant: 'onCard' | 'outline';
  onPress?: () => void;
};

/** Pemilih dompet berbentuk kapsul: ikon, nama, panah bawah. */
export function WalletChip({ name, icon, variant, onPress }: WalletChipProps) {
  const { t } = useTranslation();
  const c = usePalette();
  const onCard = variant === 'onCard';
  const color = onCard ? balanceCard.text : c.text;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('HOME.SWITCH_WALLET', { wallet: name })}
      onPress={onPress}
      className={`flex-row items-center gap-1.5 rounded-pill py-1.5 pl-2.5 pr-[9px] active:opacity-80 ${
        onCard ? '' : 'border border-line'
      }`}
      style={onCard ? { backgroundColor: balanceCard.inner } : undefined}
    >
      <Icon name={icon} color={color} size={16} />
      <Text className="text-[13px] font-medium" style={{ color }}>
        {name}
      </Text>
      <Icon name="chevD" color={color} size={15} />
    </Pressable>
  );
}
