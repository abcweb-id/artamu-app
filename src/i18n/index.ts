import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

import id from './id.json';

const i18n = createInstance();

// Bahasa Inggris menyusul lewat en.json, dipilih dari expo-localization dan tabel settings.
i18n.use(initReactI18next).init({
  resources: { id: { translation: id } },
  lng: 'id',
  fallbackLng: 'id',
  interpolation: { escapeValue: false },
});

export default i18n;
