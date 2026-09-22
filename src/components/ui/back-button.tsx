import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';

import { usePalette } from '@/theme/use-palette';

import { Icon } from './icon';

/** Tombol kembali di kiri atas layar tanpa bottom bar. Area sentuh 40×40. */
export function BackButton({ onPress }: { onPress?: () => void }) {
  const { t } = useTranslation();
  const c = usePalette();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('COMMON.BACK')}
      onPress={onPress ?? (() => router.back())}
      className="-ml-2.5 h-10 w-10 items-center justify-center rounded-[13px] active:opacity-60">
      <Icon name="chevL" color={c.primary} />
    </Pressable>
  );
}
