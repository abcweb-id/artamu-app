import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { ListRow } from '@/components/ui/list-row';
import { Sheet } from '@/components/ui/sheet';
import { authenticateWithBiometrics } from '@/lib/biometrics';
import { useAppStore } from '@/stores/app-store';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { useTransactionsStore } from '@/stores/transactions-store';
import { usePalette } from '@/theme/use-palette';

type ForgotPinSheetsProps = { open: boolean; onClose: () => void };

// BottomSheetTextInput memakai API TextInput yang tidak ada di react-native-web.
const SheetInput = Platform.OS === 'web' ? TextInput : BottomSheetTextInput;

/** Lembar Lupa PIN dan lembar konfirmasi Hapus semua data. */
export function ForgotPinSheets({ open, onClose }: ForgotPinSheetsProps) {
  const { t } = useTranslation();
  const c = usePalette();
  const biometricEnabled = useAppStore((s) => s.biometricEnabled);
  const [wipeOpen, setWipeOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  // Ganti key tiap lembar dibuka supaya kolom kosong lagi.
  const [inputKey, setInputKey] = useState(0);
  const [error, setError] = useState('');
  const word = t('WIPE.WORD');

  const useBiometric = async () => {
    const ok = await authenticateWithBiometrics(t('FORGOT_PIN.PROMPT'), t('COMMON.CANCEL'));
    if (!ok) return;
    onClose();
    router.push('/reset-pin');
  };

  const openWipe = () => {
    onClose();
    setConfirmText('');
    setInputKey((k) => k + 1);
    setError('');
    setWipeOpen(true);
  };

  const wipe = () => {
    if (confirmText.trim().toUpperCase() !== word) {
      setError(t('WIPE.ERROR', { word }));
      return;
    }
    // Sementara hanya data di memori. Nanti juga menghapus database, berkas foto struk,
    // dan isi expo-secure-store.
    setWipeOpen(false);
    useOnboardingStore.getState().reset();
    useTransactionsStore.getState().reset();
    useAppStore.getState().reset();
  };

  return (
    <>
      <Sheet open={open} onClose={onClose} title={t('FORGOT_PIN.TITLE')}>
        <Text className="mb-1.5 text-sm leading-[21px] text-text">{t('FORGOT_PIN.BODY')}</Text>
        {biometricEnabled ? (
          <ListRow
            icon="finger"
            title={t('FORGOT_PIN.BIOMETRIC')}
            subtitle={t('FORGOT_PIN.BIOMETRIC_HINT')}
            onPress={useBiometric}
          />
        ) : null}
        <ListRow
          icon="trash"
          tone="danger"
          title={t('FORGOT_PIN.WIPE')}
          subtitle={t('FORGOT_PIN.WIPE_HINT')}
          onPress={openWipe}
        />
        <Button variant="secondary" label={t('COMMON.CANCEL')} className="mt-3" onPress={onClose} />
      </Sheet>

      <Sheet open={wipeOpen} onClose={() => setWipeOpen(false)} title={t('WIPE.TITLE')}>
        <Text className="text-sm leading-[21px] text-text">{t('WIPE.BODY')}</Text>
        <Text className="mb-[5px] mt-3 text-[12.5px] text-muted">{t('WIPE.LABEL', { word })}</Text>
        {/* BottomSheetTextInput menjaga lembar tetap di atas keyboard. className tidak terbaca di sini. */}
        {/* Tidak terkontrol (tanpa value): isi lembar dirender ulang lewat portal di tiap
            ketikan, dan value yang dikontrol membuat huruf hilang dan kursor meloncat. */}
        <SheetInput
          key={inputKey}
          accessibilityLabel={t('WIPE.LABEL', { word })}
          placeholder={word}
          placeholderTextColor={c.muted}
          autoCapitalize="characters"
          autoCorrect={false}
          onChangeText={(v) => {
            setConfirmText(v);
            setError('');
          }}
          style={{
            backgroundColor: c.surface,
            borderColor: c.line,
            borderWidth: 1,
            borderRadius: 12,
            paddingHorizontal: 12,
            paddingVertical: 13,
            fontSize: 15,
            color: c.text,
          }}
        />
        <Text
          accessibilityRole="alert"
          className="mt-2 min-h-[18px] text-center text-[12.5px] text-expense"
        >
          {error}
        </Text>
        <View className="mt-1 flex-row gap-2.5">
          <Button
            variant="secondary"
            label={t('COMMON.CANCEL')}
            className="flex-1"
            onPress={() => setWipeOpen(false)}
          />
          <Button variant="danger" label={t('WIPE.CONFIRM')} className="flex-1" onPress={wipe} />
        </View>
      </Sheet>
    </>
  );
}
