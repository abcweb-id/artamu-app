import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import type { ColorValue } from 'react-native';

import { InputSheet } from '@/components/input-sheet';
import { TabBar } from '@/components/tab-bar';
import { Icon, type IconName } from '@/components/ui/icon';

/** Tab aktif memakai bobot ini, tab lain tetap regular (garis). */
const ACTIVE_WEIGHT = 'bold';

function tabIcon(name: IconName) {
  // TabBar selalu mengirim warna palette berupa string.
  function TabIcon({ color, focused }: { color: ColorValue; focused: boolean }) {
    return (
      <Icon name={name} color={color as string} weight={focused ? ACTIVE_WEIGHT : 'regular'} />
    );
  }
  return TabIcon;
}

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <>
      <Tabs tabBar={(props) => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
        <Tabs.Screen
          name="index"
          options={{ title: t('TABS.HOME'), tabBarIcon: tabIcon('home') }}
        />
        <Tabs.Screen
          name="transaksi"
          options={{ title: t('TABS.TRANSACTIONS'), tabBarIcon: tabIcon('list') }}
        />
        {/* Tekan dicegat TabBar untuk membuka lembar input; layarnya tidak pernah tampil. */}
        <Tabs.Screen name="tambah" options={{ tabBarAccessibilityLabel: t('TABS.ADD') }} />
        <Tabs.Screen
          name="pengaturan"
          options={{ title: t('TABS.SETTINGS'), tabBarIcon: tabIcon('settings') }}
        />
        <Tabs.Screen
          name="akun"
          options={{ title: t('TABS.ACCOUNT'), tabBarIcon: tabIcon('user') }}
        />
      </Tabs>
      <InputSheet />
    </>
  );
}
