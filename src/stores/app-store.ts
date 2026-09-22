import { create } from 'zustand';

/** Salah PIN sebanyak ini mengunci layar PIN sementara. */
export const MAX_PIN_ATTEMPTS = 5;
export const PIN_LOCK_MS = 30_000;

type PinResult = 'ok' | 'wrong' | 'locked';

type AppState = {
  /** Nanti dibaca dari tabel settings setelah migrasi versi 1 dipasang. */
  onboarded: boolean;
  /** Layar PIN tampil. Aktif saat aplikasi kembali dari latar belakang. */
  locked: boolean;
  /**
   * Sementara disimpan di memori, hilang saat aplikasi ditutup.
   * Nanti yang disimpan hash-nya di expo-secure-store, bukan PIN-nya.
   */
  pin: string | null;
  failedAttempts: number;
  /** Waktu (ms) sampai layar PIN boleh dicoba lagi. */
  lockedUntil: number | null;
  setOnboarded: (value: boolean) => void;
  setPin: (pin: string) => void;
  lock: () => void;
  verifyPin: (input: string) => PinResult;
  clearPinLock: () => void;
};

export const useAppStore = create<AppState>((set, get) => ({
  onboarded: false,
  locked: false,
  pin: null,
  failedAttempts: 0,
  lockedUntil: null,
  setOnboarded: (onboarded) => set({ onboarded }),
  setPin: (pin) => set({ pin }),
  lock: () => {
    const { onboarded, pin } = get();
    if (onboarded && pin) set({ locked: true });
  },
  verifyPin: (input) => {
    const { pin, failedAttempts } = get();
    if (input === pin) {
      set({ locked: false, failedAttempts: 0, lockedUntil: null });
      return 'ok';
    }
    const attempts = failedAttempts + 1;
    if (attempts >= MAX_PIN_ATTEMPTS) {
      set({ failedAttempts: 0, lockedUntil: Date.now() + PIN_LOCK_MS });
      return 'locked';
    }
    set({ failedAttempts: attempts });
    return 'wrong';
  },
  clearPinLock: () => set({ lockedUntil: null }),
}));
