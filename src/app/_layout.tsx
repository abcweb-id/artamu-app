import '@/global.css';
import '@/i18n';

import {
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/plus-jakarta-sans';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { useEffect } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { DATABASE_NAME, migrateDbIfNeeded } from '@/db/client';
import { useAppStore } from '@/stores/app-store';
import { palette, themeVars } from '@/theme/tokens';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });
  const { colorScheme } = useColorScheme();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';
  // Kalau font gagal dimuat, lanjut dengan font sistem daripada tertahan di layar pembuka.
  const ready = fontsLoaded || fontError != null;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const navTheme = {
    ...base,
    colors: {
      ...base.colors,
      primary: palette[scheme].primary,
      background: palette[scheme].canvas,
      card: palette[scheme].surface,
      text: palette[scheme].text,
      border: palette[scheme].line,
    },
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* vars() hanya terbaca oleh komponen yang dibungkus NativeWind, jadi dipasang di View. */}
      <View style={[{ flex: 1 }, themeVars[scheme]]}>
        <SQLiteProvider databaseName={DATABASE_NAME} onInit={migrateDbIfNeeded}>
          <ThemeProvider value={navTheme}>
            <BottomSheetModalProvider>
              <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
              <RootStack />
            </BottomSheetModalProvider>
          </ThemeProvider>
        </SQLiteProvider>
      </View>
    </GestureHandlerRootView>
  );
}

/**
 * Membaca store sendiri, bukan lewat RootLayout. Saat guard dihitung di RootLayout,
 * render ulangnya tertahan di salah satu provider di atas dan Stack tetap memakai
 * daftar layar lama, sehingga tombol Mulai tidak berpindah ke Beranda.
 */
function RootStack() {
  const onboarded = useAppStore((s) => s.onboarded);
  const locked = useAppStore((s) => s.locked);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!onboarded}>
        <Stack.Screen name="(onboarding)" />
      </Stack.Protected>
      <Stack.Protected guard={onboarded && locked}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      <Stack.Protected guard={onboarded && !locked}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
    </Stack>
  );
}
