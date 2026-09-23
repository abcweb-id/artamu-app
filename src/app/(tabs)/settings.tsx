import Constants from 'expo-constants';
import { router } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';

import { Screen } from '@/components/screen';
import { TAB_SCROLL_BOTTOM_PADDING } from '@/components/tab-bar';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { ListRow } from '@/components/ui/list-row';
import { RadioRow } from '@/components/ui/radio-row';
import { ScreenTitle } from '@/components/ui/screen-title';
import { SectionLabel } from '@/components/ui/section-label';
import { Sheet } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { countMainCategories } from '@/db/repo/categories';
import { useDbQuery } from '@/db/use-db-query';
import { useActiveWallet } from '@/features/wallets/use-active-wallet';
import { deviceLanguage } from '@/i18n';
import { authenticateWithBiometrics, canUseBiometrics } from '@/lib/biometrics';
import { useAppStore } from '@/stores/app-store';
import {
  useSettingsStore,
  type AutoLockSetting,
  type LanguageSetting,
} from '@/stores/settings-store';
import { usePalette } from '@/theme/use-palette';

const LANGUAGE_NAMES = { id: 'Bahasa Indonesia', en: 'English' } as const;
const AUTO_LOCK_OPTIONS: AutoLockSetting[] = ['IMMEDIATE', '1M', '5M', '15M'];

/** Contoh format angka dan tanggal (hari ini) tiap bahasa, dihitung dengan format yang sama dengan aplikasi. */
function formatSample(lang: 'id' | 'en') {
  const locale = lang === 'id' ? 'id-ID' : 'en-US';
  const amount = new Intl.NumberFormat(locale).format(1_250_000);
  const date = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());
  return `Rp ${amount}, ${date}`;
}

/** Ponsel punya sidik jari terdaftar. Diperiksa sekali saat layar dibuka. */
function useBiometricAvailable() {
  const [available, setAvailable] = useState(false);
  useEffect(() => {
    let active = true;
    canUseBiometrics().then((ok) => active && setAvailable(ok));
    return () => {
      active = false;
    };
  }, []);
  return available;
}

export default function Settings() {
  const { t } = useTranslation();
  const c = usePalette();
  const settings = useSettingsStore();
  const biometricEnabled = useAppStore((s) => s.biometricEnabled);
  const setBiometricEnabled = useAppStore((s) => s.setBiometricEnabled);
  const lock = useAppStore((s) => s.lock);
  const { wallets } = useActiveWallet();
  const biometricAvailable = useBiometricAvailable();
  const [sheet, setSheet] = useState<'language' | 'autoLock' | null>(null);

  // Sakelar menunjukkan tampilan yang sedang dipakai, termasuk saat masih "ikuti sistem".
  const dark = useColorScheme().colorScheme === 'dark';
  const currentLanguage = settings.language === 'system' ? deviceLanguage() : settings.language;
  const mainCategories = useDbQuery(countMainCategories, []) ?? 0;
  const version = Constants.expoConfig?.version ?? '';

  const toggleBiometric = async (on: boolean) => {
    if (!on) return setBiometricEnabled(false);
    const ok = await authenticateWithBiometrics(t('BIOMETRIC_OFFER.PROMPT'), t('COMMON.CANCEL'));
    if (ok) setBiometricEnabled(true);
  };

  return (
    <Screen pageTitle={t('TABS.SETTINGS')}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: TAB_SCROLL_BOTTOM_PADDING }}
      >
        <ScreenTitle>{t('TABS.SETTINGS')}</ScreenTitle>

        <SectionLabel first>{t('SETTINGS.APPEARANCE')}</SectionLabel>
        {/* Pilihan warna tema belum dibuat. */}
        <ListRow
          icon="drop"
          title={t('SETTINGS.THEME_COLOR')}
          onPress={() => {}}
          right={
            <View className="flex-row items-center gap-1.5">
              {/* Titik warna tema yang sedang dipakai. */}
              <View className="h-3.5 w-3.5 rounded-full bg-primary" />
              <Text className="text-[13px] text-muted">{t('SETTINGS.THEME_BRAND')}</Text>
              <Icon name="chevR" color={c.muted} size={17} />
            </View>
          }
        />
        <ListRow
          icon="moon"
          title={t('SETTINGS.DARK_MODE')}
          right={
            <Switch
              label={t('SETTINGS.DARK_MODE')}
              value={dark}
              onChange={(on) => settings.set({ colorScheme: on ? 'dark' : 'light' })}
            />
          }
        />
        <ListRow
          icon="globe"
          title={t('SETTINGS.LANGUAGE')}
          value={LANGUAGE_NAMES[currentLanguage]}
          onPress={() => setSheet('language')}
        />

        <SectionLabel>{t('SETTINGS.SECURITY')}</SectionLabel>
        <ListRow
          icon="lock"
          title={t('SETTINGS.PIN_LOCK')}
          right={
            <Switch
              label={t('SETTINGS.PIN_LOCK')}
              value={settings.pinEnabled}
              onChange={(on) => settings.set({ pinEnabled: on })}
            />
          }
        />
        <ListRow
          icon="finger"
          title={t('SETTINGS.BIOMETRIC')}
          subtitle={biometricAvailable ? undefined : t('SETTINGS.BIOMETRIC_UNAVAILABLE')}
          right={
            <Switch
              label={t('SETTINGS.BIOMETRIC')}
              value={biometricEnabled}
              disabled={!biometricAvailable && !biometricEnabled}
              onChange={toggleBiometric}
            />
          }
        />
        <ListRow
          icon="clock"
          title={t('SETTINGS.AUTO_LOCK')}
          value={t(`SETTINGS.AUTO_LOCK_OPTIONS.${settings.autoLock}`)}
          onPress={() => setSheet('autoLock')}
        />
        <ListRow
          icon="lock"
          title={t('SETTINGS.CHANGE_PIN')}
          onPress={() => router.push('/change-pin')}
        />

        <SectionLabel>{t('SETTINGS.RECORDS')}</SectionLabel>
        {/* Kelola kategori, kelola dompet, dan jam pengingat belum dibuat. */}
        <ListRow
          icon="tag"
          title={t('SETTINGS.CATEGORIES')}
          value={String(mainCategories)}
          onPress={() => {}}
        />
        <ListRow
          icon="wallet"
          title={t('SETTINGS.WALLETS')}
          value={String(wallets.length)}
          onPress={() => {}}
        />
        <ListRow
          icon="bell"
          title={t('SETTINGS.DAILY_REMINDER')}
          subtitle={t('SETTINGS.DAILY_REMINDER_HINT', { time: settings.reminderTime })}
          right={
            <Switch
              label={t('SETTINGS.DAILY_REMINDER')}
              value={settings.dailyReminder}
              onChange={(on) => settings.set({ dailyReminder: on })}
            />
          }
        />
        <ListRow
          icon="repeat"
          title={t('SETTINGS.BILL_NOTIFICATIONS')}
          subtitle={t('SETTINGS.BILL_NOTIFICATIONS_HINT')}
          right={
            <Switch
              label={t('SETTINGS.BILL_NOTIFICATIONS')}
              value={settings.billNotifications}
              onChange={(on) => settings.set({ billNotifications: on })}
            />
          }
        />

        <SectionLabel>{t('SETTINGS.DATA')}</SectionLabel>
        {/* Ekspor CSV dan cadangan belum dibuat. */}
        <ListRow icon="download" title={t('SETTINGS.EXPORT')} onPress={() => {}} />
        <ListRow
          icon="upload"
          title={t('SETTINGS.BACKUP')}
          subtitle={t('SETTINGS.BACKUP_NEVER')}
          onPress={() => {}}
        />

        <SectionLabel>{t('SETTINGS.OTHER')}</SectionLabel>
        {/* Bantuan dan Tentang belum dibuat. */}
        <ListRow icon="bell" title={t('SETTINGS.HELP')} onPress={() => {}} />
        <ListRow
          icon="check"
          title={t('SETTINGS.ABOUT')}
          value={t('SETTINGS.VERSION', { version })}
          onPress={() => {}}
        />

        <Button
          label={t('SETTINGS.LOCK_NOW')}
          className="mt-5"
          disabled={!settings.pinEnabled}
          onPress={lock}
        />
      </ScrollView>

      <Sheet
        open={sheet === 'language'}
        onClose={() => setSheet(null)}
        title={t('SETTINGS.LANGUAGE')}
      >
        <Text className="-mt-1.5 mb-1.5 text-[12.5px] text-muted">
          {t('SETTINGS.LANGUAGE_SUBTITLE')}
        </Text>
        {(['system', 'id', 'en'] as LanguageSetting[]).map((lang) => (
          <RadioRow
            key={lang}
            label={lang === 'system' ? t('SETTINGS.LANGUAGE_SYSTEM') : LANGUAGE_NAMES[lang]}
            hint={
              lang === 'system'
                ? t('SETTINGS.LANGUAGE_SYSTEM_HINT', { language: LANGUAGE_NAMES[deviceLanguage()] })
                : formatSample(lang)
            }
            selected={settings.language === lang}
            onPress={() => {
              settings.set({ language: lang });
              setSheet(null);
            }}
          />
        ))}
        <Text className="mt-2.5 text-[12.5px] text-muted">{t('SETTINGS.LANGUAGE_NOTE')}</Text>
      </Sheet>

      <Sheet
        open={sheet === 'autoLock'}
        onClose={() => setSheet(null)}
        title={t('SETTINGS.AUTO_LOCK')}
      >
        <Text className="-mt-1.5 mb-1.5 text-[12.5px] text-muted">
          {t('SETTINGS.AUTO_LOCK_SUBTITLE')}
        </Text>
        <View>
          {AUTO_LOCK_OPTIONS.map((option) => (
            <RadioRow
              key={option}
              label={t(`SETTINGS.AUTO_LOCK_OPTIONS.${option}`)}
              selected={settings.autoLock === option}
              onPress={() => {
                settings.set({ autoLock: option });
                setSheet(null);
              }}
            />
          ))}
        </View>
      </Sheet>
    </Screen>
  );
}
