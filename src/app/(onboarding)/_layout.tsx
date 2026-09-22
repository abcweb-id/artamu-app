import { Stack } from 'expo-router';

// Tanpa ini, pengalihan dari rute terkunci membuka layar onboarding pertama menurut
// urutan berkas, bukan layar sambutan.
export const unstable_settings = { initialRouteName: 'welcome' };

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="nickname" />
      <Stack.Screen name="wallets" />
      <Stack.Screen name="create-pin" />
      <Stack.Screen name="biometrics" />
      <Stack.Screen name="notifications" />
    </Stack>
  );
}
