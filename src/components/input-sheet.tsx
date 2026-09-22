import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { useInputSheet } from '@/stores/input-sheet-store';
import { usePalette } from '@/theme/use-palette';

export function InputSheet() {
  const ref = useRef<BottomSheetModal>(null);
  const { open, hide } = useInputSheet();
  const { t } = useTranslation();
  const c = usePalette();

  // dismiss() pada modal yang belum pernah dibuka membuatnya tertahan di status
  // "sedang ditutup" dan present() berikutnya diabaikan, jadi hanya tutup yang sedang terbuka.
  const presented = useRef(false);
  useEffect(() => {
    if (open) {
      ref.current?.present();
      presented.current = true;
    } else if (presented.current) {
      ref.current?.dismiss();
      presented.current = false;
    }
  }, [open]);

  return (
    <BottomSheetModal
      ref={ref}
      onDismiss={() => {
        // Ditutup dari lembar itu sendiri (geser ke bawah): jangan panggil dismiss() lagi.
        presented.current = false;
        hide();
      }}
      backgroundStyle={{ backgroundColor: c.surface }}
      handleIndicatorStyle={{ backgroundColor: c.line }}
    >
      <BottomSheetView>
        {/* className tidak terbaca di BottomSheetView, jadi jarak dipasang di View biasa. */}
        <View className="px-5 pb-10 pt-2">
          <Text className="font-display text-xl text-text">{t('SHEET.NEW_TRANSACTION')}</Text>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
}
