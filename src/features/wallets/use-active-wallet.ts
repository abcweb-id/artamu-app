import { sampleWallets } from '@/features/transactions/sample-data';
import { useAppStore } from '@/stores/app-store';
import { useOnboardingStore, type StarterWallet } from '@/stores/onboarding-store';

const ORDER: StarterWallet[] = ['CASH', 'BANK', 'EWALLET'];

/**
 * Dompet yang dipakai pengguna (dipilih saat onboarding) dan dompet aktifnya.
 * Kalau dompet aktif tidak termasuk yang dipakai, ambil yang pertama.
 * Saldo dan transaksinya masih DATA CONTOH sampai database dipasang.
 */
export function useActiveWallet() {
  const selected = useOnboardingStore((s) => s.wallets);
  const stored = useAppStore((s) => s.activeWallet);
  const wallets = ORDER.filter((w) => selected[w].selected);
  const available = wallets.length ? wallets : (['BANK'] as StarterWallet[]);
  const key = available.includes(stored) ? stored : available[0];
  return { key, data: sampleWallets[key], wallets: available };
}
