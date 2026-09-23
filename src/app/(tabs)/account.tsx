import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { Screen } from '@/components/screen';
import { TAB_SCROLL_BOTTOM_PADDING } from '@/components/tab-bar';
import { Icon } from '@/components/ui/icon';
import { ListRow } from '@/components/ui/list-row';
import { ScreenTitle } from '@/components/ui/screen-title';
import { SectionLabel } from '@/components/ui/section-label';
import { WipeSheet } from '@/features/data/wipe-sheet';
import { sampleProfile } from '@/features/home/sample-data';
import { sampleWallets } from '@/features/transactions/sample-data';
import { useActiveWallet, useWalletBalances } from '@/features/wallets/use-active-wallet';
import { useMoneyFormat } from '@/lib/money';
import { useAppStore } from '@/stores/app-store';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { useTransactionsStore } from '@/stores/transactions-store';
import { usePalette } from '@/theme/use-palette';

/** "Musyaffa Hanif" -> "MH". */
const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');

export default function Account() {
  const { t, i18n } = useTranslation();
  const c = usePalette();
  const money = useMoneyFormat();
  const name = useOnboardingStore((s) => s.nickname).trim();
  const { key: active, wallets } = useActiveWallet();
  const balances = useWalletBalances();
  const setActiveWallet = useAppStore((s) => s.setActiveWallet);
  const added = useTransactionsStore((s) => s.added);
  const [wipeOpen, setWipeOpen] = useState(false);

  const locale = i18n.language === 'en' ? 'en-US' : 'id-ID';
  const since = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(
    new Date(`${sampleProfile.since}T00:00:00`),
  );
  const transactionCount =
    sampleProfile.transactionCount + Object.values(added).reduce((n, list) => n + list.length, 0);
  const stats = [
    [transactionCount, t('ACCOUNT.STATS.TRANSACTIONS')],
    [sampleProfile.streakDays, t('ACCOUNT.STATS.STREAK')],
    [sampleProfile.months, t('ACCOUNT.STATS.MONTHS')],
  ] as const;

  return (
    <Screen pageTitle={t('TABS.ACCOUNT')}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: TAB_SCROLL_BOTTOM_PADDING }}
      >
        <ScreenTitle>{t('TABS.ACCOUNT')}</ScreenTitle>

        {/* Profil */}
        <View className="mb-[18px] flex-row items-center gap-3.5">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-primary">
            {name ? (
              <Text className="text-[22px] font-bold text-on-primary">{initials(name)}</Text>
            ) : (
              <Icon name="user" color={c['on-primary']} size={28} />
            )}
          </View>
          <View className="min-w-0 flex-1">
            <Text numberOfLines={1} className="font-display text-lg leading-[25px] text-text">
              {name || t('ACCOUNT.NO_NAME')}
            </Text>
            <Text className="text-[13.5px] leading-[19px] text-muted">
              {t('ACCOUNT.SINCE', { month: since })}
            </Text>
          </View>
        </View>

        <View className="mb-1.5 flex-row gap-2">
          {stats.map(([value, label]) => (
            <View key={label} className="flex-1 rounded-[14px] bg-key p-2.5">
              <Text
                className="font-display text-[19px] leading-[27px] text-text"
                style={{ fontVariant: ['tabular-nums'] }}
              >
                {money.amount(value)}
              </Text>
              <Text className="mb-0.5 text-xs text-muted">{label}</Text>
            </View>
          ))}
        </View>

        <SectionLabel>{t('ACCOUNT.CLOUD')}</SectionLabel>
        {/* Akun cloud baru ada di rilis 2.0. */}
        <ListRow
          icon="cloud"
          title={t('ACCOUNT.SIGN_IN')}
          subtitle={t('ACCOUNT.SIGN_IN_HINT')}
          onPress={() => {}}
        />

        <SectionLabel>{t('ACCOUNT.OTHER_RECORDS')}</SectionLabel>
        {/* Transaksi rutin, hutang piutang, dan laporan belum dibuat. */}
        <ListRow
          icon="repeat"
          title={t('ACCOUNT.RECURRING')}
          subtitle={t('ACCOUNT.RECURRING_HINT')}
          value={String(sampleProfile.activeRecurring)}
          onPress={() => {}}
        />
        <ListRow
          icon="swap"
          title={t('ACCOUNT.DEBTS')}
          value={String(sampleProfile.openDebts)}
          onPress={() => {}}
        />
        <ListRow
          icon="chart"
          title={t('ACCOUNT.REPORT')}
          subtitle={t('ACCOUNT.REPORT_HINT')}
          onPress={() => {}}
        />

        <SectionLabel>{t('ACCOUNT.WALLETS')}</SectionLabel>
        {wallets.map((w) => (
          <Pressable
            key={w}
            accessibilityRole="button"
            accessibilityState={{ selected: w === active }}
            onPress={() => setActiveWallet(w)}
            className="flex-row items-center gap-4 py-3.5 active:opacity-60"
          >
            <Icon name={sampleWallets[w].icon} color={c.muted} size={20} />
            <View className="min-w-0 flex-1">
              <Text className="text-[15px] leading-[22px] text-text">
                {t(`WALLET_SETUP.WALLETS.${w}`)}
              </Text>
              {w === active ? (
                <Text className="text-[12.5px] leading-[19px] text-muted">
                  {t('ACCOUNT.ACTIVE_WALLET')}
                </Text>
              ) : null}
            </View>
            <Text
              className="text-sm font-medium text-text"
              style={{ fontVariant: ['tabular-nums'] }}
            >
              {money.rp(balances[w])}
            </Text>
          </Pressable>
        ))}
        {/* Kelola dompet belum dibuat. */}
        <ListRow
          icon="settings"
          title={t('ACCOUNT.MANAGE_WALLETS')}
          subtitle={t('ACCOUNT.MANAGE_WALLETS_HINT')}
          onPress={() => {}}
        />

        <SectionLabel>{t('ACCOUNT.PROFILE')}</SectionLabel>
        {/* Ubah nama dan foto serta cadangan belum dibuat. */}
        <ListRow icon="pencil" title={t('ACCOUNT.EDIT_PROFILE')} onPress={() => {}} />
        <ListRow
          icon="lock"
          title={t('SETTINGS.CHANGE_PIN')}
          onPress={() => router.push('/change-pin')}
        />
        <ListRow
          icon="upload"
          title={t('ACCOUNT.BACKUP')}
          subtitle={t('ACCOUNT.BACKUP_HINT')}
          onPress={() => {}}
        />

        <SectionLabel>{t('ACCOUNT.DANGER')}</SectionLabel>
        <ListRow
          icon="trash"
          tone="danger"
          title={t('ACCOUNT.WIPE')}
          subtitle={t('ACCOUNT.WIPE_HINT')}
          chevron={false}
          onPress={() => setWipeOpen(true)}
        />
      </ScrollView>
      <WipeSheet open={wipeOpen} onClose={() => setWipeOpen(false)} />
    </Screen>
  );
}
