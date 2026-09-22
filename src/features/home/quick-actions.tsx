import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import type { IconName } from '@/components/ui/icon';
import { Icon } from '@/components/ui/icon';
import { usePalette } from '@/theme/use-palette';

const ACTIONS: { key: 'TRANSFER' | 'BUDGET' | 'REPORT' | 'RECURRING' | 'DEBTS'; icon: IconName }[] =
  [
    { key: 'TRANSFER', icon: 'swap' },
    { key: 'BUDGET', icon: 'pie' },
    { key: 'REPORT', icon: 'chart' },
    { key: 'RECURRING', icon: 'repeat' },
    { key: 'DEBTS', icon: 'user' },
  ];

/** Lima pintasan di bawah kartu saldo. Layar tujuannya belum dibuat. */
export function QuickActions() {
  const { t } = useTranslation();
  const c = usePalette();
  return (
    <View className="mt-[18px] flex-row gap-1">
      {ACTIONS.map((a) => (
        <Pressable
          key={a.key}
          accessibilityRole="button"
          className="flex-1 items-center gap-1.5 rounded-[14px] py-1 active:opacity-70"
        >
          <View className="h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft">
            <Icon name={a.icon} color={c['primary-ink']} size={21} />
          </View>
          <Text numberOfLines={1} className="text-[11.5px] text-text">
            {t(`HOME.QUICK.${a.key}`)}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
