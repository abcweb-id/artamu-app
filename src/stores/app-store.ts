import { create } from 'zustand';

type AppState = {
  /** Nanti dibaca dari tabel settings setelah migrasi versi 1 dipasang. */
  onboarded: boolean;
  /** Kunci PIN aktif. Hash PIN sendiri disimpan di expo-secure-store. */
  locked: boolean;
  setOnboarded: (value: boolean) => void;
  setLocked: (value: boolean) => void;
};

export const useAppStore = create<AppState>((set) => ({
  onboarded: false,
  locked: false,
  setOnboarded: (onboarded) => set({ onboarded }),
  setLocked: (locked) => set({ locked }),
}));
