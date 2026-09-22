import { Image } from 'expo-image';
import { useColorScheme } from 'nativewind';
import { useEffect, useState } from 'react';
import { Animated, Platform, StyleSheet } from 'react-native';

import { usePalette } from '@/theme/use-palette';

/** Lama logo tampil sebelum memudar, dan lama pudarnya. */
const HOLD_MS = 1200;
const FADE_MS = 250;

/**
 * Layar pembuka seperti wireframe: logo vertikal 186 px di tengah latar layar.
 * Splash native Android 12+ hanya bisa menampilkan ikon kecil, jadi logo lengkap
 * dengan tulisan ditampilkan di sini setelah splash native ditutup.
 */
export function SplashOverlay() {
  const dark = useColorScheme().colorScheme === 'dark';
  const c = usePalette();
  const [opacity] = useState(() => new Animated.Value(1));
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const anim = Animated.timing(opacity, {
      toValue: 0,
      duration: FADE_MS,
      delay: HOLD_MS,
      // Driver native tidak ada di web.
      useNativeDriver: Platform.OS !== 'web',
    });
    anim.start(({ finished }) => finished && setVisible(false));
    return () => anim.stop();
  }, [opacity]);

  if (!visible) return null;

  return (
    // className tidak terbaca di Animated.View, jadi gaya ditulis lewat style.
    <Animated.View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFill,
        { alignItems: 'center', justifyContent: 'center', backgroundColor: c.canvas, opacity },
      ]}
    >
      <Image
        source={
          dark
            ? require('@/assets/brand/logo-vertical-on-dark.png')
            : require('@/assets/brand/logo-vertical.png')
        }
        style={{ width: 186, aspectRatio: 560 / 448 }}
        contentFit="contain"
        accessibilityLabel="Artamu, kelola hartamu dengan mudah"
      />
    </Animated.View>
  );
}
