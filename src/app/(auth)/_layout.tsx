import { Stack } from 'expo-router';

export const unstable_settings = { initialRouteName: 'unlock' };

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="unlock" />
      <Stack.Screen name="reset-pin" />
    </Stack>
  );
}
