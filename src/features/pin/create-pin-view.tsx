import { Image } from 'expo-image';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';

import { Screen } from '@/components/screen';

import { PinDots } from './pin-dots';
import { PinPad } from './pin-pad';
import { usePinEntry } from './use-pin-entry';

type CreatePinViewProps = {
  /** "Buat PIN" saat onboarding, "Buat PIN baru" setelah Lupa PIN. */
  variant: 'first' | 'reset';
  /** Dipanggil setelah PIN kedua sama dengan yang pertama. */
  onCreated: (pin: string) => void;
};

/** Buat PIN lalu Ulangi PIN di satu layar. Kalau tidak sama, kembali ke awal. */
export function CreatePinView({ variant, onCreated }: CreatePinViewProps) {
  const { t } = useTranslation();
  const [first, setFirst] = useState<string | null>(null);
  const [error, setError] = useState('');

  const { pin, press, remove } = usePinEntry((entered) => {
    if (first === null) {
      setFirst(entered);
      setError('');
    } else if (entered === first) {
      onCreated(entered);
    } else {
      setFirst(null);
      setError(t('PIN.MISMATCH'));
    }
  });

  const confirming = first !== null;
  const title = t(
    confirming
      ? 'PIN.CONFIRM_TITLE'
      : variant === 'reset'
        ? 'PIN.CREATE_NEW_TITLE'
        : 'PIN.CREATE_TITLE',
  );

  return (
    <Screen pageTitle={title} bottomInset className="items-center pb-[30px]">
      <Image
        source={require('@/assets/brand/logo-mark.png')}
        style={{ width: 64, height: 64, marginTop: 12 }}
        contentFit="contain"
        accessibilityLabel="Logo Artamu"
      />
      <Text className="mb-1 mt-[22px] font-display text-[21px] leading-[26px] text-text">
        {title}
      </Text>
      <Text className="text-[13.5px] leading-5 text-muted">
        {t(confirming ? 'PIN.CONFIRM_SUBTITLE' : 'PIN.CREATE_SUBTITLE')}
      </Text>
      <PinDots filled={pin.length} />
      <Text
        accessibilityRole="alert"
        className="mb-2 mt-[18px] min-h-8 text-center text-[12.5px] text-expense"
      >
        {error}
      </Text>
      <PinPad onDigit={press} onDelete={remove} />
    </Screen>
  );
}
