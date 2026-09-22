import { useTranslation } from 'react-i18next';
import { Text, TextInput, View, type TextInputProps } from 'react-native';

import { formatAmount, parseAmount } from '@/lib/money';
import { usePalette } from '@/theme/use-palette';

type MoneyInputProps = Omit<TextInputProps, 'value' | 'onChangeText'> & {
  value: number;
  onChangeValue: (value: number) => void;
};

/** Isian nominal rupiah: awalan Rp, angka dikelompokkan dengan titik, hanya bilangan bulat. */
export function MoneyInput({ value, onChangeValue, ...rest }: MoneyInputProps) {
  const { t } = useTranslation();
  const c = usePalette();
  return (
    <View className="flex-row items-center rounded-xl border border-line bg-surface pl-3">
      <Text className="text-sm text-muted">{t('COMMON.CURRENCY')}</Text>
      <TextInput
        keyboardType="number-pad"
        placeholder="0"
        placeholderTextColor={c.muted}
        value={value ? formatAmount(value) : ''}
        onChangeText={(text) => onChangeValue(parseAmount(text))}
        className="flex-1 py-2.5 pl-2 pr-3 font-display text-base text-text"
        {...rest}
      />
    </View>
  );
}
