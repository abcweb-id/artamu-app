import { useMemo } from 'react';

import {
  SAMPLE_TODAY,
  sampleWallets,
  type SampleWallet,
} from '@/features/transactions/sample-data';
import { useAppStore } from '@/stores/app-store';
import { useOnboardingStore, type StarterWallet } from '@/stores/onboarding-store';
import { useTransactionsStore } from '@/stores/transactions-store';

const ORDER: StarterWallet[] = ['CASH', 'BANK', 'EWALLET'];

/** Data contoh dompet ditambah transaksi yang dicatat di sesi ini. */
function withAdded(base: SampleWallet, added: SampleWallet['transactions']): SampleWallet {
  if (!added.length) return base;
  const month = SAMPLE_TODAY.slice(0, 7);
  let balance = base.balance;
  let income = base.income;
  let expense = base.expense;
  const spending = [...base.spendingThisMonth];
  for (const tx of added) {
    const sign = tx.kind === 'income' ? 1 : -1;
    balance += sign * tx.amount;
    if (tx.date.slice(0, 7) !== month) continue;
    if (tx.kind === 'income') income += tx.amount;
    else {
      expense += tx.amount;
      // Pengeluaran kumulatif naik mulai hari transaksi sampai hari ini.
      for (let i = Number(tx.date.slice(8)) - 1; i < spending.length; i++) spending[i] += tx.amount;
    }
  }
  const transactions = [...added, ...base.transactions].sort((a, b) =>
    b.date.localeCompare(a.date),
  );
  return { ...base, balance, income, expense, spendingThisMonth: spending, transactions };
}

/**
 * Dompet yang dipakai pengguna (dipilih saat onboarding) dan dompet aktifnya.
 * Kalau dompet aktif tidak termasuk yang dipakai, ambil yang pertama.
 * Saldo dan transaksinya masih DATA CONTOH sampai database dipasang.
 */
export function useActiveWallet() {
  const selected = useOnboardingStore((s) => s.wallets);
  const stored = useAppStore((s) => s.activeWallet);
  const added = useTransactionsStore((s) => s.added);
  const wallets = ORDER.filter((w) => selected[w].selected);
  const available = wallets.length ? wallets : (['BANK'] as StarterWallet[]);
  const key = available.includes(stored) ? stored : available[0];
  const data = useMemo(() => withAdded(sampleWallets[key], added[key]), [key, added]);
  return { key, data, wallets: available };
}

/** Saldo tiap dompet, termasuk transaksi sesi ini (untuk lembar Pilih dompet). */
export function useWalletBalances() {
  const added = useTransactionsStore((s) => s.added);
  return useMemo(
    () =>
      Object.fromEntries(
        ORDER.map((w) => [w, withAdded(sampleWallets[w], added[w]).balance]),
      ) as Record<StarterWallet, number>,
    [added],
  );
}
