import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState, type ReactNode } from 'react';

import { hasPin, loadPinLockedUntil } from '@/lib/pin';
import { useAppStore } from '@/stores/app-store';
import { useOnboardingStore } from '@/stores/onboarding-store';
import {
  AUTO_LOCK_MS,
  useSettingsStore,
  type AutoLockSetting,
  type ColorSchemeSetting,
  type LanguageSetting,
} from '@/stores/settings-store';

import { loadSettings, saveSettings } from './repo/settings';

const pad = (n: number) => String(n).padStart(2, '0');
const autoLockFromSeconds = (s: unknown): AutoLockSetting =>
  (Object.entries(AUTO_LOCK_MS).find(
    ([, ms]) => ms === Number(s) * 1000,
  )?.[0] as AutoLockSetting) ?? '1M';

/** Isi store dari tabel settings dan penyimpanan aman. */
async function hydrate(db: Parameters<typeof loadSettings>[0]) {
  const [s, pinSaved, lockedUntil] = await Promise.all([
    loadSettings(db),
    hasPin(),
    loadPinLockedUntil(),
  ]);
  const reminder = (s.daily_reminder ?? { on: true, h: 20, m: 0 }) as {
    on: boolean;
    h: number;
    m: number;
  };

  useSettingsStore.setState({
    language: (s.language as LanguageSetting) ?? 'system',
    colorScheme: (s.theme_mode as ColorSchemeSetting) ?? 'system',
    autoLock: autoLockFromSeconds(s.auto_lock ?? 60),
    dailyReminder: reminder.on,
    reminderTime: `${pad(reminder.h)}.${pad(reminder.m)}`,
    pinEnabled: (s.pin_enabled as boolean) ?? true,
    billNotifications: (s.bill_notifications as boolean) ?? true,
  });

  const onboarded = s.onboarded === true;
  useAppStore.setState({
    onboarded,
    hasPin: pinSaved,
    // Aplikasi dibuka lagi: minta PIN (Layar pembuka, lalu Masukkan PIN).
    locked: onboarded && pinSaved && useSettingsStore.getState().pinEnabled,
    biometricEnabled: s.biometric === true,
    activeWalletId: (s.active_wallet as string) ?? null,
    hideBalance: s.hide_balance === true,
    dismissedHints: (s.dismissed_hints as string[]) ?? [],
    lockedUntil: lockedUntil && lockedUntil > Date.now() ? lockedUntil : null,
  });
  useOnboardingStore.setState({ nickname: (s.nickname as string) ?? '' });
}

/** Simpan perubahan store ke tabel settings. Mengembalikan fungsi untuk berhenti. */
function persist(db: Parameters<typeof saveSettings>[0]) {
  const offSettings = useSettingsStore.subscribe((s, prev) => {
    const patch: Record<string, unknown> = {};
    if (s.language !== prev.language) patch.language = s.language;
    if (s.colorScheme !== prev.colorScheme) patch.theme_mode = s.colorScheme;
    if (s.autoLock !== prev.autoLock) patch.auto_lock = AUTO_LOCK_MS[s.autoLock] / 1000;
    if (s.pinEnabled !== prev.pinEnabled) patch.pin_enabled = s.pinEnabled;
    if (s.billNotifications !== prev.billNotifications)
      patch.bill_notifications = s.billNotifications;
    if (s.dailyReminder !== prev.dailyReminder || s.reminderTime !== prev.reminderTime) {
      const [h, m] = s.reminderTime.split('.').map(Number);
      patch.daily_reminder = { on: s.dailyReminder, h, m };
    }
    if (Object.keys(patch).length) saveSettings(db, patch);
  });
  const offApp = useAppStore.subscribe((s, prev) => {
    const patch: Record<string, unknown> = {};
    if (s.onboarded !== prev.onboarded) patch.onboarded = s.onboarded;
    if (s.biometricEnabled !== prev.biometricEnabled) patch.biometric = s.biometricEnabled;
    if (s.activeWalletId !== prev.activeWalletId) patch.active_wallet = s.activeWalletId;
    if (s.hideBalance !== prev.hideBalance) patch.hide_balance = s.hideBalance;
    if (s.dismissedHints !== prev.dismissedHints) patch.dismissed_hints = s.dismissedHints;
    if (Object.keys(patch).length) saveSettings(db, patch);
  });
  return () => {
    offSettings();
    offApp();
  };
}

/**
 * Setelah database terbuka: muat pengaturan dan status PIN, baru tampilkan aplikasi.
 * Setelah itu setiap perubahan pengaturan disimpan ke database.
 */
export function AppBootstrap({ children }: { children: ReactNode }) {
  const db = useSQLiteContext();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let stop: (() => void) | undefined;
    let active = true;
    hydrate(db).then(() => {
      if (!active) return;
      stop = persist(db);
      setReady(true);
    });
    return () => {
      active = false;
      stop?.();
    };
  }, [db]);

  return ready ? children : null;
}
