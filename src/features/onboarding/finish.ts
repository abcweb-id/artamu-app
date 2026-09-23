import type { SQLiteDatabase } from 'expo-sqlite';
import type { TFunction } from 'i18next';

import { saveSettings } from '@/db/repo/settings';
import { createWallets } from '@/db/repo/wallets';
import { notifyDbChanged } from '@/db/use-db-query';
import { useAppStore } from '@/stores/app-store';
import { useOnboardingStore, type StarterWallet } from '@/stores/onboarding-store';

const ORDER: StarterWallet[] = ['CASH', 'BANK', 'EWALLET'];
const ICONS: Record<StarterWallet, string> = { CASH: 'cash', BANK: 'bank', EWALLET: 'phone' };

/**
 * Akhir onboarding: buat dompet yang dipilih beserta saldo awalnya, simpan nama panggilan,
 * lalu masuk ke Beranda. Nama dompet disimpan dalam bahasa saat ini dan bisa diubah nanti.
 */
export async function finishOnboarding(db: SQLiteDatabase, t: TFunction) {
  const { nickname, wallets } = useOnboardingStore.getState();
  const chosen = ORDER.filter((w) => wallets[w].selected);
  const ids = await createWallets(
    db,
    chosen.map((w) => ({
      name: t(`WALLET_SETUP.WALLETS.${w}`),
      icon: ICONS[w],
      openingBalance: wallets[w].amount,
    })),
  );
  await saveSettings(db, { nickname });
  const bank = chosen.indexOf('BANK');
  useAppStore.getState().setActiveWalletId(ids[bank >= 0 ? bank : 0]);
  useAppStore.getState().setOnboarded(true);
  notifyDbChanged();
}
