import 'i18next';

import type id from './id.json';

// Kunci t('...') diperiksa terhadap id.json: salah ketik kunci gagal di typecheck.
declare module 'i18next' {
  interface CustomTypeOptions {
    resources: { translation: typeof id };
  }
}
