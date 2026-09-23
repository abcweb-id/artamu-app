import { create } from 'zustand';

export type ColorSchemeSetting = 'system' | 'light' | 'dark';
export type LanguageSetting = 'system' | 'id' | 'en';
export type AutoLockSetting = 'IMMEDIATE' | '1M' | '5M' | '15M';

/** Lama aplikasi boleh ditinggalkan sebelum meminta PIN lagi. */
export const AUTO_LOCK_MS: Record<AutoLockSetting, number> = {
  IMMEDIATE: 0,
  '1M': 60_000,
  '5M': 300_000,
  '15M': 900_000,
};

type SettingsState = {
  colorScheme: ColorSchemeSetting;
  language: LanguageSetting;
  /** Kunci dengan PIN. Kalau mati, aplikasi tidak pernah meminta PIN. */
  pinEnabled: boolean;
  autoLock: AutoLockSetting;
  dailyReminder: boolean;
  /** Jam pengingat harian, "HH.MM". */
  reminderTime: string;
  billNotifications: boolean;
  set: (patch: Partial<Omit<SettingsState, 'set' | 'reset'>>) => void;
  reset: () => void;
};

const initialState = {
  colorScheme: 'system' as ColorSchemeSetting,
  language: 'system' as LanguageSetting,
  pinEnabled: true,
  autoLock: '1M' as AutoLockSetting,
  dailyReminder: true,
  reminderTime: '20.00',
  billNotifications: true,
};

/** Pengaturan pengguna. Sementara di memori; nanti disimpan di tabel settings. */
export const useSettingsStore = create<SettingsState>((set) => ({
  ...initialState,
  set: (patch) => set(patch),
  reset: () => set(initialState),
}));
