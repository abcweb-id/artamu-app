import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';

import { Screen } from '@/components/screen';
import { PinDots } from '@/features/pin/pin-dots';
import { PinPad } from '@/features/pin/pin-pad';
import { usePinEntry } from '@/features/pin/use-pin-entry';
import { useAppStore } from '@/stores/app-store';

/** Buat PIN lalu Ulangi PIN di satu layar. Kalau tidak sama, kembali ke awal. */
export default function CreatePin() {
  const { t } = useTranslation();
  const setPin = useAppStore((s) => s.setPin);
  const [first, setFirst] = useState<string | null>(null);
  const [error, setError] = useState('');

  const { pin, press, remove } = usePinEntry((entered) => {
    if (first === null) {
      setFirst(entered);
      setError('');
    } else if (entered === first) {
      setPin(entered);
      router.push('/notifications');
    } else {
      setFirst(null);
      setError(t('PIN.MISMATCH'));
    }
  });

  const confirming = first !== null;

  return (
    <Screen
      pageTitle={t(confirming ? 'PIN.CONFIRM_TITLE' : 'PIN.CREATE_TITLE')}
      bottomInset
      className="items-center pb-[30px]"
    >
      <Image
        source={require('@/assets/brand/logo-mark.png')}
        style={{ width: 64, height: 64, marginTop: 12 }}
        contentFit="contain"
        accessibilityLabel="Logo Artamu"
      />
      <Text className="mb-1 mt-[22px] font-display text-[21px] leading-[26px] text-text">
        {t(confirming ? 'PIN.CONFIRM_TITLE' : 'PIN.CREATE_TITLE')}
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
