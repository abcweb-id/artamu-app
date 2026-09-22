import { useTranslation } from 'react-i18next';

import { Placeholder } from '@/components/placeholder';

export default function Account() {
  const { t } = useTranslation();
  return <Placeholder title={t('TABS.ACCOUNT')} />;
}
