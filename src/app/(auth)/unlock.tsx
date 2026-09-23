import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { Screen } from '@/components/screen';
import { Button } from '@/components/ui/button';
import { IconMark } from '@/components/ui/icon-mark';
import { ForgotPinSheets } from '@/features/pin/forgot-pin-sheets';
import { PinDots } from '@/features/pin/pin-dots';
import { PinPad } from '@/features/pin/pin-pad';
import { usePinEntry } from '@/features/pin/use-pin-entry';
import { authenticateWithBiometrics } from '@/lib/biometrics';
import { MAX_PIN_ATTEMPTS, useAppStore } from '@/stores/app-store';

/** Sisa detik penguncian, diperbarui tiap seperempat detik. */
function useSecondsLeft(until: number | null, onDone: () => void) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!until) return;
    const timer = setInterval(() => {
      const t = Date.now();
      setNow(t);
      if (t >= until) onDone();
    }, 250);
    return () => clearInterval(timer);
  }, [until, onDone]);
  return until ? Math.max(0, Math.ceil((until - now) / 1000)) : 0;
}

/** 30 -> "0.30", seperti hitung mundur di prototipe. */
const formatCountdown = (s: number) => `${Math.floor(s / 60)}.${String(s % 60).padStart(2, '0')}`;

export default function Lock() {
  const { t } = useTranslation();
  const verifyPin = useAppStore((s) => s.verifyPin);
  const lockedUntil = useAppStore((s) => s.lockedUntil);
  const clearPinLock = useAppStore((s) => s.clearPinLock);
  const biometricEnabled = useAppStore((s) => s.biometricEnabled);
  const unlock = useAppStore((s) => s.unlock);
  const [error, setError] = useState('');
  const [forgotOpen, setForgotOpen] = useState(false);
  const secondsLeft = useSecondsLeft(lockedUntil, clearPinLock);
  const blocked = secondsLeft > 0;

  const { pin, press, remove } = usePinEntry(async (entered) => {
    const result = await verifyPin(entered);
    setError(
      result === 'wrong'
        ? t('PIN.WRONG', { count: MAX_PIN_ATTEMPTS - useAppStore.getState().failedAttempts })
        : '',
    );
  });

  const unlockWithBiometrics = async () => {
    const ok = await authenticateWithBiometrics(t('PIN.BIOMETRIC_PROMPT'), t('PIN.USE_PIN'));
    if (ok) unlock();
  };

  const forgot = (
    <>
      <Button variant="link" label={t('PIN.FORGOT')} onPress={() => setForgotOpen(true)} />
      <ForgotPinSheets open={forgotOpen} onClose={() => setForgotOpen(false)} />
    </>
  );

  if (blocked) {
    return (
      <Screen pageTitle={t('PIN.LOCKED_TITLE')} bottomInset className="items-center pb-[30px]">
        <View className="mt-4">
          <IconMark name="lock" tone="danger" />
        </View>
        <Text className="mb-1 mt-[22px] font-display text-[21px] leading-[26px] text-text">
          {t('PIN.LOCKED_TITLE')}
        </Text>
        <Text className="max-w-[230px] text-center text-[13.5px] leading-5 text-muted">
          {t('PIN.LOCKED_SUBTITLE')}
        </Text>
        <Text
          accessibilityRole="timer"
          className="mb-0.5 mt-[22px] font-display text-[44px] text-text"
        >
          {formatCountdown(secondsLeft)}
        </Text>
        <Text className="text-[12.5px] leading-[19px] text-muted">{t('PIN.LOCKED_HINT')}</Text>
        <View className="mt-3.5">{forgot}</View>
        <PinPad onDigit={press} onDelete={remove} disabled />
      </Screen>
    );
  }

  return (
    <Screen pageTitle={t('PIN.LOGIN_TITLE')} bottomInset className="items-center pb-[30px]">
      <Image
        source={require('@/assets/brand/logo-mark.png')}
        style={{ width: 64, height: 64, marginTop: 12 }}
        contentFit="contain"
        accessibilityLabel="Logo Artamu"
      />
      <Text className="mb-1 mt-[22px] font-display text-[21px] leading-[26px] text-text">
        {t('PIN.LOGIN_TITLE')}
      </Text>
      <Text className="text-[13.5px] leading-5 text-muted">{t('PIN.LOGIN_SUBTITLE')}</Text>
      <PinDots filled={pin.length} />
      <Text
        accessibilityRole="alert"
        className="mt-3 min-h-5 text-center text-[12.5px] text-expense"
      >
        {error}
      </Text>
      {forgot}
      <PinPad
        onDigit={press}
        onDelete={remove}
        // Tombol sidik jari hanya tampil kalau pengguna mengaktifkannya.
        onBiometric={biometricEnabled ? unlockWithBiometrics : undefined}
      />
    </Screen>
  );
}
