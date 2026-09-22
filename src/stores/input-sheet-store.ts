import { create } from 'zustand';

type InputSheetState = {
  open: boolean;
  show: () => void;
  hide: () => void;
};

/** Lembar input transaksi, dibuka dari tombol tambah di tengah bottom bar. */
export const useInputSheet = create<InputSheetState>((set) => ({
  open: false,
  show: () => set({ open: true }),
  hide: () => set({ open: false }),
}));
