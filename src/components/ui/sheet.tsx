import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { useCallback, useEffect, useRef, type ReactNode } from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { usePalette } from '@/theme/use-palette';

type SheetProps = {
  open: boolean;
  /** Dipanggil saat lembar tertutup, dari tombol, geser ke bawah, atau ketuk latar. */
  onClose: () => void;
  title?: string;
  children: ReactNode;
};

/** Lembar bawah: sudut 24, pegangan 38×4, latar gelap 50 persen di belakangnya. */
export function Sheet({ open, onClose, title, children }: SheetProps) {
  const ref = useRef<BottomSheetModal>(null);
  const c = usePalette();
  const insets = useSafeAreaInsets();

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

  const backdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.5} />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={ref}
      onDismiss={() => {
        // Ditutup dari lembar itu sendiri: jangan panggil dismiss() lagi.
        presented.current = false;
        onClose();
      }}
      backdropComponent={backdrop}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      backgroundStyle={{ backgroundColor: c.canvas, borderRadius: 24 }}
      handleIndicatorStyle={{ backgroundColor: c.line, width: 38, height: 4 }}
    >
      <BottomSheetView>
        {/* className tidak terbaca di BottomSheetView, jadi jarak dipasang di View biasa. */}
        <View className="px-5 pt-1" style={{ paddingBottom: insets.bottom + 16 }}>
          {title ? (
            <Text className="mb-2 text-[17px] font-semibold leading-6 text-text">{title}</Text>
          ) : null}
          {children}
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
}
