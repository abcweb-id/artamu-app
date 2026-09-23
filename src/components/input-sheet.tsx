import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Pressable, Text, TextInput, View } from 'react-native';

import { CategoryIcon } from '@/components/ui/category-icon';
import { Icon } from '@/components/ui/icon';
import { Sheet } from '@/components/ui/sheet';
import { frequentCategoryIds, listCategories, type CategoryRow } from '@/db/repo/categories';
import { insertTransaction } from '@/db/repo/transactions';
import { notifyDbChanged, useDbQuery } from '@/db/use-db-query';
import { categoryColor, categoryIcon, categoryName } from '@/features/categories/present';
import { useActiveWallet } from '@/features/wallets/use-active-wallet';
import { toDateString } from '@/lib/date';
import { useMoneyFormat } from '@/lib/money';
import { useInputSheet } from '@/stores/input-sheet-store';
import { usePalette } from '@/theme/use-palette';

type Kind = 'expense' | 'income';

/** Nominal paling banyak 11 digit (ratusan miliar rupiah), seperti di prototipe. */
const MAX_DIGITS = 11;
const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '000', '0', 'back'];

// BottomSheetTextInput memakai API TextInput yang tidak ada di react-native-web.
const NoteInput = Platform.OS === 'web' ? TextInput : BottomSheetTextInput;

/** Lembar input transaksi dari tombol tambah di tengah bottom bar. */
export function InputSheet() {
  const { open, session, hide } = useInputSheet();
  return (
    <Sheet open={open} onClose={hide}>
      <InputForm key={session} onDone={hide} />
    </Sheet>
  );
}

function InputForm({ onDone }: { onDone: () => void }) {
  const money = useMoneyFormat();
  const { t } = useTranslation();
  const c = usePalette();
  const db = useSQLiteContext();
  const { wallet } = useActiveWallet();

  const [kind, setKind] = useState<Kind>('expense');
  const [amount, setAmount] = useState('');
  const [chosenId, setChosenId] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [subOpen, setSubOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const type = kind === 'expense' ? 'out' : 'in';
  const all = useDbQuery((d) => listCategories(d, type), [type]) ?? [];
  const frequent = useDbQuery((d) => frequentCategoryIds(d, type), [type]) ?? [];
  const byId = Object.fromEntries(all.map((c) => [c.id, c]));
  const mains = all.filter((c) => !c.parent_id);
  // Lima tersering 60 hari terakhir, sisanya diisi urutan bawaan kategori.
  const top = [...frequent.filter((id) => byId[id]), ...mains.map((c) => c.id)]
    .filter((id, i, arr) => arr.indexOf(id) === i)
    .slice(0, 5);

  const category: CategoryRow | undefined = byId[chosenId ?? top[0] ?? ''];
  const main = category?.parent_id ? byId[category.parent_id] : category;
  const subs = main ? all.filter((c) => c.parent_id === main.id) : [];
  const chips = !main || top.includes(main.id) ? top : [main.id, ...top.slice(0, 4)];
  const name = (cat: CategoryRow) => categoryName(t, cat.id, cat.name);
  const short = (cat: CategoryRow) => categoryName(t, cat.id, cat.name, true);
  const iconOf = (cat: CategoryRow) =>
    categoryIcon(cat.icon ?? (cat.parent_id ? byId[cat.parent_id]?.icon : null));
  const colorOf = (cat: CategoryRow) =>
    categoryColor(cat.color_bg ?? (cat.parent_id ? byId[cat.parent_id]?.color_bg : null));
  const setCategoryId = setChosenId;

  const switchKind = (next: Kind) => {
    setKind(next);
    setChosenId(null);
  };

  const press = (key: string) => {
    setError('');
    if (key === 'back') return setAmount((a) => a.slice(0, -1));
    setAmount((a) => {
      if (a === '' && (key === '0' || key === '000')) return a;
      return (a + key).length <= MAX_DIGITS ? a + key : a;
    });
  };

  const save = async () => {
    const value = Number(amount);
    if (!value) {
      setError(t('INPUT.EMPTY_AMOUNT'));
      return;
    }
    if (!wallet || !category || saving) return;
    setSaving(true);
    await insertTransaction(db, {
      walletId: wallet.id,
      categoryId: category.id,
      type,
      amount: value,
      note: note.trim(),
      date: toDateString(),
    });
    notifyDbChanged();
    onDone();
  };

  return (
    <View className="pt-1">
      {/* Keluar / Masuk */}
      <View className="flex-row rounded-pill bg-key p-[3px]">
        {(['expense', 'income'] as const).map((k) => {
          const on = kind === k;
          return (
            <Pressable
              key={k}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              onPress={() => switchKind(k)}
              className={`flex-1 items-center rounded-pill py-2 ${on ? 'bg-surface' : ''}`}
            >
              <Text
                className={`text-[13.5px] leading-[19px] ${
                  on
                    ? `font-semibold ${k === 'expense' ? 'text-expense' : 'text-income'}`
                    : 'font-medium text-muted'
                }`}
              >
                {t(k === 'expense' ? 'INPUT.OUT' : 'INPUT.IN')}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Nominal */}
      <Text className="mt-3.5 text-center text-[12.5px] text-muted">{t('INPUT.AMOUNT')}</Text>
      <View
        className="mt-0.5 flex-row items-baseline justify-center"
        accessibilityLiveRegion="polite"
      >
        <Text className="mr-1 font-display-sb text-lg text-muted">Rp</Text>
        <Text
          className="font-display text-4xl leading-[50px] text-text"
          style={{ fontVariant: ['tabular-nums'] }}
        >
          {amount ? money.amount(Number(amount)) : '0'}
        </Text>
      </View>
      <Text
        accessibilityRole="alert"
        className="min-h-[18px] text-center text-[12.5px] text-expense"
      >
        {error}
      </Text>

      {/* Kategori tersering dan Semua */}
      <View className="-mx-1 mt-1.5 flex-row gap-0.5">
        {chips.map((id) => {
          const cat = byId[id];
          if (!cat) return null;
          const on = main?.id === id;
          return (
            <Pressable
              key={id}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              accessibilityLabel={name(cat)}
              onPress={() => setCategoryId(id)}
              className="min-w-0 flex-1 items-center gap-[5px] rounded-xl py-1"
            >
              <View>
                <CategoryIcon name={iconOf(cat)} color={colorOf(cat)} />
                {/* Cincin pilihan 2 px, berjarak 2 px dari lingkaran. */}
                <View
                  className={`absolute -inset-1 rounded-full border-2 ${on ? 'border-primary' : 'border-transparent'}`}
                />
              </View>
              <Text
                numberOfLines={1}
                className={`px-0.5 text-[11px] leading-[15px] ${on ? 'font-semibold text-text' : 'font-medium text-muted'}`}
              >
                {short(cat)}
              </Text>
            </Pressable>
          );
        })}
        {/* Daftar semua kategori belum dibuat. */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('INPUT.ALL_CATEGORIES_LABEL')}
          className="min-w-0 flex-1 items-center gap-[5px] rounded-xl py-1"
        >
          <View className="h-10 w-10 items-center justify-center rounded-full bg-key">
            <Icon name="grid" color={c.muted} size={19} />
          </View>
          <Text numberOfLines={1} className="text-[11px] font-medium leading-[15px] text-muted">
            {t('INPUT.ALL_CATEGORIES')}
          </Text>
        </Pressable>
      </View>

      {/* Catatan. Tidak terkontrol: value yang dikontrol di dalam lembar membuat huruf hilang. */}
      <NoteInput
        accessibilityLabel={t('INPUT.NOTE_LABEL')}
        placeholder={t(
          kind === 'expense' ? 'INPUT.NOTE_PLACEHOLDER_OUT' : 'INPUT.NOTE_PLACEHOLDER_IN',
        )}
        placeholderTextColor={c.muted}
        onChangeText={setNote}
        maxLength={60}
        style={{
          marginTop: 14,
          backgroundColor: c.surface,
          borderColor: c.line,
          borderWidth: 1,
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 11,
          fontSize: 14,
          color: c.text,
        }}
      />

      {/* Tanggal, subkategori, foto struk */}
      <View className="mt-2 flex-row flex-wrap gap-2">
        {/* Pemilih tanggal belum dibuat: selalu hari ini. */}
        <Pill
          icon="calendar"
          label={t('COMMON.TODAY')}
          a11y={t('INPUT.DATE_LABEL', { date: t('COMMON.TODAY') })}
          on
        />
        {main && subs.length ? (
          <Pill
            label={category?.parent_id ? name(category) : t('INPUT.SUB')}
            trailing="chevD"
            on={!!category?.parent_id}
            a11y={t('INPUT.SUB_LABEL', { category: main ? name(main) : '' })}
            onPress={() => setSubOpen(true)}
          />
        ) : null}
        {/* Foto struk belum dibuat. */}
        <Pill icon="camera" a11y={t('INPUT.PHOTO')} />
      </View>

      {/* Keypad */}
      <View className="mt-2.5 flex-row flex-wrap justify-between gap-y-1.5">
        {KEYS.map((key) => (
          <Pressable
            key={key}
            accessibilityRole="button"
            accessibilityLabel={key === 'back' ? t('INPUT.DELETE_DIGIT') : key}
            onPress={() => press(key)}
            className="h-11 items-center justify-center rounded-xl bg-key active:bg-primary-soft"
            style={{ width: '32.2%' }}
          >
            {key === 'back' ? (
              <Icon name="back" color={c.text} size={24} />
            ) : (
              <Text className={`${key === '000' ? 'text-base' : 'text-[22px]'} text-text`}>
                {key}
              </Text>
            )}
          </Pressable>
        ))}
      </View>

      <View className="mt-3 flex-row gap-2.5">
        <Pressable
          accessibilityRole="button"
          onPress={onDone}
          className="w-24 items-center rounded-pill bg-key py-[13px] active:opacity-80"
        >
          <Text className="text-[15px] font-medium leading-[21px] text-text">
            {t('COMMON.CANCEL')}
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={save}
          className="flex-1 items-center rounded-pill bg-primary py-[13px] active:opacity-90"
        >
          <Text className="text-[15px] font-medium leading-[21px] text-on-primary">
            {t('INPUT.SAVE')}
          </Text>
        </Pressable>
      </View>

      <Sheet
        open={subOpen}
        onClose={() => setSubOpen(false)}
        stack="push"
        title={t('INPUT.SUB_TITLE', { category: main ? name(main) : '' })}
      >
        {(main ? [main, ...subs] : []).map((cat) => {
          const on = cat.id === category?.id;
          return (
            <Pressable
              key={cat.id}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              onPress={() => {
                setCategoryId(cat.id);
                setSubOpen(false);
              }}
              className="-mx-5 flex-row items-center gap-3 px-5 py-3 active:bg-key"
            >
              <Text className="flex-1 text-[15px] text-text">
                {cat.id === main?.id ? t('INPUT.SUB_NONE') : name(cat)}
              </Text>
              {on ? <Icon name="check" color={c.primary} size={22} /> : null}
            </Pressable>
          );
        })}
      </Sheet>
    </View>
  );
}

function Pill({
  icon,
  label,
  trailing,
  on,
  a11y,
  onPress,
}: {
  icon?: 'calendar' | 'camera';
  label?: string;
  trailing?: 'chevD';
  /** Terisi: latar hijau lembut. Kosong: bergaris tipis. */
  on?: boolean;
  a11y: string;
  onPress?: () => void;
}) {
  const c = usePalette();
  const color = on ? c['primary-ink'] : c.muted;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={a11y}
      onPress={onPress}
      className={`flex-row items-center gap-1.5 rounded-lg px-[11px] py-[9px] active:opacity-70 ${
        on ? 'bg-primary-soft' : 'border border-line bg-surface'
      }`}
    >
      {icon ? <Icon name={icon} color={color} size={16} /> : null}
      {label ? (
        <Text className="text-[13px] font-medium leading-[18px]" style={{ color }}>
          {label}
        </Text>
      ) : null}
      {trailing ? <Icon name={trailing} color={color} size={14} /> : null}
    </Pressable>
  );
}
