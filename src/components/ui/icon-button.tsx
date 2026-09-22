import { Pressable, View } from 'react-native';

import { usePalette } from '@/theme/use-palette';

import { Icon, type IconName } from './icon';

type IconButtonProps = {
  icon: IconName;
  label: string;
  onPress?: () => void;
  /** Titik merah di pojok kanan atas, misalnya notifikasi belum dibaca. */
  badge?: boolean;
};

/** Tombol ikon 40×40 di kepala layar. */
export function IconButton({ icon, label, onPress, badge }: IconButtonProps) {
  const c = usePalette();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      className="h-10 w-10 items-center justify-center rounded-[13px] active:opacity-60"
    >
      <Icon name={icon} color={c.primary} size={22} />
      {badge ? (
        <View className="absolute right-[9px] top-[9px] h-[9px] w-[9px] rounded-full border-2 border-canvas bg-expense" />
      ) : null}
    </Pressable>
  );
}
