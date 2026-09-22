import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';

import { useInputSheet } from '@/stores/input-sheet-store';
import { usePalette } from '@/theme/use-palette';

export function InputSheet() {
  const ref = useRef<BottomSheetModal>(null);
  const { open, hide } = useInputSheet();
  const { t } = useTranslation();
  const c = usePalette();

  useEffect(() => {
    if (open) ref.current?.present();
    else ref.current?.dismiss();
  }, [open]);

  return (
    <BottomSheetModal
      ref={ref}
      onDismiss={hide}
      backgroundStyle={{ backgroundColor: c.surface }}
      handleIndicatorStyle={{ backgroundColor: c.line }}
    >
      <BottomSheetView className="px-4 pb-10 pt-2">
        <Text className="font-display text-xl text-text">{t('sheet.newTransaction')}</Text>
      </BottomSheetView>
    </BottomSheetModal>
  );
}
