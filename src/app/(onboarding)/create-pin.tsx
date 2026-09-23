import { router } from 'expo-router';

import { CreatePinView } from '@/features/pin/create-pin-view';
import { canUseBiometrics } from '@/lib/biometrics';
import { useAppStore } from '@/stores/app-store';

export default function CreatePin() {
  const setPin = useAppStore((s) => s.setPin);

  return (
    <CreatePinView
      variant="first"
      onCreated={async (pin) => {
        await setPin(pin);
        // Tawaran sidik jari hanya kalau ponselnya punya sidik jari terdaftar.
        router.push((await canUseBiometrics()) ? '/biometrics' : '/notifications');
      }}
    />
  );
}
