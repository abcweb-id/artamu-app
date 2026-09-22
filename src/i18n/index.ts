import { getLocales } from 'expo-localization';
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './en.json';
import id from './id.json';

export const resources = {
  id: { translation: id },
  // satisfies: kunci yang ada di id.json tapi lupa diterjemahkan membuat typecheck gagal.
  en: { translation: en satisfies typeof id },
} as const;

export type Language = keyof typeof resources;

/** Bahasa perangkat Indonesia memakai id, selain itu en. Nanti bisa diganti di Pengaturan. */
export function deviceLanguage(): Language {
  return getLocales()[0]?.languageCode === 'id' ? 'id' : 'en';
}

const i18n = createInstance();

i18n.use(initReactI18next).init({
  resources,
  lng: deviceLanguage(),
  fallbackLng: 'id',
  interpolation: { escapeValue: false },
});

export default i18n;
