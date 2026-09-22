import { useCallback, useEffect, useEffectEvent, useState } from 'react';

import { PIN_LENGTH, PIN_SUBMIT_DELAY_MS } from './constants';

/** Menampung digit PIN; onComplete dipanggil sekali setelah digit keempat. */
export function usePinEntry(onComplete: (pin: string) => void) {
  const [pin, setPin] = useState('');
  const complete = useEffectEvent(onComplete);

  useEffect(() => {
    if (pin.length !== PIN_LENGTH) return;
    const timer = setTimeout(() => {
      complete(pin);
      setPin('');
    }, PIN_SUBMIT_DELAY_MS);
    return () => clearTimeout(timer);
  }, [pin]);

  const press = useCallback(
    (digit: string) => setPin((p) => (p.length < PIN_LENGTH ? p + digit : p)),
    [],
  );
  const remove = useCallback(() => setPin((p) => p.slice(0, -1)), []);

  return { pin, press, remove };
}
