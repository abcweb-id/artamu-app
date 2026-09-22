import { Stack } from 'expo-router';

// Tanpa ini, pengalihan dari rute terkunci membuka layar onboarding pertama menurut
// urutan berkas, bukan layar sambutan.
export const unstable_settings = { initialRouteName: 'selamat-datang' };

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="selamat-datang" />
      <Stack.Screen name="nama" />
      <Stack.Screen name="dompet" />
      <Stack.Screen name="buat-pin" />
      <Stack.Screen name="izin-notifikasi" />
    </Stack>
  );
}
