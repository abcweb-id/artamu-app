import { router } from 'expo-router';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';

import { Screen } from '@/components/screen';
import { TAB_SCROLL_BOTTOM_PADDING } from '@/components/tab-bar';
import { Button } from '@/components/ui/button';
import { HintBanner } from '@/components/ui/hint-banner';
import { IconButton } from '@/components/ui/icon-button';
import { BalanceCard } from '@/features/home/balance-card';
import { QuickActions } from '@/features/home/quick-actions';
import { sampleHome } from '@/features/home/sample-data';
import { SpendingChart } from '@/features/home/spending-chart';
import { SAMPLE_TODAY } from '@/features/transactions/sample-data';
import { TransactionRow } from '@/features/transactions/transaction-row';
import { useActiveWallet } from '@/features/wallets/use-active-wallet';
import { WalletSheet } from '@/features/wallets/wallet-sheet';
import { monthName, relativeDayLabel } from '@/lib/date';
import { useMoneyFormat } from '@/lib/money';
import { useOnboardingStore } from '@/stores/onboarding-store';

/** Judul bagian dengan isi kanan (legenda atau tautan). */
function Section({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <View className="mb-1.5 mt-6 flex-row items-center justify-between">
      <Text className="text-[15px] font-medium text-text">{title}</Text>
      {right}
    </View>
  );
}

export default function Home() {
  const money = useMoneyFormat();
  const { t, i18n } = useTranslation();
  const nickname = useOnboardingStore((s) => s.nickname)
    .trim()
    .split(' ')[0];
  const locale = i18n.language === 'id' ? 'id-ID' : 'en-US';
  const { key: walletKey, data } = useActiveWallet();
  const [walletSheetOpen, setWalletSheetOpen] = useState(false);

  const day = Number(SAMPLE_TODAY.slice(8));
  const spent = data.spendingThisMonth[day - 1];
  const diff = Math.round((data.spendingLastMonth[day - 1] - spent) / 1000) * 1000;
  const lastMonth = monthName(SAMPLE_TODAY, locale, -1);

  return (
    <Screen pageTitle={t('TABS.HOME')}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: TAB_SCROLL_BOTTOM_PADDING }}
      >
        <View className="flex-row items-center justify-between pt-1">
          <Text className="font-display text-xl text-text">
            {nickname ? t('HOME.GREETING', { name: nickname }) : t('HOME.GREETING_NO_NAME')}
          </Text>
          <View className="-mr-2 flex-row gap-0.5">
            <IconButton icon="search" label={t('HOME.SEARCH')} />
            <IconButton
              icon="bell"
              badge={sampleHome.unreadNotifications > 0}
              label={t('HOME.NOTIFICATIONS_UNREAD', { count: sampleHome.unreadNotifications })}
            />
          </View>
        </View>

        <View className="mt-4">
          <BalanceCard
            walletName={t(`WALLET_SETUP.WALLETS.${walletKey}`)}
            walletIcon={data.icon}
            balance={data.balance}
            income={data.income}
            expense={data.expense}
            onSwitchWallet={() => setWalletSheetOpen(true)}
          />
        </View>

        <HintBanner hintKey="home" text={t('HOME.HINT_WALLET')} />
        <QuickActions />

        <Section
          title={t('HOME.SPENDING_TITLE')}
          right={
            <View className="flex-row items-center">
              <View className="mr-1 h-[2.5px] w-3.5 rounded-full bg-primary" />
              <Text className="text-[12.5px] text-muted">{t('HOME.THIS_MONTH')}</Text>
              <View className="ml-2.5 mr-1 w-3.5 border-t-2 border-dashed border-muted" />
              <Text className="text-[12.5px] capitalize text-muted">{lastMonth}</Text>
            </View>
          }
        />
        <SpendingChart
          current={data.spendingThisMonth}
          previous={data.spendingLastMonth}
          label={t('HOME.CHART_LABEL', { month: lastMonth })}
        />
        <Text className="mt-2 text-[12.5px] leading-[19px] text-muted">
          <Trans
            i18nKey={diff >= 0 ? 'HOME.SPENDING_LESS' : 'HOME.SPENDING_MORE'}
            values={{
              day,
              amount: money.rp(spent),
              diff: money.rp(Math.abs(diff)),
              month: lastMonth,
            }}
            components={{ b: <Text className="font-medium text-text" /> }}
          />
        </Text>

        <Section
          title={t('HOME.RECENT')}
          right={
            <Button
              variant="link"
              label={t('HOME.SEE_ALL')}
              className="px-0 py-0.5 pl-2.5"
              onPress={() => router.navigate('/transactions')}
            />
          }
        />
        {data.transactions.slice(0, 4).map((tx) => (
          <TransactionRow
            key={tx.id}
            title={tx.title}
            subtitle={`${relativeDayLabel(tx.date, SAMPLE_TODAY, { today: t('COMMON.TODAY'), yesterday: t('COMMON.YESTERDAY') }, locale)}, ${tx.categoryShort}`}
            icon={tx.icon}
            color={tx.color}
            kind={tx.kind}
            amount={tx.amount}
          />
        ))}
      </ScrollView>
      <WalletSheet open={walletSheetOpen} onClose={() => setWalletSheetOpen(false)} />
    </Screen>
  );
}
