import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, SectionList, Text, View } from 'react-native';

import { Screen } from '@/components/screen';
import { TAB_SCROLL_BOTTOM_PADDING } from '@/components/tab-bar';
import { HintBanner } from '@/components/ui/hint-banner';
import { IconBadge } from '@/components/ui/icon-badge';
import { Icon, type IconName } from '@/components/ui/icon';
import { SearchField } from '@/components/ui/search-field';
import { WalletChip } from '@/components/ui/wallet-chip';
import { MonthSummaryCard } from '@/features/transactions/month-summary-card';
import { listTransactions, periodTotals } from '@/db/repo/transactions';
import { useDbQuery } from '@/db/use-db-query';
import { presentTransaction, type PresentedTransaction } from '@/features/transactions/present';
import { TransactionRow } from '@/features/transactions/transaction-row';
import { useActiveWallet } from '@/features/wallets/use-active-wallet';
import { WalletSheet } from '@/features/wallets/wallet-sheet';
import { monthRange, relativeDayLabel, toDateString } from '@/lib/date';
import { useMoneyFormat } from '@/lib/money';
import { usePalette } from '@/theme/use-palette';

type DaySection = { date: string; net: number; data: PresentedTransaction[] };

/** Kelompokkan per tanggal (data sudah urut terbaru dulu) dan hitung total bersih harinya. */
function groupByDay(rows: PresentedTransaction[]): DaySection[] {
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
  const { wallet } = useActiveWallet();
  const walletId = wallet?.id ?? '';
  const today = toDateString();
  // 0 = bulan ini, -1 = bulan lalu, dan seterusnya. Tidak bisa maju melewati bulan ini.
  const [monthOffset, setMonthOffset] = useState(0);
  const month = monthRange(today, monthOffset);
  const rowsRaw = useDbQuery(
    (db) => listTransactions(db, walletId, month.from, month.to),
    [walletId, month.from],
  );
  const totals = useDbQuery(
    (db) => periodTotals(db, walletId, month.from, month.to),
    [walletId, month.from],
  );

  const transactions = useMemo(
    () => (rowsRaw ?? []).map((row) => presentTransaction(t, row)),
    [rowsRaw, t],
  );

  const sections = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = q
      ? transactions.filter(
          (tx) => tx.title.toLowerCase().includes(q) || tx.category.toLowerCase().includes(q),
        )
      : transactions;
    return groupByDay(rows);
  }, [query, transactions]);

  const monthYear = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' });
  const weekday = new Intl.DateTimeFormat(locale, { weekday: 'long' });
  const dayLabel = (date: string) => {
    const rel = relativeDayLabel(
      date,
      today,
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
            name={wallet?.name ?? ''}
            icon={(wallet?.icon ?? 'wallet') as IconName}
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
        monthLabel={monthYear.format(new Date(`${month.from}T00:00:00`))}
        income={totals?.income ?? 0}
        expense={totals?.expense ?? 0}
        canGoPrev
        canGoNext={monthOffset < 0}
        onPrev={() => setMonthOffset((m) => m - 1)}
        onNext={() => setMonthOffset((m) => Math.min(0, m + 1))}
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
          query.trim() ? (
            <Text className="mt-8 text-center text-sm text-muted">
              {t('LIST.NO_RESULTS', { query: query.trim() })}
            </Text>
          ) : (
            <View className="mt-8 items-center px-6">
              <IconBadge name="pencil" size={48} />
              <Text className="mt-3 text-center text-[15px] font-medium text-text">
                {t('LIST.EMPTY_TITLE')}
              </Text>
              <Text className="mt-1 text-center text-[13px] leading-[19px] text-muted">
                {t('LIST.EMPTY_BODY')}
              </Text>
            </View>
          )
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
