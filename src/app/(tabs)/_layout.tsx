import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import type { ColorValue } from 'react-native';

import { InputSheet } from '@/components/input-sheet';
import { TabBar } from '@/components/tab-bar';
import { Icon, type IconName } from '@/components/ui/icon';

function tabIcon(name: IconName) {
  // TabBar selalu mengirim warna palette berupa string.
  function TabIcon({ color }: { color: ColorValue }) {
    return <Icon name={name} color={color as string} />;
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
          options={{ title: t('tabs.home'), tabBarIcon: tabIcon('home') }}
        />
        <Tabs.Screen
          name="transaksi"
          options={{ title: t('tabs.transactions'), tabBarIcon: tabIcon('list') }}
        />
        {/* Tekan dicegat TabBar untuk membuka lembar input; layarnya tidak pernah tampil. */}
        <Tabs.Screen name="tambah" options={{ tabBarAccessibilityLabel: t('tabs.add') }} />
        <Tabs.Screen
          name="pengaturan"
          options={{ title: t('tabs.settings'), tabBarIcon: tabIcon('settings') }}
        />
        <Tabs.Screen
          name="akun"
          options={{ title: t('tabs.account'), tabBarIcon: tabIcon('user') }}
        />
      </Tabs>
      <InputSheet />
    </>
  );
}
