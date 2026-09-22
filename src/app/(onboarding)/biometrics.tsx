import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { Screen } from '@/components/screen';
import { Button } from '@/components/ui/button';
import { IconMark } from '@/components/ui/icon-mark';
import { authenticateWithBiometrics } from '@/lib/biometrics';
import { useAppStore } from '@/stores/app-store';

/**
 * Tawaran sidik jari setelah PIN dibuat. Tidak ada di wireframe: ditambahkan supaya
 * sidik jari hanya aktif atas pilihan pengguna sendiri (bukan otomatis).
 */
export default function BiometricOffer() {
  const { t } = useTranslation();
  const setBiometricEnabled = useAppStore((s) => s.setBiometricEnabled);
  const [error, setError] = useState('');

  const enable = async () => {
    const ok = await authenticateWithBiometrics(t('BIOMETRIC_OFFER.PROMPT'), t('COMMON.CANCEL'));
    if (!ok) {
      setError(t('BIOMETRIC_OFFER.FAILED'));
      return;
    }
    setBiometricEnabled(true);
    router.push('/notifications');
  };

  return (
    <Screen pageTitle={t('BIOMETRIC_OFFER.PAGE_TITLE')} bottomInset className="pb-[30px]">
      <View className="mt-[34px]">
        <IconMark name="finger" />
      </View>
      <Text className="mb-2 mt-[26px] font-display text-[25px] leading-[30px] text-text">
        {t('BIOMETRIC_OFFER.TITLE')}
      </Text>
      <Text className="text-sm leading-[21px] text-muted">{t('BIOMETRIC_OFFER.SUBTITLE')}</Text>
      <Text accessibilityRole="alert" className="mt-3 min-h-[18px] text-[12.5px] text-expense">
        {error}
      </Text>
      <View className="mt-auto">
        <Button label={t('BIOMETRIC_OFFER.ENABLE')} onPress={enable} />
        <Button
          variant="link"
          label={t('BIOMETRIC_OFFER.LATER')}
          className="mt-2.5"
          onPress={() => router.push('/notifications')}
        />
      </View>
    </Screen>
  );
}
