import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { Screen } from '@/components/screen';
import { Button } from '@/components/ui/button';
import type { IconName } from '@/components/ui/icon';
import { IconBadge } from '@/components/ui/icon-badge';
import { useAppStore } from '@/stores/app-store';

const points: { icon: IconName; key: 'fast' | 'local' | 'recurring' }[] = [
  { icon: 'bolt', key: 'fast' },
  { icon: 'lock', key: 'local' },
  { icon: 'repeat', key: 'recurring' },
];

export default function Welcome() {
  const { t } = useTranslation();
  const setOnboarded = useAppStore((s) => s.setOnboarded);

  return (
    <Screen bottomInset className="pb-[30px]">
      <View className="mt-9 flex-row items-center gap-2.5">
        <Image
          source={require('@/assets/brand/logo-mark.png')}
          style={{ width: 46, height: 46 }}
          contentFit="contain"
          accessibilityLabel="Logo Artamu"
        />
        <Text className="font-display-xb text-xl text-primary-ink">ARTAMU</Text>
      </View>

      <Text className="my-[22px] max-w-[220px] font-display text-[25px] leading-[30px] text-text">
        {t('onboarding.title')}
      </Text>

      {points.map((p) => (
        <View key={p.key} className="flex-row items-center gap-3.5 py-3">
          <IconBadge name={p.icon} />
          <View className="flex-1">
            <Text className="text-[15px] font-semibold leading-[22px] text-text">
              {t(`onboarding.points.${p.key}.title`)}
            </Text>
            <Text className="text-[13px] leading-[19px] text-muted">
              {t(`onboarding.points.${p.key}.subtitle`)}
            </Text>
          </View>
        </View>
      ))}

      <View className="mt-auto">
        {/* Sementara langsung ke Beranda, sampai layar nama panggilan dan Buat PIN dibuat. */}
        <Button label={t('onboarding.start')} onPress={() => setOnboarded(true)} />
        {/* Cadangan dan pemulihan belum dibuat. */}
        <Button variant="link" label={t('onboarding.restore')} className="mt-2.5" />
      </View>
    </Screen>
  );
}
