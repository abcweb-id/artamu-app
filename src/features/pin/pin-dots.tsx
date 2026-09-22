import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { PIN_LENGTH } from './constants';

/** Empat titik: kosong bergaris, terisi hijau. */
export function PinDots({ filled }: { filled: number }) {
  const { t } = useTranslation();
  return (
    <View
      accessibilityLabel={t('PIN.PROGRESS', { count: filled })}
      className="mb-1 mt-6 flex-row gap-4"
    >
      {Array.from({ length: PIN_LENGTH }, (_, i) => (
        <View
          key={i}
          className={`h-3.5 w-3.5 rounded-full border-[1.5px] ${
            i < filled ? 'border-primary bg-primary' : 'border-muted'
          }`}
        />
      ))}
    </View>
  );
}
