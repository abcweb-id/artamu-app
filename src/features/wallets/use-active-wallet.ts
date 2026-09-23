import { listWallets, type WalletRow } from '@/db/repo/wallets';
import { useDbQuery } from '@/db/use-db-query';
import { useAppStore } from '@/stores/app-store';

/**
 * Dompet pengguna dari database dan dompet aktifnya. Kalau dompet aktif tidak ada
 * (belum dipilih atau sudah dihapus), pakai dompet pertama.
 */
export function useActiveWallet() {
  const wallets = useDbQuery(listWallets, []) ?? [];
  const activeId = useAppStore((s) => s.activeWalletId);
  const wallet: WalletRow | undefined = wallets.find((w) => w.id === activeId) ?? wallets[0];
  return { wallet, wallets };
}
