import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';

import { Button } from '@/components/ui/button';
import { ListRow } from '@/components/ui/list-row';
import { Sheet } from '@/components/ui/sheet';
import { WipeSheet } from '@/features/data/wipe-sheet';
import { authenticateWithBiometrics } from '@/lib/biometrics';
import { useAppStore } from '@/stores/app-store';

type ForgotPinSheetsProps = { open: boolean; onClose: () => void };

/** Lembar Lupa PIN; pilihan hapus data membuka lembar konfirmasi bersama (WipeSheet). */
export function ForgotPinSheets({ open, onClose }: ForgotPinSheetsProps) {
  const { t } = useTranslation();
  const biometricEnabled = useAppStore((s) => s.biometricEnabled);
  const [wipeOpen, setWipeOpen] = useState(false);

  const useBiometric = async () => {
    const ok = await authenticateWithBiometrics(t('FORGOT_PIN.PROMPT'), t('COMMON.CANCEL'));
    if (!ok) return;
    onClose();
    router.push('/reset-pin');
  };

  const openWipe = () => {
    onClose();
    setWipeOpen(true);
  };

  return (
    <>
      <Sheet open={open} onClose={onClose} title={t('FORGOT_PIN.TITLE')}>
        <Text className="mb-1.5 text-sm leading-[21px] text-text">{t('FORGOT_PIN.BODY')}</Text>
        {biometricEnabled ? (
          <ListRow
            icon="finger"
            title={t('FORGOT_PIN.BIOMETRIC')}
            subtitle={t('FORGOT_PIN.BIOMETRIC_HINT')}
            onPress={useBiometric}
          />
        ) : null}
        <ListRow
          icon="trash"
          tone="danger"
          title={t('FORGOT_PIN.WIPE')}
          subtitle={t('FORGOT_PIN.WIPE_HINT')}
          onPress={openWipe}
        />
        <Button variant="secondary" label={t('COMMON.CANCEL')} className="mt-3" onPress={onClose} />
      </Sheet>

      <WipeSheet open={wipeOpen} onClose={() => setWipeOpen(false)} />
    </>
  );
}
