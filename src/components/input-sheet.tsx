import { useTranslation } from 'react-i18next';

import { useInputSheet } from '@/stores/input-sheet-store';

import { Sheet } from './ui/sheet';

/** Lembar input transaksi. Isinya dikerjakan di tahap Input transaksi. */
export function InputSheet() {
  const { t } = useTranslation();
  const { open, hide } = useInputSheet();
  return (
    <Sheet open={open} onClose={hide} title={t('SHEET.NEW_TRANSACTION')}>
      {null}
    </Sheet>
  );
}
