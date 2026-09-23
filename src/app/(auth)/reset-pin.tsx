import { CreatePinView } from '@/features/pin/create-pin-view';
import { useAppStore } from '@/stores/app-store';

/** Buat PIN baru setelah Lupa PIN dan sidik jari dikenali. Data tetap utuh. */
export default function ResetPin() {
  const setPin = useAppStore((s) => s.setPin);
  const unlock = useAppStore((s) => s.unlock);

  return (
    <CreatePinView
      variant="reset"
      onCreated={async (pin) => {
        await setPin(pin);
        unlock();
      }}
    />
  );
}
