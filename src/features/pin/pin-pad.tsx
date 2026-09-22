import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { usePalette } from '@/theme/use-palette';

type PinPadProps = {
  onDigit: (digit: string) => void;
  onDelete: () => void;
  /** Tampilkan tombol sidik jari di kiri bawah (hanya layar Masukkan PIN). */
  onBiometric?: () => void;
  /** Saat PIN terkunci: keypad pudar, tidak bisa ditekan, tanpa tombol samping. */
  disabled?: boolean;
};

const KEY = 'h-[72px] w-[72px] items-center justify-center rounded-full';

/** Keypad 3 kolom, tombol bulat 72 px. */
export function PinPad({ onDigit, onDelete, onBiometric, disabled }: PinPadProps) {
  const { t } = useTranslation();
  const c = usePalette();

  const digit = (n: string) => (
    <Pressable
      key={n}
      accessibilityRole="button"
      accessibilityLabel={n}
      disabled={disabled}
      onPress={() => onDigit(n)}
      className={`${KEY} bg-key active:bg-primary-soft`}
    >
      <Text className="text-[26px] text-text">{n}</Text>
    </Pressable>
  );
  const ghost = (label: string, icon: ReactNode, onPress: () => void) => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      className={`${KEY} active:bg-primary-soft`}
    >
      {icon}
    </Pressable>
  );
  const empty = <View className="h-[72px] w-[72px]" />;

  return (
    <View
      className={`mt-auto w-[268px] flex-row flex-wrap gap-x-[26px] gap-y-3.5 pb-1.5 ${
        disabled ? 'opacity-30' : ''
      }`}
      aria-hidden={disabled}
    >
      {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(digit)}
      {onBiometric && !disabled
        ? ghost(t('PIN.BIOMETRIC'), <Icon name="finger" color={c.primary} size={30} />, onBiometric)
        : empty}
      {digit('0')}
      {disabled
        ? empty
        : ghost(t('PIN.DELETE'), <Icon name="back" color={c.primary} size={26} />, onDelete)}
    </View>
  );
}
