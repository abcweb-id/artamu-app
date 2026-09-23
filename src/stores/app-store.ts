import { create } from 'zustand';

import type { StarterWallet } from './onboarding-store';
import { useSettingsStore } from './settings-store';

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
  /** Buka dengan sidik jari. Hanya aktif kalau pengguna memilihnya sendiri. */
  biometricEnabled: boolean;
  /** Dompet yang saldo dan transaksinya tampil di Beranda dan Transaksi. */
  activeWallet: StarterWallet;
  /** Saldo disamarkan dengan titik (ikon mata di kartu saldo). */
  hideBalance: boolean;
  /** Petunjuk yang sudah ditutup dengan "Mengerti". Nanti disimpan di tabel settings. */
  dismissedHints: string[];
  failedAttempts: number;
  /** Waktu (ms) sampai layar PIN boleh dicoba lagi. */
  lockedUntil: number | null;
  setOnboarded: (value: boolean) => void;
  setPin: (pin: string) => void;
  setBiometricEnabled: (value: boolean) => void;
  setActiveWallet: (wallet: StarterWallet) => void;
  toggleHideBalance: () => void;
  dismissHint: (key: string) => void;
  lock: () => void;
  /** Dibuka tanpa PIN: setelah sidik jari dikenali atau PIN baru dibuat. */
  unlock: () => void;
  verifyPin: (input: string) => PinResult;
  clearPinLock: () => void;
  /** Hapus data dan mulai dari awal (Lupa PIN). */
  reset: () => void;
};

const initialState = {
  onboarded: false,
  locked: false,
  pin: null,
  biometricEnabled: false,
  activeWallet: 'BANK' as StarterWallet,
  hideBalance: false,
  dismissedHints: [] as string[],
  failedAttempts: 0,
  lockedUntil: null,
};

export const useAppStore = create<AppState>((set, get) => ({
  ...initialState,
  setOnboarded: (onboarded) => set({ onboarded }),
  setPin: (pin) => set({ pin }),
  setBiometricEnabled: (biometricEnabled) => set({ biometricEnabled }),
  setActiveWallet: (activeWallet) => set({ activeWallet }),
  toggleHideBalance: () => set((s) => ({ hideBalance: !s.hideBalance })),
  dismissHint: (key) => set((s) => ({ dismissedHints: [...s.dismissedHints, key] })),
  lock: () => {
    const { onboarded, pin } = get();
    // Kunci dengan PIN dimatikan di Pengaturan: jangan pernah meminta PIN.
    if (onboarded && pin && useSettingsStore.getState().pinEnabled) set({ locked: true });
  },
  unlock: () => set({ locked: false, failedAttempts: 0, lockedUntil: null }),
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
  reset: () => set(initialState),
}));
