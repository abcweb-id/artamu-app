import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { Screen } from '@/components/screen';
import { Button } from '@/components/ui/button';
import type { IconName } from '@/components/ui/icon';
import { IconBadge } from '@/components/ui/icon-badge';
import { IconMark } from '@/components/ui/icon-mark';
import { useAppStore } from '@/stores/app-store';

const POINTS: { icon: IconName; key: 'DAILY' | 'RECURRING' | 'DEBTS' }[] = [
  { icon: 'clock', key: 'DAILY' },
  { icon: 'repeat', key: 'RECURRING' },
  { icon: 'swap', key: 'DEBTS' },
];

export default function NotificationPermission() {
  const { t } = useTranslation();
  const setOnboarded = useAppStore((s) => s.setOnboarded);

  return (
    <Screen pageTitle={t('NOTIF_PERMISSION.PAGE_TITLE')} bottomInset className="pb-[30px]">
      <View className="mt-[34px]">
        <IconMark name="bell" />
      </View>
      <Text className="mb-2 mt-[26px] font-display text-[25px] leading-[30px] text-text">
        {t('NOTIF_PERMISSION.TITLE')}
      </Text>
      <Text className="mb-3 text-sm leading-[21px] text-muted">
        {t('NOTIF_PERMISSION.SUBTITLE')}
      </Text>
      {POINTS.map((p) => (
        <View key={p.key} className="flex-row items-center gap-3.5 py-[9px]">
          <IconBadge name={p.icon} size={36} />
          <Text className="flex-1 text-sm leading-[21px] text-text">
            {t(`NOTIF_PERMISSION.POINTS.${p.key}`)}
          </Text>
        </View>
      ))}
      <View className="mt-auto">
        {/* Permintaan izin sistem (expo-notifications) belum dipasang; keduanya lanjut ke Beranda. */}
        <Button label={t('NOTIF_PERMISSION.ALLOW')} onPress={() => setOnboarded(true)} />
        <Button
          variant="link"
          label={t('NOTIF_PERMISSION.LATER')}
          className="mt-2.5"
          onPress={() => setOnboarded(true)}
        />
      </View>
    </Screen>
  );
}
