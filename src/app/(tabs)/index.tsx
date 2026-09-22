import { useTranslation } from 'react-i18next';

import { Placeholder } from '@/components/placeholder';

export default function Home() {
  const { t } = useTranslation();
  return <Placeholder title={t('tabs.home')} />;
}
