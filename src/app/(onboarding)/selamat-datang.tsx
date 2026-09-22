import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { Screen } from '@/components/screen';
import { Button } from '@/components/ui/button';
import type { IconName } from '@/components/ui/icon';
import { IconBadge } from '@/components/ui/icon-badge';

const points: { icon: IconName; key: 'FAST' | 'LOCAL' | 'RECURRING' }[] = [
  { icon: 'bolt', key: 'FAST' },
  { icon: 'lock', key: 'LOCAL' },
  { icon: 'repeat', key: 'RECURRING' },
];

export default function Welcome() {
  const { t } = useTranslation();

  return (
    <Screen pageTitle={t('WELCOME.PAGE_TITLE')} bottomInset className="pb-[30px]">
      <View className="mt-[30px] flex-row items-center gap-2.5">
        <Image
          source={require('@/assets/brand/logo-mark.png')}
          style={{ width: 46, height: 46 }}
          contentFit="contain"
          accessibilityLabel="Logo Artamu"
        />
        <Text className="font-display-xb text-xl text-primary-ink">ARTAMU</Text>
      </View>

      <Text className="my-[22px] max-w-[220px] font-display text-[25px] leading-[30px] text-text">
        {t('WELCOME.TITLE')}
      </Text>

      {points.map((p) => (
        <View key={p.key} className="flex-row items-center gap-3.5 py-3">
          <IconBadge name={p.icon} />
          <View className="flex-1">
            <Text className="text-[15px] font-semibold leading-[22px] text-text">
              {t(`WELCOME.POINTS.${p.key}.TITLE`)}
            </Text>
            <Text className="text-[13px] leading-[19px] text-muted">
              {t(`WELCOME.POINTS.${p.key}.SUBTITLE`)}
            </Text>
          </View>
        </View>
      ))}

      <View className="mt-auto">
        <Button label={t('WELCOME.START')} onPress={() => router.push('/nama')} />
        {/* Cadangan dan pemulihan belum dibuat. */}
        <Button variant="link" label={t('WELCOME.RESTORE')} className="mt-2.5" />
      </View>
    </Screen>
  );
}
