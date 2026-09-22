import { View } from 'react-native';

import { usePalette } from '@/theme/use-palette';

import { Icon, type IconName } from './icon';

type IconMarkProps = {
  name: IconName;
  /** danger: latar merah untuk PIN terkunci. */
  tone?: 'primary' | 'danger';
};

/** Lingkaran 60 px dengan ikon 30 px di kepala layar onboarding dan PIN. */
export function IconMark({ name, tone = 'primary' }: IconMarkProps) {
  const c = usePalette();
  return (
    <View
      className={`h-[60px] w-[60px] items-center justify-center rounded-full ${
        tone === 'danger' ? 'bg-expense' : 'bg-primary'
      }`}>
      <Icon name={name} color={c['on-primary']} size={30} />
    </View>
  );
}
