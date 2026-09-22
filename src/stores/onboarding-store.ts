import { create } from 'zustand';

export type StarterWallet = 'CASH' | 'BANK' | 'EWALLET';

type WalletDraft = { selected: boolean; amount: number };

type OnboardingState = {
  nickname: string;
  /** Dompet bawaan di layar Dompet dan saldo awal. Tunai dan Bank terpilih dari awal. */
  wallets: Record<StarterWallet, WalletDraft>;
  setNickname: (value: string) => void;
  toggleWallet: (wallet: StarterWallet) => void;
  setWalletAmount: (wallet: StarterWallet, amount: number) => void;
  reset: () => void;
};

const initialState = {
  nickname: '',
  wallets: {
    CASH: { selected: true, amount: 0 },
    BANK: { selected: true, amount: 0 },
    EWALLET: { selected: false, amount: 0 },
  },
};

/**
 * Isian onboarding, disimpan di memori sampai database dipasang. Nanti nama panggilan
 * masuk tabel settings, dan tiap dompet terpilih jadi baris wallets dengan transaksi
 * saldo awal (kategori sistem opening).
 */
export const useOnboardingStore = create<OnboardingState>((set) => ({
  ...initialState,
  setNickname: (nickname) => set({ nickname }),
  toggleWallet: (wallet) =>
    set((s) => ({
      wallets: { ...s.wallets, [wallet]: { ...s.wallets[wallet], selected: !s.wallets[wallet].selected } },
    })),
  setWalletAmount: (wallet, amount) =>
    set((s) => ({ wallets: { ...s.wallets, [wallet]: { ...s.wallets[wallet], amount } } })),
  reset: () => set(initialState),
}));
