import '@/global.css';

import {
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/plus-jakarta-sans';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { colorScheme, useColorScheme } from 'nativewind';
import { useEffect, useRef } from 'react';
import { AppState, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { SplashOverlay } from '@/components/splash-overlay';
import { AppBootstrap } from '@/db/app-bootstrap';
import { DatabaseGate } from '@/db/database-gate';
import i18n, { deviceLanguage } from '@/i18n';
import { useAppStore } from '@/stores/app-store';
import { AUTO_LOCK_MS, useSettingsStore } from '@/stores/settings-store';
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
        <DatabaseGate>
          <AppBootstrap>
            <ThemeProvider value={navTheme}>
              <BottomSheetModalProvider>
                <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
                <RootStack />
                <SplashOverlay />
              </BottomSheetModalProvider>
            </ThemeProvider>
          </AppBootstrap>
        </DatabaseGate>
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
  const lock = useAppStore((s) => s.lock);
  const autoLock = useSettingsStore((s) => s.autoLock);
  const colorSchemeSetting = useSettingsStore((s) => s.colorScheme);
  const language = useSettingsStore((s) => s.language);

  // Mode gelap dan bahasa dari Pengaturan.
  useEffect(() => {
    colorScheme.set(colorSchemeSetting);
  }, [colorSchemeSetting]);
  useEffect(() => {
    i18n.changeLanguage(language === 'system' ? deviceLanguage() : language);
  }, [language]);

  // Kunci otomatis: catat kapan aplikasi ditinggalkan, minta PIN lagi kalau sudah
  // melewati batas waktu saat aplikasi dibuka kembali.
  const leftAt = useRef<number | null>(null);
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'background') {
        leftAt.current = Date.now();
        if (AUTO_LOCK_MS[autoLock] === 0) lock();
      } else if (state === 'active' && leftAt.current !== null) {
        if (Date.now() - leftAt.current >= AUTO_LOCK_MS[autoLock]) lock();
        leftAt.current = null;
      }
    });
    return () => sub.remove();
  }, [lock, autoLock]);

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
        <Stack.Screen name="change-pin" />
      </Stack.Protected>
    </Stack>
  );
}
