import { View } from 'react-native';

import { usePalette } from '@/theme/use-palette';

import { Icon, type IconName } from './icon';

type IconBadgeProps = {
  name: IconName;
  /** Diameter lingkaran. Ukuran ikon ikut menyesuaikan. */
  size?: number;
};

/** Ikon di dalam lingkaran hijau lembut, seperti poin fitur di layar Pertama kali buka. */
export function IconBadge({ name, size = 42 }: IconBadgeProps) {
  const c = usePalette();
  return (
    <View
      className="items-center justify-center rounded-full bg-primary-soft"
      style={{ width: size, height: size }}
    >
      <Icon name={name} color={c['primary-ink']} size={Math.round(size / 2)} />
    </View>
  );
}
