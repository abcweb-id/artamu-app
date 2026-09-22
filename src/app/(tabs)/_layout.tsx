import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { InputSheet } from '@/components/input-sheet';
import { Icon } from '@/components/ui/icon';
import { useInputSheet } from '@/stores/input-sheet-store';
import { usePalette } from '@/theme/use-palette';

export default function TabLayout() {
  const { t } = useTranslation();
  const c = usePalette();
  const showSheet = useInputSheet((s) => s.show);

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: c.text,
          tabBarInactiveTintColor: c.muted,
          tabBarStyle: { backgroundColor: c.surface, borderTopColor: c.line },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: t('tabs.home'),
            tabBarIcon: ({ focused }) => <Icon name="home" color={focused ? c.text : c.muted} />,
          }}
        />
        <Tabs.Screen
          name="transaksi"
          options={{
            title: t('tabs.transactions'),
            tabBarIcon: ({ focused }) => <Icon name="list" color={focused ? c.text : c.muted} />,
          }}
        />
        <Tabs.Screen
          name="tambah"
          options={{
            title: '',
            tabBarAccessibilityLabel: t('tabs.add'),
            // Satu-satunya elemen dengan bayangan (pedoman merek).
            tabBarIcon: () => (
              <View
                className="h-14 w-14 items-center justify-center rounded-[18px] bg-primary"
                style={{ marginTop: -20, elevation: 6 }}
              >
                <Icon name="plus" color={c['on-primary']} size={28} />
              </View>
            ),
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              showSheet();
            },
          }}
        />
        <Tabs.Screen
          name="pengaturan"
          options={{
            title: t('tabs.settings'),
            tabBarIcon: ({ focused }) => (
              <Icon name="settings" color={focused ? c.text : c.muted} />
            ),
          }}
        />
        <Tabs.Screen
          name="akun"
          options={{
            title: t('tabs.account'),
            tabBarIcon: ({ focused }) => <Icon name="user" color={focused ? c.text : c.muted} />,
          }}
        />
      </Tabs>
      <InputSheet />
    </>
  );
}
