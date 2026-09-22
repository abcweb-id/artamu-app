import { useTranslation } from 'react-i18next';

import { Placeholder } from '@/components/placeholder';

export default function Lock() {
  const { t } = useTranslation();
  return <Placeholder title={t('lock.title')} />;
}
