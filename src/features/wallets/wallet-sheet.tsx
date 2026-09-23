import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import type { IconName } from '@/components/ui/icon';
import { IconBadge } from '@/components/ui/icon-badge';
import { Sheet } from '@/components/ui/sheet';
import { useMoneyFormat } from '@/lib/money';
import { useAppStore } from '@/stores/app-store';
import { usePalette } from '@/theme/use-palette';

import { useActiveWallet } from './use-active-wallet';

/** Lembar Pilih dompet dari pemilih dompet di Beranda dan Transaksi. */
export function WalletSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const money = useMoneyFormat();
  const { t } = useTranslation();
  const c = usePalette();
  const { wallet: active, wallets } = useActiveWallet();
  const setActiveWalletId = useAppStore((s) => s.setActiveWalletId);

  return (
    <Sheet open={open} onClose={onClose} title={t('WALLET_PICKER.TITLE')}>
      <Text className="-mt-1.5 mb-2 text-[12.5px] text-muted">{t('WALLET_PICKER.SUBTITLE')}</Text>
      {wallets.map((w) => {
        // Nama dompet adalah data pengguna, tidak diterjemahkan.
        const name = w.name;
        const selected = w.id === active?.id;
        return (
          <Pressable
            key={w.id}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            accessibilityLabel={selected ? t('WALLET_PICKER.SELECTED', { wallet: name }) : name}
            onPress={() => {
              setActiveWalletId(w.id);
              onClose();
            }}
            className="-mx-5 flex-row items-center gap-3 px-5 py-3.5 active:bg-key"
          >
            <IconBadge name={w.icon as IconName} size={40} />
            <View className="flex-1">
              <Text className="text-[15px] font-medium leading-[22px] text-text">{name}</Text>
              <Text className="text-[12.5px] text-muted" style={{ fontVariant: ['tabular-nums'] }}>
                {money.rp(w.balance)}
              </Text>
            </View>
            {selected ? <Icon name="check" color={c.primary} size={22} /> : null}
          </Pressable>
        );
      })}
      {/* Kelola dompet dan Transfer belum dibuat. */}
      <View className="mt-3 flex-row gap-2.5">
        <Button variant="secondary" label={t('WALLET_PICKER.MANAGE')} className="flex-1" />
        <Button variant="solid" label={t('WALLET_PICKER.TRANSFER')} className="flex-1" />
      </View>
    </Sheet>
  );
}
