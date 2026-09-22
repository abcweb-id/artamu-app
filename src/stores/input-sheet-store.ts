import { create } from 'zustand';

type InputSheetState = {
  open: boolean;
  /** Bertambah tiap kali lembar dibuka; dipakai sebagai key supaya formulir mulai kosong. */
  session: number;
  show: () => void;
  hide: () => void;
};

/** Lembar input transaksi, dibuka dari tombol tambah di tengah bottom bar. */
export const useInputSheet = create<InputSheetState>((set) => ({
  open: false,
  session: 0,
  show: () => set((s) => ({ open: true, session: s.session + 1 })),
  hide: () => set({ open: false }),
}));
