import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { useAppStore } from '@/stores/app-store';
import { usePalette } from '@/theme/use-palette';

import { Button } from './button';
import { Icon } from './icon';

/** Petunjuk sekali lihat dengan tombol Mengerti. Hilang permanen setelah ditutup. */
export function HintBanner({ hintKey, text }: { hintKey: string; text: string }) {
  const { t } = useTranslation();
  const c = usePalette();
  const dismissed = useAppStore((s) => s.dismissedHints.includes(hintKey));
  const dismissHint = useAppStore((s) => s.dismissHint);
  if (dismissed) return null;

  return (
    <View className="mt-3.5 flex-row items-center gap-2.5 rounded-xl bg-key px-3 py-2.5">
      <Icon name="check" color={c.accent} size={18} />
      <Text className="flex-1 text-[13px] leading-[18px] text-text">{text}</Text>
      <Button
        variant="link"
        label={t('HOME.GOT_IT')}
        className="px-0 py-0.5 pl-2"
        onPress={() => dismissHint(hintKey)}
      />
    </View>
  );
}
