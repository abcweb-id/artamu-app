import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useInputSheet } from '@/stores/input-sheet-store';
import { usePalette } from '@/theme/use-palette';

import { Icon } from './ui/icon';

/** Rute tombol tambah di tengah: tidak membuka layar, hanya lembar input. */
const ADD_ROUTE = 'add';

/**
 * Bottom bar sesuai prototipe: tab aktif hijau dengan garis pendek di tepi atas,
 * tombol tambah kotak membulat yang naik di atas bar. Ikon aktif bold, lainnya regular.
 */
export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const c = usePalette();
  const insets = useSafeAreaInsets();
  const showSheet = useInputSheet((s) => s.show);

  return (
    <View
      className="flex-row gap-1 border-t border-line bg-surface px-2"
      style={{ paddingBottom: Math.max(insets.bottom, 12) }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.title ?? route.name;

        if (route.name === ADD_ROUTE) {
          return (
            <View key={route.key} className="flex-1 items-center">
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={options.tabBarAccessibilityLabel}
                onPress={showSheet}
                className="-mt-[22px] h-[60px] w-[60px] items-center justify-center rounded-[18px] bg-primary active:scale-95"
                // Satu-satunya elemen dengan bayangan (pedoman merek): cincin sewarna latar layar
                // memisahkan tombol dari isi di belakangnya.
                style={{ boxShadow: `0 0 0 5px ${c.canvas}, 0 6px 14px -4px ${c.primary}8C` }}
              >
                <Icon name="plus" color={c['on-primary']} size={28} />
              </Pressable>
            </View>
          );
        }

        const focused = state.index === index;
        const color = focused ? c.primary : c.muted;
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) navigation.navigate(route.name, route.params);
        };

        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={label}
            onPress={onPress}
            className="flex-1 items-center gap-1 pb-1.5 pt-3"
          >
            {focused ? (
              <View className="absolute -top-px h-[3px] w-7 rounded-b-[3px] bg-primary" />
            ) : null}
            {options.tabBarIcon?.({ focused, color, size: 24 })}
            <Text
              numberOfLines={1}
              className={`text-[11px] leading-[14px] ${focused ? 'font-semibold text-primary' : 'font-medium text-muted'}`}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
