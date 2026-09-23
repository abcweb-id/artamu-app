import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { Screen } from '@/components/screen';
import { BackButton } from '@/components/ui/back-button';
import { CreatePinView } from '@/features/pin/create-pin-view';
import { PinDots } from '@/features/pin/pin-dots';
import { PinPad } from '@/features/pin/pin-pad';
import { usePinEntry } from '@/features/pin/use-pin-entry';
import { checkPin } from '@/lib/pin';
import { useAppStore } from '@/stores/app-store';

/**
 * Ganti PIN dari Pengaturan: PIN lama dulu, lalu Buat PIN baru dan Ulangi.
 * Berbeda dari prototipe, PIN lama benar-benar diperiksa.
 */
export default function ChangePin() {
  const { t } = useTranslation();
  const setPin = useAppStore((s) => s.setPin);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');

  const entry = usePinEntry(async (entered) => {
    if (await checkPin(entered)) {
      setVerified(true);
      setError('');
    } else {
      setError(t('PIN.OLD_WRONG'));
    }
  });

  if (verified) {
    return (
      <CreatePinView
        variant="reset"
        onBack={() => router.back()}
        onCreated={async (next) => {
          await setPin(next);
          router.back();
        }}
      />
    );
  }

  return (
    <Screen pageTitle={t('PIN.OLD_TITLE')} bottomInset className="items-center pb-[30px]">
      <View className="absolute left-5 top-1.5">
        <BackButton />
      </View>
      <Image
        source={require('@/assets/brand/logo-mark.png')}
        style={{ width: 64, height: 64, marginTop: 12 }}
        contentFit="contain"
        accessibilityLabel="Logo Artamu"
      />
      <Text className="mb-1 mt-[22px] font-display text-[21px] leading-[26px] text-text">
        {t('PIN.OLD_TITLE')}
      </Text>
      <Text className="text-[13.5px] leading-5 text-muted">{t('PIN.OLD_SUBTITLE')}</Text>
      <PinDots filled={entry.pin.length} />
      <Text
        accessibilityRole="alert"
        className="mb-2 mt-[18px] min-h-8 text-center text-[12.5px] text-expense"
      >
        {error}
      </Text>
      <PinPad onDigit={entry.press} onDelete={entry.remove} />
    </Screen>
  );
}
