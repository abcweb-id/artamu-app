import { create } from 'zustand';

import { checkPin, savePin, savePinLockedUntil } from '@/lib/pin';

import { useSettingsStore } from './settings-store';

/** Salah PIN sebanyak ini mengunci layar PIN sementara. */
export const MAX_PIN_ATTEMPTS = 5;
export const PIN_LOCK_MS = 30_000;

type PinResult = 'ok' | 'wrong' | 'locked';

type AppState = {
  /** Disimpan di tabel settings (onboarded). */
  onboarded: boolean;
  /** Layar PIN tampil. Aktif saat aplikasi dibuka dan setelah ditinggalkan (Kunci otomatis). */
  locked: boolean;
  /** Ada hash PIN di penyimpanan aman. PIN-nya sendiri tidak pernah disimpan di memori. */
  hasPin: boolean;
  /** Buka dengan sidik jari. Hanya aktif kalau pengguna memilihnya sendiri. */
  biometricEnabled: boolean;
  /** ID dompet yang tampil di Beranda dan Transaksi. null: dompet pertama. */
  activeWalletId: string | null;
  /** Saldo disamarkan dengan titik (ikon mata di kartu saldo). */
  hideBalance: boolean;
  /** Petunjuk yang sudah ditutup dengan "Mengerti". */
  dismissedHints: string[];
  failedAttempts: number;
  /** Waktu (ms) sampai layar PIN boleh dicoba lagi. Disimpan di penyimpanan aman. */
  lockedUntil: number | null;
  setOnboarded: (value: boolean) => void;
  setPin: (pin: string) => Promise<void>;
  setBiometricEnabled: (value: boolean) => void;
  setActiveWalletId: (id: string) => void;
  toggleHideBalance: () => void;
  dismissHint: (key: string) => void;
  lock: () => void;
  /** Dibuka tanpa PIN: setelah sidik jari dikenali atau PIN baru dibuat. */
  unlock: () => void;
  verifyPin: (input: string) => Promise<PinResult>;
  clearPinLock: () => void;
  /** Hapus data dan mulai dari awal. */
  reset: () => void;
};

export const initialAppState = {
  onboarded: false,
  locked: false,
  hasPin: false,
  biometricEnabled: false,
  activeWalletId: null as string | null,
  hideBalance: false,
  dismissedHints: [] as string[],
  failedAttempts: 0,
  lockedUntil: null as number | null,
};

export const useAppStore = create<AppState>((set, get) => ({
  ...initialAppState,
  setOnboarded: (onboarded) => set({ onboarded }),
  setPin: async (pin) => {
    await savePin(pin);
    set({ hasPin: true });
  },
  setBiometricEnabled: (biometricEnabled) => set({ biometricEnabled }),
  setActiveWalletId: (activeWalletId) => set({ activeWalletId }),
  toggleHideBalance: () => set((s) => ({ hideBalance: !s.hideBalance })),
  dismissHint: (key) => set((s) => ({ dismissedHints: [...s.dismissedHints, key] })),
  lock: () => {
    const { onboarded, hasPin } = get();
    // Kunci dengan PIN dimatikan di Pengaturan: jangan pernah meminta PIN.
    if (onboarded && hasPin && useSettingsStore.getState().pinEnabled) set({ locked: true });
  },
  unlock: () => {
    set({ locked: false, failedAttempts: 0, lockedUntil: null });
    savePinLockedUntil(null);
  },
  verifyPin: async (input) => {
    if (await checkPin(input)) {
      get().unlock();
      return 'ok';
    }
    const attempts = get().failedAttempts + 1;
    if (attempts >= MAX_PIN_ATTEMPTS) {
      const until = Date.now() + PIN_LOCK_MS;
      set({ failedAttempts: 0, lockedUntil: until });
      await savePinLockedUntil(until);
      return 'locked';
    }
    set({ failedAttempts: attempts });
    return 'wrong';
  },
  clearPinLock: () => {
    set({ lockedUntil: null });
    savePinLockedUntil(null);
  },
  reset: () => set(initialAppState),
}));
