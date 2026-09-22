import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Pressable, ScrollView, Text, View } from 'react-native';

import { Screen } from '@/components/screen';
import { BackButton } from '@/components/ui/back-button';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import type { IconName } from '@/components/ui/icon';
import { IconBadge } from '@/components/ui/icon-badge';
import { MoneyInput } from '@/components/ui/money-input';
import { useOnboardingStore, type StarterWallet } from '@/stores/onboarding-store';

const WALLETS: { key: StarterWallet; icon: IconName }[] = [
  { key: 'CASH', icon: 'cash' },
  { key: 'BANK', icon: 'bank' },
  { key: 'EWALLET', icon: 'phone' },
];

export default function WalletSetup() {
  const { t } = useTranslation();
  const wallets = useOnboardingStore((s) => s.wallets);
  const toggleWallet = useOnboardingStore((s) => s.toggleWallet);
  const setWalletAmount = useOnboardingStore((s) => s.setWalletAmount);
  const [error, setError] = useState('');

  const next = () => {
    if (!WALLETS.some((w) => wallets[w.key].selected)) {
      setError(t('WALLET_SETUP.ERROR_NONE'));
      return;
    }
    setError('');
    router.push('/buat-pin');
  };

  return (
    <Screen pageTitle={t('WALLET_SETUP.PAGE_TITLE')} bottomInset className="pb-[30px]">
      <KeyboardAvoidingView behavior="padding" className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerClassName="flex-grow"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <BackButton />
          <Text className="mb-1 mt-2.5 font-display text-[23px] leading-[28px] text-text">
            {t('WALLET_SETUP.TITLE')}
          </Text>
          <Text className="mb-2.5 text-sm leading-[21px] text-muted">
            {t('WALLET_SETUP.SUBTITLE')}
          </Text>

          {WALLETS.map(({ key, icon }) => {
            const { selected, amount } = wallets[key];
            const name = t(`WALLET_SETUP.WALLETS.${key}`);
            return (
              <View
                key={key}
                className={`mt-2.5 rounded-[14px] border px-3 py-1 ${selected ? 'border-primary' : 'border-line'}`}
              >
                <Pressable
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: selected }}
                  accessibilityLabel={name}
                  onPress={() => {
                    toggleWallet(key);
                    setError('');
                  }}
                  className="flex-row items-center gap-3 py-2"
                >
                  <Checkbox checked={selected} />
                  <IconBadge name={icon} size={36} />
                  <Text className="text-[15px] font-medium text-text">{name}</Text>
                </Pressable>
                {selected ? (
                  <View className="pb-2.5 pl-[34px]">
                    <MoneyInput
                      accessibilityLabel={name}
                      value={amount}
                      onChangeValue={(v) => setWalletAmount(key, v)}
                    />
                  </View>
                ) : null}
              </View>
            );
          })}

          {/* Formulir dompet baru belum dibuat. */}
          <Button variant="outline" label={t('WALLET_SETUP.ADD')} className="mt-3" />
          <Text accessibilityRole="alert" className="mt-2 min-h-[18px] text-[12.5px] text-expense">
            {error}
          </Text>

          <View className="mt-auto pt-3">
            <Text className="mb-2.5 text-center text-[13px] text-muted">
              {t('WALLET_SETUP.STEP', { current: 2, total: 3 })}
            </Text>
            <Button label={t('WALLET_SETUP.NEXT')} onPress={next} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
