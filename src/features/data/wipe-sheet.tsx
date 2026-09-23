import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Sheet } from '@/components/ui/sheet';
import { wipeDatabase } from '@/db/repo/wipe';
import { notifyDbChanged } from '@/db/use-db-query';
import { clearPin } from '@/lib/pin';
import { useAppStore } from '@/stores/app-store';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { useSettingsStore } from '@/stores/settings-store';
import { usePalette } from '@/theme/use-palette';

// BottomSheetTextInput memakai API TextInput yang tidak ada di react-native-web.
const SheetInput = Platform.OS === 'web' ? TextInput : BottomSheetTextInput;

/**
 * Hapus semua data dan kembali ke layar sambutan: isi database, hash PIN, lalu store.
 * Kategori dan pengaturan bawaan dikembalikan seperti setelah migrasi.
 */
export async function wipeAllData(db: SQLiteDatabase) {
  await wipeDatabase(db);
  await clearPin();
  useOnboardingStore.getState().reset();
  useSettingsStore.getState().reset();
  useAppStore.getState().reset();
  notifyDbChanged();
}

/** Lembar konfirmasi Hapus semua data: ketik HAPUS (en: DELETE) untuk melanjutkan. */
export function WipeSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  return (
    <Sheet open={open} onClose={onClose} title={t('WIPE.TITLE')}>
      {/* Isi dipasang ulang tiap lembar dibuka, jadi kolom dan pesan selalu kosong. */}
      <WipeForm key={String(open)} onCancel={onClose} />
    </Sheet>
  );
}

function WipeForm({ onCancel }: { onCancel: () => void }) {
  const { t } = useTranslation();
  const c = usePalette();
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState('');
  const db = useSQLiteContext();
  const word = t('WIPE.WORD');

  const wipe = () => {
    if (confirmText.trim().toUpperCase() !== word) {
      setError(t('WIPE.ERROR', { word }));
      return;
    }
    onCancel();
    wipeAllData(db);
  };

  return (
    <>
      <Text className="text-sm leading-[21px] text-text">{t('WIPE.BODY')}</Text>
      <Text className="mb-[5px] mt-3 text-[12.5px] text-muted">{t('WIPE.LABEL', { word })}</Text>
      {/* Tidak terkontrol (tanpa value): isi lembar dirender ulang lewat portal di tiap
          ketikan, dan value yang dikontrol membuat huruf hilang dan kursor meloncat. */}
      <SheetInput
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
          onPress={onCancel}
        />
        <Button variant="danger" label={t('WIPE.CONFIRM')} className="flex-1" onPress={wipe} />
      </View>
    </>
  );
}
