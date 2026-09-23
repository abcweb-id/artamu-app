import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, SectionList, Text, View } from 'react-native';

import { Screen } from '@/components/screen';
import { TAB_SCROLL_BOTTOM_PADDING } from '@/components/tab-bar';
import { HintBanner } from '@/components/ui/hint-banner';
import { Icon } from '@/components/ui/icon';
import { SearchField } from '@/components/ui/search-field';
import { WalletChip } from '@/components/ui/wallet-chip';
import { MonthSummaryCard } from '@/features/transactions/month-summary-card';
import { SAMPLE_TODAY, type SampleTransaction } from '@/features/transactions/sample-data';
import { TransactionRow } from '@/features/transactions/transaction-row';
import { useActiveWallet } from '@/features/wallets/use-active-wallet';
import { WalletSheet } from '@/features/wallets/wallet-sheet';
import { relativeDayLabel } from '@/lib/date';
import { useMoneyFormat } from '@/lib/money';
import { usePalette } from '@/theme/use-palette';

type DaySection = { date: string; net: number; data: SampleTransaction[] };

/** Kelompokkan per tanggal (data sudah urut terbaru dulu) dan hitung total bersih harinya. */
function groupByDay(rows: SampleTransaction[]): DaySection[] {
  const sections: DaySection[] = [];
  for (const row of rows) {
    let section = sections.at(-1);
    if (section?.date !== row.date) {
      section = { date: row.date, net: 0, data: [] };
      sections.push(section);
    }
    section.data.push(row);
    section.net += row.kind === 'income' ? row.amount : -row.amount;
  }
  return sections;
}

export default function Transactions() {
  const money = useMoneyFormat();
  const { t, i18n } = useTranslation();
  const c = usePalette();
  const locale = i18n.language === 'id' ? 'id-ID' : 'en-US';
  const [query, setQuery] = useState('');
  const [walletSheetOpen, setWalletSheetOpen] = useState(false);
  const { key: walletKey, data } = useActiveWallet();

  const sections = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = q
      ? data.transactions.filter(
          (tx) => tx.title.toLowerCase().includes(q) || tx.category.toLowerCase().includes(q),
        )
      : data.transactions;
    return groupByDay(rows);
  }, [query, data]);

  const monthYear = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' });
  const weekday = new Intl.DateTimeFormat(locale, { weekday: 'long' });
  const dayLabel = (date: string) => {
    const rel = relativeDayLabel(
      date,
      SAMPLE_TODAY,
      { today: t('COMMON.TODAY'), yesterday: t('COMMON.YESTERDAY') },
      locale,
    );
    // relativeDayLabel memberi "16 Sep" untuk hari lain; di sini yang dipakai nama harinya.
    return rel === t('COMMON.TODAY') || rel === t('COMMON.YESTERDAY')
      ? rel
      : weekday.format(new Date(`${date}T00:00:00`));
  };

  const header = (
    <View>
      <View className="flex-row items-center justify-between">
        <Text className="mb-3 mt-1 font-display text-[25px] leading-[35px] text-text">
          {t('TABS.TRANSACTIONS')}
        </Text>
        <View className="-mt-2">
          <WalletChip
            name={t(`WALLET_SETUP.WALLETS.${walletKey}`)}
            icon={data.icon}
            variant="outline"
            onPress={() => setWalletSheetOpen(true)}
          />
        </View>
      </View>
      <View className="flex-row gap-2">
        <SearchField
          accessibilityLabel={t('LIST.SEARCH_LABEL')}
          placeholder={t('LIST.SEARCH_PLACEHOLDER')}
          value={query}
          onChangeText={setQuery}
        />
        {/* Lembar saringan belum dibuat. */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('LIST.FILTER')}
          className="w-[46px] items-center justify-center rounded-xl border border-line active:opacity-60"
        >
          <Icon name="filter" color={c.text} size={20} />
        </Pressable>
      </View>
      <MonthSummaryCard
        monthLabel={monthYear.format(new Date(`${SAMPLE_TODAY}T00:00:00`))}
        income={data.income}
        expense={data.expense}
        canGoPrev
        canGoNext={false}
      />
      <HintBanner hintKey="list" text={t('LIST.HINT')} />
    </View>
  );

  return (
    <Screen pageTitle={t('TABS.TRANSACTIONS')}>
      <SectionList
        sections={sections}
        keyExtractor={(tx) => tx.id}
        ListHeaderComponent={header}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        // contentContainerClassName tidak terbaca NativeWind di SectionList, jadi lewat style.
        contentContainerStyle={{ paddingBottom: TAB_SCROLL_BOTTOM_PADDING }}
        ListEmptyComponent={
          <Text className="mt-8 text-center text-sm text-muted">
            {t('LIST.NO_RESULTS', { query: query.trim() })}
          </Text>
        }
        renderSectionHeader={({ section }) => {
          const date = new Date(`${section.date}T00:00:00`);
          const income = section.net >= 0;
          return (
            <View className="mt-3.5 flex-row items-center gap-2.5 px-1 pb-[7px]">
              <Text className="font-display-xb text-[15px] leading-[15px] text-primary">
                {date.getDate()}
              </Text>
              <View className="min-w-0 flex-1 flex-row items-baseline gap-[5px]">
                <Text className="font-display text-[13px] text-text">{dayLabel(section.date)}</Text>
                <Text className="text-xs font-medium text-muted">{monthYear.format(date)}</Text>
              </View>
              <Text
                className={`font-display text-[12.5px] ${income ? 'text-income' : 'text-expense'}`}
                style={{ fontVariant: ['tabular-nums'] }}
              >
                {`${income ? '+' : '−'} ${money.amount(Math.abs(section.net))}`}
              </Text>
            </View>
          );
        }}
        renderItem={({ item, index, section }) => {
          const first = index === 0;
          const last = index === section.data.length - 1;
          return (
            // Kotak per hari: tiap baris membawa sisi kotaknya sendiri, sudut di baris pertama dan terakhir.
            <View
              className={`overflow-hidden border-x border-line bg-surface ${
                first ? 'rounded-t-2xl border-t' : ''
              } ${last ? 'rounded-b-2xl border-b' : ''}`}
            >
              <TransactionRow
                variant="boxed"
                first={first}
                title={item.title}
                subtitle={item.category}
                icon={item.icon}
                color={item.color}
                kind={item.kind}
                amount={item.amount}
              />
            </View>
          );
        }}
      />
      <WalletSheet open={walletSheetOpen} onClose={() => setWalletSheetOpen(false)} />
    </Screen>
  );
}
