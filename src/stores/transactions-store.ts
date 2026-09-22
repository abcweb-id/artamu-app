import { create } from 'zustand';

import type { SampleTransaction } from '@/features/transactions/sample-data';

import type { StarterWallet } from './onboarding-store';

type TransactionsState = {
  /**
   * Transaksi yang dicatat lewat lembar input, per dompet, terbaru dulu. Sementara di memori
   * dan digabung dengan data contoh; nanti diganti INSERT ke tabel transactions.
   */
  added: Record<StarterWallet, SampleTransaction[]>;
  add: (wallet: StarterWallet, tx: SampleTransaction) => void;
  reset: () => void;
};

const empty = (): TransactionsState['added'] => ({ CASH: [], BANK: [], EWALLET: [] });

export const useTransactionsStore = create<TransactionsState>((set) => ({
  added: empty(),
  add: (wallet, tx) => set((s) => ({ added: { ...s.added, [wallet]: [tx, ...s.added[wallet]] } })),
  reset: () => set({ added: empty() }),
}));
